import { readFile } from "fs/promises";
import { join } from "path";
import { PATHS } from "../utils/paths.ts";

interface SaveData {
  items: { serializeList: Array<{ name: string; nr: number }> };
  unlocks: string[];
}

export const saveRead = async () => {
  try {
    const content = await readFile(join(PATHS.scripts, "save.json"), "utf-8");
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

export const itemsGet = async () => (await saveRead()).items;
