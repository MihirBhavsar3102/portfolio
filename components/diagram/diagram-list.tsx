import { tech, type TechId } from "@/lib/tech";
import type { Diagram, DiagramGroup, DiagramNode } from "@/types/diagram";
import { labelOf, readingOrder } from "@/components/diagram/geometry";

type Item =
  | { kind: "group"; group: DiagramGroup; x: number; y: number }
  | { kind: "node"; node: DiagramNode; x: number; y: number };

/** The groups and nodes directly inside `parent` (the top level when undefined), in reading order. */
function itemsIn(diagram: Diagram, parent?: string): Item[] {
  const groups = diagram.groups
    .filter((g) => g.parent === parent)
    .map((g): Item => ({ kind: "group", group: g, x: g.x, y: g.y }));
  const nodes = diagram.nodes
    .filter((n) => n.group === parent)
    .map((n): Item => ({ kind: "node", node: n, x: n.x, y: n.y }));
  return readingOrder([...groups, ...nodes]);
}

/** Pinned to the first line (20px line, 6px dot), so a wrapped item still reads as one entry. */
function Dot({ id }: { id?: TechId }) {
  const color = id ? tech[id].color : undefined;
  return (
    <span
      aria-hidden="true"
      className={`mt-1.75 size-1.5 shrink-0 rounded-full ${color ? "" : "bg-ink-3"}`}
      style={color ? { backgroundColor: color } : undefined}
    />
  );
}

function Items({ diagram, parent }: { diagram: Diagram; parent?: string }) {
  return (
    <ul className={parent ? "mt-1.5 space-y-1.5 border-l border-line pl-3" : "space-y-2.5"}>
      {itemsIn(diagram, parent).map((item) =>
        item.kind === "group" ? (
          <li key={item.group.id}>
            <p className="text-sm font-medium text-ink">
              {item.group.label}
              {item.group.note && <span className="font-normal text-ink-3"> · {item.group.note}</span>}
            </p>
            <Items diagram={diagram} parent={item.group.id} />
          </li>
        ) : (
          <li key={item.node.id} className="flex items-start gap-2 text-sm text-ink-2">
            <Dot id={item.node.tech} />
            <span>
              {item.node.label}
              {item.node.meta && <span className="text-ink-3"> · {item.node.meta}</span>}
            </span>
          </li>
        ),
      )}
    </ul>
  );
}

/**
 * The diagram as text: every group with what sits inside it, then every
 * connection. It replaces the drawing below md and is the drawing's text
 * equivalent for screen readers above it.
 */
export function DiagramList({ diagram }: { diagram: Diagram }) {
  return (
    <div className="space-y-4 px-4 py-4 md:sr-only">
      <Items diagram={diagram} />
      <div>
        <h3 className="text-sm font-medium text-ink">Connections</h3>
        <ul data-connections="" className="mt-1.5 space-y-1 text-sm text-ink-2">
          {diagram.edges.map((e) => (
            <li key={`${e.from}->${e.to}`} data-edge={`${e.from}->${e.to}`}>
              {labelOf(diagram, e.from)} <span aria-hidden="true" className="text-ink-3">→</span>
              <span className="sr-only">to</span> {labelOf(diagram, e.to)}
              {e.label && <span className="text-ink-3"> · {e.label}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
