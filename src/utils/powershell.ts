import { spawn } from "child_process";
import { PATHS } from "./paths.ts";

export const runGameControl = (
  action: "start" | "stop" | "status",
): Promise<string> =>
  new Promise((resolve, reject) => {
    const ps = spawn("powershell", [
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      PATHS.controlScript,
      "-Action",
      action,
    ]);
    let stdout = "";
    let stderr = "";
    ps.stdout.on("data", (d) => {
      stdout += d;
    });
    ps.stderr.on("data", (d) => {
      stderr += d;
    });
    ps.on("close", (code) =>
      code === 0
        ? resolve(stdout.trim())
        : reject(new Error(stderr || `Exit code ${code}`)),
    );
    ps.on("error", reject);
  });
