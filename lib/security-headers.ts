/**
 * The Content Security Policy. Every page is prerendered, so it can't carry a
 * per-request nonce (Next's nonce CSP forces dynamic rendering on every
 * request); inline scripts stay allowed because Next's hydration payload and
 * the pre-paint theme script (lib/theme.ts) are inline. Everything else is
 * pinned to this origin: no script, style, image, font or request reaches
 * another one, no plugin loads, and no other site can frame the page. Dev
 * adds 'unsafe-eval', which React's dev build needs (Next's CSP guide).
 */
export function contentSecurityPolicy(dev = false): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

/** Sent with every response (next.config.ts), on Vercel and from the Docker image alike. */
export function securityHeaders(dev = false): { key: string; value: string }[] {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(dev) },
    // Two years. Browsers ignore it over plain http, so local servers are unaffected.
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    // frame-ancestors supersedes it; kept for browsers that predate CSP Level 2.
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Nothing here uses them. The clipboard stays allowed: the copy-email button needs it.
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
}
