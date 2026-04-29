/**
 * render-guide.mjs - génère le HTML d'une page guide.
 * Croise seo-pages.json (title, meta, h1) + guide-content.json (rédactionnel).
 * Pages "enriched" (ex. fissure-horizontale) bénéficient d'un layout étendu :
 * sous-types, cas concret, FAQ étendue, schémas multiples.
 */

import {
  head,
  header,
  breadcrumb,
  schemaBreadcrumb,
  independanceBlock,
  contactForm,
  footer,
  esc,
  SITE
} from "./partials.mjs";

const GRAVITE_COLORS = {
  safe: { bg: "#2d5c3e", fg: "#f5f1ea", label: "Bénin" },
  warn: { bg: "#a86b1c", fg: "#f5f1ea", label: "Surveiller" },
  ocre: { bg: "#b8552e", fg: "#f5f1ea", label: "Inquiétant" },
  alert: { bg: "#7a1f1f", fg: "#f5f1ea", label: "Urgent" }
};

export function renderGuide(ctx) {
  const { content, seo, geoIndex, deptContent } = ctx;
  const slug = seo.slug.replace(/^\/guide\//, "").replace(/\/$/, "");
  const path = `/guide/${slug}/`;
  const canonical = `${SITE.domain}${path}`;
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Guides", href: "/guide/" },
    { label: stripHtml(seo.h1), href: path }
  ];

  // Schemas JSON-LD : Article + BreadcrumbList + FAQPage
  const schemas = [
    schemaBreadcrumb(breadcrumbItems),
    `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${esc(seo.h1)}",
    "description": "${esc(seo.meta_description)}",
    "author": {"@type": "Organization", "name": "Expert Fissure Île-de-France"},
    "publisher": {"@type": "Organization", "name": "Expert Fissure Île-de-France", "url": "${SITE.domain}/"},
    "datePublished": "2026-04-27",
    "dateModified": "2026-04-27",
    "mainEntityOfPage": {"@type": "WebPage", "@id": "${canonical}"},
    "image": "${SITE.domain}/assets/og-default.jpg"
  }
  </script>`,
    `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      ${content.faq.map(f => `{"@type": "Question", "name": "${esc(f.q)}", "acceptedAnswer": {"@type": "Answer", "text": "${esc(f.r)}"}}`).join(",\n      ")}
    ]
  }
  </script>`
  ];

  // Sommaire ancré
  const tocItems = [
    { id: "definition", label: "Définition" },
    { id: "gravite", label: "Quand s'inquiéter" },
    { id: "causes", label: "Causes fréquentes" },
    { id: "diagnostic", label: "Méthode de diagnostic" },
    { id: "solutions", label: "Solutions et coûts" },
    ...(content.cas_concret ? [{ id: "cas", label: "Cas concret" }] : []),
    { id: "faq", label: "FAQ" }
  ];

  // Bloc gravité (échelle visuelle)
  const niveauxHtml = content.gravite.niveaux.map(n => {
    const c = GRAVITE_COLORS[n.couleur] || GRAVITE_COLORS.warn;
    return `<div style="background: ${c.bg}; color: ${c.fg}; padding: var(--s-5); display: flex; flex-direction: column; gap: var(--s-2);">
            <div style="display: flex; align-items: baseline; justify-content: space-between; gap: var(--s-3);">
              <span style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 500;">${escapeHtml(n.label)}</span>
              <span style="font-family: var(--font-sans); font-size: var(--fs-micro); text-transform: uppercase; letter-spacing: var(--tracking-cap); opacity: 0.85;">${escapeHtml(n.ouverture)}</span>
            </div>
            <p style="font-size: var(--fs-small); line-height: 1.45; opacity: 0.92;">${escapeHtml(n.description)}</p>
          </div>`;
  }).join("");

  // Sous-types (chef-d'œuvre uniquement)
  let sousTypesHtml = "";
  if (content.enriched && content.definition.sous_types) {
    sousTypesHtml = `
        <h3 style="margin-top: var(--s-7);">Cinq sous-types fréquents</h3>
        <ol class="editorial-list" style="margin-top: var(--s-5);">
          ${content.definition.sous_types.map(st => `<li>
            <div>
              <h3 style="margin-top: 0; font-size: 1.125rem;">${escapeHtml(st.name)}</h3>
              <p>${escapeHtml(st.description)}</p>
            </div>
          </li>`).join("\n          ")}
        </ol>`;
  }

  // Cas concret (chef-d'œuvre)
  let casConcretHtml = "";
  if (content.cas_concret) {
    casConcretHtml = `
    <section class="section" id="cas">
      <div class="container container--narrow">
        <span class="eyebrow">Cas concret</span>
        <h2 style="margin-top: var(--s-2);">${escapeHtml(content.cas_concret.titre)}</h2>
        <div style="background: var(--mist); padding: var(--s-7); border-left: 3px solid var(--ocre); margin-top: var(--s-5);">
          <p style="font-family: var(--font-serif); font-size: 1.125rem; line-height: 1.65; color: var(--ink);">${escapeHtml(content.cas_concret.texte)}</p>
        </div>
      </div>
    </section>`;
  }

  // Causes
  const causesHtml = content.causes.items.map((c, i) => `
            <li>
              <div>
                <h3 style="margin-top: 0; font-size: 1.125rem;">${escapeHtml(c.titre)}</h3>
                <p>${escapeHtml(c.description)}</p>
              </div>
            </li>`).join("");

  // Diagnostic
  const diagHtml = content.diagnostic.etapes.map(e => `
            <li>
              <div>
                <h3 style="margin-top: 0; font-size: 1.125rem;">${escapeHtml(e.titre)}</h3>
                <p>${escapeHtml(e.description)}</p>
              </div>
            </li>`).join("");

  // Solutions (avec tarifs)
  const solutionsHtml = content.solutions.items.map(s => `
          <div style="display: grid; grid-template-columns: 1fr auto; gap: var(--s-5); padding: var(--s-5) 0; border-top: var(--bd); align-items: start;">
            <div>
              <h3 style="margin-top: 0; font-size: 1.125rem;">${escapeHtml(s.titre)}</h3>
              <p style="margin-top: var(--s-2); color: var(--graphite);">${escapeHtml(s.description)}</p>
            </div>
            <span style="font-family: var(--font-serif); font-size: 1.125rem; color: var(--ocre); font-weight: 500; white-space: nowrap; padding-top: 4px;">${escapeHtml(s.prix)}</span>
          </div>`).join("");

  // FAQ
  const faqHtml = content.faq.map(f => `<details>
            <summary>${escapeHtml(f.q)}</summary>
            <p>${escapeHtml(f.r)}</p>
          </details>`).join("\n          ");

  // Guides liés
  const guidesLiesHtml = (content.guides_lies || []).map(s => {
    const linkedSeo = ctx.allSeoGuides[s];
    if (!linkedSeo) return "";
    return `<a href="/guide/${s}/" style="background: var(--paper); padding: var(--s-5); display: grid; gap: var(--s-2); text-decoration: none; color: var(--ink); border: var(--bd); transition: background var(--tr-fast);" onmouseover="this.style.background='var(--paper-deep)'" onmouseout="this.style.background='var(--paper)'">
        <span class="eyebrow">Guide lié</span>
        <h3 style="margin: 0; font-size: 1.0625rem;">${escapeHtml(linkedSeo.h1)}</h3>
      </a>`;
  }).join("");

  // Villes phares (maillage transversal)
  const villesPharesHtml = (content.villes_phares || []).map(p => {
    const label = pathToLabel(p, geoIndex);
    return `<a href="${p}" style="background: var(--mist); padding: var(--s-4) var(--s-5); display: inline-flex; align-items: center; gap: var(--s-2); color: var(--ink); text-decoration: none; transition: background var(--tr-fast);" onmouseover="this.style.background='var(--paper-deep)'" onmouseout="this.style.background='var(--mist)'">
        <span style="font-family: var(--font-serif); font-style: italic; color: var(--ocre);">→</span>
        <span style="font-family: var(--font-sans); font-size: var(--fs-small); font-weight: 500;">${escapeHtml(label)}</span>
      </a>`;
  }).join("");

  // Schéma SVG du guide (référence sprite)
  const schemaInline = content.schema
    ? `<svg viewBox="0 0 320 240" style="width: 100%; max-width: 460px; height: auto;" aria-label="Schéma : ${escapeAttr(stripHtml(seo.h1))}"><use href="/assets/illustrations/fissure-types.svg#${content.schema}"/></svg>`
    : "";

  return `${head({
    title: seo.title,
    description: seo.meta_description,
    canonical,
    schemas
  })}
<body>
  <a class="skip-link" href="#main">Aller au contenu</a>
  ${header({ currentPath: path })}

  <main id="main">
    ${breadcrumb(breadcrumbItems)}

    <!-- HERO -->
    <section class="hero">
      <div class="container">
        <div class="hero__grid">
          <div>
            <h1 class="display hero__title">${escapeHtml(seo.h1)}</h1>
            <p class="lead" style="margin-top: var(--s-5);">${escapeHtml(content.intro_paragraphs[0])}</p>
            ${content.intro_paragraphs[1] ? `<p style="margin-top: var(--s-4); color: var(--graphite);">${escapeHtml(content.intro_paragraphs[1])}</p>` : ""}
            <div style="display:flex; gap: var(--s-3); flex-wrap: wrap; margin-top: var(--s-6);">
              <a href="#contact" class="btn btn--primary">Demander un diagnostic</a>
              <a href="#sommaire" class="btn btn--ghost">Lire le guide</a>
            </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; padding: var(--s-5); background: var(--paper-deep); border: var(--bd);">
            ${schemaInline}
          </div>
        </div>
      </div>
    </section>

    <!-- SOMMAIRE ANCRÉ -->
    <nav class="container" id="sommaire" aria-label="Sommaire de l'article" style="padding: var(--s-6) var(--gutter); border-top: var(--bd); border-bottom: var(--bd); margin-top: 0;">
      <span class="eyebrow">Sommaire</span>
      <ol style="display: flex; flex-wrap: wrap; gap: var(--s-3) var(--s-5); margin-top: var(--s-3); list-style: decimal-leading-zero inside; font-family: var(--font-serif); color: var(--ink);">
        ${tocItems.map(t => `<li><a href="#${t.id}" style="text-decoration: none; color: var(--ink); border-bottom: 1px solid var(--mist-line); transition: border-color var(--tr-fast);" onmouseover="this.style.borderColor='var(--ocre)'" onmouseout="this.style.borderColor='var(--mist-line)'">${escapeHtml(t.label)}</a></li>`).join("\n        ")}
      </ol>
    </nav>

    <!-- DÉFINITION -->
    <section class="section" id="definition">
      <div class="container container--narrow">
        <span class="eyebrow">Définition</span>
        <h2 style="margin-top: var(--s-2);">${escapeHtml(content.definition.title)}</h2>
        ${content.definition.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("\n        ")}
        ${sousTypesHtml}
      </div>
    </section>

    <!-- GRAVITÉ -->
    <section class="section surface-deep" id="gravite">
      <div class="container">
        <span class="eyebrow">Quand s'inquiéter</span>
        <h2 style="margin-top: var(--s-2); max-width: 28ch;">Échelle de gravité, pas à pas</h2>
        <p class="lead" style="margin-top: var(--s-4); margin-bottom: var(--s-7); max-width: 65ch;">${escapeHtml(content.gravite.intro)}</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1px; background: var(--mist-line); border: var(--bd);">
          ${niveauxHtml}
        </div>
      </div>
    </section>

    ${independanceBlock()}

    <!-- CAUSES -->
    <section class="section" id="causes">
      <div class="container">
        <div class="offset-block">
          <div class="offset-block__label">Causes</div>
          <div>
            <h2 style="margin-top: 0;">Causes fréquentes</h2>
            <p class="lead" style="margin-bottom: var(--s-6); max-width: 65ch;">${escapeHtml(content.causes.intro)}</p>
            <ol class="editorial-list">
              ${causesHtml}
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- DIAGNOSTIC -->
    <section class="section surface-deep" id="diagnostic">
      <div class="container">
        <div class="offset-block">
          <div class="offset-block__label">Diagnostic</div>
          <div>
            <h2 style="margin-top: 0;">Méthode de diagnostic d'expert</h2>
            <p class="lead" style="margin-bottom: var(--s-6); max-width: 65ch;">${escapeHtml(content.diagnostic.intro)}</p>
            <ol class="editorial-list">
              ${diagHtml}
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- SOLUTIONS -->
    <section class="section" id="solutions">
      <div class="container container--narrow">
        <span class="eyebrow">Solutions et coûts</span>
        <h2 style="margin-top: var(--s-2);">Réparer une fissure : techniques et fourchettes 2026</h2>
        <p class="lead" style="margin-top: var(--s-4); margin-bottom: var(--s-7);">${escapeHtml(content.solutions.intro)}</p>
        <div>
          ${solutionsHtml}
          <div style="border-top: var(--bd);"></div>
        </div>
      </div>
    </section>

    ${casConcretHtml}

    <!-- FAQ -->
    <section class="section surface-deep" id="faq">
      <div class="container container--narrow">
        <span class="eyebrow">Questions fréquentes</span>
        <h2 style="margin-top: var(--s-2);">Vos questions sur ce sujet</h2>
        <div class="faq" style="margin-top: var(--s-6);">
          ${faqHtml}
        </div>
      </div>
    </section>

    <!-- MAILLAGE : VILLES PHARES -->
    ${villesPharesHtml ? `
    <section class="section">
      <div class="container container--narrow">
        <span class="eyebrow">Maillage local</span>
        <h2 style="margin-top: var(--s-2);">Pages locales pertinentes pour ce sujet</h2>
        <p class="lead" style="margin-top: var(--s-4); margin-bottom: var(--s-7);">Ce type de fissure est particulièrement fréquent dans ces zones d'Île-de-France. Consultez nos pages locales dédiées.</p>
        <div style="display: flex; flex-wrap: wrap; gap: var(--s-3);">
          ${villesPharesHtml}
        </div>
      </div>
    </section>` : ""}

    <!-- GUIDES LIÉS -->
    ${guidesLiesHtml ? `
    <section class="section">
      <div class="container">
        <span class="eyebrow">À lire aussi</span>
        <h2 style="margin-top: var(--s-2);">Autres guides connexes</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--s-4); margin-top: var(--s-6);">
          ${guidesLiesHtml}
        </div>
      </div>
    </section>` : ""}

    ${contactForm({
      title: "Vos fissures méritent un diagnostic d'expert",
      intro: "Décrivez-nous votre situation. Un expert de notre équipe Île-de-France vous rappelle sous 24 h ouvrées avec un devis personnalisé."
    })}

  </main>

  ${footer()}
</body>
</html>`;
}

// ---------- helpers ---------------------------------------------------------

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, "&quot;");
}
function stripHtml(s) {
  return String(s).replace(/<[^>]+>/g, "");
}

/**
 * Convertit un path interne (ex /77/, /93/saint-denis/) en label lisible.
 */
function pathToLabel(p, geoIndex) {
  if (p === "/") return "Accueil - Île-de-France";
  const parts = p.split("/").filter(Boolean);
  if (parts.length === 1) {
    // Dépt
    const dept = geoIndex.byCode[parts[0]];
    return dept ? `${dept.name} (${parts[0]})` : parts[0];
  }
  if (parts.length === 2) {
    // Ville
    const dept = geoIndex.byCode[parts[0]];
    const ville = dept?.villes.find(v => v.slug === parts[1]);
    return ville ? `${ville.name} (${parts[0]})` : parts[1];
  }
  return p;
}
