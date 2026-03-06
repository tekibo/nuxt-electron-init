import fs from "fs-extra";
import { PackageManager } from "./types.js";
import pc from "picocolors";

export async function updatePackageJson(pm: PackageManager) {
    console.log(pc.blue("⚙️  Updating package.json..."))

    const installMap: Record<PackageManager, [string, string[]]> = {
        pnpm: ["pnpm", ["add", "-D"]],
        npm: ["npm", ["install", "-D"]],
        yarn: ["yarn", ["add", "-D"]],
        bun: ["bun", ["add", "-d"]],
    }
    const [cmd, args] = installMap[pm];

    const pkg = await fs.readJSON("package.json")

    pkg.main = "electronmon dist-electron/main.cjs"

    pkg.scripts.electron = "electron ."

    pkg.scripts["build:electron"] = "node scripts/build-electron.mjs"

    pkg.scripts.build = `nuxt build && ${cmd} run build:electron`

    pkg.scripts.dev =
        "concurrently \"nuxt dev\" \"node scripts/build-electron.mjs\" \"wait-on http://localhost:3000 dist-electron/main.cjs && electronmon dist-electron/main.cjs\""


    await fs.writeJSON("package.json", pkg, { spaces: 2 })

    return { cmd, args };
}
