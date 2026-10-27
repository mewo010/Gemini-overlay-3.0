const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  desktopCapturer,
  screen,
  Tray,
  Menu,
  nativeImage,
} = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let currentHotkey = 'Alt+Space';

function createOverlayWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: 680,
    height: 720,
    x: Math.round((width - 680) / 2),
    y: Math.round(height - 760),
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    show: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });

  if (process.platform === 'win32') {
    try {
      mainWindow.setBackgroundMaterial?.('acrylic');
    } catch (e) {
      console.log('Background material not supported on this Windows build:', e);
    }
  }

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function toggleOverlay() {
  if (!mainWindow) {
    createOverlayWindow();
    mainWindow.show();
    mainWindow.focus();
    return;
  }

  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.webContents.send('overlay-shown');
  }
}

function registerGlobalHotkey(shortcut) {
  try {
    globalShortcut.unregisterAll();
    const success = globalShortcut.register(shortcut || 'Alt+Space', () => {
      toggleOverlay();
    });
    if (success) {
      currentHotkey = shortcut;
      console.log(`Registered global hotkey: ${shortcut}`);
    }
  } catch (err) {
    console.error('Error registering hotkey:', err);
  }
}

function createTray() {
  const icon = nativeImage.createFromBuffer(
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGD4z0ABYBw1gGE0DBiA7kC8mJGBgZGRAb8GfG6g2QCimkaDAU1DAwMA2uAEwQ2qfGAAAAAElFTkSuQmCC',
      'base64'
    )
  );

  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Toggle WinGemini Overlay', click: () => toggleOverlay() },
    { label: `Hotkey: ${currentHotkey}`, enabled: false },
    { type: 'separator' },
    {
      label: 'Start with Windows',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: (item) => {
        app.setLoginItemSettings({ openAtLogin: item.checked });
      },
    },
    { type: 'separator' },
    { label: 'Quit WinGemini', click: () => app.quit() },
  ]);

  tray.setToolTip('WinGemini - Mobile-Style Windows AI Overlay');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => toggleOverlay());
}

ipcMain.handle('capture-screen', async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1920, height: 1080 },
    });
    if (sources.length > 0) {
      return sources[0].thumbnail.toDataURL();
    }
    return null;
  } catch (error) {
    console.error('Failed to capture desktop screenshot:', error);
    return null;
  }
});

ipcMain.on('hide-overlay', () => {
  if (mainWindow) mainWindow.hide();
});

ipcMain.on('set-hotkey', (_event, newHotkey) => {
  registerGlobalHotkey(newHotkey);
});

app.whenReady().then(() => {
  createOverlayWindow();
  registerGlobalHotkey('Alt+Space');
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createOverlayWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
