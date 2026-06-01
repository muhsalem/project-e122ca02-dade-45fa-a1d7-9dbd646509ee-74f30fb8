import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/pricing", changefreq: "monthly", priority: "0.9" },
  { path: "/start", changefreq: "monthly", priority: "0.9" },
  { path: "/booking", changefreq: "monthly", priority: "0.9" },
  { path: "/institutions", changefreq: "monthly", priority: "0.8" },
  { path: "/schools", changefreq: "monthly", priority: "0.7" },
  { path: "/for-counselors", changefreq: "monthly", priority: "0.7" },
  { path: "/join-as-coach", changefreq: "monthly", priority: "0.6" },
  { path: "/resources", changefreq: "weekly", priority: "0.8" },
  { path: "/resources/career-change-strategies", changefreq: "monthly", priority: "0.6" },
  { path: "/resources/career-path-terms", changefreq: "monthly", priority: "0.6" },
  { path: "/resources/coaching-vs-career-counseling", changefreq: "monthly", priority: "0.6" },
  { path: "/resources/cv-writing", changefreq: "monthly", priority: "0.6" },
  { path: "/resources/grow-model", changefreq: "monthly", priority: "0.6" },
  { path: "/resources/how-to-choose-major", changefreq: "monthly", priority: "0.6" },
  { path: "/resources/parent-guide", changefreq: "monthly", priority: "0.6" },
  { path: "/specializations", changefreq: "weekly", priority: "0.9" },
  { path: "/self-discovery", changefreq: "monthly", priority: "0.8" },
  { path: "/career-type-assessment", changefreq: "monthly", priority: "0.8" },
  { path: "/comprehensive-assessment", changefreq: "monthly", priority: "0.8" },
  { path: "/academic-major", changefreq: "monthly", priority: "0.8" },
  { path: "/learning-style", changefreq: "monthly", priority: "0.7" },
  { path: "/cognitive-profile", changefreq: "monthly", priority: "0.7" },
  { path: "/burnout-check", changefreq: "monthly", priority: "0.7" },
  { path: "/wellbeing-check", changefreq: "monthly", priority: "0.7" },
  { path: "/clarity-check", changefreq: "monthly", priority: "0.7" },
  { path: "/career-ladder", changefreq: "monthly", priority: "0.7" },
  { path: "/career-change", changefreq: "monthly", priority: "0.7" },
  { path: "/career-growth", changefreq: "monthly", priority: "0.7" },
  { path: "/career-twin", changefreq: "monthly", priority: "0.7" },
  { path: "/career-readiness", changefreq: "monthly", priority: "0.7" },
  { path: "/skills-gap", changefreq: "monthly", priority: "0.7" },
  { path: "/sector-guide", changefreq: "monthly", priority: "0.7" },
  { path: "/labor-market", changefreq: "weekly", priority: "0.7" },
  { path: "/review360", changefreq: "monthly", priority: "0.6" },
  { path: "/counselor", changefreq: "monthly", priority: "0.6" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
