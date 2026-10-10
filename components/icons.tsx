import type { IconName } from "@/types/resume";

/**
 * One authored icon family for the estate drawing: 24×24 grid, 1.75 stroke,
 * round caps and joins, no fills. Drawn rather than borrowed so the plates on
 * the isometric planes share a single hand.
 *
 * These are projected onto isometric top faces via a transform matrix, which
 * would scale the stroke with the geometry — every path therefore carries
 * vectorEffect="non-scaling-stroke" so the weight stays constant on the sheet.
 */
export const iconPaths: Record<IconName, React.ReactNode> = {
  clients: (
    <>
      <path d="M4 20V6l7-3v17" />
      <path d="M11 10h9v10" />
      <path d="M4 20h17" />
      <path d="M14.5 13.5h2M14.5 16.5h2M7 8.5v0M7 12v0M7 15.5v0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 6.3" />
      <path d="M17.2 14.4a5.5 5.5 0 0 1 3.3 5.1" />
    </>
  ),
  hostpool: (
    <>
      <rect x="3" y="4" width="18" height="11.5" rx="1.5" />
      <path d="M8 19.5h8M12 15.5v4" />
      <path d="M7 8h6M7 11h4" />
    </>
  ),
  profiles: (
    <>
      <ellipse cx="12" cy="6.5" rx="8" ry="3" />
      <path d="M4 6.5v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5" />
      <path d="M4 11.5v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5" />
    </>
  ),
  vault: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 8V5.5M12 18.5V16M16 12h2.5M5.5 12H8" />
    </>
  ),
  identity: (
    <>
      <path d="M12 3l7.5 3v5.6c0 4.2-3 8-7.5 9.4-4.5-1.4-7.5-5.2-7.5-9.4V6Z" />
      <circle cx="12" cy="10.5" r="2.2" />
      <path d="M8.6 16.4a3.8 3.8 0 0 1 6.8 0" />
    </>
  ),
  compute: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <path d="M10 10h4v4h-4z" />
      <path d="M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3" />
    </>
  ),
  balancer: (
    <>
      <path d="M12 3v6" />
      <circle cx="12" cy="11" r="2.2" />
      <path d="M12 13.2v1.3a2 2 0 0 1-2 2H6.5M12 13.2v1.3a2 2 0 0 0 2 2h3.5" />
      <path d="M4 16.5h5v4.5H4zM15 16.5h5v4.5h-5z" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.8" rx="7.5" ry="2.8" />
      <path d="M4.5 5.8v12.4c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V5.8" />
      <path d="M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8" />
    </>
  ),
  edge: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.4 2.6 3.6 5.5 3.6 8.5s-1.2 5.9-3.6 8.5c-2.4-2.6-3.6-5.5-3.6-8.5S9.6 6.1 12 3.5Z" />
    </>
  ),
  service: (
    <>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7.5 11.5v1M11 10.5v3M14.5 11.5v1" />
      <path d="M12 3v4M12 17v4" />
    </>
  ),
  model: (
    <>
      <circle cx="5.5" cy="7" r="2" />
      <circle cx="5.5" cy="17" r="2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="18.5" cy="7" r="2" />
      <circle cx="18.5" cy="17" r="2" />
      <path d="M7.3 8.1 10.2 10.7M7.3 15.9 10.2 13.3M13.8 10.7 16.7 8.1M13.8 13.3 16.7 15.9" />
    </>
  ),
  chain: (
    <>
      <path d="M10 14a4 4 0 0 1 0-5.7l2.1-2.1a4 4 0 0 1 5.7 5.7l-1.2 1.2" />
      <path d="M14 10a4 4 0 0 1 0 5.7l-2.1 2.1a4 4 0 0 1-5.7-5.7l1.2-1.2" />
    </>
  ),
  vector: (
    <>
      <path d="M4 20V4M4 20h16" />
      <circle cx="8.5" cy="15" r="1.4" />
      <circle cx="12.5" cy="9.5" r="1.4" />
      <circle cx="17" cy="12.5" r="1.4" />
      <circle cx="15" cy="5.5" r="1.4" />
      <path d="M9.8 14.2 11.4 10.6M13.7 10.3l2.2 1.5M13.6 8.6 14.4 6.9" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  className?: string;
  /** Applied to the <g>, used for the isometric projection matrix */
  transform?: string;
}

export function Icon({ name, className, transform }: IconProps) {
  return (
    <g
      transform={transform}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      {iconPaths[name]}
    </g>
  );
}
