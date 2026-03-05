import { spawn } from "node:child_process";
import path from "node:path";
import waitOn from "wait-on";

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

let nuxtProcess: any = null;

export async function startNuxtServer() {
  if (isDev) return;

  // If already running, don't start again
  if (nuxtProcess) return;

  const serverPath = path.join(process.cwd(), ".output/server/index.mjs");

  nuxtProcess = spawn("node", [serverPath], {
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: "3000",
      NODE_ENV: "production",
    },
  });

  nuxtProcess.on("close", (code: number) => {
    console.log(`Nuxt server process exited with code ${code}`);
    nuxtProcess = null;
  });

  await waitOn({
    resources: ["http://localhost:3000"],
    timeout: 30000, // 30 seconds timeout
  });
}

export function stopNuxtServer() {
  if (nuxtProcess) {
    nuxtProcess.kill();
    nuxtProcess = null;
  }
}