/**
 * build.mjs — orchestrateur de génération.
 * Lance la génération de toutes les pages dérivées des données :
 *   - 8 piliers départementaux  (étape 2)
 *   - 17 guides + 1 index /guide/  (étape 3)
 *
 * Usage : node build/build.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderDept } from "./render-dept.mjs";
import { renderGuide } from "./render-guide.mjs";
import { renderGuideIndex } from "./render-guide-index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const idfGeo = JSON.parse(readFileSync(join(ROOT, "data/idf-geo.json"), "utf8"));
const deptContent = JSON.parse(readFileSync(join(ROOT, "data/dept-content.json"), "utf8"));
const guideContent = JSON.parse(readFileSync(join(ROOT, "data/guide-content.json"), "utf8"));
const seoPages = JSON.parse(readFileSync(join(ROOT, "data/seo-pages.json"), "utf8"));

// Index par code/slug pour lookups rapides
const geoIndex = {
  byCode: Object.fromEntries(idfGeo.departements.map(d => [d.code, d]))
};
const allGuidesSeo = Object.fromEntries(
  seoPages.pages_statiques
    .filter(p => p.type === "guide")
    .map(p => {
      const slug = p.slug.replace(/^\/guide\//, "").replace(/\/$/, "");
      return [slug, p];
    })
);
const guideIndexSeo = seoPages.pages_statiques.find(p => p.type === "guide_index");

let counts = { dept: 0, guide: 0, index: 0 };

// ----- 1. Piliers départementaux -------------------------------------------
console.log("\n— Piliers départementaux —");
for (const dept of idfGeo.departements) {
  const code = dept.code;
  const content = deptContent[code];
  const seo = seoPages.pages_statiques.find(p => p.slug === `/${code}/` && p.type === "pilier_departemental");
  if (!content || !seo) {
    console.warn(`⚠️  Skip /${code}/ — données manquantes.`);
    continue;
  }
  const html = renderDept({ geo: dept, content, seo });
  const outPath = join(ROOT, code, "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, "utf8");
  console.log(`✓ /${code}/ (${(html.length / 1024).toFixed(1)} KB)`);
  counts.dept++;
}

// ----- 2. Pages guides ------------------------------------------------------
console.log("\n— Guides —");
for (const [slug, content] of Object.entries(guideContent)) {
  if (slug.startsWith("_")) continue;
  const seo = allGuidesSeo[slug];
  if (!seo) {
    console.warn(`⚠️  Skip /guide/${slug}/ — pas d'entrée SEO.`);
    continue;
  }
  const html = renderGuide({
    content,
    seo,
    geoIndex,
    deptContent,
    allSeoGuides: allGuidesSeo
  });
  const outPath = join(ROOT, "guide", slug, "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, "utf8");
  console.log(`✓ /guide/${slug}/ (${(html.length / 1024).toFixed(1)} KB)${content.enriched ? " ⭐" : ""}`);
  counts.guide++;
}

// ----- 3. Index /guide/ ----------------------------------------------------
console.log("\n— Index Guide —");
if (guideIndexSeo) {
  const html = renderGuideIndex({
    seo: guideIndexSeo,
    allGuidesSeo
  });
  const outPath = join(ROOT, "guide", "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, "utf8");
  console.log(`✓ /guide/ (${(html.length / 1024).toFixed(1)} KB)`);
  counts.index++;
}

console.log(`\n${counts.dept + counts.guide + counts.index} page(s) générée(s) — ${counts.dept} dépt, ${counts.guide} guides, ${counts.index} index.`);
