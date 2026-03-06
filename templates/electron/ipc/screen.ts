import { ipcMain, screen } from "electron";

export function registerScreenIPC() {
    ipcMain.handle("screen:getCursorScreenPoint", () => {
        return screen.getCursorScreenPoint();
    });

    ipcMain.handle("screen:getPrimaryDisplay", () => {
        const display = screen.getPrimaryDisplay();
        return {
            id: display.id,
            bounds: display.bounds,
            workArea: display.workArea,
            size: display.size,
            workAreaSize: display.workAreaSize,
            scaleFactor: display.scaleFactor
        };
    });

    ipcMain.handle("screen:getAllDisplays", () => {
        return screen.getAllDisplays().map(display => ({
            id: display.id,
            bounds: display.bounds,
            workArea: display.workArea,
            size: display.size,
            scaleFactor: display.scaleFactor
        }));
    });
}
