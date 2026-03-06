import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import esbuild from "esbuild";

const ctx = await esbuild.context({
  entryPoints: [
    "electron/main.ts",
    "electron/preload.ts",
  ],
  bundle: true,
  platform: "node",
  outdir: "dist-electron",
  external: ["electron"],
  format: "cjs",
  target: "node20",
  outExtension: { ".js": ".cjs" },
  plugins: [
    {
      name: "copy-html",
      setup(build) {
        build.onEnd(() => {
          const src = path.join(process.cwd(), "electron/windows/splash.html");
          const destDir = path.join(process.cwd(), "dist-electron");
          if (!existsSync(destDir))
            mkdirSync(destDir, { recursive: true });

          if (existsSync(src)) {
            copyFileSync(src, path.join(destDir, "splash.html"));
          }
        });
      },
    },
  ],
});

await ctx.watch();
