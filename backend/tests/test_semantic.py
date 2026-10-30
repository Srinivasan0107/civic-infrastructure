import pytest

@pytest.mark.asyncio
async def test_semantic_search(async_client):
    payload = {
        "query": "large pothole near the bus stop",
        "language": "en",
        "filters": {"ward": None, "asset_type": "road_segment", "radius_m": 500},
        "top_k": 5
    }
    response = await async_client.post("/api/v1/semantic/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == payload["query"]
    assert "items" in data
