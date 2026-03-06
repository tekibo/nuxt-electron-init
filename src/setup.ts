import fs from "fs-extra";
import path from "path";
import { SetupOptions } from "./types.js";
import { getSplashHtmlTemplate } from "./splash.js";
import pc from "picocolors";
import boxen from "boxen";

export async function setupElectron(root: string, templatesDir: string, options: SetupOptions) {
    console.log(
        boxen(
            pc.cyan(pc.bold("Setting up Electron Environment...")),
            { padding: 1, borderColor: "cyan", borderStyle: "round" }
        )
    )

    await fs.copy(
        path.join(templatesDir, "electron"),
        path.join(root, "electron"),
        { overwrite: true }
    )
    await fs.copy(
        path.join(templatesDir, "composables"),
        path.join(root, "app", "composables"),
        { overwrite: true }
    )

    await fs.copy(
        path.join(templatesDir, "scripts"),
        path.join(root, "scripts"),
        { overwrite: true }
    )

    await fs.copy(
        path.join(templatesDir, "types"),
        path.join(root, "app", "types"),
        { overwrite: true }
    )

    await fs.copy(
        path.join(templatesDir, "ELECTRON-USAGE.md"),
        path.join(root, "ELECTRON-USAGE.md"),
        { overwrite: true }
    )

    const selectedColor = options.colorPreset === 'custom' ? options.customColor! : options.colorPreset;

    /* Write custom splash screen based on user selection */
    const splashHtml = getSplashHtmlTemplate({
        appName: options.appName,
        appDescription: options.appDescription,
        templateType: options.templateType,
        color: selectedColor
    });

    await fs.writeFile(path.join(root, "electron", "windows", "splash.html"), splashHtml, "utf-8");
}
