# IoT Integration Guide for Ai-CivicLens

This guide explains how to connect ESP32-CAM or other IoT devices to the Ai-CivicLens server.

## API Endpoint
**URL**: `POST /api/iot/report`  
(e.g., `https://aiciviclens.netlify.app/api/iot/report`)

### Request Format
Send a JSON POST request with the following body:

```json
{
  "deviceId": "CAM-001",
  "location": {
    "lat": 17.3850,
    "lng": 78.4867
  },
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..." 
}
```
*Note: The `image` field must be a valid Base64 Data URI string.*

### Response
```json
{
  "success": true,
  "reportId": "report_doc_id",
  "analysis": {
    "issueType": "Pothole",
    "severity": "High",
    "aiDescription": "Large pothole detected on asphalt road."
  }
}
```

---

## ESP32 Reference Implementation (Arduino C++)

**Dependencies**: `ArduinoJson`, `HTTPClient`, `Base64` (e.g., by bogus, or custom implementation).

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "esp_camera.h"
#include "base64.h" // You need a Base64 library

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://YOUR_PC_IP:9002/api/iot/report"; 

void captureAndSend() {
  camera_fb_t * fb = esp_camera_fb_get();
  if(!fb) {
    Serial.println("Camera capture failed");
    return;
  }

  // Convert to Base64
  String base64Image = base64::encode(fb->buf, fb->len);
  String imageDataUri = "data:image/jpeg;base64," + base64Image;

  // JSON Body
  StaticJsonDocument<20000> doc; // Adjust size for image
  doc["deviceId"] = "ESP32-CAM-01";
  doc["image"] = imageDataUri;
  
  JsonObject location = doc.createNestedObject("location");
  location["lat"] = 17.1234; // Replace with GPS module data
  location["lng"] = 78.5678;

  String jsonBody;
  serializeJson(doc, jsonBody);

  // Send POST
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
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
  esp_camera_fb_return(fb); 
}
```
