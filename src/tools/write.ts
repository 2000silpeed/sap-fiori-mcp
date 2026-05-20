import { sessionManager } from "../session-manager.js";
import type { ControlSelector } from "./read.js";

export async function fioriControlSet(args: { selector: ControlSelector; value: unknown }): Promise<Record<string, unknown>> {
  if (!args.selector || Object.keys(args.selector).length === 0) {
    return { error: true, message: "selector가 필요합니다. id, viewName, controlType, properties 중 하나 이상 지정하세요." };
  }
  if (args.value === undefined || args.value === null) {
    return { error: true, message: "value가 필요합니다." };
  }

  const browser = sessionManager.getSession();
  const control = await browser.asControl({ selector: args.selector });
  await control.setValue?.(String(args.value));

  return { set: true, selector: args.selector, value: args.value };
}

export async function fioriControlPress(args: { selector: ControlSelector }): Promise<Record<string, unknown>> {
  if (!args.selector || Object.keys(args.selector).length === 0) {
    return { error: true, message: "selector가 필요합니다. id, viewName, controlType, properties 중 하나 이상 지정하세요." };
  }

  const browser = sessionManager.getSession();
  const control = await browser.asControl({ selector: args.selector });
  await (control as unknown as Record<string, () => Promise<void>>).press();

  return { pressed: true, selector: args.selector };
}
