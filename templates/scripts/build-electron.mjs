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
});

await ctx.watch();
