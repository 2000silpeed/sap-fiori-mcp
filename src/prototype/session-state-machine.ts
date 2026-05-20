/**
 * PROTOTYPE — 순수 로직 모듈 (throwaway TUI와 분리)
 *
 * 검증 질문:
 *   SessionManager의 상태 전환이 다음 케이스를 올바르게 처리하는가?
 *   1) connect 중 실패
 *   2) 세션 없이 툴 호출
 *   3) ready 상태에서 재연결 시도
 *   4) 정상 disconnect
 */

export type SessionState = "idle" | "initializing" | "ready" | "error";

export type SessionAction =
  | { type: "CONNECT_START"; url: string }
  | { type: "CONNECT_SUCCESS" }
  | { type: "CONNECT_FAIL"; reason: string }
  | { type: "DISCONNECT" }
  | { type: "TOOL_CALL"; toolName: string }
  | { type: "SESSION_CRASH"; reason: string };

export interface SessionModel {
  state: SessionState;
  url: string | null;
  error: string | null;
  lastTool: string | null;
  log: string[];
}

export function initialModel(): SessionModel {
  return { state: "idle", url: null, error: null, lastTool: null, log: [] };
}

export function transition(model: SessionModel, action: SessionAction): SessionModel {
  const log = [...model.log, `[${action.type}]`];

  switch (model.state) {
    case "idle":
      if (action.type === "CONNECT_START") {
        return { ...model, state: "initializing", url: action.url, error: null, log };
      }
      if (action.type === "TOOL_CALL") {
        return { ...model, log: [...log, "  → 거부: 세션 없음"] };
      }
      return { ...model, log };

    case "initializing":
      if (action.type === "CONNECT_SUCCESS") {
        return { ...model, state: "ready", log };
      }
      if (action.type === "CONNECT_FAIL") {
        return { ...model, state: "error", error: action.reason, url: null, log };
      }
      if (action.type === "TOOL_CALL") {
        return { ...model, log: [...log, "  → 거부: 초기화 중"] };
      }
      return { ...model, log };

    case "ready":
      if (action.type === "TOOL_CALL") {
        return { ...model, lastTool: action.toolName, log };
      }
      if (action.type === "DISCONNECT") {
        return { ...model, state: "idle", url: null, lastTool: null, log };
      }
      if (action.type === "SESSION_CRASH") {
        return { ...model, state: "error", error: action.reason, log };
      }
      if (action.type === "CONNECT_START") {
        // 이미 ready — 재연결 무시, 경고 로그
        return { ...model, log: [...log, "  → 무시: 이미 연결됨"] };
      }
      return { ...model, log };

    case "error":
      if (action.type === "CONNECT_START") {
        // error에서 재연결 허용
        return { ...model, state: "initializing", url: action.url, error: null, log };
      }
      if (action.type === "DISCONNECT") {
        return { ...model, state: "idle", url: null, error: null, log };
      }
      if (action.type === "TOOL_CALL") {
        return { ...model, log: [...log, "  → 거부: 에러 상태"] };
      }
      return { ...model, log };
  }
}

export function canCallTool(model: SessionModel): boolean {
  return model.state === "ready";
}
