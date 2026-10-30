import motor.motor_asyncio
import gridfs
from app.core.config import settings
from app.core.logging import logger

client: motor.motor_asyncio.AsyncIOMotorClient = None
db = None
fs_dataset = None
fs_media = None

async def connect_to_mongo():
    global client, db, fs_dataset, fs_media
    try:
        logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI} (db: {settings.MONGODB_DATABASE})")
        temp_client = motor.motor_asyncio.AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000
        )
        # Test connection before storing references
        await temp_client.admin.command('ping')
        client = temp_client
        db = client[settings.MONGODB_DATABASE]
        fs_dataset = motor.motor_asyncio.AsyncIOMotorGridFSBucket(db, bucket_name=settings.MONGODB_GRIDFS_BUCKET)
        fs_media = motor.motor_asyncio.AsyncIOMotorGridFSBucket(db, bucket_name=settings.MEDIA_GRIDFS_BUCKET)
        logger.info("MongoDB connected successfully.")
    except Exception as e:
        client = None
        db = None
        fs_dataset = None
        fs_media = None
        logger.warning(f"MongoDB connection failed: {e}. Backend will run with in-memory demo fallback where needed.")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed.")

def get_database():
    return db

def get_fs_dataset():
    return fs_dataset

def get_fs_media():
    return fs_media
