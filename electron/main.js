const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let activeMonitorProcess = null;

function killActiveMonitor() {
  if (activeMonitorProcess) {
    console.log('Main process: Killing active hardware monitor process...');
    try {
      activeMonitorProcess.kill();
    } catch (e) {
      console.error('Error killing monitor process:', e);
    }
    activeMonitorProcess = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#0F172A', // slate-900 matching frontend dark mode
    title: 'ReLife AI — Laptop Health Assessment',
  });

  const devUrl = 'http://localhost:5173';
  
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  killActiveMonitor();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  killActiveMonitor();
});

// IPC communication handlers to launch diagnostic scanner
ipcMain.handle('start-hardware-scan', async (event, args) => {
  console.log('Main process: Starting local hardware diagnostics...', args);
  
  return new Promise((resolve, reject) => {
    // Resolve python path (Windows venv, Mac/Linux fallbacks)
    let pythonPath = path.join(__dirname, '../venv/Scripts/python.exe');
    if (process.platform !== 'win32') {
      pythonPath = path.join(__dirname, '../venv/bin/python');
    }
    
    const scriptPath = path.join(__dirname, '../scanner/main.py');
    
    // Parse permissions from arguments
    let allowedList = [];
    if (args && args.permissions) {
      for (const [key, value] of Object.entries(args.permissions)) {
        if (value === true) {
          allowedList.push(key);
        }
      }
    } else {
      allowedList = ['system_info', 'battery', 'storage', 'cpu', 'ram', 'peripherals'];
    }
    const allowArg = allowedList.join(',');
    const pyArgs = [scriptPath, '--allow', allowArg];
    
    console.log(`Spawning scanner using: ${pythonPath} ${pyArgs.join(' ')}`);
    const pyProcess = spawn(pythonPath, pyArgs);
    
    let buffer = '';
    
    pyProcess.stdout.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const payload = JSON.parse(line);
          if (payload.type === 'progress') {
            if (mainWindow) {
              mainWindow.webContents.send('scan-progress-event', payload);
            }
            if (payload.status === 'completed') {
              resolve(payload.data);
            }
          }
        } catch (err) {
          console.error('Failed to parse stdout line:', line, err);
        }
      }
    });
    
    pyProcess.stderr.on('data', (data) => {
      const errorMsg = data.toString();
      console.error('Scanner stderr:', errorMsg);
      if (mainWindow) {
        mainWindow.webContents.send('scan-error-event', { error: errorMsg });
      }
    });
    
    pyProcess.on('close', (code) => {
      console.log(`Scanner subprocess exited with code ${code}`);
      if (code !== 0) {
        reject(new Error(`Scanner exited with code ${code}`));
      }
    });
  });
});

ipcMain.handle('start-hardware-monitor', async (event, args) => {
  console.log('Main process: Starting local hardware telemetry monitor...', args);
  killActiveMonitor();

  return new Promise((resolve) => {
    let pythonPath = path.join(__dirname, '../venv/Scripts/python.exe');
    if (process.platform !== 'win32') {
      pythonPath = path.join(__dirname, '../venv/bin/python');
    }
    const scriptPath = path.join(__dirname, '../scanner/main.py');

    let allowedList = [];
    if (args && args.permissions) {
      for (const [key, value] of Object.entries(args.permissions)) {
        if (value === true) {
          allowedList.push(key);
        }
      }
    } else {
      allowedList = ['system_info', 'battery', 'storage', 'cpu', 'ram'];
    }
    const allowArg = allowedList.join(',');
    const interval = args && args.interval ? args.interval : 1.5;

    const pyArgs = [scriptPath, '--monitor', '--allow', allowArg, '--interval', String(interval)];
    console.log(`Spawning monitor using: ${pythonPath} ${pyArgs.join(' ')}`);

    const pyProcess = spawn(pythonPath, pyArgs);
    activeMonitorProcess = pyProcess;

    let buffer = '';
    pyProcess.stdout.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const payload = JSON.parse(line);
          if (payload.type === 'monitor' && mainWindow) {
            mainWindow.webContents.send('monitor-data-event', payload.data);
          }
        } catch (err) {
          console.error('Failed to parse monitor stdout line:', line, err);
        }
      }
    });

    pyProcess.stderr.on('data', (data) => {
      console.error('Monitor stderr:', data.toString());
    });

    pyProcess.on('close', (code) => {
      console.log(`Monitor subprocess exited with code ${code}`);
      if (activeMonitorProcess === pyProcess) {
        activeMonitorProcess = null;
      }
    });

    resolve(true);
  });
});

ipcMain.handle('stop-hardware-monitor', async () => {
  killActiveMonitor();
  return true;
});
