import { dialog, ipcMain } from "electron";

export function registerDialogIPC() {
  ipcMain.handle("dialog:openFile", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
    });

    if (result.canceled)
      return null;
    return result.filePaths[0];
  });

  ipcMain.handle("dialog:openFolder", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (result.canceled)
      return null;
    return result.filePaths[0];
  });
}
