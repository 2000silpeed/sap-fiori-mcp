import path from "path";
import os from "os";

export interface FioriConfig {
  url: string;
  username: string;
  password: string;
  headless?: boolean;
  screenshotPath?: string;
  waitForUI5Timeout?: number;
}

export interface WdioConfigShape {
  baseUrl: string;
  logLevel: string;
  services: string[];
  capabilities: {
    browserName: string;
    "goog:chromeOptions": { args: string[] };
  };
  wdi5: {
    screenshotPath: string;
    logLevel: string;
    waitForUI5Timeout: number;
  };
  framework: string;
  reporters: unknown[];
  specs: string[];
}

export function buildWdioConfig(cfg: FioriConfig): WdioConfigShape {
  const headless = cfg.headless ?? true;
  const screenshotPath = cfg.screenshotPath ?? path.join(os.homedir(), ".sap_fiori", "screenshots");

  const chromeArgs = [
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--window-size=1920,1080",
  ];
  if (headless) chromeArgs.push("--headless");

  return {
    baseUrl: cfg.url,
    logLevel: "error",
    services: ["ui5"],
    capabilities: {
      browserName: "chrome",
      "goog:chromeOptions": { args: chromeArgs },
    },
    wdi5: {
      screenshotPath,
      logLevel: "error",
      waitForUI5Timeout: cfg.waitForUI5Timeout ?? 15000,
    },
    framework: "mocha",
    reporters: [],
    specs: [],
  };
}

export async function launchBrowser(cfg: FioriConfig): Promise<WebdriverIO.Browser> {
  const { remote } = await import("webdriverio");
  const wdioConfig = buildWdioConfig(cfg);

  const browser = await remote(wdioConfig as unknown as Parameters<typeof remote>[0]);

  // BasicAuth: URL에 자격증명 포함하여 로드
  await browser.url(
    cfg.url.replace(
      "://",
      `://${encodeURIComponent(cfg.username)}:${encodeURIComponent(cfg.password)}@`
    )
  );

  // wdi5 서비스 수동 주입 (remote() 방식은 before 훅이 없으므로)
  const Service = (await import("wdio-ui5-service")).default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svc = new Service({ ...wdioConfig.wdi5, capabilities: wdioConfig.capabilities } as any);
  await svc.before({} as never, [], browser);

  return browser;
}
