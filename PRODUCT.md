# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences read the same site at two depths, in this priority order:

1. **Technical recruiters and hiring managers (primary).** Screening Mihir for cloud / DevOps / platform engineering roles. They skim for 30–60 seconds, looking for proof he has run real production infrastructure, then decide whether to book a call or forward the resume internally.
2. **Senior engineers on an interview panel (secondary).** They read for depth — architecture decisions, tradeoffs, what he personally built versus supported. They will read a full case study if one exists.

The site must survive the fast skim and reward the deep read without forcing either audience through the other's path.

## Product Purpose

A personal portfolio for Mihir Bhavsar that converts a cold screen into a conversation. Success is defined by four outcomes the user named together, all of which must hold:

- the visitor emails or books a call;
- the visitor downloads the resume PDF and can forward it;
- the visitor believes the metrics are real engineering outcomes, not resume inflation;
- the visitor remembers this candidate over the other 40 in the pipeline.

## Positioning

Cloud operations engineer working at the seam of **enterprise infrastructure and applied AI** — someone who runs Azure Virtual Desktop estates for real enterprise clients *and* ships a retrieval-augmented LLM service into production at the same company. Neither a pure infra engineer nor a pure ML engineer. Every claim on the site is attached to a measured number from work actually performed.

## Operating Context

- Evaluation happens in a browser tab open beside a resume PDF and an ATS, often on mobile, often mid-triage against many other candidates.
- The resume PDF (`public/MihirBhavsar_Resume.pdf`) is a real artifact that must stay one click away — it is the handoff object that travels inside the hiring company.
- Contact happens via email and LinkedIn; there is no booking system, CRM, or backend of any kind. The site is statically rendered with no server-side form handling.

## Capabilities and Constraints

- **Stack (incumbent, not up for renegotiation):** Next.js 16.2.10 App Router, React 19.2.4, TypeScript, Tailwind CSS v4 (CSS-first `@theme` config), `next-themes` for light/dark, `framer-motion`, Radix UI primitives. Deployed via a Dockerfile; `NEXT_PUBLIC_SITE_URL` configures canonical URL.
- All content lives in a single source of truth, `lib/resume-data.ts`, typed by `types/resume.ts`. Any structural change must keep that pattern.
- Light and dark themes are both first-class and must both be complete.
- No backend, no database, no auth, no analytics currently wired.
- Phone number is stored in content but deliberately not rendered publicly.

## Brand Commitments

- Name and identity: Mihir Bhavsar. No logo exists.
- Voice: plain, measured, specific. Numbers carry the persuasion; the prose does not oversell. Existing copy in `lib/resume-data.ts` is confirmed factual and written in this voice.
- Visual constraint carried from prior sessions and confirmed by the incumbent build: conservative and corporate-professional. Navy / grey / white family. Terminal, code-editor, and "hacker" motifs are explicitly rejected. Teal is rejected.

## Evidence on Hand

Real and available:

- Employment: Cloud Operations Engineer at Parkar Digital, Ahmedabad (Apr 2025 – present); Cloud Infrastructure Intern at the same company (Dec 2024 – Apr 2025).
- Measured outcomes: 25% monthly AWS spend reduction, 70%+ manual effort eliminated across a 5-client estate, 200+ concurrent VDI users, 99.9% uptime on the multi-AZ WordPress architecture, provisioning time cut 40% (~8h → ~5h), ~60% faster HR-policy query resolution, environment setup days → under 30 minutes, >50% faster feature delivery.
- Three projects with written problem / approach / impact case studies: AI-Powered HR Policy Chatbot (in production), AWS High-Availability WordPress, Automated CI/CD Pipeline.
- Five certifications: AWS SAA-C03, AWS CLF-C02, AZ-900, AI-900, Google Cloud Digital Leader.
- Education: B.E. CSE, M. S. University of Baroda (2022–2025, 73.31%); Diploma, GTU (2019–2022, CGPA 8.89).
- Achievement: NCC 2019–2022, Letter of Appreciation from Admiral Karambir Singh.
- Resume PDF at `public/MihirBhavsar_Resume.pdf`.
- User states screenshots / architecture diagrams and cert badges + company logos are obtainable. **None are in the repository yet** (`public/` contains only the resume PDF), so the build must render correctly without them and leave documented slots for real files.

Explicitly absent — must never be fabricated:

- No headshot or photograph of Mihir.
- No testimonials, quotes, references, or endorsements.
- No client names beyond Parkar Digital; the five-client estate is anonymous.
- No public live URLs or demos for any project; project links point to the GitHub profile, not to individual repositories.
- No press, awards (beyond the NCC letter), or third-party validation.

## Product Principles

1. **Every claim carries its number, and every number carries its provenance.** A metric without the sentence explaining how it was achieved is resume inflation; the site's credibility depends on the pairing being inseparable.
2. **Two reading depths, one page.** The recruiter's 45-second path and the engineer's deep read are both designed paths, not the same content at different scroll positions.
3. **Infrastructure and AI are one story, not two sections.** The positioning only holds if the site presents them as a single competence.
4. **Never fabricate evidence.** Missing assets are designed around or left as documented slots — never invented, mocked as real, or implied.
5. **Conservative in register, uncompromising in craft.** The restraint is a deliberate professional posture, not a license for a default-looking template.

## Accessibility & Inclusion

Recruiters screen on mobile and on locked-down corporate machines. Targets: WCAG 2.2 AA contrast in both themes, full keyboard operability, honored `prefers-reduced-motion`, and complete content without JavaScript-dependent reveals hiding it.
