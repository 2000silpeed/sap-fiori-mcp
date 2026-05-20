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
  {
    name: "fiori_navigate",
    description: "Fiori 앱으로 이동합니다. hash(#Shell-home 등 Fiori 라우트) 또는 url(전체 URL) 중 하나를 지정합니다.",
    inputSchema: {
      type: "object",
      properties: {
        hash: { type: "string", description: "Fiori 해시 라우트 (예: Shell-home, PurchaseOrder-manage)" },
        url: { type: "string", description: "이동할 전체 URL" },
      },
    },
  },
  {
    name: "fiori_launchpad_tile",
    description: "Fiori Launchpad에서 지정한 타이틀의 타일을 클릭합니다.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "클릭할 타일의 헤더 텍스트 (예: 구매 발주)" },
      },
      required: ["title"],
    },
  },
  {
    name: "fiori_control_set",
    description: "UI5 컨트롤에 값을 입력합니다. Input, Select, DatePicker 등 값 설정 가능한 컨트롤에 사용합니다.",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "object",
          description: "OPA5 셀렉터",
          properties: {
            id: { type: "string" },
            viewName: { type: "string" },
            controlType: { type: "string" },
            properties: { type: "object" },
          },
        },
        value: { description: "설정할 값 (문자열, 숫자, 불리언)" },
      },
      required: ["selector", "value"],
    },
  },
  {
    name: "fiori_control_press",
    description: "UI5 컨트롤을 클릭/누릅니다. Button, Link, ListItem 등에 사용합니다.",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "object",
          description: "OPA5 셀렉터",
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
  {
    name: "fiori_wait_for",
    description: "UI5 컨트롤이 화면에 나타날 때까지 대기합니다. 페이지 전환 후 다음 액션 전에 사용합니다.",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "object",
          description: "기다릴 컨트롤의 OPA5 셀렉터",
          properties: {
            id: { type: "string" },
            viewName: { type: "string" },
            controlType: { type: "string" },
            properties: { type: "object" },
          },
        },
        timeout: { type: "number", description: "최대 대기 시간(ms). 기본 15000" },
      },
      required: ["selector"],
    },
  },
  {
    name: "fiori_table_rows",
    description: "sap.m.Table의 행 데이터를 읽습니다. 테이블의 id를 셀렉터에 지정해야 합니다.",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "object",
          description: "테이블 OPA5 셀렉터. id 필드 필수",
          properties: {
            id: { type: "string", description: "테이블 컨트롤 id" },
          },
          required: ["id"],
        },
        maxRows: { type: "number", description: "최대 행 수. 기본 50" },
      },
      required: ["selector"],
    },
  },
] as const;

export type ToolName = typeof TOOL_DEFINITIONS[number]["name"];
