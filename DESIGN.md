---
name: Mihir Bhavsar — Statement
description: An engineer's portfolio set like a product launch page, every number attached to how it was achieved, in light and dark.
colors:
  persimmon: "#b93b0a"
  persimmon-dark: "#fb7a3c"
  persimmon-ink: "#ffffff"
  persimmon-ink-dark: "#1c0800"
  persimmon-wash: "rgb(185 59 10 / 0.08)"
  persimmon-wash-dark: "rgb(251 122 60 / 0.14)"
  azure-signal: "#0b6bcb"
  azure-signal-dark: "#4ea1f0"
  aws-amber: "#8a5c00"
  aws-amber-dark: "#f2b33d"
  applied-ai-green: "#12703a"
  applied-ai-green-dark: "#4cc38a"
  canvas: "#ffffff"
  canvas-dark: "#0a0a0a"
  surface-1: "#f7f7f6"
  surface-1-dark: "#121212"
  surface-2: "#f0f0ef"
  surface-2-dark: "#181818"
  surface-3: "#e7e7e5"
  surface-3-dark: "#1f1f1f"
  line: "#e9e9e7"
  line-dark: "#232323"
  line-strong: "#d5d5d2"
  line-strong-dark: "#303030"
  line-graphic: "#86878b"
  line-graphic-dark: "#686866"
  ink: "#0a0a0b"
  ink-dark: "#f4f4f3"
  ink-2: "#47484c"
  ink-2-dark: "#a9a9a6"
  ink-3: "#68696e"
  ink-3-dark: "#858582"
typography:
  display:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 9vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
  statement:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.375rem)"
    fontWeight: 500
    lineHeight: 1.22
    letterSpacing: "-0.02em"
  figure:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(4rem, 7vw, 5.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
  figure-ledger:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
  figure-card:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  prose-heading:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.04em"
  lede:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.625
  prose:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  small:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  nav:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  label:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
  mono-display:
    fontFamily: "Fragment Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "clamp(1.125rem, 2.6vw, 2rem)"
    fontWeight: 400
  mono:
    fontFamily: "Fragment Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "13px"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  pill: "999px"
spacing:
  gutter: "20px"
  gutter-sm: "40px"
  measure: "76rem"
  section-y: "96px"
  section-y-lg: "112px"
  heading-gap: "56px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  text-action:
    textColor: "{colors.persimmon}"
    typography: "{typography.body}"
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-2}"
    typography: "{typography.nav}"
    height: "56px"
  figure-chip:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-2}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  figure-chip-active:
    backgroundColor: "{colors.persimmon-wash}"
    textColor: "{colors.persimmon}"
  project-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "32px"
  skill-chip-work:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
  skill-chip-project:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-2}"
    typography: "{typography.small}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
  skill-chip:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-3}"
    typography: "{typography.small}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
  panel:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "16px 20px"
  map-band:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
  trace-hint:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-2}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
  nav-monogram:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    size: "28px"
  hero-preview-lane:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
    rounded: "{rounded.2xl}"
    padding: "16px"
  hero-preview-tool-lit:
    backgroundColor: "{colors.persimmon-wash}"
    textColor: "{colors.persimmon}"
    rounded: "{rounded.pill}"
  theme-toggle:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    size: "36px"
  pager-cell:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    padding: "24px"
---

# Design System: Mihir Bhavsar — Statement

## Overview

**Creative North Star: "The Statement"**

The site reads like a product launch page for an engineer: one idea per screen, set in big, confident, tightly tracked type, with nothing on the page that is not content. Screen one is who and what: the name, the role, and one crisp positioning line whose last word rolls through built, shipped and monitored, while the estate in miniature beside it plays the same three steps; under the buttons, two proof lines name the AWS certification and the current role, the facts a recruiter screens for. Screen two proves it, with six measured figures at display size, each attached to the sentence that says how it was achieved. Screen three shows how the estate fits together, and any figure lights the infrastructure that produced it. The rest of the page keeps the same grammar: a statement heading, a short intro, then the evidence.

The palette is pure white or pure black with near-black or near-white ink, in two first-class themes. A single persimmon accent marks what you can act on and what is lit, and colour beyond that appears only where it names something: the cloud a case study ran on, or a technology's brand dot. Depth is quiet: one tinted band behind the map, tinted cards for the work, and hairlines. Motion is one story and two entrances. The story is the hero's: every 3.2s the positioning line's last word rolls up to the next verb and the estate preview lights that step (tools and parts, then packets down to the workloads, then monitoring); it runs only while the hero is on screen and the tab is visible. The entrances each play once: the map settling and its edges drawing when it first scrolls into view, and one section reveal, where Selected work (the case-study cards, the page's product shots) fades up 8px over 700ms (ease-out-expo) as it arrives, if it started off screen. Neither entrance plays on case studies, in print, under reduced motion, or for anything already on screen when the page loads; under reduced motion, in print and without JavaScript the hero rests, its line read as one sentence. Everything else is a colour change or a 2px lift on hover.

The register follows PRODUCT.md: premium and plainly professional, "Linear × Apple" in feel. Neon, glow, glassmorphism, gradient text, terminal windows, code-editor chrome and hacker motifs are rejected, as are eyebrow labels and boxed dashboard panels as the page structure.

**Key Characteristics:**
- Light and dark, both first-class. The visitor's system setting picks the first; a nav toggle switches and is remembered.
- One persimmon accent for action, focus and the lit path; ink-filled pill buttons.
- Schibsted Grotesk from 13px nav to 96px name; Fragment Mono only for the literal email.
- One idea per screen; full-bleed hairlines between sections on a 76rem measure.
- Cloud colours tint the work cards; brand colours appear only as small dots.
- The hero's story (the rolling verb and the lit preview, paused off screen) and two once-only entrances (the map's draw, the section reveal); everything else is state change, and reduced motion cancels it all.

## Colors

Achromatic grounds and ink in two themes, one warm persimmon accent, and three cloud colours that only ever mean "this ran on Azure, AWS or the AI stack".

### Primary
- **Persimmon** (light `#b93b0a`, dark `#fb7a3c`): text actions ("Email me", the nav Resume link, the large contact address), the focus outline, the selected figure chip, a lit figure, lit map nodes and edges, and the text selection tint (24%). On white it is 5.7:1; on the map band's active chip wash it is 4.9:1.
- **Persimmon Ink** (light `#ffffff`, dark `#1c0800`): text on a persimmon fill, which the shipped UI does not use at rest; kept for the token pair.
- **Persimmon Wash** (8% light, 14% dark): the fill of a selected figure chip and of a lit map node. A state colour only.

### Secondary
- **Azure Signal** (light `#0b6bcb`, dark `#4ea1f0`), **AWS Amber** (light `#8a5c00`, dark `#f2b33d`), **Applied-AI Green** (light `#12703a`, dark `#4cc38a`): the cloud a case study ran on. Each tints its work card (6% into Surface One for the fill, 22% into Hairline for the border, 45% on hover) and colours the card's "where" label and dot. An Experience workstream takes the same colour as the 8px dot beside its name. The light values clear 4.5:1 on their tinted card.

### Neutral
- **Canvas** (light `#ffffff`, dark `#0a0a0a`): the page, the nav at 85%, the trace hint, map nodes "cut into" their zones, stage chips.
- **Surface One** (light `#f7f7f6`, dark `#121212`): the "How it fits together" band, the stack and credential panels, the facts panel, ownership columns, pager cells, diagram frames, the base the work cards are tinted from.
- **Surface Two** (light `#f0f0ef`, dark `#181818`): hover fills (toggle, pager, ghost controls), map bands and zones, the toast.
- **Surface Three** (light `#e7e7e5`, dark `#1f1f1f`): the fill of a "used at work" skill chip, and nothing else. Small Ink Three text never sits on it.
- **Hairline** (light `#e9e9e7`, dark `#232323`): section rules, panel borders, row dividers.
- **Strong Hairline** (light `#d5d5d2`, dark `#303030`): chip borders, map and diagram node strokes, the trace hint border, link underlines at rest.
- **Graphic Line** (light `#86878b`, dark `#686866`): the strokes a reader needs to read a drawing, the map’s control edges and a diagram’s dashed group outlines. Clears 3:1 on Canvas, Surface One and Surface Two. Node boxes and the map’s zone panels keep their hairlines; their labels identify them.
- **Ink** (light `#0a0a0b`, dark `#f4f4f3`): names, headings, figures at rest, the primary button fill.
- **Ink Two** (light `#47484c`, dark `#a9a9a6`): intros, provenance, summaries, prose, nav links.
- **Ink Three** (light `#68696e`, dark `#858582`): metadata, "how measured" asides, card provenance lines, periods, labels.

### Named Rules
**The One Persimmon Rule.** Persimmon is the only interface colour. It marks a text action, focus, a selection or a lit path, and nothing decorative. Buttons are ink, not persimmon.

**The Cloud Means Something Rule.** Azure blue, AWS amber and AI green appear only where they name where work ran (the work cards, and the dot beside an Experience workstream's name). They are never used for emphasis, charts or decoration.

**The Marks Only Rule.** Technology brand colours (lib/tech.ts) render only as a 6–7px dot beside that technology's name; a brand with no usable colour gets an Ink Three dot.

**The Two Themes Rule.** Every colour is a token with a light and a dark value; nothing is hard-coded to one theme. With JavaScript off, the system setting chooses through `prefers-color-scheme`.

**The AA Floor Rule.** Every text pairing clears 4.5:1 in both themes; small Ink Three text never goes on Surface Three. Strokes a reader needs (edges, group outlines) clear 3:1 (Graphic Line or Ink Three). `tests/contrast.test.ts` holds every pairing, card tints included.

## Typography

**Display Font:** Schibsted Grotesk (with ui-sans-serif, system-ui)
**Body Font:** Schibsted Grotesk
**Label/Mono Font:** Fragment Mono 400, for the literal email address only

**Character:** One sturdy newspaper grotesk does all the talking, heavy and tight at the top of the scale so headings read as statements, plain and open in the body. Numerals are proportional: Schibsted's tabular set widens the comma and full stop.

### Hierarchy
- **Display** (700, clamp(3.5rem, 9vw, 6rem), 0.92, -0.04em): the name. One per page. From lg, where it shares the screen with the preview, clamp(3.5rem, 6.8vw, 6rem), so it holds one line at 1024.
- **Headline** (700, clamp(2.5rem, 5.5vw, 4.25rem), 1.0, -0.04em): every home section heading ("Measured outcomes", "How it fits together", "Let's talk."). Case-study h1 uses the same voice at clamp(2.5rem, 5vw, 4rem); the 404 at clamp(3rem, 7vw, 5rem).
- **Statement** (500, clamp(1.5rem, 3vw, 2.375rem), 1.22, -0.02em, max 25ch): the positioning line in the hero, its lead in Ink Two and its verbs in Ink at 600.
- **Figure** (700, clamp(4rem, 7vw, 5.75rem), 1.0, -0.04em): the six outcomes. 3.25rem in a case study's ledger, 2.75rem on a work card.
- **Title** (600, 1.625rem, -0.02em): work card titles; experience role 1.5rem, workstream names 1.25rem, credential panel titles 1.125rem.
- **Prose heading** (700, 2rem, -0.04em): case-study MDX h2s.
- **Lede** (400, 1.25rem, 1.625, max 56ch, Ink Two): section intros and case-study summaries; the role line in the hero runs 500 at clamp(1.25rem, 2.2vw, 1.75rem), clamp(1.125rem, 1.7vw, 1.5rem) from lg so it keeps one line beside the preview.
- **Prose** (400, 17px, 1.7, max 68ch, Ink Two): case-study MDX paragraphs and lists.
- **Body** (400, 15px, 1.625): provenance, summaries, points, buttons (600).
- **Small / Nav / Label** (14px, 13px, 12px): chips, nav links, metadata.
- **Mono** (Fragment Mono 400): the contact address at clamp(1.125rem, 2.6vw, 2rem) from sm and clamp(1rem, 4.3vw, 1.125rem) below it (so the copy button stays on its line), and 13px inside the menu's copy control.

### Named Rules
**The Statement Scale Rule.** Hierarchy comes from scale and weight, never from colour or an eyebrow. A heading speaks for itself at Headline size; nothing sits above it.

**The Proportional Figures Rule.** Figures use proportional numerals and the face's own weight; never a separate numeric face, never tabular punctuation.

**The Mono Is Data Rule.** Fragment Mono is reserved for the literal email address.

## Layout

One centred measure (`76rem`) with 20px gutters, 40px from sm, shared by the nav, every section and the footer. The sticky nav is 56px; anchor scroll is offset 80px.

The home page paces one idea per screen. The hero fills the first screen (min(100svh − 56px, 56rem)), vertically centred and left-aligned; from lg it splits into the copy and the estate preview (27rem, 30rem from xl). Below lg the hero is text only. Every following section opens on a full-bleed hairline and sits at 96px vertical padding (112px from lg), its heading 56–64px above its content; a section with an intro carries it 24px under the heading. "How it fits together" is the one tinted band (Surface One), with the heading and intro split 6/6 from lg and the map capped at 52rem so its type stays near 1:1.

Grids: outcomes 1 / 2 from sm / 3 from lg with 56px column and 64–80px row gaps; work cards 1 / 2 from md with 16px gaps; experience workstreams 3 columns from lg; stack rows put the group name in a 192px column from md; credentials split 7/5 from lg; GitHub 2 from md (the section renders only when a featured repo can be shown; none is listed since 2026-10-21).

A case study is one 768px column below xl and, from xl, a 12-column grid: header and MDX body on 8, the sticky facts panel on 4. The pager closes the page 80px below the body.

## Elevation & Depth

Flat by default. Depth comes from a tonal step (the Surface One band and panels), hairlines, and the work cards' tints. In flow, nothing carries a shadow; a work card lifts 2px on hover and its border deepens instead.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 12px 32px -12px rgb(0 0 0 / 0.35)`): the trace hint, which floats over the page while a figure is pinned.
- **Toast** (`box-shadow: 0 18px 44px -18px rgb(0 0 0 / 0.45)`): the copy-confirmation toast.

### Named Rules
**The Floating-Only Shadow Rule.** A shadow means "this floats above the page" (the trace hint, the toast, a dialog). Anything in flow uses a tonal step and a hairline.

## Shapes

Pills for anything you press or pick: buttons, figure chips, the theme toggle, the trace hint, stage chips. Containers are generously rounded (18px): work cards, panels, the facts panel, the pager, diagram frames, the map list. Small inline marks keep a 6px radius (skill chips); dots are full circles. Borders are 1px; the focus outline is 2px persimmon at a 3px offset, and a stretched-link card shows a 2px persimmon ring on its own 18px radius. Diagram groups are the one dashed line (4 3), in the AWS-diagram convention.

## Components

### Buttons
Confident and quiet; colour shifts, nothing glows.
- **Shape:** full pill (999px).
- **Primary:** Ink fill with Canvas text, 14px × 24px, 15px semibold, trailing arrow that nudges 2px on hover; hover drops opacity to 85%. "See the work", "Back to home".
- **Text action:** Persimmon text with a trailing arrow ("Email me", "See the work" on the 404); the nav "Resume" is a 13px persimmon link with a download icon.
- **Focus:** the global 2px persimmon outline.

### Chips
- **Figure chips** (the map section): pill, Strong Hairline border, 14px Ink Two with the value in semibold. Active (hover, focus or pinned): persimmon border, Persimmon Wash fill, persimmon text.
- **Skill chips** (Stack): 6px radius, 14px (13px with tighter padding below sm, so the nine rows stay short on a phone); a chip keeps its own height, even beside a group heading that wraps to two lines; filled Surface Three with Ink text and a brand dot when used at work, outlined Strong Hairline with Ink Two text and a dot when used in a personal project, Hairline with Ink Three and no dot otherwise.
- **Stage chips** (a pipeline case study): pill, Canvas fill, Strong Hairline border, 14px Ink.

### Cards / Containers
- **Share cards** (`next/og`, 1200×630, `components/og/share-cards.tsx`): always the dark palette, because an image can't follow a viewer's theme (`SHARE_THEME` in `lib/og.ts` flips it). Schibsted Grotesk 500/700 from static TTFs in `assets/fonts`. Home: an accent dot with the role and where; the name at 136px; three figures on a hairline. Case study: its cloud's colour and dot with where it ran; the headline set word by word, so hyphenated compounds never split; the lead figure (or the pipeline stages, each unbreakable); the name. Every string comes from `resume-data`.
- **Work card:** 18px radius, 28–32px padding, tinted by its cloud (6% fill, 22% border, 45% border on hover, 2px lift). Order: an Ink 1.625rem title (the stretched link), the "where" label in the cloud colour with its dot, a 15px Ink Two summary, the lead figure (2.75rem) with its label and an Ink Three provenance line (or the stage line), then a footer row of tech marks, an optional "Code ↗" and "Case study →".
- **Panels:** 18px radius, Surface One, Hairline border, rows split by hairlines (stack rows, credentials, the facts panel, ownership).
- **Shadow Strategy:** none in flow (see Elevation & Depth).

### Navigation
Sticky, 56px, Canvas at 85% with backdrop blur and no border. The home link sits left: a 28px Ink monogram ("MB", 11px bold Canvas, 10px radius) and, beside it, the name in 15px semibold Ink. On the home page the name waits until the hero's own has scrolled up under the nav, then slides in (500ms, ease-out-expo), and leaves again at the top, so the first screen never says it twice; on every other page, and on keyboard focus, it shows from the start. The link is named by its own text, the monogram and then the full name, so its name always contains what the eye reads (WCAG 2.5.3); below 360px the name is visually hidden, still read, so the row fits; the section links (Work, Experience, Stack, Credentials, Contact) sit centred in 13px Ink Two, Ink when current, with a 1px Ink underline that glides between them. The theme toggle and the persimmon Resume link close the row, at every width, so the resume is one tap away on a phone too (below sm the link drops its icon). Below md the links fold into a right-hand sheet with 18px links, an ink pill "Download resume", the copy-email control and social links. At the foot of the page the last link (Contact) is marked.

### Theme Toggle
A 36px round ghost button showing a moon in light and a sun in dark (chosen by CSS from `<html data-theme>`, so it is right from the first paint). It switches the theme and stores the choice; its label names the theme it switches to. Without JavaScript it hides and the system decides.

### Outcomes (signature)
Six figures in a three-column grid, each a button: the Figure in Ink (persimmon when active), a 20px medium Ink claim, then the 15px Ink Two provenance with an Ink Three "how measured" aside. Hover or focus previews its path on the map; a click pins it.

### Service Map and Trace (signature)
The estate drawn as a server SVG on the Surface One band: a Build band over three sibling workload zones (Azure, AWS, AI) and an Observe band beneath, nodes cut into their zones with brand dots. A row of figure chips above it traces any figure: lit nodes take Persimmon Wash and a persimmon stroke, lit edges turn persimmon, and everything else dims to 30% over 220ms. A pinned figure is mirrored to `?trace=`. Below md the drawing becomes a list of the three zones with the same trace marks. The map's one motion moment plays when it first scrolls into view: zones settle from 45% opacity and 4px, then edges draw out, about 1.1s, once.

### Hero Story (signature)
The first screen's one moving idea. The positioning line is a lead ("I automate how Azure and AWS infrastructure is") and three verbs sharing one inline cell as wide as the longest, so nothing reflows: the current verb sits in place and the one it replaces rolls up and out over 750ms (ease-out-expo). Beside it, from lg, the estate in miniature, built from the same data as the map: the Build and ship lane (Surface Two, tool chips on Canvas with brand dots), the three workloads as Canvas cards with their first three parts on Surface One, and the Observe lane, joined by straight connectors only where the estate has an edge, so nothing runs into the AI workload. Each verb is a step. **Built** lights the tools and the parts (Persimmon text, a 40% persimmon border and the wash over Canvas, staggered 90ms). **Shipped** turns the build connectors persimmon, sends packets down them and edges the Azure and AWS cards. **Monitored** does the same for the Observe lane. A lit tool keeps its Canvas chip under the wash, because the wash straight over Surface Two misses AA. The preview is aria-hidden (the map section describes the estate) and the whole line is always in the page for screen readers. `HeroCycle` steps `data-phase` on the hero every 3.2s while it is on screen and the tab is visible; CSS does the rest.

A pause control sits in the hero's bottom-right corner, at the content edge: a 32px round button with a Line Strong hairline and an Ink Three pause (or play) icon, Surface Two on hover. It holds the story where it stands, stops the packets, and is remembered across visits; play carries on from the same step. It shows only where the story can play (JavaScript on, motion allowed), because the story would otherwise move for as long as the hero is on screen (WCAG 2.2.2).

### Hero Proof
Two lines under the hero's buttons, above a hairline, in 15px Ink Two: the AWS Solutions Architect – Associate certification in semibold Ink with an AWS dot and a persimmon "Verify ↗" text action to its Credly badge, then "Cloud Operations Engineer at **Parkar Global Technologies**, since Dec 2024" with an Ink Three dot. They are what a recruiter screens for, so they sit on the first screen at 375×812 and 1440×900; the full credentials and experience follow further down. The trading name is used here; the legal name keeps its one appearance in Experience.

### Experience
One role, then its workstreams (three columns from lg). The role reads as a title, the legal employer name in Ink Two, and the period with the time in the role ("Dec 2024 – present · 1 yr 10 mos", counted in whole months when the page renders), the location on its own line below sm. Each workstream has an 8px dot in its cloud's colour (Ink Three when it ran on none), a 1.25rem name, a 14px Ink Three line saying where it ran, then one line per fact of at most 20 words: the result first in semibold Ink, then how, in 15px Ink Two, on a 5px Graphic Line bullet. The case studies hold the longer story.

### Trace Hint
When a figure is pinned and the map is out of view, a pill floats at the bottom centre: "**99.9%** is lit on the map", an ink "Show me ↓" pill linking to the map, and a clear button. It steps aside once the map is in view.

### Contact
The close: "Let's talk." as a Headline, a Lede intro, then the address in persimmon Fragment Mono at display size with a 44px round copy button beside it, and a row of LinkedIn, GitHub and Resume links. Copying confirms through a toast; where the browser can't copy, the address is selected and the toast says to press Ctrl+C.

### Case Study
A Headline-voice h1, a Lede summary, then "Measured outcomes" as a figure ledger on fine rules (3.25rem figures, two columns). The facts panel (Where, My part, Built with, Code) is sticky beside it from xl. MDX prose runs at 17px with 2rem headings; diagrams sit in an 18px Surface One frame with a caption row; ownership is a two-column ruled panel; the pager closes on two 18px cells with 20px semibold titles.

### Architecture Diagram (case study)
The figure tells its story through Trace, the same grammar as the home page's map. Under the caption row, a chip per step: each of the case study's figures first ("**99.9%** uptime"), then any step that has none ("What watches it"), styled exactly as the map's chips (12px side padding below sm so they pair up on a phone). Hover or focus previews a step, a tap pins it and mirrors it to `?trace=`, Escape or a second tap clears. Lit nodes take Persimmon Wash and a persimmon stroke, lit group outlines and their labels turn persimmon, lit edges and their arrowheads turn persimmon, and the rest dims to 30% over 220ms. Under the chips, one Ink Two line says why: a figure's claim and provenance, or a sentence the case study already says; at rest it is an Ink Three hint. From md the figure shows the drawing as it is laid out for desktop; below md it shows the same diagram laid out again for a tall screen (340 units wide, capped at 26rem so it stays near 1:1), never a shrunken copy or a list, so its text is 11px or more on a 360px phone. A text version of every group, node and connection stays in the page for screen readers at every size.

## Do's and Don'ts

### Do:
- **Do** let the type carry the hierarchy: Headline for sections, Statement for the hero line, Figure for numbers.
- **Do** keep every figure next to the sentence that says how it was achieved.
- **Do** spend persimmon only on action, focus, selection and the lit path; make buttons ink pills.
- **Do** give every colour a light and a dark value, and check 4.5:1 in both themes.
- **Do** keep one idea per screen: a statement heading, an intro line, then the evidence.
- **Do** use cloud colours only to say where work ran, and brand colours only as dots.
- **Do** keep text in drawings at 11px or more at their narrowest layout.

### Don't:
- **Don't** put an eyebrow, kicker or label above a heading; a card's "where" label sits under its title.
- **Don't** box the page back into panels; panels hold lists, not sections.
- **Don't** add a second accent, gradients, glow, glass or neon; the one tinted band is Surface One.
- **Don't** use Fragment Mono for anything but the literal email.
- **Don't** put shadows on in-flow cards or panels.
- **Don't** add motion beyond the hero's story and the two entrances; content is present from the first frame and with JavaScript off.
