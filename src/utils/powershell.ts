import { spawn } from "child_process";
import { PATHS } from "./paths.ts";

export const runGameControl = (
  action: "start" | "stop" | "status",
): Promise<string> =>
  new Promise((resolve, reject) => {
    const ahk = spawn(PATHS.ahkExe, [PATHS.controlScript, action]);
    let stdout = "";
    let stderr = "";
    ahk.stdout.on("data", (d) => {
      stdout += d;
    });
    ahk.stderr.on("data", (d) => {
      stderr += d;
    });
    ahk.on("close", (code) =>
      code === 0
        ? resolve(stdout.trim())
        : reject(new Error(stderr || stdout || `Exit code ${code}`)),
    );
    ahk.on("error", reject);
  });
