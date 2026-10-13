import { afterEach, describe, expect, it, vi } from "vitest";
import type { FeaturedRepo } from "@/types/resume";
import { resume } from "@/lib/resume-data";
import { getFeaturedRepos } from "@/lib/github";

type Init = RequestInit & { next?: { revalidate?: number } };

const own: FeaturedRepo = { owner: "me", name: "Own-Repo", blurb: "Curated blurb.", demonstrates: "CI/CD", project: "aws-web-platform" };
const live = { name: "Own-Repo", description: null, language: "HCL", pushed_at: "2025-04-22T05:12:24Z", fork: false };
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
/** A stand-in for fetch that records its calls. */
const fake = (handler: (url: string, init?: Init) => Promise<Response>) => {
  const fn = vi.fn(handler);
  return { fetch: fn as unknown as typeof fetch, calls: fn.mock.calls };
};

afterEach(() => vi.unstubAllEnvs());

describe("getFeaturedRepos", () => {
  it("merges live language and last push, keeping the blurb when GitHub has no description", async () => {
    const [card] = await getFeaturedRepos([own], { fetch: fake(async () => json(200, live)).fetch });
    expect(card).toMatchObject({
      name: "Own-Repo",
      description: "Curated blurb.",
      language: "HCL",
      pushedAt: live.pushed_at,
      url: "https://github.com/me/Own-Repo",
      project: "aws-web-platform",
    });
  });

  it("prefers a live description when there is one", async () => {
    const [card] = await getFeaturedRepos([own], { fetch: fake(async () => json(200, { ...live, description: "Live words." })).fetch });
    expect(card.description).toBe("Live words.");
  });

  it("asks for the repo with hourly revalidation and a timeout", async () => {
    const get = fake(async () => json(200, live));
    await getFeaturedRepos([own], { fetch: get.fetch });
    const [url, init] = get.calls[0];
    expect(url).toBe("https://api.github.com/repos/me/Own-Repo");
    expect(init?.next?.revalidate).toBe(3600);
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("sends a bearer token only when GITHUB_TOKEN is set", async () => {
    const authorization = async (token: string) => {
      vi.stubEnv("GITHUB_TOKEN", token);
      const get = fake(async () => json(200, live));
      await getFeaturedRepos([own], { fetch: get.fetch });
      return new Headers(get.calls[0][1]?.headers).get("authorization");
    };
    expect(await authorization("abc")).toBe("Bearer abc");
    expect(await authorization("")).toBeNull();
  });

  it.each([
    ["403 (rate limited)", async () => json(403, { message: "API rate limit exceeded" })],
    ["404", async () => json(404, { message: "Not Found" })],
    ["a network error", async () => Promise.reject(new TypeError("fetch failed"))],
    ["a body that isn't JSON", async () => new Response("<html>", { status: 200 })],
  ])("falls back to the blurb on %s", async (_, handler) => {
    const [card] = await getFeaturedRepos([own], { fetch: fake(handler).fetch });
    expect(card).toMatchObject({ name: "Own-Repo", description: "Curated blurb." });
    expect(card.language).toBeUndefined();
    expect(card.pushedAt).toBeUndefined();
  });

  it("falls back to the blurb when GitHub doesn't answer in time", async () => {
    const hang = fake(
      (_, init) => new Promise<Response>((_, reject) => init?.signal?.addEventListener("abort", () => reject(init.signal?.reason))),
    );
    const [card] = await getFeaturedRepos([own], { fetch: hang.fetch, timeoutMs: 20 });
    expect(card.description).toBe("Curated blurb.");
  });

  it("drops a fork GitHub reports when the data has no contribution line", async () => {
    const forked = { ...live, fork: true, parent: { full_name: "up/Own-Repo" } };
    expect(await getFeaturedRepos([own], { fetch: fake(async () => json(200, forked)).fetch })).toEqual([]);
  });

  it("labels a fork with a contribution line with its live upstream", async () => {
    const entry = { ...own, upstream: "old/Own-Repo", contribution: "Added the Y step." };
    const forked = { ...live, fork: true, parent: { full_name: "up/Own-Repo" } };
    const [card] = await getFeaturedRepos([entry], { fetch: fake(async () => json(200, forked)).fetch });
    expect(card).toMatchObject({ forkOf: "up/Own-Repo", contribution: "Added the Y step." });
  });

  it("keeps the stored upstream for the label when GitHub is down", async () => {
    const entry = { ...own, upstream: "up/Own-Repo", contribution: "Added the Y step." };
    const [card] = await getFeaturedRepos([entry], { fetch: fake(async () => json(500, {})).fetch });
    expect(card.forkOf).toBe("up/Own-Repo");
  });

  it("never fetches a fork known from the data that has no contribution line", async () => {
    const get = fake(async () => json(200, live));
    expect(await getFeaturedRepos([{ ...own, upstream: "up/Own-Repo" }], { fetch: get.fetch })).toEqual([]);
    expect(get.calls).toHaveLength(0);
  });
});

describe("featured repos in the site data", () => {
  it("show the two own repos and hide the uncredited fork, even offline", async () => {
    const offline = fake(async () => Promise.reject(new TypeError("offline")));
    const cards = await getFeaturedRepos(resume.featuredRepos, { fetch: offline.fetch });
    expect(cards.map((c) => c.name)).toEqual(["Rag-Assistant-Chatbot", "Automatic-Deployment"]);
  });

  it("revalidates the home page hourly, even when every fetch failed at build", async () => {
    const { revalidate } = await import("@/app/page");
    expect(revalidate).toBe(3600);
  });
});
