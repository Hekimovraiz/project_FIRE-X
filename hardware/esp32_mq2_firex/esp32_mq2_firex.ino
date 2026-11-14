/*
  FIRE-X NASA Microgravity Combustion Intel Platform
  ESP32 + MQ-2 + MQ-4 + IR Flame + Active Buzzer Firmware
  - Local Web Panel on Port 80 (http://<ESP32_IP>/)
  - Real-time HTTP POST Telemetry to FIRE-X Backend (192.168.0.171:8000)
*/

#include <WiFi.h>
#include <HTTPClient.h>

// ─── WI-FI CREDENTIALS ──────────────────────────────────────────
const char* ssid     = "Hüseyn";
const char* password = "196419661995a";

// ─── FIRE-X BACKEND SERVER (Laptop IPv4: 192.168.0.171) ──────────
const char* SERVER_URL = "http://192.168.0.171:8000/api/sensor-data";

// ─── PIN DEFINITIONS ───────────────────────────────────────────
const int mq2Pin    = 34;  // MQ-2 AO (GPIO 34)
const int mq4Pin    = 35;  // MQ-4 AO (GPIO 35)
const int irPin     = 25;  // IR Alov Sensoru DO (GPIO 25)
const int buzzerPin = 23;  // Buzzer (GPIO 23)

const int mq2Threshold = 400;
const int mq4Threshold = 3400;

bool soundEnabled = true;

unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL_MS = 1500;

WiFiServer server(80);

void setup() {
  Serial.begin(115200);
  pinMode(buzzerPin, OUTPUT);
  pinMode(irPin, INPUT);
  digitalWrite(buzzerPin, LOW);

  analogSetAttenuation(ADC_11db);

  WiFi.begin(ssid, password);
  Serial.print("Wi-Fi qoşulur");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWi-Fi uğurla qoşuldu!");
  Serial.print("ESP32 IP Ünvanı: http://");
  Serial.println(WiFi.localIP());
  Serial.print("FIRE-X Server URL: ");
  Serial.println(SERVER_URL);

  server.begin();
}

void loop() {
  int mq2Value = analogRead(mq2Pin);
  int mq4Value = analogRead(mq4Pin);
  int irState  = digitalRead(irPin);
  bool irFlameDetected = (irState == LOW);

  bool danger = (mq2Value > mq2Threshold) || (mq4Value > mq4Threshold) || irFlameDetected;

  if (danger && soundEnabled) {
    digitalWrite(buzzerPin, HIGH);
  } else {
    digitalWrite(buzzerPin, LOW);
  }

  // ─── 1. FIRE-X BACKEND-Ə CANLI TELEMETRİYA GÖNDƏR (1.5 san) ───
  if (millis() - lastSendTime >= SEND_INTERVAL_MS && WiFi.status() == WL_CONNECTED) {
    lastSendTime = millis();

    float gasPPM = map(mq2Value, 150, 2500, 20, 1000);
    if (gasPPM < 10.0) gasPPM = 15.0 + (mq2Value * 0.05);
    float smokeDensityPct = (mq2Value / 4095.0) * 100.0;

    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(1500);

    String jsonStr = "{";
    jsonStr += "\"device_id\":\"ESP32-FIREX-01\",";
    jsonStr += "\"raw_smoke_adc\":" + String(mq2Value) + ",";
    jsonStr += "\"mq4_adc\":" + String(mq4Value) + ",";
    jsonStr += "\"ir_flame_detected\":" + String(irFlameDetected ? "true" : "false") + ",";
    jsonStr += "\"sound_enabled\":" + String(soundEnabled ? "true" : "false") + ",";
    jsonStr += "\"esp32_ip\":\"" + WiFi.localIP().toString() + "\",";
    jsonStr += "\"gas_ppm\":" + String(gasPPM, 1) + ",";
    jsonStr += "\"smoke_density_pct\":" + String(smokeDensityPct, 1) + ",";
    jsonStr += "\"ambient_temp_c\":23.5,";
    jsonStr += "\"estimated_o2_pct\":20.9,";
    jsonStr += "\"simulated\":false";
    jsonStr += "}";

    int httpCode = http.POST(jsonStr);
    if (httpCode > 0) {
      String resp = http.getString();
      Serial.printf("[FIRE-X HTTP %d] MQ2:%d | MQ4:%d | IR:%s\n",
                    httpCode, mq2Value, mq4Value, irFlameDetected ? "ALOV" : "OK");

      // Saytdan buzzer düyməsi sıxılıbsa, ESP32-də dərhal tətbiq et
      if (resp.indexOf("\"set_sound\":false") != -1) {
        soundEnabled = false;
      } else if (resp.indexOf("\"set_sound\":true") != -1) {
        soundEnabled = true;
      }
    } else {
      Serial.printf("[FIRE-X HTTP ERROR] %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
  }

  // ─── 2. ESP32 LOKAL VEB PANELİ (PORT 80) ───────────────────────
  WiFiClient client = server.available();
  if (client) {
    String currentLine = "";
    String requestHeader = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        requestHeader += c;
        if (c == '\n') {
          if (currentLine.length() == 0) {
            if (requestHeader.indexOf("GET /sound/on") != -1) {
              soundEnabled = true;
            } else if (requestHeader.indexOf("GET /sound/off") != -1) {
              soundEnabled = false;
            }

            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();

            client.println("<!DOCTYPE html><html><head><meta charset='UTF-8'>");
            client.println("<meta name='viewport' content='width=device-width, initial-scale=1'>");
            client.println("<title>FIRE-X Monitorinq Paneli</title>");
            client.println("<style>");
            client.println("body{font-family:Arial; text-align:center; background:#f4f4f9; margin-top:20px;}");
            client.println(".card{background:white; padding:20px; border-radius:10px; display:inline-block; box-shadow:0px 0px 10px rgba(0,0,0,0.1); max-width:400px; width:100%;}");
            client.println(".val{font-size:28px; font-weight:bold; color:#007BFF;}");
            client.println(".btn{background:#dc3545; color:white; padding:12px 20px; border:none; border-radius:5px; font-size:16px; cursor:pointer; margin:10px; text-decoration:none; display:inline-block;}");
            client.println(".btn-on{background:#28a745;}");
            client.println("</style>");
            client.println("<meta http-equiv='refresh' content='2'>");
            client.println("</head><body>");

            client.println("<div class='card'>");
            client.println("<h2>FIRE-X Təhlükəsizlik</h2>");

            client.println("<p><b>MQ-2 Tüstü Dəyəri:</b><br><span class='val'>" + String(mq2Value) + "</span></p>");
            client.println("<p><b>MQ-4 Metan Dəyəri:</b><br><span class='val'>" + String(mq4Value) + "</span></p>");

            if (irFlameDetected) {
              client.println("<p style='color:red; font-weight:bold; font-size:18px;'>🔥 IR Alov Aşkarlandı!</p>");
            } else {
              client.println("<p style='color:green; font-weight:bold;'>IR Alov: Normal (Gözləmədə)</p>");
            }

            if (danger) {
              client.println("<p style='color:red; font-weight:bold; font-size:20px;'>⚠️ TƏHLÜKƏ MÜYYƏN EDİLDİ!</p>");
            } else {
              client.println("<p style='color:green; font-weight:bold;'>Status: Hər şey qaydasındadır</p>");
            }

            client.println("<hr>");
            client.println("<h3>Təhlükə Zamanı Səs Rejimi</h3>");
            if (soundEnabled) {
              client.println("<p style='color:green; font-weight:bold;'>Səs: Açıqdır (Xəbərdarlıq edəcək)</p>");
              client.println("<a href='/sound/off' class='btn'>Təhlükə Səsini Bağla</a>");
            } else {
              client.println("<p style='color:orange; font-weight:bold;'>Səs: Səssiz rejimdədir</p>");
              client.println("<a href='/sound/on' class='btn btn-on'>Təhlükə Səsini Aç</a>");
            }

            client.println("</div></body></html>");
            break;
          } else {
            currentLine = "";
          }
        } else if (c != '\r') {
          currentLine += c;
        }
      }
    }
    client.stop();
  }
}
