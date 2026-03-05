import { ipcMain } from "electron";
import * as fileService from "../services/file-service";

export function registerFilesystemIPC() {
  ipcMain.handle("fs:readFile", async (_, filePath: string) => {
    return await fileService.readFile(filePath);
  });

  ipcMain.handle("fs:writeFile", async (_, filePath: string, content: string) => {
    return await fileService.writeFile(filePath, content);
  });

  ipcMain.handle("fs:readJson", async (_, filePath: string) => {
    return await fileService.readJson(filePath);
  });

  ipcMain.handle("fs:writeJson", async (_, filePath: string, data: any) => {
    return await fileService.writeJson(filePath, data);
  });

  ipcMain.handle("fs:exists", async (_, path: string) => {
    return await fileService.exists(path);
  });

  ipcMain.handle("fs:listFiles", async (_, dirPath: string) => {
    return await fileService.listFiles(dirPath);
  });

  ipcMain.handle("fs:mkdir", async (_, dirPath: string) => {
    return await fileService.mkdir(dirPath);
  });

  ipcMain.handle("fs:deleteFile", async (_, filePath: string) => {
    return await fileService.deleteFile(filePath);
  });
}
