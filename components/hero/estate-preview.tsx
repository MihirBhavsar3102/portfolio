import type { CSSProperties } from "react";
import { resume } from "@/lib/resume-data";
import { tech, type TechId } from "@/lib/tech";

const { zones, controlPlane, edges } = resume.estate;

const lane = (id: string) => controlPlane.find((l) => l.id === id)!;

/** The workloads a lane's tools reach: an edge from any of them to the zone. */
function reaches(laneId: string, zoneId: string) {
  const tools = new Set(lane(laneId).nodes.map((n) => n.id));
  return edges.some((e) => e.to === zoneId && tools.has(e.from));
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function Dot({ id }: { id?: TechId }) {
  const color = id ? tech[id].color : undefined;
  return (
    <span
      className={`size-1.5 shrink-0 rounded-full ${color ? "" : "bg-ink-3"}`}
      style={color ? { backgroundColor: color } : undefined}
    />
  );
}

function Lane({ id, step }: { id: string; step: string }) {
  const { label, nodes } = lane(id);
  return (
    <div className="rounded-2xl bg-surface-2 p-4">
      <p className="text-xs font-medium text-ink-3">{label}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {nodes.map((n, i) => (
          <span
            key={n.id}
            data-step={step}
            style={delay(i * 90)}
            className="hero-node hero-chip inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-canvas px-2.5 py-1 text-[12.5px] whitespace-nowrap text-ink-2"
          >
            <Dot id={n.tech} />
            {n.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** One straight connector per workload a lane reaches; packets run down it while its step plays. */
function Wires({ lane: laneId, step }: { lane: string; step: string }) {
  return (
    <div className="grid h-14 grid-cols-3 gap-3">
      {zones.map((z, i) => (
        <div key={z.id} className="relative">
          {reaches(laneId, z.id) && (
            <span data-step={step} data-wire={`${step}:${z.id}`} className="hero-wire absolute inset-y-0 left-1/2 w-px -translate-x-1/2">
              {[0, 1].map((k) => (
                <span key={k} className="hero-packet absolute top-0 left-1/2 size-1.5 rounded-full" style={delay(k * 600 + i * 150)} />
              ))}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * The estate in miniature, beside the hero's statement: the build lane, the
 * three workloads (each with its first three parts) and the observe lane,
 * joined only where the estate has an edge. It plays the positioning line's
 * three verbs as three steps (globals.css, driven by HeroCycle): build lights
 * the tools and the parts, ship sends packets down to the workloads, observe
 * lights the monitoring. Decorative: the map section describes it in full.
 */
export function EstatePreview() {
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-120">
      <Lane id="build" step="build" />
      <Wires lane="build" step="ship" />
      <div className="grid grid-cols-3 gap-3">
        {zones.map((z, zi) => {
          const [cloud, workload] = z.label.split(" · ");
          return (
            <div
              key={z.id}
              data-step={reaches("build", z.id) ? "ship" : undefined}
              className="hero-zone rounded-2xl border border-line bg-canvas p-3 lg:max-xl:p-2.5"
            >
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                <Dot id={z.tech} />
                {cloud}
              </p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-ink-3">{workload}</p>
              <ul className="mt-3 space-y-1.5">
                {z.nodes.slice(0, 3).map((n, i) => (
                  <li
                    key={n.id}
                    data-step="build"
                    style={delay(300 + zi * 120 + i * 90)}
                    className="hero-node rounded-lg border border-transparent bg-surface-1 px-2 py-1.5 text-xs leading-tight text-ink-2 lg:max-xl:px-1.5"
                  >
                    {n.label}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <Wires lane="observe" step="observe" />
      <Lane id="observe" step="observe" />
    </div>
  );
}
