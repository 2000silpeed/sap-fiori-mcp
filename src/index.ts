import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TOOL_DEFINITIONS, type ToolName } from "./tool-registry.js";
import { fioriConnect, fioriClose, fioriSessionInfo } from "./tools/connection.js";
import { fioriScreenshot, fioriPageInfo, fioriControlGet } from "./tools/read.js";
import { fioriNavigate, fioriLaunchpadTile } from "./tools/navigate.js";
import { fioriControlSet, fioriControlPress } from "./tools/write.js";
import { fioriWaitFor } from "./tools/stability.js";
import { fioriTableRows } from "./tools/table.js";
import { sessionManager } from "./session-manager.js";

const server = new Server(
  { name: "sap-fiori-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOL_DEFINITIONS.map((def) => ({
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name as ToolName;
  const args = (request.params.arguments ?? {}) as Record<string, unknown>;

  let result: Record<string, unknown>;

  try {
    switch (name) {
      case "fiori_connect":
        result = await fioriConnect(args);
        break;
      case "fiori_close":
        result = await fioriClose();
        break;
      case "fiori_session_info":
        result = fioriSessionInfo();
        break;
      case "fiori_screenshot":
        result = await fioriScreenshot(args as { label?: string });
        break;
      case "fiori_page_info":
        result = await fioriPageInfo();
        break;
      case "fiori_control_get":
        result = await fioriControlGet(args as { selector: Record<string, unknown> });
        break;
      case "fiori_navigate":
        result = await fioriNavigate(args as { hash?: string; url?: string });
        break;
      case "fiori_launchpad_tile":
        result = await fioriLaunchpadTile(args as { title: string });
        break;
      case "fiori_control_set":
        result = await fioriControlSet(args as { selector: Record<string, unknown>; value: unknown });
        break;
      case "fiori_control_press":
        result = await fioriControlPress(args as { selector: Record<string, unknown> });
        break;
      case "fiori_wait_for":
        result = await fioriWaitFor(args as { selector: Record<string, unknown>; timeout?: number });
        break;
      case "fiori_table_rows":
        result = await fioriTableRows(args as { selector: Record<string, unknown>; maxRows?: number });
        break;
      default:
        result = { error: true, message: `Unknown tool: ${name}` };
    }
  } catch (err) {
    result = { error: true, message: err instanceof Error ? err.message : String(err) };
  }

  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
  };
});

process.on("SIGINT", async () => {
  await sessionManager.disconnect();
  process.exit(0);
});

const transport = new StdioServerTransport();
await server.connect(transport);
