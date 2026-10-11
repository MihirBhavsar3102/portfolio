function Column({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="bg-surface-1 p-5">
      <h3 className="text-sm font-semibold text-ink">{heading}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="relative pl-4 text-sm leading-relaxed text-ink-2 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2 before:bg-line-strong"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Who did what, stated plainly: my part beside the team's (or what was already
 * in place). The second column appears only when the source material says
 * something about it; nothing is inferred to fill it.
 */
export function Ownership({ mine, team, teamLabel = "The team" }: { mine: string[]; team?: string[]; teamLabel?: string }) {
  const hasTeam = !!team?.length;
  return (
    <div className={`mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line ${hasTeam ? "md:grid-cols-2" : ""}`}>
      <Column heading="My part" items={mine} />
      {hasTeam && <Column heading={teamLabel} items={team} />}
    </div>
  );
}
