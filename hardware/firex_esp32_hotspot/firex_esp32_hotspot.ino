/*
  FIRE-X — ESP32 + MQ-2 + MQ-4 + IR Alov + Buzzer
  Kompüterin Windows Mobile Hotspot-u üçün (192.168.137.x şəbəkəsi)

  Endpoint-lər:
    GET /           → insan üçün HTML panel
    GET /data       → FIRE-X saytı üçün JSON: {"mq2":..,"mq4":..,"flame":..,"sound":..,"danger":..}
    GET /sound/on   → səsi aç  (JSON qaytarır)
    GET /sound/off  → səsi bağla (JSON qaytarır)
    GET /buzzer/test → sireni 3 saniyə çaldırır (naqil/buzzer yoxlaması)

  Həyəcan məntiqi: qaz/alov aşkarlananda buzzer ALARM_DURATION_MS (5 san.) çalır
  və susur. Təhlükə bitəndən sonra (dəyərlər həddən aşağı düşəndə) yeni təhlükə
  yenidən 5 saniyəlik siren verir. Ayarlar aşağıda "HƏSSASLIQ" bölməsindədir.

  Serial (115200): hər saniyə bir sətir yazır, USB (COM) rejimi üçün:
    [FIRE-X] IP: 192.168.137.120 | MQ-2: 240 | MQ-4: 510 | Alov: YOX | Ses: ACIQ
*/

#include <WiFi.h>

// ─── HOTSPOT MƏLUMATLARI ─────────────────────────────────────────
// Wi-Fi adı və şifrəsi secrets.h faylındadır (git-ə düşmür).
// İlk dəfə: secrets.example.h faylını secrets.h adı ilə kopyalayın və doldurun.
// Windows: Settings → Mobile hotspot → Band = 2.4 GHz olmalıdır!
#include "secrets.h"
const char* ssid     = WIFI_SSID;
const char* password = WIFI_PASSWORD;

// ─── SABİT IP ────────────────────────────────────────────────────
// Sabit IP YALNIZ kompüterin Windows hotspotunda (192.168.137.x) işləyir.
// Telefon hotspotunda (Redmi və s.) şəbəkə fərqlidir (məs. 10.148.190.x) —
// orada sabit IP ESP32-ni əlçatmaz edir. Default: DHCP (false); FIRE-X
// backend-i ESP32-ni şəbəkədə özü tapır, IP həm də Serial-da görünür.
const bool USE_STATIC_IP = false;
IPAddress local_ip(192, 168, 137, 120);
IPAddress gateway(192, 168, 137, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);

// ─── PİNLƏR ──────────────────────────────────────────────────────
const int mq2Pin    = 34;   // ADC1 — Wi-Fi ilə işləyir
const int mq4Pin    = 35;   // ADC1 — Wi-Fi ilə işləyir
const int irPin     = 25;   // IR modulunun DO çıxışı (rəqəmsal)
const int buzzerPin = 23;

// ─── BUZZER NÖVÜ ─────────────────────────────────────────────────
// Passiv buzzer sabit HIGH ilə SƏS VERMİR — ona tezlik (PWM) lazımdır.
// tone() həm passiv, həm də aktiv buzzer-də səs çıxarır, ona görə default true.
// Aktiv buzzer-iniz tone() ilə xırıltılı səslənirsə, false edin.
const bool BUZZER_USE_TONE    = true;
// Yalnız BUZZER_USE_TONE=false olanda: "low level trigger" modul üçün true.
const bool BUZZER_ACTIVE_LOW  = false;

// ─── SİREN SƏSİ ──────────────────────────────────────────────────
// SIREN_BIIP  : qısa siren "biip" + fasilə, "biip" + fasilə — aramla yanıb-sönür (default)
// SIREN_WHOOP : səs aşağıdan yuxarı qalxır, kəsilir, yenə qalxır
// SIREN_WAIL  : səs fasiləsiz qalxıb-enir (polis / hava hücumu sireni)
// SIREN_HILO  : iki ton növbə ilə — "i-u, i-u" (təcili yardım sireni)
// SIREN_BEEP  : sadə bip-bip (sabit ton)
enum SirenStyle { SIREN_BIIP, SIREN_WHOOP, SIREN_WAIL, SIREN_HILO, SIREN_BEEP };
const SirenStyle SIREN_STYLE  = SIREN_BIIP;
const int SIREN_LOW_HZ        = 900;   // "biip"-in başladığı ton
const int SIREN_HIGH_HZ       = 1800;  // "biip"-in çatdığı ton
const unsigned long BIIP_ON_MS  = 350; // bir "biip"-in uzunluğu
const unsigned long BIIP_OFF_MS = 450; // "biip"-lər arasındakı sükut

// ─── HƏSSASLIQ / HƏYƏCAN AYARLARI ────────────────────────────────
// MQ sensorları mütləq ppm vermir: hər sensorun "təmiz hava" dəyəri fərqlidir və
// temperatur/rütubətlə sürüşür. Ona görə sabit hədd (məs. 400) yox, beynəlxalq
// praktikada olduğu kimi TƏMİZ HAVA FONUNA NİSBƏTƏN artım istifadə olunur:
//   təhlükə = dəyər > fon + RISE   (və ya dəyər > ABSOLUTE — həmişə təhlükə)
// Fon açılışda WARMUP_MS ərzində ölçülür, sonra yavaş-yavaş sürüşməni izləyir.
const int MQ2_RISE      = 250;    // MQ-2 fondan bu qədər qalxanda təhlükə (az → həssas, çox → az həssas)
const int MQ4_RISE      = 500;    // MQ-4 üçün eyni
const int MQ2_ABSOLUTE  = 1800;   // bu dəyərdən yuxarı fondan asılı olmayaraq təhlükə
const int MQ4_ABSOLUTE  = 3000;
const int MQ_HYSTERESIS = 60;     // təhlükənin bitməsi üçün dəyər həddən bu qədər AŞAĞI düşməlidir
const unsigned long WARMUP_MS = 60000;  // açılışdan sonra qızdırıcının isinmə müddəti: bu vaxt qaz həyəcanı verilmir
const float SMOOTH_ALPHA   = 0.2;    // hamarlaşdırma (0.1 → daha hamar, 0.5 → daha sürətli)
const float BASELINE_ALPHA = 0.002;  // fonun yavaş izlənməsi (təhlükə yoxkən)
const unsigned long GAS_CONFIRM_MS    = 200;   // qaz bu qədər müddət həddən yuxarı qalmalıdır (tək sıçrayışa reaksiya yoxdur)
const unsigned long FLAME_CONFIRM_MS  = 100;   // alov siqnalı bu qədər müddət davam etməlidir
const unsigned long CLEAR_CONFIRM_MS  = 1000;  // təhlükə bitdi sayılması üçün bu qədər müddət normal qalmalıdır
const unsigned long ALARM_DURATION_MS = 5000;  // hər yeni təhlükədə buzzer neçə ms çalsın (3000–5000 tövsiyə)
const unsigned long ALARM_REPEAT_MS   = 15000; // təhlükə davam edirsə 15 san.-dən bir yenidən 5 san. xəbərdar et (0 = təkrar yox)

// ─── IR ALOV SENSORUNUN MƏSAFƏSİ ─────────────────────────────────
// Məsafəni əsasən modulun üstündəki MAVİ POTENSİOMETR təyin edir.
// Daha uzaq/dəqiq aşkarlama üçün modulun AO (analoq) pinini GPIO 33-ə qoşub true edin:
// onda həddi proqramda özünüz seçirsiniz. GPIO 25 ADC2-dir — Wi-Fi işləyəndə analoq oxumur.
const bool IR_USE_ANALOG       = false;
const int  irAnalogPin         = 33;     // ADC1
const int  IR_ANALOG_THRESHOLD = 3200;   // AO bu dəyərdən AŞAĞI düşəndə alov sayılır (alov yaxınlaşdıqca AO azalır).
                                         // Serial-da "IR-AO" dəyərinə baxın: alovsuz dəyərdən bir az aşağı seçin → maksimum məsafə

bool soundEnabled = true;

int  mq2Value = 0;          // hamarlaşdırılmış dəyər
int  mq4Value = 0;
float mq2Smooth = -1, mq4Smooth = -1;
float mq2Base = 0, mq4Base = 0;        // təmiz hava fonu
unsigned long baseSamples = 0;
bool warmedUp = false;
int  mq2Threshold = 0, mq4Threshold = 0;  // cari (fona görə hesablanan) hədlər
int  irAnalogValue = 4095;
bool irFlameDetected = false;
bool gasAlarm = false;     // təsdiqlənmiş qaz təhlükəsi (histerezisli)
bool flameAlarm = false;   // təsdiqlənmiş alov təhlükəsi
bool danger = false;       // gasAlarm || flameAlarm — sayta da bu göndərilir

unsigned long gasAboveSince = 0, gasClearSince = 0;
unsigned long flameSince = 0, flameClearSince = 0;
unsigned long alarmUntil = 0;     // buzzer bu ana qədər çalır
unsigned long lastAlarmMs = 0;

bool buzzerOn = false;                 // pin hazırda səs verirmi
unsigned long buzzerTestUntil = 0;     // /buzzer/test üçün

const unsigned long CLIENT_TIMEOUT_MS = 1000;  // ilişib qalmamaq üçün
const unsigned long SERIAL_INTERVAL_MS = 1000;
unsigned long lastSerialMs = 0;
unsigned long lastWifiCheckMs = 0;

WiFiServer server(80);

// ─────────────────────────────────────────────────────────────────
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.setSleep(false);  // cavab gecikməsini azaldır
  if (USE_STATIC_IP && !WiFi.config(local_ip, gateway, subnet, primaryDNS)) {
    Serial.println("Sabit IP konfiqurasiyası xətası!");
  }
  WiFi.begin(ssid, password);
  Serial.print("Wi-Fi-a qoşulur");

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 20000) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("----------------------------------------");
    Serial.println("Wi-Fi uğurla qoşuldu!");
    Serial.print("IP ÜNVANI: http://");
    Serial.println(WiFi.localIP());
    Serial.println("----------------------------------------");
  } else {
    // 20 san. qoşula bilmədi — səbəbi göstər, sensorlar yenə də işləyir
    Serial.print("Wi-Fi qoşulmadı! status=");
    Serial.println(WiFi.status());
    Serial.println("Yoxlayın: hotspot 2.4 GHz-dirmi? SSID/şifrə düzdürmü?");
  }
}

void triggerAlarm(unsigned long now) {
  alarmUntil = now + ALARM_DURATION_MS;
  lastAlarmMs = now;
}

// Sensorları oxuyur və təhlükə vəziyyətini yeniləyir:
//  • tək sıçrayışa reaksiya vermir (CONFIRM), • həddə yaxın titrəyəndə dəfələrlə
//  işə düşmür (HYSTERESIS + CLEAR_CONFIRM), • hər YENİ təhlükədə buzzer 5 san. çalır.
// 16 ölçmənin ortası — ESP32 ADC küyünü azaldır
int readAvg(int pin) {
  long sum = 0;
  for (int i = 0; i < 16; i++) sum += analogRead(pin);
  return (int)(sum / 16);
}

void readSensors() {
  unsigned long now = millis();
  int raw2 = readAvg(mq2Pin);
  int raw4 = readAvg(mq4Pin);
  if (mq2Smooth < 0) { mq2Smooth = raw2; mq4Smooth = raw4; }
  mq2Smooth += SMOOTH_ALPHA * (raw2 - mq2Smooth);
  mq4Smooth += SMOOTH_ALPHA * (raw4 - mq4Smooth);
  mq2Value = (int)mq2Smooth;
  mq4Value = (int)mq4Smooth;

  // ── fon (baseline) ──
  if (!warmedUp) {
    baseSamples++;
    mq2Base += (mq2Smooth - mq2Base) / baseSamples;   // isinmə vaxtı sadə orta
    mq4Base += (mq4Smooth - mq4Base) / baseSamples;
    if (now >= WARMUP_MS) {
      warmedUp = true;
      Serial.printf("Fon kalibrlendi: MQ-2=%d MQ-4=%d\n", (int)mq2Base, (int)mq4Base);
    }
  } else if (!gasAlarm && mq2Value < mq2Threshold - MQ_HYSTERESIS && mq4Value < mq4Threshold - MQ_HYSTERESIS) {
    mq2Base += BASELINE_ALPHA * (mq2Smooth - mq2Base);  // yavaş sürüşməni izlə
    mq4Base += BASELINE_ALPHA * (mq4Smooth - mq4Base);
  }
  mq2Threshold = min((int)mq2Base + MQ2_RISE, MQ2_ABSOLUTE);
  mq4Threshold = min((int)mq4Base + MQ4_RISE, MQ4_ABSOLUTE);
  if (IR_USE_ANALOG) {
    irAnalogValue = analogRead(irAnalogPin);
    irFlameDetected = irAnalogValue < IR_ANALOG_THRESHOLD;
  } else {
    irFlameDetected = (digitalRead(irPin) == LOW);
  }

  // ── qaz ──
  bool gasAbove = warmedUp && ((mq2Value > mq2Threshold) || (mq4Value > mq4Threshold));
  bool gasClear = (mq2Value < mq2Threshold - MQ_HYSTERESIS) && (mq4Value < mq4Threshold - MQ_HYSTERESIS);
  if (gasAbove) {
    if (!gasAboveSince) gasAboveSince = now;
    if (!gasAlarm && now - gasAboveSince >= GAS_CONFIRM_MS) { gasAlarm = true; triggerAlarm(now); }
  } else {
    gasAboveSince = 0;
  }
  if (gasAlarm && gasClear) {
    if (!gasClearSince) gasClearSince = now;
    if (now - gasClearSince >= CLEAR_CONFIRM_MS) gasAlarm = false;
  } else {
    gasClearSince = 0;
  }

  // ── alov ──
  if (irFlameDetected) {
    flameClearSince = 0;
    if (!flameSince) flameSince = now;
    if (!flameAlarm && now - flameSince >= FLAME_CONFIRM_MS) { flameAlarm = true; triggerAlarm(now); }
  } else {
    flameSince = 0;
    if (flameAlarm) {
      if (!flameClearSince) flameClearSince = now;
      if (now - flameClearSince >= CLEAR_CONFIRM_MS) flameAlarm = false;
    }
  }

  danger = gasAlarm || flameAlarm;
  if (danger && ALARM_REPEAT_MS > 0 && now - lastAlarmMs >= ALARM_REPEAT_MS) triggerAlarm(now);
}

// freqHz = 0 → səssiz. Tezlik yalnız dəyişəndə yenilənir (tone() hər dövrədə çağırılmır).
int currentFreq = 0;
void setBuzzerFreq(int freqHz) {
  if (freqHz == currentFreq) return;
  currentFreq = freqHz;
  buzzerOn = freqHz > 0;
  if (BUZZER_USE_TONE) {
    if (freqHz > 0) tone(buzzerPin, freqHz);
    else            noTone(buzzerPin);
  } else {
    // Aktiv buzzer tonu dəyişə bilmir — yalnız açıb-söndürürük
    digitalWrite(buzzerPin, (buzzerOn != BUZZER_ACTIVE_LOW) ? HIGH : LOW);
  }
}
void setBuzzer(bool on) { setBuzzerFreq(on ? SIREN_HIGH_HZ : 0); }

// Siren səsinin "t" millisaniyəsindəki tezliyi (0 = sükut).
int sirenFreqAt(unsigned long t) {
  const int span = SIREN_HIGH_HZ - SIREN_LOW_HZ;
  switch (SIREN_STYLE) {
    case SIREN_BIIP: {                  // qısa qalxan "biip" + sükut
      unsigned long p = t % (BIIP_ON_MS + BIIP_OFF_MS);
      if (p >= BIIP_ON_MS) return 0;
      return SIREN_LOW_HZ + (int)((long)span * p / BIIP_ON_MS);
    }
    case SIREN_WHOOP: {                 // 550 ms qalxır + 200 ms sükut
      unsigned long p = t % 750;
      if (p >= 550) return 0;
      return SIREN_LOW_HZ + (int)((long)span * p / 550);
    }
    case SIREN_WAIL: {                  // 900 ms qalxır, 900 ms enir
      unsigned long p = t % 1800;
      unsigned long k = (p < 900) ? p : 1800 - p;
      return SIREN_LOW_HZ + (int)((long)span * k / 900);
    }
    case SIREN_HILO:                    // 450 ms yüksək, 450 ms aşağı
      return ((t / 450) % 2 == 0) ? SIREN_HIGH_HZ : SIREN_LOW_HZ + span / 3;
    case SIREN_BEEP:
    default:
      return ((t / 250) % 2 == 0) ? SIREN_HIGH_HZ : 0;
  }
}

// Yeni təhlükədən sonra ALARM_DURATION_MS boyunca siren çalır — bloklamır, hər ~12 ms tezlik yenilənir.
unsigned long sirenStartMs = 0;
unsigned long lastSirenStepMs = 0;
bool sirenActive = false;
void updateBuzzer() {
  unsigned long now = millis();
  bool want = (now < buzzerTestUntil) || (soundEnabled && now < alarmUntil);

  if (!want) { sirenActive = false; setBuzzerFreq(0); return; }
  if (!sirenActive) { sirenActive = true; sirenStartMs = now; lastSirenStepMs = 0; }
  if (now - lastSirenStepMs < 12) return;
  lastSirenStepMs = now;

  int f = sirenFreqAt(now - sirenStartMs);
  if (!BUZZER_USE_TONE && f > 0) f = SIREN_HIGH_HZ;  // aktiv buzzer: yalnız açıq/bağlı ritm
  // tezliyi 25 Hz addımla yuvarlaqlaşdır — tone()-u lazımsız çağırmamaq üçün
  setBuzzerFreq(f > 0 ? (f / 25) * 25 : 0);
}

String jsonState() {
  String j = "{\"mq2\":" + String(mq2Value) +
             ",\"mq4\":" + String(mq4Value) +
             ",\"flame\":" + String(irFlameDetected ? "true" : "false") +
             ",\"sound\":" + String(soundEnabled ? "true" : "false") +
             ",\"danger\":" + String(danger ? "true" : "false") +
             ",\"buzzer\":" + String(buzzerOn ? "true" : "false") +
             ",\"ir_ao\":" + String(IR_USE_ANALOG ? irAnalogValue : -1) +
             ",\"mq2_base\":" + String((int)mq2Base) + ",\"mq4_base\":" + String((int)mq4Base) +
             ",\"mq2_th\":" + String(mq2Threshold) + ",\"mq4_th\":" + String(mq4Threshold) +
             ",\"warmup\":" + String(warmedUp ? "false" : "true") +
             ",\"ip\":\"" + WiFi.localIP().toString() + "\"}";
  return j;
}

String htmlPage() {
  String h;
  h.reserve(2200);
  h += "<!DOCTYPE html><html><head><meta charset='UTF-8'>";
  h += "<meta name='viewport' content='width=device-width, initial-scale=1'>";
  h += "<meta http-equiv='refresh' content='2;url=/'>";
  h += "<title>FIRE-X Monitorinq Paneli</title><style>";
  h += "body{font-family:Arial;text-align:center;background:#f4f4f9;margin-top:20px;}";
  h += ".card{background:white;padding:20px;border-radius:10px;display:inline-block;box-shadow:0 0 10px rgba(0,0,0,.1);max-width:400px;width:100%;}";
  h += ".val{font-size:28px;font-weight:bold;color:#007BFF;}";
  h += ".btn{background:#dc3545;color:white;padding:12px 20px;border-radius:5px;font-size:16px;margin:10px;text-decoration:none;display:inline-block;}";
  h += ".btn-on{background:#28a745;}</style></head><body><div class='card'>";
  h += "<h2>FIRE-X Təhlükəsizlik</h2>";
  h += "<p><b>MQ-2 Tüstü Dəyəri:</b><br><span class='val'>" + String(mq2Value) + "</span></p>";
  h += "<p><b>MQ-4 Metan Dəyəri:</b><br><span class='val'>" + String(mq4Value) + "</span></p>";
  h += irFlameDetected
         ? "<p style='color:red;font-weight:bold;font-size:18px;'>🔥 IR Alov Aşkarlandı!</p>"
         : "<p style='color:green;font-weight:bold;'>IR Alov: Normal (Gözləmədə)</p>";
  h += danger
         ? "<p style='color:red;font-weight:bold;font-size:20px;'>⚠️ TƏHLÜKƏ MÜƏYYƏN EDİLDİ!</p>"
         : "<p style='color:green;font-weight:bold;'>Status: Hər şey qaydasındadır</p>";
  h += "<hr><h3>Təhlükə Zamanı Səs Rejimi</h3>";
  if (soundEnabled) {
    h += "<p style='color:green;font-weight:bold;'>Səs: Açıqdır (Xəbərdarlıq edəcək)</p>";
    h += "<a href='/sound/off?html=1' class='btn'>Təhlükə Səsini Bağla</a>";
  } else {
    h += "<p style='color:orange;font-weight:bold;'>Səs: Səssiz rejimdədir</p>";
    h += "<a href='/sound/on?html=1' class='btn btn-on'>Təhlükə Səsini Aç</a>";
  }
  h += "</div></body></html>";
  return h;
}

// Bütün cavabı bir dəfəyə göndərir (sətir-sətir println-dən xeyli sürətli)
void sendResponse(WiFiClient& client, int code, const char* type, const String& body) {
  String r;
  r.reserve(body.length() + 200);
  r += "HTTP/1.1 ";
  r += (code == 200) ? "200 OK" : (code == 302 ? "302 Found" : "404 Not Found");
  r += "\r\nContent-Type: ";
  r += type;
  r += "\r\nAccess-Control-Allow-Origin: *";
  r += "\r\nCache-Control: no-store";
  if (code == 302) r += "\r\nLocation: /";
  r += "\r\nContent-Length: " + String(body.length());
  r += "\r\nConnection: close\r\n\r\n";
  r += body;
  client.print(r);
}

void handleClient() {
  WiFiClient client = server.available();
  if (!client) return;

  client.setTimeout(CLIENT_TIMEOUT_MS);
  // Birinci sətir: "GET /data HTTP/1.1". Gəlməsə 1 san. sonra boş qayıdır.
  String req = client.readStringUntil('\n');

  // Qalan header-ləri at (maks. 1 san.)
  unsigned long start = millis();
  while (client.connected() && millis() - start < CLIENT_TIMEOUT_MS) {
    String line = client.readStringUntil('\n');
    if (line.length() <= 1) break;  // boş sətir ("\r") = header-lərin sonu
  }

  if (req.length() == 0) {  // brauzerin boş "preconnect" bağlantısı
    client.stop();
    return;
  }

  bool wantsHtml = req.indexOf("html=1") != -1;

  if (req.indexOf("GET /sound/on") != -1) {
    soundEnabled = true;
    readSensors();
    if (wantsHtml) sendResponse(client, 302, "text/html", "");
    else sendResponse(client, 200, "application/json", jsonState());
  } else if (req.indexOf("GET /sound/off") != -1) {
    soundEnabled = false;
    readSensors();
    if (wantsHtml) sendResponse(client, 302, "text/html", "");
    else sendResponse(client, 200, "application/json", jsonState());
  } else if (req.indexOf("GET /buzzer/test") != -1) {
    buzzerTestUntil = millis() + 3000;   // səs söndürülü olsa belə çalır
    sendResponse(client, 200, "application/json", jsonState());
  } else if (req.indexOf("GET /data") != -1) {
    sendResponse(client, 200, "application/json", jsonState());
  } else if (req.indexOf("GET / ") != -1 || req.indexOf("GET /?") != -1) {
    sendResponse(client, 200, "text/html; charset=utf-8", htmlPage());
  } else {
    sendResponse(client, 404, "text/plain", "Not found");  // favicon və s.
  }

  delay(1);
  client.stop();
}

void printSerialLine() {
  Serial.print("[FIRE-X] IP: ");
  Serial.print(WiFi.status() == WL_CONNECTED ? WiFi.localIP().toString() : String("0.0.0.0"));
  Serial.print(" | MQ-2: ");
  Serial.print(mq2Value);
  Serial.print(" | MQ-4: ");
  Serial.print(mq4Value);
  Serial.printf(" (fon %d/%d, hedd %d/%d%s)", (int)mq2Base, (int)mq4Base, mq2Threshold, mq4Threshold, warmedUp ? "" : ", ISINIR");
  Serial.print(" | Alov: ");
  Serial.print(irFlameDetected ? "VAR" : "YOX");
  if (IR_USE_ANALOG) { Serial.print(" | IR-AO: "); Serial.print(irAnalogValue); }
  Serial.print(" | Ses: ");
  Serial.print(soundEnabled ? "ACIQ" : "SESSIZ");
  Serial.print(" | Tehluke: ");
  Serial.print(danger ? "VAR" : "YOX");
  Serial.print(" | Buzzer: ");
  Serial.println(buzzerOn ? "CALIR" : "SUSUR");
}

void setup() {
  Serial.begin(115200);
  pinMode(buzzerPin, OUTPUT);
  pinMode(irPin, INPUT);
  if (IR_USE_ANALOG) pinMode(irAnalogPin, INPUT);
  digitalWrite(buzzerPin, (!BUZZER_USE_TONE && BUZZER_ACTIVE_LOW) ? HIGH : LOW);

  // Açılışda qısa "vuuup" səsi: buzzer və naqil işləyirsə, bunu eşitməlisiniz.
  for (int f = SIREN_LOW_HZ; f <= SIREN_HIGH_HZ; f += 50) { setBuzzerFreq(f); delay(8); }
  setBuzzerFreq(0);
  analogSetAttenuation(ADC_11db);  // 0–3.3V tam diapazon

  connectWiFi();
  server.begin();
}

void loop() {
  readSensors();
  updateBuzzer();
  handleClient();

  unsigned long now = millis();
  if (now - lastSerialMs >= SERIAL_INTERVAL_MS) {
    lastSerialMs = now;
    printSerialLine();
  }

  // Wi-Fi itərsə, hər 10 san. bir yenidən qoşulmağa çalış
  if (WiFi.status() != WL_CONNECTED && now - lastWifiCheckMs >= 10000) {
    lastWifiCheckMs = now;
    Serial.println("Wi-Fi itdi, yenidən qoşulur...");
    WiFi.disconnect();
    WiFi.reconnect();
  }
}
