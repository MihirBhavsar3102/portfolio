import { describe, expect, it } from "vitest";
import config from "@/next.config";

describe("next.config redirects", () => {
  it("sends /work, which has no page of its own, to the work section on home, temporarily", async () => {
    const redirects = (await config.redirects?.()) ?? [];
    expect(redirects).toContainEqual({ source: "/work", destination: "/#work", permanent: false });
  });
});
