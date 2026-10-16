import type { Diagram } from "@/types/diagram";
import { DiagramList } from "@/components/diagram/diagram-list";
import { DiagramSvg } from "@/components/diagram/diagram-svg";
import { TraceCaption, type TraceStep } from "@/components/diagram/trace-caption";
import { phoneView } from "@/components/diagram/geometry";
import { TraceButton } from "@/components/hero/trace-button";
import { traceChip } from "@/components/hero/trace-chip";
import { TraceProvider } from "@/components/hero/trace-provider";
import { diagramLitBy } from "@/lib/trace";
import { getProject } from "@/lib/work";

/**
 * An architecture figure: chips that light a step of the story (each of the
 * case study's figures, then any other step), the drawing from md up and its
 * phone layout below md, and the same diagram as text for screen readers.
 * Lighting works as on the home page's map: hover or focus previews, a tap
 * pins and is mirrored to ?trace=.
 */
export function ArchitectureDiagram({ id, diagram }: { id: string; diagram: Diagram }) {
  const litBy = diagramLitBy(diagram);
  const figures = getProject(id)?.figures ?? [];
  const steps: TraceStep[] = diagram.traces.map((t) => {
    const figure = figures.find((f) => f.value === t.figure);
    return figure
      ? { id: t.id, value: figure.value, caption: `${figure.label}. ${figure.provenance}` }
      : { id: t.id, caption: t.caption ?? "" };
  });
  return (
    <TraceProvider ids={diagram.traces.map((t) => t.id)}>
      <figure data-diagram={id} className="my-10 overflow-hidden rounded-2xl border border-line bg-surface-1">
        <figcaption className="border-b border-line px-5 py-3 text-sm font-medium text-ink-2">{diagram.title}</figcaption>
        {steps.length > 0 && (
          <div className="px-4 pt-4 md:px-5">
            <div role="group" aria-label="Light up part of the diagram" className="flex flex-wrap gap-2">
              {diagram.traces.map((t) => (
                <TraceButton key={t.id} id={t.id} className={`${traceChip} max-sm:px-3`}>
                  {t.figure && <span className="font-semibold">{t.figure}</span>} {t.label}
                </TraceButton>
              ))}
            </div>
            <TraceCaption steps={steps} hint="Pick one to light up the parts behind it." />
          </div>
        )}
        <div data-drawing="desktop" className="hidden p-1.5 md:block lg:p-2.5">
          <DiagramSvg id={id} diagram={diagram} litBy={litBy} />
        </div>
        {/* Capped so the 340-wide layout keeps near its drawn size on a large phone or a narrow tablet. */}
        <div data-drawing="phone" className="mx-auto max-w-104 p-1.5 md:hidden">
          <DiagramSvg id={`${id}-phone`} diagram={phoneView(diagram)} litBy={litBy} />
        </div>
        <DiagramList diagram={diagram} />
      </figure>
    </TraceProvider>
  );
}
