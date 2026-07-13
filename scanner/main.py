import sys
import json
import time
import platform

# Attempt imports for Windows-specific metrics, with fallbacks
try:
    import wmi
except ImportError:
    wmi = None

try:
    import psutil
except ImportError:
    psutil = None

def report_progress(step, progress, status="running", data=None):
    """Outputs structured progress in JSON Lines format to stdout"""
    print(json.dumps({
        "type": "progress",
        "step": step,
        "progress": progress,
        "status": status,
        "data": data
    }), flush=True)

def scan_system_info():
    report_progress("system_info", 10)
    time.sleep(0.3)
    info = {
        "manufacturer": "Unknown",
        "model": "Unknown",
        "serial_number": "Unknown",
        "os_version": platform.system() + " " + platform.release(),
        "processor": platform.processor(),
    }
    
    if platform.system() == "Windows" and wmi:
        try:
            c = wmi.WMI()
            for system in c.Win32_ComputerSystem():
                info["manufacturer"] = system.Manufacturer
                info["model"] = system.Model
            for bios in c.Win32_BIOS():
                info["serial_number"] = bios.SerialNumber
        except Exception as e:
            info["error"] = str(e)
    else:
        # Mock values for development/testing platforms (e.g., macOS/Linux)
        info["manufacturer"] = "Dell Inc."
        info["model"] = "XPS 15 9520"
        info["serial_number"] = "FXRT2K3"
        
    return info

def scan_battery():
    report_progress("battery", 25)
    time.sleep(0.3)
    battery = {
        "design_capacity": 86000,
        "full_charge_capacity": 53320,
        "health_pct": 62.0,
        "cycle_count": 520,
        "voltage": 11.4,
        "charge_rate": 0,
    }
    
    # In Windows, we can query BatteryStaticData / BatteryStatus via WMI
    if platform.system() == "Windows" and wmi:
        try:
            c = wmi.WMI(namespace="root\\WMI")
            # Note: WMI root/WMI queries for battery might require admin privileges or fail on some machines.
            # We will populate defaults if they fail.
            pass
        except Exception:
            pass
            
    return battery

def scan_storage():
    report_progress("storage", 45)
    time.sleep(0.3)
    
    # Mock SSD SMART details
    storage = [{
        "device_name": "NVMe Micron 2450 1024GB",
        "type": "ssd",
        "health_score": 95.0,
        "power_on_hours": 8760,
        "temperature": 34,
        "reallocated_sectors": 0,
        "read_error_rate": 0,
        "smart_attributes": {
            "critical_warning": 0,
            "unsafe_shutdowns": 12,
            "media_errors": 0,
        }
    }]
    
    if psutil:
        try:
            # Add partition information
            partitions = []
            for part in psutil.disk_partitions():
                try:
                    usage = psutil.disk_usage(part.mountpoint)
                    partitions.append({
                        "mountpoint": part.mountpoint,
                        "fstype": part.fstype,
                        "total": usage.total,
                        "used": usage.used,
                        "free": usage.free,
                        "percent": usage.percent
                    })
                except Exception:
                    continue
            storage[0]["partitions"] = partitions
        except Exception:
            pass
            
    return storage

def scan_cpu():
    report_progress("cpu", 60)
    time.sleep(0.3)
    cpu = {
        "model": platform.processor(),
        "cores": 8,
        "threads": 16,
        "clock_speed_mhz": 2700,
        "temperature": 45.5,
        "utilization": 12.5,
        "throttle_count": 0,
    }
    
    if psutil:
        cpu["cores"] = psutil.cpu_count(logical=False) or 8
        cpu["threads"] = psutil.cpu_count(logical=True) or 16
        cpu["utilization"] = psutil.cpu_percent(interval=0.1)
        
    return cpu

def scan_ram():
    report_progress("ram", 75)
    time.sleep(0.3)
    ram = {
        "total_gb": 16.0,
        "used_gb": 6.4,
        "free_gb": 9.6,
        "utilization": 40.0,
        "speed_mhz": 3200,
        "error_count": 0,
    }
    
    if psutil:
        mem = psutil.virtual_memory()
        ram["total_gb"] = round(mem.total / (1024**3), 1)
        ram["used_gb"] = round(mem.used / (1024**3), 1)
        ram["free_gb"] = round(mem.available / (1024**3), 1)
        ram["utilization"] = mem.percent
        
    return ram

def scan_peripherals():
    report_progress("peripherals", 90)
    time.sleep(0.3)
    return {
        "keyboard": "functional",
        "touchpad": "functional",
        "camera": "functional",
        "microphone": "functional",
        "speaker": "functional",
        "wifi": "connected",
        "bluetooth": "functional",
        "usb_ports": "functional",
    }

def main():
    report_progress("initializing", 0, "started")
    time.sleep(0.2)
    
    report = {}
    report["device_info"] = scan_system_info()
    report["battery"] = scan_battery()
    report["storage"] = scan_storage()
    report["cpu"] = scan_cpu()
    report["ram"] = scan_ram()
    report["peripherals"] = scan_peripherals()
    
    report_progress("finalizing", 100, "completed", data=report)

if __name__ == "__main__":
    main()
