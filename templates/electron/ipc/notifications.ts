import { ipcMain, Notification } from "electron";

export function registerNotificationIPC() {
    ipcMain.handle("notification:show", (_, options: Electron.NotificationConstructorOptions) => {
        const notification = new Notification(options);
        notification.show();

        return new Promise((resolve) => {
            notification.on('click', () => resolve('click'));
            notification.on('close', () => resolve('close'));
        });
    });
}
