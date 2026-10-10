import type { CSSProperties } from "react";
import { resume } from "@/lib/resume-data";
import { tech } from "@/lib/tech";
import { litBy } from "@/lib/trace";
import { layoutTopology, type PlacedNode } from "@/components/hero/topology-layout";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/*
 * Type sizes are in viewBox units. The map renders at ~0.91× in the xl split
 * column (its narrowest), so every size here is chosen to land at 11px or
 * more on screen: 12.5 → ~11.4px, 14 → ~12.7px.
 */
const SIZE = { lane: 12.5, chip: 13.5, zone: 13.5, note: 12.5, label: 14, meta: 12.5 };

function Dot({ x, y, techId }: { x: number; y: number; techId?: PlacedNode["tech"] }) {
  const color = techId ? tech[techId].color : undefined;
  return <circle cx={x} cy={y} r={3.5} className={color ? undefined : "fill-ink-3"} fill={color} />;
}

function NodeMark({ node, litIds }: { node: PlacedNode; litIds: string }) {
  const { x, y, w, h } = node;
  const chip = node.variant === "chip";
  return (
    <g data-lit-by={litIds} className="group">
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        className="fill-canvas stroke-line-strong transition-[fill,stroke] duration-200 group-data-lit:fill-accent-soft group-data-lit:stroke-accent"
        strokeWidth={1}
      />
      <Dot x={x + 12} y={chip ? y + h / 2 : y + 13} techId={node.tech} />
      <text x={x + 22} y={chip ? y + h / 2 + 4.75 : y + 17} className="fill-ink font-sans" fontSize={chip ? SIZE.chip : SIZE.label}>
        {node.label}
      </text>
      {!chip && node.meta && (
        <text x={x + 22} y={y + 29.5} className="fill-ink-3 font-sans" fontSize={SIZE.meta}>
          {node.meta}
        </text>
      )}
    </g>
  );
}

/**
 * The service map: build tools over three sibling workloads over observe
 * tools. Server-rendered SVG; Trace lights it by toggling `data-lit` from the
 * TraceProvider, and the load sequence is CSS only (see `.topo-in` /
 * `.topo-draw` in globals.css).
 */
export function Topology() {
  const { estate } = resume;
  const layout = layoutTopology(estate);
  const lit = litBy(estate);
  const by = (id: string) => lit.get(id)?.join(" ") ?? "";

  const buildIds = new Set(layout.lanes.find((l) => l.id === "build")?.nodes.map((n) => n.id));
  const buildEdges = layout.edges.filter((e) => e.kind === "control" && buildIds.has(e.from));
  const observeEdges = layout.edges.filter((e) => e.kind === "control" && !buildIds.has(e.from));
  const dataEdges = layout.edges.filter((e) => e.kind === "data");
  const delayOf = (key: string) => {
    const b = buildEdges.findIndex((e) => e.key === key);
    if (b >= 0) return 360 + b * 40;
    const o = observeEdges.findIndex((e) => e.key === key);
    if (o >= 0) return 520 + o * 50;
    return 440 + dataEdges.findIndex((e) => e.key === key) * 25;
  };

  return (
    <svg viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true" className="block h-auto w-full">
      {layout.lanes.map((lane, i) => (
        <g key={lane.id} className="topo-in" style={{ "--d": `${i * 160}ms` } as Vars}>
          <rect x={lane.x + 0.5} y={lane.y + 0.5} width={lane.w - 1} height={lane.h - 1} rx={8} className="fill-surface-2 stroke-line" />
          <text x={lane.x + 14} y={lane.y + 17} className="fill-ink-3 font-sans" fontSize={SIZE.lane} fontWeight={500}>
            {lane.label}
          </text>
          {lane.nodes.map((node) => (
            <NodeMark key={node.id} node={node} litIds={by(node.id)} />
          ))}
        </g>
      ))}

      {layout.zones.map((zone, i) => (
        <g key={zone.id} className="topo-in" style={{ "--d": `${60 + i * 60}ms` } as Vars}>
          <g data-lit-by={by(zone.id)} className="group">
            <rect
              x={zone.x + 0.5}
              y={zone.y + 0.5}
              width={zone.w - 1}
              height={zone.h - 1}
              rx={8}
              className="fill-surface-2 stroke-line transition-[stroke] duration-200 group-data-lit:stroke-accent/45"
            />
            {zone.tech && <Dot x={zone.x + 15} y={zone.y + 15} techId={zone.tech} />}
            <text
              x={zone.x + (zone.tech ? 25 : 12)}
              y={zone.y + 20}
              className="fill-ink-2 font-sans"
              fontSize={SIZE.zone}
              fontWeight={500}
            >
              {zone.label}
            </text>
            <text x={zone.x + 12} y={zone.y + 37} className="fill-ink-3 font-sans" fontSize={SIZE.note}>
              {zone.note}
            </text>
          </g>
          {zone.nodes.map((node) => (
            <NodeMark key={node.id} node={node} litIds={by(node.id)} />
          ))}
        </g>
      ))}

      {layout.edges.map((edge) => (
        <path
          key={edge.key}
          d={edge.d}
          fill="none"
          strokeWidth={edge.kind === "control" ? 1 : 1.25}
          data-lit-by={by(edge.key)}
          className={`topo-draw ${edge.kind === "control" ? "stroke-line-strong" : "stroke-ink-3"} data-lit:stroke-accent`}
          style={{ "--len": edge.length, "--d": `${delayOf(edge.key)}ms` } as Vars}
        />
      ))}
    </svg>
  );
}
