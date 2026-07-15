import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Battery, 
  HardDrive, 
  Cpu, 
  Leaf, 
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import axios from 'axios';

// API base URL for FastAPI backend
const API_BASE = 'http://localhost:8000/api/v1';

export default function Dashboard({ scanData, deviceData }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Submit the scan data to the backend
    const submitScan = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${API_BASE}/scans/submit`, {
          device_info: deviceData,
          scan_data: scanData
        });
        setReport(response.data);
      } catch (err) {
        console.error("Error submitting scan:", err);
        setError("Failed to generate report from backend.");
      } finally {
        setLoading(false);
      }
    };
    
    if (scanData && deviceData) {
      submitScan();
    }
  }, [scanData, deviceData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-400">Analyzing hardware & calculating health scores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
        <p className="text-gray-300">{error}</p>
      </div>
    );
  }

  if (!report) return null;

  const getHealthColor = (score) => {
    if (score >= 80) return '#10B981'; // green-500
    if (score >= 50) return '#F59E0B'; // yellow-500
    return '#EF4444'; // red-500
  };

  const healthColor = getHealthColor(report.health_score);
  
  // Data for the health dial chart
  const healthData = [
    { name: 'Score', value: report.health_score },
    { name: 'Remaining', value: 100 - report.health_score }
  ];

  const pieColors = [healthColor, '#374151']; // colored and gray-700

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">Digital Device Passport</h2>
        <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors border border-gray-700">
          <FileText size={18} />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Device Info Panel */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 shadow-lg shadow-slate-950/20">
        <div>
          <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Device Model</span>
          <span className="text-sm font-bold text-slate-100">{deviceData?.manufacturer || 'Unknown'} {deviceData?.model || 'Unknown'}</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Operating System</span>
          <span className="text-sm font-bold text-emerald-450 text-emerald-400">{deviceData?.os_version || 'Unknown'}</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Processor Specs</span>
          <span className="text-sm font-bold text-slate-200 truncate block" title={deviceData?.processor}>{deviceData?.processor || 'Unknown'}</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Serial Number</span>
          <span className="text-sm font-mono font-bold text-slate-300">{deviceData?.serial_number || 'Unknown'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Score Card */}
        <div className="bg-gray-800/80 backdrop-blur border border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-green-500/50 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-gray-400 font-medium mb-2 uppercase tracking-wider text-sm z-10">Overall Health</h3>
          <div className="h-48 w-full z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Health Score']}
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center pointer-events-none">
              <span className="text-4xl font-black text-white" style={{ color: healthColor }}>
                {report.health_score.toFixed(1)}
              </span>
              <span className="text-gray-400 text-lg">/100</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 z-10">
            {report.health_score >= 80 ? (
              <><CheckCircle size={18} className="text-green-500" /><span className="text-green-400 font-medium">Excellent Condition</span></>
            ) : report.health_score >= 50 ? (
              <><AlertTriangle size={18} className="text-yellow-500" /><span className="text-yellow-400 font-medium">Needs Attention</span></>
            ) : (
              <><AlertTriangle size={18} className="text-red-500" /><span className="text-red-400 font-medium">Critical Condition</span></>
            )}
          </div>
        </div>

        {/* Repairability Card */}
        <div className="bg-gray-800/80 backdrop-blur border border-gray-700 rounded-xl p-6 flex flex-col justify-between hover:border-blue-500/50 transition-colors">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 mb-4">
              <Activity size={20} />
              <h3 className="font-semibold uppercase tracking-wider text-sm">Repairability Score</h3>
            </div>
            <div className="text-5xl font-black text-white mb-2">
              {report.repairability_score?.toFixed(1) || "N/A"}<span className="text-2xl text-gray-500 font-normal">/10</span>
            </div>
            <p className="text-gray-400 text-sm">
              Indicates how easily this device can be disassembled and repaired based on known manufacturer metrics.
            </p>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full" 
                style={{ width: `${(report.repairability_score / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Carbon Impact Card */}
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-green-800/50 rounded-xl p-6 flex flex-col justify-between hover:border-green-500/50 transition-colors">
          <div>
            <div className="flex items-center space-x-2 text-green-400 mb-4">
              <Leaf size={20} />
              <h3 className="font-semibold uppercase tracking-wider text-sm">Eco Impact</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4">By repairing and reusing this device instead of replacing it, you save:</p>
            
            <div className="space-y-4">
              <div className="flex items-end space-x-3">
                <span className="text-3xl font-bold text-green-400">{report.carbon_savings?.co2_saved_kg}</span>
                <span className="text-gray-400 pb-1">kg CO₂e avoided</span>
              </div>
              <div className="flex items-end space-x-3">
                <span className="text-3xl font-bold text-emerald-400">{report.carbon_savings?.trees_equivalent}</span>
                <span className="text-gray-400 pb-1">trees equivalent</span>
              </div>
              <div className="flex items-end space-x-3">
                <span className="text-3xl font-bold text-teal-400">{report.carbon_savings?.ewaste_diverted_kg}</span>
                <span className="text-gray-400 pb-1">kg e-waste diverted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Details */}
      <h3 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2">Hardware Diagnostics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Battery */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
              <Battery size={20} />
            </div>
            <h4 className="font-medium text-gray-200">Battery</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Level</span>
              <span className="text-white font-medium">
                {scanData.battery?.status === "Permission Denied" 
                  ? "Denied" 
                  : (scanData.battery?.percent !== undefined ? `${scanData.battery.percent}%` : "N/A")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className="text-white font-medium">
                {scanData.battery?.status === "Permission Denied" 
                  ? "Denied" 
                  : (scanData.battery?.power_plugged ? "Charging" : "Discharging")}
              </span>
            </div>
          </div>
        </div>

        {/* CPU */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Cpu size={20} />
            </div>
            <h4 className="font-medium text-gray-200">Processor</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Usage</span>
              <span className="text-white font-medium">
                {scanData.cpu?.status === "Permission Denied" 
                  ? "Denied" 
                  : (scanData.cpu?.percent !== undefined ? `${scanData.cpu.percent}%` : "N/A")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cores</span>
              <span className="text-white font-medium">
                {scanData.cpu?.status === "Permission Denied" 
                  ? "Denied" 
                  : (scanData.cpu?.cores_logical !== undefined ? `${scanData.cpu.cores_logical} Logical` : "N/A")}
              </span>
            </div>
          </div>
        </div>

        {/* Memory */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg">
              <Activity size={20} />
            </div>
            <h4 className="font-medium text-gray-200">Memory</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total</span>
              <span className="text-white font-medium">
                {scanData.memory?.status === "Permission Denied" 
                  ? "Denied" 
                  : (scanData.memory?.total !== undefined ? `${Math.round(scanData.memory.total / (1024**3))} GB` : "N/A")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Used</span>
              <span className="text-white font-medium">
                {scanData.memory?.status === "Permission Denied" 
                  ? "Denied" 
                  : (scanData.memory?.percent !== undefined ? `${scanData.memory.percent}%` : "N/A")}
              </span>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
              <HardDrive size={20} />
            </div>
            <h4 className="font-medium text-gray-200">Storage</h4>
          </div>
          {scanData.disk?.status === "Permission Denied" ? (
            <div className="text-sm text-red-400">Denied</div>
          ) : scanData.disk?.length > 0 ? (
             <div className="space-y-2 text-sm">
             <div className="flex justify-between">
               <span className="text-gray-400">Total</span>
               <span className="text-white font-medium">{Math.round((scanData.disk[0]?.total || 0) / (1024**3))} GB</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-400">Used</span>
               <span className="text-white font-medium">{scanData.disk[0]?.percent || "N/A"}%</span>
             </div>
           </div>
          ) : (
            <div className="text-sm text-gray-400">No disk data</div>
          )}
        </div>
      </div>
      
      {/* Physical Damage Report */}
      {report.physical_damage && (
        <div className={`border rounded-lg p-4 mt-6 flex items-start space-x-4 ${report.physical_damage.has_damage ? 'bg-orange-900/20 border-orange-700/50' : 'bg-green-900/20 border-green-700/50'}`}>
          <div className={`p-2 rounded-full ${report.physical_damage.has_damage ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
            {report.physical_damage.has_damage ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
          </div>
          <div>
            <h4 className={`font-semibold ${report.physical_damage.has_damage ? 'text-orange-300' : 'text-green-300'}`}>
              Computer Vision Damage Assessment
            </h4>
            <p className="text-gray-300 mt-1">
              {report.physical_damage.description}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
