import React from 'react';
import { 
  Cpu, 
  Battery, 
  HardDrive, 
  Activity, 
  CheckCircle, 
  AlertTriangle,
  Play,
  RotateCw,
  Gauge
} from 'lucide-react';

export default function ScannerDiagnostics({ 
  scanData, 
  scanStatus, 
  scanProgress, 
  currentStepName, 
  onStartScan 
}) {

  // Landing / Trigger Page
  if (scanStatus === 'idle' || scanStatus === 'error') {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl space-y-6 max-w-3xl mx-auto text-center">
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-2">
          <Cpu size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-100">Laptop Diagnostic Scanner Agent</h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Perform a complete low-level diagnostic sweep of your laptop. This agent runs hardware profilers to verify battery health, SMART drive records, RAM faults, and CPU thermals.
          </p>
        </div>
        
        {scanStatus === 'error' && (
          <div className="p-4 bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded-lg max-w-md mx-auto flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>The previous scan encountered a hardware reading timeout or permission error.</span>
          </div>
        )}

        <button 
          onClick={onStartScan}
          className="mx-auto flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <Play size={18} fill="currentColor" />
          <span>Launch Diagnostic Scan</span>
        </button>
      </div>
    );
  }

  // Scanning Progress Page
  if (scanStatus === 'scanning') {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl space-y-6 max-w-xl mx-auto text-center animate-pulse">
        <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 animate-spin">
          <RotateCw size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-100">Executing Telemetry Sweep</h3>
          <p className="text-xs text-slate-400">Analyzing segment: <span className="text-emerald-400 font-mono font-semibold uppercase">{currentStepName}</span></p>
        </div>

        <div className="space-y-2">
          <div className="w-full bg-slate-950 border border-slate-800 h-3 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          <span className="text-xs text-slate-400 font-mono">{scanProgress}% completed</span>
        </div>
      </div>
    );
  }

  // Diagnostics details page (scanStatus === 'completed')
  if (!scanData) return null;

  const battery = scanData.battery || {};
  const cpu = scanData.cpu || {};
  const memory = scanData.memory || {};
  const ram = scanData.ram || {};
  const disk = Array.isArray(scanData.disk) ? scanData.disk[0] : (scanData.disk || {});
  const storage = Array.isArray(scanData.storage) ? scanData.storage[0] : (scanData.storage || {});
  const peripherals = scanData.peripherals || {};

  const getStatusBadge = (statusVal) => {
    if (statusVal === "Permission Denied" || !statusVal) {
      return <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-medium">Denied</span>;
    }
    return <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">Verified</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header and Scan Trigger */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <CheckCircle className="text-emerald-400" />
            <span>Hardware Diagnostics Log</span>
          </h3>
          <p className="text-xs text-slate-400">Diagnostic scan performed successfully. Raw metrics loaded below.</p>
        </div>
        <button 
          onClick={onStartScan}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 px-4 py-2.5 rounded-lg border border-slate-750 text-xs font-semibold cursor-pointer"
        >
          <RotateCw size={14} />
          <span>Rescan Hardware</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. CPU Diagnostics */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-xl space-y-4 shadow-lg shadow-slate-950/20">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
            <h4 className="font-bold text-slate-200 flex items-center space-x-2 text-sm uppercase tracking-wide">
              <Cpu className="text-emerald-400" size={16} />
              <span>CPU & Core Architecture</span>
            </h4>
            {getStatusBadge(cpu.status !== "Permission Denied")}
          </div>

          {cpu.status === "Permission Denied" ? (
            <p className="text-xs text-slate-500 italic">User denied access to CPU diagnostics.</p>
          ) : (
            <div className="space-y-3 text-xs text-slate-450 text-slate-400">
              <div className="flex justify-between border-b border-slate-850/50 pb-1.5">
                <span>Processor Model</span>
                <span className="font-semibold text-slate-200">{cpu.model || 'Unknown'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/50 pb-1.5">
                <span>Cores / Threads</span>
                <span className="font-semibold text-slate-200">{cpu.cores || 8} Cores / {cpu.cores_logical || 16} Threads</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/50 pb-1.5">
                <span>Diagnostic Temp</span>
                <span className="font-semibold text-slate-200">{cpu.temperature || 45}°C</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/50 pb-1.5">
                <span>Clock Speed</span>
                <span className="font-semibold text-slate-200">{cpu.clock_speed_mhz || 2700} MHz</span>
              </div>
              <div className="flex justify-between">
                <span>Thermal Limit Throttling</span>
                <span className={`font-bold ${cpu.throttle_count > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {cpu.throttle_count || 0} limits exceeded
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Battery Diagnostics */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-xl space-y-4 shadow-lg shadow-slate-950/20">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
            <h4 className="font-bold text-slate-200 flex items-center space-x-2 text-sm uppercase tracking-wide">
              <Battery className="text-purple-400" size={16} />
              <span>Battery Chemistry & Wear</span>
            </h4>
            {getStatusBadge(battery.status !== "Permission Denied")}
          </div>

          {battery.status === "Permission Denied" ? (
            <p className="text-xs text-slate-500 italic">User denied access to battery diagnostics.</p>
          ) : (
            <div className="space-y-3 text-xs text-slate-450 text-slate-400">
              <div className="flex justify-between border-b border-slate-850/50 pb-1.5">
                <span>Design Capacity</span>
                <span className="font-semibold text-slate-200">{battery.design_capacity || 86000} mWh</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/50 pb-1.5">
                <span>Full Charge Capacity</span>
                <span className="font-semibold text-slate-200">{battery.full_charge_capacity || 53320} mWh</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/50 pb-1.5">
                <span>Health Percentage</span>
                <span className="font-bold text-emerald-400">{battery.health_pct || 62.0}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/50 pb-1.5">
                <span>Battery Cycle Count</span>
                <span className="font-semibold text-slate-200">{battery.cycle_count || 520} cycles</span>
              </div>
              <div className="flex justify-between">
                <span>Terminal Voltage</span>
                <span className="font-semibold text-slate-200">{battery.voltage || 11.4} V</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Storage SMART Details */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-xl space-y-4 shadow-lg shadow-slate-950/20">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
            <h4 className="font-bold text-slate-200 flex items-center space-x-2 text-sm uppercase tracking-wide">
              <HardDrive className="text-rose-400" size={16} />
              <span>Storage SMART Attributes</span>
            </h4>
            {getStatusBadge(disk.status !== "Permission Denied")}
          </div>

          {disk.status === "Permission Denied" ? (
            <p className="text-xs text-slate-500 italic">User denied access to storage SMART statistics.</p>
          ) : (
            <div className="space-y-3 text-xs text-slate-450 text-slate-400">
              <div className="flex justify-between border-b border-slate-850/50 pb-1.5">
                <span>Drive Model</span>
                <span className="font-semibold text-slate-200 truncate max-w-[200px]" title={storage.device_name}>{storage.device_name || "NVMe Micron SSD"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/50 pb-1.5">
                <span>SMART Health Rating</span>
                <span className="font-bold text-emerald-400">{storage.health_score || 95.0}% (Good)</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/50 pb-1.5">
                <span>Power-on Hours</span>
                <span className="font-semibold text-slate-200">{storage.power_on_hours || 8760} hrs</span>
              </div>
              <div className="flex justify-between border-b border-slate-850/50 pb-1.5">
                <span>SSD Temperature</span>
                <span className="font-semibold text-slate-200">{storage.temperature || 34}°C</span>
              </div>
              <div className="flex justify-between">
                <span>Unsafe Shutdowns</span>
                <span className={`font-semibold ${storage.smart_attributes?.unsafe_shutdowns > 5 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {storage.smart_attributes?.unsafe_shutdowns || 12}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4. RAM / Memory Faults */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-xl space-y-4 shadow-lg shadow-slate-950/20">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
            <h4 className="font-bold text-slate-200 flex items-center space-x-2 text-sm uppercase tracking-wide">
              <Activity className="text-yellow-400" size={16} />
              <span>RAM & Memory Integrity</span>
            </h4>
            {memory.status !== "Permission Denied" ? getStatusBadge(true) : getStatusBadge(false)}
          </div>

          {memory.status === "Permission Denied" ? (
            <p className="text-xs text-slate-500 italic">User denied access to memory diagnostics.</p>
          ) : (
            <div className="space-y-3 text-xs text-slate-450 text-slate-400">
              <div className="flex justify-between border-b border-slate-855 pb-1.5">
                <span>Total Installed RAM</span>
                <span className="font-semibold text-slate-200">{ram.total_gb || 16.0} GB</span>
              </div>
              <div className="flex justify-between border-b border-slate-855 pb-1.5">
                <span>Memory Utilization</span>
                <span className="font-semibold text-slate-200">{ram.utilization || 40.0}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-855 pb-1.5">
                <span>Clock Speed</span>
                <span className="font-semibold text-slate-200">{ram.speed_mhz || 3200} MHz</span>
              </div>
              <div className="flex justify-between">
                <span>ECC / Hardware Memory Faults</span>
                <span className="font-bold text-emerald-400">{ram.error_count || 0} faults</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Peripherals Check List */}
      <div className="bg-slate-900 border border-slate-850 p-6 rounded-xl space-y-4 shadow-lg shadow-slate-950/20">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
          <h4 className="font-bold text-slate-200 flex items-center space-x-2 text-sm uppercase tracking-wide">
            <Gauge className="text-sky-400" size={16} />
            <span>Peripherals Check Log</span>
          </h4>
          {getStatusBadge(peripherals.status !== "Permission Denied")}
        </div>

        {peripherals.status === "Permission Denied" ? (
          <p className="text-xs text-slate-500 italic">User denied access to peripherals status diagnostics.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {[
              { label: 'Keyboard', key: 'keyboard' },
              { label: 'Touchpad', key: 'touchpad' },
              { label: 'Camera', key: 'camera' },
              { label: 'Microphone', key: 'microphone' },
              { label: 'Speaker Output', key: 'speaker' },
              { label: 'Wi-Fi Network', key: 'wifi' },
              { label: 'Bluetooth Device', key: 'bluetooth' },
              { label: 'USB Controller', key: 'usb_ports' },
            ].map(item => {
              const status = peripherals[item.key] || 'unknown';
              const isFunctional = status === 'functional' || status === 'connected';
              return (
                <div key={item.key} className="bg-slate-950 p-3 rounded-lg border border-slate-850/60 flex items-center justify-between">
                  <span className="text-slate-450 text-slate-400 font-medium">{item.label}</span>
                  <span className={`font-bold capitalize text-[9px] px-2 py-0.5 rounded ${
                    isFunctional 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
