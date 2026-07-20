import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          backgroundColor: "#0d141c",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#7fb0e0",
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Cloud &amp; DevOps Engineer
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 100, fontWeight: 700, color: "#e7ecf1", letterSpacing: -3 }}>
            Mihir Bhavsar
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#97a4b2", marginTop: 16 }}>
            Azure Virtual Desktop · Terraform automation · AI-native tooling
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#97a4b2" }}>
          25% cloud spend reduced · 70% less manual ops · 99.9% uptime
        </div>
      </div>
    ),
    { ...size }
  );
}
