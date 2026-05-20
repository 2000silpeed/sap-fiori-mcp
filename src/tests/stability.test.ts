import { fioriWaitFor } from "../tools/stability.js";
import { fioriTableRows } from "../tools/table.js";

describe("fioriWaitFor 입력 검증", () => {
  it("빈 selector면 error 반환", async () => {
    const result = await fioriWaitFor({ selector: {} });
    expect(result.error).toBe(true);
  });
});

describe("fioriTableRows 입력 검증", () => {
  it("빈 selector면 error 반환", async () => {
    const result = await fioriTableRows({ selector: {} });
    expect(result.error).toBe(true);
  });

  it("id 없는 selector면 error 반환", async () => {
    const result = await fioriTableRows({ selector: { controlType: "sap.m.Table" } });
    expect(result.error).toBe(true);
  });
});
