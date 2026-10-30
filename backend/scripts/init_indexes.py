import asyncio
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import connect_to_mongo, close_mongo_connection, get_database
from app.core.logging import logger
import pymongo

async def init_indexes():
    await connect_to_mongo()
    db = get_database()
    if db is None:
        logger.error("Cannot connect to MongoDB to initialize indexes.")
        return

    logger.info("Creating MongoDB collections and indexes...")

    # assets
    await db["assets"].create_index("asset_id", unique=True)
    await db["assets"].create_index([("geometry", pymongo.GEOSPHERE)])
    await db["assets"].create_index("ward")
    await db["assets"].create_index("asset_type")

    # complaints
    await db["complaints"].create_index("complaint_id", unique=True)
    await db["complaints"].create_index([("location", pymongo.GEOSPHERE)])
    await db["complaints"].create_index([("asset_id", pymongo.ASCENDING), ("reported_at", pymongo.DESCENDING)])
    await db["complaints"].create_index([("category", pymongo.ASCENDING), ("status", pymongo.ASCENDING)])

    # attachments
    await db["attachments"].create_index("attachment_id", unique=True)
    await db["attachments"].create_index("sha256")
    await db["attachments"].create_index([("location", pymongo.GEOSPHERE)])
    await db["attachments"].create_index([("links.entity_type", pymongo.ASCENDING), ("links.entity_id", pymongo.ASCENDING)])

    # ingestion_jobs
    await db["ingestion_jobs"].create_index("job_id", unique=True)
    await db["ingestion_jobs"].create_index("file_sha256")

    # semantic_matches
    await db["semantic_matches"].create_index("match_id", unique=True)
    await db["semantic_matches"].create_index("review_decision")

    # visual_matches
    await db["visual_matches"].create_index("visual_match_id", unique=True)
    await db["visual_matches"].create_index("review_decision")

    # incident_clusters
    await db["incident_clusters"].create_index("cluster_id", unique=True)
    await db["incident_clusters"].create_index("review_status")

    # asset_risk_snapshots
    await db["asset_risk_snapshots"].create_index([("asset_id", pymongo.ASCENDING), ("generated_at", pymongo.DESCENDING)])
    await db["asset_risk_snapshots"].create_index("score")

    logger.info("All indexes created successfully.")
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(init_indexes())
