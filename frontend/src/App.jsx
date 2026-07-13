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
  RefreshCw
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, completed, error
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStepName, setCurrentStepName] = useState('Initializing');
  const [scanResults, setScanResults] = useState(null);
  const [isElectron, setIsElectron] = useState(false);

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
    setScanStatus('scanning');
    setScanProgress(0);
    setCurrentStepName('Initializing');

    if (window.electronAPI) {
      try {
        const results = await window.electronAPI.startScan({ mode: 'full' });
        console.log('Scan finished with results:', results);
        setScanResults(results);
        setScanStatus('completed');
        setScanProgress(100);
      } catch (err) {
        console.error('Scan process failed:', err);
        setScanStatus('error');
      }
    } else {
      // Mock scanner simulation for browser testing
      console.log('Running in browser sandbox — simulating scanner...');
      const mockSteps = [
        { name: 'system_info', progress: 10 },
        { name: 'battery', progress: 25 },
        { name: 'storage', progress: 45 },
        { name: 'cpu', progress: 60 },
        { name: 'ram', progress: 75 },
        { name: 'peripherals', progress: 90 },
        { name: 'finalizing', progress: 100 }
      ];

      for (const step of mockSteps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setScanProgress(step.progress);
        setCurrentStepName(step.name);
      }

      const mockData = {
        device_info: {
          manufacturer: "Dell Inc. (Simulated)",
          model: "XPS 15 9520",
          serial_number: "SIM-FXRT2K3",
          os_version: "Windows 11 Home",
          processor: "Intel Core i7-12700H"
        },
        battery: {
          design_capacity: 86000,
          full_charge_capacity: 53320,
          health_pct: 62.0,
          cycle_count: 520,
          voltage: 11.4,
          charge_rate: 0
        },
        storage: [{
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
          }
        }],
        cpu: {
          model: "12th Gen Intel Core i7-12700H",
          cores: 14,
          threads: 20,
          clock_speed_mhz: 2700,
          temperature: 45.5,
          utilization: 12.5,
          throttle_count: 0
        },
        ram: {
          total_gb: 16.0,
          used_gb: 6.4,
          free_gb: 9.6,
          utilization: 40.0,
          speed_mhz: 3200,
          error_count: 0
        },
        peripherals: {
          keyboard: "functional",
          touchpad: "functional",
          camera: "functional",
          microphone: "functional",
          speaker: "functional",
          wifi: "connected",
          bluetooth: "functional",
          usb_ports: "functional"
        }
      };

      setScanResults(mockData);
      setScanStatus('completed');
    }
  };

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
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
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
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-slate-400">Overall Health Score</span>
                  <Activity className="text-emerald-400" size={20} />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold text-slate-100">
                    {scanResults ? Math.round((scanResults.battery.health_pct + scanResults.storage[0].health_score + 90) / 3) : '--'}
                  </span>
                  {scanResults && (
                    <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Grade B+</span>
                  )}
                </div>
                <div className="mt-4 text-xs text-slate-400 flex items-center space-x-1.5">
                  <CheckCircle size={14} className="text-emerald-400" />
                  <span>{scanResults ? 'Battery is primary concern' : 'Run diagnostic scan first'}</span>
                </div>
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
              </div>

              <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-slate-400">Total Carbon Saved</span>
                  <Leaf className="text-emerald-400" size={20} />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-extrabold text-slate-100">{scanResults ? '335' : '--'}</span>
                  {scanResults && <span className="text-sm text-slate-300">kg CO2</span>}
                </div>
                <div className="mt-4 text-xs text-slate-400 flex items-center space-x-1.5">
                  <Clock size={14} className="text-emerald-400" />
                  <span>{scanResults ? 'Equivalent to 15.2 trees planted' : 'Offsets pending diagnosis'}</span>
                </div>
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
              </div>

              <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-medium text-slate-400">Recommended Path</span>
                  <SettingsIcon className="text-amber-400" size={20} />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-bold text-amber-400">{scanResults ? 'REPAIR RECOMMENDED' : '--'}</span>
                </div>
                <div className="mt-4 text-xs text-slate-400 flex items-center space-x-1.5">
                  <AlertTriangle size={14} className="text-amber-400" />
                  <span>{scanResults ? `Battery capacity: ${scanResults.battery.health_pct}%` : 'Diagnosis pending'}</span>
                </div>
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
              </div>
            </div>

            {/* Quick Actions / Scan CTA */}
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
                {scanStatus === 'completed' && (
                  <div className="flex items-center space-x-3">
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 font-semibold flex items-center space-x-1.5">
                      <CheckCircle size={12} />
                      <span>Scan Successful</span>
                    </span>
                    <button 
                      onClick={triggerScan}
                      className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded text-slate-200 transition-all"
                    >
                      <RefreshCw size={12} />
                      <span>Rescan</span>
                    </button>
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

            {/* Results Grid */}
            {scanResults && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Device Info */}
                <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-xl space-y-4">
                  <h3 className="text-base font-bold text-slate-200 border-b border-slate-800 pb-2">Device Specification</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Manufacturer</span><span className="font-semibold">{scanResults.device_info.manufacturer}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Model</span><span className="font-semibold">{scanResults.device_info.model}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Serial Number</span><span className="font-mono text-xs">{scanResults.device_info.serial_number}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">OS Version</span><span className="font-semibold">{scanResults.device_info.os_version}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Processor</span><span className="font-semibold text-xs text-right max-w-[200px] truncate">{scanResults.device_info.processor}</span></div>
                  </div>
                </div>

                {/* Battery Details */}
                <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-xl space-y-4">
                  <h3 className="text-base font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>Battery Health</span>
                    <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">Degraded</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Design Capacity</span><span>{scanResults.battery.design_capacity} mWh</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Full Charge Capacity</span><span>{scanResults.battery.full_charge_capacity} mWh</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">State of Health (SOH)</span><span className="font-semibold text-amber-400">{scanResults.battery.health_pct}%</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Cycle Count</span><span>{scanResults.battery.cycle_count} cycles</span></div>
                  </div>
                </div>

                {/* Storage & Memory */}
                <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-xl space-y-4">
                  <h3 className="text-base font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>Storage Health</span>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Excellent</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Disk Name</span><span className="font-semibold text-xs">{scanResults.storage[0].device_name}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">SMART Status Score</span><span className="font-semibold text-emerald-400">{scanResults.storage[0].health_score}%</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Power On Hours</span><span>{scanResults.storage[0].power_on_hours} hrs</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Temperature</span><span>{scanResults.storage[0].temperature} °C</span></div>
                  </div>
                </div>

                {/* CPU & RAM Usage */}
                <div className="bg-slate-900 border border-slate-800/80 p-6 rounded-xl space-y-4">
                  <h3 className="text-base font-bold text-slate-200 border-b border-slate-800 pb-2">Active Utilization</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">CPU Usage</span><span>{Math.round(scanResults.cpu.utilization)}%</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">RAM Total</span><span>{scanResults.ram.total_gb} GB</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">RAM Usage</span><span>{Math.round(scanResults.ram.utilization)}% ({scanResults.ram.used_gb} GB used)</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Memory Faults</span><span className="text-emerald-400">{scanResults.ram.error_count} detected</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs for scanner details */}
        {activeTab === 'scanner' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl space-y-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Cpu className="text-emerald-400" />
              <span>Diagnostic Scanner Telemetry</span>
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Below are the telemetry sources polled by the local scanner agent. This data feeds into the circular economy recommendation engine.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Battery Diagnostics', desc: 'Cycles, Design capacity, Full Charge capacity, Voltage', status: 'ready' },
                { name: 'Storage SMART Parameters', desc: 'Read error rates, Reallocated sectors, Power-on hours', status: 'ready' },
                { name: 'RAM Health Diagnostics', desc: 'Total capacity, clock speed, hardware memory faults', status: 'ready' },
                { name: 'CPU Thermals & Throttling', desc: 'Thermal limits, speed step limits, active cores', status: 'ready' },
              ].map((item, index) => (
                <div key={index} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-slate-200 text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-medium capitalize">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Preferences</h3>
            <p className="text-sm text-slate-400">Configure application and remote backend endpoints.</p>
            <div className="space-y-3 max-w-md pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Backend Endpoint URL</label>
                <input 
                  type="text" 
                  defaultValue="http://localhost:8000/api/v1" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
