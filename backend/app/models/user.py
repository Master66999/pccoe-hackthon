from beanie import Document, Indexed
from pydantic import EmailStr, Field
from datetime import datetime
from typing import Optional

class User(Document):
    email: Indexed(EmailStr, unique=True)
    hashed_password: str
    full_name: str
    is_active: bool = True
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
