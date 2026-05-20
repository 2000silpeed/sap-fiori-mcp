import { transition, initialModel, type SessionModel, type SessionState } from "./prototype/session-state-machine.js";

export class SessionNotConnectedError extends Error {
  constructor() {
    super("브라우저 세션이 없습니다. fiori_connect를 먼저 호출하세요.");
  }
}

export class SessionManager {
  private model: SessionModel = initialModel();
  private browser: unknown = null;

  getState(): SessionState {
    return this.model.state;
  }

  getSession(): unknown {
    if (this.model.state !== "ready" || !this.browser) {
      throw new SessionNotConnectedError();
    }
    return this.browser;
  }

  async connect(url: string, username: string, password: string): Promise<void> {
    this.model = transition(this.model, { type: "CONNECT_START", url });
    try {
      this.browser = await this._startBrowser(url, username, password);
      this.model = transition(this.model, { type: "CONNECT_SUCCESS" });
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      this.model = transition(this.model, { type: "CONNECT_FAIL", reason });
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    if (this.model.state === "ready" || this.model.state === "error") {
      await this._stopBrowser();
      this.model = transition(this.model, { type: "DISCONNECT" });
    }
  }

  getInfo(): { state: SessionState; url: string | null; error: string | null } {
    return {
      state: this.model.state,
      url: this.model.url,
      error: this.model.error,
    };
  }

  dispose(): void {
    this._stopBrowser().catch(() => {});
  }

  private async _startBrowser(_url: string, _username: string, _password: string): Promise<unknown> {
    // wdi5 / WebdriverIO 실제 연결 — Phase 2에서 구현
    throw new Error("Not implemented");
  }

  private async _stopBrowser(): Promise<void> {
    this.browser = null;
  }
}

export const sessionManager = new SessionManager();
