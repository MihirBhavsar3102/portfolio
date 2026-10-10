import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * Satori renders this without the stylesheet, so the palette has to be mirrored
 * as literals. These are the light theme's field tokens verbatim — keep them in
 * step with `app/globals.css` or the share card drifts away from the sheet it
 * is advertising, which is what happened before this was tokenised.
 */
const FIELD = "#0b1f33"; // --field
const ON_FIELD = "#e9eff6"; // --on-field
const ON_FIELD_2 = "#9cb3c8"; // --on-field-2
const RULE_FIELD = "#24405a"; // --rule-field
const SIGNAL_FIELD = "#63a6e8"; // --signal-field

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: FIELD,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: SIGNAL_FIELD,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Cloud &amp; DevOps Engineer
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 100, fontWeight: 700, color: ON_FIELD, letterSpacing: -3 }}>
            Mihir Bhavsar
          </div>
          <div style={{ display: "flex", fontSize: 34, color: ON_FIELD_2, marginTop: 16 }}>
            Azure Virtual Desktop · Terraform automation · AI-native tooling
          </div>
        </div>
        {/* The sheet closes on a rule, so the card does too. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 1, width: "100%", backgroundColor: RULE_FIELD }} />
          <div style={{ display: "flex", fontSize: 26, color: ON_FIELD_2, marginTop: 24 }}>
            25% cloud spend reduced · 70% less manual ops · 99.9% uptime
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
