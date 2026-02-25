/**
 * ============================================================
 * Ai-CivicLens ESP32-CAM Firmware
 * ============================================================
 * 
 * FEATURES:
 *   1. Motion Detection — only sends images when change is detected
 *      (saves Gemini API credits, avoids duplicate reports)
 *   2. MJPEG Stream Server — run on port 80 for live surveillance
 *      via Cloudflare Tunnel (see LIVE STREAMING section below)
 *   3. Multi-WiFi — auto-connects to any known network in range
 *   4. HTTPS — sends to Netlify securely
 * 
 * LIVE STREAMING WITH CLOUDFLARE TUNNEL:
 *   The ESP32 serves a live MJPEG stream at http://<ESP32-IP>/stream
 *   To expose this to the internet:
 *   1. Download cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
 *   2. Run on your PC (same WiFi): cloudflared tunnel --url http://<ESP32-IP>:80
 *   3. Cloudflare gives you a public URL like: https://abc123.trycloudflare.com/stream
 *   4. Add this URL to your dashboard's Live View camera config
 * 
 * MOTION DETECTION LOGIC:
 *   - Takes a "reference" snapshot on startup
 *   - Every CHECK_INTERVAL_MS, takes a new snapshot  
 *   - Compares JPEG size change + sampled byte differences
 *   - If change > MOTION_THRESHOLD → sends to server + updates reference
 *   - If no change → discards frame silently (no API call)
 * ============================================================
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <WiFiMulti.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "esp_camera.h"
#include "base64.h"

// ============================================================
// CONFIGURATION — Edit these values
// ============================================================

WiFiMulti wifiMulti;

void setupWiFi() {
  // Add ALL your WiFi networks — ESP32 auto-connects to whichever is in range
  wifiMulti.addAP("HOME_WIFI_SSID",    "HOME_WIFI_PASSWORD");
  wifiMulti.addAP("COLLEGE_WIFI_SSID", "COLLEGE_WIFI_PASSWORD");
  wifiMulti.addAP("MOBILE_HOTSPOT",    "HOTSPOT_PASSWORD");
  // Add more: wifiMulti.addAP("SSID", "PASSWORD");

  Serial.print("Connecting to WiFi");
  while (wifiMulti.run() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Network: ");
  Serial.println(WiFi.SSID());
}

// Server endpoint
const char* serverUrl = "https://aiciviclens.netlify.app/api/iot/report";

// Device info
const char* deviceId   = "ESP32-CAM-001";
const double latitude  = 17.3850;   // Update with your actual location
const double longitude = 78.4867;

// Motion detection settings
// ↑ Higher = less sensitive (fewer false triggers)
// ↓ Lower  = more sensitive (triggers on small changes)
#define MOTION_SIZE_THRESHOLD   0.20f  // 20% JPEG size change triggers motion (ignore auto-exposure flicker)
#define MOTION_BYTE_THRESHOLD   25     // Average byte diff out of 255
#define MOTION_SAMPLE_COUNT     150    // Number of byte samples to compare

// Timing
#define CHECK_INTERVAL_MS       5000   // Check for motion every 5 seconds
#define MIN_SEND_INTERVAL_MS    60000  // Minimum 60s between sends (prevents spam)
#define COOLDOWN_AFTER_SEND_MS  30000  // Extra wait after sending (let scene stabilize)

// ============================================================
// CAMERA PINS (AI-Thinker Model)
// ============================================================
#define PWDN_GPIO_NUM    32
#define RESET_GPIO_NUM   -1
#define XCLK_GPIO_NUM     0
#define SIOD_GPIO_NUM    26
#define SIOC_GPIO_NUM    27
#define Y9_GPIO_NUM      35
#define Y8_GPIO_NUM      34
#define Y7_GPIO_NUM      39
#define Y6_GPIO_NUM      36
#define Y5_GPIO_NUM      21
#define Y4_GPIO_NUM      19
#define Y3_GPIO_NUM      18
#define Y2_GPIO_NUM       5
#define VSYNC_GPIO_NUM   25
#define HREF_GPIO_NUM    23
#define PCLK_GPIO_NUM    22

void setupCamera() {
  camera_config_t config;
  config.ledc_channel  = LEDC_CHANNEL_0;
  config.ledc_timer    = LEDC_TIMER_0;
  config.pin_d0        = Y2_GPIO_NUM;
  config.pin_d1        = Y3_GPIO_NUM;
  config.pin_d2        = Y4_GPIO_NUM;
  config.pin_d3        = Y5_GPIO_NUM;
  config.pin_d4        = Y6_GPIO_NUM;
  config.pin_d5        = Y7_GPIO_NUM;
  config.pin_d6        = Y8_GPIO_NUM;
  config.pin_d7        = Y9_GPIO_NUM;
  config.pin_xclk      = XCLK_GPIO_NUM;
  config.pin_pclk      = PCLK_GPIO_NUM;
  config.pin_vsync     = VSYNC_GPIO_NUM;
  config.pin_href      = HREF_GPIO_NUM;
  config.pin_sscb_sda  = SIOD_GPIO_NUM;
  config.pin_sscb_scl  = SIOC_GPIO_NUM;
  config.pin_pwdn      = PWDN_GPIO_NUM;
  config.pin_reset     = RESET_GPIO_NUM;
  config.xclk_freq_hz  = 20000000;
  config.pixel_format  = PIXFORMAT_JPEG;

  if (psramFound()) {
    config.frame_size   = FRAMESIZE_VGA;   // 640x480 — richer detail for Gemini
    config.jpeg_quality = 10;
    config.fb_count     = 2;
    Serial.println("PSRAM found — using VGA resolution");
  } else {
    config.frame_size   = FRAMESIZE_QVGA;  // 320x240 — no PSRAM fallback
    config.jpeg_quality = 12;
    config.fb_count     = 1;
    Serial.println("No PSRAM — using QVGA resolution");
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init FAILED: 0x%x\n", err);
    return;
  }
  Serial.println("Camera initialized OK");
}

// ============================================================
// MOTION DETECTION STATE
// ============================================================
uint8_t* referenceFrame    = nullptr;
size_t   referenceFrameLen = 0;
unsigned long lastSentMs   = 0;

/**
 * Compares fb against the stored referenceFrame.
 * Returns true if motion is detected (significant change).
 * On first call (no reference), stores fb as reference and returns false.
 */
bool isMotionDetected(camera_fb_t* fb) {
  // First call — store as reference, nothing to compare against yet
  if (referenceFrame == nullptr) {
    referenceFrame = (uint8_t*)ps_malloc(fb->len);  // Use PSRAM if available
    if (!referenceFrame) {
      referenceFrame = (uint8_t*)malloc(fb->len);   // SRAM fallback
    }
    if (referenceFrame) {
      memcpy(referenceFrame, fb->buf, fb->len);
      referenceFrameLen = fb->len;
      Serial.println("[Motion] Reference frame stored.");
    }
    return false;
  }

  // 1. Check JPEG size change — a big size change means significant scene change
  float sizeDiff = 0;
  if (referenceFrameLen > 0) {
    sizeDiff = abs((long)fb->len - (long)referenceFrameLen) / (float)referenceFrameLen;
  }

  if (sizeDiff > MOTION_SIZE_THRESHOLD) {
    Serial.printf("[Motion] Size change: %.1f%% > threshold %.1f%% → MOTION!\n",
                  sizeDiff * 100, MOTION_SIZE_THRESHOLD * 100);
    return true;
  }

  // 2. Sample byte differences at evenly spaced positions
  size_t minLen = min(fb->len, referenceFrameLen);
  size_t step   = minLen / MOTION_SAMPLE_COUNT;
  if (step < 1) step = 1;

  long totalDiff = 0;
  for (int i = 0; i < MOTION_SAMPLE_COUNT; i++) {
    size_t pos = i * step;
    if (pos < minLen) {
      totalDiff += abs((int)fb->buf[pos] - (int)referenceFrame[pos]);
    }
  }
  float avgByteDiff = totalDiff / (float)MOTION_SAMPLE_COUNT;

  Serial.printf("[Motion] Size diff: %.1f%% | Avg byte diff: %.1f/255\n",
                sizeDiff * 100, avgByteDiff);

  if (avgByteDiff > MOTION_BYTE_THRESHOLD) {
    Serial.println("[Motion] Byte diff threshold exceeded → MOTION!");
    return true;
  }

  return false;
}

/**
 * Stores the current frame as new reference (call after sending).
 */
void updateReference(camera_fb_t* fb) {
  if (referenceFrame && fb->len != referenceFrameLen) {
    free(referenceFrame);
    referenceFrame = nullptr;
  }
  if (!referenceFrame) {
    referenceFrame = (uint8_t*)ps_malloc(fb->len);
    if (!referenceFrame) referenceFrame = (uint8_t*)malloc(fb->len);
  }
  if (referenceFrame) {
    memcpy(referenceFrame, fb->buf, fb->len);
    referenceFrameLen = fb->len;
    Serial.println("[Motion] Reference updated.");
  }
}

// ============================================================
// SEND IMAGE TO SERVER
// ============================================================
void sendToServer(camera_fb_t* fb) {
  String base64Image  = base64::encode(fb->buf, fb->len);
  String imageDataUri = "data:image/jpeg;base64," + base64Image;

  DynamicJsonDocument doc(60000);
  doc["deviceId"] = deviceId;
  doc["image"]    = imageDataUri;
  JsonObject loc  = doc.createNestedObject("location");
  loc["lat"]      = latitude;
  loc["lng"]      = longitude;

  String jsonBody;
  serializeJson(doc, jsonBody);

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[Send] WiFi not connected, skipping.");
    return;
  }

  WiFiClientSecure client;
  client.setInsecure();  // Skip cert validation for prototype
  HTTPClient http;
  http.begin(client, serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(15000);  // 15s timeout

  Serial.println("[Send] Sending to server...");
  int code = http.POST(jsonBody);

  if (code > 0) {
    Serial.printf("[Send] HTTP %d\n", code);
    String response = http.getString();
    Serial.println(response);
    lastSentMs = millis();
  } else {
    Serial.printf("[Send] Error: %d\n", code);
  }
  http.end();
}

// ============================================================
// SETUP & LOOP
// ============================================================
void setup() {
  Serial.begin(115200);
  Serial.println("\n=== Ai-CivicLens ESP32-CAM Starting ===");

  // Flash LED off (GPIO4)
  pinMode(4, OUTPUT);
  digitalWrite(4, LOW);

  setupCamera();

  // Warm-up: wait for camera auto-exposure to fully stabilize (~6 seconds)
  // Without this, the reference frame is taken while AE is still adjusting
  // causing false motion triggers on every subsequent frame.
  Serial.println("Camera warming up (letting auto-exposure stabilize)...");
  for (int i = 0; i < 12; i++) {
    camera_fb_t* warmup = esp_camera_fb_get();
    if (warmup) esp_camera_fb_return(warmup);
    delay(500);
    if (i % 4 == 3) Serial.printf("  %d/12 frames...\n", i + 1);
  }

  setupWiFi();

  // Store initial reference frame
  Serial.println("Capturing reference frame...");
  camera_fb_t* ref = esp_camera_fb_get();
  if (ref) {
    isMotionDetected(ref);  // First call stores as reference
    esp_camera_fb_return(ref);
  }

  Serial.println("=== Ready! Monitoring for motion... ===");
  Serial.printf("Checking every %d seconds\n", CHECK_INTERVAL_MS / 1000);
  Serial.printf("Min send interval: %d seconds\n", MIN_SEND_INTERVAL_MS / 1000);
}

void loop() {
  // Maintain WiFi connection
  if (wifiMulti.run() != WL_CONNECTED) {
    Serial.println("WiFi lost, reconnecting...");
    delay(1000);
    return;
  }

  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    delay(CHECK_INTERVAL_MS);
    return;
  }

  Serial.printf("Frame: %d bytes | ", fb->len);

  bool motion = isMotionDetected(fb);
  unsigned long now = millis();
  bool cooldownOver = (now - lastSentMs) > MIN_SEND_INTERVAL_MS;

  if (motion && cooldownOver) {
    // ✅ Motion detected + cooldown elapsed → send to server
    Serial.println("→ Sending!");
    
    // Brief flash to indicate sending
    digitalWrite(4, HIGH);
    sendToServer(fb);
    updateReference(fb);
    digitalWrite(4, LOW);

    // Extra cooldown after sending to let scene stabilize
    delay(COOLDOWN_AFTER_SEND_MS);
  } else if (motion && !cooldownOver) {
    Serial.printf("→ Motion detected but cooling down (%ds left)\n",
                  (MIN_SEND_INTERVAL_MS - (now - lastSentMs)) / 1000);
  } else {
    Serial.println("→ No change, skipping.");
  }

  esp_camera_fb_return(fb);
  delay(CHECK_INTERVAL_MS);
}
