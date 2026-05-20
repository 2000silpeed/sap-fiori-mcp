import { fioriControlSet, fioriControlPress } from "../tools/write.js";

describe("fioriControlSet 입력 검증", () => {
  it("빈 selector면 error 반환", async () => {
    const result = await fioriControlSet({ selector: {}, value: "test" });
    expect(result.error).toBe(true);
  });

  it("value null이면 error 반환", async () => {
    const result = await fioriControlSet({ selector: { id: "myInput" }, value: null });
    expect(result.error).toBe(true);
  });
});

describe("fioriControlPress 입력 검증", () => {
  it("빈 selector면 error 반환", async () => {
    const result = await fioriControlPress({ selector: {} });
    expect(result.error).toBe(true);
  });
});
