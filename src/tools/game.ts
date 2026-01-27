import { runGameControl } from "../utils/powershell.ts";

const run = async (
  action: "start" | "stop" | "status",
  successKey: string,
  failMsg: string,
) => {
  try {
    const result = await runGameControl(action);
    return { [successKey]: result.startsWith("OK"), message: result };
  } catch (error) {
    return {
      [successKey]: false,
      message: error instanceof Error ? error.message : failMsg,
    };
  }
};

export const gameStart = () => run("start", "success", "Unknown error");
export const gameStop = () => run("stop", "success", "Unknown error");
export const gameStatus = () => run("status", "running", "Game not found");
