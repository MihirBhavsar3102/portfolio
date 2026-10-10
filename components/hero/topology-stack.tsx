import { resume } from "@/lib/resume-data";
import { tech } from "@/lib/tech";
import { litBy } from "@/lib/trace";

/**
 * The service map below `md`: the same zones as a ruled list instead of a
 * shrunken drawing, with the tools that build and watch each workload written
 * underneath. Carries the same `data-lit-by` marks, so Trace works on phones.
 */
export function TopologyStack() {
  const { estate } = resume;
  const lit = litBy(estate);
  const by = (id: string) => lit.get(id)?.join(" ") ?? "";
  const tools = new Map(estate.controlPlane.flatMap((l) => l.nodes.map((n) => [n.id, { node: n, lane: l.id }] as const)));

  return (
    <section aria-labelledby="map-heading" className="mt-10 md:hidden">
      <h2 id="map-heading" className="mb-4 text-base font-semibold text-ink">
        Service map
      </h2>
      <ol className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface-1">
        {estate.zones.map((zone) => {
          const feeding = estate.edges
            .filter((e) => e.to === zone.id && tools.has(e.from))
            .map((e) => tools.get(e.from)!);
          return (
            <li key={zone.id} className="p-4">
              <p data-lit-by={by(zone.id)} className="flex items-center gap-2 text-sm font-medium text-ink-2">
                {zone.tech && (
                  <span aria-hidden="true" className="size-1.5 rounded-full" style={{ backgroundColor: tech[zone.tech].color }} />
                )}
                {zone.label}
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {zone.nodes.map((node) => (
                  <li
                    key={node.id}
                    data-lit-by={by(node.id)}
                    className="rounded-md border border-line-strong bg-canvas px-2.5 py-1 text-[13px] text-ink data-lit:border-accent data-lit:bg-accent-soft"
                  >
                    {zone.id === "clients" ? `${node.meta} ${node.label.charAt(0).toLowerCase()}${node.label.slice(1)}` : node.label}
                    {zone.id !== "clients" && node.meta && <span className="text-ink-3"> · {node.meta}</span>}
                  </li>
                ))}
              </ul>
              {feeding.length > 0 && (
                <p className="mt-3 text-xs leading-relaxed text-ink-3">
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
