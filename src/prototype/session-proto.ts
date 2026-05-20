/**
 * PROTOTYPE TUI — throwaway shell. 절대 production에 포함하지 말 것.
 * Run: pnpm proto:session
 */
import * as readline from "readline";
import {
  initialModel,
  transition,
  canCallTool,
  type SessionModel,
} from "./session-state-machine.js";

const B = "\x1b[1m";  // bold
const D = "\x1b[2m";  // dim
const R = "\x1b[0m";  // reset
const G = "\x1b[32m"; // green
const Y = "\x1b[33m"; // yellow
const Re = "\x1b[31m"; // red

function stateColor(state: string): string {
  if (state === "ready") return G;
  if (state === "initializing") return Y;
  if (state === "error") return Re;
  return D;
}

function render(model: SessionModel): void {
  console.clear();
  console.log(`${B}━━━ SessionManager 상태 머신 프로토타입 ━━━${R}\n`);
  console.log(`${B}state  :${R} ${stateColor(model.state)}${model.state}${R}`);
  console.log(`${B}url    :${R} ${model.url ?? D + "(없음)" + R}`);
  console.log(`${B}error  :${R} ${model.error ? Re + model.error + R : D + "(없음)" + R}`);
  console.log(`${B}lastTool:${R} ${model.lastTool ?? D + "(없음)" + R}`);
  console.log(`${B}canCallTool:${R} ${canCallTool(model) ? G + "✓" + R : Re + "✗" + R}`);

  console.log(`\n${B}── 최근 로그 ────────────────────────────${R}`);
  const recent = model.log.slice(-8);
  recent.forEach((l) => console.log(`  ${D}${l}${R}`));

  console.log(`\n${B}── 액션 키 ──────────────────────────────${R}`);
  console.log(
    [
      `${B}[c]${R} connect_start`,
      `${B}[s]${R} connect_success`,
      `${B}[f]${R} connect_fail`,
      `${B}[t]${R} tool_call`,
      `${B}[d]${R} disconnect`,
      `${B}[x]${R} session_crash`,
      `${B}[q]${R} quit`,
    ].join("  ")
  );
}

async function main(): Promise<void> {
  let model = initialModel();
  render(model);

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  process.stdin.on("keypress", (_str, key) => {
    if (key.name === "q" || (key.ctrl && key.name === "c")) {
      process.stdin.setRawMode(false);
      console.log("\n\n종료.");
      process.exit(0);
    }

    const dispatch = (a: Parameters<typeof transition>[1]) => {
      model = transition(model, a);
      render(model);
    };

    switch (key.name) {
      case "c": dispatch({ type: "CONNECT_START", url: "http://s4hana.corp/sap/bc/ui5_ui5/sap/fiorilaunchpad.html" }); break;
      case "s": dispatch({ type: "CONNECT_SUCCESS" }); break;
      case "f": dispatch({ type: "CONNECT_FAIL", reason: "401 Unauthorized" }); break;
      case "t": dispatch({ type: "TOOL_CALL", toolName: "fiori_screenshot" }); break;
      case "d": dispatch({ type: "DISCONNECT" }); break;
      case "x": dispatch({ type: "SESSION_CRASH", reason: "Browser process died" }); break;
    }
  });
}

main();
