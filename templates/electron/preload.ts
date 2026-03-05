import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Window controls
  minimizeWindow: () => ipcRenderer.send("window:minimize"),
  toggleMaximize: () => ipcRenderer.send("window:toggleMaximize"),
  closeWindow: () => ipcRenderer.send("window:close"),
  isMaximized: () => ipcRenderer.invoke("window:isMaximized"),
  onMaximizeChange: (callback: (state: boolean) => void) =>
    ipcRenderer.on("window:maximized", (_, state) => callback(state)),

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
});