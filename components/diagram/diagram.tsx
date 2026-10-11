import type { Diagram } from "@/types/diagram";
import { DiagramList } from "@/components/diagram/diagram-list";
import { DiagramSvg } from "@/components/diagram/diagram-svg";

/** An architecture figure: the drawing from md up, the same diagram as a list below it. */
export function ArchitectureDiagram({ id, diagram }: { id: string; diagram: Diagram }) {
  return (
    <figure data-diagram={id} className="my-8 overflow-hidden rounded-lg border border-line bg-surface-1">
      <figcaption className="border-b border-line px-4 py-2 text-sm font-medium text-ink-2">{diagram.title}</figcaption>
      <div className="hidden p-2.5 md:block">
        <DiagramSvg id={id} diagram={diagram} />
      </div>
      <DiagramList diagram={diagram} />
    </figure>
  );
}
