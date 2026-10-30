from app.repositories.base import BaseRepository
from app.core.config import settings
from app.core.logging import logger
from typing import Optional, List, Dict, Any
from datetime import datetime

class ClusterRepository(BaseRepository):
    def __init__(self):
        super().__init__("incident_clusters")

    async def list_clusters(
        self,
        ward: Optional[str] = None,
        asset_type: Optional[str] = None,
        review_status: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> tuple[List[Dict[str, Any]], int]:
        col = self.collection
        if col is not None:
            try:
                filter_query: Dict[str, Any] = {}
                if review_status:
                    filter_query["review_status"] = review_status
                if ward:
                    filter_query["ward"] = ward
                if asset_type:
                    filter_query["incident_category"] = asset_type
                    
                total = await col.count_documents(filter_query)
                cursor = col.find(filter_query).sort("latest_incident_at", -1).skip((page - 1) * page_size).limit(page_size)
                items = await cursor.to_list(length=page_size)
                for item in items:
                    item.pop("_id", None)
                return items, total
            except Exception as e:
                logger.error(f"Error querying clusters from MongoDB: {e}")
                if not settings.DEMO_MODE:
                    return [], 0

        return [], 0

    async def get_by_id(self, cluster_id: str) -> Optional[Dict[str, Any]]:
        col = self.collection
        if col is not None:
            try:
                doc = await col.find_one({"cluster_id": cluster_id})
                if doc:
                    doc.pop("_id", None)
                    return doc
            except Exception as e:
                logger.error(f"Error querying cluster {cluster_id} from MongoDB: {e}")
        return None

    async def review_cluster(self, cluster_id: str, decision: str, reason: Optional[str], reviewer: str) -> bool:
        col = self.collection
        if col is not None:
            try:
                await col.update_one(
                    {"cluster_id": cluster_id},
                    {"$set": {
                        "review_status": decision,
                        "review_reason": reason,
                        "reviewed_by": reviewer,
                        "reviewed_at": datetime.utcnow()
                    }}
                )
                from app.core.database import get_database
                db = get_database()
                if db is not None:
                    await db["audit_logs"].insert_one({
                        "actor": reviewer,
                        "entity_type": "incident_cluster",
                        "entity_id": cluster_id,
                        "action": "review_cluster",
                        "decision": decision,
                        "reason": reason,
                        "created_at": datetime.utcnow()
                    })
                return True
            except Exception as e:
                logger.error(f"Error updating cluster review: {e}")
        return False
