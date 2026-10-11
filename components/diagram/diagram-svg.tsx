import { tech } from "@/lib/tech";
import type { Diagram, DiagramNode } from "@/types/diagram";
import { GROUP_TEXT, SIZE, labelPoint, nodeRect, pathD } from "@/components/diagram/geometry";

function Node({ node }: { node: DiagramNode }) {
  const { x, y, w, h } = nodeRect(node);
  const color = node.tech ? tech[node.tech].color : undefined;
  const plain = !node.meta;
  return (
    <g data-node={node.id}>
      <rect x={x} y={y} width={w} height={h} rx={6} className="fill-canvas stroke-line-strong" strokeWidth={1} />
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
 * knocked-out edge labels. Hidden from assistive tech; DiagramList carries the
 * same content as text.
 */
export function DiagramSvg({ id, diagram }: { id: string; diagram: Diagram }) {
  const arrow = `${id}-arrow`;
  return (
    <svg viewBox={`0 0 ${diagram.width} ${diagram.height}`} aria-hidden="true" className="block h-auto w-full">
      <defs>
        <marker
          id={arrow}
          viewBox="0 0 8 8"
          refX={8}
          refY={4}
          markerWidth={7}
          markerHeight={7}
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 z" className="fill-ink-3" />
        </marker>
      </defs>

      {diagram.groups.map((g) => (
        <g key={g.id} data-group={g.id}>
          <rect
            x={g.x + 0.5}
            y={g.y + 0.5}
            width={g.w - 1}
            height={g.h - 1}
            rx={8}
            fill="none"
            className="stroke-line-strong"
            strokeDasharray="4 3"
          />
          <text x={g.x + GROUP_TEXT.x} y={g.y + GROUP_TEXT.label} className="fill-ink-2 font-sans" fontSize={SIZE.group} fontWeight={500}>
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
          key={`${e.from}->${e.to}`}
          d={pathD(e.path)}
          fill="none"
          className="stroke-ink-3"
          strokeWidth={1.25}
          markerEnd={`url(#${arrow})`}
        />
      ))}

      {diagram.nodes.map((n) => (
        <Node key={n.id} node={n} />
      ))}

      {diagram.edges
        .filter((e) => e.label)
        .map((e) => {
          const [x, y] = labelPoint(e.path, e.labelAt);
          return (
            <text
              key={`${e.from}->${e.to}-label`}
              data-edge-label=""
              x={x}
              y={y + 4.5}
              textAnchor="middle"
              className="fill-ink-2 stroke-surface-1 font-sans"
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
