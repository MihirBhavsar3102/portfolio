import type { CSSProperties } from "react";
import { tech } from "@/lib/tech";
import { edgeKey } from "@/lib/trace";
import type { Diagram, DiagramNode } from "@/types/diagram";
import { GROUP_TEXT, SIZE, labelPoint, nodeRect, pathD } from "@/components/diagram/geometry";

function Node({ node, litIds }: { node: DiagramNode; litIds: string }) {
  const { x, y, w, h } = nodeRect(node);
  const color = node.tech ? tech[node.tech].color : undefined;
  const plain = !node.meta;
  return (
    <g data-node={node.id} data-lit-by={litIds} className="group">
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        className="fill-canvas stroke-line-strong group-data-lit:fill-accent-soft group-data-lit:stroke-accent"
        strokeWidth={1}
      />
      <circle cx={x + 12} cy={plain ? y + h / 2 : y + 14} r={3.5} className={color ? undefined : "fill-ink-3"} fill={color} />
      <text x={x + 22} y={plain ? y + h / 2 + 4.75 : y + 18} className="fill-ink font-sans" fontSize={SIZE.label}>
        {node.label}
      </text>
      {node.meta && (
        <text x={x + 22} y={y + 32.5} className="fill-ink-3 font-sans" fontSize={SIZE.meta}>
          {node.meta}
        </text>
      )}
    </g>
  );
}

/**
 * The drawing, server-rendered: dashed groups in the AWS-diagram convention,
 * canvas-cut nodes with a tech dot (as on the hero map), Ink Three arrows and
 * knocked-out edge labels. Every part carries data-lit-by (the steps that
 * light it) for the figure's Trace; a lit edge swaps to the persimmon arrow.
 * Hidden from assistive tech; DiagramList carries the same content as text.
 */
export function DiagramSvg({ id, diagram, litBy }: { id: string; diagram: Diagram; litBy: Map<string, string[]> }) {
  const arrow = `${id}-arrow`;
  const by = (key: string) => (litBy.get(key) ?? []).join(" ");
  const marker = (markerId: string, fill: string) => (
    <marker id={markerId} viewBox="0 0 8 8" refX={8} refY={4} markerWidth={7} markerHeight={7} markerUnits="userSpaceOnUse" orient="auto">
      <path d="M0 0 L8 4 L0 8 z" className={fill} />
    </marker>
  );
  return (
    <svg
      viewBox={`0 0 ${diagram.width} ${diagram.height}`}
      aria-hidden="true"
      className="block h-auto w-full"
      style={{ "--arrow-lit": `url(#${arrow}-lit)` } as CSSProperties}
    >
      <defs>
        {marker(arrow, "fill-ink-3")}
        {marker(`${arrow}-lit`, "fill-accent")}
      </defs>

      {diagram.groups.map((g) => (
        <g key={g.id} data-group={g.id} data-lit-by={by(g.id)} className="group">
          <rect
            x={g.x + 0.5}
            y={g.y + 0.5}
            width={g.w - 1}
            height={g.h - 1}
            rx={8}
            fill="none"
            className="stroke-line-graphic group-data-lit:stroke-accent"
            strokeDasharray="4 3"
          />
          <text
            x={g.x + GROUP_TEXT.x}
            y={g.y + GROUP_TEXT.label}
            className="fill-ink-2 font-sans group-data-lit:fill-accent"
            fontSize={SIZE.group}
            fontWeight={500}
          >
            {g.label}
          </text>
          {g.note && (
            <text x={g.x + GROUP_TEXT.x} y={g.y + GROUP_TEXT.note} className="fill-ink-3 font-sans" fontSize={SIZE.note}>
              {g.note}
            </text>
          )}
        </g>
      ))}

      {diagram.edges.map((e) => (
        <path
          key={edgeKey(e)}
          data-lit-by={by(edgeKey(e))}
          d={pathD(e.path)}
          fill="none"
          className="stroke-ink-3 data-lit:stroke-accent data-lit:[marker-end:var(--arrow-lit)]"
          strokeWidth={1.25}
          markerEnd={`url(#${arrow})`}
        />
      ))}

      {diagram.nodes.map((n) => (
        <Node key={n.id} node={n} litIds={by(n.id)} />
      ))}

      {diagram.edges
        .filter((e) => e.label)
        .map((e) => {
          const [x, y] = labelPoint(e.path, e.labelAt);
          return (
            <text
              key={`${edgeKey(e)}-label`}
              data-edge-label=""
              data-lit-by={by(edgeKey(e))}
              x={x}
              y={y + 4.5}
              textAnchor="middle"
              className="fill-ink-2 stroke-surface-1 font-sans data-lit:fill-accent"
              fontSize={SIZE.edge}
              strokeWidth={6}
              strokeLinejoin="round"
              paintOrder="stroke"
            >
              {e.label}
            </text>
          );
        })}
    </svg>
  );
}
