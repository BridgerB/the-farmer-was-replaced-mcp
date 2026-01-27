import { readFile } from "fs/promises";
import { PATHS } from "../utils/paths.ts";

let lastLineCount = 0;

const readLines = async () => {
  try {
    const content = await readFile(PATHS.output, "utf-8");
    return content.split("\n").filter((line) => line.trim());
  } catch {
    return [];
  }
};

export const outputRead = async (lines?: number) => {
  const allLines = await readLines();
  const content = lines && lines > 0 ? allLines.slice(-lines) : allLines;
  return { content, lineCount: allLines.length };
};

export const outputWatch = async () => {
  const allLines = await readLines();
  const newLines =
    allLines.length > lastLineCount ? allLines.slice(lastLineCount) : [];
  lastLineCount = allLines.length;
  return { newLines, totalLines: allLines.length };
};

export const outputClear = () => {
  lastLineCount = 0;
  return { success: true };
};
