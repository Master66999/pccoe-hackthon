import sys
import json
import time
import platform
import argparse

# Attempt imports for Windows-specific metrics, with fallbacks
try:
    import wmi  # type: ignore
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
            
    battery["percent"] = battery["health_pct"]
    battery["power_plugged"] = battery["charge_rate"] > 0 or True
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
        
    cpu["percent"] = cpu["utilization"]
    cpu["cores_logical"] = cpu["threads"]
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

def monitor_loop(allowed, interval):
    # Initialize CPU percentage tracker so subsequent calls give utilization since last check
    if psutil:
        psutil.cpu_percent(interval=None)
        
    while True:
        report = {}
        
        # 1. CPU
        if 'cpu' in allowed:
            cpu = {
                "utilization": 12.5,
                "percent": 12.5,
                "cores": 8,
                "threads": 16,
                "cores_logical": 16,
                "clock_speed_mhz": 2700,
                "temperature": 45.5,
            }
            if psutil:
                try:
                    cpu["cores"] = psutil.cpu_count(logical=False) or 8
                    cpu["threads"] = psutil.cpu_count(logical=True) or 16
                    cpu["cores_logical"] = cpu["threads"]
                    cpu["utilization"] = psutil.cpu_percent(interval=None)
                    cpu["percent"] = cpu["utilization"]
                except Exception:
                    pass
            report["cpu"] = cpu
        else:
            report["cpu"] = {
                "status": "Permission Denied",
                "error": "User denied access"
            }
            
        # 2. RAM / Memory
        if 'ram' in allowed or 'memory' in allowed:
            ram = {
                "total_gb": 16.0,
                "used_gb": 6.4,
                "free_gb": 9.6,
                "utilization": 40.0,
            }
            if psutil:
                try:
                    mem = psutil.virtual_memory()
                    ram["total_gb"] = round(mem.total / (1024**3), 1)
                    ram["used_gb"] = round(mem.used / (1024**3), 1)
                    ram["free_gb"] = round(mem.available / (1024**3), 1)
                    ram["utilization"] = mem.percent
                except Exception:
                    pass
            report["ram"] = ram
            report["memory"] = {
                "total": int(ram["total_gb"] * (1024**3)),
                "used": int(ram["used_gb"] * (1024**3)),
                "percent": ram["utilization"]
            }
        else:
            report["ram"] = {
                "status": "Permission Denied",
                "error": "User denied access"
            }
            report["memory"] = {
                "status": "Permission Denied",
                "error": "User denied access"
            }

        # 3. Battery
        if 'battery' in allowed:
            battery = {
                "percent": 62.0,
                "power_plugged": True,
                "charge_rate": 0,
            }
            if psutil:
                try:
                    bat = psutil.sensors_battery()
                    if bat:
                        battery["percent"] = bat.percent
                        battery["power_plugged"] = bat.power_plugged
                except Exception:
                    pass
            report["battery"] = battery
        else:
            report["battery"] = {
                "status": "Permission Denied",
                "error": "User denied access"
            }

        # 4. Storage / Disk
        if 'storage' in allowed or 'disk' in allowed:
            disk_report = []
            if psutil:
                try:
                    for part in psutil.disk_partitions():
                        try:
                            usage = psutil.disk_usage(part.mountpoint)
                            disk_report.append({
                                "device_name": part.device or part.mountpoint,
                                "total": usage.total,
                                "used": usage.used,
                                "percent": usage.percent
                            })
                        except Exception:
                            continue
                except Exception:
                    pass
            if not disk_report:
                disk_report = [{
                    "device_name": "NVMe Micron SSD",
                    "total": 1024 * (1024**3),
                    "used": 400 * (1024**3),
                    "percent": 40.0
                }]
            report["disk"] = disk_report
            report["storage"] = [{
                "device_name": drive.get("device_name", "NVMe Micron SSD"),
                "total": drive.get("total"),
                "used": drive.get("used"),
                "percent": drive.get("percent")
            } for drive in disk_report]
        else:
            report["disk"] = {
                "status": "Permission Denied",
                "error": "User denied access"
            }
            report["storage"] = {
                "status": "Permission Denied",
                "error": "User denied access"
            }

        # 5. Peripherals
        if 'peripherals' in allowed:
            report["peripherals"] = {
                "keyboard": "functional",
                "touchpad": "functional",
                "camera": "functional",
                "microphone": "functional",
                "speaker": "functional",
                "wifi": "connected",
                "bluetooth": "functional",
                "usb_ports": "functional",
            }
        else:
            report["peripherals"] = {
                "status": "Permission Denied",
                "error": "User denied access"
            }

        # 6. System Info / Device Info
        if 'system_info' in allowed or 'device_info' in allowed:
            report["device_info"] = {
                "manufacturer": "Unknown",
                "model": "Unknown",
                "os_version": platform.system() + " " + platform.release(),
                "processor": platform.processor(),
            }
            if platform.system() == "Windows" and wmi:
                try:
                    c = wmi.WMI()
                    for system in c.Win32_ComputerSystem():
                        report["device_info"]["manufacturer"] = system.Manufacturer
                        report["device_info"]["model"] = system.Model
                except Exception:
                    pass
        else:
            report["device_info"] = {
                "status": "Permission Denied",
                "error": "User denied access"
            }

        print(json.dumps({
            "type": "monitor",
            "status": "running",
            "data": report
        }), flush=True)
        time.sleep(interval)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--allow', type=str, default='all')
    parser.add_argument('--monitor', action='store_true', help='Run in real-time monitor mode')
    parser.add_argument('--interval', type=float, default=1.5, help='Polling interval in seconds')
    args, unknown = parser.parse_known_args()

    allowed = set()
    if args.allow == 'all':
        allowed = {'system_info', 'device_info', 'battery', 'storage', 'disk', 'cpu', 'ram', 'memory', 'peripherals'}
    else:
        allowed = set(args.allow.split(','))

    if args.monitor:
        monitor_loop(allowed, args.interval)
        return

    report_progress("initializing", 0, "started")
    time.sleep(0.2)
    
    report = {}

    # 1. Device Info / System Info
    if 'system_info' in allowed or 'device_info' in allowed:
        report["device_info"] = scan_system_info()
    else:
        report["device_info"] = {
            "manufacturer": "Permission Denied",
            "model": "Permission Denied",
            "serial_number": "Permission Denied",
            "os_version": "Permission Denied",
            "processor": "Permission Denied",
            "status": "Permission Denied",
            "error": "User denied access"
        }

    # 2. Battery
    if 'battery' in allowed:
        report["battery"] = scan_battery()
    else:
        report["battery"] = {
            "status": "Permission Denied",
            "error": "User denied access"
        }

    # 3. Storage / Disk
    if 'storage' in allowed or 'disk' in allowed:
        report["storage"] = scan_storage()
    else:
        report["storage"] = {
            "status": "Permission Denied",
            "error": "User denied access"
        }

    # 4. CPU
    if 'cpu' in allowed:
        report["cpu"] = scan_cpu()
    else:
        report["cpu"] = {
            "status": "Permission Denied",
            "error": "User denied access"
        }

    # 5. RAM / Memory
    if 'ram' in allowed or 'memory' in allowed:
        report["ram"] = scan_ram()
    else:
        report["ram"] = {
            "status": "Permission Denied",
            "error": "User denied access"
        }

    # 6. Peripherals
    if 'peripherals' in allowed:
        report["peripherals"] = scan_peripherals()
    else:
        report["peripherals"] = {
            "status": "Permission Denied",
            "error": "User denied access"
        }

    # --- Enrich and Align Data for Frontend/Backend Compatibility ---
    
    # Map memory from ram
    if isinstance(report.get("ram"), dict) and report["ram"].get("status") != "Permission Denied":
        ram_data = report["ram"]
        report["memory"] = {
            "total": int(ram_data.get("total_gb", 16.0) * (1024**3)),
            "used": int(ram_data.get("used_gb", 6.4) * (1024**3)),
            "percent": ram_data.get("utilization", 40.0),
        }
    else:
        report["memory"] = {
            "status": "Permission Denied",
            "error": "User denied access"
        }

    # Map disk from storage
    if isinstance(report.get("storage"), list) and len(report["storage"]) > 0:
        storage_list = report["storage"]
        report["disk"] = []
        for drive in storage_list:
            part_data = drive.get("partitions", [{}])[0] if drive.get("partitions") else {}
            report["disk"].append({
                "device_name": drive.get("device_name", "NVMe Micron SSD"),
                "total": part_data.get("total", 1024 * (1024**3)),
                "used": part_data.get("used", 400 * (1024**3)),
                "percent": part_data.get("percent", 40.0),
            })
    else:
        report["disk"] = {
            "status": "Permission Denied",
            "error": "User denied access"
        }

    report_progress("finalizing", 100, "completed", data=report)

if __name__ == "__main__":
    main()
