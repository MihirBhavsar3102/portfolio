---
name: Mihir Bhavsar — Service Map Console
description: A dark engineering console where every measured figure traces to the infrastructure that produced it.
colors:
  canvas: "#0a0d12"
  surface-1: "#0e1218"
  surface-2: "#131921"
  surface-3: "#19202a"
  line: "#1e2631"
  line-strong: "#2b3542"
  ink: "#e7ecf2"
  ink-2: "#a4afbd"
  ink-3: "#7c8796"
  accent: "#4c8dff"
  accent-ink: "#04101f"
  accent-soft: "rgb(76 141 255 / 0.14)"
typography:
  display:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 5.4vw, 4.5rem)"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 92"
  headline:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "-0.01em"
  heading:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 88"
  title:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  body-lg:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "'tnum'"
  label:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.625
  mono:
    fontFamily: "Fragment Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "13px"
    fontWeight: 400
rounded:
  md: "6px"
  lg: "10px"
spacing:
  gutter: "20px"
  gutter-sm: "32px"
  column-gap: "48px"
  cell: "20px"
  section-y: "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.accent-ink}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
  copy-email:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-2}"
    typography: "{typography.mono}"
    rounded: "{rounded.md}"
    height: "36px"
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-3}"
    height: "56px"
  panel:
    backgroundColor: "{colors.surface-1}"
    rounded: "{rounded.lg}"
  ledger-cell:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    padding: "{spacing.cell}"
  ledger-cell-active:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.accent}"
  map-node:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  map-node-lit:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
  project-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    padding: "{spacing.cell}"
  project-card-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
  facts-panel:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  stage-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  pager-cell:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    padding: "16px 20px"
  pager-cell-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
  diagram-node:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  skill-chip-work:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
  skill-chip-project:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-2}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
  skill-chip:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-3}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "4px 10px"
  cert-row:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    padding: "16px 20px"
  repo-cell:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    padding: "{spacing.cell}"
---

# Design System: Mihir Bhavsar — Service Map Console

## Overview

**Creative North Star: "The Service Map Console"**

The site reads like a cloud console opened on the estate Mihir runs: a blue-tinted near-black canvas, panels lifted one tonal step at a time and split by hairlines, and a single console blue that means "act here", "you are here" or "this is the path". Nothing is decorative. The signature is Trace: every measured figure can be lit, and when it is, the infrastructure that produced it lights with it while everything else dims. The case-study pages carry the same grammar into reading: a figure ledger, a facts panel, and architecture drawings built from the same canvas-cut nodes and tech dots as the hero map.

Density is console-like but never cramped: a 1280px (max-w-7xl) frame, ruled grids instead of floating cards, sentence-length cells instead of big-number tiles. Mona Sans carries everything a person reads, including the figures, set slightly condensed through its width axis so numbers look engineered rather than shouted. Motion happens once, on load, as a short settle and edge draw; after that the interface only changes colour and border.

The register is the one PRODUCT.md commits to: dark, premium, "AWS Console × Linear × Vercel". Teal, violet, neon, glowing edges and halos, glassmorphism, terminal windows, code-editor chrome and hacker motifs are rejected; the one soft gradient is the atmosphere behind the service map.

**Key Characteristics:**
- Dark only; no light theme and no toggle.
- Three lifted surfaces over the canvas, separated by 1px hairlines, not shadows.
- One accent (console blue) for action, focus, selection and lit paths.
- Technology brand colours appear only as small dots marking their own technology.
- Mona Sans everywhere; Fragment Mono only for the literal email address.
- Tabular numerals globally; figures condensed via the wdth axis.
- One load moment (~1.1s, once); everything else is a colour or border state change.

## Colors

A cool, blue-tinted near-black ramp with one saturated console blue; colour is spent on meaning, never on decoration.

### Primary
- **Console Blue** (accent): primary action fill, focus ring, active nav indicator, selection tint (at 35% alpha), lit Trace paths and lit figures, the pinned-cell ring. 6.08:1 on canvas, 5.12:1 even on surface-3.
- **Console Blue Ink** (accent-ink): text and icons placed on a Console Blue fill (5.97:1). Never white on blue.
- **Console Blue Wash** (accent-soft): the fill of a lit service-map node. A state colour only; never a resting background.

### Neutral
- **Blue Black Canvas** (canvas): the page, the sticky nav (at 85% with backdrop blur), the dialog overlay (at 80%), and the fill of map nodes, diagram nodes, chips and stage chips, which sit "cut into" their zone.
- **Surface One** (surface-1): the first lift: map figure, proof-ledger and figure-ledger cells at rest, work cards, the experience panel, the facts panel, ownership columns, pager cells, the diagram figure, mobile map strip, the stack panel, credential panels, repo cells, copy-email control, dialogs and sheets. Also the knockout stroke behind diagram edge labels.
- **Surface Two** (surface-2): the second lift: map bands and zones, an active ledger cell, the hover fill of work cards, pager cells, secondary and ghost controls, the toast.
- **Surface Three** (surface-3): the third lift: the fill of a "used at work" skill chip, and nothing else yet. Small ink-3 text must stay off it (exactly 4.50:1).
- **Hairline** (line): the default 1px divider and panel border; also the colour that shows through gap-px rules in the ledger.
- **Strong Hairline** (line-strong): outlined buttons, map and diagram node strokes, stage-chip borders, dashed diagram groups, control-plane edges, hairline-dash list markers, the resting underline of text links, dialog and toast borders, scrollbar thumb.
- **Ink** (ink): names, headings, figures at rest, claim lines, primary link text. 13.8–16.4:1.
- **Ink Two** (ink-2): positioning and provenance prose, case-study summaries and MDX body text, zone and diagram group titles, edge labels, secondary links, a project skill chip's text, and detail text inside a work chip. 7.4–8.8:1.
- **Ink Three** (ink-3): metadata, notes, "how measured" asides, card provenance lines, periods and fact terms, hints, inactive nav links, data edges and diagram edges with their arrowheads, stage arrows, unbranded tech dots. 4.85–5.34:1 on canvas through surface-2.

### Named Rules
**The One Blue Rule.** Console Blue is the only interface colour. If something needs to stand out and it is not an action, a focus, a selection or a lit path, it does not get blue; it gets Ink instead of Ink Two.

**The Marks Only Rule.** Technology brand colours (lib/tech.ts) render only as a 6–7px dot beside that technology's name. Never as text colour, border, fill, icon tint or chart series. A brand with no usable colour on dark gets an Ink Three dot.

**The AA Floor Rule.** Every text pairing clears 4.5:1. Ink Three on Surface Three sits exactly on the line, so small Ink Three text never goes on Surface Three.

## Typography

**Display Font:** Mona Sans (variable, wdth axis loaded; falls back to ui-sans-serif, system-ui)
**Body Font:** Mona Sans
**Label/Mono Font:** Fragment Mono 400 (falls back to ui-monospace, SFMono-Regular)

**Character:** One engineered grotesque does all the talking, tightened through its width axis where it has to carry weight (the name, the figures). The mono is not a costume; it appears only where the text is a literal string a person might copy.

### Hierarchy
- **Display** (650, clamp(2.75rem, 5.4vw, 4.5rem), 0.98, -0.035em, width 92%): the name in the hero. One per page. A case-study page's h1 takes the same face, weight and width at a fixed 2.25rem (36px), 1.08, -0.025em.
- **Headline** (500, 1.5rem, -0.01em): the role line directly under the name.
- **Heading** (600, 1.5rem, -0.01em, Ink): top-level home section headings ("Selected work", "Experience") and case-study MDX h2s (56px above, none on the first).
- **Figure** (600, 2.25rem, 1.0, -0.02em, width 88%; 32px at xl): measured values in the proof ledger. Turns Console Blue when its figure is active. Work cards and the case-study figure ledger use it at 36px at every width.
- **Title** (600, 1rem): subheadings inside a section or panel, such as "Measured outcomes", "Pipeline stages", "Service map" and experience workstream names. Card and role titles step up to 1.125rem, 600, -0.01em; dialog titles to 1.25–1.5rem, 600, -0.02em.
- **Body Large** (400, 1.125rem, 1.625, max 42ch, Ink Two): the positioning paragraph; the case-study summary under the h1 (max 60ch).
- **Prose** (400, 1rem, 1.7, max 68ch, Ink Two): case-study MDX paragraphs and list items; strong runs go Ink 600.
- **Body** (400, 0.875rem, 1.55–1.625): provenance (14px, Ink Two), nav links, buttons (14px, 600). Claim lines in the proof ledger take the Title size (16px, 400, Ink).
- **Label** (400–500, 0.75–0.8125rem): zone notes, path lines, legends, footer note, fact terms, pager direction words; card stack marks in Ink Two. Ink Three unless stated.
- **Mono** (Fragment Mono 400, 13px): the email address inside the copy-email control, and nowhere else.

### Named Rules
**The Mono Is Data Rule.** Fragment Mono is reserved for literal, copyable strings (today: the email address). Node names, meta, paths, units, headings and figures are Mona Sans. Setting interface or labels in mono to look technical is costume.

**The Condensed Figure Rule.** Figures are Mona Sans condensed via font-stretch (88%), never a separate numeric face, and every number on the site uses tabular numerals.

**The Readable Map Rule.** Text inside a drawing must render at 11px or larger at its narrowest layout; size SVG type in viewBox units against that floor.

## Layout

A centred 1280px frame (max-w-7xl) with 20px side gutters, 32px from sm. The sticky nav is 56px tall; anchor scroll is offset 80px to clear it.

The hero is a 12-column grid that splits only at xl (1280px): 5 columns of identity and actions on the left, 7 columns of service map on the right, 48px column gap, vertically centred. Below xl the map stacks under the copy at full width, capped at 768px (max-w-3xl). Below md (768px) the drawing is removed and replaced by a ruled three-zone strip placed between the actions and the ledger, so a phone still sees the estate before the figures.

The proof ledger is a ruled grid: 1 column, 2 from sm, 3 from lg, cells 20px padded (20px × 16px at xl). Vertical rhythm between blocks runs 16–40px; nothing uses large empty bands.

Home sections below the hero each open on a full-bleed Hairline (the rule spans the viewport; the content does not) and sit inside the same 1280px frame with 64px of vertical padding and the heading 24px above its content. Selected work is a ruled grid of cards, 1 column, 2 from md. The experience entry splits each workstream 4/8 from lg (48px gap): name, summary and case-study link on the left, points on the right. Stack is one bordered panel of hairline rows, one per skill group: from md the group name sits in a 192px column (32px gap) with its skills wrapping beside it as chips; below md the name sits above them. Credentials splits 7/5 from lg (48px gap): certifications on the left, education over recognition on the right, 40px apart. GitHub is a ruled grid of repo cells, 2 from md. Contact is one column. The 404 sits in the same frame with 96px of vertical padding.

A case-study page opens 32px under the nav with an "All work" back link, then the content 24px below it. Below xl everything is one column capped at 768px (max-w-3xl), so a 760-wide diagram renders near 1:1. From xl it is a 12-column grid with a 48px column gap: header and MDX body on 8 columns, the facts panel on 4, spanning both rows and sticky 80px from the top. The pager closes the page 64px below the body, and the page ends on 80px of bottom padding.

**The Ruled Grid Rule.** Collections of peers sit in one bordered, radius-lg container with 1px gaps over the Hairline colour, so the rules are the background showing through. Not separate floating cards with gaps between them.

## Elevation & Depth

Depth is tonal. In-page surfaces step up from canvas through surface-1 and surface-2 and are delimited by 1px hairlines; they carry no shadow. The sticky nav separates by a bottom hairline and an 85% canvas with backdrop blur so content scrolls visibly beneath it.

### Shadow Vocabulary
- **Toast lift** (`box-shadow: 0 18px 44px -18px rgb(0 0 0 / 0.7)`): the portalled copy confirmation toast.
- **Dialog lift** (`box-shadow: 0 28px 70px -24px rgb(0 0 0 / 0.75)`): the centred modal dialog.

### Named Rules
**The One Atmosphere Rule.** A single faint radial gradient of Console Blue at 9% opacity, fading out by 75% of its radius, sits behind the service map (and only there, only at md and up). It is atmosphere under the signature element, not glow: nothing on the site carries a halo, outer glow, glowing edge or neon bloom, and no other gradient exists. A second gradient is a new decision, not a nudge.

**The Portal-Only Shadow Rule.** A shadow means "this floats above the page": only portalled layers (toast, modal dialog) get one. Anything in document flow uses a tonal step and a hairline instead. The side sheet uses a left hairline, no shadow.

## Shapes

Quietly rounded, rectangular, console-like. Controls, map nodes and the copy-email control take a 6px radius; panels, the ledger, the mobile strip, dialogs and toasts take 10px; map bands and zones use 8px in SVG units. Dots and the nav indicator are full pills. Borders are always 1px; the only 2px lines are the focus outline (2px Console Blue, 3px offset), its inset 2px ring form inside clipped ruled grids, and the active-nav underline. Containers clip their children (overflow hidden) so ruled grids keep their outer corners; that clipping is why a link inside a ruled grid takes an inset ring instead of the offset outline. Diagram groups are the one dashed line on the site (4 3 dash, 8px radius in SVG units). Lists in prose and panels use a hairline dash instead of a bullet: an 8px × 1px Strong Hairline line, 16px of indent, pinned to the first line of the item.

## Components

### Buttons
Compact and confident; colour shifts, nothing lifts.
- **Shape:** 6px radius, 10px × 16px, 14px semibold, 16px Lucide icon at 2px stroke with an 8px gap.
- **Primary:** Console Blue fill with Console Blue Ink text. Hover swaps the fill to Ink (a light, near-white button) and nudges a trailing arrow 2px right.
- **Secondary (outlined):** transparent on canvas, Strong Hairline border, Ink text. Hover raises the border to Ink Three and fills Surface Two.
- **Ghost icon:** 36–44px square, Ink Two/Three icon, hover fills Surface Two and the icon goes to Ink.
- **Focus:** the global 2px Console Blue outline at 3px offset.

### Copy Email Control
A joined pair inside one Surface One, 6px-radius container with a Hairline border: the mailto link in Fragment Mono 13px Ink Two, then a 36px square copy button behind a left hairline. A successful copy swaps the icon for a Console Blue check for 2s and announces through a toast. Without the Clipboard API (a plain-http origin, a locked-down browser), or when the browser refuses the write, it selects the address and the toast says to press Ctrl+C (⌘C on a Mac); it never navigates away.

### Cards / Containers
- **Corner Style:** 10px.
- **Background:** Surface One at rest; Surface Two for bands, zones and active state.
- **Shadow Strategy:** none in flow (see Elevation & Depth).
- **Border:** 1px Hairline; a caption row separated by a bottom hairline when the panel has a title.
- **Internal Padding:** 10–20px; ledger cells 20px.

### Text Links
Inline links in prose, the experience panel and the facts panel are Ink (medium where they stand alone) with a 1px Strong Hairline underline 4px below the baseline; hover raises the underline to Ink. A link that leads to a case study carries a trailing 14px arrow set inline with its last word (not inline-flex, so a wrapped title keeps the arrow) that nudges 2px on hover; external links carry an up-right arrow and a screen-reader "opens in new tab" note. The case-study back link is 14px Ink Three with a leading arrow that nudges 2px left, Ink on hover.

### Chips
- **Stage chips:** the pipeline stages on a case study with no single figure: canvas fill, Strong Hairline border, 6px radius, 6px × 12px, 14px Ink, separated by Ink Three arrows in a wrapping row.
- **Stage line:** on a work card the same stages run as one wrapping 14px Ink Two line with Ink Three arrows, no chips.

### Navigation
Sticky, 56px, canvas at 85% with backdrop blur and a bottom hairline. The name sits left in 16px semibold Ink. Section links are 14px Ink Three, Ink on hover and when current (aria-current="location"); a 2px Console Blue underline glides between the current links on a 300ms expo-out transition. An outlined compact Resume button closes the row (12px × 6px, 14px medium). The links are Work, Experience, Stack, Credentials and Contact; the GitHub section has none, and the mark clears while it is in view. The current section is the one crossing a band 40–50% down the viewport; at the foot of the page the last link (Contact) is marked, because that section is too short to reach the band. Below md the links collapse into a ghost menu button that opens a right-hand sheet: Surface One, left hairline, hairline-ruled 16px links that turn Console Blue on hover, then a full-width primary Download resume, the copy-email control and social links.

### Dialogs and Sheets
Radix dialogs open and close without animation (a measured performance decision: Presence's animation detection made opens lag). Modal: centred, max 672px, Surface One, Strong Hairline border, 10px radius, Dialog lift shadow, over an 80% canvas overlay. Sheet: right edge, 320px (max 85vw). Close is a ghost icon button top right.

### Service Map (signature)
An SVG console drawing of the estate, framed in a Surface One panel with a caption row ("Service map" plus a two-item legend).
- **Grammar:** a Build band above three sibling workload zones, an Observe band below. Control edges route down from Build and up from Observe through a bus gap; edges never cross and never join two workloads. An edge is drawn only where the source data states the relationship (each edge carries a `source`).
- **Parts:** bands and zones are Surface Two with a Hairline stroke; each zone has a title (Ink Two) and a plain-text note (Ink Three). Nodes and chips are canvas-filled, Strong Hairline stroked, 6px radius, with a tech dot, an Ink name and optional Ink Three meta.
- **Edges:** control edges 1px Strong Hairline; data (service path) edges 1.25px Ink Three.
- **Lit state:** nodes take Console Blue Wash fill and Console Blue stroke, zones a 45% Console Blue stroke, edges Console Blue.
- **Load moment:** bands and zones settle from 45% opacity and 4px down over 520ms, staggered; edges draw via stroke-dashoffset over 480ms. Roughly 1.1s total, once, expo-out. Nothing starts invisible.
- **Small screens:** below md, a ruled three-zone list (zone with tech dot, note, services, "Built with" and "Watched by") carrying the same Trace marks.

### Proof Ledger (signature)
Six measured outcomes in a ruled 3×2 grid. Each cell is a sentence, not a tile: the Figure, a 16px Ink claim, then Ink Two provenance with an Ink Three "how measured" aside when known. Below md each cell also writes out its traced path in a 12px line that lights Console Blue with the figure.

### Trace (signature interaction)
Hover or focus on a figure previews its path; click or tap pins it (aria-pressed), a second tap or Escape clears it; the pinned id is mirrored to `?trace=` so a link can carry it. While tracing, lit elements take Console Blue and every unlit traceable element dims to 30% opacity over 220ms expo-out. Every traceable element carries a `data-lit-by` attribute (empty when nothing lights it) so the whole drawing dims around the path. The active cell steps to Surface Two; a pinned cell adds a 1px inset Console Blue ring.

### Section Heading
Every home section below the hero: a full-bleed Hairline above, the 1280px frame with 64px vertical padding, a Heading (24px, 600, -0.01em, Ink) and the content 24px under it.

### Work Cards
The selected work as a ruled grid (2 columns from md). Each card is Surface One, 20px padded, stepping to Surface Two on hover over 200ms.
- **Order:** an 18px semibold title; a 14px Ink Two summary; the lead Figure (36px) with its 16px Ink label and a 14px Ink Three provenance line, or the stage line for the project that has no figure; the stack as tech marks (12px Ink Two, 6px dot) capped at five with an Ink Three "+N more"; then a footer row pushed to the bottom.
- **Footer:** where it happened (Ink Three) on the left; on the right an optional "Code" link (Ink Two, up-right arrow) and a "Case study" affordance in Ink medium whose arrow nudges 2px on card hover.
- **Hit area:** the title link is stretched over the whole card with a ::after overlay; focus draws a 2px inset Console Blue ring on that overlay, because the grid's overflow would clip an outline. The Code link is raised above the overlay (relative, z-10) so it stays its own target.

### Experience Entry
One bordered Surface One panel (10px, Hairline, clipped). A header row behind a bottom hairline holds the role title (18px semibold), the legal employer name and location in 14px Ink Two (the only place the legal name appears on the site), and the period in 14px Ink Three, right-aligned and wrapping under on narrow screens. Workstreams follow as hairline-ruled rows, 20px padded, split 4/8 from lg: a 16px semibold name, a 14px Ink Two summary and, where one exists, an underlined "Case study: …" link; then the points as hairline-dash items in 14px Ink Two. A final row behind a top hairline reads "Also built here:" followed by the remaining project links.

### Stack Rows and Skill Chips
The resume's nine skill groups as one bordered Surface One panel of hairline rows (16px × 20px), in the resume's order. Each row is a 14px medium Ink group name and its skills as a wrapping row of chips, 8px apart.
- **Chip:** 6px radius, 1px border, 4px × 10px, 14px; a detail, where the resume gives one, follows the name inside the chip ("Terraform reusable modules") and wraps inside it on a phone.
- **Evidence, by emphasis:** a skill "Used at work" (a work project's stack has it, or a workstream names it) is a filled chip: Surface Three, Strong Hairline border, Ink name, Ink Two detail. "Used in a project" (only a personal project's stack) is an outlined chip: Strong Hairline border, Ink Two name. Every other skill is a faint chip: Hairline border, Ink Three. Derived from data (lib/stack.ts), never hand-set.
- **Dots:** only work and project chips carry a 6px dot before the name, in the technology's brand colour (Ink Three when the brand has none or the skill isn't a product), so the eye lands on the evidence first.
- **Key:** two sample chips above the panel, "Used at work" and "Used in a project", at 12px with a neutral dot. Faint chips have no key entry. Screen readers hear "(Used at work)" or "(Used in a project)" after a marked skill's name.

### Credentials
Three titled panels, each title 16px semibold Ink, 10px above a bordered Surface One list with hairline-ruled rows (16px × 20px).
- **Certifications:** a 14px medium Ink name over a 12px Ink Three line, "code · issuer · Earned Mon YYYY"; a field that isn't known is left out. A 14px Ink Two "Verify" link with an up-right arrow sits on the right, only where a verification URL exists.
- **Education:** degree (14px medium Ink), institution (14px Ink Two), then years · score (12px Ink Three).
- **Recognition:** the NCC title over its 14px Ink Two detail.

### GitHub Repos
The hand-picked repos as a ruled grid, 2 columns from md. Each cell is Surface One, 20px padded:
- the repo name as a 16px semibold underlined Ink link with an up-right arrow (GitHub, new tab);
- "Fork of owner/repo" in 12px Ink Three for a fork, and a "My contribution:" line;
- the description in 14px Ink Two: GitHub's own, or the curated blurb when GitHub has none or doesn't answer;
- a 12px Ink Three live line, "Language · Last pushed Mon YYYY", only when GitHub answered;
- a footer row: what the repo demonstrates (Ink Three) and a "Case study" link whose arrow nudges 2px.

Never stars or a contribution graph. A fork without a contribution line is never shown, and the section disappears if no repo can be shown.

### Contact
One column: an 18px Ink Two line (max 42ch); the primary "Email me" button (mailto, leading mail icon) beside the copy-email control; then a row of 14px Ink Two links, LinkedIn and GitHub (up-right arrows, new tab) and "Resume (PDF)" (download icon).

### Not Found
The 404 for any unknown URL, inside the site chrome: the 36px Display h1 "Page not found", one 18px Ink Two sentence carrying the error code, then a primary "Back to home" and an outlined "See the work". No eyebrow, no illustration.

### Case Study Header and Facts
- **Header:** the Display h1 at 36px, an 18px Ink Two summary, then a "Measured outcomes" (or "Pipeline stages") title over the figure ledger or the stage chips.
- **Figure ledger:** a ruled grid, 2 columns from sm, an odd last cell spanning both. Each cell is Surface One, 20px padded: the Figure at 36px, a 16px Ink label, then 14px Ink Two provenance with an Ink Three "how measured" aside when known. These figures are static; Trace lives on the hero only.
- **Facts panel:** a Surface One panel holding one definition list, hairline-ruled rows 12px × 16px: Where, My part, Built with (tech marks) and, when the project has public code, Code (an underlined repo link). Terms 12px Ink Three, values 14px Ink. Sticky 80px from the top from xl.
- **Ownership:** a ruled grid with a "My part" column; a second column for the team (or what was already in place) appears beside it from md only when the source material says something about it. Each column is Surface One, 20px padded, a 14px semibold Ink heading over hairline-dash items in 14px Ink Two.

### Pager
A ruled grid of two cells (2 columns from sm) closing every case study. Each cell is Surface One, 16px × 20px, stepping to Surface Two on hover: a 12px Ink Three direction word ("Previous", "Next") over a 16px medium Ink title with an arrow that nudges 2px outward; the next cell is right-aligned from sm. At either end the empty side becomes "Back to / All work". Focus is the 2px inset Console Blue ring, as on work cards.

### Architecture Diagrams
A per-case-study drawing, server-rendered as SVG at a 760 viewBox width, framed in a Surface One panel with a caption row (14px medium Ink Two title behind a bottom hairline) and 10px of inner padding.
- **Groups:** unfilled rectangles in Strong Hairline with a 4 3 dash and an 8px radius (the AWS-diagram convention), titled in Ink Two (medium) with an optional Ink Three note under the title.
- **Nodes:** canvas-filled, Strong Hairline stroked, 6px radius, a 7px tech dot (Ink Three when the brand has no usable colour), an Ink name and optional Ink Three meta, as on the hero map.
- **Edges:** 1.25px Ink Three orthogonal paths ending in an Ink Three arrowhead. Labels are Ink Two, centred on the edge and knocked out of it with a 6px Surface One stroke painted under the fill (paint-order: stroke).
- **Type:** 14 viewBox units for node names, 12.5 for everything else; the drawing is shown only from md, where it is never narrower than about 680px, so the smallest rendered text is 11.2px (the Readable Map Rule).
- **Text equivalent:** below md the drawing is replaced by a nested list (groups with their notes, then the nodes inside each with tech dots and meta, nested under a left hairline) followed by a "Connections" list of "from → to · label" lines. Above md the drawing is aria-hidden and the same list stays in the page as screen-reader-only text.

## Do's and Don'ts

### Do:
- **Do** separate in-flow surfaces with a tonal step and a 1px hairline (line or line-strong).
- **Do** spend Console Blue only on action, focus, selection and lit paths; put Console Blue Ink on any blue fill.
- **Do** mark a technology with its brand colour as a 6–7px dot beside its name, and nothing more.
- **Do** pair every figure with the sentence that says how it was achieved, in the same cell.
- **Do** give every traceable element `data-lit-by`, and draw a map edge only when the data cites a source for it.
- **Do** keep rendered map text at 11px or larger at the narrowest layout.
- **Do** limit motion to the one load moment and to colour/border transitions (200–300ms, cubic-bezier(0.16, 1, 0.3, 1)); let reduced motion cancel all of it.
- **Do** use tabular numerals and the condensed width axis for figures.
- **Do** give a link inside a clipped ruled grid a 2px inset Console Blue ring instead of the offset outline, and keep any second link raised above a stretched card overlay.
- **Do** ship every drawing with a text equivalent that carries the same groups, nodes and connections.
- **Do** derive anything the page claims about a skill (the evidence markers) from project and workstream data; never hand-set it.

### Don't:
- **Don't** add a light theme or any second accent hue; no teal, violet, neon, glowing edges or halos, and no gradient beyond the one atmosphere behind the service map.
- **Don't** put shadows on in-page cards, panels or buttons; shadows belong to portalled layers only.
- **Don't** set node names, labels, units, headings or figures in Fragment Mono.
- **Don't** use brand colours as text, fills, borders or icon tints.
- **Don't** put small Ink Three text on Surface Three.
- **Don't** draw an edge between two workloads, or any relationship the resume does not state.
- **Don't** animate dialogs, sheets or scroll-triggered reveals; content is present from the first frame.
- **Don't** place an eyebrow or kicker above a heading.
- **Don't** use big-number stat tiles, skill-icon grids, screenshot cards, terminal windows or code-editor chrome.
