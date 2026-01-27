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
  scripts: join(GAME, "Saves", "Save0"),
  output: join(GAME, "output.txt"),
  controlScript: join(MCP_ROOT, "game_control.ps1"),
};
