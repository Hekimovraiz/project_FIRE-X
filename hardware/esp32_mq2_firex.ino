#include <WiFi.h>

// ─── HOTSPOT MƏLUMATLARI ─────────────────────────────────────────
const char* ssid     = "Redmi Note 14S";       
const char* password = "raiz20101";   
// (Əgər noutbukun hotspotuna qoşsanız: ssid = "Murat's Magicbook", password = "31cibaba")

// ─── PİN TƏYİNATLARI ───────────────────────────────────────────
const int mq2Pin    = 34;       // MQ-2 AO (GPIO 34) 
const int mq4Pin    = 35;       // MQ-4 AO (GPIO 35) 
const int irPin     = 25;       // IR Alov Sensoru DO (GPIO 25) 
const int buzzerPin = 23;       // Buzzer (GPIO 23)

// ─── HƏSSASLIQ HƏDLƏRİ ──────────────────────────────────────────
const int mq2Threshold = 550;   
const int mq4Threshold = 3500;  

bool soundEnabled = true; 
unsigned long lastSerialPrint = 0;

WiFiServer server(80);

void setup() {
  Serial.begin(115200);
  pinMode(buzzerPin, OUTPUT);
  pinMode(irPin, INPUT);
  
  pinMode(mq2Pin, INPUT);
  pinMode(mq4Pin, INPUT);
  
  digitalWrite(buzzerPin, LOW);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Wi-Fi-a qoşulur");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // Qoşulduğu Hotspot-un (Redmi Note 14S və ya Noutbuk) öz alt-şəbəkəsində Sabit .120 IP-sini təyin edir
  // (Məs: Noutbukda 192.168.137.120, Redmi Note 14S-də isə telefonun öz şəbəkəsində xxx.xxx.xxx.120)
  IPAddress gw = WiFi.gatewayIP();
  IPAddress sub = WiFi.subnetMask();
  IPAddress local_ip(gw[0], gw[1], gw[2], 120);
  if (WiFi.localIP() != local_ip) {
    WiFi.config(local_ip, gw, sub, IPAddress(8, 8, 8, 8));
  }

  Serial.println("\n----------------------------------------");
  Serial.println("Wi-Fi uğurla qoşuldu!");
  Serial.print("SABİT IP ÜNVANI: http://");
  Serial.println(WiFi.localIP());
  Serial.println("----------------------------------------");

  server.begin();
}

void loop() {
  int mq2Value = analogRead(mq2Pin);
  int mq4Value = analogRead(mq4Pin);
  int irState = digitalRead(irPin); 
  bool irFlameDetected = (irState == LOW);

  bool danger = (mq2Value > mq2Threshold) || (mq4Value > mq4Threshold) || irFlameDetected;

  if (danger && soundEnabled) {
    digitalWrite(buzzerPin, HIGH);
  } else {
    digitalWrite(buzzerPin, LOW);
  }

  // Hər 1 saniyədən bir Serial Monitor-da da göstər
  if (millis() - lastSerialPrint >= 1000) {
    lastSerialPrint = millis();
    Serial.print("[FIRE-X] IP: ");
    Serial.print(WiFi.localIP());
    Serial.print(" | MQ-2: ");
    Serial.print(mq2Value);
    Serial.print(" | MQ-4: ");
    Serial.print(mq4Value);
    Serial.print(" | Alov: ");
    Serial.println(irFlameDetected ? "VAR" : "YOX");
  }

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
            client.println("Content-type:text/html; charset=utf-8");
            client.println("Access-Control-Allow-Origin: *");
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
              client.println("<p style='color:red; font-weight:bold; font-size:20px;'>⚠️ TƏHLÜKƏ MÜƏYYƏN EDİLDİ!</p>");
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
