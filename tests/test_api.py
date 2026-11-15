"""API smoke tests for FIRE-X.

They run against the bundled SQLite database and never touch real hardware
or the OpenAI API. Run with:  pytest -q
"""
import os
import sys
from pathlib import Path

# Disable the ESP32 background poller and the LLM before the app is imported.
os.environ.setdefault("VERCEL_ENV", "test")
os.environ["OPENAI_API_KEY"] = ""

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
os.chdir(ROOT)

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from backend.main import app  # noqa: E402

client = TestClient(app)


def test_health_reports_record_counts():
    r = client.get("/api/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "healthy"
    assert body["canonical_records"] == 569
    assert body["psi_verified_records"] == 407


def test_stats_split_adds_up():
    r = client.get("/api/stats")
    assert r.status_code == 200
    data = r.json()["data"]
    assert data["psi_verified_experiments"] + data["illustrative_experiments"] == data["total_experiments"]


@pytest.mark.parametrize("provenance", ["psi_verified", "illustrative"])
def test_provenance_filter_is_consistent(provenance):
    r = client.get("/api/experiments", params={"provenance": provenance, "limit": 50})
    assert r.status_code == 200
    rows = r.json()["data"]
    rows = rows.get("experiments", rows) if isinstance(rows, dict) else rows
    assert rows, "filter returned no rows"
    assert all(row["data_provenance"] == provenance for row in rows)


def test_single_experiment_has_provenance():
    r = client.get("/api/experiments/FLEX-001")
    assert r.status_code == 200
    rec = r.json()["data"]
    assert rec["dataset_family"] == "FLEX"
    assert rec["data_provenance"] == "psi_verified"


def test_csv_export():
    r = client.get("/api/experiments/export.csv", params={"provenance": "psi_verified"})
    assert r.status_code == 200
    assert "text/csv" in r.headers["content-type"]
    header = r.text.splitlines()[0]
    assert "experiment_id" in header


@pytest.mark.parametrize("scenario", ["iss", "lunar_habitat", "mars_habitat", "rover", "eva_suit"])
def test_mission_scenarios(scenario):
    r = client.get(f"/api/mission-scenario/{scenario}")
    assert r.status_code == 200
    assert r.json()["success"] is True


def test_sensor_ip_rejects_public_addresses():
    r = client.post("/api/sensor-set-ip", params={"ip": "8.8.8.8"})
    assert r.status_code == 400


def test_sensor_live_without_board():
    r = client.get("/api/sensor-live")
    assert r.status_code == 200
    assert r.json()["success"] is True


@pytest.mark.parametrize("path", ["/", "/analytics", "/explorer", "/simulator", "/ai", "/hardware", "/about"])
def test_pages_are_served(path):
    r = client.get(path)
    assert r.status_code == 200
    assert "<html" in r.text.lower()
