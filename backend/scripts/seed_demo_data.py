import asyncio
import sys
import os
from datetime import datetime, timedelta
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import connect_to_mongo, close_mongo_connection, get_database
from app.core.logging import logger

DEMO_VERIFICATION = {
    "status": "synthetic_demo",
    "method": "seed_demo_script",
    "reviewed_by": "system",
    "reviewed_at": datetime.utcnow()
}

DEMO_SOURCE = {
    "name": "DEMO_SYNTHETIC",
    "url": "https://civicmemory.internal/demo",
    "file_id": None,
    "job_id": "JOB-DEMO-001",
    "record_id": "DEMO",
    "retrieved_at": datetime.utcnow(),
    "license_url": "https://opendatacommons.org/licenses/odbl/",
    "coverage": "Bengaluru Wards 140-198"
}

ASSETS = [
    {
        "asset_id": "RD-000101",
        "asset_type": "road_segment",
        "name": "Outer Ring Road (Bellandur Junction to Devarabeesanahalli)",
        "geometry": {
            "type": "LineString",
            "coordinates": [[77.6750, 12.9280], [77.6830, 12.9240], [77.6910, 12.9210]]
        },
        "location_text": "Outer Ring Road near EcoSpace tech park",
        "ward": "Ward 150 - Bellandur",
        "zone": "Mahadevapura",
        "criticality": {"value": "high", "source": "Traffic Volume Survey"},
        "source_ids": [{"source": "BBMP_GIS", "id": "ORR-BLD-01", "type": "road_corridor"}],
        "attributes": {"lanes": 6, "surface": "asphalt", "width_m": 24},
        "verification": DEMO_VERIFICATION,
        "source": DEMO_SOURCE,
        "latest_risk_score": 86.4,
        "latest_risk_tier": "critical",
        "complaint_count": 8,
        "open_complaint_count": 3,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "asset_id": "DR-000204",
        "asset_type": "drain",
        "name": "HSR Layout Sector 4 Primary Stormwater Drain",
        "geometry": {
            "type": "LineString",
            "coordinates": [[77.6320, 12.9120], [77.6380, 12.9140]]
        },
        "location_text": "14th Main Road, Sector 4, HSR Layout",
        "ward": "Ward 174 - HSR Layout",
        "zone": "Bommanahalli",
        "criticality": {"value": "high", "source": "Monsoon Flood Vulnerability Map"},
        "source_ids": [{"source": "BBMP_SWD", "id": "SWD-HSR-4", "type": "primary_drain"}],
        "attributes": {"depth_m": 2.5, "culvert_status": "partially_silted"},
        "verification": DEMO_VERIFICATION,
        "source": DEMO_SOURCE,
        "latest_risk_score": 78.2,
        "latest_risk_tier": "critical",
        "complaint_count": 5,
        "open_complaint_count": 2,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "asset_id": "SL-000305",
        "asset_type": "streetlight",
        "name": "Varthur Main Road LED Post #42",
        "geometry": {
            "type": "Point",
            "coordinates": [77.7120, 12.9560]
        },
        "location_text": "Opposite Government Primary School, Varthur",
        "ward": "Ward 149 - Varthur",
        "zone": "Mahadevapura",
        "criticality": {"value": "medium", "source": "Public Safety Audit"},
        "source_ids": [{"source": "BESCOM", "id": "POLE-VR-042", "type": "electric_pole"}],
        "attributes": {"wattage": 120, "lamp_type": "LED"},
        "verification": DEMO_VERIFICATION,
        "source": DEMO_SOURCE,
        "latest_risk_score": 42.0,
        "latest_risk_tier": "medium",
        "complaint_count": 3,
        "open_complaint_count": 1,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "asset_id": "FP-000412",
        "asset_type": "footpath",
        "name": "100 Feet Road Pedestrian Walkway",
        "geometry": {
            "type": "LineString",
            "coordinates": [[77.6410, 12.9620], [77.6430, 12.9680]]
        },
        "location_text": "Indiranagar 100 Feet Road, West Side",
        "ward": "Ward 112 - Domlur",
        "zone": "East",
        "criticality": {"value": "medium", "source": "Pedestrian Safety Audit"},
        "source_ids": [{"source": "TTP", "id": "FP-INDIRA-01", "type": "walkway"}],
        "attributes": {"width_m": 2.2, "paver_blocks": True},
        "verification": DEMO_VERIFICATION,
        "source": DEMO_SOURCE,
        "latest_risk_score": 62.5,
        "latest_risk_tier": "high",
        "complaint_count": 4,
        "open_complaint_count": 2,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "asset_id": "PT-000508",
        "asset_type": "public_toilet",
        "name": "Rajajinagar Metro Station E-Toilet Complex",
        "geometry": {
            "type": "Point",
            "coordinates": [77.5510, 12.9920]
        },
        "location_text": "Near Rajajinagar Entrance 2",
        "ward": "Ward 160 - Rajajinagar",
        "zone": "West",
        "criticality": {"value": "high", "source": "Swachh Bharat Facility Inventory"},
        "source_ids": [{"source": "SBM", "id": "PT-RAJ-01", "type": "public_sanitation"}],
        "attributes": {"stalls": 6, "water_supply": "continuous"},
        "verification": DEMO_VERIFICATION,
        "source": DEMO_SOURCE,
        "latest_risk_score": 35.0,
        "latest_risk_tier": "medium",
        "complaint_count": 2,
        "open_complaint_count": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

COMPLAINTS = [
    {
        "complaint_id": "BBMP-2025-0101",
        "source_record_id": "SAH-89410",
        "description_original": "Huge dangerous pothole right before Bellandur flyover on ORR, multiple two-wheelers slipping.",
        "language": {"code": "en", "confidence": 0.98, "detector": "fasttext"},
        "translation": {"text": None, "target_language": None, "method": None, "review_status": "not_translated"},
        "category": "road",
        "subcategory": "pothole",
        "status": "open",
        "reported_at": datetime.utcnow() - timedelta(days=2),
        "location": {"type": "Point", "coordinates": [77.6762, 12.9275]},
        "location_accuracy": "exact",
        "ward": "Ward 150 - Bellandur",
        "candidate_asset_ids": ["RD-000101"],
        "asset_id": "RD-000101",
        "asset_link_status": "confirmed",
        "attachments": ["IMG-00101A"],
        "verification": DEMO_VERIFICATION,
        "source": DEMO_SOURCE,
        "created_at": datetime.utcnow() - timedelta(days=2)
    },
    {
        "complaint_id": "BBMP-2025-0102",
        "source_record_id": "SAH-89415",
        "description_original": "ಬೆಳ್ಳಂದೂರು ಮುಖ್ಯ ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿ ಬಿದ್ದಿದೆ, ವಾಹನ ಸವಾರರಿಗೆ ತೀವ್ರ ತೊಂದರೆಯಾಗುತ್ತಿದೆ.",
        "language": {"code": "kn", "confidence": 0.99, "detector": "fasttext"},
        "translation": {
            "text": "A large pothole has developed on Bellandur Main Road, causing severe hardship to commuters.",
            "target_language": "en",
            "method": "bhashini_neural",
            "review_status": "machine_translated"
        },
        "category": "road",
        "subcategory": "pothole",
        "status": "in_progress",
        "reported_at": datetime.utcnow() - timedelta(days=5),
        "location": {"type": "Point", "coordinates": [77.6770, 12.9270]},
        "location_accuracy": "exact",
        "ward": "Ward 150 - Bellandur",
        "candidate_asset_ids": ["RD-000101"],
        "asset_id": "RD-000101",
        "asset_link_status": "confirmed",
        "attachments": ["IMG-00101B"],
        "verification": DEMO_VERIFICATION,
        "source": DEMO_SOURCE,
        "created_at": datetime.utcnow() - timedelta(days=5)
    },
    {
        "complaint_id": "BBMP-2025-0103",
        "source_record_id": "SAH-89422",
        "description_original": "एचएसआर लेआउट सेक्टर 4 में भारी बारिश के बाद नाला पूरी तरह जाम हो गया है और पानी सड़क पर भर रहा है।",
        "language": {"code": "hi", "confidence": 0.99, "detector": "fasttext"},
        "translation": {
            "text": "In HSR Layout Sector 4, following heavy rain, the drain is completely choked and water is flooding onto the road.",
            "target_language": "en",
            "method": "bhashini_neural",
            "review_status": "machine_translated"
        },
        "category": "drain",
        "subcategory": "drain_overflow",
        "status": "open",
        "reported_at": datetime.utcnow() - timedelta(days=1),
        "location": {"type": "Point", "coordinates": [77.6335, 12.9125]},
        "location_accuracy": "exact",
        "ward": "Ward 174 - HSR Layout",
        "candidate_asset_ids": ["DR-000204"],
        "asset_id": "DR-000204",
        "asset_link_status": "confirmed",
        "attachments": ["IMG-00204A"],
        "verification": DEMO_VERIFICATION,
        "source": DEMO_SOURCE,
        "created_at": datetime.utcnow() - timedelta(days=1)
    },
    {
        "complaint_id": "BBMP-2025-0104",
        "source_record_id": "SAH-89430",
        "description_original": "வர்த்தூர் பிரதான சாலையில் தெருவிளக்கு கடந்த 1 வாரமாக எரியவில்லை, இரவு நேரத்தில் மிகவும் ஆபத்தாக உள்ளது.",
        "language": {"code": "ta", "confidence": 0.99, "detector": "fasttext"},
        "translation": {
            "text": "Streetlight on Varthur Main Road has not been functioning for the past week, creating extreme danger at night.",
            "target_language": "en",
            "method": "bhashini_neural",
            "review_status": "machine_translated"
        },
        "category": "streetlight",
        "subcategory": "light_out",
        "status": "closed",
        "reported_at": datetime.utcnow() - timedelta(days=8),
        "closed_at": datetime.utcnow() - timedelta(days=3),
        "location": {"type": "Point", "coordinates": [77.7121, 12.9562]},
        "location_accuracy": "exact",
        "ward": "Ward 149 - Varthur",
        "candidate_asset_ids": ["SL-000305"],
        "asset_id": "SL-000305",
        "asset_link_status": "confirmed",
        "attachments": [],
        "verification": DEMO_VERIFICATION,
        "source": DEMO_SOURCE,
        "created_at": datetime.utcnow() - timedelta(days=8)
    },
    {
        "complaint_id": "BBMP-2025-0105",
        "source_record_id": "SAH-89445",
        "description_original": "ఇందిరానగర్ 100 ఫీట్ రోడ్డు ఫుట్‌పాత్ టైల్స్ విరిగిపోయాయి, నడవడానికి వీలు లేకుండా ఉంది.",
        "language": {"code": "te", "confidence": 0.99, "detector": "fasttext"},
        "translation": {
            "text": "Indiranagar 100 Feet Road footpath tiles are broken, making it impossible for pedestrians to walk.",
            "target_language": "en",
            "method": "bhashini_neural",
            "review_status": "machine_translated"
        },
        "category": "footpath",
        "subcategory": "broken_tiles",
        "status": "open",
        "reported_at": datetime.utcnow() - timedelta(days=4),
        "location": {"type": "Point", "coordinates": [77.6415, 12.9625]},
        "location_accuracy": "exact",
        "ward": "Ward 112 - Domlur",
        "candidate_asset_ids": ["FP-000412"],
        "asset_id": "FP-000412",
        "asset_link_status": "confirmed",
        "attachments": [],
        "verification": DEMO_VERIFICATION,
        "source": DEMO_SOURCE,
        "created_at": datetime.utcnow() - timedelta(days=4)
    }
]

CLUSTERS = [
    {
        "cluster_id": "CLU-2025-01",
        "member_complaint_ids": ["BBMP-2025-0101", "BBMP-2025-0102"],
        "candidate_asset_ids": ["RD-000101"],
        "time_start": datetime.utcnow() - timedelta(days=5),
        "time_end": datetime.utcnow() - timedelta(days=2),
        "centroid": {"type": "Point", "coordinates": [77.6766, 12.9272]},
        "algorithm": "HDBSCAN_spatial_temporal",
        "parameters": {"eps_spatial_m": 80, "eps_temporal_days": 7, "min_samples": 2},
        "model_version": "1.0.0",
        "review_status": "confirmed",
        "review_history": [
            {
                "decision": "confirmed",
                "reason": "Repeated pothole report at Bellandur junction across 3 days",
                "reviewer": "executive_engineer_east",
                "reviewed_at": datetime.utcnow() - timedelta(days=1)
            }
        ],
        "member_count": 2,
        "affected_assets_count": 1,
        "recurrence_interval_days": 3.0,
        "open_count": 1,
        "closed_count": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]

VISUAL_MATCHES = [
    {
        "visual_match_id": "VM-0001",
        "attachment_a_id": "IMG-00101A",
        "attachment_b_id": "IMG-00101B",
        "asset_a_id": "RD-000101",
        "asset_b_id": "RD-000101",
        "image_similarity": 0.884,
        "defect_class_agreement": True,
        "spatial_distance_m": 22.4,
        "date_gap_days": 3,
        "asset_id_match": True,
        "source_link_match": True,
        "composite_rank": 1,
        "candidate_type": "visual_recurrence_candidate",
        "model_version": "facebook/dinov2-base",
        "preprocessing_version": "1.0.0",
        "review_decision": "same_asset_recurrence",
        "review_reason": "Verified same pothole widening after light monsoon showers",
        "reviewed_by": "qa_officer",
        "reviewed_at": datetime.utcnow() - timedelta(hours=6),
        "review_history": [],
        "created_at": datetime.utcnow()
    }
]

IMAGE_DETECTIONS = [
    {
        "detection_id": "DET-00101A-1",
        "attachment_id": "IMG-00101A",
        "detector_name": "YOLOv8_RDD2022_adapter",
        "detector_version": "1.0.0",
        "class_id": "D40",
        "class_label": "pothole",
        "confidence": 0.94,
        "bbox_xyxy_normalized": [0.18, 0.35, 0.72, 0.88],
        "crop_attachment_id": "IMG-00101A-C1",
        "severity_proxy": "deep_depression",
        "inference_at": datetime.utcnow() - timedelta(days=2),
        "verification_status": "synthetic_demo"
    },
    {
        "detection_id": "DET-00101B-1",
        "attachment_id": "IMG-00101B",
        "detector_name": "YOLOv8_RDD2022_adapter",
        "detector_version": "1.0.0",
        "class_id": "D40",
        "class_label": "pothole",
        "confidence": 0.91,
        "bbox_xyxy_normalized": [0.22, 0.40, 0.65, 0.82],
        "crop_attachment_id": "IMG-00101B-C1",
        "severity_proxy": "moderate_depression",
        "inference_at": datetime.utcnow() - timedelta(days=5),
        "verification_status": "synthetic_demo"
    }
]

ATTACHMENTS = [
    {
        "attachment_id": "IMG-00101A",
        "gridfs_id": "GRID-IMG-001A",
        "parent_attachment_id": None,
        "kind": "original",
        "sha256": "8f4a3bc19e",
        "perceptual_hash": "a1b2c3d4e5f60718",
        "mime_type": "image/jpeg",
        "width": 1920,
        "height": 1080,
        "captured_at": datetime.utcnow() - timedelta(days=2),
        "uploaded_at": datetime.utcnow() - timedelta(days=2),
        "location": {"type": "Point", "coordinates": [77.6762, 12.9275]},
        "location_accuracy": "exact",
        "links": [
            {"entity_type": "complaint", "entity_id": "BBMP-2025-0101", "relation": "reported_with", "link_method": "source_id"},
            {"entity_type": "asset", "entity_id": "RD-000101", "relation": "defect_on", "link_method": "manual_review"}
        ],
        "source": DEMO_SOURCE,
        "verification": DEMO_VERIFICATION,
        "processing_status": "completed"
    },
    {
        "attachment_id": "IMG-00101B",
        "gridfs_id": "GRID-IMG-001B",
        "parent_attachment_id": None,
        "kind": "original",
        "sha256": "4c9d2ef88a",
        "perceptual_hash": "a1b2c3d4e5f60720",
        "mime_type": "image/jpeg",
        "width": 1920,
        "height": 1080,
        "captured_at": datetime.utcnow() - timedelta(days=5),
        "uploaded_at": datetime.utcnow() - timedelta(days=5),
        "location": {"type": "Point", "coordinates": [77.6770, 12.9270]},
        "location_accuracy": "exact",
        "links": [
            {"entity_type": "complaint", "entity_id": "BBMP-2025-0102", "relation": "reported_with", "link_method": "source_id"},
            {"entity_type": "asset", "entity_id": "RD-000101", "relation": "defect_on", "link_method": "manual_review"}
        ],
        "source": DEMO_SOURCE,
        "verification": DEMO_VERIFICATION,
        "processing_status": "completed"
    }
]

MAINTENANCE = [
    {
        "action_id": "WO-2025-0042",
        "source_work_order_id": "BBMP-ENG-4891",
        "asset_id": "RD-000101",
        "complaint_ids": ["BBMP-2025-0101"],
        "action_type": "patching",
        "description": "Cold-mix asphalt patching on Bellandur ORR left corridor",
        "started_at": datetime.utcnow() - timedelta(days=20),
        "completed_at": datetime.utcnow() - timedelta(days=19),
        "actual_cost": {"amount": 45000.0, "currency": "INR", "status": "recorded"},
        "contractor": "Karnataka State Infrastructure Engineering Ltd",
        "outcome": "partially_resolved",
        "evidence_attachment_ids": [],
        "source": DEMO_SOURCE,
        "verification": DEMO_VERIFICATION
    }
]

INSPECTIONS = [
    {
        "inspection_id": "INSP-2025-0012",
        "asset_id": "RD-000101",
        "inspection_at": datetime.utcnow() - timedelta(days=3),
        "findings_original": "Sub-base asphalt weakness observed near storm runoff drain inlet. Cold-mix patch eroded.",
        "findings_language": "en",
        "severity": {"score": 0.85, "level": "critical"},
        "inspector": {"name": "Assistant Executive Engineer - Zone 3"},
        "attachment_ids": ["IMG-00101A"],
        "source": DEMO_SOURCE,
        "verification": DEMO_VERIFICATION
    }
]

async def seed_data():
    await connect_to_mongo()
    db = get_database()
    if db is None:
        logger.warning("MongoDB not connected. Skipping seeding into database.")
        return

    logger.info("Seeding synthetic demo records into MongoDB...")

    # Clear previous demo records safely
    await db["assets"].delete_many({"verification.status": "synthetic_demo"})
    await db["complaints"].delete_many({"verification.status": "synthetic_demo"})
    await db["incident_clusters"].delete_many({})
    await db["visual_matches"].delete_many({})
    await db["image_detections"].delete_many({})
    await db["attachments"].delete_many({})
    await db["maintenance_actions"].delete_many({})
    await db["inspections"].delete_many({})

    # Insert collections
    await db["assets"].insert_many(ASSETS)
    await db["complaints"].insert_many(COMPLAINTS)
    await db["incident_clusters"].insert_many(CLUSTERS)
    await db["visual_matches"].insert_many(VISUAL_MATCHES)
    await db["image_detections"].insert_many(IMAGE_DETECTIONS)
    await db["attachments"].insert_many(ATTACHMENTS)
    await db["maintenance_actions"].insert_many(MAINTENANCE)
    await db["inspections"].insert_many(INSPECTIONS)

    logger.info("Demo data seeded successfully with 'synthetic_demo' verification status tags.")
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(seed_data())
