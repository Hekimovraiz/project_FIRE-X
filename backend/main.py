"""
FIRE-X NASA Microgravity Combustion & Fire Safety API v2.1
Multi-page FastAPI backend with OpenAI Responses API integration.
"""

import os
import logging
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

from backend.data_service import (
    get_stats, query_experiments, get_experiment_by_id,
    compare_experiments, calculate_mission_scenario, get_investigation_rankings
)
from backend.ai_service import query_ai_assistant
from backend.nasa_combustion_engine import combustion_engine, MATERIAL_PROPERTIES

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('firex_api')

app = FastAPI(title='FIRE-X NASA API', version='2.2.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'], allow_credentials=True,
    allow_methods=['*'], allow_headers=['*'],
)




BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')
IMAGES_DIR = os.path.join(BASE_DIR, 'images')
HARDWARE_DIR = os.path.join(BASE_DIR, 'hardware')


# Pydantic Models
class CompareRequest(BaseModel):
    experiment_ids: List[str] = Field(..., min_length=1, max_length=4)

class MessageItem(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[MessageItem]
    language: str = 'en'
    page_context: Optional[Dict[str, Any]] = None

class AskAIRequest(BaseModel):
    prompt: str
    language: str = 'en'
    page_context: Optional[Dict[str, Any]] = None

class SensorDataPayload(BaseModel):
    device_id: str = "ESP32-FIREX-01"
    raw_smoke_adc: int = 180
    mq4_adc: Optional[int] = 0
    ir_flame_detected: Optional[bool] = False
    sound_enabled: Optional[bool] = True
    esp32_ip: Optional[str] = None
    gas_ppm: float = 45.0
    smoke_density_pct: float = 2.5
    ambient_temp_c: Optional[float] = 23.4
    estimated_o2_pct: Optional[float] = 20.9
    simulated: Optional[bool] = False
    device_danger: Optional[bool] = None  # ESP32's own verdict (auto-baseline firmware); overrides fixed thresholds

class SolidSpreadRequest(BaseModel):
    material: str = "PMMA (Cast Acrylic)"
    flow_velocity_cms: float = 8.0
    oxygen_pct: float = 21.0
    pressure_kpa: float = 101.3

class DropletExtinctionRequest(BaseModel):
    fuel: str = "n-Heptane Droplet"
    d0_mm: float = 2.5
    oxygen_pct: float = 21.0
    pressure_kpa: float = 101.3
    co2_pct: float = 0.0
    he_pct: float = 0.0

class TelemetryNodeBridgeRequest(BaseModel):
    gas_ppm: float = 45.0
    smoke_density_pct: float = 2.5
    raw_adc: int = 180
    nominal_o2_pct: float = 21.0
    nominal_pressure_kpa: float = 101.3
    target_material: str = "PMMA (Cast Acrylic)"


# API Routes
@app.get('/api/health')
def health_check():
    st = get_stats(lite=True)
    return {
        'status': 'healthy',
        'service': 'FIRE-X Space Science API',
        'version': '2.2.0',
        'canonical_records': st['total_experiments'],
        'psi_verified_records': st['psi_verified_experiments'],
        'disclaimer': 'FIRE-X Decision Support System — Empirical Analytics & Reference Tool (Non-Autonomic)'
    }

# ─────────────────────────────────────────────────────────────────────────────
# NASA MICROGRAVITY COMBUSTION ENGINE API (PSI-69, PSI-25, PSI-98)
# ─────────────────────────────────────────────────────────────────────────────
@app.get('/api/combustion/summary')
def get_combustion_engine_summary():
    try:
        return {'success': True, 'data': combustion_engine.get_dataset_summary()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/combustion/predict-solid-flame-spread')
def predict_solid_flame_spread_api(req: SolidSpreadRequest):
    try:
        result = combustion_engine.predict_solid_flame_spread(
            material=req.material,
            flow_velocity_cms=req.flow_velocity_cms,
            oxygen_pct=req.oxygen_pct,
            pressure_kpa=req.pressure_kpa
        )
        return {'success': True, 'data': result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/combustion/predict-droplet-extinction')
def predict_droplet_extinction_api(req: DropletExtinctionRequest):
    try:
        result = combustion_engine.predict_droplet_combustion(
            fuel=req.fuel,
            d0_mm=req.d0_mm,
            oxygen_pct=req.oxygen_pct,
            pressure_kpa=req.pressure_kpa,
            co2_pct=req.co2_pct,
            he_pct=req.he_pct
        )
        return {'success': True, 'data': result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/combustion/telemetry-node-bridge')
def telemetry_node_bridge_api(req: TelemetryNodeBridgeRequest):
    try:
        result = combustion_engine.process_physical_telemetry_node(
            gas_ppm=req.gas_ppm,
            smoke_density_pct=req.smoke_density_pct,
            raw_adc=req.raw_adc,
            nominal_o2_pct=req.nominal_o2_pct,
            nominal_pressure_kpa=req.nominal_pressure_kpa,
            target_material=req.target_material
        )
        return {'success': True, 'data': result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get('/api/stats')
def get_platform_stats(lite: bool = Query(False)):
    try:
        return {'success': True, 'data': get_stats(lite=lite)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/experiments')
def get_experiments(
    query: Optional[str] = Query(None), family: Optional[str] = Query(None),
    fuel: Optional[str] = Query(None), outcome: Optional[str] = Query(None),
    min_o2: Optional[float] = Query(None), max_o2: Optional[float] = Query(None),
    page: int = Query(1, ge=1), limit: int = Query(50, ge=1, le=200),
    sort_by: str = Query('experiment_id'), sort_dir: str = Query('ASC'),
    provenance: Optional[str] = Query(None, description="psi_verified | illustrative")
):
    try:
        return {'success': True, 'data': query_experiments(query=query, family=family, fuel=fuel, outcome=outcome, min_o2=min_o2, max_o2=max_o2, page=page, limit=limit, sort_by=sort_by, sort_dir=sort_dir, provenance=provenance)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/experiments/export.csv')
def export_experiments_csv(
    query: Optional[str] = Query(None),
    family: Optional[str] = Query(None),
    fuel: Optional[str] = Query(None),
    outcome: Optional[str] = Query(None),
    min_o2: Optional[float] = Query(None),
    max_o2: Optional[float] = Query(None),
    provenance: Optional[str] = Query(None, description="psi_verified | illustrative")
):
    """Dataset export as CSV for predictive modelling — respects all active Explorer filters and carries data_provenance."""
    import csv, io
    from fastapi.responses import Response
    data = query_experiments(
        query=query, family=family, fuel=fuel, outcome=outcome,
        min_o2=min_o2, max_o2=max_o2, page=1, limit=100000, provenance=provenance
    )
    rows = data["experiments"]
    buf = io.StringIO()
    if rows:
        cols = ["experiment_id", "dataset_family", "data_provenance", "provenance_source"] + [
            c for c in rows[0].keys() if c not in ("experiment_id", "dataset_family", "data_provenance", "provenance_source")
        ]
        w = csv.DictWriter(buf, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)
    name = f"firex_experiments_{provenance or 'all'}.csv"
    return Response(content="\ufeff" + buf.getvalue(), media_type="text/csv; charset=utf-8",
                    headers={"Content-Disposition": f'attachment; filename="{name}"'})

@app.get('/api/experiments/{experiment_id:path}')
def get_single_experiment(experiment_id: str):
    try:
        exp = get_experiment_by_id(experiment_id)
        if not exp and "/" in experiment_id:
            exp = get_experiment_by_id(experiment_id.replace("/", "-"))
        if not exp: raise HTTPException(status_code=404, detail='Experiment not found')
        return {'success': True, 'data': exp}
    except HTTPException: raise
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/compare')
def compare_selected_experiments(req: CompareRequest):
    try:
        return {'success': True, 'data': compare_experiments(req.experiment_ids)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/mission-scenario/{scenario_id}')
def get_scenario_metrics(
    scenario_id: str,
    custom_o2: Optional[float] = Query(None),
    custom_pressure: Optional[float] = Query(None),
    custom_gravity: Optional[float] = Query(None),
    material_factor: Optional[float] = Query(None),
):
    try:
        return {
            'success': True,
            'data': calculate_mission_scenario(
                scenario_id,
                custom_o2=custom_o2,
                custom_pressure=custom_pressure,
                custom_gravity=custom_gravity,
                material_factor=material_factor,
            )
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/investigation-rankings')
def get_rankings_default(
    environment: str = Query('lunar_habitat'),
    custom_o2: Optional[float] = Query(None),
    custom_pressure: Optional[float] = Query(None),
    custom_gravity: Optional[float] = Query(None),
):
    try:
        return {
            'success': True,
            'data': get_investigation_rankings(
                environment,
                custom_o2=custom_o2,
                custom_pressure=custom_pressure,
                custom_gravity=custom_gravity,
            )
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/investigation-rankings/{environment_id}')
def get_rankings_by_env(
    environment_id: str,
    custom_o2: Optional[float] = Query(None),
    custom_pressure: Optional[float] = Query(None),
    custom_gravity: Optional[float] = Query(None),
):
    try:
        return {
            'success': True,
            'data': get_investigation_rankings(
                environment_id,
                custom_o2=custom_o2,
                custom_pressure=custom_pressure,
                custom_gravity=custom_gravity,
            )
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_client_ip(request: Request) -> str:
    """Extract real client IP considering reverse proxies (Render, Cloudflare, etc.)."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    if request.client and request.client.host:
        return request.client.host
    return "anonymous"


@app.post('/api/chat-assistant')
def chat_with_assistant(req: ChatRequest, request: Request):
    client_ip = get_client_ip(request)
    messages_payload = [{'role': m.role, 'content': m.content} for m in req.messages]
    return query_ai_assistant(messages=messages_payload, language=req.language, page_context=req.page_context, client_id=client_ip)

@app.post('/api/ask-ai')
def ask_ai_single_prompt(req: AskAIRequest, request: Request):
    client_ip = get_client_ip(request)
    return query_ai_assistant(messages=[{'role': 'user', 'content': req.prompt}], language=req.language, page_context=req.page_context, client_id=client_ip)


# ─────────────────────────────────────────────────────────────────────────────
# REAL-TIME IoT HARDWARE ENGINE (ESP32 + MQ-2 / MQ-4 / IR / BUZZER)
# ─────────────────────────────────────────────────────────────────────────────
import time
import random
import re
import json
import threading
import urllib.request

ESP32_STATIC_IP = os.getenv("ESP32_STATIC_IP", "192.168.137.120")
# ESP32 web server can answer only ONE connection at a time, and sends ~2 KB over a
# phone/laptop hotspot — 0.45 s was too short. All ESP32 HTTP traffic goes through
# _esp32_http_get(), which serialises requests with a lock so they never pile up.
ESP32_HTTP_TIMEOUT = float(os.getenv("ESP32_HTTP_TIMEOUT", "2.0"))
# Must match mq2Threshold / mq4Threshold in hardware/firex_esp32_hotspot firmware,
# otherwise the website shows a hazard while the buzzer stays silent (or vice versa).
MQ2_DANGER_THRESHOLD = int(os.getenv("MQ2_DANGER_THRESHOLD", "1000"))
MQ4_DANGER_THRESHOLD = int(os.getenv("MQ4_DANGER_THRESHOLD", "2500"))
_ESP32_HTTP_LOCK = threading.Lock()


def _esp32_http_get(url: str, timeout: float = ESP32_HTTP_TIMEOUT) -> Optional[str]:
    """One-at-a-time GET to the ESP32. Returns body text, or None on any failure."""
    if not _ESP32_HTTP_LOCK.acquire(timeout=timeout * 2):
        return None
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "FIRE-X-Backend/2.3", "Connection": "close"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read().decode("utf-8", errors="ignore")
    except Exception:
        return None
    finally:
        _ESP32_HTTP_LOCK.release()

LATEST_SENSOR_STATE = {
    "connected": False,
    "last_seen_epoch": 0,
    "device_id": "ESP32-FIREX-01",
    "device_name": "FIRE-X Ground Physical Testbed — Atmospheric Boundary Telemetry Node (ESP-32 + SnO₂ Electrochemical Bridge)",
    "hardware_role": "Local Physical Testbed Environment Telemetry Node",
    "microgravity_engine_link": "NASA PSI-25 / PSI-69 / PSI-98 Active Telemetry Ingestion Bridge",
    "status": "SEARCHING", # "SEARCHING", "CONNECTING", "ONLINE", "STANDBY", "HAZARD_ALERT"
    "status_az": f"Sabit IP ({ESP32_STATIC_IP}) dinlənilir...",
    "status_en": f"Listening on Static IP ({ESP32_STATIC_IP})...",
    "raw_smoke_adc": 0,
    "mq4_adc": 0,
    "ir_flame_detected": False,
    "sound_enabled": True,
    "pending_sound_command": None,
    "esp32_ip": ESP32_STATIC_IP,
    "gas_ppm": 0.0,
    "smoke_density_pct": 0.0,
    "ambient_temp_c": 24.0,
    "estimated_o2_pct": 21.0,
    "fire_hazard_index": 0.0,
    "hazard_level": "STANDBY",
    "hazard_level_az": "GÖZLƏMƏ REJİMİ",
    "advisory_az": f"ESP32 Wi-Fi üzərindən ({ESP32_STATIC_IP}) dinlənilir. USB ilə qoşmaq üçün 'USB (COM) Qoş' düyməsini basın (əvvəlcə Arduino Serial Monitor-u bağlayın).",
    "advisory_en": f"Listening for ESP32 over Wi-Fi ({ESP32_STATIC_IP}). To use USB, click 'Connect USB (COM)' (close Arduino Serial Monitor first).",
    "telemetry_packets_received": 0,
    "is_simulated": False,
    "sim_mode": None,
    "history": []
}

SIM_BASELINES = {
    "connect": {"adc": 185,  "mq4": 640,  "ir": False, "gas": 42.0,  "smoke": 3.1,  "temp": 23.6, "o2": 21.0},
    "trigger": {"adc": 1450, "mq4": 3680, "ir": True,  "gas": 520.0, "smoke": 64.5, "temp": 28.4, "o2": 21.4},
    "reset":   {"adc": 170,  "mq4": 590,  "ir": False, "gas": 38.0,  "smoke": 1.8,  "temp": 23.4, "o2": 20.9},
}

def evaluate_sensor_hazard(gas_ppm: float, smoke_pct: float, o2_pct: float) -> tuple:
    # Scientific FHI calculation driven by live sensor telemetry
    # Formula base: FHI = min(10, 5.1 * (O2/21)^1.5 * (101.3/101.3)^0.4 * Mf) + smoke/gas offset
    x_o2 = (o2_pct if o2_pct else 21.0) / 100.0
    oef = (x_o2 / 0.21) ** 1.5
    fhi_base = 5.1 * oef

    # Gas / smoke hazard adder (MQ-2 sensitivity response)
    # Baseline fresh air: ~20-60 ppm, 0-5% smoke
    # High risk: > 300 ppm, > 30% smoke
    gas_penalty = max(0.0, (gas_ppm - 60.0) / 75.0)
    smoke_penalty = max(0.0, smoke_pct * 0.12)

    fhi = min(10.0, max(1.0, round(fhi_base + gas_penalty + smoke_penalty, 1)))

    if fhi < 3.5:
        lvl = "LOW"
        lvl_az = "AŞAĞI / BOĞULMUŞ"
        adv_az = "Atmosfer sabitdir, yanğın və tüstü hissəcikləri aşkar edilmədi."
        adv_en = "Atmosphere stable, no combustible gas or smoke particles detected."
    elif fhi < 6.8:
        lvl = "NOMINAL"
        lvl_az = "NOMİNAL KOSMİK REJİM"
        adv_az = "Təbii kosmik stansiya fonu. Təhlükəsizlik hədləri daxilindədir."
        adv_en = "Standard spacecraft baseline. All parameters within nominal range."
    elif fhi < 8.8:
        lvl = "ELEVATED"
        lvl_az = "YÜKSƏK HƏYƏCAN (ELEVATED)"
        adv_az = "DİQQƏT: Tüstü/qaz konsentrasiyasında ani sıçrayış! Havalandırma və ventilyasiya təhlil edilir."
        adv_en = "WARNING: Combustible gas / smoke surge detected! Inspecting ventilation loop."
    else:
        lvl = "CRITICAL"
        lvl_az = "KRİTİK YANĞIN TƏHLÜKƏSİ!"
        adv_az = "TƏCİLİ HƏYƏCAN SİQNALI: Alışqan qaz və tüstü konsentrasiyası kritik həddi keçdi! Avtomatik CO₂/N₂ boğma sistemi tövsiyə edilir!"
        adv_en = "CRITICAL EMERGENCY: Smoke & gas density exceeding threshold! Automatic CO₂/N₂ fire suppression recommended!"

    return fhi, lvl, lvl_az, adv_az, adv_en

@app.post('/api/sensor-data')
def receive_iot_sensor_data(payload: SensorDataPayload):
    """
    Endpoint called directly by ESP32 via Wi-Fi HTTP POST (every 1-2 seconds)
    or by the interactive dashboard simulator.
    """
    now = time.time()
    is_sim = bool(payload.simulated)
    if not is_sim:
        LATEST_SENSOR_STATE["sim_mode"] = None

    fhi, lvl, lvl_az, adv_az, adv_en = evaluate_sensor_hazard(
        payload.gas_ppm, payload.smoke_density_pct, payload.estimated_o2_pct or 21.0
    )

    mq4_val = payload.mq4_adc or 0
    ir_flame = bool(payload.ir_flame_detected)
    if ir_flame:
        fhi = max(fhi, 9.8)
        lvl = "CRITICAL"
        lvl_az = "KRİTİK ALOV TƏHLÜKƏSİ (IR)!"
        adv_az = "TƏCİLİ HƏYƏCAN: IR Alov Sensoru açıq alov aşkarladı! Buzzer və avtomatik boğma sistemi aktivləşdirilir."
        adv_en = "CRITICAL EMERGENCY: IR Flame Sensor detected open flame! Activating buzzer and suppression advisory."
    elif (payload.device_danger if payload.device_danger is not None
          else (mq4_val > MQ4_DANGER_THRESHOLD or payload.raw_smoke_adc > MQ2_DANGER_THRESHOLD)):
        fhi = max(fhi, 8.9 if mq4_val > MQ4_DANGER_THRESHOLD else 7.6)
        if fhi >= 8.8:
            lvl = "CRITICAL"
            lvl_az = "KRİTİK QAZ/METAN TƏHLÜKƏSİ!"
            adv_az = "TƏCİLİ HƏYƏCAN: MQ-4 Metan və ya MQ-2 Tüstü sensoru kritik həddi aşdı!"
            adv_en = "CRITICAL EMERGENCY: MQ-4 Methane or MQ-2 Smoke threshold exceeded!"
        else:
            lvl = "ELEVATED"
            lvl_az = "YÜKSƏK HƏYƏCAN (ELEVATED)"
            adv_az = "DİQQƏT: MQ-2/MQ-4 sensorlarında həddən artıq qaz/tüstü sıçrayışı qeydə alındı."
            adv_en = "WARNING: MQ-2/MQ-4 combustible gas/smoke threshold exceeded."
    elif lvl in ("ELEVATED", "CRITICAL"):
        # Below the ESP32 thresholds and no flame: the device says "safe", so does the site.
        fhi = min(fhi, 6.7)
        lvl = "NOMINAL"
        lvl_az = "NOMİNAL KOSMİK REJİM"
        adv_az = "Sensor dəyərləri təhlükə həddindən aşağıdır. Mühit təhlükəsizdir."
        adv_en = "Sensor readings are below the danger thresholds. Environment is safe."

    LATEST_SENSOR_STATE["connected"] = True
    LATEST_SENSOR_STATE["is_simulated"] = is_sim
    LATEST_SENSOR_STATE["last_seen_epoch"] = now
    LATEST_SENSOR_STATE["device_id"] = payload.device_id
    LATEST_SENSOR_STATE["mq4_adc"] = mq4_val
    LATEST_SENSOR_STATE["ir_flame_detected"] = ir_flame
    if payload.esp32_ip:
        LATEST_SENSOR_STATE["esp32_ip"] = payload.esp32_ip
    if not is_sim and LATEST_SENSOR_STATE.get("pending_sound_command") is None and payload.sound_enabled is not None:
        LATEST_SENSOR_STATE["sound_enabled"] = bool(payload.sound_enabled)
    
    if is_sim:
        prefix_az = "[TEST DEMO] "
        prefix_en = "[TEST DEMO] "
    else:
        prefix_az = "Fiziki Cihaz: "
        prefix_en = "Physical Device: "

    if lvl in ["ELEVATED", "CRITICAL"]:
        LATEST_SENSOR_STATE["status"] = "HAZARD_ALERT"
        LATEST_SENSOR_STATE["status_az"] = f"{prefix_az}TƏHLÜKƏ SİQNALI (Canlı)"
        LATEST_SENSOR_STATE["status_en"] = f"{prefix_en}HAZARD ALERT (Live)"
    else:
        LATEST_SENSOR_STATE["status"] = "ONLINE"
        LATEST_SENSOR_STATE["status_az"] = f"{prefix_az}Qoşuldu (Canlı Telemetriya)"
        LATEST_SENSOR_STATE["status_en"] = f"{prefix_en}Connected (Live Telemetry)"

    LATEST_SENSOR_STATE["raw_smoke_adc"] = payload.raw_smoke_adc
    LATEST_SENSOR_STATE["gas_ppm"] = round(payload.gas_ppm, 1)
    LATEST_SENSOR_STATE["smoke_density_pct"] = round(payload.smoke_density_pct, 1)
    LATEST_SENSOR_STATE["ambient_temp_c"] = round(payload.ambient_temp_c or 24.0, 1)
    LATEST_SENSOR_STATE["estimated_o2_pct"] = round(payload.estimated_o2_pct or 21.0, 1)
    LATEST_SENSOR_STATE["fire_hazard_index"] = fhi
    LATEST_SENSOR_STATE["hazard_level"] = lvl
    LATEST_SENSOR_STATE["hazard_level_az"] = lvl_az
    LATEST_SENSOR_STATE["advisory_az"] = adv_az
    LATEST_SENSOR_STATE["advisory_en"] = adv_en
    LATEST_SENSOR_STATE["telemetry_packets_received"] += 1

    # Map physical testbed telemetry into NASA microgravity combustion physics
    micro_bridge = combustion_engine.process_physical_telemetry_node(
        gas_ppm=payload.gas_ppm,
        smoke_density_pct=payload.smoke_density_pct,
        raw_adc=payload.raw_smoke_adc,
        nominal_o2_pct=payload.estimated_o2_pct or 21.0,
        nominal_pressure_kpa=101.3
    )
    LATEST_SENSOR_STATE["microgravity_combustion_bridge"] = micro_bridge

    # Keep rolling 30 data points
    history = LATEST_SENSOR_STATE.get("history", [])
    history.append({
        "timestamp": time.strftime("%H:%M:%S", time.localtime(now)),
        "gas_ppm": round(payload.gas_ppm, 1),
        "smoke_pct": round(payload.smoke_density_pct, 1),
        "fhi": fhi
    })
    if len(history) > 30:
        history.pop(0)
    LATEST_SENSOR_STATE["history"] = history

    # Old POST-based firmware reads "set_sound" from this reply to apply a pending
    # mute/unmute; the polling firmware gets it via /sound/on|off instead.
    pending_cmd = LATEST_SENSOR_STATE.get("pending_sound_command")

    return {
        "success": True,
        "message": "Telemetry processed successfully",
        "device_id": payload.device_id,
        "hardware_role": "Local Physical Testbed Atmospheric Telemetry Node",
        "fire_hazard_index": fhi,
        "hazard_level": lvl,
        "is_simulated": is_sim,
        "set_sound": pending_cmd,
        "microgravity_physics": micro_bridge,
        "data": LATEST_SENSOR_STATE
    }

def ingest_raw_esp32_metrics(
    mq2_val: int,
    mq4_val: int,
    flame_detected: bool,
    sound_enabled: Optional[bool] = None,
    ip_str: str = ESP32_STATIC_IP,
    is_sim: bool = False,
    device_danger: Optional[bool] = None
) -> dict:
    """Convert raw ESP32 ADC / digital readings into full NASA FIRE-X telemetry state."""
    mq2_clamped = max(0, min(4095, int(mq2_val)))
    mq4_clamped = max(0, min(4095, int(mq4_val)))
    smoke_pct = round(min(100.0, max(0.4, (mq2_clamped / 4095.0) * 100.0)), 1)
    gas_ppm = round(max(18.0, (mq2_clamped * 0.25) + max(0.0, (mq4_clamped - 400) * 0.14)), 1)
    payload = SensorDataPayload(
        device_id="ESP32-FIREX-01" if not is_sim else "ESP32-DEMO-SIMULATOR",
        raw_smoke_adc=mq2_clamped,
        mq4_adc=mq4_clamped,
        ir_flame_detected=bool(flame_detected),
        sound_enabled=sound_enabled if sound_enabled is not None else LATEST_SENSOR_STATE.get("sound_enabled", True),
        esp32_ip=ip_str or ESP32_STATIC_IP,
        gas_ppm=gas_ppm,
        smoke_density_pct=smoke_pct,
        ambient_temp_c=24.2 if not flame_detected else 29.5,
        estimated_o2_pct=20.9,
        simulated=is_sim,
        device_danger=device_danger
    )
    return receive_iot_sensor_data(payload)


def _parse_esp32_http_response(raw: str) -> Optional[dict]:
    """Parse either JSON (/data) or the HTML page from the user's ESP32 sketch."""
    if not raw:
        return None
    raw_s = raw.strip()
    if raw_s.startswith("{"):
        try:
            data = json.loads(raw_s)
            return {
                "mq2": int(data.get("mq2", 0)),
                "mq4": int(data.get("mq4", 0)),
                "flame": bool(data.get("flame", False)),
                "sound": data.get("sound", data.get("soundEnabled", None)),
                "danger": data.get("danger"),
            }
        except Exception:
            pass
    # Parse the user's HTML page:
    # <p><b>MQ-2 Tüstü Dəyəri:</b><br><span class='val'>123</span></p>
    # <p><b>MQ-4 Metan Dəyəri:</b><br><span class='val'>456</span></p>
    mq2_m = re.search(r"MQ-2[\s\S]{0,80}?<span[^>]*>(\d+)</span>", raw_s, re.IGNORECASE)
    mq4_m = re.search(r"MQ-4[\s\S]{0,80}?<span[^>]*>(\d+)</span>", raw_s, re.IGNORECASE)
    if mq2_m:
        mq2_v = int(mq2_m.group(1))
        mq4_v = int(mq4_m.group(1)) if mq4_m else 0
        flame_v = ("IR Alov Aşkarlandı" in raw_s) or ("ALOV!" in raw_s)
        snd_v = None
        if "Səs: Açıqdır" in raw_s or "/sound/off" in raw_s:
            snd_v = True
        elif "Səs: Səssiz" in raw_s or "/sound/on" in raw_s:
            snd_v = False
        return {
            "mq2": mq2_v,
            "mq4": mq4_v,
            "flame": flame_v,
            "sound": snd_v,
        }
    return None


def poll_esp32_static_ip(target_ip: Optional[str] = None) -> bool:
    """Poll the ESP32 HTTP server: JSON at /data (new firmware) or the HTML page (old firmware)."""
    ip = (target_ip or LATEST_SENSOR_STATE.get("esp32_ip") or ESP32_STATIC_IP).strip()
    if not ip or ip == "—":
        ip = ESP32_STATIC_IP
    # Old firmware answers every path (including /data) with its HTML page,
    # so a single request to /data works for both firmware versions.
    raw = _esp32_http_get(f"http://{ip}/data")
    parsed = _parse_esp32_http_response(raw) if raw else None
    if parsed is None:
        return False
    ingest_raw_esp32_metrics(
        mq2_val=parsed["mq2"],
        mq4_val=parsed["mq4"],
        flame_detected=parsed["flame"],
        sound_enabled=parsed["sound"],
        device_danger=parsed.get("danger"),
        ip_str=ip,
        is_sim=False
    )
    return True


def parse_and_ingest_serial_line(line: str) -> bool:
    """Parse a line from ESP32 Serial output (e.g. '[FIRE-X] ... MQ-2: 240 ... MQ-4: 510 ... Alov: YOX')."""
    if not line or ("MQ-2" not in line and "mq2" not in line.lower()):
        return False
    mq2_m = re.search(r"MQ-2\s*:\s*(\d+)", line, re.IGNORECASE)
    mq4_m = re.search(r"MQ-4\s*:\s*(\d+)", line, re.IGNORECASE)
    if not mq2_m:
        return False
    mq2_v = int(mq2_m.group(1))
    mq4_v = int(mq4_m.group(1)) if mq4_m else 0
    flame_m = re.search(r"Alov\s*:\s*(VAR|1|TRUE|AKTIV|ALOV)", line, re.IGNORECASE)
    flame_v = bool(flame_m)
    ip_m = re.search(r"(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})", line)
    ip_str = ip_m.group(1) if ip_m and ip_m.group(1) != "0.0.0.0" else ESP32_STATIC_IP
    ingest_raw_esp32_metrics(
        mq2_val=mq2_v,
        mq4_val=mq4_v,
        flame_detected=flame_v,
        sound_enabled=LATEST_SENSOR_STATE.get("sound_enabled", True),
        ip_str=ip_str,
        is_sim=False
    )
    return True


def _list_windows_com_ports() -> List[str]:
    ports = []
    try:
        import winreg
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"HARDWARE\DEVICEMAP\SERIALCOMM")
        i = 0
        while True:
            try:
                _, val, _ = winreg.EnumValue(key, i)
                if val and str(val).upper().startswith("COM"):
                    ports.append(str(val).upper())
                i += 1
            except OSError:
                break
        winreg.CloseKey(key)
    except Exception:
        pass
    return ports


def _read_com_port_ctypes(port_name: str):
    """Zero-dependency Windows Win32 COM port reader at 115200 baud for ESP32 USB telemetry."""
    import ctypes
    from ctypes import wintypes

    kernel32 = ctypes.windll.kernel32
    GENERIC_READ = 0x80000000
    GENERIC_WRITE = 0x40000000
    OPEN_EXISTING = 3
    INVALID_HANDLE_VALUE = ctypes.c_void_p(-1).value

    handle = kernel32.CreateFileW(
        f"\\\\.\\{port_name}",
        GENERIC_READ | GENERIC_WRITE,
        0, None, OPEN_EXISTING, 0, None
    )
    if handle == INVALID_HANDLE_VALUE or handle == -1 or handle == 0:
        return

    class DCB(ctypes.Structure):
        _fields_ = [
            ("DCBlength", wintypes.DWORD),
            ("BaudRate", wintypes.DWORD),
            ("fFlags", wintypes.DWORD),
            ("wReserved", wintypes.WORD),
            ("XonLim", wintypes.WORD),
            ("XoffLim", wintypes.WORD),
            ("ByteSize", wintypes.BYTE),
            ("Parity", wintypes.BYTE),
            ("StopBits", wintypes.BYTE),
            ("XonChar", ctypes.c_char),
            ("XoffChar", ctypes.c_char),
            ("ErrorChar", ctypes.c_char),
            ("EofChar", ctypes.c_char),
            ("EvtChar", ctypes.c_char),
            ("wReserved1", wintypes.WORD),
        ]

    class COMMTIMEOUTS(ctypes.Structure):
        _fields_ = [
            ("ReadIntervalTimeout", wintypes.DWORD),
            ("ReadTotalTimeoutMultiplier", wintypes.DWORD),
            ("ReadTotalTimeoutConstant", wintypes.DWORD),
            ("WriteTotalTimeoutMultiplier", wintypes.DWORD),
            ("WriteTotalTimeoutConstant", wintypes.DWORD),
        ]

    try:
        dcb = DCB()
        dcb.DCBlength = ctypes.sizeof(DCB)
        if kernel32.GetCommState(handle, ctypes.byref(dcb)):
            dcb.BaudRate = 115200
            dcb.ByteSize = 8
            dcb.Parity = 0
            dcb.StopBits = 0
            dcb.fFlags = 0x0001  # fBinary = 1 (no DTR/RTS reset pulse)
            kernel32.SetCommState(handle, ctypes.byref(dcb))

        timeouts = COMMTIMEOUTS(50, 0, 200, 0, 200)
        kernel32.SetCommTimeouts(handle, ctypes.byref(timeouts))

        buf = ctypes.create_string_buffer(256)
        bytes_read = wintypes.DWORD(0)
        line_buf = ""

        while True:
            if LATEST_SENSOR_STATE.get("is_simulated"):
                time.sleep(1.0)
                continue
            ok = kernel32.ReadFile(handle, buf, 255, ctypes.byref(bytes_read), None)
            if not ok:
                break
            if bytes_read.value > 0:
                chunk = buf.raw[:bytes_read.value].decode("utf-8", errors="ignore")
                line_buf += chunk
                while "\n" in line_buf:
                    line, line_buf = line_buf.split("\n", 1)
                    parse_and_ingest_serial_line(line.strip())
            else:
                time.sleep(0.08)
    finally:
        kernel32.CloseHandle(handle)


import socket
from concurrent.futures import ThreadPoolExecutor

def _get_local_wifi_ip() -> Optional[str]:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.2)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return None


def _probe_candidate_ip(ip: str) -> Optional[str]:
    try:
        req = urllib.request.Request(f"http://{ip}/data", headers={"User-Agent": "FIRE-X-Scanner/2.3"})
        with urllib.request.urlopen(req, timeout=0.6) as resp:
            raw = resp.read().decode("utf-8", errors="ignore")
            if _parse_esp32_http_response(raw) is not None:
                return ip
    except Exception:
        pass
    return None


def _candidate_subnet_prefixes() -> List[str]:
    """/24 prefixes to scan. The 8.8.8.8 trick alone returns the internet adapter's IP,
    which is NOT the hotspot network when this PC itself shares the hotspot
    (Windows Mobile Hotspot is always 192.168.137.x), so add every local IPv4 too."""
    ips = set()
    main_ip = _get_local_wifi_ip()
    if main_ip:
        ips.add(main_ip)
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ips.add(info[4][0])
    except Exception:
        pass
    prefixes = []
    static_prefix = ".".join(ESP32_STATIC_IP.split(".")[:3]) + "."
    for p in [static_prefix] + [".".join(i.split(".")[:3]) + "." for i in sorted(ips)]:
        if p.startswith("127.") or p.startswith("169.254.") or p in prefixes:
            continue
        prefixes.append(p)
    return prefixes


def _auto_discover_esp32_on_subnet() -> Optional[str]:
    """Find the ESP32 on the PC's hotspot (192.168.137.x) or any local /24 network."""
    if os.getenv("RENDER") or os.getenv("VERCEL") or os.getenv("VERCEL_ENV"):
        return None
    own_ips = set()
    try:
        own_ips = {info[4][0] for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET)}
    except Exception:
        pass
    candidates = []
    for prefix in _candidate_subnet_prefixes():
        candidates += [f"{prefix}{i}" for i in range(2, 255) if f"{prefix}{i}" not in own_ips]
    with ThreadPoolExecutor(max_workers=64) as ex:
        for res in ex.map(_probe_candidate_ip, candidates):
            if res:
                LATEST_SENSOR_STATE["esp32_ip"] = res
                poll_esp32_static_ip(res)
                return res
    return None


def _esp32_background_bridge():
    """Background daemon that polls ESP32 over Wi-Fi and auto-discovers its Hotspot IP."""
    last_scan = 0.0
    while True:
        try:
            if not LATEST_SENSOR_STATE.get("is_simulated"):
                current_ip = LATEST_SENSOR_STATE.get("esp32_ip") or ESP32_STATIC_IP
                pending = LATEST_SENSOR_STATE.get("pending_sound_command")
                if pending is not None:
                    path = "/sound/on" if pending else "/sound/off"
                    if _esp32_http_get(f"http://{current_ip}{path}") is not None:
                        LATEST_SENSOR_STATE["pending_sound_command"] = None
                if poll_esp32_static_ip(current_ip):
                    time.sleep(1.0)
                    continue
                # Auto-scan hotspot subnet every 20 seconds if not yet connected
                now = time.time()
                if now - last_scan >= 20.0:
                    last_scan = now
                    _auto_discover_esp32_on_subnet()
        except Exception:
            pass
        time.sleep(1.2)


IS_CLOUD_ENV = bool(os.getenv("RENDER") or os.getenv("VERCEL") or os.getenv("VERCEL_ENV"))
if not IS_CLOUD_ENV:
    threading.Thread(target=_esp32_background_bridge, daemon=True).start()


@app.post('/api/sensor-set-ip')
def set_esp32_target_ip(ip: str = Query(...)):
    """Set the ESP32 IP address (strictly RFC1918 private LAN IPv4 only to prevent SSRF) and immediately poll it."""
    import ipaddress
    raw_host = ip.strip().replace("http://", "").replace("https://", "").split("/")[0].split(":")[0].strip()
    try:
        addr = ipaddress.ip_address(raw_host)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid ESP32 IP format. Please enter a valid private LAN IPv4 address (e.g., 192.168.137.120)."
        )
    if (
        addr.version != 4
        or not addr.is_private
        or addr.is_loopback
        or addr.is_link_local
        or addr.is_multicast
        or addr.is_unspecified
        or addr.is_reserved
    ):
        raise HTTPException(
            status_code=400,
            detail="Security policy: Only RFC1918 private LAN IPv4 addresses (192.168.x.x, 10.x.x.x, 172.16-31.x.x) are permitted for ESP32 hardware polling."
        )
    clean_ip = str(addr)
    LATEST_SENSOR_STATE["esp32_ip"] = clean_ip
    ok = poll_esp32_static_ip(clean_ip)
    return {"success": ok, "esp32_ip": clean_ip, "data": LATEST_SENSOR_STATE}


@app.post('/api/sensor-sound')
def toggle_sensor_sound(enabled: bool = Query(...)):
    """Toggle ESP32 buzzer sound state from the FIRE-X web dashboard (/sound/on or /sound/off)."""
    LATEST_SENSOR_STATE["sound_enabled"] = enabled
    LATEST_SENSOR_STATE["pending_sound_command"] = enabled
    ip = LATEST_SENSOR_STATE.get("esp32_ip") or ESP32_STATIC_IP
    sound_path = "/sound/on" if enabled else "/sound/off"
    delivered = _esp32_http_get(f"http://{ip}{sound_path}") is not None
    if delivered:
        LATEST_SENSOR_STATE["pending_sound_command"] = None
    return {"success": True, "delivered_to_esp32": delivered, "sound_enabled": enabled}


@app.post('/api/sensor-buzzer-test')
def test_sensor_buzzer():
    """Ask the ESP32 to sound the buzzer for 2 s (works even when sound is muted)."""
    ip = LATEST_SENSOR_STATE.get("esp32_ip") or ESP32_STATIC_IP
    ok = _esp32_http_get(f"http://{ip}/buzzer/test") is not None
    return {"success": ok, "esp32_ip": ip}


@app.post('/api/sensor-serial-line')
def ingest_browser_serial_line(line: str = Query(...)):
    """Allow WebSerial in browser or external bridge to push raw Serial Monitor lines."""
    ok = parse_and_ingest_serial_line(line)
    return {"success": ok, "data": LATEST_SENSOR_STATE}


@app.post('/api/sensor-scan')
def scan_for_real_esp32():
    """Scan local Wi-Fi / Hotspot subnet (e.g. Redmi Note 14S) for real ESP32 /data endpoint."""
    LATEST_SENSOR_STATE["is_simulated"] = False
    LATEST_SENSOR_STATE["sim_mode"] = None
    current_ip = LATEST_SENSOR_STATE.get("esp32_ip") or ESP32_STATIC_IP
    if poll_esp32_static_ip(current_ip):
        return {"success": True, "found_ip": current_ip, "data": LATEST_SENSOR_STATE}
    found = _auto_discover_esp32_on_subnet()
    return {"success": bool(found), "found_ip": found, "data": LATEST_SENSOR_STATE}


@app.get('/api/sensor-live')
def get_live_sensor_telemetry():
    """
    Called by the Frontend Hardware Dashboard every 1.5 seconds.
    STRICTLY REAL HARDWARE ONLY — never generates random or demo numbers.
    """
    now = time.time()
    LATEST_SENSOR_STATE["is_simulated"] = False
    LATEST_SENSOR_STATE["sim_mode"] = None
    last_seen = LATEST_SENSOR_STATE.get("last_seen_epoch", 0)
    target_ip = LATEST_SENSOR_STATE.get("esp32_ip") or ESP32_STATIC_IP

    # No polling here: the background thread (_esp32_background_bridge) is the only
    # Wi-Fi poller, so the single-connection ESP32 server is never flooded.

    # Auto-disconnect physical device if no live packets received in last 10 seconds
    if (now - last_seen > 10.0 or last_seen == 0) and LATEST_SENSOR_STATE["connected"]:
        LATEST_SENSOR_STATE["connected"] = False
        LATEST_SENSOR_STATE["is_simulated"] = False
        LATEST_SENSOR_STATE["sim_mode"] = None
        LATEST_SENSOR_STATE["status"] = "SEARCHING"
        LATEST_SENSOR_STATE["status_az"] = f"Fiziki ESP32 ({target_ip}) gözlənilir..."
        LATEST_SENSOR_STATE["status_en"] = f"Waiting for physical ESP32 ({target_ip})..."
        LATEST_SENSOR_STATE["gas_ppm"] = 0.0
        LATEST_SENSOR_STATE["smoke_density_pct"] = 0.0
        LATEST_SENSOR_STATE["raw_smoke_adc"] = 0
        LATEST_SENSOR_STATE["mq4_adc"] = 0
        LATEST_SENSOR_STATE["ir_flame_detected"] = False
        LATEST_SENSOR_STATE["fire_hazard_index"] = 0.0
        LATEST_SENSOR_STATE["hazard_level"] = "STANDBY"
        LATEST_SENSOR_STATE["hazard_level_az"] = "GÖZLƏMƏ REJİMİ"
        LATEST_SENSOR_STATE["advisory_az"] = f"Fiziki ESP32 ({target_ip}) axtarılır. ESP32-nin IP ünvanını daxil edin və ya 'USB (COM) Qoş' düyməsini sıxın."
        LATEST_SENSOR_STATE["advisory_en"] = f"Waiting for physical ESP32 ({target_ip}). Enter ESP32 IP or click 'Connect USB (COM)'."

    return {
        "success": True,
        "data": LATEST_SENSOR_STATE
    }

@app.post('/api/sensor-simulate')
def simulate_sensor_telemetry(action: str = Query("disconnect")):
    """
    Demo simulation is permanently disabled per user requirement.
    All actions only poll real physical hardware or reset to standby.
    """
    LATEST_SENSOR_STATE["is_simulated"] = False
    LATEST_SENSOR_STATE["sim_mode"] = None
    target_ip = LATEST_SENSOR_STATE.get("esp32_ip") or ESP32_STATIC_IP

    if action == "connect":
        ok = poll_esp32_static_ip(target_ip)
        if not ok:
            found = _auto_discover_esp32_on_subnet()
            ok = bool(found)
        return {"success": ok, "action": action, "data": LATEST_SENSOR_STATE}

    LATEST_SENSOR_STATE["connected"] = False
    LATEST_SENSOR_STATE["last_seen_epoch"] = 0
    LATEST_SENSOR_STATE["status"] = "SEARCHING"
    LATEST_SENSOR_STATE["status_az"] = f"Fiziki ESP32 ({target_ip}) gözlənilir..."
    LATEST_SENSOR_STATE["status_en"] = f"Waiting for physical ESP32 ({target_ip})..."
    LATEST_SENSOR_STATE["gas_ppm"] = 0.0
    LATEST_SENSOR_STATE["smoke_density_pct"] = 0.0
    LATEST_SENSOR_STATE["raw_smoke_adc"] = 0
    LATEST_SENSOR_STATE["mq4_adc"] = 0
    LATEST_SENSOR_STATE["ir_flame_detected"] = False
    LATEST_SENSOR_STATE["fire_hazard_index"] = 0.0
    LATEST_SENSOR_STATE["hazard_level"] = "STANDBY"
    LATEST_SENSOR_STATE["hazard_level_az"] = "GÖZLƏMƏ REJİMİ"
    LATEST_SENSOR_STATE["telemetry_packets_received"] = 0
    LATEST_SENSOR_STATE["history"] = []
    return {"success": True, "action": action, "data": LATEST_SENSOR_STATE}


# Static files
if os.path.exists(IMAGES_DIR):
    app.mount('/images', StaticFiles(directory=IMAGES_DIR), name='images')

if os.path.exists(FRONTEND_DIR):
    app.mount('/static', StaticFiles(directory=FRONTEND_DIR), name='static')


# Multi-page HTML routes
PAGE_MAP = {
    '/': 'index.html',
    '/analytics': 'analytics.html',
    '/explorer': 'explorer.html',
    '/simulator': 'simulator.html',
    '/hardware': 'hardware.html',
    '/ai': 'ai.html',
    '/about': 'about.html',
}

def serve_page(filename: str):
    no_cache = {"Cache-Control": "no-cache, no-store, must-revalidate"}
    path = os.path.join(FRONTEND_DIR, filename)
    if os.path.exists(path):
        return FileResponse(path, media_type='text/html', headers=no_cache)
    # Fallback to index
    index = os.path.join(FRONTEND_DIR, 'index.html')
    if os.path.exists(index):
        return FileResponse(index, media_type='text/html', headers=no_cache)
    return JSONResponse({'error': 'Page not found'}, status_code=404)

@app.get('/favicon.ico')
def favicon():
    favicon_path = os.path.join(IMAGES_DIR, 'Fire-X.jpeg')
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path, media_type='image/jpeg')
    return JSONResponse({'error': 'Favicon not found'}, status_code=404)

@app.get('/')
def home(): return serve_page('index.html')

@app.get('/analytics')
def analytics(): return serve_page('analytics.html')

@app.get('/explorer')
def explorer(): return serve_page('explorer.html')

@app.get('/simulator')
def simulator(): return serve_page('simulator.html')

@app.get('/hardware')
def hardware_page(): return serve_page('hardware.html')

@app.get('/3d_viewer')
@app.get('/3d_viewer.html')
@app.get('/hardware/3d-viewer')
@app.get('/hardware/3d_viewer.html')
def serve_hardware_3d_viewer():
    fpath = os.path.join(HARDWARE_DIR, '3d_viewer.html')
    if os.path.exists(fpath):
        return FileResponse(fpath, media_type='text/html', headers={'Cache-Control': 'no-cache, no-store, must-revalidate', 'Content-Disposition': 'inline'})
    raise HTTPException(status_code=404, detail='3D Viewer not found')

@app.get('/locales/{filename}')
def serve_locale_file(filename: str):
    safe_name = os.path.basename(filename)
    loc_path = os.path.join(FRONTEND_DIR, 'locales', safe_name)
    if os.path.exists(loc_path):
        return FileResponse(loc_path, media_type='application/json')
    return JSONResponse({'status': 'inline_i18n', 'locale': safe_name.replace('.json', '')})

@app.get('/hardware/{filename}')
def hardware_file_download(filename: str):
    safe_name = os.path.basename(filename)
    fpath = os.path.join(HARDWARE_DIR, safe_name)
    if os.path.exists(fpath):
        if safe_name.endswith('.html'):
            return FileResponse(fpath, media_type='text/html', headers={'Cache-Control': 'no-cache', 'Content-Disposition': 'inline'})
        return FileResponse(fpath, filename=safe_name)
    raise HTTPException(status_code=404, detail='Hardware file not found')

@app.get('/ai')
def ai_assistant(): return serve_page('ai.html')

@app.get('/about')
def about(): return serve_page('about.html')



if __name__ == '__main__':
    import uvicorn
    uvicorn.run('backend.main:app', host='0.0.0.0', port=8000, reload=True)
