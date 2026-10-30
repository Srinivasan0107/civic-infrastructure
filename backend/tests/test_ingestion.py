import pytest

@pytest.mark.asyncio
async def test_list_ingestion_jobs(async_client):
    response = await async_client.get("/api/v1/ingestion/jobs")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
