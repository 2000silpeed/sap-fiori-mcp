import { sessionManager } from "../session-manager.js";

export async function fioriNavigate(args: { hash?: string; url?: string }): Promise<Record<string, unknown>> {
  if (!args.hash && !args.url) {
    return { error: true, message: "hash 또는 url이 필요합니다." };
  }

  const browser = sessionManager.getSession();

  let targetUrl: string;
  if (args.url) {
    targetUrl = args.url;
  } else {
    const currentUrl = await browser.getUrl();
    const baseUrl = currentUrl.split("#")[0];
    targetUrl = `${baseUrl}#${args.hash!}`;
  }

  await browser.url(targetUrl);
  const newUrl = await browser.getUrl();
  return { navigated: true, url: newUrl };
}

export async function fioriLaunchpadTile(args: { title: string }): Promise<Record<string, unknown>> {
  if (!args.title?.trim()) {
    return { error: true, message: "title이 필요합니다." };
  }

  const browser = sessionManager.getSession();

  const tile = await browser.asControl({
    selector: {
      controlType: "sap.m.GenericTile",
      properties: { header: args.title },
    } as unknown as Parameters<typeof browser.asControl>[0]["selector"],
  });

  await (tile as unknown as Record<string, () => Promise<void>>).press();
  return { pressed: true, title: args.title };
}
