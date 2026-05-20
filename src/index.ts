import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TOOL_DEFINITIONS, type ToolName } from "./tool-registry.js";
import { fioriConnect, fioriClose, fioriSessionInfo } from "./tools/connection.js";
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
