from app.core.database import get_database
from app.core.logging import logger
from typing import Optional, List, Dict, Any

class BaseRepository:
    def __init__(self, collection_name: str):
        self.collection_name = collection_name

    @property
    def collection(self):
        db = get_database()
        if db is not None:
            return db[self.collection_name]
        return None
