const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

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
  if (process.platform !== 'darwin') {
    app.quit();
  }
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
    
    console.log(`Spawning scanner using: ${pythonPath} ${scriptPath}`);
    const pyProcess = spawn(pythonPath, [scriptPath]);
    
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
