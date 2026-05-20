export const TOOL_DEFINITIONS = [
  {
    name: "fiori_connect",
    description:
      "SAP Fiori Launchpad에 브라우저로 연결합니다. url/username/password를 생략하면 환경변수(FIORI_BASE_URL, FIORI_USERNAME, FIORI_PASSWORD)를 사용합니다.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Fiori Launchpad URL (예: http://s4hana.corp/sap/bc/ui5_ui5/sap/fiorilaunchpad.html)" },
        username: { type: "string", description: "SAP 사용자 ID" },
        password: { type: "string", description: "SAP 패스워드" },
      },
    },
  },
  {
    name: "fiori_close",
    description: "현재 브라우저 세션을 종료합니다.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "fiori_session_info",
    description: "현재 세션 상태(idle/initializing/ready/error), URL, 에러 메시지를 조회합니다.",
    inputSchema: { type: "object", properties: {} },
  },
] as const;

export type ToolName = typeof TOOL_DEFINITIONS[number]["name"];
