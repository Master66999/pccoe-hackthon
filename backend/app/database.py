from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings

from app.models.user import User
from app.models.scan import ScanResult

document_models = [User, ScanResult]

async def init_db():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    
    # We parse the DB name from the MONGO_URI, default to relife_ai if parsing fails
    db_name = settings.MONGO_URI.split("/")[-1] if "/" in settings.MONGO_URI else "relife_ai"
    database = client[db_name]
    
    if document_models:
        await init_beanie(database=database, document_models=document_models)
    
    return database
