/**
 * build.mjs — orchestrateur de génération.
 * Lance la génération des 8 pages piliers départementaux.
 *
 * Usage : node build/build.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderDept } from "./render-dept.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const idfGeo = JSON.parse(readFileSync(join(ROOT, "data/idf-geo.json"), "utf8"));
const deptContent = JSON.parse(readFileSync(join(ROOT, "data/dept-content.json"), "utf8"));
const seoPages = JSON.parse(readFileSync(join(ROOT, "data/seo-pages.json"), "utf8"));

let countWritten = 0;

// Génération des 8 piliers départementaux
for (const dept of idfGeo.departements) {
  const code = dept.code;
  const content = deptContent[code];
  const seo = seoPages.pages_statiques.find(p => p.slug === `/${code}/` && p.type === "pilier_departemental");

  if (!content) {
    console.warn(`⚠️  Pas de contenu rédactionnel pour le département ${code}, skipping.`);
    continue;
  }
  if (!seo) {
    console.warn(`⚠️  Pas d'entrée SEO pour /${code}/, skipping.`);
    continue;
  }

  const html = renderDept({ geo: dept, content, seo });
  const outPath = join(ROOT, code, "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, "utf8");
  console.log(`✓ /${code}/ → ${outPath} (${(html.length / 1024).toFixed(1)} KB)`);
  countWritten++;
}

console.log(`\n${countWritten} page(s) générée(s).`);
