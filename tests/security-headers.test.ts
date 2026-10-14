import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { contentSecurityPolicy, securityHeaders } from "@/lib/security-headers";

const directives = (csp: string) => new Map(csp.split("; ").map((d) => [d.split(" ")[0], d.split(" ").slice(1)]));

describe("contentSecurityPolicy", () => {
  const csp = directives(contentSecurityPolicy());

  it("loads, fetches and frames nothing from another origin", () => {
    for (const [name, sources] of csp) {
      expect(sources.filter((s) => /^(https?:|wss?:|\*)/.test(s)), name).toEqual([]);
    }
    expect(csp.get("default-src")).toEqual(["'self'"]);
    expect(csp.get("connect-src")).toEqual(["'self'"]);
  });

  it("blocks plugins, base-tag hijacks, cross-site form posts and framing", () => {
    expect(csp.get("object-src")).toEqual(["'none'"]);
    expect(csp.get("base-uri")).toEqual(["'self'"]);
    expect(csp.get("form-action")).toEqual(["'self'"]);
    expect(csp.get("frame-ancestors")).toEqual(["'none'"]);
  });

  it("allows eval only in development", () => {
    expect(csp.get("script-src")).not.toContain("'unsafe-eval'");
    expect(directives(contentSecurityPolicy(true)).get("script-src")).toContain("'unsafe-eval'");
  });
});

describe("securityHeaders", () => {
  const headers = Object.fromEntries(securityHeaders().map((h) => [h.key, h.value]));

  it("sends the baseline set", () => {
    expect(Object.keys(headers).sort()).toEqual([
      "Content-Security-Policy",
      "Cross-Origin-Opener-Policy",
      "Permissions-Policy",
      "Referrer-Policy",
      "Strict-Transport-Security",
      "X-Content-Type-Options",
      "X-Frame-Options",
    ]);
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Strict-Transport-Security"]).toMatch(/^max-age=(\d+)/);
    expect(Number(headers["Strict-Transport-Security"].match(/max-age=(\d+)/)![1])).toBeGreaterThanOrEqual(31536000);
  });

  it("never denies the clipboard the copy-email button writes to", () => {
    expect(headers["Permissions-Policy"]).not.toMatch(/clipboard/);
  });

  it("is applied to every route, without X-Powered-By", () => {
    const config = readFileSync("next.config.ts", "utf8");
    expect(config).toMatch(/source: "\/:path\*", headers: securityHeaders\(/);
    expect(config).toMatch(/poweredByHeader: false/);
  });
});
