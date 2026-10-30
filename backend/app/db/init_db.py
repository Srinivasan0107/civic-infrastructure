import asyncio
import pymongo
from pymongo import MongoClient, ASCENDING, DESCENDING, GEOSPHERE
from app.core.config import settings
from app.core.logging import logger

def init_database_sync():
    """Synchronously creates all collections and indexes in MongoDB."""
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI} to initialize collections and indexes...")
    client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
    db = client[settings.MONGODB_DATABASE]
    
    # 1. Dataset Management Collections
    db.datasets.create_index([("dataset_id", ASCENDING)], unique=True)
    db.datasets.create_index([("source_id", ASCENDING)])
    db.datasets.create_index([("status", ASCENDING)])
    
    db.ingestion_jobs.create_index([("job_id", ASCENDING)], unique=True)
    db.ingestion_jobs.create_index([("source_name", ASCENDING)])
    db.ingestion_jobs.create_index([("status", ASCENDING)])
    db.ingestion_jobs.create_index([("started_at", DESCENDING)])
    
    db.ingestion_errors.create_index([("job_id", ASCENDING)])
    db.ingestion_errors.create_index([("stage", ASCENDING)])
    db.ingestion_errors.create_index([("error_code", ASCENDING)])
    
    db.raw_records.create_index([("job_id", ASCENDING)])
    db.raw_records.create_index([("source_name", ASCENDING), ("source_record_id", ASCENDING)])
    db.raw_records.create_index([("import_timestamp", DESCENDING)])
    
    # 2. Infrastructure Collections
    db.assets.create_index([("asset_id", ASCENDING)], unique=True)
    db.assets.create_index([("geometry", GEOSPHERE)])
    db.assets.create_index([("asset_type", ASCENDING)])
    db.assets.create_index([("ward", ASCENDING)])
    db.assets.create_index([("latest_risk_tier", ASCENDING)])
    db.assets.create_index([("source_provenance.source_id", ASCENDING)])
    
    db.complaints.create_index([("complaint_id", ASCENDING)], unique=True)
    db.complaints.create_index([("location", GEOSPHERE)])
    db.complaints.create_index([("asset_id", ASCENDING)])
    db.complaints.create_index([("category", ASCENDING)])
    db.complaints.create_index([("status", ASCENDING)])
    db.complaints.create_index([("ward", ASCENDING)])
    db.complaints.create_index([("created_at", DESCENDING)])
    db.complaints.create_index([("source.name", ASCENDING)])
    
    db.inspections.create_index([("inspection_id", ASCENDING)], unique=True)
    db.inspections.create_index([("asset_id", ASCENDING)])
    db.inspections.create_index([("inspection_date", DESCENDING)])
    
    db.maintenance_actions.create_index([("action_id", ASCENDING)], unique=True)
    db.maintenance_actions.create_index([("asset_id", ASCENDING)])
    db.maintenance_actions.create_index([("work_order_id", ASCENDING)])
    db.maintenance_actions.create_index([("started_at", DESCENDING)])
    db.maintenance_actions.create_index([("action_type", ASCENDING)])
    
    db.work_orders.create_index([("work_order_id", ASCENDING)], unique=True)
    db.work_orders.create_index([("asset_id", ASCENDING)])
    db.work_orders.create_index([("department", ASCENDING)])
    db.work_orders.create_index([("status", ASCENDING)])
    
    db.media_attachments.create_index([("attachment_id", ASCENDING)], unique=True)
    db.media_attachments.create_index([("asset_id", ASCENDING)])
    db.media_attachments.create_index([("complaint_id", ASCENDING)])
    db.media_attachments.create_index([("gridfs_id", ASCENDING)])
    
    # 3. AI Intelligence Collections
    db.semantic_embeddings.create_index([("embedding_id", ASCENDING)], unique=True)
    db.semantic_embeddings.create_index([("complaint_id", ASCENDING)])
    db.semantic_embeddings.create_index([("model_name", ASCENDING)])
    
    db.visual_embeddings.create_index([("embedding_id", ASCENDING)], unique=True)
    db.visual_embeddings.create_index([("attachment_id", ASCENDING)])
    db.visual_embeddings.create_index([("model_name", ASCENDING)])
    
    db.incident_clusters.create_index([("cluster_id", ASCENDING)], unique=True)
    db.incident_clusters.create_index([("review_status", ASCENDING)])
    db.incident_clusters.create_index([("candidate_asset_ids", ASCENDING)])
    
    db.damage_detections.create_index([("detection_id", ASCENDING)], unique=True)
    db.damage_detections.create_index([("attachment_id", ASCENDING)])
    db.damage_detections.create_index([("class_id", ASCENDING)])
    
    db.prioritization_snapshots.create_index([("snapshot_id", ASCENDING)], unique=True)
    db.prioritization_snapshots.create_index([("asset_id", ASCENDING)])
    db.prioritization_snapshots.create_index([("tier", ASCENDING)])
    db.prioritization_snapshots.create_index([("score", DESCENDING)])
    db.prioritization_snapshots.create_index([("generated_at", DESCENDING)])
    
    # 4. Application Collections
    db.users.create_index([("user_id", ASCENDING)], unique=True)
    db.users.create_index([("email", ASCENDING)], unique=True)
    db.users.create_index([("role", ASCENDING)])
    
    db.departments.create_index([("department_id", ASCENDING)], unique=True)
    db.departments.create_index([("name", ASCENDING)])
    
    db.notifications.create_index([("user_id", ASCENDING)])
    db.notifications.create_index([("created_at", DESCENDING)])
    
    db.audit_logs.create_index([("actor", ASCENDING)])
    db.audit_logs.create_index([("entity_type", ASCENDING)])
    db.audit_logs.create_index([("entity_id", ASCENDING)])
    db.audit_logs.create_index([("created_at", DESCENDING)])
    
    logger.info("Successfully initialized all 18 collections and indexes in MongoDB.")
    client.close()

if __name__ == "__main__":
    init_database_sync()
