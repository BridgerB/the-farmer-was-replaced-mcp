#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { gameStart, gameStop, gameStatus } from "./tools/game.ts";
import { outputRead, outputWatch, outputClear } from "./tools/output.ts";
import { scriptRead, scriptWrite, scriptList } from "./tools/scripts.ts";
import { saveRead, itemsGet } from "./tools/save.ts";

const tool = (
  name: string,
  description: string,
  properties = {},
  required: string[] = [],
) => ({
  name,
  description,
  inputSchema: { type: "object", properties, required },
});

const tools = [
  tool("game_start", "Start game script execution (sends F5 to game)"),
  tool("game_stop", "Stop game script execution (sends Shift+F5 to game)"),
  tool("game_status", "Check if game is running and get recent output"),
  tool("output_read", "Read game output log", {
    lines: {
      type: "number",
      description:
        "Number of lines to read from end (optional, defaults to all)",
    },
  }),
  tool("output_watch", "Get new output lines since last watch call"),
  tool("output_clear", "Reset output watch tracking"),
  tool(
    "script_read",
    "Read a Python script file from the game",
    {
      filename: {
        type: "string",
        description: 'Script filename (e.g., "main" or "main.py")',
      },
    },
    ["filename"],
  ),
  tool(
    "script_write",
    "Write/update a Python script file (game auto-reloads)",
    {
      filename: {
        type: "string",
        description: 'Script filename (e.g., "main" or "main.py")',
      },
      content: { type: "string", description: "Full content of the script" },
    },
    ["filename", "content"],
  ),
  tool("script_list", "List all Python script files"),
  tool("save_read", "Read game save data (items and unlocks)"),
  tool("items_get", "Get current item counts (hay, wood, carrot, etc.)"),
];

const handlers: Record<string, (args: any) => Promise<any>> = {
  game_start: gameStart,
  game_stop: gameStop,
  game_status: gameStatus,
  output_read: (args) => outputRead(args?.lines),
  output_watch: outputWatch,
  output_clear: async () => outputClear(),
  script_read: (args) => scriptRead(args.filename),
  script_write: (args) => scriptWrite(args.filename, args.content),
  script_list: scriptList,
  save_read: saveRead,
  items_get: itemsGet,
};

const jsonResponse = (result: any) => ({
  content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
});

const errorResponse = (error: unknown) => ({
  content: [
    {
      type: "text",
      text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    },
  ],
  isError: true,
});

const server = new Server(
  { name: "farmer-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const handler = handlers[name];
  if (!handler)
    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  try {
    return jsonResponse(await handler(args));
  } catch (error) {
    return errorResponse(error);
  }
});

const transport = new StdioServerTransport();
server
  .connect(transport)
  .then(() => console.error("Farmer MCP server running on stdio"));
