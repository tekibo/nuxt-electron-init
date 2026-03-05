import { app, ipcMain } from "electron";
import * as paths from "../utils/paths";

export function registerAppIPC() {
  ipcMain.handle("app:getVersion", () => {
    return app.getVersion();
  });

  ipcMain.handle("app:getName", () => {
    return app.getName();
  });

  ipcMain.handle("app:getPaths", () => {
    return {
      userData: paths.USER_DATA_PATH,
      temp: paths.TEMP_PATH,
      home: paths.HOME_PATH,
      desktop: paths.DESKTOP_PATH,
      documents: paths.DOCUMENTS_PATH,
      downloads: paths.DOWNLOADS_PATH,
      app: paths.APP_PATH,
      logs: paths.LOGS_PATH,
      storage: paths.STORAGE_PATH,
    };
  });

  ipcMain.handle("app:getPath", (_, pathName: keyof typeof paths) => {
    return (paths as any)[pathName];
  });
}
