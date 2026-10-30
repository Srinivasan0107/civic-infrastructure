from fastapi import APIRouter
from typing import List, Dict, Any
from app.models.common import DataStatus
from app.core.database import get_database

router = APIRouter(prefix="/datasets", tags=["Datasets"])

@router.get("")
async def list_datasets():
    db = get_database()
    datasets = []
    if db is not None:
        try:
            cursor = db["datasets"].find({}).sort("dataset_id", 1)
            async for doc in cursor:
                doc.pop("_id", None)
                datasets.append(doc)
        except Exception:
            pass
            
    # Include GridFS storage metrics
    gridfs_count = 0
    media_count = 0
    if db is not None:
        try:
            gridfs_count = await db["dataset_files.files"].count_documents({})
            media_count = await db["media_files.files"].count_documents({})
        except Exception:
            pass

    return {
        "data_status": DataStatus.live,
        "total_datasets": len(datasets),
        "gridfs_dataset_files": gridfs_count,
        "gridfs_media_files": media_count,
        "datasets": datasets
    }
