# Portfolio Rebuild — Design Spec

- **Date:** 2026-09-27 · **Revised:** 2026-10-10 (rev 2 — facts re-sourced from Mihir's October 2026 resume and his questionnaire answers)
- **Status:** Draft for review
- **Owner:** Mihir Bhavsar
- **Companion:** [Case-study questionnaire](2026-09-27-case-study-questionnaire.md)

## 1. Summary

Rebuild Mihir Bhavsar's portfolio as a dark, premium cloud-engineering site — "AWS Console × Linear × Vercel" — that tells a technical recruiter who Mihir is, what he specialises in, and what measurable infrastructure work he has done, inside the first 10 seconds. The current light navy build ("The Plotted Architecture Sheet") is replaced, not polished.

Facts come from Mihir's October 2026 resume and his questionnaire answers. The website does not copy the resume: every fact is rewritten for the web, with the same numbers and nothing added.

## 2. Decisions already made

| Decision | Choice | Consequence |
|---|---|---|
| Theme | **Dark only** | Remove `next-themes` and the theme toggle. Colours still live in tokens, so a light theme can be added later. Overrides PRODUCT.md's "light and dark both first-class". |
| Blog | **Not in this rebuild** | MDX is for case studies only. No `/blog` route, no nav entry. |
| Source of facts | **October 2026 resume + questionnaire** | The resume Mihir attached on 2026-10-10 replaces everything in today's `lib/resume-data.ts`. The tailored resume variants in `Downloads/` disagree with each other and are never used as a source. |
| Copy | **Paraphrased, not copied** | Rules in section 5. Same facts and numbers, web-native wording. |
| Employer name | **Parkar Global Technologies** | Used everywhere. The full legal name "Parkar Global Technologies Pvt Ltd" appears once, in the experience entry. "Parkar Digital" is retired from the site. |
| Scale | **5 enterprise clients, 450+ concurrent VDI users** | Overrides the "3 clients, 400+" edit in questionnaire A5 and the old "200+". |
| The 25% saving | **Overall monthly cloud spend, Azure and AWS** | Trace highlights both the Azure host pools and the AWS Auto Scaling group. |
| Case studies | **Four stories** | AVD automation (lead) · AWS web platform · HR policy assistant · DevSecOps pipeline (personal project). Details in section 7. |
| GitHub section | **Hand-picked repos only** | `Rag-Assistant-Chatbot`, `Automatic-Deployment`, `Natural-Language-to-Robot-Framework`. Live metadata, no contribution graph. A fork is shown only when labelled with its upstream and Mihir's contribution. |
| Contact | **Email first** | No booking link exists (questionnaire A1). LinkedIn and GitHub alongside. The phone number is never rendered on the site. |
| Build approach | **Rebuild in place on a branch** | The current uncommitted build is committed to `master` as a checkpoint, then work moves to `redesign/dark-console`. |
| Case-study surface | **Routes, not modals** | `/work/[slug]` pages replace `project-dialog.tsx`: shareable URLs, per-page SEO and OG images, and the July dialog-lag issue disappears. |
| Excluded tech | Mermaid, Three.js / R3F, simple-icons, graph auto-layout libraries | Performance over gimmicks. Diagrams are server-rendered SVG. |

## 3. Audience and success criteria

Audiences, in priority order: technical recruiters and hiring managers (30–60 s skim) → DevOps/SRE leads and cloud architects → interview panels (deep read).

The 10-second test, which the Phase 1 gate checks directly:

| Time | The visitor has read |
|---|---|
| 0–3 s | Name and role ("Cloud & DevOps Engineer") |
| 3–7 s | The positioning line, plus the Azure / AWS / AI zone labels on the hero topology |
| 7–10 s | The measured outcomes in the proof strip |

Site-level success (from PRODUCT.md, unchanged): the visitor emails or connects; downloads the resume; believes the numbers; remembers the candidate.

## 4. Scope

**In:** design system, navigation, hero with infrastructure topology, proof strip with Trace, case-study cards and pages, architecture diagrams, experience, stack, certifications + education + NCC, curated GitHub repos, contact, footer, motion, responsive behaviour, SEO, accessibility, performance, final audit.

**Out:** blog, light theme, contact form or any backend, analytics, CMS, i18n, Vercel-specific configuration, contribution graph, headshot or any photograph, testimonials.

## 5. Content sources and copy rules

### Where facts come from

1. Mihir's October 2026 resume (attached 2026-10-10).
2. His questionnaire answers.
3. His decisions in section 2, which win wherever 1 and 2 disagree.

Nothing else. If a sentence needs a fact none of these contain, the sentence is cut or the question goes into the questionnaire.

### How copy is written

- **Outcome first.** Lead with what changed, then how.
- **Plain verbs and shorter sentences.** No résumé register ("Architected and deployed…", "leveraging", "spearheaded").
- **Numbers keep their exact qualifiers.** `~`, `+`, "over", and "near zero" are never dropped or strengthened.
- **No new claims.** Paraphrasing may reorder and simplify. It may not add scope ("every", "all"), a result, or a technology.
- **First person** on case-study pages; third person nowhere.

Example of the register:

> **Resume:** Developed Azure DevOps pipelines running Terraform and PowerShell with automated Active Directory domain join and Azure Key Vault secret management, eliminating over 70% of manual effort and reducing configuration errors to near zero across 5 clients.
>
> **Site:** New session hosts are domain-joined and given their Key Vault secrets by Azure DevOps pipelines running Terraform and PowerShell, not by hand. Across five clients, that removed over 70% of the manual work and brought configuration errors close to zero.

### Claims retired from the current site

These are on today's site but not on the October resume. They are removed unless Mihir re-confirms them in the questionnaire (A7):

- "Cloud Infrastructure Intern" as a separate role, "Apr 2025 – present", "1.5+ years"
- "200+ concurrent users", "3+ client deployments", "monthly AWS spend" as the scope of the 25%
- "Parkar Digital"
- HR chatbot: "in production", "retrieval significantly outperformed keyword search"
- CI/CD: "daily deployments", "fewer rollback incidents"
- Intern: "zero critical incidents"

### Dates and durations

Experience shows "Dec 2024 – present". The site does not print a duration ("1 year and 10 months") because it goes stale. If one is ever needed, it is computed from December 2024 at build time.

### Resume PDF

The site serves Mihir's canonical October resume at `public/MihirBhavsar_Resume.pdf`. The file there today is the July version, which carries the old facts, so Mihir supplies the new PDF in Phase 0. The PDF may contain the phone number (Mihir's choice); the site's HTML never does.

## 6. Information architecture

### Routes

| Route | Mode | Purpose |
|---|---|---|
| `/` | Persuade | The 10-second story, then the evidence |
| `/work/[slug]` | Read | Long-form case study for the deep reader |
| `/MihirBhavsar_Resume.pdf` | — | Static file |
| `not-found` | — | Styled 404 that links home and to work |

`generateStaticParams` builds every case study at build time; `dynamicParams = false` so unknown slugs 404.

### Home, top to bottom

1. **Nav** — Work · Experience · Stack · Credentials · Contact, plus a **Resume** button (direct PDF download). Sticky, with an active-section indicator. Below `md`, links collapse into the existing Radix sheet (no entrance animation). On `/work/*` the links point to `/#section`.
2. **Hero** — name, role, a positioning line of at most 30 words, primary action **View work**, secondary **Download resume**, and email reachable in one click. The positioning line must carry: Azure and AWS, automation (IaC and CI/CD), reliability and monitoring, and applied AI. Beside it: the **estate topology** (rules below).
3. **Proof strip** — six measured outcomes, each with a one-sentence provenance (table below). Phase 1 may drop to five if the layout demands it, but the set must cover all three workload zones.
4. **Selected work** — four case-study cards in the order of section 7. Each shows its lead figure, kind (work or personal project), stack marks, and a link to `/work/[slug]`. A card without a figure shows its pipeline stages instead.
5. **Experience** — one role: Cloud Operations Engineer, Parkar Global Technologies Pvt Ltd, Ahmedabad, Dec 2024 – present. Grouped into the resume's two workstreams (Azure Virtual Desktop; AWS environments), each linking to its case study, plus Linux administration and incident observability.
6. **Stack** — the resume's nine groups, with evidence markers (section 10). No skill bars, percentages, or stars.
7. **Credentials** — five certifications with exam code, issuer, month earned, and verification link (from questionnaire A2; any field not yet provided is simply omitted). Then education and the NCC letter.
8. **GitHub** — the three allowlisted repos with live name, description, language, and last-push date.
9. **Contact** — copy-email button, LinkedIn, GitHub, resume download.
10. **Footer** — name, links, and a colophon line.

### Hero topology — truth rules

The topology draws three **sibling workloads** under one automation and observability control plane. It is not a chain: no edge connects one workload to another, because no data flows between them.

| Zone | Nodes |
|---|---|
| Clients | 5 enterprise clients · 450+ concurrent users — edge to the Azure zone only |
| Azure · Virtual Desktop | Host pools (autoscaling), session hosts with FSLogix profiles, golden images (Azure VM Image Builder), Key Vault, Active Directory domain join; watched by Azure Monitor + Log Analytics (KQL) |
| AWS · Web platform | CloudFront + S3 → Application Load Balancer → EC2 Auto Scaling group (multi-AZ) → RDS; Lambda; watched by CloudWatch alarms and dashboards |
| AI · HR policy assistant | FastAPI → LangChain → FAISS retrieval + Llama inference |
| Control plane | Build and ship: Terraform, PowerShell, Azure DevOps, GitHub Actions, Ansible. Observe: Azure Monitor, CloudWatch, Prometheus + Grafana |

Edges are drawn only where the resume or questionnaire states the relationship:

- **Confirmed:** Terraform, PowerShell and Azure DevOps → Azure; Terraform, Ansible and GitHub Actions → AWS; Azure Monitor → Azure; CloudWatch → AWS.
- **By resume grouping:** Prometheus + Grafana → AWS, because the resume lists that work in its AWS environment section (questionnaire A8 was skipped).
- **Undrawn:** how the AI service is deployed. No control-plane edge reaches the AI zone.

### Proof strip

| Figure | Claim | Provenance (how) | Trace highlights |
|---|---|---|---|
| 40% | faster multi-client AVD deployments, ~8 h → ~5 h | PowerShell provisioning and Image Builder golden images; measured by timing the task before and after (B1) | Golden images, host pools; PowerShell |
| 70%+ | of manual effort removed, configuration errors near zero, across 5 clients | Azure DevOps pipelines running Terraform and PowerShell, with automated domain join and Key Vault secrets | Key Vault, domain join; Azure DevOps, Terraform, PowerShell |
| 25% | lower monthly cloud spend across Azure and AWS | Right-sizing and autoscaling | Azure host pools; AWS Auto Scaling group |
| 450+ | concurrent VDI users supported | FSLogix profiles and AVD autoscaling | Clients → host pools |
| 99.9% | uptime on a multi-AZ WordPress platform | Auto Scaling across availability zones behind a load balancer, with RDS | AWS zone |
| ~60% | faster HR-policy answers | FAISS retrieval feeding Llama inference, replacing manual lookups | AI zone |

Figures that live on cards and case studies only: environment setup under 30 minutes, one-click replication, over 50% faster feature delivery. MTTR reduction is real but has no number, so it appears only as a sentence, never as a figure.

## 7. Case studies

| # | Slug | Working title | Kind | Repo | Lead figure | Material |
|---|---|---|---|---|---|---|
| 1 | `avd-automation` | Automating Azure Virtual Desktop for five enterprise clients | Work | — | 70%+ | Resume + questionnaire B1 (enough to write) |
| 2 | `aws-web-platform` | A multi-AZ AWS platform, built and shipped from code | Work | `Automatic-Deployment` | 99.9% | Resume; B2 open |
| 3 | `hr-policy-assistant` | An HR policy assistant on retrieval-augmented generation | Work | `Rag-Assistant-Chatbot` | ~60% | Resume; B3 open |
| 4 | `devsecops-pipeline` | Security gates in a Jenkins-to-Kubernetes pipeline | Personal project | Open (B4) | — (shows its stages) | Resume; B4 open |

Story 2 groups the resume's AWS workstream: the HA WordPress deployment, Terraform with one-click replication, the Terraform + Ansible + GitHub Actions CI/CD pipeline, and the CloudWatch / Grafana monitoring.

### Ownership on the AVD story (from B1)

Mihir built the end-to-end VM provisioning PowerShell: it creates a VM inside a host pool together with its supporting services. A team of four operates and supports the whole VDI estate, resolving day-to-day VM issues. The cost work was done as a team. The site states this split plainly.

### Page template

The page renders a header from data, then the MDX body. Sections marked *required* always appear. Every other section appears **only when real material exists** and is omitted otherwise, never padded.

1. **Header** (from data, required): title, kind, period, Mihir's role, stack marks, figures with provenance and, where known, how each was measured.
2. **Context** (required): the problem and who it was for.
3. **Constraints**: for the AVD story, one honest line that requirements and sizing were set per client.
4. **Architecture** (required): `<Diagram>` plus a text description of the same topology.
5. **Decisions and trade-offs**: `<Decision chose over because>` blocks.
6. **What I built and what the team did** (required): `<Ownership>` block.
7. **What broke**: for the AVD story, the RDAgent and Boot Loader registration step that kept failing until the missing steps were found and added.
8. **Results** (required): figures with provenance; for the DevSecOps project, what the pipeline does end to end.
9. **What I'd do next**
10. **Pager** — previous and next case study, back to all work.

## 8. Visual direction

This section is a **hypothesis**, not the final design. Phase 1 tests it in impeccable's direction round, and Mihir picks the direction on a decision page before any tokens are written.

**World:** the site reads as the operations console for the estate Mihir actually runs, not a résumé in a dark theme.

Fixed constraints for any direction:

- **Ground:** a blue-tinted near-black, with 3–4 surface steps made by lightness. Surfaces are separated by hairline borders. No glow, no neon, no glassmorphism beyond an optional translucent sticky nav.
- **One accent:** a professional blue, continuing Mihir's earlier navy choice. Teal, violet, and neon green are excluded. The accent marks the primary action, active and focus states, the Trace highlight, and measured figures. Nothing decorative uses it.
- **Technology colours only on technology:** AWS orange on AWS marks, Azure blue on Azure marks, Terraform purple on Terraform, and so on. They are registered in `lib/tech.ts` and are never used as UI colours.
- **Type:** one sans family (display and body) with a real weight range, and one mono for data only (figures with units, dates, diagram labels, exam codes). No mono prose, no terminal windows, no code-editor chrome. Faces are chosen in Phase 1, avoiding overused defaults (Inter as display, Space Grotesk, IBM Plex, DM Sans, and Geist, which reads as a Vercel template). At most two families, self-hosted through `next/font`.
- **Gradient:** one faint atmospheric gradient behind the hero topology, and none anywhere else.
- **Cards:** clean, bordered surfaces with a square-to-small radius. The radius scale is decided in Phase 1 and then applied everywhere.

**Known risk:** "near-black with one blue accent" is where AI-generated sites cluster. The distinctiveness has to come from the real topology, the Trace interaction, and dense, well-set data typography, not from effects. The Phase 1 finish review audits this specifically.

## 9. Interaction and motion

- **Signature interaction — Trace.** Hovering, focusing, or tapping a proof-strip item highlights the nodes and edges in the topology that produced it and shows its provenance sentence. Keyboard: each item is a focusable button; focus triggers the same state as hover. Touch: tap toggles. The topology SVG is `aria-hidden`; the proof strip carries every value in text.
- **One orchestrated moment.** On first load the topology comes up: zones settle, then the control-plane edges draw out to each workload like a rollout. Total ≤ 1.6 s. It then rests and never loops.
- **Everything else is state change only:** nav indicator (spring), hover and focus colour or border shifts (150–250 ms), card arrow nudge, and at most one subtle section reveal (opacity plus ≤ 8 px translate, once). No typewriter, no count-ups, no scroll-jacking, no parallax.
- **Resting state is the default.** Every animated element's final style is its default style, and animations run from a `from` keyframe. With JavaScript off or before hydration, all content is visible. Under `prefers-reduced-motion: reduce`, all animation is cancelled.
- **Implementation:** Framer Motion through `LazyMotion` + `domAnimation` + `m.*` components; plain CSS for simple transitions. Dialogs and sheets stay un-animated (a measured lesson from July 2026).

## 10. Content model

`lib/resume-data.ts` stays the single source of truth for facts on the site, typed by `types/resume.ts`. Its content is rewritten from the October resume under section 5's rules.

| Type | Shape |
|---|---|
| `Experience` | One role with `workstreams: { name, summary, points[], caseStudy? }[]`. |
| `Project` | `slug`, `title`, `kind` (`work` \| `personal`), `period?`, `role`, `repo?: { owner, name }`, `stack: TechId[]`, `figures: Figure[]`, `stages?: string[]` (for cards with no figure). |
| `Figure` | `value`, `label`, `provenance` (required), `measuredHow?` (only when Mihir has said how). |
| `estate` | `zones[]` with nodes, `controlPlane` lanes, `edges[]` (each edge cites its source: `resume` or a questionnaire item id), and `proof[]` (figure + the node and edge ids Trace highlights). |
| `SkillGroup` | The resume's nine groups. Evidence is **derived, not hand-set**: "Used at work" if the skill appears in a work project's `stack` or a workstream; "Used in a project" if it appears only in a personal project; unmarked otherwise. Both markers are named in a key. |
| `Certification` | `name`, `code`, `issuerId` (`aws` \| `microsoft` \| `google`), `earned?`, `verifyUrl?` (tracking parameters such as `?ref=` stripped). |
| `featuredRepos` | `{ owner, name, blurb, demonstrates, contribution? }[]`. `blurb` is the fallback when the API is unavailable or the repo has no description. |
| `lib/tech.ts` | Registry: tech id → display name, brand colour, optional mark path. Used by diagrams, cards, and the stack. |

**MDX:** one file per case study in `content/work/<slug>.mdx`, holding only narrative. Each file exports `export const meta = { slug }`, so no frontmatter plugin is needed. It may import diagram data from `content/work/diagrams/<slug>.ts`. Facts (figures, stack, kind) are never duplicated into MDX; the page reads them from `resume-data`.

## 11. Technical architecture

### Dependencies

| Action | Package | Reason |
|---|---|---|
| Add | `lucide-react` | Interface icons |
| Add | `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx` | Case-study MDX (per `node_modules/next/dist/docs/01-app/02-guides/mdx.md`) |
| Add (dev) | `vitest` | Logic and content-integrity tests |
| Remove | `next-themes` | Dark only |
| Keep | `next` 16.2.10, `react` 19.2.4, `framer-motion`, `radix-ui`, `tailwindcss` v4 | Already in place and working |

### File structure (target)

```
app/
  layout.tsx                 fonts, metadataBase, direction-contract comment, nav, footer, JSON-LD
  page.tsx                   home composition
  globals.css                Tailwind v4 @theme tokens (dark only)
  not-found.tsx
  opengraph-image.tsx        rebuilt in the new world
  sitemap.ts, robots.ts      sitemap gains /work/*
  work/[slug]/page.tsx
  work/[slug]/opengraph-image.tsx
content/work/
  <slug>.mdx                 narrative only
  diagrams/<slug>.ts         diagram data
mdx-components.tsx           maps MDX elements to design-system components
components/
  site/                      site-nav, mobile-nav, site-footer, section
  hero/                      hero, topology, proof-strip, trace-context
  work/                      project-card, case-study-header, decision, ownership, pager
  diagram/                   diagram (svg primitives: group, node, edge, label)
  sections/                  experience, stack, credentials, github-repos, contact
  ui/                        button, tech-mark, copy-email-button, dialog
lib/
  resume-data.ts, site-config.ts, sections.ts, tech.ts, github.ts, work.ts
types/resume.ts
public/tech/                 architecture icon SVGs (licence verified in Phase 2)
tests/                       *.test.ts
```

Removed: `theme-provider.tsx`, `theme-toggle.tsx`, `icons.tsx`, `estate-diagram.tsx`, `estate-sheet.tsx`, `operations-record.tsx`, `project-dialog.tsx`, `pipeline.tsx`. Every other existing component is rewritten into the structure above.

### Rendering

- Everything is a Server Component except these client islands: nav active indicator, mobile nav, Trace (proof strip + topology highlight state), copy-email button, and motion wrappers.
- Diagrams are SVG rendered on the server from data: groups (region, VPC, availability zone, and zone boundaries drawn as dashed containers in the AWS-diagram convention), nodes, edges, and labels. Coordinates are declared per diagram, with no auto-layout. Below `md`, each diagram switches to a stacked, labelled list of the same groups rather than scaling the SVG down.
- Official AWS and Azure Architecture Icon sets supply the node marks, stored as static SVGs in `public/tech/`. If a licence check fails, nodes fall back to neutral marks with text labels.

### GitHub

`lib/github.ts` fetches `GET /repos/{owner}/{name}` for each `featuredRepos` entry with `fetch(url, { next: { revalidate: 3600 } })`. It sends `Authorization` only when `GITHUB_TOKEN` is set (documented in `.env.example`). A fork renders only when its entry has a `contribution` line, and is labelled "Fork of {parent.full_name}". On any error, timeout (3 s), or non-200 response, that repo renders from its curated `blurb` with no live fields, and the section never fails the page build.

### Deployment

The Dockerfile and `output: "standalone"` stay. Hourly revalidation works under `next start` in the container. There is no Vercel-specific configuration yet.

## 12. Quality bars

| Area | Bar |
|---|---|
| Accessibility | WCAG 2.2 AA: text contrast ≥ 4.5:1, non-text ≥ 3:1, targets ≥ 24 px, visible focus ring, skip link, landmarks, full keyboard operation including Trace, `prefers-reduced-motion` honoured, content complete with JavaScript off |
| Performance | Lighthouse mobile ≥ 95 in all four categories on `/` and one `/work/[slug]`; CLS < 0.05; gzipped JS transferred on a cold load of `/` no larger than the current build's (measured in DevTools / Lighthouse; baseline recorded in Phase 0); no image above the fold except inline SVG |
| SEO | Per-route `generateMetadata`; canonical URLs from `siteConfig.url`; OG image per case study; JSON-LD `Person` on home (name, jobTitle, worksFor "Parkar Global Technologies", sameAs, knowsAbout) and `Article` on case studies; sitemap and robots |
| Responsive | Checked at 375, 768, 1024, and 1440 px; no horizontal scroll at any width |
| Browsers | Last two versions of Chrome, Edge, Firefox, and Safari; iOS Safari 16+ |
| Truth | Every figure has a provenance sentence; every topology edge cites its source; no fact exists outside section 5's sources |

## 13. Testing and verification

- **Vitest** (`npm test`):
  - Content integrity: slugs are unique; every project has `content/work/<slug>.mdx`; every figure has non-empty `provenance`; every `estate.proof` id and edge endpoint exists; every edge has a source.
  - Retired claims: none of the section 5 retired strings ("Parkar Digital", "200+", "1.5+ years", "Cloud Infrastructure Intern", "keyword search", "rollback", "daily deployment", "monthly AWS spend", "3+ client") appear under `lib/`, `content/`, `components/`, or `app/`. A string comes off the list only when Mihir re-confirms the claim.
  - Stack evidence: markers are derived from project and workstream data, so a skill can't claim "Used at work" without appearing in work.
  - Privacy: the phone number is not stored in site data at all, and its digits appear in no file under `app/`, `components/`, `lib/`, or `content/`.
  - GitHub: a mocked success merges live fields; mocked 403, 404, network error, and timeout each fall back to the `blurb`; a fork without `contribution` is dropped; a fork with one is labelled with its parent.
- **Type check:** a new `npm run typecheck` script (`tsc --noEmit`).
- **Build and lint:** `npm run lint` and `npm run build` pass with zero errors.
- **Browser:** desktop (1440) and mobile (375) screenshots of every phase's surfaces, in both `npm run dev` and a production build. Driven through Edge headless over CDP, with extensions disabled.
- **Impeccable:** the detector (`detect.mjs`) on changed files, plus the independent finish reviewer at the end of Phase 1 and Phase 5.

## 14. Phases

Each phase gets its own detailed implementation plan (superpowers `writing-plans`), written just before it starts. Phase 2 onwards depends on the direction approved at the Phase 1 gate.

| Phase | Builds | Exit gate |
|---|---|---|
| **0 — Preflight** | Checkpoint commit of the current build on `master`. Create branch `redesign/dark-console`. Record the baseline (gzipped JS on a cold load of `/`, and a Lighthouse mobile run of `/`). Mihir supplies the canonical October resume PDF. Update PRODUCT.md: dark only, no blog, employer name, the October facts in Evidence on Hand, the four stories, stack changes, sources and copy rules. Move the old DESIGN.md to `docs/archive/DESIGN-plotted-sheet.md`. Add Vitest and the `test` and `typecheck` scripts. | Branch exists, baseline recorded, new PDF in `public/`, tests run green |
| **1 — Direction** | Content migration: `types/resume.ts` and `lib/resume-data.ts` rewritten from the October resume, `lib/tech.ts` (brought forward from Phase 3 because the hero needs it), with the content tests. The old section components are removed; until Phases 2–3 the branch's home page shows only the new nav, hero, and proof strip. Then the impeccable direction round (`concept-seed.mjs --scope direction --mode persuade`, decision page, Mihir picks), the direction contract comment in `layout.tsx`, tokens in `globals.css`, fonts, nav and mobile nav, hero, topology, proof strip, Trace, and the load orchestration. | **Mihir reviews the hero on localhost at 1440 and 375 px and approves the direction.** Finish reviewer verdict. DESIGN.md recorded from the approved build. |
| **2 — Work** | MDX setup (`next.config.ts`, `mdx-components.tsx`), `/work/[slug]`, diagram system, four architecture diagrams, case-study components, project cards, experience, and case-study content from the resume and questionnaire. | All four case studies render from real material only; diagrams readable at 375 px; content tests pass |
| **3 — Supporting** | Stack, credentials, `lib/github.ts` and the GitHub section, contact, footer, 404. | Every section uses real data; GitHub fallback tests pass |
| **4 — Quality** | Motion pass, responsive pass, SEO (metadata, OG images, JSON-LD, sitemap), accessibility pass, performance pass. | Every row of section 12 met, with measured numbers shown |
| **5 — Audit** | Impeccable audit and detector, finish reviewer, superpowers code review, lint, type check, tests, build, final DESIGN.md, branch integration decision. | Reviewer verdict "ship"; every check passes with output shown; Mihir approves the merge |

## 15. Risks

| Risk | Mitigation |
|---|---|
| Result looks like the AI-generated dark default | Distinctiveness carried by the real topology and Trace; finish reviewer audits against the direction contract |
| Questionnaire answers for stories 2–4 arrive late | Those pages are built from resume facts first, with only the required sections; optional sections are added as answers arrive. Nothing is invented to fill a gap |
| Stale facts creep back from old files or tailored resumes | The retired-claims test fails the build |
| The October resume PDF isn't supplied | Phase 0's exit gate requires it; the July PDF is never served from the rebuilt site |
| Architecture icon licence terms | Verify in Phase 2; neutral marks with text labels as fallback |
| GitHub API rate limits in the container | Hourly revalidation, optional token, and a static fallback per repo |
| Dev-mode performance differs from production | Measure both, per the July 2026 lesson |

## 16. Workflow

- Commits happen on `redesign/dark-console`, task by task, as each phase's approved plan specifies. Approving a phase plan approves its commits. Nothing is pushed or merged without Mihir's explicit go-ahead.
- Skills per phase: `superpowers:writing-plans` before each phase; `impeccable` new-work flow in Phase 1; `superpowers:test-driven-development` for `lib/` logic; `superpowers:verification-before-completion` before any "done" claim; `superpowers:requesting-code-review` and `superpowers:finishing-a-development-branch` in Phase 5.
