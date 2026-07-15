const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startScan: (args) => ipcRenderer.invoke('start-hardware-scan', args),
  onScanProgress: (callback) => ipcRenderer.on('scan-progress-event', (event, data) => callback(data)),
  onScanComplete: (callback) => ipcRenderer.on('scan-complete-event', (event, data) => callback(data)),
  onScanError: (callback) => ipcRenderer.on('scan-error-event', (event, data) => callback(data)),
  startMonitor: (args) => ipcRenderer.invoke('start-hardware-monitor', args),
  stopMonitor: () => ipcRenderer.invoke('stop-hardware-monitor'),
  onMonitorData: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('monitor-data-event', subscription);
    return () => {
      ipcRenderer.removeListener('monitor-data-event', subscription);
    };
  },
});
