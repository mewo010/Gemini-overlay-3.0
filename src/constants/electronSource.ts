export const ELECTRON_PACKAGE_JSON = `{
  "name": "wingemini",
  "productName": "WinGemini",
  "version": "1.0.0",
  "description": "Windows floating Gemini overlay inspired by Android mobile assistant with global hotkey, screen context vision, and multi-model AI.",
  "main": "electron/main.js",
  "author": "WinGemini Team",
  "license": "Apache-2.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "electron .",
    "package:win": "vite build && electron-builder --win --x64"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.1",
    "electron": "^34.2.0",
    "electron-builder": "^25.1.8",
    "tailwindcss": "^4.3.3",
    "typescript": "^7.0.2",
    "vite": "^8.3.0"
  },
  "build": {
    "appId": "com.wingemini.desktop",
    "productName": "WinGemini",
    "directories": {
      "output": "dist_electron"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "package.json"
    ],
    "win": {
      "target": [
        "nsis",
        "portable",
        "zip"
      ],
      "icon": "electron/assets/icon.ico",
      "artifactName": "\${productName}-\${version}-\${target}.\${ext}"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "WinGemini Overlay"
    },
    "portable": {
      "artifactName": "\${productName}-Portable-\${version}.\${ext}"
    }
  }
}`;

export const ELECTRON_MAIN_JS = `const { app, BrowserWindow, globalShortcut, ipcMain, desktopCapturer, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let tray = null;
let currentHotkey = 'Alt+Space';

// Disable hardware acceleration issues on transparent windows if needed
// app.disableHardwareAcceleration();

function createOverlayWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: 680,
    height: 720,
    x: Math.round((width - 680) / 2),
    y: Math.round(height - 760), // Position nicely near the taskbar like mobile Gemini
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    show: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
    },
  });

  // Windows 11 Acrylic / Mica background effect
  if (process.platform === 'win32') {
    try {
      mainWindow.setBackgroundMaterial?.('acrylic');
    } catch (e) {
      console.log('Background material not supported on this Windows build:', e);
    }
  }

  // Load production build or dev server
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Hide when clicking outside or blur
  mainWindow.on('blur', () => {
    // Optional: Hide on blur if user configured click-away dismiss
    // mainWindow.hide();
  });

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
    // Notify renderer that overlay was activated
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
      console.log(\`Successfully registered global hotkey: \${shortcut}\`);
    } else {
      console.warn(\`Failed to register hotkey: \${shortcut}\`);
    }
  } catch (err) {
    console.error('Error registering hotkey:', err);
  }
}

function createTray() {
  // 16x16 transparent dot or app icon
  const icon = nativeImage.createFromBuffer(
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGD4z0ABYBw1gGE0DBiA7kC8mJGBgZGRAb8GfG6g2QCimkaDAU1DAwMA2uAEwQ2qfGAAAAAElFTkSuQmCC',
      'base64'
    )
  );
  
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Toggle WinGemini Overlay', click: () => toggleOverlay() },
    { label: \`Current Hotkey: \${currentHotkey}\`, enabled: false },
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

// IPC Handlers
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

ipcMain.on('set-window-size', (_event, { width, height }) => {
  if (mainWindow) {
    mainWindow.setSize(width, height);
  }
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
`;

export const ELECTRON_PRELOAD_JS = `const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  captureScreen: () => ipcRenderer.invoke('capture-screen'),
  hideOverlay: () => ipcRenderer.send('hide-overlay'),
  setHotkey: (shortcut) => ipcRenderer.send('set-hotkey', shortcut),
  setWindowSize: (size) => ipcRenderer.send('set-window-size', size),
  onOverlayShown: (callback) => ipcRenderer.on('overlay-shown', () => callback()),
});
`;

export const README_MD = `# WinGemini 🌌 - Windows Mobile-Style AI Overlay

> A fast, beautiful Windows floating Gemini assistant modeled after the Android mobile overlay experience. Features global hotkey trigger (\`Alt + Space\`), instant screen vision ("Ask about this screen"), multi-provider API support (Google Gemini, OpenRouter, OpenAI, Groq), and an automated GitHub Actions CI/CD pipeline.

---

## ⚡ Features

- **📱 Mobile-Style Overlay**: Frosted glass Acrylic/Mica card with animated Gemini gradient glow border and compact floating pill mode.
- **⌨️ Global Hotkey**: Press \`Alt + Space\` (or your customized hotkey) anywhere in Windows to summon the assistant over any game, code editor, or app.
- **👁️ "Ask About This Screen"**: One-click screen capture that passes the active desktop context to Gemini 3.8 Flash or OpenRouter Claude 3.5 Sonnet to summarize, find bugs, or answer questions.
- **🔌 Multi-Provider AI**: Built-in support for:
  - **Google Gemini** (Gemini 3.8 Flash, 3.1 Flash Lite, Gemini 4 Argon)
  - **OpenRouter** (DeepSeek R1, Claude 3.5 Sonnet, GPT-4o, Llama 3.3 70B)
  - **OpenAI** (GPT-4o, GPT-4o-mini)
  - **Groq** (Ultra-fast LPU inference)
  - **Local Ollama / Custom Endpoints** (\`http://localhost:11434/v1\`)
- **📦 Turnkey GitHub Actions CI/CD**: Dual-job workflow that builds Windows installer \`.exe\`, portable \`.exe\`, and \`.zip\`, then automatically publishes them to your GitHub repository **Releases** tab!

---

## 🚀 How to Build & Release via GitHub Actions (3 Minutes)

### Step 1: Create a New GitHub Repository
1. Go to [GitHub New Repository](https://github.com/new).
2. Name it \`wingemini\` and create it.

### Step 2: Push This Code
Unzip the downloaded project and run:
\`\`\`bash
git init
git add .
git commit -m "Initial commit of WinGemini Windows Overlay"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/wingemini.git
git push -u origin main
\`\`\`

### Step 3: Trigger the Build & Release Workflow
You have two easy ways to trigger the build:

#### Option A: Push a Version Tag (Recommended)
\`\`\`bash
git tag v1.0.0
git push origin v1.0.0
\`\`\`

#### Option B: Manual Trigger in GitHub UI
1. Go to your GitHub repository.
2. Click the **Actions** tab.
3. Select **"Build & Release Windows App"** from the left sidebar.
4. Click **"Run workflow"**, choose the branch (\`main\`), and click the green button.

### Step 4: Download Your Windows Apps!
Once the workflow completes (approx. 3-4 minutes):
1. Click the **Releases** tab on your repository's right-hand sidebar.
2. Under Release **v1.0.0**, you will find:
   - \`WinGemini-Setup-1.0.0.exe\` (Full Windows Installer)
   - \`WinGemini-Portable-1.0.0.exe\` (Zero-install portable app)
   - \`WinGemini-1.0.0-win.zip\` (Portable ZIP bundle)
   - \`SHA256SUMS.txt\` (Checksums)

---

## 🛠️ Local Development

If you want to run or test locally on your Windows machine:
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Start Vite dev server & Electron window
npm run dev
# in a second terminal:
npm run start

# 3. Build Windows installer locally
npm run package:win
\`\`\`
`;
