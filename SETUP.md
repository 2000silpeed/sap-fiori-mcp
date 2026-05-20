# sap-fiori-mcp 설정 가이드

## 1. 빌드

```bash
cd ~/ai-projects/sap-fiori-mcp
npm install --legacy-peer-deps
npm run build
```

## 2. Claude Desktop 연결

`~/Library/Application Support/Claude/claude_desktop_config.json` 파일을 열어 아래 내용을 추가합니다.

```json
{
  "mcpServers": {
    "sap-fiori": {
      "command": "node",
      "args": ["/Users/sungwoon/ai-projects/sap-fiori-mcp/dist/index.js"],
      "env": {
        "FIORI_BASE_URL": "http://your-s4hana-host/sap/bc/ui5_ui5/sap/fiorilaunchpad.html",
        "FIORI_USERNAME": "your-sap-user",
        "FIORI_PASSWORD": "your-password"
      }
    }
  }
}
```

파일이 없으면 새로 만듭니다. 이미 다른 MCP 서버가 있으면 `mcpServers` 객체 안에 `"sap-fiori"` 항목만 추가합니다.

## 3. Claude Code (CLI) 연결

프로젝트의 `.mcp.json` 또는 전역 `~/.claude/mcp.json`에 추가합니다.

```json
{
  "mcpServers": {
    "sap-fiori": {
      "command": "node",
      "args": ["/Users/sungwoon/ai-projects/sap-fiori-mcp/dist/index.js"],
      "env": {
        "FIORI_BASE_URL": "http://your-s4hana-host/sap/bc/ui5_ui5/sap/fiorilaunchpad.html",
        "FIORI_USERNAME": "your-sap-user",
        "FIORI_PASSWORD": "your-password"
      }
    }
  }
}
```

## 4. 환경변수 방식 (선택)

`env` 블록 대신 시스템 환경변수로 설정해도 됩니다.

```bash
export FIORI_BASE_URL="http://your-s4hana-host/..."
export FIORI_USERNAME="SAPUSER"
export FIORI_PASSWORD="password"
export FIORI_HEADLESS="true"   # false로 하면 브라우저 창이 보임
```

## 5. 사용 가능한 툴 (10개)

| 툴 | 설명 |
|---|---|
| `fiori_connect` | SAP Fiori에 브라우저로 연결 |
| `fiori_close` | 세션 종료 |
| `fiori_session_info` | 현재 연결 상태 조회 |
| `fiori_screenshot` | 현재 화면 캡처 |
| `fiori_page_info` | URL, UI5 버전/테마 조회 |
| `fiori_control_get` | UI5 컨트롤 값/상태 읽기 |
| `fiori_navigate` | hash 또는 URL로 이동 |
| `fiori_launchpad_tile` | 런치패드 타일 클릭 |
| `fiori_control_set` | 컨트롤에 값 입력 |
| `fiori_control_press` | 버튼/링크 클릭 |
| `fiori_wait_for` | 컨트롤이 나타날 때까지 대기 |
| `fiori_table_rows` | 테이블 행 데이터 읽기 |

## 6. 사용 예시 (Claude에게 말하기)

```
SAP Fiori에 연결해줘
런치패드 스크린샷 찍어줘
구매 발주 타일 클릭해줘
현재 페이지 정보 알려줘
```
