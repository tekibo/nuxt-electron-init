import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Window controls
  minimizeWindow: () => ipcRenderer.send("window:minimize"),
  toggleMaximize: () => ipcRenderer.send("window:toggleMaximize"),
  closeWindow: () => ipcRenderer.send("window:close"),
  isMaximized: () => ipcRenderer.invoke("window:isMaximized"),
  onMaximizeChange: (callback: (state: boolean) => void) =>
    ipcRenderer.on("window:maximized", (_, state) => callback(state)),

  // Context Menu
  showContextMenu: (items?: any[]) => ipcRenderer.send("context-menu", items),
  onContextMenuClick: (callback: (id: string) => void) => {
    ipcRenderer.removeAllListeners("context-menu-click");
    ipcRenderer.on("context-menu-click", (_event, id) => callback(id));
  },

  // Dialogs
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  openFolder: () => ipcRenderer.invoke("dialog:openFolder"),

  // App info
  getVersion: () => ipcRenderer.invoke("app:getVersion"),
  getName: () => ipcRenderer.invoke("app:getName"),
  getPaths: () => ipcRenderer.invoke("app:getPaths"),
  getPath: (pathName: string) => ipcRenderer.invoke("app:getPath", pathName),

  // Filesystem
  readFile: (filePath: string) => ipcRenderer.invoke("fs:readFile", filePath),
  writeFile: (filePath: string, content: string) =>
    ipcRenderer.invoke("fs:writeFile", filePath, content),
  readJson: (filePath: string) => ipcRenderer.invoke("fs:readJson", filePath),
  writeJson: (filePath: string, data: any) =>
    ipcRenderer.invoke("fs:writeJson", filePath, data),
  exists: (path: string) => ipcRenderer.invoke("fs:exists", path),
  listFiles: (dirPath: string) => ipcRenderer.invoke("fs:listFiles", dirPath),
  mkdir: (dirPath: string) => ipcRenderer.invoke("fs:mkdir", dirPath),
  deleteFile: (filePath: string) => ipcRenderer.invoke("fs:deleteFile", filePath),

  // Shell
  openExternal: (url: string) => ipcRenderer.invoke("shell:openExternal", url),
  showItemInFolder: (path: string) => ipcRenderer.invoke("shell:showItemInFolder", path),
  openPath: (path: string) => ipcRenderer.invoke("shell:openPath", path),
  trashItem: (path: string) => ipcRenderer.invoke("shell:trashItem", path),
  beep: () => ipcRenderer.invoke("shell:beep"),

  // Clipboard
  writeClipboardText: (text: string) => ipcRenderer.invoke("clipboard:writeText", text),
  readClipboardText: () => ipcRenderer.invoke("clipboard:readText"),
  writeClipboardHTML: (html: string) => ipcRenderer.invoke("clipboard:writeHTML", html),
  readClipboardHTML: () => ipcRenderer.invoke("clipboard:readHTML"),
  clearClipboard: () => ipcRenderer.invoke("clipboard:clear"),

  // Power
  isOnBattery: () => ipcRenderer.invoke("power:isOnBattery"),
  onPowerEvent: (event: string, callback: () => void) => {
    const channel = `power:${event}`;
    ipcRenderer.on(channel, () => callback());
  },

  // Screen
  getCursorScreenPoint: () => ipcRenderer.invoke("screen:getCursorScreenPoint"),
  getPrimaryDisplay: () => ipcRenderer.invoke("screen:getPrimaryDisplay"),
  getAllDisplays: () => ipcRenderer.invoke("screen:getAllDisplays"),

  // Notifications
  showNotification: (options: any) => ipcRenderer.invoke("notification:show", options),

  // Expanded Dialogs
  showSaveDialog: (options: any) => ipcRenderer.invoke("dialog:showSaveDialog", options),
  showMessageBox: (options: any) => ipcRenderer.invoke("dialog:showMessageBox", options),
  showErrorBox: (title: string, content: string) => ipcRenderer.invoke("dialog:showErrorBox", title, content),
});
