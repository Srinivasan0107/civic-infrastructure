import pytest

@pytest.mark.asyncio
async def test_list_assets(async_client):
    response = await async_client.get("/api/v1/assets")
    assert response.status_code == 200
    data = response.json()
    assert "data_status" in data
    assert "items" in data
    assert "total" in data

@pytest.mark.asyncio
async def test_get_asset_risk(async_client):
    response = await async_client.get("/api/v1/assets/RD-000101/risk")
    assert response.status_code == 200
    data = response.json()
    assert data["score_type"] == "priority_score"
    assert "score" in data
    assert "tier" in data
    assert "components" in data
