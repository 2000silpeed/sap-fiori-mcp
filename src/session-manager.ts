import { transition, initialModel, type SessionModel, type SessionState } from "./prototype/session-state-machine.js";
import { launchBrowser, type FioriConfig } from "./wdio/browser-factory.js";

export class SessionNotConnectedError extends Error {
  constructor() {
    super("브라우저 세션이 없습니다. fiori_connect를 먼저 호출하세요.");
  }
}

export class SessionManager {
  private model: SessionModel = initialModel();
  private browser: WebdriverIO.Browser | null = null;

  getState(): SessionState {
    return this.model.state;
  }

  getSession(): WebdriverIO.Browser {
    if (this.model.state !== "ready" || !this.browser) {
      throw new SessionNotConnectedError();
    }
    return this.browser;
  }

  async connect(cfg: FioriConfig): Promise<void>;
  async connect(url: string, username: string, password: string): Promise<void>;
  async connect(cfgOrUrl: FioriConfig | string, username?: string, password?: string): Promise<void> {
    const cfg: FioriConfig = typeof cfgOrUrl === "string"
      ? { url: cfgOrUrl, username: username!, password: password! }
      : cfgOrUrl;

    this.model = transition(this.model, { type: "CONNECT_START", url: cfg.url });
    try {
      this.browser = await launchBrowser(cfg);
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

  private async _stopBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.deleteSession().catch(() => {});
      this.browser = null;
    }
  }
}

export const sessionManager = new SessionManager();
