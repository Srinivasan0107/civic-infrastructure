import pytest
import pytest_asyncio
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport
from app.main import app
from app.core.database import connect_to_mongo, close_mongo_connection

@pytest_asyncio.fixture
async def async_client():
    await connect_to_mongo()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
    await close_mongo_connection()
