import { ipcMain } from "electron";
import { getMainWindow } from "../windows/main-window";

export function registerWindowIPC() {
  const win = getMainWindow();

  ipcMain.on("window:minimize", () => {
    getMainWindow()?.minimize();
  });

  ipcMain.on("window:toggleMaximize", () => {
    const win = getMainWindow();
    if (!win)
      return;
    win.isMaximized() ? win.unmaximize() : win.maximize();
  });

  ipcMain.on("window:close", () => {
    getMainWindow()?.close();
  });

  ipcMain.handle("window:isMaximized", () => {
    return getMainWindow()?.isMaximized() || false;
  });

  // Listen for maximize/unmaximize and notify the renderer
  if (win) {
    win.on("maximize", () => win.webContents.send("window:maximized", true));
    win.on("unmaximize", () => win.webContents.send("window:maximized", false));
  }
}
