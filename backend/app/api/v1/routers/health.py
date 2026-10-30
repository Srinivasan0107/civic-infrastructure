from fastapi import APIRouter
from app.core.database import get_database
from app.services.semantic_service import semantic_service

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    db = get_database()
    mongo_status = "connected" if db is not None else "disconnected"
    return {
        "status": "healthy",
        "mongodb": mongo_status,
        "services": {
            "embedding": "available" if semantic_service.available else "lexical_fallback",
            "image_processing": "available"
        }
    }
