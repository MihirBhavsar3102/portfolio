import type { CSSProperties } from "react";
import type { Project } from "@/types/resume";
import type { OgPalette } from "@/lib/og";
import { resume } from "@/lib/resume-data";
import { shortClaim } from "@/lib/format";
import { whereLabel, zoneLabel } from "@/lib/work";

/*
 * The share cards, as Satori JSX (next/og): every multi-child div is a flex
 * box and every text node a single string, which is how Satori lays text out.
 */

/** The home card's figures: the Azure effort saved, then AWS cost and uptime. */
const HOME_FIGURES = ["manual", "spend", "uptime"];

const frame = (p: OgPalette): CSSProperties => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "72px 80px",
  backgroundColor: p.canvas,
  color: p.ink,
  fontFamily: "Schibsted Grotesk",
});

function Label({ color, dot, children }: { color: string; dot: string; children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, fontWeight: 500, color }}>
      <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: dot }} />
      <div>{children}</div>
    </div>
  );
}

/** The site's card: role and where, the name set large, then three measured outcomes on a hairline. */
export function HomeCard({ p }: { p: OgPalette }) {
  const figures = HOME_FIGURES.map((id) => resume.estate.proof.find((x) => x.id === id)!.figure);
  return (
    <div style={frame(p)}>
      <Label color={p.ink2} dot={p.accent}>{`${resume.role} · ${resume.location}`}</Label>
      <div style={{ display: "flex", fontSize: 136, fontWeight: 700, letterSpacing: -5, lineHeight: 0.92 }}>{resume.name}</div>
      <div style={{ display: "flex", gap: 56, borderTop: `1px solid ${p.line}`, paddingTop: 32 }}>
        {figures.map((f) => (
          <div key={f.value} style={{ display: "flex", flexDirection: "column", width: 316 }}>
            <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: -2.4, lineHeight: 1 }}>{f.value}</div>
            <div style={{ marginTop: 12, fontSize: 22, fontWeight: 500, lineHeight: 1.3, color: p.ink2, textWrap: "balance" }}>{shortClaim(f.label)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** A case study's card: where it ran in its cloud's colour, the headline, then its lead result (or its stages) and the name. */
export function CaseStudyCard({ project, p }: { project: Project; p: OgPalette }) {
  const tint = project.zone ? p[project.zone] : p.ink3;
  const where = project.kind === "work" ? `${zoneLabel(project)} · ${whereLabel(project)}` : zoneLabel(project);
  const lead = project.figures[0];
  return (
    <div style={frame(p)}>
      <Label color={tint} dot={tint}>{where}</Label>
      {/* Word by word: Satori would otherwise break "Jenkins-to-Kubernetes" at its hyphens. */}
      <div style={{ display: "flex", flexWrap: "wrap", maxWidth: 1000, columnGap: 18, fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02 }}>
        {project.headline.split(" ").map((word, i) => (
          <div key={i}>{word}</div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 48, borderTop: `1px solid ${p.line}`, paddingTop: 32 }}>
        {lead ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1 }}>{lead.value}</div>
            <div style={{ display: "flex", maxWidth: 560, fontSize: 24, fontWeight: 500, lineHeight: 1.3, color: p.ink2 }}>{shortClaim(lead.label)}</div>
          </div>
        ) : (
          // Each stage is one unit, so a line never breaks inside "Dependency-Check".
          <div style={{ display: "flex", flexWrap: "wrap", maxWidth: 820, columnGap: 12, rowGap: 4, fontSize: 24, fontWeight: 500, lineHeight: 1.4, color: p.ink2 }}>
            {(project.stages ?? []).map((stage, i) => (
              <div key={stage} style={{ display: "flex", gap: 12 }}>
                {i > 0 ? [<div key="arrow">→</div>, <div key="stage">{stage}</div>] : <div>{stage}</div>}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", flexShrink: 0, fontSize: 24, fontWeight: 500, color: p.ink2 }}>{resume.name}</div>
      </div>
    </div>
  );
}
