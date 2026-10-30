from app.repositories.base import BaseRepository
from app.core.config import settings
from app.core.logging import logger
from typing import Optional, List, Dict, Any
from datetime import datetime

class ComplaintRepository(BaseRepository):
    def __init__(self):
        super().__init__("complaints")

    async def list_complaints(
        self,
        ward: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
        asset_id: Optional[str] = None,
        geography: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> tuple[List[Dict[str, Any]], int]:
        col = self.collection
        if col is not None:
            try:
                filter_query: Dict[str, Any] = {}
                if ward:
                    filter_query["ward"] = ward
                if category:
                    filter_query["category"] = category
                if status:
                    filter_query["status"] = status
                if asset_id:
                    filter_query["asset_id"] = asset_id
                if geography:
                    if geography.lower() in ["bengaluru", "bangalore"]:
                        filter_query["source.geography"] = {"$ne": "New York City"}
                    elif geography.lower() in ["nyc", "new york city"]:
                        filter_query["source.geography"] = "New York City"
                        
                total = await col.count_documents(filter_query)
                cursor = col.find(filter_query).sort([("created_at", -1), ("reported_at", -1)]).skip((page - 1) * page_size).limit(page_size)
                items = await cursor.to_list(length=page_size)
                for item in items:
                    item.pop("_id", None)
                return items, total
            except Exception as e:
                logger.error(f"Error querying complaints from MongoDB: {e}")
                if not settings.DEMO_MODE:
                    return [], 0

        return [], 0

    async def get_by_id(self, complaint_id: str) -> Optional[Dict[str, Any]]:
        col = self.collection
        if col is not None:
            try:
                doc = await col.find_one({"complaint_id": complaint_id})
                if doc:
                    doc.pop("_id", None)
                    return doc
            except Exception as e:
                logger.error(f"Error querying complaint {complaint_id}: {e}")
        return None

    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        col = self.collection
        if col is not None:
            try:
                await col.insert_one(data)
                data.pop("_id", None)
            except Exception as e:
                logger.error(f"Error saving complaint to MongoDB: {e}")
        return data
