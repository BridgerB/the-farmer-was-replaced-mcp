import { readFile, readdir } from "fs/promises";
import { join } from "path";
import { PATHS, getScriptsPath } from "../utils/paths.ts";

interface SaveData {
  items: { serializeList: Array<{ name: string; nr: number }> };
  unlocks: string[];
}

export const saveRead = async (save?: string) => {
  try {
    const content = await readFile(
      join(getScriptsPath(save), "save.json"),
      "utf-8",
    );
    const data: SaveData = JSON.parse(content);
    const items = data.items.serializeList.reduce(
      (acc, { name, nr }) => ({ ...acc, [name]: Math.floor(nr) }),
      {},
    );
    return { items, unlocks: data.unlocks || [] };
  } catch (error) {
    return {
      items: {},
      unlocks: [],
      error: error instanceof Error ? error.message : "Failed to read save",
    };
  }
};

export const itemsGet = async (save?: string) => (await saveRead(save)).items;

export const savesList = async () => {
  try {
    const entries = await readdir(PATHS.saves, { withFileTypes: true });
    const saves = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name);
    return { saves };
  } catch {
    return { saves: [] };
  }
};
