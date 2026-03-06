import { clipboard, ipcMain } from "electron";

export function registerClipboardIPC() {
    ipcMain.handle("clipboard:writeText", (_, text: string) => {
        clipboard.writeText(text);
    });

    ipcMain.handle("clipboard:readText", () => {
        return clipboard.readText();
    });

    ipcMain.handle("clipboard:writeHTML", (_, html: string) => {
        clipboard.writeHTML(html);
    });

    ipcMain.handle("clipboard:readHTML", () => {
        return clipboard.readHTML();
    });

    ipcMain.handle("clipboard:clear", () => {
        clipboard.clear();
    });
}
