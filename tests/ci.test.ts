import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";

/**
 * The CI's own rules, held by tests so a later edit can't quietly weaken them:
 * pinned actions, a read-only token, no leftover credentials, a timeout per
 * job, required checks that match the jobs, and one Node version everywhere.
 */

/** A file's text with LF endings: a Windows checkout (core.autocrlf) has CRLF. */
const read = (path: string) => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
/** YAML without its comments, so a comment that names a rule never trips it. */
const code = (yaml: string) => yaml.replace(/(^|\s)#.*$/gm, "");
const workflows = readdirSync(".github/workflows")
  .filter((f) => /\.ya?ml$/.test(f))
  .map((f) => {
    const raw = read(`.github/workflows/${f}`);
    return { file: f, raw, text: code(raw) };
  });
const ci = read(".github/workflows/ci.yml");
const ruleset = JSON.parse(read(".github/rulesets/master.json"));
const pkg = JSON.parse(read("package.json"));
const dockerfile = read("Dockerfile");

/** Each job's block: from its `  id:` line to the next job or the end. */
const jobs = [...ci.slice(ci.indexOf("\njobs:")).matchAll(/\n {2}([a-z][\w-]*):\n([\s\S]*?)(?=\n {2}[a-z][\w-]*:\n|$)/g)].map((m) => ({
  id: m[1],
  body: m[2],
}));

describe("CI workflows", () => {
  it("pin every action to a full commit SHA, with the version it was in a comment", () => {
    for (const { file, raw } of workflows) {
      const uses = [...raw.matchAll(/uses:\s*(\S+)(.*)/g)];
      for (const [, ref, rest] of uses) {
        if (ref.startsWith("./")) continue;
        expect(ref, `${file}: ${ref}`).toMatch(/@[0-9a-f]{40}$/);
        expect(rest, `${file}: ${ref}`).toMatch(/# v\d/);
      }
    }
  });

  it("run with a read-only token and never on pull_request_target", () => {
    for (const { file, text } of workflows) {
      expect(text, file).toMatch(/^permissions:\n {2}contents: read$/m);
      expect(text, file).not.toMatch(/pull_request_target|write-all|: write\b/);
    }
  });

  it("leave no checkout credentials on disk", () => {
    for (const { file, text } of workflows) {
      const checkouts = text.split("uses: actions/checkout@").length - 1;
      expect(text.split("persist-credentials: false").length - 1, file).toBe(checkouts);
    }
  });

  it("give every job a timeout", () => {
    expect(jobs.length).toBeGreaterThan(0);
    for (const job of jobs) expect(job.body, job.id).toMatch(/\n {4}timeout-minutes: \d+/);
  });
});

describe("master's ruleset", () => {
  const required = ruleset.rules.find((r: { type: string }) => r.type === "required_status_checks").parameters.required_status_checks;

  it("requires exactly the CI jobs, by name, from GitHub Actions — a renamed job would otherwise block every merge", () => {
    const names = jobs.map((j) => j.body.match(/^ {4}name: (.+)$/m)?.[1]);
    expect(required.map((c: { context: string }) => c.context).sort()).toEqual([...names].sort());
    for (const c of required) expect(c.integration_id, c.context).toBe(15368);
  });

  it("applies to everyone: no bypass, no force pushes, no deletion, changes only through a pull request", () => {
    expect(ruleset.bypass_actors).toEqual([]);
    expect(ruleset.enforcement).toBe("active");
    const types = ruleset.rules.map((r: { type: string }) => r.type);
    for (const t of ["deletion", "non_fast_forward", "pull_request", "required_status_checks"]) expect(types).toContain(t);
  });

  it("lets a solo maintainer merge: a pull request needs no approving review", () => {
    expect(ruleset.rules.find((r: { type: string }) => r.type === "pull_request").parameters.required_approving_review_count).toBe(0);
  });
});

describe("Node version", () => {
  it("is one major everywhere: package.json engines (read by CI and Vercel) and the Docker image", () => {
    const engines = String(pkg.engines?.node).match(/^(\d+)\.x$/)?.[1];
    const docker = dockerfile.match(/^ARG NODE_IMAGE=node:(\d+)-/m)?.[1];
    expect(engines).toBeDefined();
    expect(docker).toBe(engines);
    expect(ci.split("node-version-file: package.json").length - 1).toBe(jobs.length);
  });
});
