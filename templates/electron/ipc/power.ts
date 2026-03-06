import { ipcMain, powerMonitor, BrowserWindow } from "electron";

export function registerPowerIPC() {
    // We use events here because powerMonitor is event-driven
    powerMonitor.on('suspend', () => {
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('power:suspend');
        });
    });

    powerMonitor.on('resume', () => {
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('power:resume');
        });
    });

    powerMonitor.on('on-ac', () => {
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('power:on-ac');
        });
    });

    powerMonitor.on('on-battery', () => {
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('power:on-battery');
        });
    });

    ipcMain.handle("power:isOnBattery", () => {
        return powerMonitor.isOnBatteryPower();
    });
}
