from app.repositories.base import BaseRepository
from app.services.priority_service import priority_service
from app.core.config import settings
from app.core.logging import logger
from typing import Optional, List, Dict, Any

class PrioritizationRepository(BaseRepository):
    def __init__(self):
        super().__init__("prioritization_snapshots")

    async def list_snapshots(
        self,
        ward: Optional[str] = None,
        asset_type: Optional[str] = None,
        tier: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> tuple[List[Dict[str, Any]], int]:
        col = self.collection
        if col is not None:
            try:
                filter_query: Dict[str, Any] = {}
                if tier:
                    filter_query["tier"] = tier
                if ward:
                    filter_query["ward"] = ward
                if asset_type:
                    filter_query["asset_type"] = asset_type
                    
                total = await col.count_documents(filter_query)
                cursor = col.find(filter_query).sort("score", -1).skip((page - 1) * page_size).limit(page_size)
                items = await cursor.to_list(length=page_size)
                for item in items:
                    item.pop("_id", None)
                return items, total
            except Exception as e:
                logger.error(f"Error querying snapshots from MongoDB: {e}")
                if not settings.DEMO_MODE:
                    return [], 0

        if settings.DEMO_MODE:
            try:
                demo_data = [
                    ("RD-0001", 4, 3, 0.90, "high", 18),
                    ("RD-0002", 3, 2, 0.85, "high", 12),
                    ("SL-0001", 1, 14, 0.50, "medium", 5),
                ]
                items = [
                    priority_service.calculate_priority(aid, rec, days, sev, crit, age)
                    for aid, rec, days, sev, crit, age in demo_data
                ]
                if tier:
                    items = [i for i in items if i.get("tier") == tier]
                return items[:page_size], len(items)
            except Exception:
                pass

        return [], 0

    async def get_by_asset_id(self, asset_id: str) -> Optional[Dict[str, Any]]:
        col = self.collection
        if col is not None:
            try:
                doc = await col.find_one({"asset_id": asset_id}, sort=[("generated_at", -1)])
                if doc:
                    doc.pop("_id", None)
                    return doc
            except Exception as e:
                logger.error(f"Error querying snapshot for {asset_id} from MongoDB: {e}")
                
        return None
