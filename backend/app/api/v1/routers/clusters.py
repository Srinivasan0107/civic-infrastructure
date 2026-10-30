from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from datetime import datetime
from app.models.clusters import IncidentCluster, ClusterReviewRequest
from app.models.common import PagedResponse, DataStatus
from app.repositories.clusters import ClusterRepository

router = APIRouter(prefix="/clusters", tags=["Recurring Incident Clusters"])
repo = ClusterRepository()

@router.get("", response_model=PagedResponse[IncidentCluster])
async def list_clusters(
    ward: Optional[str] = None,
    asset_type: Optional[str] = None,
    review_status: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100)
):
    items, total = await repo.list_clusters(ward, asset_type, review_status, page, page_size)
    return PagedResponse[IncidentCluster](
        data_status=DataStatus.live if total > 0 else DataStatus.demo,
        last_updated=datetime.utcnow().isoformat(),
        source_count=total,
        coverage_notes=["Spatial-temporal incident clusters"],
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )

@router.get("/{cluster_id}", response_model=IncidentCluster)
async def get_cluster(cluster_id: str):
    cluster = await repo.get_by_id(cluster_id)
    if not cluster:
        raise HTTPException(status_code=404, detail=f"Cluster {cluster_id} not found")
    return cluster

@router.post("/{cluster_id}/review")
async def review_cluster(cluster_id: str, body: ClusterReviewRequest):
    success = await repo.review_cluster(cluster_id, body.decision, body.reason, body.reviewer or "admin")
    return {"success": success, "cluster_id": cluster_id, "review_status": body.decision}
