import { SessionManager } from "../session-manager.js";

describe("SessionManager", () => {
  let manager: SessionManager;

  beforeEach(() => {
    manager = new SessionManager();
  });

  afterEach(() => {
    manager.dispose();
  });

  // tracer bullet
  it("초기 상태는 idle", () => {
    expect(manager.getState()).toBe("idle");
  });

  it("세션 없이 getSession() 호출 시 에러", () => {
    expect(() => manager.getSession()).toThrow("브라우저 세션이 없습니다");
  });

  it("connect 실패 시 state는 error", async () => {
    await expect(
      manager.connect("http://fail.example", "user", "pass")
    ).rejects.toThrow();
    expect(manager.getState()).toBe("error");
  });

  it("error 상태에서 disconnect() 후 idle로 복귀", async () => {
    await manager.connect("http://fail.example", "user", "pass").catch(() => {});
    await manager.disconnect();
    expect(manager.getState()).toBe("idle");
  });

  it("getInfo()는 state, url, error를 반환", () => {
    const info = manager.getInfo();
    expect(info).toMatchObject({ state: "idle", url: null, error: null });
  });
});
