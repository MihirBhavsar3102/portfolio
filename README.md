# Mihir Bhavsar — Portfolio

Personal portfolio for a Cloud & DevOps engineer. Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion. Fully static — every route is prerendered at build time.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all routes static)
```

## Where things live

| Path | Purpose |
| --- | --- |
| `lib/resume-data.ts` | **All site content.** Roles, bullets, projects, skills, links — edit here, nothing else. |
| `lib/site-config.ts` | Site title, description, canonical URL |
| `types/resume.ts` | Types for the content model |
| `app/layout.tsx` | Fonts (Schibsted Grotesk / Inter), metadata, theme provider |
| `app/globals.css` | Design tokens — the light/dark palette lives here as CSS variables |
| `components/` | One component per section |

## Before deploying — one manual step

1. **Site URL** — set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) in Vercel project settings to your real domain so Open Graph tags, sitemap, and robots.txt emit correct absolute URLs.

`public/MihirBhavsar_Resume.pdf` is a generated copy of the resume content — replace it with your own export whenever you update your resume; the download buttons point at that exact path.

## Deploy on Vercel

Push this repo to GitHub, import it in Vercel — no configuration needed. Every route builds as static content, and the Open Graph image (`/opengraph-image`) is generated at build time.

## Updating project links

The three project cards currently link to the GitHub profile. When repos go public, replace each `link.href` in `lib/resume-data.ts` — the card supports any label/URL pair (live demo, case study, repo).

## Design notes

- Palette: white / soft grey-blue section backgrounds with slate text and a single deep navy accent (`#0F4C81` light, muted steel blue `#7FB0E0` dark); all emphasis goes through the accent, everything else stays neutral.
- Type: Schibsted Grotesk for headings, Inter for body text.
- Motion system: a typewriter cycles the hero's role titles ([components/typewriter.tsx](components/typewriter.tsx)), hero stats count up on scroll ([components/stat-counter.tsx](components/stat-counter.tsx)), a scroll-progress bar tracks reading position ([components/scroll-progress.tsx](components/scroll-progress.tsx)), the nav has a sliding active-section indicator, and the experience timeline's connecting line draws in on scroll ([components/timeline-connector.tsx](components/timeline-connector.tsx)). All of it is orchestrated, not scattered — one hero load sequence, one motion idiom per section.
- Reduced motion is respected everywhere: reveals, the typewriter, counters, and the timeline line all render at their final state statically instead of animating.
