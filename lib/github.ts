import type { FeaturedRepo } from "@/types/resume";
import { resume } from "@/lib/resume-data";

/** A featured repo as the GitHub section shows it: curated copy, plus live fields when GitHub answered. */
export interface RepoCard {
  name: string;
  url: string;
  /** GitHub's description, or the curated blurb when it has none or the API is unavailable. */
  description: string;
  demonstrates: string;
  /** Live only. */
  language?: string;
  /** Live only: the last push, ISO 8601. */
  pushedAt?: string;
  /** For a fork: the upstream's full name. */
  forkOf?: string;
  contribution?: string;
  /** Case-study slug. */
  project?: string;
}

/** The fields read from GET /repos/{owner}/{repo}. */
interface LiveRepo {
  name?: string;
  description?: string | null;
  language?: string | null;
  pushed_at?: string | null;
  fork?: boolean;
  parent?: { full_name?: string };
}

export interface GitHubOptions {
  fetch?: typeof fetch;
  /** Sent as a bearer token when set; defaults to GITHUB_TOKEN. */
  token?: string;
  timeoutMs?: number;
}

const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

async function fetchLive(repo: FeaturedRepo, get: typeof fetch, token: string | undefined, timeoutMs: number): Promise<LiveRepo | null> {
  try {
    const res = await get(`https://api.github.com/repos/${repo.owner}/${repo.name}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status !== 200) return null;
    return (await res.json()) as LiveRepo;
  } catch {
    // Network error, timeout, or a body that isn't JSON: show the curated copy.
    return null;
  }
}

/** Merges live fields into a curated entry; null for a fork with no contribution line. */
export function toRepoCard(repo: FeaturedRepo, live: LiveRepo | null): RepoCard | null {
  const fork = live?.fork === true || repo.upstream !== undefined;
  if (fork && !repo.contribution) return null;
  return {
    name: text(live?.name) ?? repo.name,
    url: `https://github.com/${repo.owner}/${repo.name}`,
    description: text(live?.description) ?? repo.blurb,
    demonstrates: repo.demonstrates,
    language: text(live?.language),
    pushedAt: text(live?.pushed_at),
    forkOf: fork ? (text(live?.parent?.full_name) ?? repo.upstream) : undefined,
    contribution: repo.contribution,
    project: repo.project,
  };
}

/**
 * The featured repos with live metadata, cached for an hour. Any failure —
 * network, timeout, rate limit, a missing repo — falls back to that repo's
 * curated blurb, so the section never fails the page. A fork the data knows
 * about and that has no contribution line isn't fetched at all.
 */
export async function getFeaturedRepos(
  repos: FeaturedRepo[] = resume.featuredRepos,
  { fetch: get = fetch, token = process.env.GITHUB_TOKEN, timeoutMs = 3000 }: GitHubOptions = {},
): Promise<RepoCard[]> {
  const cards = await Promise.all(
    repos.map(async (repo) =>
      repo.upstream && !repo.contribution ? null : toRepoCard(repo, await fetchLive(repo, get, token, timeoutMs)),
    ),
  );
  return cards.filter((c): c is RepoCard => c !== null);
}
