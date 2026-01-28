import { homedir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const GAME = join(
  homedir(),
  "AppData",
  "LocalLow",
  "TheFarmerWasReplaced",
  "TheFarmerWasReplaced",
);
const MCP_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export const PATHS = {
  gameRoot: GAME,
  saves: join(GAME, "Saves"),
  output: join(GAME, "output.txt"),
  controlScript: join(MCP_ROOT, "game_control.ahk"),
  ahkExe: join(
    homedir(),
    "AppData",
    "Local",
    "Programs",
    "AutoHotkey",
    "v2",
    "AutoHotkey64.exe",
  ),
};

export const getScriptsPath = (save: string = "Save0") =>
  join(GAME, "Saves", save);
