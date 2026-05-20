import { fioriNavigate, fioriLaunchpadTile } from "../tools/navigate.js";

describe("fioriNavigate 입력 검증", () => {
  it("hash/url 모두 없으면 error 반환", async () => {
    const result = await fioriNavigate({});
    expect(result.error).toBe(true);
    expect(typeof result.message).toBe("string");
  });
});

describe("fioriLaunchpadTile 입력 검증", () => {
  it("title 빈 문자열이면 error 반환", async () => {
    const result = await fioriLaunchpadTile({ title: "" });
    expect(result.error).toBe(true);
  });

  it("title 공백만 있으면 error 반환", async () => {
    const result = await fioriLaunchpadTile({ title: "   " });
    expect(result.error).toBe(true);
  });
});
