---
name: Mihir Bhavsar — Portfolio
description: A career published as a reference-architecture drawing: navy ink on cool plotter paper, hairline rules instead of shadows, depth drawn as isometric extrusion.
colors:
  paper: "#edf0f4"
  plate: "#ffffff"
  field: "#0b1f33"
  field-2: "#123049"
  ink: "#0b1f33"
  ink-2: "#46586b"
  ink-3: "#55697d"
  on-field: "#e9eff6"
  on-field-2: "#9cb3c8"
  rule: "#cbd4de"
  rule-strong: "#93a3b4"
  rule-field: "#24405a"
  signal: "#1b5e9e"
  signal-ink: "#ffffff"
  signal-field: "#63a6e8"
  signal-field-ink: "#0b1f33"
  ghost: "#bcc8d6"
  ghost-line: "#93a3b4"
  plane-face: "#123049"
  plane-edge: "#2c4d6d"
  plane-east: "#0d2840"
  plane-south: "#0a2034"
  plate-top: "#e9eff6"
  plate-east: "#a9bdd2"
  plate-south: "#85a0bb"
  plate-edge: "#ffffff"
typography:
  display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(2.5rem, 6.2vw, 4.25rem)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1.03
    letterSpacing: "-0.03em"
  metric:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Archivo, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  body-lg:
    fontFamily: "Archivo, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  annotation:
    fontFamily: "Azeret Mono, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.16em"
  annotation-field:
    fontFamily: "Azeret Mono, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.14em"
  chrome-label:
    fontFamily: "Archivo, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  none: "0"
  nub: "3px"
  focus: "1px"
  full: "9999px"
spacing:
  hairline: "1px"
  cell: "16px"
  gutter: "20px"
  plate: "24px"
  gutter-wide: "32px"
  row: "36px"
  block: "40px"
  block-lg: "56px"
  sheet: "64px"
  sheet-lg: "80px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
    typography: "{typography.chrome-label}"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.signal-ink}"
  button-secondary:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
    typography: "{typography.chrome-label}"
  button-secondary-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-outline:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    typography: "{typography.chrome-label}"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.plate}"
  button-outline-field:
    backgroundColor: "{colors.on-field}"
    textColor: "{colors.field}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    typography: "{typography.chrome-label}"
  button-outline-field-hover:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.none}"
    size: "36px"
  icon-button-hover:
    textColor: "{colors.ink}"
  record-cell:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 20px"
  record-cell-field:
    backgroundColor: "{colors.field-2}"
    textColor: "{colors.on-field}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
  stack-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
    typography: "{typography.annotation-field}"
  callout-disc:
    backgroundColor: "transparent"
    textColor: "{colors.signal}"
    rounded: "{rounded.full}"
    size: "28px"
  callout-disc-active:
    backgroundColor: "{colors.signal-field}"
    textColor: "{colors.signal-field-ink}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.none}"
    padding: "16px 12px"
    typography: "{typography.chrome-label}"
  nav-link-active:
    textColor: "{colors.ink}"
---

# Design System: Mihir Bhavsar — Portfolio

## Overview

**Creative North Star: "The Plotted Architecture Sheet"**

This is not a page that describes infrastructure work; it is a drawing of it, published the way an engineering office publishes a reference architecture. Deep navy ink sits on cool plotter stock. Navy zone fields own whole regions of the page rather than tinting a card. White service plates stand on those fields with visible extruded edges. Rules are hairlines, and they do the separating work that a card, a tinted band, or a shadow would do elsewhere. Every region that carries drawing rather than prose is annotated in a mono drafting hand, and every quantity is set in tabular figures because drafted figures line up in columns.

The density is high and deliberately unpadded. Cells sit shoulder to shoulder separated by a single hairline, produced by laying a one-pixel gap over a rule-coloured ground rather than by bordering each cell — so the grid reads as one ruled sheet, not as a set of tiles that happen to be adjacent. Headings carry their own weight at the top of each sheet; there is no label, kicker, or eyebrow above any heading anywhere in the build, and production status appears as a field inside an evidence block instead. Dark mode is the same poster plotted on a navy ground: a chosen second printing, not an inverted first.

The restraint is a professional posture, not a default. Colour is scarce enough that one blue reads as "energised / live / measured" on sight; the accent appears on discs, rules, figures, and one primary action, and nowhere else. Corners are square by system: the only curves in the whole build are the callout discs, the status dots, and a 3px nub on one measurement bar.

**Key Characteristics:**
- Navy field regions and cool paper regions alternate as full-bleed grounds; nothing floats between them.
- Hairline rules and one-pixel grid gaps instead of cards, tints, or dividers with weight.
- Depth is drawn as isometric extrusion, never simulated with a shadow on the page surface.
- Two hands: Archivo for everything spoken, Azeret Mono for everything annotated.
- Square corners everywhere except discs, dots, and a single measurement nub.
- Both themes complete and independently declared; neither is a filter over the other.

## Colors

A two-ground palette — cool paper and deep navy — carrying one blue that means "live", plus a hatched grey that means "the part not claimed".

### Primary
- **Live Signal Blue** (`#1b5e9e`, light): the accent painted on paper grounds. It marks the primary action, the discipline line under the name, the measured headline figures in the record, the solid span of every proportion bar, the filled evidence marker, the active nav rule, the selection highlight, and the focus ring. Nothing decorative wears it.
- **On-Field Signal Blue** (`#63a6e8`, light): the same role painted on the navy field — the automation rail, the numbered callout discs, the inline quantities on diagram labels, the metric figures inside the lead project block, and the underline on the email address.

### Neutral
- **Cool Plotter Paper** (`#edf0f4`, light): the page ground. Every prose sheet sits on it directly.
- **Plate White** (`#ffffff`, light): raised plates on the ground — the title block, alternating sheets, skill cells, dialogs, the toast.
- **Navy Field** (`#0b1f33`, light): full-bleed zone grounds; carries the estate drawing and the closing title block. Doubles as the primary ink colour on paper.
- **Field Step Two** (`#123049`, light): the second step inside a field — hovered legend cells, record cells on navy, pipeline plates on navy.
- **Secondary Ink** (`#46586b`, light) and **Drafting Ink** (`#55697d`, light): prose that supports and annotation that labels. Drafting Ink is the floor — it clears AA at body size and is never used smaller than 10px at 0.14em tracking.
- **On-Field Ink** (`#e9eff6`) and **On-Field Secondary** (`#9cb3c8`): the same two-step prose hierarchy inverted for navy grounds.
- **Hairline** (`#cbd4de`), **Strong Hairline** (`#93a3b4`), **Field Hairline** (`#24405a`): the three rule weights. Hairline divides inside a block, Strong Hairline separates one sheet from the next and draws the hollow evidence marker, Field Hairline is the only rule drawn on navy.
- **Ghost** (`#bcc8d6`) with **Ghost Line** (`#93a3b4`): the unlit remainder of a measured field, always rendered as a real 135° hatch, never as a flat tint.

### Isometric Materials
- **Plane faces and edges** (`#123049` face, `#2c4d6d` edge, `#0d2840` east, `#0a2034` south): the four stacked zone slabs.
- **Plate faces and edges** (`#e9eff6` top, `#a9bdd2` east, `#85a0bb` south, `#ffffff` edge): the service plates standing on them. East is always lighter than south; the light comes from one direction and never changes.

### Named Rules
**The Two Signals Rule.** The accent has two declarations, not one: `--signal` for signal painted on paper, `--signal-field` for the same role painted on the navy field. They stay separate declarations even in dark mode, where their values coincide, precisely so that darkening one can never silently drag the other below the contrast floor. Never collapse them into a single token, and never paint `--signal` on a navy ground.

**The Field Owns The Region Rule.** A navy field is a full-bleed region that owns everything inside it and sets `.on-field` so the focus ring inverts. Navy is never a card, never a badge, never a tint behind a paragraph.

**The Ghost Is Measured Rule.** The ghost hatch means "the part of the measured whole that is not being claimed". It is a real repeating-gradient hatch on `--ghost`, and it appears only where a denominator is stated. Never use it as texture.

## Typography

**Display Font:** Archivo (variable, `wdth` axis loaded), self-hosted via `next/font`
**Body Font:** Archivo — same family, no second sans
**Label/Mono Font:** Azeret Mono, self-hosted via `next/font`

**Character:** A grotesque with a width axis carries both the poster lettering and the prose, so display sizes can be set slightly expanded without importing a second family. Against it, Azeret Mono is the drafting hand — square, even-coloured, and unmistakably an annotation rather than a voice. The pairing reads as a drawing with notes on it, not as a website with a "technical" font.

### Hierarchy
- **Display** (800, `clamp(2.5rem, 6.2vw, 4.25rem)`, 0.94, -0.035em): the name in the title block. One instance per page.
- **Headline** (800, `clamp(1.75rem, 3.4vw, 2.75rem)`, 1.03, -0.03em): every sheet heading, capped at `20ch` and balanced. The lead project title uses the same ramp at `clamp(1.75rem, 3.6vw, 2.75rem)`.
- **Metric** (800, `clamp(2rem, 4vw, 3rem)`, 1, -0.035em, in Signal): the measured figure in each operations record row. Metrics inside blocks step down to 24–30px at the same weight and tracking.
- **Title** (700, 20–24px, 1.1, -0.02em/-0.03em): job titles, secondary project names, dialog titles, legend headlines.
- **Intro** (400, 17px, ~1.625): sheet intros and section lead paragraphs, capped at 58–68ch.
- **Body** (400, 15px, ~1.625): the default prose size and every record value, capped at 44–62ch depending on column width.
- **Chrome** (600, 12px, 0.1em, uppercase, Archivo): nav links, every button and action bar, the footer colophon. One size for all interface chrome.
- **Annotation** (600, 10–11px, 0.12–0.16em, uppercase, mono): plane labels, legend labels, record-strip field names, operation names, issue-block fields, stack chips, dates, and diagram callouts. 12px mono is the annotation band's top step, used for quantities set beside their labels.

The small end of the ramp is exactly **10 / 11 / 12 / 15 / 17** — five discrete steps, no literal size between them. An earlier build carried 13, 14 and 16 as well; each duplicated the work of a neighbour, and eight near-identical sizes is a list, not a scale.

### Named Rules
**The Drafting Hand Rule.** Azeret Mono is annotation only — legends, plane and plate labels, dates, quantities, stack chips, and title-block field labels. Interface chrome (nav links, buttons, CTAs, footer) is Archivo. The role line under the name is mono because it is a title-block discipline field, not chrome. Prose is never mono, and code is never rendered at all.

**The Five Steps Rule.** Below the Title step the ramp has five sizes: 10, 11, 12, 15, 17. A new literal font-size is a design decision, not a nudge — if a thing looks wrong at 15px the answer is weight, colour, or spacing, not 14px.

**The Tabular Figure Rule.** `font-variant-numeric: tabular-nums` is set on the body, globally and permanently. Drafted figures line up in columns; proportional numerals are the tell that nobody set them.

**The No Kicker Rule.** Nothing sits above a heading. No eyebrow, no kicker, no label line. Status that would have been an eyebrow ("Running in production") is demoted into an evidence block where it is a stated field rather than a decoration.

## Layout

One centred container at `max-w-352` (88rem / 1408px) governs every region, with 20px gutters that open to 32px at `sm`. Every full-bleed ground (navy field, paper, plate) runs edge to edge; only the content inside it is constrained.

Sheets are the unit. Each sheet is a section with a **top rule in Strong Hairline** and `64px` vertical padding opening to `80px` at `md` — that top rule, not a card or a tinted band, is what separates one sheet from the next. Heading to content is `40px`, opening to `56px` at `md`. Alternating sheets switch ground between paper and plate for rhythm; nothing else changes.

Wide layouts use a **12-column grid split 5 / 7**: title block left, drawing right; contact left, title-block record right; operation name and figure left, description and measurement right. Where the content is a set of peers rather than a split, the grid is 2 or 3 equal columns — never 2 for the capability key, which uses one column or three so the ruled ground never shows through as an empty half-cell.

Ruled grids are built by setting a rule-coloured background on the grid container and a `1px` gap between cells, so the divider is the ground showing through rather than a border on each cell. This is how the record strip, the operations legend, the metric blocks, and the capability key are all constructed.

Breakpoints are Tailwind's defaults: `sm` 640px, `md` 768px, `lg` 1024px. The responsive collapse is declared per component, not global:
- The isometric drawing is replaced below `md` by a ruled vertical stack of the same zones, in declared priority order, because labels collide and the depth read is lost on a phone.
- Pipelines stack vertically below `sm` with the connector arrow rotated 90°, so a sequence never becomes a wrapped row whose reading order must be guessed.
- Nav links collapse below `md` into a right-hand sheet; the header CTA appears only at `lg`.
- 12-column splits stack in source order; sheet padding and gutters are the only values that change with width.

Scroll padding is `5.5rem` so anchored sheets clear the sticky 56px header. Smooth scrolling is enabled only under `prefers-reduced-motion: no-preference`.

## Elevation & Depth

**There are no shadows on the page surface.** Depth is drawn, not simulated: plane slabs and service plates carry real isometric extrusion with distinct east and south faces, the grid is a real repeating linear-gradient, the ghost field is a real hatch, and separation between surfaces is a hairline rule or a one-pixel grid gap. No gradient text, no faked physicality, no elevation-by-tint.

The one exception is scoped and structural: elements portalled **out of the document flow** — the modal dialog, the theme dropdown, and the toast — carry a single deep, diffuse, straight-down shadow. It exists to say "this layer is not part of the sheet", which the drawn depth vocabulary cannot say. It never appears on an in-page surface, and it is never a hard offset shadow.

### Shadow Vocabulary
- **Detached layer, large** (`box-shadow: 0 28px 70px -24px rgb(11 31 51 / 0.5)`): the centred modal dialog only.
- **Detached layer, small** (`box-shadow: 0 18px 44px -18px rgb(11 31 51 / 0.45)`): the theme dropdown and the toast.

Both are tinted with the navy ink rather than black. The right-hand navigation sheet takes a left border instead of a shadow, because it is anchored to an edge.

### Named Rules
**The Drawn Depth Rule.** If a surface is part of the sheet, its depth is drawn — extrusion, hairline, or hatch. A shadow on an in-page surface is a bug.

**The Detached Layer Exception.** A shadow is permitted only on a node portalled out of flow, only as a soft straight-down diffusion in navy, and only from the two values above. A new shadow value is a new layer type; there are two, and there should not be a third.

## Shapes

**Square by system.** The default radius is `0` — buttons, plates, cells, chips, dialogs, inputs, the toast, and every ruled container have hard corners. Borders are single-pixel and carry the separating work.

Three curves exist, each earned:
- **Callout discs** (`9999px`, 24–28px): the numbered operation markers on the rail and in the record. A circle is the drafting convention for a keyed callout.
- **Status and impact dots** (`9999px`, 6px): the "current" indicator and case-study impact bullets.
- **The measurement nub** (`3px` on the outer end of each proportion span, `1px` on the inner): a hairline softening so the bar reads as a drawn measure with ends rather than two abutting blocks.

The recurring silhouette beyond that is the **rotated square** (`45°`, 6px) used as the evidence marker in the capability key — filled with Signal when shipped, hollow with a Strong Hairline stroke when not.

The icon family is a single authored set: 24×24 grid, 1.75 stroke, round caps and joins, no fills, `vectorEffect="non-scaling-stroke"` so weight holds constant when projected isometrically. Interface arrows and controls use the same 24×24 grid at 1.5–2.5 stroke. There are no glyph icons and no icon-font characters anywhere.

## Components

### Buttons
- **Shape:** Hard square corners (0 radius), no exceptions.
- **Primary:** Signal ground with Signal Ink text, `16px 20px` padding, 12–13px Archivo semibold, uppercase, wide tracking, with a 14px arrow glyph trailing. Used for "Book a call" and "Download resume".
- **Hover / Focus:** Colour swap only — primary goes to Ink on paper, to On-Field on navy; there is no lift, scale, or shadow. Transitions are colour-only. Focus is the global 2px Signal ring at 3px offset, inverted to On-Field inside `.on-field`.
- **Secondary:** Plate ground with Ink text, same metrics, hovering to Paper. Sits flush beside the primary separated by a single hairline gap.
- **Outline (case study trigger):** 1px Ink border on Plate, `12px 20px`, inverting to Ink ground with Plate text on hover; its trailing arrow nudges 2px right on hover and holds still under reduced motion. On navy the same control is On-Field ground going to Signal.
- **Icon button:** 36–40px square, 1px Hairline border, Drafting Ink glyph; border and glyph both go to Ink on hover.

### Cards / Containers
There are no cards. The equivalents are:
- **Plate blocks:** Plate ground, 1px Hairline border, `24–36px` padding, square corners, no shadow.
- **Ruled cell grids:** rule-coloured ground with 1px gaps; each cell paints its own ground and takes `14–16px × 20px` padding. Used for the record strip, operations legend, metric blocks, and capability key.
- **Field blocks:** Navy ground with Field Hairline border and `.on-field` set, for content that belongs to the drawing rather than the prose.

### Navigation
Sticky, 56px tall, Paper at 92% with a backdrop blur, closed by a Hairline bottom rule. It sits on paper above the navy field rather than floating over it, so it never has to stay legible against two grounds. Links are 12px Archivo semibold uppercase with wide tracking, Drafting Ink at rest and Ink when active or hovered; the active link carries a 2px Signal rule at its foot that springs between links (stiffness 380, damping 30) and jumps instantly under reduced motion. Below `md` links collapse into a right-hand sheet; the header CTA appears at `lg`.

### Dialogs
Centred, `max-w-2xl`, `max-h-86vh`, Plate ground, 1px Hairline border, square corners, `24px` padding opening to `36px` at `md`, over a 70% navy overlay. Deliberately un-animated on open and close. The close control is a 32px bordered square in the top-right corner.

### The Estate Diagram (signature)
The isometric drawing is a single projection system, not hand-placed geometry. Grid unit `30px`; the projection maps grid space to screen with `cos(30°)` horizontal run and `0.5` vertical rise per step. Zone planes are 15 units wide by 3.6 deep with a 0.2 slab thickness, dropped 4.8 units apart so a plane never paints over the plate labels of the plane above it. Service plates are 1.4 units square, 0.26 thick, spaced 1.6 apart and centred across the plane so a two-node zone still reads balanced. Bodies are drawn for every plane first, then every label on top, so no plate paints over its neighbour's word.

The **lineweight hierarchy is fixed**: object rules (plane faces) `1.9`; plate edges `1.4`; the rail and its terminators `1.5`; dimension and depth dashes `0.6`; leader lines `0.75`. Heavier means "this is an object"; lighter means "this is a measurement about an object".

### Named Rules
**The Leader Hangs Down-Left Rule.** Diagram annotation hangs down and to the LEFT off a shouldered leader — an isometric run that flattens to a horizontal shoulder before meeting the text, which is how a drafted leader meets its note. The quantity rides inline on the label's own line, in On-Field Signal at weight 600. Never centre a label under a plate; never break the quantity onto a detached second line. Labels carry a knocked-out navy halo (3.5 stroke, paint-order stroke) so the word never fights an edge beneath it.

**The Removed Share Rule.** A proportion bar draws the whole measured field. The **removed** share is the solid Signal span so it matches the headline figure beside it; the remainder is the ghost hatch. The denominator is always stated inline, and all three legend cells — removed, still costs, measured against — must name the same category of quantity. The bar itself is `aria-hidden` because every value it encodes is written out in the list beside it.

**The Evidence Marker Rule.** A filled marker means "appears in the work documented on this page" — never a self-assessed proficiency rating, never a skill bar, never a star. Shipped items sort above unshipped within their group with original order preserved inside each half, the group header carries a plain `n of m shipped` tally, and **both** marker states are named in a key. A marker state that isn't keyed is a state the reader has to guess.

### Motion
One authored moment: the estate energises as the sheet lands. Planes settle up 18px over 760ms, the rail draws its 520-unit dash over 900ms, and callout discs land from 70% scale over 420ms — all on `cubic-bezier(0.16, 0.84, 0.3, 1)`, staggered 110ms per plane and 480ms + 110n for the discs. Popups use 140ms in / 110ms out; toasts 220ms / 160ms. State changes (dimming a plane, filling a disc, swapping a colour) run 300–500ms.

**The Resting State Is Default Rule.** Every animated element's resting state IS its default style; animations run `backwards` from a `from` keyframe. Content is fully present with JavaScript off, with motion reduced, and before any animation runs. Under `prefers-reduced-motion: reduce` every keyframe animation is cancelled outright, not shortened.

## Do's and Don'ts

### Do:
- **Do** separate surfaces with a hairline rule or a 1px gap over a rule-coloured ground. That is the system's only divider.
- **Do** keep `--signal` and `--signal-field` as two separate declarations, and paint each only on its own ground.
- **Do** set annotation, legends, dates, quantities, and title-block field labels in Azeret Mono, and everything spoken — prose and interface chrome — in Archivo.
- **Do** draw depth as isometric extrusion, real gradients, and real hatches.
- **Do** state the denominator whenever a proportion is drawn, and keep all three legend cells naming the same category of quantity.
- **Do** hang diagram annotation down-left off a shouldered leader with the quantity inline on the label's line.
- **Do** keep the lineweight hierarchy: objects heavy (1.9 / 1.4), measurements light (0.75 / 0.6).
- **Do** sort shipped items above unshipped and key both marker states.
- **Do** make every animated element's resting state its default, and cancel animation entirely under reduced motion.
- **Do** replace the isometric drawing with the ruled zone stack below `md` rather than scaling it down.

### Don't:
- **Don't** put a shadow on any in-page surface. Shadows are permitted only on portalled layers, only from the two recorded values.
- **Don't** use a hard offset shadow, a gradient fill on text, or any simulated physicality anywhere.
- **Don't** put a kicker, eyebrow, or label line above a heading. If the status matters, make it a field in an evidence block.
- **Don't** round a corner. The only curves are callout discs, 6px status dots, and the 3px measurement nub.
- **Don't** draw the *remaining* share as the solid span — it inverts the claim the headline makes.
- **Don't** treat the evidence marker as a proficiency rating, and never ship a skill bar, percentage, or star scale.
- **Don't** use Azeret Mono for prose, buttons, nav, or the footer, and don't render code or terminal motifs at all.
- **Don't** add a glyph-font icon or a borrowed icon set; the 24×24 / 1.75-stroke family is the only hand.
- **Don't** lay the capability key out in two columns — the ruled ground shows through as an empty half-cell.
- **Don't** set `scrollbar-gutter: stable`; Radix's scroll lock already pads the body and the two together shift centred content ~7px.
