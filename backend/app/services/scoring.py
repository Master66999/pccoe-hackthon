import random
from typing import Dict, Any, Tuple

def calculate_health_score(scan_data: Dict[str, Any]) -> float:
    """
    Calculate an overall health score based on system diagnostic data.
    """
    score = 100.0
    
    # 1. Battery Health
    battery = scan_data.get("battery", {})
    if battery:
        percent = battery.get("percent", 100)
        power_plugged = battery.get("power_plugged", True)
        if percent < 50 and not power_plugged:
            score -= 10
        elif percent < 20:
            score -= 20
            
    # 2. Disk Health
    disks = scan_data.get("disk", [])
    for disk in disks:
        percent_used = disk.get("percent", 0)
        if percent_used > 90:
            score -= 15
        elif percent_used > 75:
            score -= 5
            
    # 3. Memory Health
    memory = scan_data.get("memory", {})
    if memory:
        mem_percent = memory.get("percent", 0)
        if mem_percent > 85:
            score -= 10
            
    # 4. CPU Temp / Usage
    cpu = scan_data.get("cpu", {})
    if cpu:
        cpu_usage = cpu.get("percent", 0)
        if cpu_usage > 90:
            score -= 10
            
    # Ensure score is within 0-100
    return max(0.0, min(100.0, score))

def calculate_repairability_score(device_info: Dict[str, Any], health_score: float) -> float:
    """
    Mock Repairability Score out of 10.
    Based loosely on health score and some random jitter for demonstration.
    """
    base_score = 7.5
    
    # If health score is very low, it might mean parts are failing, so maybe easier to replace some parts but harder overall.
    if health_score < 40:
        base_score -= 1.5
    elif health_score > 80:
        base_score += 1.0
        
    jitter = random.uniform(-0.5, 1.0)
    final_score = base_score + jitter
    
    return round(max(1.0, min(10.0, final_score)), 1)

def calculate_carbon_savings(device_info: Dict[str, Any]) -> Dict[str, float]:
    """
    Calculate carbon savings if the device is repaired/reused instead of thrown away.
    Values are mock estimations (kg CO2e).
    """
    # Average laptop carbon footprint is around 300-400 kg CO2e for manufacturing.
    base_manufacturing_co2 = 350.0 
    
    # E-waste diverted in kg (average laptop is 2-3 kg)
    ewaste_kg = 2.5
    
    return {
        "co2_saved_kg": round(base_manufacturing_co2, 2),
        "ewaste_diverted_kg": round(ewaste_kg, 2),
        "trees_equivalent": round(base_manufacturing_co2 / 21.0, 1) # 1 tree absorbs ~21kg CO2/year
    }

def mock_computer_vision_damage_detection() -> Tuple[bool, str]:
    """
    Simulates a CV model analyzing an image for physical damage.
    Returns (has_damage, description).
    """
    # For hackathon demo purposes, we will return some mock damages
    damages = [
        "Cracked screen detected on top right corner.",
        "Dent on the bottom chassis.",
        "Missing keycap on keyboard.",
        "No physical damage detected."
    ]
    
    result = random.choice(damages)
    has_damage = result != "No physical damage detected."
    
    return has_damage, result
