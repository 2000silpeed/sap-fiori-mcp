import { sessionManager } from "../session-manager.js";

export interface FioriConnectArgs {
  url?: string;
  username?: string;
  password?: string;
}

export async function fioriConnect(args: FioriConnectArgs): Promise<Record<string, unknown>> {
  const url = args.url ?? process.env.FIORI_BASE_URL ?? "";
  const username = args.username ?? process.env.FIORI_USERNAME ?? "";
  const password = args.password ?? process.env.FIORI_PASSWORD ?? "";

  if (!url) return { error: true, message: "url 또는 FIORI_BASE_URL 환경변수가 필요합니다." };
  if (!username) return { error: true, message: "username 또는 FIORI_USERNAME 환경변수가 필요합니다." };

  const state = sessionManager.getState();
  if (state === "ready") {
    return { error: true, message: "이미 연결되어 있습니다. fiori_close 후 재연결하세요." };
  }

  try {
    await sessionManager.connect(url, username, password);
    return { connected: true, url, state: sessionManager.getState() };
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : String(err),
      state: sessionManager.getState(),
    };
  }
}

export async function fioriClose(): Promise<Record<string, unknown>> {
  const state = sessionManager.getState();
  if (state === "idle") {
    return { closed: false, message: "연결된 세션이 없습니다." };
  }
  await sessionManager.disconnect();
  return { closed: true, state: sessionManager.getState() };
}

export function fioriSessionInfo(): Record<string, unknown> {
  const info = sessionManager.getInfo();
  return {
    state: info.state,
    url: info.url,
    error: info.error,
    canCallTools: info.state === "ready",
  };
}
