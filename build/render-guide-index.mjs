/**
 * render-guide-index.mjs - page /guide/ (index des 17 guides).
 */

import {
  head,
  header,
  breadcrumb,
  schemaBreadcrumb,
  contactForm,
  footer,
  SITE
} from "./partials.mjs";

export function renderGuideIndex(ctx) {
  const { seo, allGuidesSeo } = ctx;
  const path = "/guide/";
  const canonical = `${SITE.domain}${path}`;
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Guides", href: path }
  ];

  // Regroupement éditorial des guides
  const groups = [
    {
      title: "Pour commencer",
      eyebrow: "Diagnostic",
      slugs: ["diagnostic-fissure-maison", "expert-fissure-independant", "tarif-expertise-fissure"]
    },
    {
      title: "Par forme de fissure",
      eyebrow: "Typologie",
      slugs: ["fissure-horizontale", "fissure-verticale", "fissure-traversante", "microfissure", "fissure-structurelle"]
    },
    {
      title: "Par localisation",
      eyebrow: "Où se trouve la fissure",
      slugs: ["fissure-plafond", "fissure-mur-interieur", "fissure-mur-exterieur-facade", "fissure-dalle-beton", "fissure-enduit-crepi"]
    },
    {
      title: "Par type de bâti",
      eyebrow: "Bâti",
      slugs: ["fissure-maison-ancienne", "fissure-maison-neuve", "fissure-parpaing"]
    },
    {
      title: "Causes spécifiques",
      eyebrow: "Cause",
      slugs: ["fissure-secheresse-rga"]
    }
  ];

  const groupsHtml = groups.map(g => {
    const cards = g.slugs.map(s => {
      const guide = allGuidesSeo[s];
      if (!guide) return "";
      const isPivot = s === "fissure-horizontale";
      return `<a href="/guide/${s}/" style="background: var(--paper); padding: var(--s-6); display: grid; gap: var(--s-3); text-decoration: none; color: var(--ink); transition: background var(--tr-fast); ${isPivot ? 'border: 2px solid var(--ocre);' : 'border: var(--bd);'}" onmouseover="this.style.background='var(--paper-deep)'" onmouseout="this.style.background='var(--paper)'">
          ${isPivot ? '<span class="eyebrow" style="color: var(--ocre);">Le plus consulté</span>' : ''}
          <h3 style="margin: 0; font-family: var(--font-serif); font-size: 1.25rem;">${escapeHtml(guide.h1)}</h3>
          <p style="color: var(--graphite); font-size: var(--fs-small); margin: 0; line-height: 1.5;">${escapeHtml(guide.meta_description)}</p>
          <span style="color: var(--ocre); font-family: var(--font-sans); font-size: var(--fs-small); font-weight: 500; margin-top: var(--s-2);">Lire le guide →</span>
        </a>`;
    }).join("");

    return `
    <section class="section">
      <div class="container">
        <div style="display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s-7); align-items: end; margin-bottom: var(--s-6);">
          <div>
            <span class="eyebrow">${escapeHtml(g.eyebrow)}</span>
            <h2 style="margin-top: var(--s-2);">${escapeHtml(g.title)}</h2>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--s-4);">
          ${cards}
        </div>
      </div>
    </section>`;
  }).join("");

  const schemas = [
    schemaBreadcrumb(breadcrumbItems),
    `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "${seo.h1}",
    "description": "${seo.meta_description}",
    "url": "${canonical}"
  }
  </script>`
  ];

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
            <h1 class="display hero__title">Tout savoir sur les <em>fissures</em>, écrit par des ingénieurs.</h1>
            <p class="lead" style="margin-top: var(--s-5);">
              Diagnostic, typologie, niveaux de gravité, solutions et coûts. Nos guides synthétisent l'essentiel à connaître pour interpréter les fissures de votre bien et décider d'agir au bon moment.
            </p>
            <div style="display:flex; gap: var(--s-3); flex-wrap: wrap; margin-top: var(--s-6);">
              <a href="/guide/fissure-horizontale/" class="btn btn--primary">Commencer par le plus lu</a>
              <a href="#groups" class="btn btn--ghost">Tous les guides</a>
            </div>
          </div>
          <dl class="hero__meta">
            <dt>Rédaction</dt>
            <dd>Ingénieurs experts bâtiment</dd>
            <dt>Mise à jour</dt>
            <dd>Avril 2026</dd>
            <dt>Mise en pratique</dt>
            <dd>Diagnostic sous 7 à 15 jours</dd>
          </dl>
        </div>
      </div>
    </section>

    <div id="groups">
      ${groupsHtml}
    </div>

    ${contactForm({
      title: "Vos fissures méritent un diagnostic concret",
      intro: "Les guides répondent à beaucoup de questions, mais rien ne remplace une visite sur site par un ingénieur. Décrivez-nous votre situation."
    })}

  </main>

  ${footer()}
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
