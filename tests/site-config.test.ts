import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveSiteUrl } from "@/lib/site-config";

describe("resolveSiteUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL when set: a custom domain, or the Docker build arg", () => {
    expect(resolveSiteUrl("https://mihir.dev", "portfolio.vercel.app")).toBe("https://mihir.dev");
  });

  it("on Vercel, uses the project's production domain, which Vercel gives without a scheme", () => {
    expect(resolveSiteUrl(undefined, "portfolio-mihir.vercel.app")).toBe("https://portfolio-mihir.vercel.app");
  });

  it("keeps a scheme it is already given", () => {
    expect(resolveSiteUrl(undefined, "https://portfolio-mihir.vercel.app")).toBe("https://portfolio-mihir.vercel.app");
  });

  it("falls back to the local server when neither is set, or both are empty", () => {
    expect(resolveSiteUrl(undefined, undefined)).toBe("http://localhost:3001");
    expect(resolveSiteUrl("", "")).toBe("http://localhost:3001");
    expect(resolveSiteUrl("  ", undefined)).toBe("http://localhost:3001");
  });

  it("drops a trailing slash, so paths joined onto it never double up", () => {
    expect(resolveSiteUrl("https://mihir.dev/", undefined)).toBe("https://mihir.dev");
    expect(resolveSiteUrl(undefined, "portfolio-mihir.vercel.app/")).toBe("https://portfolio-mihir.vercel.app");
  });

  it("always yields a URL that new URL() accepts", () => {
    for (const [pub, host] of [["https://mihir.dev", undefined], [undefined, "x.vercel.app"], [undefined, undefined]] as const) {
      expect(() => new URL(resolveSiteUrl(pub, host))).not.toThrow();
    }
  });
});

describe("googleSiteVerification", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });
  const load = async (token: string | undefined) => {
    vi.stubEnv("GOOGLE_SITE_VERIFICATION", token);
    vi.resetModules();
    return (await import("@/lib/site-config")).siteConfig.googleSiteVerification;
  };

  it("carries the Search Console token when set, trimmed", async () => {
    expect(await load(" abc123_-XYZ ")).toBe("abc123_-XYZ");
  });

  it("is absent when unset or blank, so no empty tag is printed", async () => {
    expect(await load(undefined)).toBeUndefined();
    expect(await load("  ")).toBeUndefined();
  });
});
