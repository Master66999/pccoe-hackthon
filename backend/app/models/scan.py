from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Dict, Any, Optional
from beanie import Link
from app.models.user import User

class ScanResult(Document):
    user: Optional[Link[User]] = None  # Link to User, if authenticated
    device_info: Dict[str, Any]
    scan_data: Dict[str, Any]
    health_score: Optional[float] = None
    status: str = "completed"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "scan_results"
