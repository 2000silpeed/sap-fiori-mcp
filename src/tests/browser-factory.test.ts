import { buildWdioConfig, type FioriConfig } from "../wdio/browser-factory.js";

describe("buildWdioConfig", () => {
  const base: FioriConfig = {
    url: "http://s4hana.corp/sap/bc/ui5_ui5/sap/fiorilaunchpad.html",
    username: "SAPUSER",
    password: "secret",
    headless: true,
  };

  it("baseUrl이 config에 포함됨", () => {
    const config = buildWdioConfig(base);
    expect(config.baseUrl).toBe(base.url);
  });

  it("wdio-ui5-service가 services에 포함됨", () => {
    const config = buildWdioConfig(base);
    expect(config.services).toContain("ui5");
  });

  it("headless=true 시 chrome args에 --headless 포함", () => {
    const config = buildWdioConfig({ ...base, headless: true });
    const caps = config.capabilities as Record<string, unknown>;
    const chromeOpts = caps["goog:chromeOptions"] as Record<string, string[]>;
    expect(chromeOpts.args).toContain("--headless");
  });

  it("headless=false 시 --headless 미포함", () => {
    const config = buildWdioConfig({ ...base, headless: false });
    const caps = config.capabilities as Record<string, unknown>;
    const chromeOpts = caps["goog:chromeOptions"] as Record<string, string[]>;
    expect(chromeOpts.args).not.toContain("--headless");
  });

  it("wdi5 screenshotPath 설정됨", () => {
    const config = buildWdioConfig(base);
    expect((config as unknown as Record<string, unknown>).wdi5).toBeDefined();
  });
});
