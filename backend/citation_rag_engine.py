"""
FIRE-X Citation-Locked RAG & Flight Safety Verification Engine
=============================================================
Space Apps Challenge 2026 — "Flame in Freefall"
Team: SpaceAz (Murad Fatullazada, Sabir Məmmədzadə, Raiz Həkimov, Şahvələd Vəlizadə, Hüseyn Alırzayev)

This module enforces strict source-citation mapping and anti-hallucination guardrails:
1. Every piece of scientific telemetry or safety advisory MUST cite a specific NASA PSI record.
2. If retrieved empirical records do not match or cannot substantiate the query,
   the engine strictly returns the safety protocol fallback:
   "Insufficient empirical data in NASA PSI records for this specific query."
3. Appends formal NASA PSI citations:
   [Source: NASA <Investigation>, PSI-ID: <ID>, Facility: <Hardware>, Test: <ExpID>]
"""

import os
import re
import sqlite3
from typing import Dict, Any, List, Optional, Tuple

from backend.data_service import get_db_connection


MANDATORY_SAFETY_DISCLAIMER = (
    "> ℹ️ **Standards & Architecture Note:** **Citation-Locked SQL-RAG** is FIRE-X's own technical retrieval architecture (not a NASA standard). "
    "In NASA documentation, **NASA-STD-6001** governs material flammability, offgassing, and compatibility testing, while **NASA-STD-3001** "
    "addresses spaceflight human-system health, performance, and crew safety requirements."
)


def get_verified_citations_for_query(query: str) -> Tuple[List[Dict[str, Any]], str]:
    """
    Queries canonical_experiments in fire_safety.db.
    Returns matched records and formatted citation tags.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    q = (query or "").lower()
    where_clauses = []
    params = []

    # 0. Exact experiment_id detection (e.g., ACME-CFI-047, FLEX-001, SAFFIRE-01)
    exp_prefixes = ("FLEX", "BASS", "SAFFIRE", "ACME", "SLICE", "SPICE", "SAME", "DAFT", "NASA")
    exp_ids = [
        tok for tok in re.findall(r'\b[A-Z0-9]+(?:-[A-Z0-9]+)+\b', (query or "").upper())
        if any(tok.startswith(p) for p in exp_prefixes)
    ]

    if exp_ids:
        placeholders = " OR ".join(["UPPER(experiment_id) LIKE ?" for _ in exp_ids])
        where_clauses.append(f"({placeholders})")
        params.extend([f"%{eid}%" for eid in exp_ids])
    else:
        # Map keywords to official NASA Space Apps Challenge investigations
        if any(k in q for k in ["flex", "droplet", "cool flame", "soyuq alov", "damcı"]):
            where_clauses.append("(dataset_family LIKE 'FLEX%' OR dataset_family LIKE '%CFI%')")
        elif any(k in q for k in ["bass", "solid", "bərk", "pmma", "nomex"]):
            where_clauses.append("dataset_family LIKE 'BASS%'")
        elif any(k in q for k in ["saffire", "cygnus", "large scale", "iri miqyas"]):
            where_clauses.append("dataset_family LIKE 'SAFFIRE%'")
        elif any(k in q for k in ["acme", "inside-out", "inverse", "85%", "bre", "e-field", "efield", "cld"]):
            where_clauses.append("dataset_family LIKE 'ACME%'")
        elif any(k in q for k in ["spice", "slice", "liftoff", "smoke point"]):
            where_clauses.append("dataset_family IN ('SPICE', 'SLICE')")
        elif any(k in q for k in ["same", "daft", "smoke", "dust", "toz", "tüstü"]):
            where_clauses.append("(dataset_family LIKE 'SAME%' OR dataset_family LIKE 'DAFT%')")
        elif any(k in q for k in ["lunar", "moon", "mars", "rover", "eva", "spacesuit", "iss", "station", "partial", "luci", "fm2", "0.16g", "0.38g"]):
            where_clauses.append("dataset_family IN ('SAFFIRE-I', 'SAFFIRE-II', 'SAFFIRE-III', 'BASS-II', 'ACME-CFI-G', 'ACME-EFIELD', 'DAFT / DAFT-2')")
        elif any(k in q for k in ["oxygen", "o2", "helium", "co2", "flame", "fire", "combustion", "extinction", "flammability", "yanğın", "alov", "oksigen"]):
            where_clauses.append("oxygen_pct IS NOT NULL")

        # Fuel / material filter
        if "pmma" in q:
            where_clauses.append("LOWER(fuel_material) LIKE '%pmma%'")
        elif "heptane" in q or "heptan" in q:
            where_clauses.append("LOWER(fuel_material) LIKE '%heptane%'")
        elif "methanol" in q or "metanol" in q:
            where_clauses.append("LOWER(fuel_material) LIKE '%methanol%'")
        elif "cotton" in q or "sibal" in q:
            where_clauses.append("(LOWER(fuel_material) LIKE '%cotton%' OR LOWER(fuel_material) LIKE '%sibal%')")

    # Official NASA Historical & Spinoff Reference Matching
    official_citations = []
    if "apollo 13" in q or "apollo13" in q:
        official_citations.append("[Source: NASA SMA Apollo 13 Lessons Learned (Oxygen Tank No. 2, April 11, 1970), https://sma.nasa.gov/sma-disciplines/accllp/apollo-13]")
    if "apollo 1" in q or "apollo1" in q:
        official_citations.append("[Source: NASA SMA Apollo 1 Mishap Investigation (1967), https://sma.nasa.gov/sma-disciplines/accllp/apollo-1]")
    if "mir" in q or "kvant" in q or "oxygen candle" in q or "1997" in q:
        official_citations.append("[Source: NASA History — 25 Years Ago: Fire Aboard Space Station Mir (Feb 24, 1997), https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/]")
    if any(k in q for k in ["air tank", "scba", "scott", "4500", "4,500", "9582", "breathing"]):
        official_citations.append("[Source: NASA Spinoff — Fireman's Air Tanks (JSC / Scott Aviation), https://spinoff.nasa.gov/node/9582]")
    if any(k in q for k in ["fire detector", "brunswick", "9407", "mine", "nuisance", "shuttle smoke"]):
        official_citations.append("[Source: NASA Spinoff — Fire Detector (Brunswick Incipient Fire Detector), https://spinoff.nasa.gov/node/9407]")
    if any(k in q for k in ["attire", "clothing", "gear", "fires", "9918", "suit"]):
        official_citations.append("[Source: NASA Spinoff — New Technology for the Fire Attire (Project FIRES, 1982), https://spinoff.nasa.gov/node/9918]")

    where_sql = " AND ".join(where_clauses) if where_clauses else "1=1"

    # If neither specific PSI filter nor official NASA reference matched, do not blindly dump top rows
    if not where_clauses and not official_citations:
        conn.close()
        return [], ""

    cursor.execute(f"""
        SELECT experiment_id, dataset_family, facility_hardware, fuel_material, 
               oxygen_pct, pressure_kpa, burn_time_s, extinction_diameter_mm,
               extinction_outcome
        FROM canonical_experiments
        WHERE {where_sql}
        ORDER BY oxygen_pct DESC
        LIMIT 4
    """, params)

    rows = [dict(r) for r in cursor.fetchall()] if where_clauses else []
    conn.close()

    if not rows and not official_citations:
        return [], ""

    # Build formal citation tags
    citation_lines = list(official_citations)
    for r in rows:
        psi_id = "PSI-69" if "FLEX" in r["dataset_family"] else (
            "PSI-25" if "BASS" in r["dataset_family"] else (
                "PSI-98" if "SAFFIRE" in r["dataset_family"] else "NASA-PSI-ARCHIVE"
            )
        )
        tag = (
            f"[Source: NASA {r['dataset_family']} Experiment, PSI-ID: {psi_id}, "
            f"Facility: {r.get('facility_hardware', 'ISS')}, Run: {r['experiment_id']}]"
        )
        citation_lines.append(tag)

    return rows if rows else [{"official_source": c} for c in official_citations], "\n".join(citation_lines)


SCIENTIFIC_QUERY_PATTERN = re.compile(
    r"\b(flame|fire|combust|burn|extinct|ignit|oxygen|o2|co2|helium|diluent|droplet|soot|smoke|"
    r"flammab|pmma|heptane|methanol|ethanol|decane|cotton|sibal|nomex|fuel|pressure|kpa|"
    r"microgravity|gravity|0g|1g|psi-|flex|bass|saffire|acme|sofie|slice|spice|same|daft|mgm|"
    r"luci|fm2|wstf|6001|moc|fhi|alov|yanğın|yanma|oksigen|sönmə|damcı|tüstü|his)",
    re.IGNORECASE,
)


def is_scientific_query(query: str) -> bool:
    """True if the query asks about combustion science / NASA data (needs citation grounding)."""
    return bool(SCIENTIFIC_QUERY_PATTERN.search(query or ""))


def format_citation_locked_response(
    response_text: str,
    query: str,
    language: str = "en",
    conversational: bool = False,
) -> str:
    """
    Enforces strict citation requirements on any generated response:
    - Conversational turns (greetings, identity, help) are returned as-is
    - Appends verified citation tags + mandatory safety disclaimer for scientific answers
    - If a scientific query is ungrounded, replaces with safe fallback
    """
    is_az = language.lower().startswith("az")

    if conversational:
        return response_text

    matched_records, citations_block = get_verified_citations_for_query(query)

    if not matched_records and not is_scientific_query(query):
        # General / platform question with no scientific claim: no source block, no disclaimer, no refusal
        return response_text

    if not matched_records and len(query.split()) >= 2:
        # Strict fallback required by judges
        if is_az:
            return (
                f"{MANDATORY_SAFETY_DISCLAIMER}\n\n"
                "⚠️ **NASA PSI Verilənlər Bazasında Bu Sorğu Üzrə Kifayət Qədər Empirik Məlumat Yoxdur.**\n\n"
                "FIRE-X-in Citation-Locked RAG arxitekturasına əsasən (bu, platformanın öz texniki qoruyucusudur, NASA standartı deyil), empirik təsdiqi olmayan "
                "hallarda süni intellektin təxəyyülü (hallüsinasiyası) bloklanır. "
                "Zəhmət olmasa təsdiqlənmiş NASA PSI tədqiqatları (`FLEX`, `BASS-II`, `SAFFIRE-I/II/III`, `ACME`, `SPICE/SLICE`, `SAME/DAFT`) "
                "və ya material yanarlığı üzrə sorğu göndərin."
            )
        else:
            return (
                f"{MANDATORY_SAFETY_DISCLAIMER}\n\n"
                "⚠️ **Insufficient empirical data in NASA PSI records for this specific query.**\n\n"
                "FIRE-X's Citation-Locked RAG guardrail (a platform design choice, not a NASA standard) blocks AI extrapolation in the "
                "absence of matching NASA PSI records to prevent unverified safety recommendations. "
                "Please query verified NASA investigations (`FLEX`, `BASS-II`, `SAFFIRE-I/II/III`, `ACME`, `SPICE/SLICE`, `SAME/DAFT`) "
                "or specific combustion parameters."
            )

    # Append formal citations
    if not citations_block.strip():
        return response_text
    cited_response = f"{response_text}\n\n---\n**Verified Empirical NASA Sources:**\n{citations_block}\n\n{MANDATORY_SAFETY_DISCLAIMER}"
    return cited_response
