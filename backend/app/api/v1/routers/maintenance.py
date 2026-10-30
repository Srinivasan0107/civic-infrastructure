from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from app.models.common import PagedResponse, DataStatus
from app.core.database import get_database

router = APIRouter(prefix="/maintenance", tags=["Maintenance & Work Orders"])

@router.get("", response_model=PagedResponse[Dict[str, Any]])
@router.get("/work-orders", response_model=PagedResponse[Dict[str, Any]])
async def list_maintenance(
    asset_id: Optional[str] = None,
    status: Optional[str] = None,
    department: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    db = get_database()
    items = []
    total = 0
    if db is not None:
        try:
            filter_query = {}
            if asset_id:
                filter_query["asset_id"] = asset_id
            if status:
                filter_query["status"] = status
            if department:
                filter_query["department"] = department
                
            total = await db["work_orders"].count_documents(filter_query)
            cursor = db["work_orders"].find(filter_query).sort("sanction_date", -1).skip((page - 1) * page_size).limit(page_size)
            items = await cursor.to_list(length=page_size)
            for item in items:
                item.pop("_id", None)
        except Exception:
            pass

    return PagedResponse[Dict[str, Any]](
        data_status=DataStatus.live if total > 0 else DataStatus.demo,
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/summary")
async def get_maintenance_summary():
    db = get_database()
    total_spend = 0.0
    completed_orders = 0
    active_orders = 0
    if db is not None:
        try:
            completed_orders = await db["work_orders"].count_documents({"status": "completed"})
            active_orders = await db["work_orders"].count_documents({"status": "in_progress"})
            pipe = [
                {"$group": {"_id": None, "total": {"$sum": "$actual_expenditure"}}}
            ]
            async for doc in db["work_orders"].aggregate(pipe):
                total_spend = doc.get("total", 0.0)
        except Exception:
            pass
            
    return {
        "total_expenditure_inr": total_spend,
        "completed_orders": completed_orders,
        "active_orders": active_orders,
        "currency": "INR",
        "provenance": "BBMP Capital Expenditure Statements"
    }
