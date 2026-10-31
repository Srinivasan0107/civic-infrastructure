import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.core.logging import logger

# Import all routers
from app.api.v1.routers import (
    health,
    overview,
    assets,
    complaints,
    semantic,
    clusters,
    prioritization,
    ingestion,
    media,
    visual,
    data_quality,
    announcements,
    maintenance,
    datasets,
    reports,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Civic Infrastructure Memory API service...")
    await connect_to_mongo()
    yield
    logger.info("Shutting down Civic Infrastructure Memory API service...")
    await close_mongo_connection()

app = FastAPI(
    title="Civic Infrastructure Memory API",
    description="Multilingual municipal infrastructure intelligence, asset memory, semantic complaint analysis, and explainable prioritization.",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Middleware - supports local dev, Vercel deployments (*.vercel.app), and Render
cors_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
] + [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"(http://(localhost|127\.0\.0\.1)(:\d+)?|https://.*\.vercel\.app|https://.*\.onrender\.com)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 Routers
api_v1_prefix = "/api/v1"
app.include_router(health.router, prefix=api_v1_prefix)
app.include_router(overview.router, prefix=api_v1_prefix)
app.include_router(assets.router, prefix=api_v1_prefix)
app.include_router(complaints.router, prefix=api_v1_prefix)
app.include_router(semantic.router, prefix=api_v1_prefix)
app.include_router(clusters.router, prefix=api_v1_prefix)
app.include_router(prioritization.router, prefix=api_v1_prefix)
app.include_router(ingestion.router, prefix=api_v1_prefix)
app.include_router(media.router, prefix=api_v1_prefix)
app.include_router(visual.router, prefix=api_v1_prefix)
app.include_router(data_quality.router, prefix=api_v1_prefix)
app.include_router(announcements.router, prefix=api_v1_prefix)
app.include_router(maintenance.router, prefix=api_v1_prefix)
app.include_router(datasets.router, prefix=api_v1_prefix)
app.include_router(reports.router, prefix=api_v1_prefix)

# Also mount overview directly at /analytics for parity with requested spec
app.include_router(overview.router, prefix=f"{api_v1_prefix}/analytics")

@app.get("/")
async def root():
    return {
        "name": "Civic Infrastructure Memory API",
        "version": "2.0.0",
        "database": "MongoDB (Active)",
        "docs_url": "/docs",
        "api_v1_prefix": "/api/v1"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", str(settings.API_PORT)))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
