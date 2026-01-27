import { readFile, writeFile, readdir } from "fs/promises";
import { join } from "path";
import { PATHS } from "../utils/paths.ts";

const ensurePy = (f: string) => (f.endsWith(".py") ? f : f + ".py");

const isInvalidPath = (f: string) =>
  f.includes("..") || f.includes("/") || f.includes("\\");

export const scriptRead = async (filename: string) => {
  try {
    const content = await readFile(
      join(PATHS.scripts, ensurePy(filename)),
      "utf-8",
    );
    return { content };
  } catch (error) {
    return {
      content: "",
      error: error instanceof Error ? error.message : "Failed to read file",
    };
  }
};

export const scriptWrite = async (filename: string, content: string) => {
  const name = ensurePy(filename);
  if (isInvalidPath(name)) return { success: false, error: "Invalid filename" };
  try {
    await writeFile(join(PATHS.scripts, name), content, "utf-8");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to write file",
    };
  }
};

export const scriptList = async () => {
  try {
    const files = await readdir(PATHS.scripts);
    return {
      files: files.filter((f) => f.endsWith(".py") && !f.startsWith("__")),
    };
  } catch {
    return { files: [] };
  }
};
