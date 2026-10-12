# Mihir Bhavsar — Portfolio

The personal site of a Cloud & DevOps engineer. It's written like a product launch page: one idea per screen, big type, and every number attached to how it was achieved. There are light and dark themes, a service map that lights up whatever produced each figure, and four case studies with server-rendered architecture diagrams.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Radix UI primitives, lucide-react, and MDX for the case studies. Motion is plain CSS. Tests run on Vitest, plus a headless-browser verifier.

## Run locally

```bash
npm install
npm run dev        # development server
npm run build      # production build
npm start          # serve the production build
```

## Check it

```bash
npm test           # Vitest: content integrity, claims, contrast, SEO, components
npm run typecheck  # tsc --noEmit
npx eslint .
node scripts/verify-ui.mjs http://localhost:3000 ./out prod   # browser checks against a running server
```

`scripts/verify-ui.mjs` drives Microsoft Edge headless over the Chrome DevTools Protocol, with no dependencies. It expects Edge at its default Windows install path. It checks the Trace, keyboard reach and focus, themes, responsive widths, reduced motion, JavaScript-off content, metadata, and more, and saves screenshots to the output folder.

## Where things live

| Path | What it holds |
| --- | --- |
| [lib/resume-data.ts](lib/resume-data.ts) | **The site's data:** roles, figures with their provenance, projects, skills, credentials, links. The case-study narrative is in `content/work/`. |
| [types/resume.ts](types/resume.ts) | The content model |
| [content/work/](content/work/) | Case-study narrative in MDX (no figures; those come from `resume-data`), and each diagram's data |
| [app/](app/) | Routes: the home page, `/work/[slug]`, share images, the sitemap, robots and the 404 |
| [app/globals.css](app/globals.css) | Design tokens for both themes, the map's draw-in, the Trace dimming |
| [components/](components/) | `site/` chrome, `hero/` (figures, map, Trace), `sections/`, `work/`, `diagram/`, `og/` share cards, `ui/` |
| [lib/](lib/) | Logic: the Trace, stack evidence, GitHub fetch with fallbacks, SEO and JSON-LD, the theme script |
| [tests/](tests/) | Unit and render tests, including the guards that keep retired or unsourced claims out of the copy |
| [DESIGN.md](DESIGN.md) | The visual system: tokens, type, components and rules |
| [PRODUCT.md](PRODUCT.md) | Who the site is for and what it must prove |

## Content rules

- Facts come from the resume only, paraphrased for the web.
- Every figure carries a provenance sentence, shown wherever the figure is.
- `npm test` fails if a retired claim reappears, or if the phone number appears anywhere in the source.

## Deploy

The site builds to a standalone Node server (`output: "standalone"`) with the [Dockerfile](Dockerfile). The container listens on port 3001.

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.example -t portfolio .
docker run -p 3001:3001 -e GITHUB_TOKEN=... portfolio
```

- **`NEXT_PUBLIC_SITE_URL` is required for a real deploy.** It's inlined at build time and used for canonical URLs, Open Graph tags, JSON-LD, the sitemap and robots.txt. Without it they point at `http://localhost:3001`. See [.env.example](.env.example).
- **`GITHUB_TOKEN` is optional.** It's read when the home page is built and on each hourly refresh, and it raises the rate limit for the GitHub section's live repo details. Without it, or whenever GitHub is unavailable, the section shows its curated descriptions.

`public/MihirBhavsar_Resume.pdf` is the resume the download links serve. Replace it at that path to update it.

## Fonts

Schibsted Grotesk and Fragment Mono load through `next/font`. The share cards use static Schibsted Grotesk files in [assets/fonts/](assets/fonts/), under the SIL Open Font License ([OFL.txt](assets/fonts/OFL.txt)).
