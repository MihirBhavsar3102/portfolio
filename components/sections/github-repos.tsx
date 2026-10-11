import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getFeaturedRepos, type RepoCard } from "@/lib/github";
import { monthYear } from "@/lib/format";
import { getProject } from "@/lib/work";
import { Section } from "@/components/site/section";

function Repo({ repo }: { repo: RepoCard }) {
  const project = repo.project ? getProject(repo.project) : undefined;
  const live = [repo.language, repo.pushedAt && `Last pushed ${monthYear(repo.pushedAt.slice(0, 7))}`].filter(Boolean);
  return (
    <li className="flex flex-col bg-surface-1 p-5 md:last:odd:col-span-2">
      <h3 className="text-base font-semibold text-ink">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
        >
          {repo.name}
          <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          <span className="sr-only">on GitHub (opens in new tab)</span>
        </a>
      </h3>
      {repo.forkOf && <p className="mt-1 text-xs text-ink-3">Fork of {repo.forkOf}</p>}
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{repo.description}</p>
      {repo.contribution && (
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          <span className="font-medium text-ink">My contribution:</span> {repo.contribution}
        </p>
      )}
      {live.length > 0 && <p className="mt-3 text-xs text-ink-3">{live.join(" · ")}</p>}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5 text-sm">
        <span className="text-ink-3">{repo.demonstrates}</span>
        {project && (
          <Link href={`/work/${project.slug}`} className="group inline-flex items-center gap-1.5 py-1 font-medium text-ink">
            Case study
            <span className="sr-only">: {project.title}</span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </Link>
        )}
      </div>
    </li>
  );
}

/** The hand-picked repos as a ruled grid; nothing at all when none can be shown. */
export function RepoList({ repos }: { repos: RepoCard[] }) {
  if (repos.length === 0) return null;
  return (
    <Section id="github" title="GitHub">
      <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
        {repos.map((repo) => (
          <Repo key={repo.url} repo={repo} />
        ))}
      </ul>
    </Section>
  );
}

/** Live metadata where GitHub answers, curated copy where it doesn't (lib/github.ts). */
export async function GitHubRepos() {
  return <RepoList repos={await getFeaturedRepos()} />;
}
