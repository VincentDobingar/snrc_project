#!/usr/bin/env node
// Generates public/sitemap.xml before Vite copies public/ into dist/.
// Combines the site's static routes (mirrored from router.jsx) with one
// <url> entry per published news article and per published job offer,
// fetched live from the production API.
//
// Run automatically via `npm run build` (see the "prebuild" script in
// package.json). Safe to run offline: if the API is unreachable, it falls
// back to writing just the static routes so the build never fails because
// of this script.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

// This script only runs at build time, against the production API — there is
// no dev-server "import.meta.env" available here, so read .env.production by
// hand instead of relying on Vite's env loading.
function loadEnvProduction() {
  try {
    const content = readFileSync(resolve(rootDir, ".env.production"), "utf8");
    const env = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      value = value.replace(/^["']|["']$/g, "");
      env[key] = value;
    }
    return env;
  } catch {
    return {};
  }
}

const env = loadEnvProduction();

// No VITE_APP_URL is defined in .env.production (the frontend never needs its
// own public origin at runtime — usePageMeta() falls back to
// window.location.origin in the browser). Hardcoded here because this script
// only ever runs at build time against production content.
const SITE_URL = (env.VITE_APP_URL || "https://snrc.td").replace(/\/$/, "");
const API_BASE_URL = env.VITE_API_BASE_URL || "https://api.snrc.td/api";

// Mirrors the public routes declared in src/app/router.jsx, with the
// changefreq/priority values preserved from the previous static sitemap.xml.
const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/la-snrc", changefreq: "monthly", priority: "0.8" },
  { path: "/missions", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "monthly", priority: "0.8" },
  { path: "/actualites", changefreq: "daily", priority: "0.9" },
  { path: "/publications", changefreq: "weekly", priority: "0.8" },
  { path: "/carrieres", changefreq: "weekly", priority: "0.8" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrlEntry({ path, changefreq, priority }) {
  const loc = `${SITE_URL}${path}`;
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

function buildSitemap(entries) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(buildUrlEntry),
    "</urlset>",
    "",
  ].join("\n");
}

async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }
  return response.json();
}

// Mirrors src/api/newsApi.js#getNews(): GET /news, which the backend routes
// to NewsController.getPublic — published items only.
async function fetchPublishedNews() {
  const data = await fetchJson(`${API_BASE_URL}/news`);
  return data?.data?.news || [];
}

// Mirrors src/api/jobsApi.js#getJobs(): GET /jobs, which the backend routes
// to JobsController.getPublic — published items only.
async function fetchPublishedJobs() {
  const data = await fetchJson(`${API_BASE_URL}/jobs`);
  return data?.data?.jobs || [];
}

async function buildDynamicEntries() {
  const [news, jobs] = await Promise.all([
    fetchPublishedNews(),
    fetchPublishedJobs(),
  ]);

  const newsEntries = news
    .filter((item) => item?.slug)
    .map((item) => ({
      // Matches the "actualites/:slug" route in src/app/router.jsx.
      path: `/actualites/${item.slug}`,
      changefreq: "monthly",
      priority: "0.6",
    }));

  const jobEntries = jobs
    .filter((item) => item?.slug)
    .map((item) => ({
      // Matches the "carrieres/:slug" route in src/app/router.jsx.
      path: `/carrieres/${item.slug}`,
      changefreq: "weekly",
      priority: "0.6",
    }));

  return [...newsEntries, ...jobEntries];
}

async function main() {
  let entries = [...STATIC_ROUTES];

  try {
    const dynamicEntries = await buildDynamicEntries();
    entries = [...STATIC_ROUTES, ...dynamicEntries];
    console.log(
      `[generate-sitemap] Fetched ${dynamicEntries.length} dynamic URL(s) from ${API_BASE_URL} ` +
        `(news + jobs).`
    );
  } catch (error) {
    console.warn(
      `[generate-sitemap] Could not fetch published content from ${API_BASE_URL} — ` +
        `falling back to static routes only. Reason: ${error.message}`
    );
  }

  const xml = buildSitemap(entries);
  const outputPath = resolve(rootDir, "public", "sitemap.xml");
  writeFileSync(outputPath, xml, "utf8");
  console.log(
    `[generate-sitemap] Wrote ${entries.length} URL(s) to ${outputPath}`
  );
}

main().catch((error) => {
  // Never let a bug in this script break the production build.
  console.error("[generate-sitemap] Unexpected error, continuing build:", error);
});
