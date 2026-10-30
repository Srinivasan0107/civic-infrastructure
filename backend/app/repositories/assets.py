from app.repositories.base import BaseRepository
from app.models.assets import Asset, TimelineEvent
from app.models.common import VerificationStatus
from app.core.config import settings
from app.core.logging import logger
from typing import Optional, List, Dict, Any
from datetime import datetime

class AssetRepository(BaseRepository):
    def __init__(self):
        super().__init__("assets")

    async def list_assets(
        self,
        q: Optional[str] = None,
        asset_type: Optional[str] = None,
        ward: Optional[str] = None,
        priority_tier: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> tuple[List[Dict[str, Any]], int]:
        col = self.collection
        if col is not None:
            try:
                filter_query: Dict[str, Any] = {}
                if asset_type:
                    filter_query["asset_type"] = asset_type
                if ward:
                    filter_query["ward"] = ward
                if priority_tier:
                    filter_query["latest_risk_tier"] = priority_tier
                if q:
                    filter_query["$or"] = [
                        {"name": {"$regex": q, "$options": "i"}},
                        {"asset_id": {"$regex": q, "$options": "i"}},
                        {"location_text": {"$regex": q, "$options": "i"}}
                    ]
                    
                total = await col.count_documents(filter_query)
                cursor = col.find(filter_query).sort("asset_id", 1).skip((page - 1) * page_size).limit(page_size)
                items = await cursor.to_list(length=page_size)
                for item in items:
                    item.pop("_id", None)
                return items, total
            except Exception as e:
                logger.error(f"Error querying assets from MongoDB: {e}")
                if not settings.DEMO_MODE:
                    return [], 0

        if settings.DEMO_MODE:
            try:
                from scripts.seed_demo_data import ASSETS
                items = ASSETS
                if asset_type:
                    items = [a for a in items if a.get("asset_type") == asset_type]
                if ward:
                    items = [a for a in items if a.get("ward") == ward]
                if priority_tier:
                    items = [a for a in items if a.get("latest_risk_tier") == priority_tier]
                return items[:page_size], len(items)
            except Exception:
                pass
                
        return [], 0

    async def get_by_id(self, asset_id: str) -> Optional[Dict[str, Any]]:
        col = self.collection
        if col is not None:
            try:
                doc = await col.find_one({"asset_id": asset_id})
                if doc:
                    doc.pop("_id", None)
                    return doc
            except Exception as e:
                logger.error(f"Error querying asset {asset_id} from MongoDB: {e}")
                
        if settings.DEMO_MODE:
            try:
                from scripts.seed_demo_data import ASSETS
                for a in ASSETS:
                    if a.get("asset_id") == asset_id:
                        return a
            except Exception:
                pass
        return None

    async def get_timeline(
        self,
        asset_id: str,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        event_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        from app.core.database import get_database
        db = get_database()
        events = []
        if db is not None:
            try:
                # 1. Real complaints linked to this asset
                complaints_col = db["complaints"]
                c_filter = {"asset_id": asset_id}
                complaints = await complaints_col.find(c_filter).sort("created_at", -1).to_list(length=100)
                for c in complaints:
                    reported = c.get("reported_at") or c.get("created_at") or datetime.utcnow().isoformat()
                    if isinstance(reported, datetime):
                        reported = reported.isoformat()
                    events.append({
                        "event_type": "complaint",
                        "event_date": str(reported),
                        "entity_id": c.get("complaint_id", "Unknown"),
                        "summary": c.get("description_original", "Civic grievance recorded"),
                        "source": c.get("source", {}).get("name", "BBMP Sahayaa"),
                        "verification_status": c.get("verification", {}).get("status", "unverified"),
                        "details": {
                            "category": c.get("category"),
                            "status": c.get("status"),
                            "ward": c.get("ward")
                        }
                    })
                    
                # 2. Real maintenance actions linked to this asset
                maint_col = db["maintenance_actions"]
                maints = await maint_col.find({"asset_id": asset_id}).sort("started_at", -1).to_list(length=100)
                for m in maints:
                    dt = m.get("completed_at") or m.get("started_at") or datetime.utcnow().isoformat()
                    if isinstance(dt, datetime):
                        dt = dt.isoformat()
                    events.append({
                        "event_type": "maintenance_action",
                        "event_date": str(dt),
                        "entity_id": m.get("action_id", "WO-0000"),
                        "summary": f"{m.get('action_type', 'Civil Repair')} - {m.get('outcome', 'Executed')}",
                        "source": "BBMP Civil Works Department",
                        "verification_status": m.get("verification", {}).get("status", "verified"),
                        "details": {
                            "action_type": m.get("action_type"),
                            "cost": m.get("actual_cost", {}).get("amount"),
                            "outcome": m.get("outcome")
                        }
                    })
                    
                # 3. Real damage detection / photo evidence events
                media_col = db["media_attachments"]
                medias = await media_col.find({"asset_id": asset_id}).to_list(length=20)
                for med in medias:
                    events.append({
                        "event_type": "inspection",
                        "event_date": str(med.get("captured_at", datetime.utcnow().isoformat())),
                        "entity_id": med.get("attachment_id", "ATT-000"),
                        "summary": f"Photo Evidence Captured: {med.get('filename')}",
                        "source": med.get("source_provenance", {}).get("publisher", "Field Engineer"),
                        "verification_status": "verified",
                        "details": {"attachment_id": med.get("attachment_id"), "gridfs_id": med.get("gridfs_id")}
                    })
            except Exception as e:
                logger.error(f"Error querying timeline for {asset_id}: {e}")

        events.sort(key=lambda x: str(x.get("event_date", "")), reverse=True)
        return events
