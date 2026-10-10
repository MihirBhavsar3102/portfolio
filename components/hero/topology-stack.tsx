import { resume } from "@/lib/resume-data";
import { tech } from "@/lib/tech";
import { litBy } from "@/lib/trace";

/**
 * The service map below `md`: the three workloads as a compact ruled strip
 * instead of a shrunken drawing — each with its note, its services, and the
 * tools that build and watch it. It sits between the actions and the proof
 * ledger, so a phone's first screens still show the estate, and it carries
 * the same `data-lit-by` marks so Trace lights it.
 */
export function TopologyStack() {
  const { estate } = resume;
  const lit = litBy(estate);
  const by = (id: string) => lit.get(id)?.join(" ") ?? "";
  const tools = new Map(estate.controlPlane.flatMap((l) => l.nodes.map((n) => [n.id, { node: n, lane: l.id }] as const)));

  return (
    <section aria-labelledby="map-heading" className="mt-10 md:hidden">
      <h2 id="map-heading" className="mb-3 text-base font-semibold text-ink">
        Service map
      </h2>
      <ol className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface-1">
        {estate.zones.map((zone) => {
          const feeding = estate.edges.filter((e) => e.to === zone.id && tools.has(e.from)).map((e) => tools.get(e.from)!);
          return (
            <li key={zone.id} className="px-4 py-3.5">
              <p data-lit-by={by(zone.id)} className="flex items-center gap-2 text-sm font-medium text-ink">
                {zone.tech && (
                  <span aria-hidden="true" className="size-1.5 rounded-full" style={{ backgroundColor: tech[zone.tech].color }} />
                )}
                {zone.label}
              </p>
              <p className="mt-0.5 text-xs text-ink-3">{zone.note}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
                {zone.nodes.map((node, i) => (
                  <span key={node.id}>
                    {i > 0 && <span className="text-ink-3"> · </span>}
                    <span data-lit-by={by(node.id)} className="data-lit:text-accent">
                      {node.label}
                    </span>
                  </span>
                ))}
              </p>
              {feeding.length > 0 && (
                <p className="mt-1 text-xs leading-relaxed text-ink-3">
                  {(["build", "observe"] as const).map((laneId) => {
                    const names = feeding.filter((t) => t.lane === laneId);
                    if (names.length === 0) return null;
                    return (
                      <span key={laneId} className="mr-3 inline-block">
                        {laneId === "build" ? "Built with " : "Watched by "}
                        {names.map((t, i) => (
                          <span key={t.node.id}>
                            {i > 0 && ", "}
                            <span data-lit-by={by(t.node.id)} className="text-ink-2 data-lit:text-accent">
                              {t.node.label}
                            </span>
                          </span>
                        ))}
                      </span>
                    );
                  })}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
