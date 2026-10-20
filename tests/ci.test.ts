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

/** Each job's block in a workflow: from its `  id:` line to the next job or the end. */
const jobsOf = (yaml: string) =>
  [...yaml.slice(yaml.indexOf("\njobs:")).matchAll(/\n {2}([a-z][\w-]*):\n([\s\S]*?)(?=\n {2}[a-z][\w-]*:\n|$)/g)].map((m) => ({
    id: m[1],
    body: m[2],
  }));
const jobs = jobsOf(ci);

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
    for (const { file, raw } of workflows) {
      const own = jobsOf(raw);
      expect(own.length, file).toBeGreaterThan(0);
      for (const job of own) expect(job.body, `${file}: ${job.id}`).toMatch(/\n {4}timeout-minutes: \d+/);
    }
  });
});

describe("production watch", () => {
  const postDeploy = read(".github/workflows/post-deploy.yml");

  it("checks the live site every day, not only after a merge, and waits for a deploy only on push", () => {
    expect(code(postDeploy)).toMatch(/\n {2}schedule:\n {4}- cron: "[\d*]+ [\d*]+ \* \* \*"/);
    expect(postDeploy).toMatch(/if: \$\{\{ github\.event_name == 'push' \}\}\n\s+run: \|\n\s+served=""/);
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
  it("is one major everywhere: package.json engines (read by CI and Vercel), the Docker image and Node's type definitions", () => {
    const engines = String(pkg.engines?.node).match(/^(\d+)\.x$/)?.[1];
    const stages = [...dockerfile.matchAll(/^FROM node:(\d+)-alpine@sha256:[0-9a-f]{64}\b/gm)].map((m) => m[1]);
    const docker = stages[0];
    const types = String(pkg.devDependencies?.["@types/node"]).match(/^\^(\d+)/)?.[1];
    expect(engines).toBeDefined();
    expect(docker).toBe(engines);
    expect(types).toBe(engines);
    expect(new Set(stages).size).toBe(1);
    // Every job that sets up Node reads its version from package.json (the container job builds inside Docker instead).
    for (const { file, raw } of workflows) {
      expect(raw.split("node-version-file: package.json").length - 1, file).toBe(raw.split("uses: actions/setup-node@").length - 1);
    }
  });

  it("pins every Docker stage to one image digest, which Dependabot keeps current without moving the Node major", () => {
    const froms = [...dockerfile.matchAll(/^FROM (\S+)/gm)].map((m) => m[1]);
    expect(froms.length).toBeGreaterThanOrEqual(3);
    for (const f of froms) expect(f).toMatch(/^node:\d+-alpine@sha256:[0-9a-f]{64}$/);
    const dependabot = read(".github/dependabot.yml");
    expect(dependabot).toMatch(/- package-ecosystem: docker\n/);
    expect(dependabot).toMatch(/- dependency-name: "node"\n\s+update-types: \["version-update:semver-major"\]/);
  });

  it("keeps Dependabot from proposing a Node types major ahead of the runtime", () => {
    const dependabot = read(".github/dependabot.yml");
    expect(dependabot).toMatch(/- dependency-name: "@types\/node"\n\s+update-types: \["version-update:semver-major"\]/);
  });
});

describe("the container image", () => {
  it("is built, run and asked for the site by its own workflow", () => {
    const container = read(".github/workflows/container.yml");
    expect(container).toMatch(/docker build /);
    expect(container).toMatch(/docker run /);
    expect(container).toMatch(/curl -fsS[^\n]*127\.0\.0\.1:3001\//);
  });

  it("is served locally the same way: npm start runs the standalone server, which next start can't", () => {
    expect(pkg.scripts.start).toBe("node scripts/start.mjs");
    expect(ci).toMatch(/PORT=3100 HOSTNAME=127\.0\.0\.1 npm start/);
  });
});

describe("the accessibility engine", () => {
  it("runs inside the browser checks from the lockfile's axe-core, in CI and after every deploy", () => {
    expect(pkg.devDependencies["axe-core"]).toBeDefined();
    expect(read("scripts/verify-ui.mjs")).toContain('join(process.cwd(), "node_modules", "axe-core", "axe.min.js")');
    expect(code(read(".github/workflows/post-deploy.yml"))).toContain("npm ci --ignore-scripts");
    expect(code(ci)).toMatch(/run: npm ci/);
  });
});
