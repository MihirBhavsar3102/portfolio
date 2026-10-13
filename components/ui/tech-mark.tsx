import { tech, type TechId } from "@/lib/tech";

/** A technology's name with its brand dot: brand colour only as a mark (DESIGN.md, Marks Only Rule). */
export function TechMark({ id }: { id: TechId }) {
  const { name, color } = tech[id];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span
        aria-hidden="true"
        className={`size-1.5 shrink-0 rounded-full ${color ? "" : "bg-ink-3"}`}
        style={color ? { backgroundColor: color } : undefined}
      />
      {name}
    </span>
  );
}
