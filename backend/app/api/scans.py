from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from app.models.scan import ScanResult
from app.models.user import User
from app.api.auth import get_current_user, get_optional_current_user
from app.services.scoring import (
    calculate_health_score,
    calculate_repairability_score,
    calculate_carbon_savings,
    mock_computer_vision_damage_detection
)
import structlog
from datetime import datetime

router = APIRouter()
logger = structlog.get_logger()

class ScanSubmission(BaseModel):
    device_info: Dict[str, Any]
    scan_data: Dict[str, Any]

class ScanResponse(BaseModel):
    id: str
    device_info: Dict[str, Any]
    health_score: Optional[float]
    repairability_score: Optional[float] = None
    carbon_savings: Optional[Dict[str, float]] = None
    physical_damage: Optional[Dict[str, Any]] = None
    status: str
    created_at: datetime

@router.post("/submit", response_model=ScanResponse)
async def submit_scan(
    scan_in: ScanSubmission, 
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Submit a completed diagnostic scan for processing.
    """
    logger.info("Received scan submission", user=current_user.email if current_user else "anonymous")
    
    # 1. Health Score
    health_score = calculate_health_score(scan_in.scan_data)
    
    # 2. Repairability Score
    repairability_score = calculate_repairability_score(scan_in.device_info, health_score)
    
    # 3. Carbon Savings
    carbon_savings = calculate_carbon_savings(scan_in.device_info)
    
    # 4. Mock ML Physical Damage
    has_damage, damage_desc = mock_computer_vision_damage_detection()
    physical_damage = {
        "has_damage": has_damage,
        "description": damage_desc
    }
    
    scan = ScanResult(
        device_info=scan_in.device_info,
        scan_data=scan_in.scan_data,
        health_score=health_score,
        status="completed"
    )
    
    if current_user:
        scan.user = current_user
        
    await scan.insert()
    
    return ScanResponse(
        id=str(scan.id),
        device_info=scan.device_info,
        health_score=scan.health_score,
        repairability_score=repairability_score,
        carbon_savings=carbon_savings,
        physical_damage=physical_damage,
        status=scan.status,
        created_at=scan.created_at
    )

@router.get("/", response_model=List[ScanResponse])
async def list_user_scans(current_user: User = Depends(get_current_user)):
    """
    List all scans for the authenticated user.
    """
    # Find scans where user link matches current_user
    scans = await ScanResult.find(ScanResult.user.id == current_user.id, fetch_links=True).to_list()
    
    return [
        ScanResponse(
            id=str(scan.id),
            device_info=scan.device_info,
            health_score=scan.health_score,
            status=scan.status,
            created_at=scan.created_at
        )
        for scan in scans
    ]
