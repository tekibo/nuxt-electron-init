import { dialog, ipcMain } from "electron";

export function registerDialogIPC() {
  ipcMain.handle("dialog:openFile", async (_, options?: Electron.OpenDialogOptions) => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      ...options
    });

    if (result.canceled)
      return null;
    return result.filePaths[0];
  });

  ipcMain.handle("dialog:openFolder", async (_, options?: Electron.OpenDialogOptions) => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
      ...options
    });

    if (result.canceled)
      return null;
    return result.filePaths[0];
  });

  ipcMain.handle("dialog:showSaveDialog", async (_, options?: Electron.SaveDialogOptions) => {
    const result = await dialog.showSaveDialog(options || {});
    if (result.canceled) return null;
    return result.filePath;
  });

  ipcMain.handle("dialog:showMessageBox", async (_, options: Electron.MessageBoxOptions) => {
    return await dialog.showMessageBox(options);
  });

  ipcMain.handle("dialog:showErrorBox", async (_, title: string, content: string) => {
    return dialog.showErrorBox(title, content);
  });
}
