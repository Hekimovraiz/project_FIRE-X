"""
FIRE-X Data Service Module
Handles SQLite queries, aggregations, experiment filtering, multi-experiment comparisons,
and mission scenario simulations across 569 canonical NASA microgravity combustion records
from the 18 official NASA Space Apps "Flame in Freefall" investigation sub-suites.
"""

import sqlite3
import csv
import os
import math
import logging
from typing import Dict, Any, List, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(os.path.dirname(__file__), "fire_safety.db")
if not os.path.exists(DB_PATH):
    # Fallback to root DB if backend/fire_safety.db is not present
    DB_PATH = os.path.join(BASE_DIR, "fire_safety.db")

# Strictly the official investigations referenced in the 2026 NASA Space Apps "Flame in Freefall" Challenge
CHALLENGE_ALLOWED_FAMILIES = (
    "FLEX",
    "FLEX-2",
    "BASS-I",
    "BASS-II",
    "SAFFIRE-I",
    "SAFFIRE-II",
    "SAFFIRE-III",
    "ACME (CIR)",
    "ACME-BRE",
    "ACME-CFI",
    "ACME-CFI-G",
    "ACME-CLD",
    "ACME-EFIELD",
    "SLICE",
    "SPICE",
    "SAME",
    "SAME (Aerosol)",  # older DB builds use this name — must not be pruned (was deleting 50 SAME rows)
    "SAME-R",
    "DAFT / DAFT-2",
)

_DB_PRUNED = False

# ── DATA PROVENANCE ───────────────────────────────────────────────────────────
# Only these families come from the official NASA PSI experimental tables shipped
# in Nasa_data/ (PSI-69 FLEX, PSI-25 BASS-II, PSI-98 SAFFIRE-1). Every other family
# was compiled by the team from publications / summaries and is NOT a row-level PSI
# export — it is labelled "illustrative" everywhere it is shown or used.
PSI_VERIFIED_FAMILIES = ("FLEX", "BASS-II", "SAFFIRE-I")
PSI_VERIFIED_SOURCES = {
    "FLEX": "Nasa_data/PSI-69_Experimental table_FLEX.csv",
    "BASS-II": "Nasa_data/PSI-25_Experimental table_BASS-II.csv",
    "SAFFIRE-I": "Nasa_data/PSI-98_Experimental table_SAFFIRE-1.csv",
}


def provenance_of(family: Optional[str]) -> str:
    return "psi_verified" if family in PSI_VERIFIED_FAMILIES else "illustrative"


def _with_provenance(row: Dict[str, Any]) -> Dict[str, Any]:
    fam = row.get("dataset_family")
    row["data_provenance"] = provenance_of(fam)
    row["provenance_source"] = PSI_VERIFIED_SOURCES.get(
        fam, "Team-compiled from NASA publications/summaries — not a row-level PSI table export")
    return row



def _ensure_challenge_compliant_db():
    """
    READ-ONLY scope check. This used to DELETE every row whose dataset_family was not in
    CHALLENGE_ALLOWED_FAMILIES and rewrite the CSV — a single name mismatch
    ("SAME (Aerosol)" vs "SAME") silently destroyed 50 experiments. It now never
    modifies data: it only logs out-of-scope families so they can be fixed by hand.
    """
    global _DB_PRUNED
    if _DB_PRUNED:
        return
    _DB_PRUNED = True

    if not os.path.exists(DB_PATH):
        return
    placeholders = ",".join(["?"] * len(CHALLENGE_ALLOWED_FAMILIES))
    try:
        conn = sqlite3.connect(DB_PATH)
        rows = conn.execute(
            f"SELECT dataset_family, COUNT(*) FROM canonical_experiments "
            f"WHERE dataset_family NOT IN ({placeholders}) GROUP BY dataset_family",
            CHALLENGE_ALLOWED_FAMILIES,
        ).fetchall()
        conn.close()
        for fam, cnt in rows:
            logging.getLogger("firex_data").warning(
                "Out-of-scope dataset_family %r (%d rows) found — NOT deleted; review manually.", fam, cnt)
    except Exception:
        pass


_ensure_challenge_compliant_db()


def get_db_connection():
    """Get a SQLite database connection with row factory enabled."""
    _ensure_challenge_compliant_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def get_stats() -> Dict[str, Any]:
    """Retrieve high-level statistical KPIs and chart aggregation distributions."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Total experiments count
    cursor.execute("SELECT COUNT(*) FROM canonical_experiments")
    total_experiments = cursor.fetchone()[0]

    # Distinct flight families
    cursor.execute("SELECT COUNT(DISTINCT dataset_family) FROM canonical_experiments")
    total_families = cursor.fetchone()[0]

    placeholders_v = ",".join(["?"] * len(PSI_VERIFIED_FAMILIES))
    cursor.execute(f"SELECT COUNT(*) FROM canonical_experiments WHERE dataset_family IN ({placeholders_v})",
                   PSI_VERIFIED_FAMILIES)
    psi_verified_count = cursor.fetchone()[0]

    # Extinction outcomes breakdown
    cursor.execute("""
        SELECT extinction_outcome, COUNT(*) as count 
        FROM canonical_experiments 
        WHERE extinction_outcome IS NOT NULL AND extinction_outcome != ''
        GROUP BY extinction_outcome
        ORDER BY count DESC
    """)
    outcomes = [{"outcome": row["extinction_outcome"], "count": row["count"]} for row in cursor.fetchall()]

    # Fuel materials breakdown
    cursor.execute("""
        SELECT fuel_material, COUNT(*) as count 
        FROM canonical_experiments 
        WHERE fuel_material IS NOT NULL AND fuel_material != ''
        GROUP BY fuel_material
        ORDER BY count DESC
        LIMIT 10
    """)
    top_fuels = [{"fuel": row["fuel_material"], "count": row["count"]} for row in cursor.fetchall()]

    # Dataset families breakdown
    cursor.execute("""
        SELECT dataset_family, COUNT(*) as count 
        FROM canonical_experiments 
        GROUP BY dataset_family 
        ORDER BY count DESC
    """)
    families_dist = [{"family": row["dataset_family"], "count": row["count"],
                      "provenance": provenance_of(row["dataset_family"])} for row in cursor.fetchall()]

    # Oxygen vs Extinction Diameter data points (for scatter/bubble chart)
    cursor.execute("""
        SELECT experiment_id, dataset_family, fuel_material, oxygen_pct, extinction_diameter_mm, burn_time_s, airflow_velocity_cms
        FROM canonical_experiments
        WHERE oxygen_pct IS NOT NULL AND extinction_diameter_mm IS NOT NULL AND extinction_diameter_mm > 0
        ORDER BY oxygen_pct ASC
    """)
    extinction_scatter = [
        {
            "id": row["experiment_id"],
            "family": row["dataset_family"],
            "fuel": row["fuel_material"],
            "o2": round(row["oxygen_pct"], 1),
            "de": round(row["extinction_diameter_mm"], 3),
            "burn_time": round(row["burn_time_s"], 1) if row["burn_time_s"] else None,
            "airflow": round(row["airflow_velocity_cms"], 1) if row["airflow_velocity_cms"] else None,
            "provenance": provenance_of(row["dataset_family"])
        }
        for row in cursor.fetchall()
    ]

    # Burn time vs Airflow velocity data points
    cursor.execute("""
        SELECT experiment_id, dataset_family, fuel_material, burn_time_s, airflow_velocity_cms, oxygen_pct
        FROM canonical_experiments
        WHERE burn_time_s IS NOT NULL AND airflow_velocity_cms IS NOT NULL AND burn_time_s > 0
        ORDER BY airflow_velocity_cms ASC
    """)
    burn_airflow_data = [
        {
            "id": row["experiment_id"],
            "family": row["dataset_family"],
            "fuel": row["fuel_material"],
            "burn_time": round(row["burn_time_s"], 1),
            "airflow": round(row["airflow_velocity_cms"], 2),
            "o2": round(row["oxygen_pct"], 1) if row["oxygen_pct"] else None,
            "provenance": provenance_of(row["dataset_family"])
        }
        for row in cursor.fetchall()
    ]

    # Summary metrics averages
    cursor.execute("""
        SELECT 
            AVG(oxygen_pct) as avg_o2,
            AVG(burn_time_s) as avg_burn_time,
            AVG(extinction_diameter_mm) as avg_de,
            MIN(oxygen_pct) as min_o2,
            MAX(oxygen_pct) as max_o2
        FROM canonical_experiments
    """)
    avg_row = cursor.fetchone()

    conn.close()

    return {
        "total_experiments": total_experiments,
        "total_families": total_families,
        "psi_verified_experiments": psi_verified_count,
        "illustrative_experiments": total_experiments - psi_verified_count,
        "psi_verified_families": list(PSI_VERIFIED_FAMILIES),
        "averages": {
            "avg_oxygen_pct": round(avg_row["avg_o2"], 2) if avg_row["avg_o2"] else 21.0,
            "avg_burn_time_s": round(avg_row["avg_burn_time"], 2) if avg_row["avg_burn_time"] else 0.0,
            "avg_extinction_diameter_mm": round(avg_row["avg_de"], 3) if avg_row["avg_de"] else 0.0,
            "min_o2": round(avg_row["min_o2"], 1) if avg_row["min_o2"] else 15.0,
            "max_o2": round(avg_row["max_o2"], 1) if avg_row["max_o2"] else 50.0
        },
        "outcomes": outcomes,
        "top_fuels": top_fuels,
        "families_distribution": families_dist,
        "extinction_scatter": extinction_scatter,
        "burn_airflow_data": burn_airflow_data
    }


def query_experiments(
    query: Optional[str] = None,
    family: Optional[str] = None,
    fuel: Optional[str] = None,
    outcome: Optional[str] = None,
    min_o2: Optional[float] = None,
    max_o2: Optional[float] = None,
    page: int = 1,
    limit: int = 50,
    sort_by: str = "experiment_id",
    sort_dir: str = "ASC",
    provenance: Optional[str] = None
) -> Dict[str, Any]:
    """Multi-parameter filtering & search across all 892 experiments."""
    conn = get_db_connection()
    cursor = conn.cursor()

    conditions = ["1=1"]
    params = []

    if query:
        q_wildcard = f"%{query}%"
        conditions.append("(experiment_id LIKE ? OR fuel_material LIKE ? OR dataset_family LIKE ? OR sample_description LIKE ? OR notes LIKE ? OR facility_hardware LIKE ?)")
        params.extend([q_wildcard, q_wildcard, q_wildcard, q_wildcard, q_wildcard, q_wildcard])

    if family and family.lower() != "all":
        if family in ('BASS-I', 'BASS-II', 'FLEX', 'FLEX-2', 'SAME', 'SAME-R', 'ACME-CFI', 'ACME-CFI-G'):
            conditions.append("dataset_family = ?")
            params.append(family)
        else:
            conditions.append("(dataset_family = ? OR dataset_family LIKE ?)")
            params.extend([family, f"{family}%"])

    if fuel and fuel.lower() != "all":
        conditions.append("(fuel_material = ? OR fuel_material LIKE ?)")
        params.extend([fuel, f"%{fuel}%"])

    if outcome and outcome.lower() != "all":
        conditions.append("(extinction_outcome = ? OR extinction_outcome LIKE ?)")
        params.extend([outcome, f"%{outcome}%"])

    if min_o2 is not None:
        conditions.append("oxygen_pct >= ?")
        params.append(min_o2)

    if max_o2 is not None:
        conditions.append("oxygen_pct <= ?")
        params.append(max_o2)

    if provenance in ("psi_verified", "illustrative"):
        ph = ",".join(["?"] * len(PSI_VERIFIED_FAMILIES))
        op = "IN" if provenance == "psi_verified" else "NOT IN"
        conditions.append(f"dataset_family {op} ({ph})")
        params.extend(PSI_VERIFIED_FAMILIES)

    where_clause = " AND ".join(conditions)

    # Allowed sort columns
    allowed_sorts = {
        "experiment_id": "experiment_id",
        "dataset_family": "dataset_family",
        "fuel_material": "fuel_material",
        "oxygen_pct": "oxygen_pct",
        "pressure_kpa": "pressure_kpa",
        "burn_time_s": "burn_time_s",
        "extinction_diameter_mm": "extinction_diameter_mm",
        "airflow_velocity_cms": "airflow_velocity_cms",
        "co2_pct": "co2_pct",
        "he_pct": "he_pct",
        "facility_hardware": "facility_hardware"
    }
    sort_column = allowed_sorts.get(sort_by, "experiment_id")
    sort_direction = "DESC" if sort_dir.upper() == "DESC" else "ASC"

    # Count total matches
    count_sql = f"SELECT COUNT(*) FROM canonical_experiments WHERE {where_clause}"
    cursor.execute(count_sql, params)
    total_matches = cursor.fetchone()[0]

    # Fetch paginated results
    offset = (page - 1) * limit
    data_sql = f"""
        SELECT * FROM canonical_experiments 
        WHERE {where_clause} 
        ORDER BY {sort_column} {sort_direction} 
        LIMIT ? OFFSET ?
    """
    cursor.execute(data_sql, params + [limit, offset])
    rows = [_with_provenance(dict(r)) for r in cursor.fetchall()]

    conn.close()

    return {
        "total": total_matches,
        "page": page,
        "limit": limit,
        "total_pages": math.ceil(total_matches / limit) if limit > 0 else 1,
        "experiments": rows
    }


def get_experiment_by_id(experiment_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a single experiment by unique ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM canonical_experiments WHERE experiment_id = ?", (experiment_id,))
    row = cursor.fetchone()
    conn.close()
    return _with_provenance(dict(row)) if row else None


def compare_experiments(experiment_ids: List[str]) -> Dict[str, Any]:
    """Perform side-by-side metric comparison for 2 to 4 experiments."""
    if not experiment_ids:
        return {"experiments": [], "metrics": {}}

    conn = get_db_connection()
    cursor = conn.cursor()
    placeholders = ",".join(["?"] * len(experiment_ids))
    cursor.execute(f"SELECT * FROM canonical_experiments WHERE experiment_id IN ({placeholders})", experiment_ids)
    rows = [_with_provenance(dict(r)) for r in cursor.fetchall()]
    conn.close()

    if not rows:
        return {"experiments": [], "metrics": {}}

    # Calculate comparative statistics
    o2_values = [r["oxygen_pct"] for r in rows if r.get("oxygen_pct") is not None]
    burn_times = [r["burn_time_s"] for r in rows if r.get("burn_time_s") is not None]
    de_values = [r["extinction_diameter_mm"] for r in rows if r.get("extinction_diameter_mm") is not None]

    return {
        "experiments": rows,
        "comparison_summary": {
            "count": len(rows),
            "max_o2": max(o2_values) if o2_values else None,
            "min_o2": min(o2_values) if o2_values else None,
            "max_burn_time": max(burn_times) if burn_times else None,
            "min_burn_time": min(burn_times) if burn_times else None,
            "max_de": max(de_values) if de_values else None,
            "min_de": min(de_values) if de_values else None
        }
    }


def get_investigation_rankings(environment_id: str = "lunar_habitat") -> Dict[str, Any]:
    """
    SI Investigation Ranking Engine:
    Ranks all NASA PSI microgravity and 1g-bounding combustion investigations by scientific relevance
    (0–100%) for a selected mission environment (Space Station /ISS, Spacecraft Capsule, Lunar Base 0.16g,
    Martian Base 0.38g, Pressurized Rover >=30% O2 <=10.2 psi, EVA Spacesuit 85-100% O2).
    Also computes the 0g–1g Partial-Gravity Bounding Envelope (pending LUCI & FM2).
    """
    env_key = (environment_id or "lunar_habitat").lower()
    if env_key in ("space_station", "iss"):
        env_key = "iss"
    elif env_key in ("lunar_base", "lunar_habitat", "moon"):
        env_key = "lunar_habitat"
    elif env_key in ("martian_base", "mars_habitat", "mars"):
        env_key = "mars_habitat"
    elif env_key in ("spacecraft", "capsule", "orion"):
        env_key = "spacecraft"
    elif env_key in ("rover", "lunar_rover", "mars_rover"):
        env_key = "rover"
    elif env_key in ("eva", "eva_suit", "spacesuit"):
        env_key = "eva_suit"
    elif env_key in ("lunar_hypoxic", "hypoxic"):
        env_key = "lunar_hypoxic"
    else:
        env_key = "lunar_habitat"

    # Base investigation catalog with facility hardware, sensors, and environment-specific relevance scores
    # Strictly the 6 official NASA Space Apps Challenge ("Flame in Freefall") investigation groups
    catalog = [
        {
            "investigation": "SAFFIRE-I, -II & -III",
            "psi_id": "PSI-98 / Cygnus",
            "facility": "Cygnus Autonomous Spacecraft (Large-Scale Flow Duct)",
            "fuel_geometry": "Large-scale 0.4×0.94 m SIBAL cotton-fiberglass & PMMA samples (9 samples in SAFFIRE-II)",
            "diagnostics": "Thermocouple arrays, radiometers, O2/CO2/CO cabin sensors, high-res video",
            "objective_en": "Large-scale spacecraft fire propagation, oxygen limit testing, and cabin pressure response aboard autonomous Cygnus vehicles.",
            "objective_az": "Avtonom Cygnus kosmik gəmisində iri miqyaslı alov yayılması, oksigen həddi sınaqları və kabin təzyiqi reaksiyasının tədqiqi.",
            "scores": {"iss": 95, "spacecraft": 99, "lunar_habitat": 98, "mars_habitat": 95, "rover": 94, "eva_suit": 72},
            "rationale_en": "Directly demonstrates large-scale spacecraft fire propagation and oxygen consumption limits aboard an actual flight vehicle.",
            "rationale_az": "Real kosmik gəmidə iri miqyaslı yanğın yayılmasını və oksigen sərfiyyatı hədlərini birbaşa nümayiş etdirir."
        },
        {
            "investigation": "BASS & BASS-II",
            "psi_id": "PSI-25 / MSG",
            "facility": "ISS MSG (Microgravity Science Glovebox — SPICE Flow Duct)",
            "fuel_geometry": "Flat fabrics (SIBAL), PMMA slabs, rods, and spheres under forced flow (0–55 cm/s)",
            "diagnostics": "Hot-wire anemometer, radiometer, still/video cameras, exhaust gas analysis",
            "objective_en": "Solid fuel ignition, concurrent/opposed flame spread, and extinction limits as a function of low-velocity ventilation airflow.",
            "objective_az": "Aşağı sürətli ventilyasiya axınında (0–55 sm/s) bərk materialların alovlanması, yayılması və sönmə hədlərinin təyini.",
            "scores": {"iss": 97, "spacecraft": 94, "lunar_habitat": 96, "mars_habitat": 95, "rover": 92, "eva_suit": 78},
            "rationale_en": "Demonstrates that forced convective flow (5–15 cm/s) in microgravity mimics buoyant drafts (0.16g Moon ~ 12 cm/s, 0.38g Mars ~ 18 cm/s) and lowers MOC below 1g!",
            "rationale_az": "Mikroyerçəkimdə 5–15 sm/s məcburi hava axınının Ay (0.16g ~ 12 sm/s) və Mars (0.38g ~ 18 sm/s) konveksiyasını təqlid etdiyini və minimal O2 həddini 1g-dən aşağı saldığını göstərir."
        },
        {
            "investigation": "SAME, SAME-R, DAFT & DAFT-2",
            "psi_id": "PSI-SAME / PSI-DAFT",
            "facility": "ISS MSG (Microgravity Science Glovebox — Enclosed Aerosol Chamber)",
            "fuel_geometry": "Overheated wire insulation (Kapton, Teflon, Silicone, Cellulose) + Lunar/Martian dust simulants",
            "diagnostics": "3-channel PAMS aerosol monitor, ionization & photoelectric ISS smoke detectors, thermal precipitator TEM",
            "objective_en": "Characterize microgravity smoke particle size distribution, aging/aggregation, and discriminate planetary regolith dust from real fire smoke.",
            "objective_az": "Mikroyerçəkimdə tüstü hissəciklərinin ölçüsünü, koaqulyasiyasını təyin etmək və Ay/Mars tozunu real yanğın tüstüsündən fərqləndirmək.",
            "scores": {"iss": 94, "spacecraft": 91, "lunar_habitat": 97, "mars_habitat": 97, "rover": 98, "eva_suit": 75},
            "rationale_en": "Highest priority for Lunar Base, Martian Base, and Pressurized Rovers where crew EVA suits bring fine regolith dust indoors that can cause nuisance alarms.",
            "rationale_az": "Ay/Mars bazaları və Təzyiqli Roverlər üçün ən kritik tədqiqatdır — skafandrlardan kabinə daxil olan reqolit tozunun tüstü detektorlarında yalançı həyəcan verməsinin qarşısını alır."
        },
        {
            "investigation": "FLEX, FLEX-2 & CFI",
            "psi_id": "PSI-69 / PSI-70",
            "facility": "ISS CIR (MDCA Multi-user Droplet Combustion Apparatus)",
            "fuel_geometry": "Isolated spherical liquid droplets (1.5–5.0 mm: n-Heptane, Methanol, Ethanol, Decane)",
            "diagnostics": "Backlit strobe microscopy, UV/IR radiometers, LLUV low-light cameras, O2/CO2/He gas manifold",
            "objective_en": "Spherical droplet burning rates, radiative quenching (d_e), cool-flame two-stage chemistry (600–800 K), and CO2 (up to 70%) / He (up to 45%) fire suppression.",
            "objective_az": "Kürəvi damcı yanma sürəti, radiativ sönmə (d_e), soyuq alov (600–800 K) kimyası və CO2 (70%-dək) / He (45%-dək) qazları ilə yanğınsöndürmə.",
            "scores": {"iss": 96, "spacecraft": 89, "lunar_habitat": 86, "mars_habitat": 90, "rover": 82, "eva_suit": 70},
            "rationale_en": "Provides exact CO2 (up to 70%) and Helium (up to 45%) inert-gas dilution extinguishing limits for ISS CO2 extinguishers and exploration suppression systems.",
            "rationale_az": "BKS-dəki CO2 balonları və kəşfiyyat yanğınsöndürmə sistemləri üçün dəqiq CO2 (70%-dək) və Helium (45%-dək) sönmə hədlərini verir."
        },
        {
            "investigation": "ACME Suite (BRE, CFI-G, E-FIELD, CLD, s-Flame)",
            "psi_id": "PSI-112 / CIR",
            "facility": "ISS CIR (ACME Modular Gas Burner Hardware)",
            "fuel_geometry": "Porous flat plug (BRE), spherical porous burner (CFI-G up to 85% O2), coflow nozzle (E-FIELD/CLD)",
            "diagnostics": "OH*/CH* chemiluminescence, intensified CCD, +5 kV electric field mesh, radiometers, thermophoretic soot samplers",
            "objective_en": "Simulating solid material flammability via gas burner (BRE), inside-out flames up to 85% O2 (CFI-G), and electric-field partial-gravity mimicry (E-FIELD).",
            "objective_az": "Qaz brülörü ilə bərk material yanıcılığının simulyasiyası (BRE), 85% O2-də tərs alovlar (CFI-G) və elektrik sahəsi ilə qismən cazibə təqlidi (E-FIELD).",
            "scores": {"iss": 92, "spacecraft": 90, "lunar_habitat": 95, "mars_habitat": 94, "rover": 95, "eva_suit": 99},
            "rationale_en": "ACME BRE simulates solid material flammability, CFI-G tested up to 85% O2 (highest in space — critical for ≥30% O2 rovers & EVA suits), and E-FIELD mimicked partial gravity via electric field!",
            "rationale_az": "ACME BRE bərk materialların yanıcılığını simulyasiya edir, CFI-G kosmosda ən yüksək 85% O2 həddini sınaqdan keçirib (rover və EVA skafandrı üçün kritik), E-FIELD isə elektrik sahəsi ilə qismən cazibəni təqlid edib!"
        },
        {
            "investigation": "SPICE & SLICE",
            "psi_id": "PSI-SPICE / PSI-SLICE",
            "facility": "ISS MSG (Microgravity Science Glovebox — SPICE Flow Duct)",
            "fuel_geometry": "Circular nozzles (1.6–4.0 mm) issuing laminar gas jets (CH4, C2H4, C3H8) in co-flowing air",
            "diagnostics": "Color still/video cameras, radiometers, thermocouple rakes, hot-wire anemometer",
            "objective_en": "Laminar diffusion flame liftoff, blowout limits, and soot smoke-point transitions in forced co-flow using the MSG flow duct also shared with BASS.",
            "objective_az": "BASS ilə ortaq istifadə edilən MSG axın kanalında laminar diffuziya alovunun qopması (liftoff), sönməsi və his nöqtəsi (smoke point) keçidləri.",
            "scores": {"iss": 88, "spacecraft": 84, "lunar_habitat": 83, "mars_habitat": 84, "rover": 81, "eva_suit": 68},
            "rationale_en": "Establishes soot radiative loss fractions and convective blowout velocities in the modular MSG fan-driven flow duct.",
            "rationale_az": "Modulyar MSG ventilyatorlu axın kanalında his radiasiya itkilərini və konvektiv üfürülmə (blowout) sürətlərini müəyyən edir."
        }
    ]

    ranked = []
    for item in catalog:
        score = item["scores"].get(env_key, 85)
        ranked.append({
            "investigation": item["investigation"],
            "psi_id": item["psi_id"],
            "facility": item["facility"],
            "fuel_geometry": item["fuel_geometry"],
            "diagnostics": item["diagnostics"],
            "relevance_score": score,
            "tier": "TIER 1 — CRITICAL PRIMARY" if score >= 93 else ("TIER 2 — HIGH SUPPORTING" if score >= 85 else "TIER 3 — BASELINE BOUNDING"),
            "objective_en": item["objective_en"],
            "objective_az": item["objective_az"],
            "rationale_en": item["rationale_en"],
            "rationale_az": item["rationale_az"]
        })

    ranked.sort(key=lambda x: x["relevance_score"], reverse=True)
    for idx, r in enumerate(ranked, 1):
        r["rank"] = idx

    # Partial-Gravity 0g–1g Bounding Physics Model (u_buoyancy ~ sqrt(g * beta * dT * L))
    gravity_map = {
        "iss": {"g_level": 0.0, "label": "Microgravity (~0g)", "eq_buoyant_flow_cms": 0.0, "moc_pmma_pct": 17.5},
        "spacecraft": {"g_level": 0.0, "label": "Microgravity (~0g Transit)", "eq_buoyant_flow_cms": 0.0, "moc_pmma_pct": 17.0},
        "lunar_habitat": {"g_level": 0.16, "label": "Lunar Partial Gravity (0.16g)", "eq_buoyant_flow_cms": 12.2, "moc_pmma_pct": 14.8},
        "mars_habitat": {"g_level": 0.38, "label": "Martian Partial Gravity (0.38g)", "eq_buoyant_flow_cms": 18.8, "moc_pmma_pct": 15.4},
        "rover": {"g_level": 0.16, "label": "Lunar/Mars Surface Rover (0.16g–0.38g)", "eq_buoyant_flow_cms": 12.2, "moc_pmma_pct": 14.8},
        "eva_suit": {"g_level": 0.16, "label": "EVA Suitlock / Surface (0.0g–0.16g)", "eq_buoyant_flow_cms": 8.5, "moc_pmma_pct": 13.5},
        "lunar_hypoxic": {"g_level": 0.16, "label": "Hypoxic Safe-Haven (0.16g)", "eq_buoyant_flow_cms": 12.2, "moc_pmma_pct": 14.8}
    }
    g_info = gravity_map.get(env_key, gravity_map["lunar_habitat"])

    return {
        "environment_id": env_key,
        "rankings": ranked,
        "partial_gravity_bounding": {
            "psi_status_note_en": (
                "Official NASA PSI Note: There is currently no raw partial-gravity combustion flight data in PSI "
                "(expected in future from LUCI and FM2). Partial gravity was mimicked in ACME E-FIELD Flames via electric body forces. "
                "FIRE-X bounds intermediate gravity (0.16g Moon, 0.38g Mars) between 0g ISS forced-flow PSI data and 1.0g NASA-STD-6001 upward screening."
            ),
            "psi_status_note_az": (
                "Rəsmi NASA PSI Qeydi: Hazırda PSI bazasında birbaşa qismən cazibə (partial-gravity) uçuş datası yoxdur "
                "(gələcəkdə LUCI və FM2 tədqiqatlarından əlavə ediləcək). Qismən cazibə ACME E-FIELD eksperimentində elektrik sahəsi ilə təqlid edilmişdir. "
                "FIRE-X aralıq cazibəni (0.16g Ay, 0.38g Mars) 0g BKS məcburi axın datası ilə 1.0g NASA-STD-6001 sınaqları arasında hüdudlayır (bounding)."
            ),
            "target_gravity": g_info["label"],
            "g_fraction": g_info["g_level"],
            "equivalent_buoyant_velocity_cms": g_info["eq_buoyant_flow_cms"],
            "bounds": {
                "lower_0g_stagnant_moc_pct": 21.0,
                "lower_0g_forced_flow_5_15cms_moc_pct": 14.8,
                "partial_g_bounded_moc_pct": g_info["moc_pmma_pct"],
                "upper_1g_normal_gravity_moc_pct": 16.8
            },
            "key_paradox_en": (
                "Partial-Gravity Flammability Dip: At 0.16g (Moon), natural buoyancy induces a ~12.2 cm/s convective draft "
                "that replenishes oxygen faster than in 0g stagnant air while avoiding the heavy convective cooling of 1.0g Earth air — "
                "making materials MORE flammable at 0.16g than at either 0g (stagnant) or 1.0g!"
            ),
            "key_paradox_az": (
                "Qismən Cazibə Paradoksu: 0.16g-də (Ay) təbii arximed qüvvəsi ~12.2 sm/s konvektiv axın yaradır; bu axın alova 0g durğun havadan "
                "daha sürətlə oksigen gətirir, lakin 1.0g Yerdəki kimi güclü istilik soyutması yaratmır — nəticədə materiallar 0.16g-də həm 0g, həm də 1.0g-dən DAHA TEZ alışır!"
            )
        }
    }


def calculate_mission_scenario(scenario_id: str, custom_o2: Optional[float] = None, custom_pressure: Optional[float] = None) -> Dict[str, Any]:
    """
    Simulates atmospheric fire hazard metrics for predefined and custom planetary spaceflight environments.
    Includes Spacecraft, Space Station (ISS), Lunar Base (0.16g), Martian Base (0.38g),
    Pressurized Rover (>=30% O2, <=10.2 psia), EVA Spacesuit (85-100% O2, 4.3 psia), and Hypoxic Safe-Haven.
    """
    scenarios = {
        "iss": {
            "id": "iss",
            "name_en": "ISS / Space Station (0g)",
            "name_az": "BKS / Kosmik Stansiya (0g)",
            "oxygen_pct": 21.0,
            "pressure_kpa": 101.3,
            "pressure_psia": 14.7,
            "gravity_g": 0.0,
            "description_en": "Earth sea-level equivalent air mixture (21% O2, 101.3 kPa) maintained inside International Space Station pressurized modules.",
            "description_az": "Beynəlxalq Kosmik Stansiyanın təzyiqli modullarında saxlanılan Yer dəniz səviyyəsinə bərabər hava qarışığı (21% O2, 101.3 kPa).",
            "baseline_risk": "NOMINAL"
        },
        "spacecraft": {
            "id": "spacecraft",
            "name_en": "Orion / Crew Spacecraft Cabin (0g)",
            "name_az": "Orion / Ekipaj Kosmik Gəmisi (0g)",
            "oxygen_pct": 26.5,
            "pressure_kpa": 70.3,
            "pressure_psia": 10.2,
            "gravity_g": 0.0,
            "description_en": "Transit spacecraft cabin atmosphere (26.5% O2 at 10.2 psia / 70.3 kPa) balancing crew normoxia and EVA pre-breathe staging.",
            "description_az": "Ekipaj normoksiyasını və EVA hazırlığını balanslaşdıran tranzit kosmik gəmi atmosferi (26.5% O2, 10.2 psia / 70.3 kPa).",
            "baseline_risk": "MODERATE"
        },
        "lunar_habitat": {
            "id": "lunar_habitat",
            "name_en": "Artemis Lunar Base (0.16g)",
            "name_az": "Artemis Ay Bazası (0.16g)",
            "oxygen_pct": 34.0,
            "pressure_kpa": 56.5,
            "pressure_psia": 8.2,
            "gravity_g": 0.16,
            "description_en": "NASA Exploration Atmosphere (34% O2, 8.2 psia / 56.5 kPa) on the Lunar surface (0.16g) for rapid EVA transitions without decompression sickness.",
            "description_az": "Dekompressiya xəstəliyi olmadan sürətli EVA çıxışları üçün Ay səthində (0.16g) tətbiq edilən NASA Kəşfiyyat Atmosferi (34% O2, 8.2 psia).",
            "baseline_risk": "ELEVATED"
        },
        "mars_habitat": {
            "id": "mars_habitat",
            "name_en": "Martian Surface Habitat (0.38g)",
            "name_az": "Mars Səth Bazası (0.38g)",
            "oxygen_pct": 34.0,
            "pressure_kpa": 56.5,
            "pressure_psia": 8.2,
            "gravity_g": 0.38,
            "description_en": "Martian surface habitat (0.38g, 34% O2 at 56.5 kPa) where stronger buoyant plumes (~18.8 cm/s) accelerate upward flame spread; local CO2 atmosphere available for suppression.",
            "description_az": "Mars səth bazası (0.38g, 34% O2, 56.5 kPa) — güclü konvektiv axın (~18.8 sm/s) yuxarı alov yayılmasını sürətləndirir; söndürmə üçün yerli CO2 atmosferi mövcuddur.",
            "baseline_risk": "ELEVATED"
        },
        "rover": {
            "id": "rover",
            "name_en": "Pressurized Lunar/Mars Rover (≥30% O₂, ≤10.2 psi)",
            "name_az": "Təzyiqli Ay/Mars Roveri (≥30% O₂, ≤10.2 psi)",
            "oxygen_pct": 32.0,
            "pressure_kpa": 70.3,
            "pressure_psia": 10.2,
            "gravity_g": 0.16,
            "description_en": "Compact pressurized exploration rover (32% O2, 10.2 psia / 70.3 kPa) with high wiring density, frequent suitlock cycling, and heavy lunar/Martian dust intrusion.",
            "description_az": "Yüksək kabel sıxlığı, tez-tez şlüz dövriyyəsi və intensiv Ay/Mars tozu təsiri altında işləyən kompakt təzyiqli kəşfiyyat roveri (32% O2, 10.2 psia).",
            "baseline_risk": "ELEVATED"
        },
        "eva_suit": {
            "id": "eva_suit",
            "name_en": "EVA Spacesuit (85%–100% O₂, 4.3 psi)",
            "name_az": "EVA Skafandrı (85%–100% O₂, 4.3 psi)",
            "oxygen_pct": 85.0,
            "pressure_kpa": 29.6,
            "pressure_psia": 4.3,
            "gravity_g": 0.16,
            "description_en": "Pure/near-pure oxygen EVA spacesuit environment (85% O2 test bound from ACME CFI-G up to 100% O2 at 4.3 psia / 29.6 kPa); requires strict PTFE/Beta-cloth/Nomex material controls.",
            "description_az": "Təmiz/yüksək oksigenli EVA skafandr mühiti (ACME CFI-G 85% O2 sərhədindən 100% O2, 4.3 psia / 29.6 kPa-dək); ciddi PTFE/Beta-parça/Nomex izolyasiyası tələb edir.",
            "baseline_risk": "CRITICAL"
        }
    }

    if scenario_id == "custom":
        o2 = custom_o2 if custom_o2 is not None else 21.0
        pres = custom_pressure if custom_pressure is not None else 101.3
        scenario_data = {
            "id": "custom",
            "name_en": "Custom Spacecraft Atmosphere",
            "name_az": "Fərdiləşdirilmiş Kosmik Gəmi Atmosferi",
            "oxygen_pct": o2,
            "pressure_kpa": pres,
            "pressure_psia": round(pres * 0.145038, 2),
            "gravity_g": 0.0,
            "description_en": "Custom user-defined environmental chamber parameters (supports up to 100% O2 including ACME CFI-G 85% O2 and EVA suit regimes).",
            "description_az": "İstifadəçi tərəfindən təyin edilmiş xüsusi atmosfer kamerası parametrləri (ACME CFI-G 85% O2 və 100% O2 EVA skafandr rejimini dəstəkləyir).",
            "baseline_risk": "CUSTOM"
        }
    else:
        scenario_data = scenarios.get(scenario_id, scenarios["iss"])
        o2 = scenario_data["oxygen_pct"]
        pres = scenario_data["pressure_kpa"]

    po2_kpa = (o2 / 100.0) * pres
    x_o2 = o2 / 100.0
    oef = (x_o2 / 0.21) ** 1.5
    pf  = (pres / 101.3) ** 0.4
    mf  = 1.0
    fhi_raw = 5.1 * oef * pf * mf
    fhi = min(10.0, max(0.5, round(fhi_raw, 1)))

    if fhi < 3.5:
        risk_level = "LOW / SUPPRESSED"
        risk_level_az = "AŞAĞI / BOĞULMUŞ"
        status_color = "#10B981"
    elif fhi < 6.5:
        risk_level = "MODERATE / NOMINAL"
        risk_level_az = "MÖTƏDİL / NOMİNAL"
        status_color = "#3B82F6"
    elif fhi < 8.5:
        risk_level = "ELEVATED HAZARD"
        risk_level_az = "YÜKSƏK TƏHLÜKƏ"
        status_color = "#F59E0B"
    else:
        risk_level = "CRITICAL FLAMMABILITY"
        risk_level_az = "KRİTİK ALOVLANMA"
        status_color = "#EF4444"

    projected_de_mm = max(0.45, round(2.85 * math.exp(-0.038 * o2), 3))
    burn_rate_multiplier = round((o2 / 21.0) ** 1.35 * (pres / 101.3) ** 0.25, 2)
    required_n2_purge_pct = round(max(0.0, (o2 - 14.5) * 1.8), 1)

    ranking_bundle = get_investigation_rankings(scenario_data["id"])

    return {
        "scenario": scenario_data,
        "fire_hazard_index": fhi,
        "risk_level_en": risk_level,
        "risk_level_az": risk_level_az,
        "status_color": status_color,
        "metrics": {
            "oxygen_pct": o2,
            "pressure_kpa": pres,
            "oxygen_partial_pressure_kpa": round(po2_kpa, 2),
            "projected_extinction_diameter_mm": projected_de_mm,
            "burn_rate_multiplier": burn_rate_multiplier,
            "required_inert_purge_pct": required_n2_purge_pct
        },
        "investigation_rankings": ranking_bundle["rankings"],
        "partial_gravity_bounding": ranking_bundle["partial_gravity_bounding"],
        "advisory_en": (
            f"Under {o2}% O2 at {pres} kPa ({scenario_data['pressure_psia']} psia), flame propagation velocity is {burn_rate_multiplier}x baseline "
            f"and droplet extinction diameter drops to {projected_de_mm} mm. "
            f"Top-ranked NASA PSI reference: {ranking_bundle['rankings'][0]['investigation']} ({ranking_bundle['rankings'][0]['relevance_score']}% match). "
            f"Partial-gravity risk is bounded between 0g ISS forced-flow data and 1.0g NASA-STD-6001 Test 1."
        ),
        "advisory_az": (
            f"{pres} kPa ({scenario_data['pressure_psia']} psia) təzyiqdə və {o2}% O2 mühitində alovun yayılma sürəti baza rejimindən {burn_rate_multiplier}x dəfə çoxdur, "
            f"sönmə diametri isə {projected_de_mm} mm-ə enir. "
            f"Ən uyğun NASA PSI tədqiqatı: {ranking_bundle['rankings'][0]['investigation']} ({ranking_bundle['rankings'][0]['relevance_score']}% uyğunluq). "
            f"Qismən cazibə riski 0g BKS məcburi axın datası ilə 1.0g NASA-STD-6001 Test 1 arasında hüdudlanır."
        )
    }

