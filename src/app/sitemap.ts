import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

const BASE = `https://${SITE.domain}`;

// Public marketing routes only. Auth-gated previews (/login, /app, /app/mentor,
// /app/admin) are intentionally excluded from the sitemap.
const PUBLIC_ROUTES = [
  "",
  "/programme",
  "/curriculum",
  "/certification",
  "/for-colleges",
  "/for-students",
  "/for-mentors",
  "/placements",
  "/partners",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PUBLIC_ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
