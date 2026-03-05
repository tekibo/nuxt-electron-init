import path from "node:path";
import { app } from "electron";

export const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const APP_PATH = app.getAppPath();
export const USER_DATA_PATH = app.getPath("userData");
export const TEMP_PATH = app.getPath("temp");
export const HOME_PATH = app.getPath("home");
export const DESKTOP_PATH = app.getPath("desktop");
export const DOCUMENTS_PATH = app.getPath("documents");
export const DOWNLOADS_PATH = app.getPath("downloads");

export const LOGS_PATH = path.join(USER_DATA_PATH, "logs");
export const STORAGE_PATH = path.join(USER_DATA_PATH, "storage");
