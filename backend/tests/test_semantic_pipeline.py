import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import connect_to_mongo, close_mongo_connection

@pytest.mark.asyncio
async def test_semantic_assets_clusters():
    await connect_to_mongo()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/v1/semantic/assets-clusters")
        assert res.status_code == 200
        data = res.json()
        assert "items" in data
        assert data["total"] >= 1
    await close_mongo_connection()

@pytest.mark.asyncio
async def test_semantic_multilingual_search():
    await connect_to_mongo()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/v1/semantic/search", json={
            "query": "ಬೆಳ್ಳಂದೂರು ಹೊರವರ್ತುಲ ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿ ಬಿದ್ದಿದೆ",
            "language": "kn",
            "filters": {"ward": "Bellandur", "asset_type": "road"},
            "top_k": 5
        })
        assert res.status_code == 200
        data = res.json()
        assert data["detected_language"]["code"] == "kn"
        assert data["matched_asset"] is not None
        assert "items" in data
    await close_mongo_connection()

@pytest.mark.asyncio
async def test_complaint_creation_and_recurrence_link():
    await connect_to_mongo()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/v1/complaints", json={
            "description_original": "Continuous asphalt erosion on Outer Ring Road near Bellandur EcoSpace",
            "category": "road",
            "ward": "Bellandur",
            "location": {"longitude": 77.6744, "latitude": 12.9260},
            "consent": True
        })
        assert res.status_code == 200
        data = res.json()
        assert data["complaint_id"].startswith("BBMP-2025-")
        assert data["asset_id"] == "RD-0001"
        assert data["is_recurring"] is True
    await close_mongo_connection()
