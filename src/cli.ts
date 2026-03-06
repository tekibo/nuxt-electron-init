#!/usr/bin/env node

import { Command } from "commander"
import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"
import pc from "picocolors"
import boxen from "boxen"

import { askQuestions } from "./prompts.js"
import { setupElectron } from "./setup.js"
import { updatePackageJson } from "./package.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const templatesDir = path.join(__dirname, "..", "templates")

const program = new Command()

program
    .name("nuxt-electron-init")
    .description("Setup Electron for an existing Nuxt 4 project")
    .action(async () => {

        const root = process.cwd()

        /* Check if this is a Nuxt project */
        if (!fs.existsSync("nuxt.config.ts")) {
            console.error(pc.red("✖ This is not a Nuxt project."))
            process.exit(1)
        }

        /* Interactive Prompts */
        const options = await askQuestions();
        if (!options) {
            console.log(pc.red("✖ Operation cancelled."))
            process.exit(0)
        }

        /* Setup Electron & Templates */
        await setupElectron(root, templatesDir, options)

        /* Update package.json */
        const { cmd, args } = await updatePackageJson(options.pm)

        /* Finish up */
        const installCommand = `${cmd} ${args.join(" ")} electron electronmon electron-builder esbuild wait-on @types/wait-on concurrently`;

        const finishMessage = `
            ${pc.green(pc.bold("✨ Electron setup complete! ✨"))}

            ${pc.white("Run the following command to install dependencies:")}

            ${pc.cyan(installCommand)}

            ${pc.white("Then, run:")}
            ${pc.cyan(`${cmd} run dev`)} ${pc.gray("- To start the development server")}
            ${pc.cyan(`${cmd} run build`)} ${pc.gray("- To build your application")}
            `;

        console.log(
            boxen(finishMessage.trim(), {
                padding: 1,
                borderColor: "green",
                borderStyle: "round",
                margin: { top: 1, bottom: 1 },
            })
        )

    })

program.parse()