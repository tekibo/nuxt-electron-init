#!/usr/bin/env node

import { Command } from "commander"
import fs from "fs-extra"
import path from "path"
import prompts from "prompts"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type PackageManager = "pnpm" | "bun" | "yarn" | "npm"

const program = new Command()

program
    .name("nuxt-electron-init")
    .description("Setup Electron for an existing Nuxt 4 project")
    .action(async () => {

        const root = process.cwd()

        /* Check if this is a Nuxt project */
        if (!fs.existsSync("nuxt.config.ts")) {
            console.error("This is not a Nuxt project.")
            process.exit(1)
        }

        /* Interactive Prompts */
        const response = await prompts([
            {
                type: "select",
                name: "pm",
                message: "Select a package manager",
                choices: [
                    { title: "pnpm", value: "pnpm" },
                    { title: "npm", value: "npm" },
                    { title: "yarn", value: "yarn" },
                    { title: "bun", value: "bun" },
                ],
            },
            {
                type: 'text',
                name: 'appName',
                message: 'Enter your App Name for the splash screen:',
                initial: 'My App'
            },
            {
                type: 'text',
                name: 'appDescription',
                message: 'Enter a short description or loading text:',
                initial: 'Initializing Environment...'
            },
            {
                type: 'select',
                name: 'templateType',
                message: 'Select a Splash Screen Template:',
                choices: [
                    { title: 'Modern Gradient (Dark)', value: 'gradient' },
                    { title: 'Minimalist Solid (Light)', value: 'solid' },
                    { title: 'Glassmorphism (Dark)', value: 'glass' }
                ]
            },
            {
                type: 'select',
                name: 'colorPreset',
                message: 'Select a primary color scheme:',
                choices: [
                    { title: 'Blue / Sky', value: '#38bdf8' },
                    { title: 'Purple / Indigo', value: '#818cf8' },
                    { title: 'Emerald / Green', value: '#34d399' },
                    { title: 'Rose / Red', value: '#fb7185' },
                    { title: 'Custom Hex Color', value: 'custom' },
                ]
            },
            {
                type: (prev) => prev === 'custom' ? 'text' : null,
                name: 'customColor',
                message: 'Enter custom hex color (e.g., #ff0000):',
                initial: '#ff0000',
                validate: (value) => /^#[0-9A-Fa-f]{6}$/.test(value) ? true : 'Please enter a valid hex color code (e.g., #ff0000)'
            }
        ])

        if (!response.pm) {
            console.log("Operation cancelled.")
            process.exit(0)
        }

        const pm = response.pm as PackageManager

        const selectedColor = response.colorPreset === 'custom' ? response.customColor : response.colorPreset;

        /* Setup Electron */
        console.log("Setting up Electron...")

        await fs.copy(
            path.join(__dirname, "..", "templates", "electron"),
            path.join(root, "electron"),
            { overwrite: false }
        )
        await fs.copy(
            path.join(__dirname, "..", "templates", "composables"),
            path.join(root, "app", "composables"),
            { overwrite: false }
        )

        await fs.copy(
            path.join(__dirname, "..", "templates", "scripts"),
            path.join(root, "scripts"),
            { overwrite: false }
        )

        await fs.copy(
            path.join(__dirname, "..", "templates", "types"),
            path.join(root, "app", "types"),
            { overwrite: false }
        )

        await fs.copy(
            path.join(__dirname, "..", "templates", "ELECTRON-USAGE.md"),
            path.join(root, "ELECTRON-USAGE.md"),
            { overwrite: false }
        )

        /* Write custom splash screen based on user selection */
        const splashHtml = getSplashHtmlTemplate({
            appName: response.appName,
            appDescription: response.appDescription,
            templateType: response.templateType,
            color: selectedColor
        });
        await fs.writeFile(path.join(root, "electron", "windows", "splash.html"), splashHtml, "utf-8");

        const installMap: Record<PackageManager, [string, string[]]> = {
            pnpm: ["pnpm", ["add", "-D"]],
            npm: ["npm", ["install", "-D"]],
            yarn: ["yarn", ["add", "-D"]],
            bun: ["bun", ["add", "-d"]],
        }

        const [cmd, args] = installMap[pm]

        console.log("Updating package.json...")

        const pkg = await fs.readJSON("package.json")

        pkg.main = "electronmon dist-electron/main.cjs"

        pkg.scripts.electron = "electron ."

        pkg.scripts["build:electron"] = "node scripts/build-electron.mjs"

        pkg.scripts.build = `nuxt build && ${cmd} run build:electron`

        pkg.scripts.dev =
            "concurrently \"nuxt dev\" \"node scripts/build-electron.mjs\" \"wait-on http://localhost:3000 dist-electron/main.cjs && electronmon dist-electron/main.cjs\""


        await fs.writeJSON("package.json", pkg, { spaces: 2 })

        /* Install dependencies */

        console.log("Installing dependencies...")

        console.log("Electron setup complete.")
        console.log("Run the following command to install dependencies:")
        console.log(`${pm} ${args.join(" ")} electron electronmon electron-builder esbuild wait-on @types/wait-on concurrently`)

    })

program.parse()

function getSplashHtmlTemplate(options: { appName: string; appDescription: string; templateType: string; color: string }) {
    const { appName, appDescription, templateType, color } = options;

    let bodyStyles = '';
    let containerStyles = '';
    let headerStyles = '';
    let textStyles = '';
    let loaderStyles = '';

    if (templateType === 'gradient') {
        bodyStyles = `background-color: #0f172a; color: white;`;
        containerStyles = ``;
        headerStyles = `background: linear-gradient(to right, ${color}, #ffffff); -webkit-background-clip: text; background-clip: text; color: transparent;`;
        textStyles = `color: #94a3b8;`;
        loaderStyles = `border-color: rgba(255, 255, 255, 0.1); border-top-color: ${color};`;
    } else if (templateType === 'solid') {
        bodyStyles = `background-color: #ffffff; color: #1f2937;`;
        containerStyles = ``;
        headerStyles = `color: ${color};`;
        textStyles = `color: #6b7280;`;
        loaderStyles = `border-color: rgba(0, 0, 0, 0.1); border-top-color: ${color};`;
    } else if (templateType === 'glass') {
        bodyStyles = `background: linear-gradient(135deg, ${color}33 0%, #0f172a 100%); color: white;`;
        containerStyles = `
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 3rem 4rem;
            border-radius: 1.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        `;
        headerStyles = `color: #ffffff; text-shadow: 0 2px 10px rgba(0,0,0,0.2);`;
        textStyles = `color: #e2e8f0;`;
        loaderStyles = `border-color: rgba(255, 255, 255, 0.1); border-top-color: ${color};`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading ${appName}...</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden;
      ${bodyStyles}
    }

    .splash-container {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      ${containerStyles}
    }

    h1 {
      margin: 0;
      font-size: 2.25rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      ${headerStyles}
    }

    p {
      margin: 0;
      font-size: 0.875rem;
      ${textStyles}
    }

    .loader {
      width: 48px;
      height: 48px;
      border: 3px solid;
      border-radius: 50%;
      animation: spin 1s ease-in-out infinite;
      ${loaderStyles}
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  </style>
</head>
<body>
  <div class="splash-container">
    <div class="loader"></div>
    <div>
      <h1>${appName}</h1>
      <p>${appDescription}</p>
    </div>
  </div>
</body>
</html>
`;
}