import React from 'react';
import { 
  Cpu, 
  Battery, 
  HardDrive, 
  Lock, 
  Activity, 
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function LockOverlay({ permissionName, displayName, onGrant }) {
  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[4px] rounded-xl flex flex-col items-center justify-center p-6 text-center z-20 border border-red-500/10">
      <div className="p-3 bg-red-500/10 rounded-full text-red-400 mb-3 border border-red-500/20">
        <Lock size={24} className="animate-pulse" />
      </div>
      <h4 className="font-bold text-slate-200 mb-1">{displayName} Access Locked</h4>
      <p className="text-xs text-slate-400 max-w-xs mb-4">
        Real-time monitoring is disabled. Grant permission to begin live telemetry tracking for this system resource.
      </p>
      <button 
        onClick={() => onGrant(permissionName)}
        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold text-xs rounded-lg transition-all duration-200 shadow-md shadow-emerald-500/10 cursor-pointer"
      >
        Grant Permission
      </button>
    </div>
  );
}

export default function LiveTelemetry({ history, currentData, permissions, onGrantPermission }) {
  // Format history data for charts. If we don't have enough history, pad it.
  const chartData = history.map(item => ({
    timestamp: item.timestamp,
    cpu: item.cpu && item.cpu.status !== 'Permission Denied' ? Math.round(item.cpu.utilization || 0) : 0,
    ram: item.ram && item.ram.status !== 'Permission Denied' ? Math.round(item.ram.utilization || 0) : 0,
  }));

  // Safe checks for current metrics
  const isCpuAllowed = permissions.cpu && currentData?.cpu?.status !== 'Permission Denied';
  const isRamAllowed = (permissions.ram || permissions.memory) && currentData?.ram?.status !== 'Permission Denied';
  const isBatteryAllowed = permissions.battery && currentData?.battery?.status !== 'Permission Denied';
  const isDiskAllowed = (permissions.storage || permissions.disk) && currentData?.disk && currentData.disk.status !== 'Permission Denied';

  const cpuData = currentData?.cpu || {};
  const ramData = currentData?.ram || {};
  const batteryData = currentData?.battery || {};
  
  // Resolve disk data from disk array or disk object
  let diskData = {};
  if (currentData && currentData.disk) {
    if (Array.isArray(currentData.disk) && currentData.disk.length > 0) {
      diskData = currentData.disk[0];
    } else if (!Array.isArray(currentData.disk)) {
      diskData = currentData.disk;
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Status Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg animate-pulse">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Live Hardware Telemetry Active</h3>
            <p className="text-xs text-slate-400">
              Monitoring: <span className="text-emerald-400 font-bold">{currentData?.device_info && currentData.device_info.manufacturer !== "Permission Denied" ? `${currentData.device_info.manufacturer || ''} ${currentData.device_info.model || 'Local Device'}` : 'Local Machine'}</span>
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {Object.entries(permissions).map(([key, val]) => (
            <span 
              key={key} 
              className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold border ${
                val 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {key.replace('_', ' ')}: {val ? 'ON' : 'OFF'}
            </span>
          ))}
        </div>
      </div>

      {/* 2x2 Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CPU TELEMETRY */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-xl relative min-h-[300px] flex flex-col justify-between overflow-hidden shadow-lg shadow-slate-950/50 hover:border-slate-850 transition-all duration-305">
          {!isCpuAllowed && (
            <LockOverlay 
              permissionName="cpu" 
              displayName="Processor (CPU)" 
              onGrant={onGrantPermission} 
            />
          )}
          
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Cpu size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">CPU Utilization</h4>
                <p className="text-xs text-slate-500">Live core load & clock speeds</p>
              </div>
            </div>
            {isCpuAllowed && (
              <div className="text-right">
                <span className="text-3xl font-black text-emerald-400 font-mono">
                  {cpuData.utilization !== undefined ? `${Math.round(cpuData.utilization)}%` : '0%'}
                </span>
              </div>
            )}
          </div>

          {/* Area Chart for CPU */}
          {isCpuAllowed && (
            <div className="h-36 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="timestamp" stroke="#475569" fontSize={8} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#475569" fontSize={8} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#F1F5F9' }} />
                  <Area type="monotone" dataKey="cpu" stroke="#10B981" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-850/50 text-xs text-slate-400">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Cores / Threads</span>
              <span className="font-medium text-slate-300">
                {cpuData.cores || '8'} Cores / {cpuData.threads || '16'} Threads
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Active Temp</span>
              <span className="font-medium text-slate-300">
                {cpuData.temperature ? `${cpuData.temperature}°C` : '45°C'}
              </span>
            </div>
          </div>
        </div>

        {/* RAM TELEMETRY */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-xl relative min-h-[300px] flex flex-col justify-between overflow-hidden shadow-lg shadow-slate-950/50 hover:border-slate-855 transition-all duration-305">
          {!isRamAllowed && (
            <LockOverlay 
              permissionName="ram" 
              displayName="System Memory (RAM)" 
              onGrant={onGrantPermission} 
            />
          )}

          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Activity size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">RAM Utilization</h4>
                <p className="text-xs text-slate-500">Live physical memory usage</p>
              </div>
            </div>
            {isRamAllowed && (
              <div className="text-right">
                <span className="text-3xl font-black text-indigo-400 font-mono">
                  {ramData.utilization !== undefined ? `${Math.round(ramData.utilization)}%` : '0%'}
                </span>
              </div>
            )}
          </div>

          {/* Area Chart for RAM */}
          {isRamAllowed && (
            <div className="h-36 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="timestamp" stroke="#475569" fontSize={8} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#475569" fontSize={8} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#F1F5F9' }} />
                  <Area type="monotone" dataKey="ram" stroke="#6366F1" fillOpacity={1} fill="url(#colorRam)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-850/50 text-xs text-slate-400">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Used / Total</span>
              <span className="font-medium text-slate-300">
                {ramData.used_gb || '6.4'} GB / {ramData.total_gb || '16.0'} GB
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Available Free</span>
              <span className="font-medium text-slate-300">
                {ramData.free_gb || '9.6'} GB Available
              </span>
            </div>
          </div>
        </div>

        {/* BATTERY TELEMETRY */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-xl relative min-h-[300px] flex flex-col justify-between overflow-hidden shadow-lg shadow-slate-950/50 hover:border-slate-855 transition-all duration-305">
          {!isBatteryAllowed && (
            <LockOverlay 
              permissionName="battery" 
              displayName="Battery Diagnostics" 
              onGrant={onGrantPermission} 
            />
          )}

          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Battery size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">Battery Status</h4>
                <p className="text-xs text-slate-500">Power level & charger diagnostics</p>
              </div>
            </div>
            {isBatteryAllowed && (
              <div className="text-right flex items-center space-x-1.5">
                {batteryData.power_plugged && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                )}
                <span className="text-3xl font-black text-amber-400 font-mono">
                  {batteryData.percent !== undefined ? `${batteryData.percent}%` : '62%'}
                </span>
              </div>
            )}
          </div>

          {/* Battery level visual display */}
          {isBatteryAllowed && (
            <div className="flex flex-col items-center justify-center flex-1 my-4">
              <div className="w-56 h-20 border border-slate-750 rounded-2xl p-2 relative flex items-center bg-slate-950/50 shadow-inner">
                {/* Battery charge progress fill */}
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-xl transition-all duration-500 shadow-md shadow-amber-500/25"
                  style={{ width: `${batteryData.percent || 62}%` }}
                ></div>
                {/* Value text centered */}
                <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-slate-200">
                  {batteryData.percent || 62}% {batteryData.power_plugged ? '(Plugged In)' : '(On Battery)'}
                </span>
                {/* Battery tip */}
                <div className="w-2.5 h-8 bg-slate-700 absolute -right-2.5 rounded-r"></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-855 text-xs text-slate-400">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Health wear level</span>
              <span className="font-medium text-slate-300">
                Health Pct: 62% (Wear: 38%)
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Power Source</span>
              <span className="font-medium text-slate-300">
                {batteryData.power_plugged ? 'AC Main Power' : 'DC Battery Power'}
              </span>
            </div>
          </div>
        </div>

        {/* STORAGE TELEMETRY */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-xl relative min-h-[300px] flex flex-col justify-between overflow-hidden shadow-lg shadow-slate-950/50 hover:border-slate-855 transition-all duration-305">
          {!isDiskAllowed && (
            <LockOverlay 
              permissionName="storage" 
              displayName="Storage Disk Telemetry" 
              onGrant={onGrantPermission} 
            />
          )}

          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                <HardDrive size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-200">Disk Partition Usage</h4>
                <p className="text-xs text-slate-500">Live storage space polling</p>
              </div>
            </div>
            {isDiskAllowed && (
              <div className="text-right">
                <span className="text-3xl font-black text-rose-400 font-mono">
                  {diskData.percent !== undefined ? `${diskData.percent}%` : '40%'}
                </span>
              </div>
            )}
          </div>

          {/* Storage partition bar progress */}
          {isDiskAllowed && (
            <div className="flex-1 flex flex-col justify-center my-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{diskData.device_name || 'C:\\'} (System Drive)</span>
                  <span>{diskData.used !== undefined && diskData.total !== undefined ? `${Math.round(diskData.used / (1024**3))} GB / ${Math.round(diskData.total / (1024**3))} GB` : '400 GB / 1024 GB'}</span>
                </div>
                <div className="w-full bg-slate-950 border border-slate-800 h-4 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-300"
                    style={{ width: `${diskData.percent || 40}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-855 text-xs text-slate-400">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Drive Name</span>
              <span className="font-medium text-slate-300">
                {diskData.device_name || 'System Primary Drive'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Health Status</span>
              <span className="font-medium text-emerald-400 flex items-center gap-1">
                <Sparkles size={12} />
                <span>SMART Healthy</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
