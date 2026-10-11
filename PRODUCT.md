# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences read the same site at different depths, in this priority order:

1. **Technical recruiters and hiring managers (primary).** Screening Mihir for cloud, DevOps, and platform engineering roles. They skim for 30–60 seconds, looking for proof he has run real production infrastructure, then decide whether to email him or forward the resume internally.
2. **DevOps/SRE leads and cloud architects.** They check whether the infrastructure, automation, and reliability work is real and how deep it goes: what was automated, what is monitored, what the numbers mean.
3. **Senior engineers on an interview panel.** They read for depth — architecture, trade-offs, what he personally built versus what the team did. They will read a full case study if one exists.

The site must survive the fast skim and reward the deep read without forcing either audience through the other's path.

## Product Purpose

A personal portfolio for Mihir Bhavsar that converts a cold screen into a conversation. Success is defined by four outcomes, all of which must hold:

- the visitor emails him or connects on LinkedIn;
- the visitor downloads the resume PDF and can forward it;
- the visitor believes the metrics are real engineering outcomes, not resume inflation;
- the visitor remembers this candidate over the other 40 in the pipeline.

## Positioning

Cloud & DevOps engineer at Parkar Global Technologies (December 2024 – present) who automates how Azure and AWS infrastructure is built, shipped, and monitored — infrastructure as code, CI/CD, and observability — and who also built an applied-AI (retrieval-augmented) HR policy assistant at the same company. Infrastructure, automation, reliability, and applied AI are one competence, not four sections. Every claim on the site is attached to a measured number or a concrete mechanism from work actually performed.

## Operating Context

- Evaluation happens in a browser tab open beside a resume PDF and an ATS, often on mobile, often mid-triage against many other candidates.
- The resume PDF (`public/MihirBhavsar_Resume.pdf`) is the handoff object that travels inside the hiring company and must stay one click away. It must be the October 2026 resume.
- Contact happens via email and LinkedIn; there is no booking link, CRM, or backend of any kind. The site is statically rendered with no server-side form handling.

## Capabilities and Constraints

- **Stack:** Next.js 16.2.10 App Router, React 19.2.4, TypeScript, Tailwind CSS v4 (CSS-first `@theme` config), `framer-motion` (via `LazyMotion`), Radix UI primitives, `lucide-react` for interface icons, MDX for case studies, Vitest for logic and content tests. Deployed via a Dockerfile (`output: "standalone"`); `NEXT_PUBLIC_SITE_URL` configures the canonical URL. Vercel later, not now.
- **Light and dark themes**, both first-class, with a toggle in the nav. The visitor's system setting picks the first theme and a chosen one is remembered; with JavaScript off the system setting still applies (decided 2026-10-11, replacing "dark only").
- **No blog** in this rebuild.
- All facts live in `lib/resume-data.ts`, typed by `types/resume.ts`; long-form case-study narrative lives in MDX. Content tests guard both.
- No backend, no database, no auth, no analytics.
- The phone number is not stored in site data and never rendered (it appears only in the PDF, by Mihir's choice).

## Content Sources

- Facts come only from Mihir's October 2026 resume and his questionnaire answers (`docs/superpowers/specs/2026-09-27-case-study-questionnaire.md`).
- Website copy is paraphrased for the web — outcome first, plain verbs, the same facts and numbers with their exact qualifiers — never copied verbatim from the resume.
- The job-tailored resume variants in Mihir's Downloads folder disagree with each other and are never a source.

## Brand Commitments

- Name and identity: Mihir Bhavsar. No logo exists.
- Employer name: "Parkar Global Technologies"; the legal name "Parkar Global Technologies Pvt Ltd" appears once, in the experience entry.
- Voice: plain, measured, specific. Numbers carry the persuasion; the prose does not oversell.
- Visual register: premium, minimal and plainly professional, "Linear × Apple" in feel: big confident type, one idea per screen, generous space. One persimmon accent for action and the lit path; colour beyond it only where it names a cloud (the work cards) or marks a technology (its brand dot). Neon, glow, glassmorphism, gradient text, Matrix rain, terminal windows, code-editor chrome, and hacker motifs are explicitly rejected. Motion is restrained and orchestrated, never scattered (direction chosen 2026-10-11 from live previews: "Statement").

## Evidence on Hand

Real and available (October 2026 resume):

- **Role:** Cloud Operations Engineer, Parkar Global Technologies Pvt Ltd, Ahmedabad, December 2024 – present (one role).
- **Azure Virtual Desktop, five enterprise clients:** PowerShell provisioning and Azure VM Image Builder golden images made multi-client deployments 40% faster (~8 h → ~5 h); Azure DevOps pipelines running Terraform and PowerShell with automated domain join and Key Vault secrets removed over 70% of manual effort and brought configuration errors near zero; FSLogix profiles and AVD autoscaling for 450+ concurrent users; right-sizing and autoscaling cut monthly cloud spend 25% across Azure and AWS; Azure Monitor and Log Analytics (KQL) observability reduced MTTR (no figure). Mihir built the end-to-end VM provisioning PowerShell; a team of four runs the estate. AVD numbers were measured by timing tasks before and after automation.
- **AWS web platform:** fault-tolerant multi-AZ WordPress (EC2 Auto Scaling, ALB, RDS, Lambda, S3, CloudFront) at 99.9% uptime; Terraform plan/apply with environment setup under 30 minutes and one-step replication; CI/CD with Terraform, Ansible, and GitHub Actions making feature delivery over 50% faster; Grafana dashboards and alert rules on an existing Prometheus stack, plus CloudWatch alarms and dashboards.
- **Linux administration:** access and permissions, OS patching, web/app server setup, service troubleshooting.
- **HR policy assistant (RAG):** FAISS retrieval and Llama inference with LangChain behind FastAPI; ~60% faster HR policy query resolution, replacing manual lookups. Public repo `Rag-Assistant-Chatbot`.
- **DevSecOps CI/CD pipeline (personal project):** Jenkins with SonarQube, OWASP Dependency-Check, and Trivy gates; Docker, Maven, GitHub webhooks; deploys a three-tier Java app to self-managed Kubernetes.
- **Certifications:** AWS Solutions Architect – Associate (SAA-C03, Jun 2025), AWS Cloud Practitioner (CLF-C02, Mar 2025), Azure Fundamentals (AZ-900, Jun 2025), Azure AI Fundamentals (AI-900, Apr 2026), Google Cloud Digital Leader (date not yet supplied); verification links for the first four.
- **Education:** B.E. CSE, The Maharaja Sayajirao University of Baroda (2022–2025, 73.31%); Diploma in Computer Engineering, GTU (2019–2022, CGPA 8.89).
- **Achievement:** NCC 2019–2022, Letter of Appreciation from Admiral Karambir Singh, former Chief of the Naval Staff.
- **Public repos to feature:** `Rag-Assistant-Chatbot`, `Automatic-Deployment` (the AWS platform's CI/CD). `Natural-Language-to-Robot-Framework` is a fork and appears only once Mihir supplies his contribution line.

Explicitly absent — must never be fabricated:

- No headshot or photograph of Mihir.
- No testimonials, quotes, references, or endorsements.
- No client names; the five-client estate is anonymous.
- No public live URLs or demos.
- No MTTR figure; no claim that the HR assistant is "in production"; no claim that its retrieval beat keyword search; no daily-deployment or rollback claims.
- No press, awards (beyond the NCC letter), or third-party validation.

## Product Principles

1. **Every claim carries its number, and every number carries its provenance.** A metric without the sentence explaining how it was achieved is resume inflation; the site's credibility depends on the pairing being inseparable.
2. **Two reading depths, one site.** The recruiter's 45-second path and the engineer's deep read are both designed paths, not the same content at different scroll positions.
3. **Infrastructure, automation, reliability, and AI are one story.** The positioning only holds if the site presents them as a single competence.
4. **Never fabricate evidence.** Missing assets and unanswered questions are designed around or left out — never invented, mocked as real, or implied. A diagram draws a connection only where the source states it.
5. **Premium in register, uncompromising in craft.** The restraint is a deliberate professional posture, not a license for a default-looking template.

## Accessibility & Inclusion

Recruiters screen on mobile and on locked-down corporate machines. Targets: WCAG 2.2 AA contrast, full keyboard operability, honoured `prefers-reduced-motion`, and complete content without JavaScript-dependent reveals hiding it.
