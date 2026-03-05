import path from "node:path";
import { BrowserWindow } from "electron";
import { startNuxtServer } from "../services/nuxt-server";

let win: BrowserWindow | null = null;

export async function createMainWindow() {
  await startNuxtServer();

  const url = process.env.NUXT_DEV_URL || "http://localhost:3000";

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: "hidden",
    show: process.env.NODE_ENV === "development",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  if (process.env.NODE_ENV !== "development") {
    win.once("ready-to-show", () => win?.show());
  }

  await win.loadURL(url);

  return win;
}

export function getMainWindow() {
  return win;
}
