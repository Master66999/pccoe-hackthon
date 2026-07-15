import wmi
import psutil
import platform

print("OS:", platform.system())

# Test psutil battery
if psutil:
    try:
        bat = psutil.sensors_battery()
        if bat:
            print("psutil sensors_battery:", bat.percent, bat.power_plugged, bat.secsleft)
        else:
            print("psutil returned no battery")
    except Exception as e:
        print("psutil error:", e)

# Test WMI Battery static / full charge / cycle count
if platform.system() == "Windows":
    try:
        c = wmi.WMI(namespace="root\\WMI")
        
        print("\n--- BatteryStaticData ---")
        try:
            for item in c.BatteryStaticData():
                print("DesignedCapacity:", item.DesignedCapacity)
                print("Voltage:", item.Voltage)
        except Exception as e:
            print("BatteryStaticData error:", e)

        print("\n--- BatteryFullChargedCapacity ---")
        try:
            for item in c.BatteryFullChargedCapacity():
                print("FullChargedCapacity:", item.FullChargedCapacity)
        except Exception as e:
            print("BatteryFullChargedCapacity error:", e)

        print("\n--- BatteryCycleCount ---")
        try:
            for item in c.BatteryCycleCount():
                print("CycleCount:", item.CycleCount)
        except Exception as e:
            print("BatteryCycleCount error:", e)

    except Exception as e:
        print("WMI connection error:", e)
