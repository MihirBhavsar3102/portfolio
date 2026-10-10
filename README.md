# Mihir Bhavsar — Portfolio

Personal portfolio for a Cloud & DevOps engineer. Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion, and Radix UI primitives. Fully static — every route is prerendered at build time.

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
| `app/globals.css` | Design tokens — the light/dark palette lives here as CSS variables, plus the Radix open/close keyframes |
| `components/` | One component per section |
| `components/ui/` | Styled Radix wrappers (`dialog`, `tooltip`) — only the primitives used more than once live here |
| `lib/sections.ts` | Nav targets, shared by the desktop nav and mobile menu |

## Before deploying — one manual step

1. **Site URL** — set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) in Vercel project settings to your real domain so Open Graph tags, sitemap, and robots.txt emit correct absolute URLs.

`public/MihirBhavsar_Resume.pdf` is a generated copy of the resume content — replace it with your own export whenever you update your resume; the download buttons point at that exact path.

## Deploy on Vercel

Push this repo to GitHub, import it in Vercel — no configuration needed. Every route builds as static content, and the Open Graph image (`/opengraph-image`) is generated at build time.

## Updating project links

The three project cards currently link to the GitHub profile. When repos go public, replace each `link.href` in `lib/resume-data.ts` — the card supports any label/URL pair (live demo, case study, repo).

## Interactive components (Radix UI)

Built on the unified `radix-ui` package, which supplies focus management, keyboard behaviour, and ARIA wiring:

| Where | Primitive | What it does |
| --- | --- | --- |
| Projects | `Dialog` | The card opens a case-study modal. The repo link lives inside the modal, so the card is a single button rather than a link nested in a button. |
| Skills | `Tabs` | Defaults to "All" so nothing is hidden on arrival; arrow keys move between categories. |
| Header | `Dialog` | Mobile slide-in menu — below `md` there is no other navigation. |
| Header | `DropdownMenu` | Light / Dark / System, which a binary toggle cannot express. |
| Hero | `Tooltip` | Explains where each headline number comes from. Triggers are real buttons, so keyboard users reach them. |
| Contact | `Toast` | Confirms the email copy, and names the specific failure if the browser blocks clipboard access. |

The small popups (menu, tooltip, toast) animate via CSS keyframes keyed on Radix's `data-state` attributes — see `app/globals.css`. Radix keeps an element mounted until its animation finishes, so exit animations need no `forceMount` or `AnimatePresence`. Framer Motion still drives scroll reveals and the sliding indicators.

**The dialog and mobile sheet open instantly, on purpose — don't add an entrance animation back.** Radix's `Presence` calls `getComputedStyle()` on animated nodes to know when it may unmount; on a subtree this large those forced style recalculations measured ~330ms under CPU throttling and made opening feel laggy. Removing the animation took repeated opens from ~60ms of blocked main thread every time to zero in a production build. Two related traps, both measured and both reverted once: `scrollbar-gutter: stable` on `html` double-compensates with Radix's scroll lock and *introduces* a ~7px content shift, and `will-change` on the panel pins a compositor layer that changes how its text rasterizes. Focus is deferred a frame and uses `preventScroll` because `scroll-behavior` is smooth globally, so a focus-driven scroll becomes an animated page slide.

## Design notes

- Palette: white / soft grey-blue section backgrounds with slate text and a single deep navy accent (`#0F4C81` light, muted steel blue `#7FB0E0` dark); all emphasis goes through the accent, everything else stays neutral.
- Type: Schibsted Grotesk for headings, Inter for body text.
- Motion system: a typewriter cycles the hero's role titles ([components/typewriter.tsx](components/typewriter.tsx)), hero stats count up on scroll ([components/stat-counter.tsx](components/stat-counter.tsx)), a scroll-progress bar tracks reading position ([components/scroll-progress.tsx](components/scroll-progress.tsx)), the nav has a sliding active-section indicator, and the experience timeline's connecting line draws in on scroll ([components/timeline-connector.tsx](components/timeline-connector.tsx)). All of it is orchestrated, not scattered — one hero load sequence, one motion idiom per section.
- Reduced motion is respected everywhere: reveals, the typewriter, counters, and the timeline line all render at their final state statically instead of animating.
