# Farmer MCP

MCP server for controlling "The Farmer Was Replaced" game.

## Requirements

- Node.js 23+ (native TypeScript support)
- Windows (game is Windows-only)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add to your project's `.mcp.json`:
```json
{
  "mcpServers": {
    "farmer": {
      "command": "node",
      "args": ["/path/to/the-farmer-was-replaced-mcp/src/index.ts"]
    }
  }
}
```

3. Restart Claude Code

## Tools

### Game Control
- `game_start` - Start script execution (F5)
- `game_stop` - Stop script execution (Shift+F5)
- `game_status` - Check if game is running

### Output
- `output_read` - Read game output log
- `output_watch` - Get new lines since last watch
- `output_clear` - Reset watch tracking

### Scripts
- `script_read` - Read a .py script file
- `script_write` - Write/update a script (auto-reloads)
- `script_list` - List all scripts

### Save Data
- `save_read` - Read save.json (items + unlocks)
- `items_get` - Get item counts
