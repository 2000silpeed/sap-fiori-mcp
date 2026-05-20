import path from "path";
import os from "os";
import fs from "fs";
import { sessionManager } from "../session-manager.js";

export async function fioriScreenshot(args: { label?: string }): Promise<Record<string, unknown>> {
  const browser = sessionManager.getSession();
  const label = args.label ?? "manual";
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${ts}-${label}.png`;
  const screenshotDir = path.join(os.homedir(), ".sap_fiori", "screenshots");
  fs.mkdirSync(screenshotDir, { recursive: true });
  const filePath = path.join(screenshotDir, filename);

  // wdi5 browser.screenshot()는 wdi5.screenshotPath 기준 저장
  // 직접 경로 지정을 위해 WebdriverIO saveScreenshot 사용
  await browser.saveScreenshot(filePath);

  const imgBase64 = fs.readFileSync(filePath).toString("base64");
  return {
    captured: true,
    path: filePath,
    label,
    image_base64: imgBase64,
    mime_type: "image/png",
  };
}

export async function fioriPageInfo(): Promise<Record<string, unknown>> {
  const browser = sessionManager.getSession();

  const [url, title] = await Promise.all([
    browser.getUrl(),
    browser.getTitle(),
  ]);

  // UI5 버전과 현재 앱 정보를 브라우저에서 조회
  const ui5Info = await browser.execute(() => {
    const w = window as unknown as Record<string, unknown>;
    const sap = w["sap"] as Record<string, unknown> | undefined;
    const ui = sap?.["ui"] as Record<string, unknown> | undefined;
    if (!ui) return { ui5Available: false };
    const core = (ui["getCore"] as (() => Record<string, unknown>) | undefined)?.();
    const cfg = (core?.["getConfiguration"] as (() => Record<string, unknown>) | undefined)?.();
    return {
      ui5Available: true,
      ui5Version: (ui["version"] as string) ?? "unknown",
      language: (cfg?.["getLanguage"] as (() => string) | undefined)?.() ?? "unknown",
      theme: (cfg?.["getTheme"] as (() => string) | undefined)?.() ?? "unknown",
    };
  }).catch(() => ({ ui5Available: false }));

  // 현재 URL의 해시(Fiori route)
  const hashMatch = url.match(/#(.+)$/);
  const hash = hashMatch ? hashMatch[1] : null;

  return {
    url,
    title,
    hash,
    ...ui5Info,
  };
}

export interface ControlSelector {
  id?: string;
  viewName?: string;
  controlType?: string;
  properties?: Record<string, unknown>;
}

export async function fioriControlGet(args: { selector: ControlSelector }): Promise<Record<string, unknown>> {
  const browser = sessionManager.getSession();

  if (!args.selector || Object.keys(args.selector).length === 0) {
    return { error: true, message: "selector가 필요합니다. id, viewName, controlType, properties 중 하나 이상 지정하세요." };
  }

  const control = await browser.asControl({ selector: args.selector });

  // 기본 속성 읽기
  const [visible, enabled] = await Promise.all([
    control.getVisible().catch(() => null),
    (control as unknown as Record<string, () => Promise<unknown>>).getEnabled?.().catch(() => null) ?? Promise.resolve(null),
  ]);

  // 값 읽기 (getValue / getText 순서로 시도)
  let value: unknown = null;
  try { value = await control.getValue?.(); } catch { /* noop */ }
  if (value === null || value === undefined) {
    try { value = await control.getText?.(); } catch { /* noop */ }
  }

  return {
    found: true,
    selector: args.selector,
    visible,
    enabled,
    value,
  };
}
