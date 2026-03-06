import path from "node:path";
import { BrowserWindow } from "electron";
import { startNuxtServer } from "../services/nuxt-server";

let win: BrowserWindow | null = null;
let splashWin: BrowserWindow | null = null;

export async function createMainWindow() {
  // Show Splash Screen First
  splashWin = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    center: true,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  await splashWin.loadFile(path.join(__dirname, "splash.html"));

  // Now boot Nuxt quietly in background
  await startNuxtServer();

  const url = process.env.NUXT_DEV_URL || "http://localhost:3000";

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: "hiddenInset",
    show: false, // Don't show immediately, prefer splash screen

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // Once Nuxt is fully loaded, show the main window and destroy the splash screen
  win.once("ready-to-show", () => {
    if (splashWin && !splashWin.isDestroyed()) {
      splashWin.close();
      splashWin = null;
    }
    win?.show();
  });

  await win.loadURL(url);

  return win;
}

export function getMainWindow() {
  return win;
}
