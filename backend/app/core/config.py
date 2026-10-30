import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://127.0.0.1:27017"
    MONGODB_DATABASE: str = "civic_memory"
    MONGODB_GRIDFS_BUCKET: str = "dataset_files"
    MEDIA_GRIDFS_BUCKET: str = "media_files"
    
    API_HOST: str = "127.0.0.1"
    API_PORT: int = 8000
    APP_ENV: str = "development"
    DEMO_MODE: bool = False
    
    EMBEDDING_MODEL: str = "intfloat/multilingual-e5-base"
    EMBEDDING_DEVICE: str = "auto"
    HF_HOME: str = "./.model-cache"
    
    IMAGE_EMBEDDING_MODEL: str = "facebook/dinov2-base"
    IMAGE_EMBEDDING_DEVICE: str = "auto"
    ROAD_DAMAGE_DETECTOR_WEIGHTS: str = "./models/road_damage_detector.pt"
    IMAGE_MAX_UPLOAD_MB: int = 20
    IMAGE_MAX_PIXELS: int = 25000000
    IMAGE_PROCESSING_ENABLED: bool = True
    IMAGE_MODEL_CACHE_DIR: str = "./.model-cache"
    
    INGESTION_CHUNK_SIZE: int = 5000
    MAX_UPLOAD_SIZE_MB: int = 1024
    RAW_DATA_RETENTION_DAYS: int = 0
    
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
