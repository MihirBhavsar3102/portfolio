import type { CSSProperties } from "react";
import { resume } from "@/lib/resume-data";
import { tech } from "@/lib/tech";
import { litBy } from "@/lib/trace";
import { layoutTopology, type PlacedNode } from "@/components/hero/topology-layout";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Splits a two-or-more-word label into two balanced lines. */
function twoLines(label: string): [string, string] {
  const words = label.split(" ");
  // Lighter first line: a short lead word, the rest beneath ("Concurrent" / "VDI users").
  const cut = Math.max(1, Math.floor(words.length / 2));
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}

function Dot({ x, y, techId }: { x: number; y: number; techId?: PlacedNode["tech"] }) {
  const color = techId ? tech[techId].color : undefined;
  return <circle cx={x} cy={y} r={3.5} className={color ? undefined : "fill-ink-3"} fill={color} />;
}

function NodeMark({ node, litIds }: { node: PlacedNode; litIds: string }) {
  const { x, y, w, h } = node;
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
      {node.variant === "count" ? (
        <>
          <text x={x + 10} y={y + 25} className="type-figure fill-ink font-sans" fontSize={19}>
            {node.meta}
          </text>
          {twoLines(node.label).map((line, i) => (
            <text key={line} x={x + 10} y={y + 39 + i * 11.5} className="fill-ink-3 font-sans" fontSize={10.5}>
              {line}
            </text>
          ))}
        </>
      ) : (
        <>
          <Dot x={x + 12} y={y + (node.variant === "chip" ? h / 2 : 14)} techId={node.tech} />
          <text
            x={x + 22}
            y={node.variant === "chip" ? y + h / 2 + 4.5 : y + 18}
            className="fill-ink font-sans"
            fontSize={node.variant === "chip" ? 12.5 : 13}
          >
            {node.label}
          </text>
          {node.variant === "service" && node.meta && (
            <text x={x + 22} y={y + 31} className="fill-ink-3 font-mono" fontSize={10.5}>
              {node.meta}
            </text>
          )}
        </>
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

  const buildEdges = layout.edges.filter((e) => e.kind === "control" && layout.lanes[0]?.nodes.some((n) => n.id === e.from));
  const observeEdges = layout.edges.filter((e) => e.kind === "control" && !buildEdges.includes(e));
  const dataEdges = layout.edges.filter((e) => e.kind === "data");
  const delayOf = (key: string) => {
    const b = buildEdges.findIndex((e) => e.key === key);
    if (b >= 0) return 360 + b * 40;
    const o = observeEdges.findIndex((e) => e.key === key);
    if (o >= 0) return 520 + o * 50;
    return 440 + dataEdges.findIndex((e) => e.key === key) * 25;
  };

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      aria-hidden="true"
      className="block h-auto w-full"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {layout.lanes.map((lane, i) => (
        <g key={lane.id} className="topo-in" style={{ "--d": `${i * 160}ms` } as Vars}>
          <rect x={lane.x + 0.5} y={lane.y + 0.5} width={lane.w - 1} height={lane.h - 1} rx={8} className="fill-surface-2 stroke-line" />
          <text x={lane.x + 14} y={lane.y + 20} className="fill-ink-3 font-sans" fontSize={11.5} fontWeight={500}>
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
            {zone.tech && <Dot x={zone.x + 15} y={zone.y + 16} techId={zone.tech} />}
            <text
              x={zone.x + (zone.tech ? 25 : 12)}
              y={zone.y + 20}
              className="fill-ink-2 font-sans"
              fontSize={12}
              fontWeight={500}
            >
              {zone.label}
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
