const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startScan: (args) => ipcRenderer.invoke('start-hardware-scan', args),
  onScanProgress: (callback) => ipcRenderer.on('scan-progress-event', (event, data) => callback(data)),
  onScanComplete: (callback) => ipcRenderer.on('scan-complete-event', (event, data) => callback(data)),
  onScanError: (callback) => ipcRenderer.on('scan-error-event', (event, data) => callback(data)),
});
