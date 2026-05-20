import { sessionManager } from "../session-manager.js";
import type { ControlSelector } from "./read.js";

export async function fioriTableRows(args: { selector: ControlSelector; maxRows?: number }): Promise<Record<string, unknown>> {
  if (!args.selector || Object.keys(args.selector).length === 0) {
    return { error: true, message: "selector가 필요합니다." };
  }
  if (!args.selector.id) {
    return { error: true, message: "fiori_table_rows는 id 셀렉터가 필요합니다. fiori_control_get으로 테이블 id를 먼저 확인하세요." };
  }

  const browser = sessionManager.getSession();
  const maxRows = args.maxRows ?? 50;
  const tableId = args.selector.id;

  const rows = await browser.execute(
    (id: string, max: number) => {
      const w = window as unknown as Record<string, unknown>;
      const sap = w["sap"] as Record<string, unknown> | undefined;
      const ui = sap?.["ui"] as Record<string, unknown> | undefined;
      if (!ui) return null;

      const core = (ui["getCore"] as () => Record<string, unknown>)();
      const table = (core["byId"] as (id: string) => Record<string, unknown> | null)(id);
      if (!table) return null;

      const getItems = table["getItems"] as (() => Record<string, unknown>[]) | undefined;
      if (!getItems) return null;

      return getItems.call(table).slice(0, max).map((item) => {
        const getCells = item["getCells"] as (() => Record<string, unknown>[]) | undefined;
        if (!getCells) return [];
        return getCells.call(item).map((cell) => {
          try {
            const getValue = cell["getValue"] as (() => unknown) | undefined;
            if (getValue) return getValue.call(cell);
            const getText = cell["getText"] as (() => unknown) | undefined;
            if (getText) return getText.call(cell);
          } catch { /* noop */ }
          return null;
        });
      });
    },
    tableId,
    maxRows
  );

  if (rows === null) {
    return { error: true, message: `id="${tableId}" 테이블을 찾지 못했습니다.` };
  }
  return { rows, count: (rows as unknown[]).length, tableId };
}
