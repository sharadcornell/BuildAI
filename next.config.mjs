/** @type {import('next').NextConfig} */

// Conservative, framework-safe security headers applied to every route.
// Deliberately NO Content-Security-Policy here — a strict CSP risks breaking
// next/font, next/og (OG images), and inline styles; it's tracked as deferred in
// docs/DEPLOYMENT_CHECKLIST.md for a later, carefully-tested pass.
const securityHeaders = [
  // Stop MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send only the origin on cross-origin navigations; full URL same-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disallow the site being framed by other origins (clickjacking defense).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Modern equivalent + disables sensitive features the site doesn't use.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // HTTPS-only once deployed (Vercel is always HTTPS). No `preload` — that's a
  // hard-to-reverse commitment, deferred until the production domain is final.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
export default nextConfig;
