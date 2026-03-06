#!/usr/bin/env node

import { Command } from "commander"
import fs from "fs-extra"
import path from "path"
import { prompt } from "prompts"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type PackageManager = "pnpm" | "bun" | "yarn" | "npm"

function detectPackageManager(): PackageManager {
    if (fs.existsSync("pnpm-lock.yaml")) return "pnpm"
    if (fs.existsSync("bun.lock")) return "bun"
    if (fs.existsSync("yarn.lock")) return "yarn"
    return "npm"
}

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
            root,
            { overwrite: false }
        )

        /* Update package.json */

        /* Select project manager */
        const pm = await prompt({
            type: "select",
            name: "pm",
            message: "Select a project manager",
            choices: [
                { title: "pnpm", value: "pnpm" },
                { title: "npm", value: "npm" },
                { title: "yarn", value: "yarn" },
                { title: "bun", value: "bun" },
            ],
        }) as { pm: PackageManager }

        const installMap: Record<PackageManager, [string, string[]]> = {
            pnpm: ["pnpm", ["add", "-D"]],
            npm: ["npm", ["install", "-D"]],
            yarn: ["yarn", ["add", "-D"]],
            bun: ["bun", ["add", "-d"]],
        }

        const [cmd, args] = installMap[pm.pm]

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
        console.log(`${pm} ${args} electron electronmon electron-builder esbuild wait-on @types/wait-on concurrently`)

    })

program.parse()