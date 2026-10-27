const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  captureScreen: () => ipcRenderer.invoke('capture-screen'),
  hideOverlay: () => ipcRenderer.send('hide-overlay'),
  setHotkey: (shortcut) => ipcRenderer.send('set-hotkey', shortcut),
  onOverlayShown: (callback) => ipcRenderer.on('overlay-shown', () => callback()),
});
