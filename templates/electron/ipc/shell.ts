import { ipcMain, shell } from "electron";

export function registerShellIPC() {
    ipcMain.handle("shell:openExternal", async (_, url: string) => {
        return await shell.openExternal(url);
    });

    ipcMain.handle("shell:showItemInFolder", (_, fullPath: string) => {
        shell.showItemInFolder(fullPath);
    });

    ipcMain.handle("shell:openPath", async (_, path: string) => {
        return await shell.openPath(path);
    });

    ipcMain.handle("shell:trashItem", async (_, path: string) => {
        return await shell.trashItem(path);
    });

    ipcMain.handle("shell:beep", () => {
        shell.beep();
    });
}
