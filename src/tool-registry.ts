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
  {
    name: "fiori_screenshot",
    description: "현재 Fiori 화면을 스크린샷으로 캡처합니다. 저장 경로와 base64 이미지를 반환합니다.",
    inputSchema: {
      type: "object",
      properties: {
        label: { type: "string", description: "파일명 라벨 (기본: manual)" },
      },
    },
  },
  {
    name: "fiori_page_info",
    description: "현재 페이지 URL, 타이틀, Fiori 해시 라우트, UI5 버전/테마/언어를 조회합니다.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "fiori_control_get",
    description: "UI5 컨트롤의 값/상태를 조회합니다. OPA5 셀렉터(id, viewName, controlType, properties)로 컨트롤을 특정합니다.",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "object",
          description: "OPA5 셀렉터. 예: {\"id\": \"myButton\"} 또는 {\"controlType\": \"sap.m.Input\", \"properties\": {\"placeholder\": \"검색\"}}",
          properties: {
            id: { type: "string" },
            viewName: { type: "string" },
            controlType: { type: "string" },
            properties: { type: "object" },
          },
        },
      },
      required: ["selector"],
    },
  },
] as const;

export type ToolName = typeof TOOL_DEFINITIONS[number]["name"];
