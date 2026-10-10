"use client";

import { Icon } from "@/components/icons";
import type { Estate, EstateNode } from "@/types/resume";

/*
 * The estate drawn as a reference architecture: four zone planes in isometric
 * projection, service plates standing on them, and the automation rail running
 * down the left edge with a numbered callout on every operation.
 *
 * Everything below is derived from one projection so the drawing stays
 * editable as data rather than as hand-tuned path coordinates.
 */
const U = 30; // grid unit, in px
const CX = Math.cos(Math.PI / 6); // 0.8660 — horizontal run of one grid step
const CY = 0.5; // vertical rise of one grid step
const PLANE_W = 15; // plane width, in grid units (along +x)
const PLANE_D = 3.6; // plane depth, in grid units (along +y)
/*
 * Planes are wide and shallow, and dropped far enough apart that a plane never
 * paints over the plate labels of the plane above it — the failure that turns
 * an isometric stack into an unreadable pile.
 */
const PLANE_DROP = 4.8; // vertical distance between stacked planes
const PLANE_H = 0.2; // plane slab thickness, so a zone reads as a solid
const TILE = 1.4; // service plate footprint
const TILE_H = 0.26; // plate thickness
const GAP = 1.6; // gap between plates on a plane
const RAIL_X = -155;

/** Grid coordinates to screen coordinates. `z` lifts a point off the ground. */
function iso(x: number, y: number, z = 0): [number, number] {
  return [(x - y) * CX * U, (x + y) * CY * U - z * U];
}

const pt = ([x, y]: [number, number]) => `${x.toFixed(1)},${y.toFixed(1)}`;
const poly = (points: [number, number][]) => points.map(pt).join(" ");

/** Screen elevation of plane `i` — planes descend as the index grows. */
const planeZ = (i: number) => -i * PLANE_DROP;

/** Plates are centred across the plane, so a 2-node zone still reads balanced. */
function tileX(index: number, count: number) {
  const span = count * TILE + (count - 1) * GAP;
  return (PLANE_W - span) / 2 + index * (TILE + GAP);
}

/**
 * Projects a flat 24×24 icon onto an isometric top face. The matrix maps the
 * icon's local +x onto the grid's +x axis and its +y onto the grid's +y axis;
 * the translate lands the icon's centre (12,12) on the plate's centre.
 */
function iconMatrix(cx: number, cy: number) {
  const k = U / 24; // one icon spans exactly one grid unit
  const a = CX * k;
  const b = CY * k;
  return `matrix(${a.toFixed(4)},${b.toFixed(4)},${(-a).toFixed(4)},${b.toFixed(4)},${cx.toFixed(1)},${(cy - b * 24).toFixed(1)})`;
}

/*
 * A plate renders in two passes. Bodies are drawn for every plane first, then
 * every label on top: drawn together, the next plate in reading order paints
 * over the previous plate's label and eats the end of the word.
 */
function PlateBody({
  node,
  x,
  y,
  z,
  dimmed,
}: {
  node: EstateNode;
  x: number;
  y: number;
  z: number;
  dimmed: boolean;
}) {
  const top: [number, number][] = [
    iso(x, y, z),
    iso(x + TILE, y, z),
    iso(x + TILE, y + TILE, z),
    iso(x, y + TILE, z),
  ];
  // The two faces the viewer can see: east (max x) and south (max y).
  const east: [number, number][] = [
    iso(x + TILE, y, z),
    iso(x + TILE, y + TILE, z),
    iso(x + TILE, y + TILE, z - TILE_H),
    iso(x + TILE, y, z - TILE_H),
  ];
  const south: [number, number][] = [
    iso(x, y + TILE, z),
    iso(x + TILE, y + TILE, z),
    iso(x + TILE, y + TILE, z - TILE_H),
    iso(x, y + TILE, z - TILE_H),
  ];

  const [cx, cy] = iso(x + TILE / 2, y + TILE / 2, z);

  return (
    <g
      className="transition-opacity duration-500 ease-out"
      opacity={dimmed ? 0.28 : 1}
    >
      <polygon points={poly(east)} fill="var(--plate-east)" />
      <polygon points={poly(south)} fill="var(--plate-south)" />
      <polygon
        points={poly(top)}
        fill="var(--plate-top)"
        stroke="var(--plate-edge)"
        strokeWidth="1.4"
      />
      <g style={{ color: "var(--field)" }}>
        <Icon name={node.icon} transform={iconMatrix(cx, cy)} />
      </g>
    </g>
  );
}

/** The annotation for one plate, drawn after every plate body on the sheet. */
function PlateLabel({
  node,
  x,
  y,
  z,
  dimmed,
}: {
  node: EstateNode;
  x: number;
  y: number;
  z: number;
  dimmed: boolean;
}) {
  const [lx, ly] = iso(x + TILE, y + TILE, z - TILE_H);

  /*
   * Labels hang down-LEFT off a short leader rather than sitting centred under
   * the plate. The next plate along +x begins only ~3px below the current
   * plate's south corner, so a centred label runs straight under it; leftward
   * is the one direction the isometric leaves free.
   */
  return (
    <g
      className="transition-opacity duration-500 ease-out"
      opacity={dimmed ? 0.28 : 1}
    >
      {/* Leader with a landing shoulder: the run leaves the plate on the
          isometric angle, then flattens so the text sits on a horizontal,
          which is how a drafted leader meets its note. */}
      <polyline
        points={`${lx},${ly} ${lx - 13},${ly + 9} ${lx - 21},${ly + 9}`}
        fill="none"
        stroke="var(--on-field-2)"
        strokeWidth="0.75"
      />
      <text
        x={lx - 25}
        y={ly + 12.5}
        textAnchor="end"
        // A knocked-out halo, the way a drafter masks a leader label where it
        // crosses the drawing, so the word never fights an edge underneath it.
        stroke="var(--field)"
        strokeWidth="3.5"
        strokeLinejoin="round"
        paintOrder="stroke"
        className="font-annot fill-on-field"
        fontSize="10.5"
        letterSpacing="0.02em"
      >
        {node.label}
        {/* The quantity rides the same line as its label — as a second line it
            hung unattached to the leader and could land on a plane edge. */}
        {node.meta && (
          <tspan className="fill-signal-field" fontWeight="600">
            {" "}
            {node.meta}
          </tspan>
        )}
      </text>
    </g>
  );
}

interface EstateDiagramProps {
  estate: Estate;
  activePlane: string | null;
}

export function EstateDiagram({ estate, activePlane }: EstateDiagramProps) {
  const planeIndex = new Map(estate.planes.map((p, i) => [p.id, i]));

  return (
    <svg
      viewBox="-200 -34 838 766"
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label="Isometric reference architecture of the production estate: a client edge plane above an Azure virtual desktop plane, an AWS workload plane and an AI services plane, with an automation and control rail running down the left carrying four numbered operations."
    >
      {/* Automation rail — the control path every numbered operation runs on */}
      <g className="energize-rail" style={{ ["--rail-length" as string]: "520" }}>
        <line
          x1={RAIL_X}
          y1={16}
          x2={RAIL_X}
          y2={524}
          stroke="var(--signal-field)"
          strokeWidth="1.5"
          strokeDasharray="520"
        />
      </g>
      <line
        x1={RAIL_X - 7}
        y1={16}
        x2={RAIL_X + 7}
        y2={16}
        stroke="var(--signal-field)"
        strokeWidth="1.5"
      />
      <line
        x1={RAIL_X - 7}
        y1={524}
        x2={RAIL_X + 7}
        y2={524}
        stroke="var(--signal-field)"
        strokeWidth="1.5"
      />
      <text
        transform={`rotate(-90, ${RAIL_X - 16}, 270)`}
        x={RAIL_X - 16}
        y={270}
        textAnchor="middle"
        className="font-annot fill-on-field-2"
        fontSize="10"
        letterSpacing="0.16em"
      >
        {estate.rail.label.toUpperCase()}
      </text>

      {estate.planes.map((plane, i) => {
        const z = planeZ(i);
        const dimmed = activePlane !== null && activePlane !== plane.id;
        const corners: [number, number][] = [
          iso(0, 0, z),
          iso(PLANE_W, 0, z),
          iso(PLANE_W, PLANE_D, z),
          iso(0, PLANE_D, z),
        ];
        const [labelX, labelY] = iso(PLANE_W, 0, z);

        return (
          <g
            key={plane.id}
            className="energize-plane"
            style={{ ["--stagger" as string]: `${i * 110}ms` }}
          >
            <g
              className="transition-opacity duration-500 ease-out"
              opacity={dimmed ? 0.4 : 1}
            >
              {/* Slab edges, so a zone reads as a solid rather than a sheet */}
              <polygon
                points={poly([
                  iso(PLANE_W, 0, z),
                  iso(PLANE_W, PLANE_D, z),
                  iso(PLANE_W, PLANE_D, z - PLANE_H),
                  iso(PLANE_W, 0, z - PLANE_H),
                ])}
                fill="var(--plane-east)"
              />
              <polygon
                points={poly([
                  iso(0, PLANE_D, z),
                  iso(PLANE_W, PLANE_D, z),
                  iso(PLANE_W, PLANE_D, z - PLANE_H),
                  iso(0, PLANE_D, z - PLANE_H),
                ])}
                fill="var(--plane-south)"
              />
              <polygon
                points={poly(corners)}
                fill="var(--plane-face)"
                stroke="var(--plane-edge)"
                strokeWidth="1.9"
              />
              {/* Ruled depth line — the plane reads as a surveyed surface */}
              <line
                x1={iso(0, PLANE_D / 2, z)[0]}
                y1={iso(0, PLANE_D / 2, z)[1]}
                x2={iso(PLANE_W, PLANE_D / 2, z)[0]}
                y2={iso(PLANE_W, PLANE_D / 2, z)[1]}
                stroke="var(--plane-edge)"
                strokeWidth="0.6"
                strokeDasharray="3 5"
              />
            </g>

            <text
              x={labelX + 22}
              y={labelY - 2}
              className="font-annot fill-on-field transition-opacity duration-500"
              fontSize="11"
              fontWeight="600"
              letterSpacing="0.12em"
              opacity={dimmed ? 0.4 : 1}
            >
              {plane.label.toUpperCase()}
            </text>
            <text
              x={labelX + 22}
              y={labelY + 14}
              className="font-annot fill-on-field-2 transition-opacity duration-500"
              fontSize="10"
              opacity={dimmed ? 0.4 : 1}
            >
              {plane.note}
            </text>
            <line
              x1={labelX + 6}
              y1={labelY - 13}
              x2={labelX + 16}
              y2={labelY - 13}
              stroke="var(--rule-field)"
              strokeWidth="1"
            />

          </g>
        );
      })}

      {/* Every plate body, then every plate label, so no word gets painted over */}
      {estate.planes.map((plane, i) => (
        <g
          key={`bodies-${plane.id}`}
          className="energize-plane"
          style={{ ["--stagger" as string]: `${i * 110}ms` }}
        >
          {plane.nodes.map((node, n) => (
            <PlateBody
              key={node.id}
              node={node}
              x={tileX(n, plane.nodes.length)}
              y={(PLANE_D - TILE) / 2}
              z={planeZ(i)}
              dimmed={activePlane !== null && activePlane !== plane.id}
            />
          ))}
        </g>
      ))}

      {estate.planes.map((plane, i) => (
        <g
          key={`labels-${plane.id}`}
          className="energize-plane"
          style={{ ["--stagger" as string]: `${i * 110}ms` }}
        >
          {plane.nodes.map((node, n) => (
            <PlateLabel
              key={node.id}
              node={node}
              x={tileX(n, plane.nodes.length)}
              y={(PLANE_D - TILE) / 2}
              z={planeZ(i)}
              dimmed={activePlane !== null && activePlane !== plane.id}
            />
          ))}
        </g>
      ))}

      {/* Numbered operation callouts, stacked on the rail beside their plane */}
      {estate.planes.map((plane) => {
        const i = planeIndex.get(plane.id) ?? 0;
        const onThisPlane = estate.flows.filter((f) => f.plane === plane.id);
        const [cornerX, cornerY] = iso(0, PLANE_D, planeZ(i));

        return onThisPlane.map((flow, j) => {
          const discY = cornerY + (j - (onThisPlane.length - 1) / 2) * 40;
          const active = activePlane === plane.id;
          return (
            <g
              key={flow.n}
              className="energize-disc"
              style={{ ["--stagger" as string]: `${480 + flow.n * 110}ms` }}
            >
              <line
                x1={RAIL_X + 13}
                y1={discY}
                x2={cornerX - 4}
                y2={cornerY}
                stroke="var(--signal-field)"
                strokeWidth="0.75"
                strokeDasharray="3 4"
                opacity={active ? 1 : 0.55}
                className="transition-opacity duration-500"
              />
              <circle
                cx={RAIL_X}
                cy={discY}
                r="13"
                fill={active ? "var(--signal-field)" : "var(--field)"}
                stroke="var(--signal-field)"
                strokeWidth="1.5"
                className="transition-[fill] duration-300"
              />
              <text
                x={RAIL_X}
                y={discY + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                className="font-annot transition-[fill] duration-300"
                fill={active ? "var(--signal-field-ink)" : "var(--signal-field)"}
              >
                {flow.n}
              </text>
            </g>
          );
        });
      })}
    </svg>
  );
}

/**
 * Narrow-width projection of the same estate. The isometric drawing does not
 * survive a phone — labels collide and the planes lose their depth read — so
 * below `md` the zones collapse, by declared priority, into ruled plates.
 */
export function EstateStack({
  estate,
  activePlane,
}: {
  estate: Estate;
  activePlane: string | null;
}) {
  return (
    <ol className="space-y-px border-y border-rule-field">
      {estate.planes.map((plane) => {
        const flows = estate.flows.filter((f) => f.plane === plane.id);
        const dimmed = activePlane !== null && activePlane !== plane.id;
        return (
          <li
            key={plane.id}
            className={`bg-field-2 px-4 py-4 transition-opacity duration-500 ${
              dimmed ? "opacity-40" : "opacity-100"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-annot text-[11px] font-semibold uppercase tracking-[0.12em] text-on-field">
                {plane.label}
              </h3>
              {flows.length > 0 && (
                <span className="flex shrink-0 gap-1">
                  {flows.map((f) => (
                    <span
                      key={f.n}
                      className="flex size-5 items-center justify-center rounded-full border border-signal-field font-annot text-[10px] font-semibold text-signal-field"
                    >
                      {f.n}
                    </span>
                  ))}
                </span>
              )}
            </div>
            <p className="mt-1 font-annot text-[11px] leading-relaxed text-on-field-2">
              {plane.note}
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {plane.nodes.map((node) => (
                <li key={node.id} className="flex items-center gap-1.5">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-4 shrink-0 text-signal-field"
                  >
                    <Icon name={node.icon} />
                  </svg>
                  <span className="font-annot text-[11px] text-on-field">
                    {node.label}
                    {node.meta && (
                      <span className="ml-1 font-semibold text-signal-field">{node.meta}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}
