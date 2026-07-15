import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Leaf, 
  Cpu, 
  Settings as SettingsIcon, 
  QrCode, 
  Play, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  HardDrive, 
  Database, 
  Wifi, 
  Keyboard, 
  RefreshCw,
  LayoutDashboard,
  Gauge
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import LiveTelemetry from './components/LiveTelemetry';
import ScannerDiagnostics from './components/ScannerDiagnostics';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, completed, error
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStepName, setCurrentStepName] = useState('Initializing');
  const [scanResults, setScanResults] = useState(null);
  const [isElectron, setIsElectron] = useState(false);
  const [monitorHistory, setMonitorHistory] = useState([]);
  const [currentMonitorData, setCurrentMonitorData] = useState(null);

  // Dynamic specs and battery state for browser simulation mode
  const [simulatedBatteryLevel, setSimulatedBatteryLevel] = useState(75);
  const [simulatedBatteryCharging, setSimulatedBatteryCharging] = useState(true);

  const getDynamicBrowserSpecs = () => {
    let os = "Web Client OS";
    const ua = navigator.userAgent;
    if (ua.indexOf("Win") !== -1) os = "Windows PC";
    else if (ua.indexOf("Mac") !== -1) os = "macOS Device";
    else if (ua.indexOf("Linux") !== -1) os = "Linux Machine";
    else if (ua.indexOf("Android") !== -1) os = "Android Phone";
    else if (ua.indexOf("like Mac") !== -1) os = "iOS Device";

    let browser = "Web Client";
    if (ua.indexOf("Chrome") !== -1) browser = "Google Chrome";
    else if (ua.indexOf("Safari") !== -1) browser = "Apple Safari";
    else if (ua.indexOf("Firefox") !== -1) browser = "Mozilla Firefox";
    else if (ua.indexOf("Edge") !== -1) browser = "Microsoft Edge";

    return {
      manufacturer: "Browser Sandbox",
      model: `${browser} Client`,
      serial_number: "BRW-LOCAL-SCAN",
      os_version: os,
      processor: `${navigator.hardwareConcurrency || 8}-Core Processor`
    };
  };

  useEffect(() => {
    if (!window.electronAPI && navigator.getBattery) {
      navigator.getBattery().then(bat => {
        setSimulatedBatteryLevel(Math.round(bat.level * 100));
        setSimulatedBatteryCharging(bat.charging);
        
        const onLevelChange = () => setSimulatedBatteryLevel(Math.round(bat.level * 100));
        const onChargingChange = () => setSimulatedBatteryCharging(bat.charging);
        
        bat.addEventListener('levelchange', onLevelChange);
        bat.addEventListener('chargingchange', onChargingChange);
        
        return () => {
          bat.removeEventListener('levelchange', onLevelChange);
          bat.removeEventListener('chargingchange', onChargingChange);
        };
      });
    }
  }, []);

  // Hardware Diagnostic Permissions
  const [permissions, setPermissions] = useState(() => {
    const saved = localStorage.getItem('relife_permissions');
    return saved ? JSON.parse(saved) : {
      system_info: true,
      battery: true,
      storage: true,
      cpu: true,
      ram: true,
      peripherals: true
    };
  });

  const [permissionsConsented, setPermissionsConsented] = useState(() => {
    const saved = localStorage.getItem('relife_permissions_consented');
    return saved === 'true';
  });

  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('relife_permissions', JSON.stringify(permissions));
  }, [permissions]);

  useEffect(() => {
    localStorage.setItem('relife_permissions_consented', String(permissionsConsented));
  }, [permissionsConsented]);

  useEffect(() => {
    // Detect if running inside Electron shell
    if (window.electronAPI) {
      setIsElectron(true);
      
      // Wire up Electron scanner listeners
      window.electronAPI.onScanProgress((payload) => {
        setScanStatus('scanning');
        setScanProgress(payload.progress);
        setCurrentStepName(payload.step);
      });

      window.electronAPI.onScanError((err) => {
        setScanStatus('error');
        console.error('Scan error from electron agent:', err);
      });
    }
  }, []);

  const triggerScan = async () => {
    if (!permissionsConsented) {
      setShowPermissionModal(true);
      return;
    }
    await runDiagnosticScan(permissions);
  };

  const runDiagnosticScan = async (currentPermissions) => {
    setScanStatus('scanning');
    setScanProgress(0);
    setCurrentStepName('Initializing');

    if (window.electronAPI) {
      try {
        const results = await window.electronAPI.startScan({ mode: 'full', permissions: currentPermissions });
        console.log('Scan finished with results:', results);
        setScanResults(results);
        setScanStatus('completed');
        setScanProgress(100);
      } catch (err) {
        console.error('Scan process failed:', err);
        setScanStatus('error');
      }
    } else {
      // Mock scanner simulation for browser testing, respecting permissions!
      console.log('Running in browser sandbox — simulating scanner with permissions:', currentPermissions);
      
      const mockSteps = [];
      if (currentPermissions.system_info) mockSteps.push({ name: 'system_info', progress: 10 });
      if (currentPermissions.battery) mockSteps.push({ name: 'battery', progress: 25 });
      if (currentPermissions.storage) mockSteps.push({ name: 'storage', progress: 45 });
      if (currentPermissions.cpu) mockSteps.push({ name: 'cpu', progress: 60 });
      if (currentPermissions.ram) mockSteps.push({ name: 'ram', progress: 75 });
      if (currentPermissions.peripherals) mockSteps.push({ name: 'peripherals', progress: 90 });
      mockSteps.push({ name: 'finalizing', progress: 100 });

      for (const step of mockSteps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setScanProgress(step.progress);
        setCurrentStepName(step.name);
      }

      const mockData = {
        device_info: currentPermissions.system_info ? getDynamicBrowserSpecs() : {
          manufacturer: "Permission Denied",
          model: "Permission Denied",
          serial_number: "Permission Denied",
          os_version: "Permission Denied",
          processor: "Permission Denied",
          status: "Permission Denied"
        },
        battery: currentPermissions.battery ? {
          design_capacity: 86000,
          full_charge_capacity: 53320,
          health_pct: 62.0,
          percent: simulatedBatteryLevel,
          cycle_count: 520,
          voltage: 11.4,
          charge_rate: 0,
          power_plugged: simulatedBatteryCharging
        } : {
          status: "Permission Denied",
          error: "User denied access"
        },
        storage: currentPermissions.storage ? [{
          device_name: "NVMe Micron 2450 1024GB",
          type: "ssd",
          health_score: 95.0,
          power_on_hours: 8760,
          temperature: 34,
          reallocated_sectors: 0,
          read_error_rate: 0,
          smart_attributes: {
            critical_warning: 0,
            unsafe_shutdowns: 12,
            media_errors: 0
          },
          partitions: [{
            mountpoint: "C:\\",
            fstype: "NTFS",
            total: 1024 * (1024**3),
            used: 400 * (1024**3),
            free: 624 * (1024**3),
            percent: 40.0
          }]
        }] : {
          status: "Permission Denied",
          error: "User denied access"
        },
        cpu: currentPermissions.cpu ? {
          model: `${navigator.hardwareConcurrency || 8}-Core Processor`,
          cores: navigator.hardwareConcurrency || 8,
          threads: navigator.hardwareConcurrency || 8,
          cores_logical: navigator.hardwareConcurrency || 8,
          clock_speed_mhz: 2700,
          temperature: 45.5,
          utilization: 12.5,
          percent: 12.5,
          throttle_count: 0
        } : {
          status: "Permission Denied",
          error: "User denied access"
        },
        ram: currentPermissions.ram ? {
          total_gb: 16.0,
          used_gb: 6.4,
          free_gb: 9.6,
          utilization: 40.0,
          speed_mhz: 3200,
          error_count: 0
        } : {
          status: "Permission Denied",
          error: "User denied access"
        },
        peripherals: currentPermissions.peripherals ? {
          keyboard: "functional",
          touchpad: "functional",
          camera: "functional",
          microphone: "functional",
          speaker: "functional",
          wifi: "connected",
          bluetooth: "functional",
          usb_ports: "functional"
        } : {
          status: "Permission Denied",
          error: "User denied access"
        }
      };

      if (currentPermissions.ram) {
        mockData.memory = {
          total: 16 * (1024**3),
          used: 6.4 * (1024**3),
          percent: 40.0
        };
      } else {
        mockData.memory = { status: "Permission Denied", error: "User denied access" };
      }

      if (currentPermissions.storage) {
        mockData.disk = [{
          device_name: "NVMe Micron 2450 1024GB",
          total: 1024 * (1024**3),
          used: 400 * (1024**3),
          percent: 40.0
        }];
      } else {
        mockData.disk = { status: "Permission Denied", error: "User denied access" };
      }

      setScanResults(mockData);
      setScanStatus('completed');
    }
  };

  const handleGrantConsent = (all = false) => {
    let nextPermissions = { ...permissions };
    if (all) {
      nextPermissions = {
        system_info: true,
        battery: true,
        storage: true,
        cpu: true,
        ram: true,
        peripherals: true
      };
      setPermissions(nextPermissions);
    }
    setPermissionsConsented(true);
    setShowPermissionModal(false);
    runDiagnosticScan(nextPermissions);
  };

  const handleGrantSinglePermission = (permissionName) => {
    setPermissions(prev => ({
      ...prev,
      [permissionName]: true
    }));
  };

  useEffect(() => {
    let monitorInterval = null;
    let isMounted = true;
    let unsubscribe = null;
    
    if (activeTab === 'monitor') {
      setMonitorHistory([]);
      setCurrentMonitorData(null);

      if (window.electronAPI) {
        console.log("Starting native telemetry monitor with permissions:", permissions);
        window.electronAPI.startMonitor({ permissions, interval: 1.5 });
        
        unsubscribe = window.electronAPI.onMonitorData((data) => {
          if (isMounted) {
            setMonitorHistory(prev => {
              const newHistory = [...prev, { ...data, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }];
              if (newHistory.length > 15) newHistory.shift();
              return newHistory;
            });
            setCurrentMonitorData(data);
          }
        });
      } else {
        console.log("Simulating telemetry monitor in web sandbox with permissions:", permissions);
        monitorInterval = setInterval(() => {
          if (!isMounted) return;
          
          const dynamicSpecs = getDynamicBrowserSpecs();
          const utilization = Math.round(15 + Math.random() * 25);
          
          const mockData = {
            device_info: permissions.system_info ? dynamicSpecs : { status: "Permission Denied" },
            cpu: permissions.cpu ? {
              utilization: utilization,
              temperature: Math.round(40 + Math.random() * 10),
              cores: navigator.hardwareConcurrency || 8,
              threads: navigator.hardwareConcurrency || 8
            } : { status: "Permission Denied" },
            ram: permissions.ram ? {
              utilization: Math.round(45 + Math.random() * 5),
              total_gb: navigator.deviceMemory || 16.0,
              used_gb: parseFloat(((navigator.deviceMemory || 16.0) * (45 + Math.random() * 5) / 100).toFixed(1)),
              free_gb: parseFloat(((navigator.deviceMemory || 16.0) * (1 - (45 + Math.random() * 5) / 100)).toFixed(1))
            } : { status: "Permission Denied" },
            battery: permissions.battery ? {
              percent: simulatedBatteryLevel,
              power_plugged: simulatedBatteryCharging,
            } : { status: "Permission Denied" },
            disk: permissions.storage ? [
              { device_name: "C:\\", total: 1024 * 1024**3, used: 410 * 1024**3, percent: 40.0 }
            ] : { status: "Permission Denied" }
          };
          
          // Map memory for frontend compatibility
          if (permissions.ram) {
            mockData.memory = {
              percent: mockData.ram.utilization,
              total: (navigator.deviceMemory || 16) * 1024**3,
              used: mockData.ram.used_gb * 1024**3,
            };
          } else {
            mockData.memory = { status: "Permission Denied" };
          }
          
          setMonitorHistory(prev => {
            const newHistory = [...prev, { ...mockData, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }];
            if (newHistory.length > 15) newHistory.shift();
            return newHistory;
          });
          setCurrentMonitorData(mockData);
        }, 1500);
      }
    }
    
    return () => {
      isMounted = false;
      if (window.electronAPI) {
        window.electronAPI.stopMonitor();
      }
      if (unsubscribe) {
        unsubscribe();
      }
      if (monitorInterval) {
        clearInterval(monitorInterval);
      }
    };
  }, [activeTab, permissions]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center space-x-3 border-b border-slate-800/50">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Leaf size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wider text-emerald-400">ReLife AI</h1>
              <p className="text-xs text-slate-400">Don't Throw It Away</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'monitor', label: 'Live Telemetry', icon: Gauge },
              { id: 'scanner', label: 'Scanner Agent', icon: Cpu },
              { id: 'carbon', label: 'Carbon Impact', icon: Leaf },
              { id: 'passport', label: 'Device Passport', icon: QrCode },
              { id: 'settings', label: 'Settings', icon: SettingsIcon },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/50 text-center">
          <p className="text-xs text-slate-500">ReLife AI v1.0.0 (MVP Shell)</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 capitalize">{activeTab}</h2>
            <p className="text-sm text-slate-400">Manage, assess, and extend the lifecycle of your system.</p>
          </div>
          <div className="flex items-center space-x-4">
            {isElectron ? (
              <span className="flex items-center space-x-2 text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Native Desktop Environment</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2 text-xs bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Web Mock Sandbox Mode</span>
              </span>
            )}
          </div>
        </header>

        {/* Tab Contents */}
        {activeTab === 'monitor' && (
          <LiveTelemetry 
            history={monitorHistory}
            currentData={currentMonitorData}
            permissions={permissions}
            onGrantPermission={handleGrantSinglePermission}
          />
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {!scanResults ? (
              <div className="bg-slate-900 border border-slate-800/80 p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-2 max-w-xl">
                  <h3 className="text-lg font-bold text-slate-100">Ready to diagnose your laptop?</h3>
                  <p className="text-sm text-slate-400">
                    Run a complete deep-level diagnostic scan using local system profilers. Get a Digital Device Passport and personalized circular economy reuse recommendation.
                  </p>
                </div>
                <div className="flex-shrink-0 z-10">
                  {scanStatus === 'idle' && (
                    <button 
                      onClick={triggerScan}
                      className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                      <Play size={18} fill="currentColor" />
                      <span>Run Health Scan</span>
                    </button>
                  )}
                  {scanStatus === 'scanning' && (
                    <div className="flex flex-col items-end space-y-2">
                      <span className="text-sm text-slate-400 font-semibold animate-pulse">Scanning: {currentStepName} ({scanProgress}%)</span>
                      <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                      </div>
                    </div>
                  )}
                  {scanStatus === 'error' && (
                    <div className="flex items-center space-x-3">
                      <span className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-full border border-red-500/20 font-semibold flex items-center space-x-1.5">
                        <AlertTriangle size={12} />
                        <span>Scan Failed</span>
                      </span>
                      <button 
                        onClick={triggerScan}
                        className="text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-2 rounded"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>
                <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none"></div>
              </div>
            ) : (
              <Dashboard scanData={scanResults} deviceData={scanResults.device_info} />
            )}
          </div>
        )}

        {/* Tabs for scanner details */}
        {activeTab === 'scanner' && (
          <ScannerDiagnostics 
            scanData={scanResults}
            scanStatus={scanStatus}
            scanProgress={scanProgress}
            currentStepName={currentStepName}
            onStartScan={triggerScan}
          />
        )}

        {/* Carbon Offset Visuals */}
        {activeTab === 'carbon' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl space-y-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Leaf className="text-emerald-400" />
              <span>Carbon Offset Visualization</span>
            </h3>
            <p className="text-sm text-slate-400">
              Extending the lifespan of your laptop prevents the high greenhouse gas cost of new manufacturing.
            </p>
            <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 space-y-4">
              <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                <span className="text-slate-400">Average manufacturing cost:</span>
                <span className="font-semibold text-slate-200">~350 kg CO2</span>
              </div>
              <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                <span className="text-slate-400">Average repair carbon cost:</span>
                <span className="font-semibold text-slate-200">~15 kg CO2</span>
              </div>
              <div className="flex justify-between text-sm text-emerald-400 font-semibold pt-2">
                <span>Net CO2 Saved:</span>
                <span>335 kg CO2</span>
              </div>
            </div>
          </div>
        )}

        {/* Digital Passport */}
        {activeTab === 'passport' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl space-y-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <QrCode className="text-emerald-400" />
              <span>Digital Device Passport</span>
            </h3>
            <p className="text-sm text-slate-400">
              Create a portable, verifiable document detailing the device's hardware credentials and lifecycle logs.
            </p>
            <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center gap-6">
              <div className="bg-slate-900 p-4 border border-slate-800 rounded-lg">
                <div className="w-32 h-32 bg-slate-800 border-2 border-dashed border-slate-700 rounded flex items-center justify-center text-xs text-slate-500">
                  QR Code Placeholder
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <h4 className="font-bold text-slate-200">Passport Number: RL-2025-A8F2</h4>
                <p className="text-xs text-slate-500">Generated: 2026-07-13</p>
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded text-slate-200 font-medium">
                    <FileText size={14} />
                    <span>Download PDF Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings options */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl space-y-6">
            <h3 className="text-lg font-bold text-slate-100">Preferences</h3>
            <p className="text-sm text-slate-400">Configure application and remote backend endpoints.</p>
            <div className="space-y-4 max-w-md pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Backend Endpoint URL</label>
                <input 
                  type="text" 
                  defaultValue="http://localhost:8000/api/v1" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="border-t border-slate-800 pt-6">
                <h4 className="text-sm font-semibold text-slate-200 mb-4">Hardware Telemetry Permissions</h4>
                <div className="space-y-3">
                  {[
                    { id: 'system_info', label: 'System & OS Info', desc: 'Manufacturer, model, and serial metrics' },
                    { id: 'battery', label: 'Battery Telemetry', desc: 'Design capacities, wear levels, and cycles' },
                    { id: 'storage', label: 'Storage SMART Health', desc: 'Read error rates, drive wear, and partition usage' },
                    { id: 'cpu', label: 'CPU & Thermals', desc: 'Utilization, speed limiters, active core temps' },
                    { id: 'ram', label: 'RAM Diagnostics', desc: 'Memory consumption and hardware faults' },
                    { id: 'peripherals', label: 'Peripherals & Ports', desc: 'Keyboard, camera, audio, and Wi-Fi state' }
                  ].map(perm => (
                    <label key={perm.id} className="flex items-start space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-800/40 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={permissions[perm.id]}
                        onChange={(e) => setPermissions(prev => ({ ...prev, [perm.id]: e.target.checked }))}
                        className="mt-1 accent-emerald-500 rounded border-slate-700 bg-slate-950"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-200 group-hover:text-slate-100">{perm.label}</span>
                        <p className="text-xs text-slate-500">{perm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setPermissionsConsented(false);
                    alert("Permissions consent reset. You will be prompted on next scan.");
                  }}
                  className="mt-4 text-xs bg-slate-850 hover:bg-slate-800 text-slate-300 font-medium px-4 py-2 rounded-lg transition-colors border border-slate-700/50"
                >
                  Reset Consent Prompt
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Permission Request Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-lg w-full space-y-6 shadow-2xl shadow-emerald-500/5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 border-b border-slate-850 pb-4">
              <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Cpu size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Hardware Access Request</h3>
                <p className="text-xs text-slate-400">ReLife AI requires telemetry access to run diagnostics</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              To perform laptop circular economy health scoring and generate a Digital Device Passport, ReLife AI needs to run local profilers. Choose which parameters you allow:
            </p>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {[
                { id: 'system_info', label: 'System & OS Info', desc: 'Manufacturer, model, and serial details' },
                { id: 'battery', label: 'Battery Telemetry', desc: 'Cycles, designs, and wear states' },
                { id: 'storage', label: 'Storage SMART Health', desc: 'SSD sectors, partitioned size, and write errors' },
                { id: 'cpu', label: 'CPU & Thermals', desc: 'Utilization, cores, logical speed' },
                { id: 'ram', label: 'RAM Diagnostics', desc: 'Capacity size and memory faults' },
                { id: 'peripherals', label: 'Peripherals & Ports', desc: 'Peripherals, network state' }
              ].map(perm => (
                <label key={perm.id} className="flex items-start space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-800/40 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={permissions[perm.id]}
                    onChange={(e) => setPermissions(prev => ({ ...prev, [perm.id]: e.target.checked }))}
                    className="mt-1 accent-emerald-500 rounded border-slate-700 bg-slate-950"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-200 group-hover:text-slate-100">{perm.label}</span>
                    <p className="text-xs text-slate-450 text-slate-400">{perm.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-850">
              <button
                onClick={() => handleGrantConsent(false)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-lg transition-colors text-sm text-center"
              >
                Grant Selected & Diagnose
              </button>
              <button
                onClick={() => handleGrantConsent(true)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-bold px-4 py-2.5 rounded-lg transition-colors text-sm text-center"
              >
                Accept All & Diagnose
              </button>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="sm:w-auto bg-transparent hover:bg-slate-800/30 text-slate-450 hover:text-slate-350 px-4 py-2.5 rounded-lg transition-colors text-sm text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
