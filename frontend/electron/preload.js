const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  platform: process.platform,
})

// Expose API info
contextBridge.exposeInMainWorld('appConfig', {
  apiUrl: process.env.VITE_API_URL || 'http://localhost:8000',
  isDev: process.env.NODE_ENV === 'development'
})
