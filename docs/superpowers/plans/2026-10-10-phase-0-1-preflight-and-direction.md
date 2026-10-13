# Phase 0 + Phase 1 (Preflight and Direction) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Checkpoint the outgoing build, set up tests and a baseline, migrate all site content to the October 2026 resume, then build the approved dark direction's nav, hero, estate topology, proof strip and Trace interaction, ending at Mihir's visual-direction review.

**Architecture:** Facts live in `lib/resume-data.ts` (typed by `types/resume.ts`) and are guarded by Vitest content tests. The hero topology is a server-rendered SVG built from `resume.estate`; the only client JavaScript is a small Trace island that marks which nodes a proof figure lights, plus the nav. Visual values come from the impeccable direction round (Task 6) and are expressed once as semantic Tailwind v4 tokens.

**Tech Stack:** Next.js 16.2.10 (App Router, Turbopack), React 19.2.4, TypeScript, Tailwind CSS v4, framer-motion 12 (LazyMotion), radix-ui, lucide-react, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-27-portfolio-rebuild-design.md` (rev 2)

## Global Constraints

- Facts only from the October 2026 resume and questionnaire answers; questionnaire A7 and A8 are skipped (all A7 claims stay retired; A8.2, how the AI service is deployed, stays undrawn).
- Copy is paraphrased, outcome first, numbers keep exact qualifiers (`~`, `+`, "over", "near zero"); no new scope, results, or technologies.
- Employer: "Parkar Global Technologies"; legal name "Parkar Global Technologies Pvt Ltd" once, in the experience entry.
- Scale: 5 enterprise clients, 450+ concurrent VDI users. The 25% is overall monthly cloud spend across Azure and AWS.
- Dark only. One blue accent. Teal, violet, neon green excluded. Technology colours only on technology marks.
- No mono prose, no terminal or code-editor chrome, no glow, no typewriter, no count-ups.
- The phone number is never stored in site data and never rendered.
- Every animated element's resting state is its default style; `prefers-reduced-motion: reduce` cancels all animation; content is complete with JavaScript off.
- Dialogs and sheets open un-animated; no `backdrop-blur` on overlays; no `scrollbar-gutter: stable`.
- At most two font families, self-hosted via `next/font`; not Inter-as-display, Space Grotesk, IBM Plex, DM Sans, or Geist.
- Commits on `redesign/dark-console`; nothing pushed or merged.

## Review Focus

1. **Keyboard-only visitor on the proof strip** expects focus on a figure to light the same topology path as hover, and Escape or blur to clear it — pinned by the Trace state tests in Task 4 and the keyboard check in Task 10.
2. **Touch visitor taps a figure twice** expects the second tap to clear the highlight, not leave the topology dimmed — pinned by `nextTraceState` toggle tests in Task 4.
3. **A proof highlight id that names a control-plane tool, not a zone node** (e.g. `powershell`) expects its edge to the zone to light — pinned by the zone-coverage edge test in Task 4.
4. **Phone viewport (375 px)** expects no horizontal scroll and a readable topology replacement, not a shrunken SVG — pinned by the mobile capture check in Task 10.
5. **JavaScript disabled or reduced motion** expects every figure, label and provenance sentence visible and nothing stuck mid-animation — pinned by the no-JS and reduced-motion captures in Task 10.

---

## Phase 0 — Preflight

### Task 1: Checkpoint the outgoing build and branch

**Files:** none created; git history only.

- [ ] **Step 1: Stage the outgoing build without the new docs**

```bash
git add -A -- . ':!docs'
git status --short
```
Expected: every modified/deleted/untracked file from the Plotted Architecture Sheet build is staged; `docs/` stays untracked.

- [ ] **Step 2: Commit the checkpoint on master**

```bash
git commit -m "chore: checkpoint Plotted Architecture Sheet build before dark rebuild"
```

- [ ] **Step 3: Create the working branch and commit the spec docs there**

```bash
git switch -c redesign/dark-console
git add docs
git commit -m "docs: add portfolio rebuild spec, questionnaire and phase 0-1 plan"
```

### Task 2: Record the performance baseline

**Files:**
- Create: `docs/superpowers/baseline-2026-10-10.md`

- [ ] **Step 1: Build and start the outgoing build on port 3100**

```bash
npm run build
npx next start -p 3100   # background
```

- [ ] **Step 2: Measure cold-load JS of `/` and a Lighthouse mobile run**

Run Lighthouse against Edge with an isolated profile and extensions disabled:

```bash
CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
npx -y lighthouse@12 http://localhost:3100/ --form-factor=mobile --quiet \
  --chrome-flags="--headless=new --disable-extensions --no-first-run --user-data-dir=<scratch>/lh-profile" \
  --output=json --output-path=<scratch>/baseline-lh.json
```

Extract: the four category scores, LCP, CLS, TBT, and the sum of `transferSize` for `resourceType === "Script"` from `audits["network-requests"]`.

- [ ] **Step 3: Write the baseline file**

```markdown
# Baseline — outgoing build (Plotted Architecture Sheet), 2026-10-10

Measured on `next start`, Lighthouse 12, mobile form factor, Edge headless.

| Metric | Value |
|---|---|
| Performance / Accessibility / Best practices / SEO | <scores> |
| LCP / CLS / TBT | <values> |
| Script transfer on cold load of `/` (gzipped) | <KB> |
```
(Fill the table with the measured numbers — this is the comparator for spec §12.)

- [ ] **Step 4: Stop the server by port and commit**

```powershell
Get-NetTCPConnection -LocalPort 3100 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```
```bash
git add docs/superpowers/baseline-2026-10-10.md
git commit -m "docs: record performance baseline of the outgoing build"
```

### Task 3: Test harness, privacy test, PRODUCT.md and DESIGN.md archive

**Files:**
- Create: `vitest.config.mts`, `tests/source-files.ts`, `tests/privacy.test.ts`
- Modify: `package.json` (scripts, devDependency), `PRODUCT.md`
- Move: `DESIGN.md` → `docs/archive/DESIGN-plotted-sheet.md`

**Interfaces:**
- Produces: `listSourceFiles(dirs: string[]): string[]` and `readSource(path: string): string` in `tests/source-files.ts`, used by later content tests.

- [ ] **Step 1: Install Vitest and add scripts**

```bash
npm install -D vitest
npm pkg set scripts.test="vitest run" scripts.typecheck="tsc --noEmit"
```

- [ ] **Step 2: Add the Vitest config**

```ts
// vitest.config.mts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Add the source-file helper**

```ts
// tests/source-files.ts
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const SOURCE = /\.(ts|tsx|mdx|css)$/;

/** Every source file under the given project-relative directories. */
export function listSourceFiles(dirs: string[]): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (SOURCE.test(name)) out.push(path);
    }
  };
  dirs.forEach(walk);
  return out;
}

export function readSource(path: string): string {
  return readFileSync(path, "utf8");
}
```

- [ ] **Step 4: Write the privacy test**

```ts
// tests/privacy.test.ts
import { describe, expect, it } from "vitest";
import { listSourceFiles, readSource } from "./source-files";

describe("privacy", () => {
  it("never renders the phone number", () => {
    const offenders = listSourceFiles(["app", "components"]).filter((f) =>
      /7096259248|resume\.phone/.test(readSource(f)),
    );
    expect(offenders).toEqual([]);
  });
});
```

- [ ] **Step 5: Run it**

Run: `npm test`
Expected: PASS (the outgoing build stores the phone in `lib/` but never renders it; Task 5 extends the scan to `lib/`).

- [ ] **Step 6: Archive DESIGN.md and update PRODUCT.md**

```bash
mkdir -p docs/archive && git mv -f DESIGN.md docs/archive/DESIGN-plotted-sheet.md 2>/dev/null || mv DESIGN.md docs/archive/DESIGN-plotted-sheet.md
```

PRODUCT.md edits (keep the file's structure; change these sections):
- **Users / Positioning:** Cloud & DevOps engineer at Parkar Global Technologies (Dec 2024 – present) automating Azure and AWS — IaC, CI/CD, monitoring — who also built an applied-AI (RAG) assistant at the same company. Audiences add DevOps/SRE leads and cloud architects.
- **Capabilities and Constraints:** dark only (`next-themes` removed); MDX for case studies; `lucide-react`; Vitest; no blog.
- **Content source:** the October 2026 resume plus questionnaire answers; copy paraphrased, never verbatim; the tailored resume variants in Downloads are not sources.
- **Brand Commitments:** dark premium engineering register ("AWS Console × Linear × Vercel"); one blue accent; teal, violet, neon, glow, terminal and hacker motifs rejected.
- **Evidence on Hand:** replace with the October facts — one role from Dec 2024; AVD for 5 clients (40% faster deployments ~8→~5 h, 70%+ less manual effort, config errors near zero, 450+ concurrent users, 25% lower monthly cloud spend across Azure and AWS, Azure Monitor/KQL observability with lower MTTR, no figure); AWS web platform (99.9% uptime multi-AZ, setup under 30 minutes, one-step replication, CI/CD with over 50% faster delivery, Grafana/Prometheus and CloudWatch monitoring); HR policy RAG assistant (~60% faster answers); DevSecOps pipeline (personal project); 5 certifications with dates; repos `Rag-Assistant-Chatbot`, `Automatic-Deployment`.
- **Explicitly absent:** add "no figure for MTTR", "no claims that the HR assistant is in production", "no daily-deployment or rollback claims".

- [ ] **Step 7: Commit**

```bash
git add vitest.config.mts tests package.json package-lock.json PRODUCT.md docs/archive
git commit -m "chore: add vitest harness and privacy test; update PRODUCT.md for the rebuild; archive old DESIGN.md"
```

**Phase 0 exit:** branch exists, baseline recorded, `npm test` green. Pending on Mihir: the October resume PDF saved as `public/MihirBhavsar_Resume.pdf`.

---

## Phase 1 — Direction

### Task 4: Tech registry, content types and Trace logic

**Files:**
- Create: `lib/tech.ts`, `lib/trace.ts`, `tests/trace.test.ts`
- Rewrite: `types/resume.ts`

**Interfaces:**
- Produces: `TechId`, `tech: Record<TechId, TechInfo>`; types `Figure`, `Estate`, `EstateZone`, `EstateNode`, `ControlLane`, `EstateEdge`, `ProofItem`, `Role`, `Workstream`, `Project`, `SkillGroup`, `Skill`, `Certification`, `EducationEntry`, `Achievement`, `FeaturedRepo`, `Resume`; functions `traceSelection(estate, proofId) → { ids: Set<string>; edges: Set<string> }`, `edgeKey(edge) → string`, `litBy(estate) → Map<string, string[]>`, `nextTraceState(state, event) → TraceState`.

- [ ] **Step 1: Write the tech registry**

```ts
// lib/tech.ts
/**
 * Technology registry. Brand colours exist only to mark the technology they
 * belong to (a dot or icon beside its name) — never as interface colour.
 */
export interface TechInfo {
  name: string;
  /** Official brand colour; omitted when the brand has none usable on a dark ground. */
  color?: string;
}

export const tech = {
  aws: { name: "AWS", color: "#FF9900" },
  azure: { name: "Azure", color: "#0078D4" },
  gcp: { name: "Google Cloud", color: "#4285F4" },
  "azure-virtual-desktop": { name: "Azure Virtual Desktop", color: "#0078D4" },
  "azure-image-builder": { name: "Azure VM Image Builder", color: "#0078D4" },
  "azure-devops": { name: "Azure DevOps", color: "#0078D4" },
  "azure-monitor": { name: "Azure Monitor", color: "#0078D4" },
  "key-vault": { name: "Azure Key Vault", color: "#0078D4" },
  "entra-id": { name: "Entra ID", color: "#0078D4" },
  fslogix: { name: "FSLogix", color: "#0078D4" },
  ec2: { name: "EC2", color: "#FF9900" },
  "auto-scaling": { name: "EC2 Auto Scaling", color: "#FF9900" },
  alb: { name: "Application Load Balancer", color: "#FF9900" },
  rds: { name: "RDS", color: "#FF9900" },
  lambda: { name: "Lambda", color: "#FF9900" },
  s3: { name: "S3", color: "#FF9900" },
  cloudfront: { name: "CloudFront", color: "#FF9900" },
  cloudwatch: { name: "CloudWatch", color: "#FF9900" },
  terraform: { name: "Terraform", color: "#7B42BC" },
  powershell: { name: "PowerShell", color: "#5391FE" },
  ansible: { name: "Ansible", color: "#EE0000" },
  "github-actions": { name: "GitHub Actions", color: "#2088FF" },
  github: { name: "GitHub" },
  jenkins: { name: "Jenkins", color: "#D24939" },
  sonarqube: { name: "SonarQube", color: "#4E9BCD" },
  "owasp-dependency-check": { name: "OWASP Dependency-Check" },
  trivy: { name: "Trivy", color: "#1904DA" },
  docker: { name: "Docker", color: "#2496ED" },
  kubernetes: { name: "Kubernetes", color: "#326CE5" },
  maven: { name: "Maven", color: "#C71A36" },
  prometheus: { name: "Prometheus", color: "#E6522C" },
  grafana: { name: "Grafana", color: "#F46800" },
  python: { name: "Python", color: "#3776AB" },
  fastapi: { name: "FastAPI", color: "#009688" },
  langchain: { name: "LangChain" },
  faiss: { name: "FAISS" },
  llama: { name: "Llama", color: "#0467DF" },
} satisfies Record<string, TechInfo>;

export type TechId = keyof typeof tech;
```

- [ ] **Step 2: Rewrite the content types**

```ts
// types/resume.ts
import type { TechId } from "@/lib/tech";

/** A measured outcome. A number without its provenance is resume inflation. */
export interface Figure {
  /** As displayed, qualifiers included: "70%+", "~60%", "450+", "<30 min". */
  value: string;
  /** What the value measures, read straight after it. */
  label: string;
  /** How it was achieved, one sentence. */
  provenance: string;
  /** How it was measured — only when Mihir has said so. */
  measuredHow?: string;
}

export interface EstateNode {
  id: string;
  label: string;
  /** Short second line, e.g. "autoscaling" or a count. */
  meta?: string;
  tech?: TechId;
}

/** A workload zone. Zones are siblings: no edge ever joins two workload zones. */
export interface EstateZone {
  id: "clients" | "azure" | "aws" | "ai";
  label: string;
  tech?: TechId;
  nodes: EstateNode[];
}

export interface ControlLane {
  id: "build" | "observe";
  label: string;
  nodes: EstateNode[];
}

/** An edge between node or zone ids. `source` cites where the relationship is stated. */
export interface EstateEdge {
  from: string;
  to: string;
  source: string;
}

/** A proof-strip figure and the topology ids its Trace lights. */
export interface ProofItem {
  id: string;
  figure: Figure;
  highlight: string[];
}

export interface Estate {
  zones: EstateZone[];
  controlPlane: ControlLane[];
  edges: EstateEdge[];
  proof: ProofItem[];
}

export interface Workstream {
  name: string;
  summary: string;
  points: string[];
  /** Slug of the case study that tells this workstream's story. */
  caseStudy?: string;
}

export interface Role {
  title: string;
  company: string;
  legalName: string;
  location: string;
  /** ISO month, e.g. "2024-12". A current role has no end. */
  start: string;
  workstreams: Workstream[];
}

export type ProjectKind = "work" | "personal";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  kind: ProjectKind;
  /** What Mihir owned, one line. */
  role: string;
  repo?: { owner: string; name: string };
  stack: TechId[];
  /** First figure is the card's lead figure. */
  figures: Figure[];
  /** Pipeline stages, shown on a card that has no figure. */
  stages?: string[];
}

export interface Skill {
  name: string;
  detail?: string;
  /** Links the skill to evidence in project and workstream stacks (Phase 3). */
  tech?: TechId;
}

export interface SkillGroup {
  name: string;
  skills: Skill[];
}

export interface Certification {
  name: string;
  code?: string;
  issuerId: "aws" | "microsoft" | "google";
  /** ISO month, e.g. "2025-06". */
  earned?: string;
  verifyUrl?: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  years: string;
  score: string;
}

export interface Achievement {
  title: string;
  detail: string;
}

export interface FeaturedRepo {
  owner: string;
  name: string;
  /** Fallback description when the API is unavailable or the repo has none. */
  blurb: string;
  demonstrates: string;
  /** Required for a fork to be shown: what Mihir added. */
  contribution?: string;
  /** Case-study slug this repo belongs to. */
  project?: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Resume {
  name: string;
  role: string;
  location: string;
  /** Hero line, at most 30 words. */
  positioning: string;
  summary: string;
  email: string;
  resumeFile: string;
  socials: SocialLink[];
  estate: Estate;
  experience: Role[];
  projects: Project[];
  skillGroups: SkillGroup[];
  certifications: Certification[];
  education: EducationEntry[];
  achievements: Achievement[];
  featuredRepos: FeaturedRepo[];
}
```

- [ ] **Step 3: Write the failing Trace tests**

```ts
// tests/trace.test.ts
import { describe, expect, it } from "vitest";
import type { Estate } from "@/types/resume";
import { edgeKey, litBy, nextTraceState, traceSelection } from "@/lib/trace";

const figure = { value: "1", label: "x", provenance: "y" };
const estate: Estate = {
  zones: [
    { id: "azure", label: "Azure", nodes: [{ id: "pool", label: "Pool" }, { id: "kv", label: "KV" }] },
    { id: "aws", label: "AWS", nodes: [{ id: "alb", label: "ALB" }, { id: "rds", label: "RDS" }] },
  ],
  controlPlane: [{ id: "build", label: "Build", nodes: [{ id: "ps", label: "PowerShell" }] }],
  edges: [
    { from: "ps", to: "azure", source: "resume" },
    { from: "alb", to: "rds", source: "resume" },
    { from: "pool", to: "kv", source: "resume" },
  ],
  proof: [
    { id: "a", figure, highlight: ["ps", "pool"] },
    { id: "b", figure, highlight: ["alb", "rds"] },
  ],
};

describe("traceSelection", () => {
  it("lights nothing when no figure is selected", () => {
    const s = traceSelection(estate, null);
    expect(s.ids.size).toBe(0);
    expect(s.edges.size).toBe(0);
  });

  it("lights an edge from a control tool to a zone that holds a lit node", () => {
    const s = traceSelection(estate, "a");
    expect(s.edges.has(edgeKey({ from: "ps", to: "azure" }))).toBe(true);
  });

  it("does not light an edge with only one lit node endpoint", () => {
    const s = traceSelection(estate, "a");
    expect(s.edges.has(edgeKey({ from: "pool", to: "kv" }))).toBe(false);
  });

  it("lights an edge whose two node endpoints are lit", () => {
    const s = traceSelection(estate, "b");
    expect(s.edges.has(edgeKey({ from: "alb", to: "rds" }))).toBe(true);
    expect(s.ids.has("azure")).toBe(false);
  });

  it("ignores an unknown proof id", () => {
    expect(traceSelection(estate, "nope").ids.size).toBe(0);
  });
});

describe("litBy", () => {
  it("maps every lit node, zone and edge to the proof ids that light it", () => {
    const map = litBy(estate);
    expect(map.get("ps")).toEqual(["a"]);
    expect(map.get("azure")).toEqual(["a"]);
    expect(map.get(edgeKey({ from: "alb", to: "rds" }))).toEqual(["b"]);
    expect(map.has("kv")).toBe(false);
  });
});

describe("nextTraceState", () => {
  const idle = { active: null, pinned: false };

  it("previews on hover or focus and clears on leave or blur", () => {
    const on = nextTraceState(idle, { type: "enter", id: "a" });
    expect(on).toEqual({ active: "a", pinned: false });
    expect(nextTraceState(on, { type: "leave", id: "a" })).toEqual(idle);
  });

  it("pins on tap and unpins on a second tap of the same figure", () => {
    const pinned = nextTraceState(idle, { type: "toggle", id: "a" });
    expect(pinned).toEqual({ active: "a", pinned: true });
    expect(nextTraceState(pinned, { type: "toggle", id: "a" })).toEqual(idle);
  });

  it("keeps a pinned figure through hover elsewhere ending", () => {
    const pinned = { active: "a", pinned: true };
    expect(nextTraceState(pinned, { type: "leave", id: "b" })).toEqual(pinned);
  });

  it("moves a pin to another figure on tap", () => {
    const pinned = { active: "a", pinned: true };
    expect(nextTraceState(pinned, { type: "toggle", id: "b" })).toEqual({ active: "b", pinned: true });
  });

  it("clears everything on escape", () => {
    expect(nextTraceState({ active: "a", pinned: true }, { type: "clear" })).toEqual(idle);
  });
});
```

- [ ] **Step 4: Run to verify failure**

Run: `npx vitest run tests/trace.test.ts`
Expected: FAIL — `Cannot find module '@/lib/trace'`.

- [ ] **Step 5: Implement the Trace logic**

```ts
// lib/trace.ts
import type { Estate, EstateEdge } from "@/types/resume";

export const edgeKey = (e: Pick<EstateEdge, "from" | "to">) => `${e.from}->${e.to}`;

export interface TraceSelection {
  ids: Set<string>;
  edges: Set<string>;
}

/**
 * The ids and edges one proof figure lights. A zone counts as lit when any of
 * its nodes is lit, so a control-plane edge into a zone lights with the work
 * it produced. An edge lights only when both of its endpoints are lit.
 */
export function traceSelection(estate: Estate, proofId: string | null): TraceSelection {
  const proof = estate.proof.find((p) => p.id === proofId);
  const ids = new Set<string>(proof?.highlight ?? []);
  if (proof) {
    for (const zone of estate.zones) {
      if (zone.nodes.some((n) => ids.has(n.id))) ids.add(zone.id);
    }
  }
  const edges = new Set<string>();
  for (const edge of estate.edges) {
    if (ids.has(edge.from) && ids.has(edge.to)) edges.add(edgeKey(edge));
  }
  return { ids, edges };
}

/** For every id and edge key, the proof ids that light it — precomputed on the server. */
export function litBy(estate: Estate): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const proof of estate.proof) {
    const { ids, edges } = traceSelection(estate, proof.id);
    for (const key of [...ids, ...edges]) {
      map.set(key, [...(map.get(key) ?? []), proof.id]);
    }
  }
  return map;
}

export interface TraceState {
  active: string | null;
  pinned: boolean;
}

export type TraceEvent =
  | { type: "enter"; id: string }
  | { type: "leave"; id: string }
  | { type: "toggle"; id: string }
  | { type: "clear" };

const IDLE: TraceState = { active: null, pinned: false };

/** Hover/focus previews, tap pins, a second tap or Escape clears. */
export function nextTraceState(state: TraceState, event: TraceEvent): TraceState {
  switch (event.type) {
    case "enter":
      return state.pinned ? state : { active: event.id, pinned: false };
    case "leave":
      return state.pinned ? state : IDLE;
    case "toggle":
      return state.pinned && state.active === event.id ? IDLE : { active: event.id, pinned: true };
    case "clear":
      return IDLE;
  }
}
```

- [ ] **Step 6: Run to verify pass**

Run: `npx vitest run tests/trace.test.ts`
Expected: PASS (11 tests).

- [ ] **Step 7: Commit** (the build is broken until Task 5 replaces the data; commit anyway on the branch)

```bash
git add lib/tech.ts lib/trace.ts types/resume.ts tests/trace.test.ts
git commit -m "feat: add tech registry, new content types and Trace selection logic"
```

### Task 5: Content migration from the October resume

**Files:**
- Rewrite: `lib/resume-data.ts`, `lib/site-config.ts`, `lib/sections.ts`
- Create: `tests/content.test.ts`, `tests/retired-claims.test.ts`
- Modify: `tests/privacy.test.ts` (scan `lib/` too)
- Delete: `components/estate-diagram.tsx`, `components/estate-sheet.tsx`, `components/operations-record.tsx`, `components/projects.tsx`, `components/project-dialog.tsx`, `components/pipeline.tsx`, `components/experience.tsx`, `components/skills.tsx`, `components/education.tsx`, `components/contact.tsx`, `components/icons.tsx`, `components/section.tsx`, `components/theme-provider.tsx`, `components/theme-toggle.tsx`
- Modify: `app/page.tsx` (render nothing but a placeholder `<main>` until Task 9), `app/opengraph-image.tsx` (read `resume.role` / `resume.positioning`)

**Interfaces:**
- Consumes: types from Task 4.
- Produces: `resume: Resume` from `@/lib/resume-data`; `sections: { label: string; id: string }[]` from `@/lib/sections`.

- [ ] **Step 1: Write the failing content and retired-claims tests**

```ts
// tests/content.test.ts
import { describe, expect, it } from "vitest";
import { resume } from "@/lib/resume-data";

const { estate } = resume;
const zoneIds = new Set(estate.zones.map((z) => z.id));
const nodeZone = new Map<string, string>();
estate.zones.forEach((z) => z.nodes.forEach((n) => nodeZone.set(n.id, z.id)));
const controlIds = new Set(estate.controlPlane.flatMap((l) => l.nodes.map((n) => n.id)));
const known = (id: string) => zoneIds.has(id as never) || nodeZone.has(id) || controlIds.has(id);
const allFigures = [...estate.proof.map((p) => p.figure), ...resume.projects.flatMap((p) => p.figures)];

describe("estate", () => {
  it("has unique ids across zones, nodes and control tools", () => {
    const ids = [
      ...estate.zones.map((z) => z.id),
      ...estate.zones.flatMap((z) => z.nodes.map((n) => n.id)),
      ...controlIds,
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves every edge endpoint and cites a source for every edge", () => {
    for (const e of estate.edges) {
      expect(known(e.from), e.from).toBe(true);
      expect(known(e.to), e.to).toBe(true);
      expect(e.source.trim()).not.toBe("");
    }
  });

  it("never joins two different workload zones", () => {
    const workload = (id: string) => nodeZone.get(id) ?? (zoneIds.has(id as never) ? id : undefined);
    for (const e of estate.edges) {
      const a = workload(e.from);
      const b = workload(e.to);
      if (a && b && a !== "clients" && b !== "clients") expect(a, `${e.from}->${e.to}`).toBe(b);
    }
  });

  it("only connects clients to the Azure zone", () => {
    for (const e of estate.edges) {
      if (nodeZone.get(e.from) === "clients") expect(nodeZone.get(e.to) ?? e.to).toBe("azure");
    }
  });

  it("resolves every proof highlight", () => {
    for (const p of estate.proof) for (const id of p.highlight) expect(known(id), id).toBe(true);
  });

  it("covers the Azure, AWS and AI zones in the proof strip", () => {
    const lit = new Set(estate.proof.flatMap((p) => p.highlight.map((id) => nodeZone.get(id))));
    for (const zone of ["azure", "aws", "ai"]) expect(lit.has(zone), zone).toBe(true);
  });
});

describe("figures", () => {
  it("each carries a provenance sentence", () => {
    for (const f of allFigures) expect(f.provenance.trim().length, f.value).toBeGreaterThan(20);
  });
});

describe("projects", () => {
  it("have unique slugs", () => {
    const slugs = resume.projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("show a figure or stages on every card", () => {
    for (const p of resume.projects) expect(p.figures.length + (p.stages?.length ?? 0), p.slug).toBeGreaterThan(0);
  });

  it("link workstreams only to existing case studies", () => {
    const slugs = new Set(resume.projects.map((p) => p.slug));
    for (const w of resume.experience.flatMap((r) => r.workstreams)) {
      if (w.caseStudy) expect(slugs.has(w.caseStudy), w.caseStudy).toBe(true);
    }
  });
});

describe("profile", () => {
  it("keeps the positioning line to 30 words", () => {
    expect(resume.positioning.split(/\s+/).length).toBeLessThanOrEqual(30);
  });

  it("strips tracking parameters from verification links", () => {
    for (const c of resume.certifications) if (c.verifyUrl) expect(c.verifyUrl).not.toMatch(/[?&](ref|utm_)/);
  });

  it("names the employer as decided", () => {
    for (const r of resume.experience) {
      expect(r.company).toBe("Parkar Global Technologies");
      expect(r.legalName).toBe("Parkar Global Technologies Pvt Ltd");
    }
  });
});
```

```ts
// tests/retired-claims.test.ts
import { describe, expect, it } from "vitest";
import { listSourceFiles, readSource } from "./source-files";

/** Claims retired by the October 2026 resume (spec §5). Remove one only when Mihir re-confirms it. */
const RETIRED = [
  "Parkar Digital",
  "200+",
  "1.5+ years",
  "Cloud Infrastructure Intern",
  "keyword search",
  "rollback",
  "daily deployment",
  "monthly AWS spend",
  "3+ client",
  "in production",
];

describe("retired claims", () => {
  it("do not appear in site source", () => {
    const hits = listSourceFiles(["lib", "components", "app", "content"]).flatMap((f) => {
      const text = readSource(f).toLowerCase();
      return RETIRED.filter((c) => text.includes(c.toLowerCase())).map((c) => `${f}: ${c}`);
    });
    expect(hits).toEqual([]);
  });
});
```

And widen the privacy scan:

```ts
// tests/privacy.test.ts — replace the dirs list
const offenders = listSourceFiles(["app", "components", "lib", "content"]).filter((f) =>
  /7096259248|resume\.phone/.test(readSource(f)),
);
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test`
Expected: FAIL — content tests fail on the old data shape; retired-claims lists hits in the old `lib/resume-data.ts` and components; privacy flags the stored phone.

- [ ] **Step 3: Delete the outgoing components**

```bash
git rm components/estate-diagram.tsx components/estate-sheet.tsx components/operations-record.tsx \
  components/projects.tsx components/project-dialog.tsx components/pipeline.tsx components/experience.tsx \
  components/skills.tsx components/education.tsx components/contact.tsx components/icons.tsx \
  components/section.tsx components/theme-provider.tsx components/theme-toggle.tsx
```

- [ ] **Step 4: Write the new content**

```ts
// lib/resume-data.ts
import type { Figure, Resume } from "@/types/resume";

/**
 * Single source of truth for site content. Facts come from Mihir's October 2026
 * resume and his questionnaire answers only; wording is paraphrased for the web.
 */

// Figures are defined once and shared by the proof strip and the project cards.
const fig = {
  deploy: {
    value: "40%",
    label: "faster AVD deployments across clients, ~8 h → ~5 h",
    provenance: "PowerShell provisioning and Azure VM Image Builder golden images replaced the manual build.",
    measuredHow: "Timed the deployment task before and after automation.",
  },
  manual: {
    value: "70%+",
    label: "less manual effort across 5 clients, with configuration errors near zero",
    provenance:
      "Azure DevOps pipelines run Terraform and PowerShell, joining the domain and pulling Key Vault secrets without a human step.",
    measuredHow: "Timed the task before and after automation.",
  },
  spend: {
    value: "25%",
    label: "lower monthly cloud spend across Azure and AWS",
    provenance: "Right-sizing and autoscaling across both clouds.",
  },
  users: {
    value: "450+",
    label: "concurrent VDI users supported",
    provenance: "FSLogix user profiles and AVD autoscaling on the clients' host pools.",
  },
  uptime: {
    value: "99.9%",
    label: "uptime on a multi-AZ WordPress platform",
    provenance: "Auto Scaling across availability zones behind a load balancer, with RDS for the database.",
  },
  setup: {
    value: "<30 min",
    label: "to stand up a new environment",
    provenance: "The whole platform is Terraform; plan and apply builds it, and one step replicates it.",
  },
  delivery: {
    value: "50%+",
    label: "faster feature delivery",
    provenance: "An end-to-end pipeline: Terraform provisions, Ansible configures, GitHub Actions runs it.",
  },
  answers: {
    value: "~60%",
    label: "faster answers to HR policy questions",
    provenance: "FAISS retrieval feeds Llama inference, replacing manual lookups in policy documents.",
  },
} satisfies Record<string, Figure>;

export const resume: Resume = {
  name: "Mihir Bhavsar",
  role: "Cloud & DevOps Engineer",
  location: "Ahmedabad, India",
  positioning:
    "I automate how Azure and AWS infrastructure is built, shipped and monitored, with Terraform, CI/CD and alerting, and I build applied AI: a RAG assistant for HR policy questions.",
  summary:
    "Cloud and DevOps engineer working across AWS, Azure and GCP since December 2024. Most of my work is infrastructure as code and delivery pipelines — Terraform, GitHub Actions and Azure DevOps — plus Linux administration and monitoring with Prometheus, Grafana and CloudWatch. I've used Docker, Kubernetes, Helm and ArgoCD in project work.",
  email: "mihirbhavsar2001@gmail.com",
  resumeFile: "/MihirBhavsar_Resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/MihirBhavsar3102" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mihirbhavsar3102/" },
  ],

  estate: {
    zones: [
      {
        id: "clients",
        label: "Clients",
        nodes: [
          { id: "clients-orgs", label: "Enterprise clients", meta: "5" },
          { id: "clients-users", label: "Concurrent VDI users", meta: "450+" },
        ],
      },
      {
        id: "azure",
        label: "Azure · Virtual Desktop",
        tech: "azure",
        nodes: [
          { id: "host-pools", label: "Host pools", meta: "autoscaling", tech: "azure-virtual-desktop" },
          { id: "session-hosts", label: "Session hosts", meta: "FSLogix profiles", tech: "fslogix" },
          { id: "golden-images", label: "Golden images", meta: "VM Image Builder", tech: "azure-image-builder" },
          { id: "key-vault", label: "Key Vault", tech: "key-vault" },
          { id: "domain-join", label: "AD domain join", tech: "azure" },
        ],
      },
      {
        id: "aws",
        label: "AWS · Web platform",
        tech: "aws",
        nodes: [
          { id: "cdn", label: "CloudFront + S3", tech: "cloudfront" },
          { id: "alb", label: "Load balancer", tech: "alb" },
          { id: "asg", label: "EC2 Auto Scaling", meta: "multi-AZ", tech: "auto-scaling" },
          { id: "rds", label: "RDS", tech: "rds" },
          { id: "lambda", label: "Lambda", tech: "lambda" },
        ],
      },
      {
        id: "ai",
        label: "AI · HR policy assistant",
        nodes: [
          { id: "api", label: "FastAPI", tech: "fastapi" },
          { id: "orchestration", label: "LangChain", tech: "langchain" },
          { id: "retrieval", label: "FAISS retrieval", tech: "faiss" },
          { id: "inference", label: "Llama inference", tech: "llama" },
        ],
      },
    ],
    controlPlane: [
      {
        id: "build",
        label: "Build and ship",
        nodes: [
          { id: "terraform", label: "Terraform", tech: "terraform" },
          { id: "powershell", label: "PowerShell", tech: "powershell" },
          { id: "azure-devops", label: "Azure DevOps", tech: "azure-devops" },
          { id: "github-actions", label: "GitHub Actions", tech: "github-actions" },
          { id: "ansible", label: "Ansible", tech: "ansible" },
        ],
      },
      {
        id: "observe",
        label: "Observe",
        nodes: [
          { id: "azure-monitor", label: "Azure Monitor", meta: "Log Analytics · KQL", tech: "azure-monitor" },
          { id: "cloudwatch", label: "CloudWatch", tech: "cloudwatch" },
          { id: "grafana", label: "Prometheus + Grafana", tech: "grafana" },
        ],
      },
    ],
    edges: [
      { from: "clients-users", to: "host-pools", source: "resume: AVD — 450+ concurrent VDI users on client host pools" },
      { from: "host-pools", to: "session-hosts", source: "resume: AVD — FSLogix profiles and host-pool autoscaling" },
      { from: "golden-images", to: "session-hosts", source: "resume: AVD — Image Builder golden-image pipelines" },
      { from: "cdn", to: "alb", source: "resume: AWS — multi-AZ WordPress architecture" },
      { from: "alb", to: "asg", source: "resume: AWS — multi-AZ WordPress architecture" },
      { from: "asg", to: "rds", source: "resume: AWS — multi-AZ WordPress architecture" },
      { from: "api", to: "orchestration", source: "resume: HR chatbot — FastAPI, LangChain" },
      { from: "orchestration", to: "retrieval", source: "resume: HR chatbot — FAISS semantic retrieval" },
      { from: "orchestration", to: "inference", source: "resume: HR chatbot — Llama inference" },
      { from: "terraform", to: "azure", source: "resume: AVD — Azure DevOps pipelines running Terraform" },
      { from: "powershell", to: "azure", source: "resume: AVD — PowerShell provisioning" },
      { from: "azure-devops", to: "azure", source: "resume: AVD — Azure DevOps pipelines" },
      { from: "terraform", to: "aws", source: "resume: AWS environment — Terraform plan and apply" },
      { from: "ansible", to: "aws", source: "resume: AWS environment — CI/CD with Ansible" },
      { from: "github-actions", to: "aws", source: "resume: AWS environment — CI/CD with GitHub Actions" },
      { from: "azure-monitor", to: "azure", source: "resume: AVD — Azure Monitor and Log Analytics" },
      { from: "cloudwatch", to: "aws", source: "resume: AWS environment — CloudWatch alarms and dashboards" },
      { from: "grafana", to: "aws", source: "resume: AWS environment section — Grafana on Prometheus" },
    ],
    proof: [
      { id: "deploy", figure: fig.deploy, highlight: ["golden-images", "session-hosts", "host-pools", "powershell"] },
      { id: "manual", figure: fig.manual, highlight: ["key-vault", "domain-join", "session-hosts", "azure-devops", "terraform", "powershell"] },
      { id: "spend", figure: fig.spend, highlight: ["host-pools", "asg"] },
      { id: "users", figure: fig.users, highlight: ["clients-orgs", "clients-users", "host-pools", "session-hosts"] },
      { id: "uptime", figure: fig.uptime, highlight: ["cdn", "alb", "asg", "rds"] },
      { id: "answers", figure: fig.answers, highlight: ["api", "orchestration", "retrieval", "inference"] },
    ],
  },

  experience: [
    {
      title: "Cloud Operations Engineer",
      company: "Parkar Global Technologies",
      legalName: "Parkar Global Technologies Pvt Ltd",
      location: "Ahmedabad, India",
      start: "2024-12",
      workstreams: [
        {
          name: "Azure Virtual Desktop",
          summary: "Building and running virtual desktop estates for five enterprise clients.",
          caseStudy: "avd-automation",
          points: [
            "Automated AVD builds with PowerShell and Azure VM Image Builder golden images, taking multi-client deployments from about 8 hours to about 5 — 40% faster.",
            "Moved provisioning into Azure DevOps pipelines that run Terraform and PowerShell, with domain join and Key Vault secrets handled automatically: over 70% less manual effort and configuration errors close to zero across five clients.",
            "Set up FSLogix profiles and autoscaling on client host pools serving 450+ concurrent users, and cut monthly cloud spend by 25% through right-sizing and autoscaling.",
            "Added Azure Monitor and Log Analytics (KQL) monitoring to the VDI estate, shortening the time to resolve support incidents.",
          ],
        },
        {
          name: "AWS environments",
          summary: "Designing, provisioning and monitoring AWS environments from code.",
          caseStudy: "aws-web-platform",
          points: [
            "Designed and deployed a fault-tolerant, multi-AZ WordPress platform on EC2 Auto Scaling, an Application Load Balancer, RDS, Lambda, S3 and CloudFront, running at 99.9% uptime.",
            "Defined it in Terraform, so a new environment takes under 30 minutes and can be replicated in one step.",
            "Built an end-to-end CI/CD pipeline with Terraform, Ansible and GitHub Actions that made feature delivery over 50% faster.",
            "Built Grafana dashboards and alert rules on an existing Prometheus stack, plus CloudWatch alarms and dashboards.",
          ],
        },
        {
          name: "Linux administration",
          summary: "Looking after the Linux servers underneath.",
          points: ["User and SSH access, permissions, OS patching, web and app server setup, and service troubleshooting."],
        },
      ],
    },
  ],

  projects: [
    {
      slug: "avd-automation",
      title: "Azure Virtual Desktop automation",
      summary:
        "Provisioning, imaging and scaling Azure Virtual Desktop for five enterprise clients, automated with PowerShell, Image Builder and Azure DevOps pipelines.",
      kind: "work",
      role: "Built the end-to-end VM provisioning in PowerShell; one of a four-person team running the estate.",
      stack: ["azure-virtual-desktop", "powershell", "azure-image-builder", "azure-devops", "terraform", "key-vault", "fslogix", "azure-monitor"],
      figures: [fig.manual, fig.deploy, fig.spend, fig.users],
    },
    {
      slug: "aws-web-platform",
      title: "Multi-AZ AWS web platform",
      summary:
        "A fault-tolerant WordPress platform on AWS, defined in Terraform and shipped through a Terraform, Ansible and GitHub Actions pipeline.",
      kind: "work",
      role: "Designed and deployed the platform; built its Terraform and its CI/CD pipeline.",
      repo: { owner: "MihirBhavsar3102", name: "Automatic-Deployment" },
      stack: ["ec2", "auto-scaling", "alb", "rds", "lambda", "s3", "cloudfront", "terraform", "ansible", "github-actions", "cloudwatch", "prometheus", "grafana"],
      figures: [fig.uptime, fig.setup, fig.delivery],
    },
    {
      slug: "hr-policy-assistant",
      title: "HR policy assistant",
      summary: "A retrieval-augmented chatbot that answers HR policy questions from the policy documents themselves.",
      kind: "work",
      role: "Built it: FAISS retrieval, Llama inference and the FastAPI service around them.",
      repo: { owner: "MihirBhavsar3102", name: "Rag-Assistant-Chatbot" },
      stack: ["python", "fastapi", "langchain", "faiss", "llama"],
      figures: [fig.answers],
    },
    {
      slug: "devsecops-pipeline",
      title: "DevSecOps CI/CD pipeline",
      summary:
        "A Jenkins pipeline with security gates at build and deploy, shipping a three-tier Java app to self-managed Kubernetes on every push.",
      kind: "personal",
      role: "Designed and built it.",
      stack: ["jenkins", "sonarqube", "owasp-dependency-check", "trivy", "docker", "kubernetes", "maven", "github"],
      figures: [],
      stages: ["GitHub webhook", "Maven build", "SonarQube", "OWASP Dependency-Check", "Docker image", "Trivy scan", "Kubernetes deploy"],
    },
  ],

  skillGroups: [
    {
      name: "CI/CD",
      skills: [
        { name: "GitHub Actions", tech: "github-actions" },
        { name: "GitLab CI/CD" },
        { name: "Jenkins", tech: "jenkins" },
        { name: "Azure DevOps", tech: "azure-devops" },
        { name: "AWS CodePipeline, CodeBuild, CodeDeploy" },
        { name: "Git" },
      ],
    },
    {
      name: "Infrastructure as code",
      skills: [
        { name: "Terraform", detail: "reusable modules", tech: "terraform" },
        { name: "CloudFormation" },
        { name: "AWS CDK" },
        { name: "Ansible", detail: "configuration management", tech: "ansible" },
      ],
    },
    {
      name: "Containers and orchestration",
      skills: [
        { name: "Docker", tech: "docker" },
        { name: "Kubernetes", tech: "kubernetes" },
        { name: "Helm" },
        { name: "ArgoCD", detail: "GitOps" },
        { name: "Amazon EKS" },
        { name: "Amazon ECS" },
        { name: "GKE" },
      ],
    },
    {
      name: "Cloud platforms",
      skills: [
        { name: "AWS", detail: "EC2, IAM, VPC, S3, ALB, ASG, RDS, Route 53, Lambda, CloudFront, Secrets Manager", tech: "aws" },
        { name: "Azure", detail: "AVD, Virtual Machines, Entra ID, Key Vault, RBAC", tech: "azure" },
        { name: "Google Cloud", detail: "Compute Engine, Cloud Monitoring", tech: "gcp" },
      ],
    },
    {
      name: "Observability",
      skills: [
        { name: "Prometheus", tech: "prometheus" },
        { name: "Grafana", tech: "grafana" },
        { name: "CloudWatch", tech: "cloudwatch" },
        { name: "Azure Monitor", detail: "KQL, Log Analytics", tech: "azure-monitor" },
        { name: "Logging and alerting" },
      ],
    },
    {
      name: "Linux and networking",
      skills: [
        { name: "Linux administration" },
        { name: "SSH" },
        { name: "DNS" },
        { name: "TLS/SSL" },
        { name: "VPC and VNet networking" },
        { name: "Load balancing" },
        { name: "Firewall rules", detail: "NSG" },
      ],
    },
    {
      name: "Scripting and databases",
      skills: [
        { name: "Python", detail: "boto3", tech: "python" },
        { name: "Bash" },
        { name: "PowerShell", tech: "powershell" },
        { name: "Java" },
        { name: "SQL" },
        { name: "PostgreSQL" },
        { name: "MongoDB" },
        { name: "DynamoDB" },
      ],
    },
    {
      name: "Practices",
      skills: [
        { name: "Agile / Scrum" },
        { name: "Incident response" },
        { name: "Root cause analysis" },
        { name: "Backup and restore" },
        { name: "Cost optimization" },
      ],
    },
    {
      name: "AI tools and frameworks",
      skills: [
        { name: "GitHub Copilot" },
        { name: "Claude Code" },
        { name: "LangChain", tech: "langchain" },
        { name: "CrewAI" },
        { name: "RAG pipelines" },
      ],
    },
  ],

  certifications: [
    {
      name: "AWS Certified Solutions Architect – Associate",
      code: "SAA-C03",
      issuerId: "aws",
      earned: "2025-06",
      verifyUrl: "https://www.credly.com/badges/5d3cb6a6-0610-4914-8a2f-52511656e738/public_url",
    },
    {
      name: "AWS Certified Cloud Practitioner",
      code: "CLF-C02",
      issuerId: "aws",
      earned: "2025-03",
      verifyUrl: "https://www.credly.com/badges/776fad7d-c50e-439c-b05a-7a62f83928d6",
    },
    {
      name: "Microsoft Certified: Azure Fundamentals",
      code: "AZ-900",
      issuerId: "microsoft",
      earned: "2025-06",
      verifyUrl: "https://learn.microsoft.com/en-in/users/mihirbhavsar-6601/credentials/77676d8ea945c96",
    },
    {
      name: "Microsoft Certified: Azure AI Fundamentals",
      code: "AI-900",
      issuerId: "microsoft",
      earned: "2026-04",
      verifyUrl: "https://learn.microsoft.com/en-in/users/mihirbhavsar-6601/credentials/b49e1012070f7cc0",
    },
    { name: "Google Cloud Digital Leader", issuerId: "google" },
  ],

  education: [
    {
      degree: "B.E., Computer Science and Engineering",
      institution: "The Maharaja Sayajirao University of Baroda",
      years: "2022 – 2025",
      score: "73.31%",
    },
    {
      degree: "Diploma, Computer Engineering",
      institution: "Gujarat Technological University",
      years: "2019 – 2022",
      score: "CGPA 8.89",
    },
  ],

  achievements: [
    {
      title: "National Cadet Corps, 2019 – 2022",
      detail: "Letter of Appreciation from Admiral Karambir Singh, former Chief of the Naval Staff.",
    },
  ],

  featuredRepos: [
    {
      owner: "MihirBhavsar3102",
      name: "Rag-Assistant-Chatbot",
      blurb: "The HR policy assistant: FAISS retrieval and Llama inference behind a FastAPI service.",
      demonstrates: "Applied AI",
      project: "hr-policy-assistant",
    },
    {
      owner: "MihirBhavsar3102",
      name: "Automatic-Deployment",
      blurb: "The Terraform, Ansible and GitHub Actions pipeline behind the AWS web platform.",
      demonstrates: "CI/CD and IaC",
      project: "aws-web-platform",
    },
    {
      owner: "MihirBhavsar3102",
      name: "Natural-Language-to-Robot-Framework",
      blurb: "Turns plain English into Robot Framework test files with AI.",
      demonstrates: "AI tooling",
      // Fork: hidden until Mihir supplies his contribution line (questionnaire A3b).
    },
  ],
};
```

```ts
// lib/site-config.ts
export const siteConfig = {
  name: "Mihir Bhavsar",
  title: "Mihir Bhavsar — Cloud & DevOps Engineer",
  description:
    "Cloud & DevOps engineer automating Azure and AWS with Terraform, CI/CD pipelines and monitoring, plus applied AI. Based in Ahmedabad, India.",
  // Base for resolving metadata URLs only; never fetched. `||` so an empty
  // build arg also falls back instead of breaking new URL().
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
};
```

```ts
// lib/sections.ts
/** Nav targets, shared by the desktop nav and the mobile menu so they can't drift. */
export const sections = [
  { label: "Work", id: "work" },
  { label: "Experience", id: "experience" },
  { label: "Stack", id: "stack" },
  { label: "Credentials", id: "credentials" },
  { label: "Contact", id: "contact" },
];
```

`app/page.tsx` becomes a stub until Task 9: `export default function Home() { return null; }`. `app/opengraph-image.tsx`: replace any reference to removed fields with `resume.name`, `resume.role`, and `resume.positioning` (its visual rebuild is Phase 4).

- [ ] **Step 5: Run tests, type check and lint**

Run: `npm test && npm run typecheck && npm run lint`
Expected: all PASS. Fix any remaining import of a deleted component (layout's `ThemeProvider` is replaced in Task 7; until then remove the import and render children directly).

- [ ] **Step 6: Commit**

```bash
git add -A lib types tests app components
git commit -m "feat: migrate site content to the October 2026 resume; retire outgoing components"
```

### Task 6: Direction round (impeccable)

**Files:**
- Create: `<scratch>/direction-payload.json`
- Modify: `app/layout.tsx` (direction contract only, Task 7 does the rest)

**Interfaces:**
- Produces: the **direction contract** (THESIS, OWN-WORLD, STORY, FIRST VIEWPORT, FORM + seed key, FINISH) and these concrete choices consumed by Tasks 7–9: the two font families, values for every semantic token listed in Task 7, the radius scale, and the first-viewport composition.

- [ ] **Step 1:** Run `node <impeccable>/scripts/concept-seed.mjs --scope direction --mode persuade` from the project root and follow what it prints (the brief pins the world: dark premium engineering console; the pinned direction leads).
- [ ] **Step 2:** Run `serve-question.mjs --schema`, author the payload (assigned/pinned direction first with raised lines, challengers with verdicts, canon card, `buildPath` code-led since no image generation is available), start it with `--start --payload`, open the URL for Mihir.
- [ ] **Step 3:** Collect the answer with `--wait --key <key>` (repeat on exit 3; exit 2 → structured question fallback; exit 4 → re-present once, then proceed with the assigned direction and say so).
- [ ] **Step 4:** Write the direction contract (≤150 words, five blocks + FINISH line) into `app/layout.tsx` as the body's first child, replacing the Plotted Sheet contract.
- [ ] **Step 5:** Load `reference/craft-floor.md` before any UI edit in Tasks 7–9.

### Task 7: Tokens, fonts and layout shell

**Files:**
- Rewrite: `app/globals.css`, `app/layout.tsx`
- Modify: `package.json` (remove `next-themes`, add `lucide-react`)
- Modify: `.impeccable/config.json` (drop the Plotted Sheet `codex-grid-background` exemption)

**Interfaces:**
- Consumes: the Task 6 choices.
- Produces: Tailwind v4 theme tokens usable as utilities — colours `canvas`, `surface-1`, `surface-2`, `surface-3`, `line`, `line-strong`, `ink`, `ink-2`, `ink-3`, `accent`, `accent-ink`, `accent-soft`; fonts `--font-sans`, `--font-mono`; the `.on-trace` dim/lit attribute rules (`[data-tracing] [data-lit-by]:not([data-lit])` dims; `[data-lit]` takes the accent).

- [ ] **Step 1:** `npm uninstall next-themes && npm install lucide-react`.
- [ ] **Step 2:** Rewrite `app/globals.css`: `@import "tailwindcss";` then one `@theme` block declaring the tokens above with the Task 6 values (dark only, no `.dark` variant, `color-scheme: dark`), base layer (body background `canvas`, text `ink`, `font-variant-numeric: tabular-nums`, focus ring 2px `accent` at 3px offset, `scroll-padding-top` for the sticky nav, smooth scroll only under `prefers-reduced-motion: no-preference`), skip-link styles, the Trace attribute rules, and one `@media (prefers-reduced-motion: reduce)` block that sets `animation: none !important; transition: none !important` on `*`.
- [ ] **Step 3:** Rewrite `app/layout.tsx`: the two Task 6 fonts via `next/font/google` with `variable` names `--font-sans` / `--font-mono` source variables, metadata from `siteConfig` (keywords: Cloud Engineer, DevOps Engineer, Azure Virtual Desktop, Terraform, AWS, CI/CD, Kubernetes, RAG, Ahmedabad), `viewport.themeColor` = the canvas value, `<html lang="en" className="dark …">` without `suppressHydrationWarning` or `ThemeProvider`, contract as the body's first child, skip link, `<SiteNav />`, `<main id="main">`, `<SiteFooter />`.
- [ ] **Step 4:** Remove the `codex-grid-background` entry from `.impeccable/config.json` `ignoreValues` (its target, `.sheet-grid`, no longer exists).
- [ ] **Step 5:** `npm run typecheck && npm run lint && npm test` → PASS. Commit: `feat: dark design tokens, fonts and layout shell`.

### Task 8: Navigation

**Files:**
- Rewrite: `components/site-nav.tsx` → `components/site/site-nav.tsx`, `components/mobile-nav.tsx` → `components/site/mobile-nav.tsx`, `components/site-footer.tsx` → `components/site/site-footer.tsx`
- Move: `components/copy-email-button.tsx` → `components/ui/copy-email-button.tsx`
- Keep: `components/ui/dialog.tsx`

**Interfaces:**
- Consumes: `sections`, `resume.resumeFile`, `resume.email`, `resume.socials`, tokens.
- Produces: `SiteNav`, `MobileNav`, `SiteFooter`, `CopyEmailButton({ email, className? })`.

- [ ] **Step 1:** `SiteNav` (client): sticky, name as home link, `sections` links with an active indicator (IntersectionObserver; framer-motion `m.span` with `layoutId` inside `LazyMotion features={domAnimation}`; spring stiffness 380 / damping 30; instant under reduced motion), and a **Resume** link (`href={resume.resumeFile}`, `download`) styled as the primary small action. On routes other than `/`, links point to `/#id`. Lucide icons only for the menu and download glyphs.
- [ ] **Step 2:** `MobileNav`: Radix Dialog sheet from `components/ui/dialog.tsx`, opened by a 44 px menu button below `md`; no entrance animation; closes on link click; contains the same links plus Resume and email.
- [ ] **Step 3:** `SiteFooter`: name, email, GitHub, LinkedIn, resume, and a one-line colophon ("Built with Next.js. Facts from my resume; nothing invented.").
- [ ] **Step 4:** Restyle `CopyEmailButton` to the tokens (behaviour unchanged: copies, announces via an `aria-live` status, falls back to `mailto:` when the Clipboard API is unavailable).
- [ ] **Step 5:** `npm run typecheck && npm run lint && npm test` → PASS. Commit: `feat: dark navigation, mobile sheet and footer`.

### Task 9: Hero, topology, proof strip and Trace

**Files:**
- Create: `components/hero/hero.tsx`, `components/hero/topology.tsx`, `components/hero/topology-stack.tsx`, `components/hero/proof-strip.tsx`, `components/hero/trace-provider.tsx`, `components/ui/tech-dot.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `resume.estate`, `litBy`, `edgeKey`, `nextTraceState`, `tech`, tokens.
- Produces: `<Hero />` (server) composed of `<TraceProvider>` (client) wrapping `<Topology />` (server SVG, `md` and up), `<TopologyStack />` (server list, below `md`), and `<ProofStrip />` (client).

- [ ] **Step 1: Trace provider (client island)**

```tsx
// components/hero/trace-provider.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useReducer, useRef } from "react";
import { nextTraceState, type TraceEvent, type TraceState } from "@/lib/trace";

const TraceContext = createContext<{ state: TraceState; send: (e: TraceEvent) => void } | null>(null);

export function useTrace() {
  const ctx = useContext(TraceContext);
  if (!ctx) throw new Error("useTrace must be used inside <TraceProvider>");
  return ctx;
}

/**
 * Holds which proof figure is lit and marks the server-rendered topology:
 * elements carry `data-lit-by="id id"`; the active id sets `data-lit` on them.
 * The SVG itself never re-renders, so it ships no JavaScript of its own.
 */
export function TraceProvider({ children, className }: { children: React.ReactNode; className?: string }) {
  const [state, dispatch] = useReducer(nextTraceState, { active: null, pinned: false });
  const send = useCallback((e: TraceEvent) => dispatch(e), []);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    root.current?.querySelectorAll<HTMLElement | SVGElement>("[data-lit-by]").forEach((el) => {
      const ids = (el.getAttribute("data-lit-by") ?? "").split(" ");
      el.toggleAttribute("data-lit", state.active !== null && ids.includes(state.active));
    });
  }, [state.active]);

  return (
    <TraceContext.Provider value={{ state, send }}>
      <div
        ref={root}
        className={className}
        data-tracing={state.active ? "" : undefined}
        onKeyDown={(e) => e.key === "Escape" && send({ type: "clear" })}
      >
        {children}
      </div>
    </TraceContext.Provider>
  );
}
```

- [ ] **Step 2: Proof strip (client)** — one `<button type="button">` per `estate.proof` item, `aria-pressed={state.pinned && state.active === id}`, `aria-describedby` pointing at its provenance; `onPointerEnter` / `onFocus` → `enter`, `onPointerLeave` / `onBlur` → `leave`, `onClick` → `toggle`. Figure `value` in the display/data style, `label` beside it, `provenance` always rendered (content complete without JS). Grid of 3 × 2 at `lg`, 2 columns at `sm`, 1 column below; targets ≥ 44 px.

- [ ] **Step 3: Topology (server SVG)** — a fixed coordinate layout declared in the component (no auto-layout): control plane band (Build and ship, Observe) across the top; three workload zones (Azure, AWS, AI) as bordered regions below, Clients beside Azure; nodes as labelled rects with a `TechDot` (brand colour dot, `aria-hidden`); edges as paths. Every zone, node and edge element gets `data-lit-by={litBy(estate).get(id)?.join(" ")}` when lit by any proof. The `<svg>` is `aria-hidden="true"`; a visually hidden `<p>` summarises the estate in text. Load orchestration via CSS keyframes with `animation-fill-mode: backwards` under `prefers-reduced-motion: no-preference`: zones settle (opacity + ≤ 8 px), then control-plane edges draw via `stroke-dashoffset`, total ≤ 1.6 s, never loops.

- [ ] **Step 4: Topology stack (below `md`)** — the same zones as a ruled vertical list (zone label, its nodes, and which control-plane tools connect to it), carrying the same `data-lit-by` attributes so Trace works on phones.

- [ ] **Step 5: Hero composition** — exactly as the Task 6 FIRST VIEWPORT block: name (display), role, `resume.positioning`, primary **View work** (`/#work`), secondary **Download resume** (`download`), `CopyEmailButton`; topology beside; proof strip below. `app/page.tsx` renders `<Hero />`.

- [ ] **Step 6:** `npm run typecheck && npm run lint && npm test && npm run build` → PASS. Commit: `feat: hero with estate topology, proof strip and Trace`.

### Task 10: Verify, review and record

**Files:**
- Create: `.impeccable/review/desktop.png`, `.impeccable/review/mobile.png` (+ dev-mode, no-JS and reduced-motion captures in the scratchpad)
- Create: `DESIGN.md` (+ sidecar) via the documenter

- [ ] **Step 1:** Production build, `next start` on a free port; Edge headless over CDP (isolated profile, `--disable-extensions`); settle animations 2 s; capture 1440 × 900 and 375 × 812 first viewports and full pages; assert the stylesheet returns 200 first. Repeat once on `npm run dev`.
- [ ] **Step 2:** Behaviour checks over CDP with trusted input: Tab to the first figure → topology elements with that id gain `data-lit`; Escape clears; tap (mouse press/release) pins, second tap clears; nav menu opens at 375 px and closes on link click; Resume link returns 200 with `application/pdf`; no horizontal scroll at 375 px (`scrollWidth === clientWidth`); with `Emulation.setScriptExecutionDisabled` every figure and provenance is present; with `prefers-reduced-motion: reduce` no element has a running animation.
- [ ] **Step 3:** `node <impeccable>/scripts/detect.mjs --json app components` once; fix mechanical findings.
- [ ] **Step 4:** Spawn `impeccable:impeccable-finish-reviewer` with the request, the spec, the direction contract, the screenshots, the craft-floor path, and the detector output; act on its disposition (fix → one batch → recapture → verdict pass; two rounds max).
- [ ] **Step 5:** Spawn `impeccable:impeccable-documenter` to write DESIGN.md and its sidecar from the built hero.
- [ ] **Step 6:** Commit: `docs: record DESIGN.md for the dark direction`.

**Phase 1 exit gate:** Mihir reviews the hero on localhost at 1440 and 375 px and approves the direction. Nav links to sections built in Phases 2–3 are known to have no target yet.
