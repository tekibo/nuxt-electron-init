import { app, Menu } from "electron";
import { registerAppIPC } from "./ipc/app";
import { registerDialogIPC } from "./ipc/dialog";
import { registerFilesystemIPC } from "./ipc/filesystem";
import { registerWindowIPC } from "./ipc/window";
import { stopNuxtServer } from "./services/nuxt-server";
import { createMainWindow } from "./windows/main-window";

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);

  registerDialogIPC();
  registerAppIPC();
  registerFilesystemIPC();

  await createMainWindow();
  registerWindowIPC();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    stopNuxtServer();
    app.quit();
  }
});

app.on("will-quit", () => {
  stopNuxtServer();
});
