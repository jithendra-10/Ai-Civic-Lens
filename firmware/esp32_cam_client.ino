#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "esp_camera.h"
#include "base64.h" // Requires 'Base64' library, or use built-in if available (e.g., mbedtls)

// ==========================================
// CONFIGURATION
// ==========================================
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Replace with your PC's IP address (e.g., 192.168.1.5)
// IMPORTANT: Use HTTP, not HTTPS unless you configure SSL
const char* serverUrl = "http://YOUR_PC_IP:3000/api/iot/report"; 

const char* deviceId = "ESP32-CAM-001";
const double latitude = 17.3850; // Mock location (Hyderabad)
const double longitude = 78.4867;

// ==========================================
// CAMERA PINS (AI-Thinker Model)
// ==========================================
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

void setupCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  if(psramFound()){
    config.frame_size = FRAMESIZE_VGA; // 640x480
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_QVGA; // 320x240
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

  // Camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println();

  setupCamera();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  
  // Optional: Turn on Flash LED to indicate start
  pinMode(4, OUTPUT);
  digitalWrite(4, LOW); // Usually logic-inverted or needs specific control, let's keep it simple
}

void captureAndSend() {
  camera_fb_t * fb = esp_camera_fb_get();
  if(!fb) {
    Serial.println("Camera capture failed");
    return;
  }

  Serial.printf("Picture taken! Size: %d bytes\n", fb->len);

  // 1. Encode Image to Base64
  // We use the 'base64' library. If not available, use mbedtls_base64_encode
  String base64Image = base64::encode(fb->buf, fb->len);
  String imageDataUri = "data:image/jpeg;base64," + base64Image;

  // 2. Prepare JSON Payload
  // Use DynamicJsonDocument for heap allocation (image is large)
  // Calculate size: ~30KB image * 1.33 base64 factor = ~40KB string
  // Plus JSON overhead. Allocate generously.
  // ESP32 with PSRAM has plenty.
  
  // NOTE: ArduinoJson might struggle with huge strings in limited RAM.
  // Ensure you use a board with PSRAM enabled in tools menu.
  DynamicJsonDocument doc(50000); 

  doc["deviceId"] = deviceId;
  doc["image"] = imageDataUri; // This copies the string! Might run OOM without PSRAM.

  JsonObject location = doc.createNestedObject("location");
  location["lat"] = latitude;
  location["lng"] = longitude;

  String jsonBody;
  serializeJson(doc, jsonBody);

  // 3. Send HTTP POST
  if(WiFi.status() == WL_CONNECTED){
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    Serial.println("Sending data...");
    int httpResponseCode = http.POST(jsonBody);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }

  esp_camera_fb_return(fb); 
}

void loop() {
  // Capture image every 30 seconds
  captureAndSend();
  delay(30000);
}
