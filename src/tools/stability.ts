import { sessionManager } from "../session-manager.js";
import type { ControlSelector } from "./read.js";

export async function fioriWaitFor(args: { selector: ControlSelector; timeout?: number }): Promise<Record<string, unknown>> {
  if (!args.selector || Object.keys(args.selector).length === 0) {
    return { error: true, message: "selector가 필요합니다." };
  }

  const browser = sessionManager.getSession();
  const timeout = args.timeout ?? 15000;

  try {
    await browser.waitUntil(
      async () => {
        try {
          const ctrl = await browser.asControl({ selector: args.selector });
          const visible = await ctrl.getVisible().catch(() => false);
          return !!visible;
        } catch {
          return false;
        }
      },
      { timeout, timeoutMsg: `컨트롤을 ${timeout}ms 안에 찾지 못했습니다.` }
    );
    return { found: true, selector: args.selector };
  } catch (err) {
    return { error: true, message: err instanceof Error ? err.message : String(err) };
  }
}
