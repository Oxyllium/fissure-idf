/**
 * render-dept.mjs - génère le HTML d'une page pilier départemental.
 * Données croisées : idf-geo.json (sols, bâti, tribunal, villes) + dept-content.json
 * (rédactionnel différencié) + seo-pages.json (title, meta, h1, canonical).
 */

import {
  head,
  header,
  breadcrumb,
  schemaBreadcrumb,
  figuresBlock,
  independanceBlock,
  methodeBlock,
  contactForm,
  footer,
  esc,
  SITE
} from "./partials.mjs";

/**
 * @param {{ geo, content, seo }} ctx - données fusionnées d'un département.
 * @returns {string} HTML complet.
 */
export function renderDept(ctx) {
  const { geo, content, seo } = ctx;
  const code = geo.code;
  const path = `/${code}/`;
  const canonical = `${SITE.domain}${path}`;
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: `${geo.name} (${code})`, href: path }
  ];

  // Schemas JSON-LD
  const schemas = [
    schemaBreadcrumb(breadcrumbItems),
    `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Expertise fissure bâtiment",
    "areaServed": {"@type": "AdministrativeArea", "name": "${esc(geo.nom_long)} (${code})"},
    "provider": {
      "@type": "LocalBusiness",
      "name": "Expert Fissure Île-de-France",
      "url": "${SITE.domain}/",
      "email": "${SITE.email}"
    },
    "description": "${esc("Expertise indépendante des fissures et désordres structurels dans le département " + geo.nom_long + " (" + code + "). Diagnostic sur site, rapport opposable.")}",
    "url": "${canonical}"
  }
  </script>`,
    `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      ${content.faq_specific.map(f => `{"@type": "Question", "name": "${esc(f.q)}", "acceptedAnswer": {"@type": "Answer", "text": "${esc(f.r)}"}}`).join(",\n      ")}
    ]
  }
  </script>`
  ];

  // Sélection des villes voisines pour maillage (toutes les villes du dept)
  const villesGrid = geo.villes.map(v => `
          <a class="dept-card" href="/${code}/${v.slug}/">
            <span class="dept-card__num">${v.cp}</span>
            <span class="dept-card__name">${v.name}</span>
            <span class="dept-card__arrow">→</span>
          </a>`).join("");

  // Villes phares pour la sidebar (max 4)
  const villesPhares = (content.villes_phares || []).slice(0, 4)
    .map(slug => geo.villes.find(v => v.slug === slug))
    .filter(Boolean);

  // Liens guides recommandés
  const guidesHtml = content.guides_recommandes.map(g => `
        <a href="/guide/${g.slug}/" style="background: var(--paper); padding: var(--s-6); display: grid; gap: var(--s-2); text-decoration: none; color: var(--ink); transition: background var(--tr-fast);" onmouseover="this.style.background='var(--paper-deep)'" onmouseout="this.style.background='var(--paper)'">
          <h3 style="margin: 0; text-transform: capitalize;">${slugToTitle(g.slug)}</h3>
          <p style="color: var(--graphite); margin: 0;">${escapeHtml(g.raison)}</p>
        </a>`).join("");

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
            <h1 class="display hero__title">${seo.h1.replace(/Expert fissure/, "Expert <em>fissure</em>")}</h1>
            <p class="lead" style="margin-top: var(--s-5);">
              ${escapeHtml(content.accroche)}
            </p>
            <div style="display:flex; gap: var(--s-3); flex-wrap: wrap; margin-top: var(--s-6);">
              <a href="#contact" class="btn btn--primary btn--lg">Demander un devis gratuit</a>
              <a href="#villes" class="btn btn--ghost">Voir les villes couvertes</a>
            </div>
          </div>
          <dl class="hero__meta">
            <dt>Bâti dominant</dt>
            <dd>${escapeHtml(shortBati(geo.bati_dominant))}</dd>
            <dt>Tribunal compétent</dt>
            <dd>${escapeHtml(geo.tribunal_competent)}</dd>
            <dt>Couverture</dt>
            <dd>${geo.villes.length} communes prioritaires</dd>
          </dl>
        </div>
      </div>
    </section>

    ${independanceBlock()}

    ${figuresBlock()}

    <!-- POURQUOI DES FISSURES DANS CE DÉPT ? -->
    <section class="section">
      <div class="container">
        <div class="split split--7-5">
          <div>
            <span class="eyebrow">Contexte local</span>
            <h2 style="margin-top: var(--s-2);">Pourquoi les fissures sont si fréquentes en ${escapeHtml(geo.nom_long)}</h2>
            ${content.intro_paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("\n            ")}
            <p class="pullquote">«&nbsp;${escapeHtml(content.pullquote)}&nbsp;»</p>
          </div>
          <aside style="background: var(--mist); padding: var(--s-6); border-left: 2px solid var(--ocre);">
            <span class="eyebrow">Sols dominants</span>
            <ul style="display: flex; flex-direction: column; gap: var(--s-3); margin-top: var(--s-4);">
              ${geo.sols_dominants.map(s => `<li style="font-family: var(--font-serif); font-size: 1.0625rem; line-height: 1.4; padding-bottom: var(--s-3); border-bottom: 1px solid var(--mist-line);">${escapeHtml(s)}</li>`).join("\n              ")}
            </ul>
            <h3 style="margin-top: var(--s-6); font-size: 1.0625rem; font-family: var(--font-sans); text-transform: uppercase; letter-spacing: var(--tracking-cap); color: var(--ocre); font-weight: 500;">Bâti dominant</h3>
            <p style="font-size: var(--fs-small); margin-top: var(--s-3);">${escapeHtml(geo.bati_dominant)}</p>
          </aside>
        </div>
      </div>
    </section>

    <!-- ENJEUX SPÉCIFIQUES -->
    <section class="section surface-deep">
      <div class="container">
        <div class="offset-block">
          <div class="offset-block__label">Enjeux ${code}</div>
          <div>
            <h2 style="margin-top: 0;">Cinq enjeux spécifiques au département ${code}</h2>
            <ol class="editorial-list">
              ${content.enjeux.map(e => `<li><div><h3 style="margin-top: 0; font-size: 1.125rem;">${escapeHtml(e)}</h3></div></li>`).join("\n              ")}
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA MILIEU -->
    <section class="surface-ink section--sm">
      <div class="container">
        <div style="display:grid; grid-template-columns: 1fr; gap: var(--s-5); align-items: center;">
          <div style="display:flex; flex-direction: column; gap: var(--s-3);">
            <span class="eyebrow">Demande de devis</span>
            <h2 style="margin: 0; max-width: 28ch;">Une fissure dans le ${code}&nbsp;? Décrivez-la-nous, nous revenons sous 24 h.</h2>
          </div>
          <div>
            <a href="#contact" class="btn btn--primary btn--lg">Démarrer ma demande</a>
          </div>
        </div>
      </div>
    </section>

    <!-- CAS TYPIQUES -->
    <section class="section">
      <div class="container container--narrow">
        <span class="eyebrow">Cas typiques</span>
        <h2 style="margin-top: var(--s-2);">Ce que nos experts rencontrent le plus souvent en ${escapeHtml(geo.name)}</h2>
        <ul style="display: flex; flex-direction: column; gap: var(--s-3); margin-top: var(--s-6);">
          ${content.cas_locaux.map(c => `<li style="display: grid; grid-template-columns: 24px 1fr; gap: var(--s-4); padding: var(--s-4) 0; border-top: var(--bd); align-items: start;">
            <svg width="20" height="20" aria-hidden="true" style="color: var(--ocre); margin-top: 4px;"><use href="/assets/illustrations/icons.svg#icon-check"/></svg>
            <span style="font-family: var(--font-serif); font-size: 1.125rem; line-height: 1.4;">${escapeHtml(c)}</span>
          </li>`).join("\n          ")}
        </ul>
      </div>
    </section>

    <!-- VILLES COUVERTES -->
    <section class="section surface-deep" id="villes">
      <div class="container">
        <span class="eyebrow">Communes couvertes</span>
        <h2 style="margin-top: 0; max-width: 28ch;">Nous intervenons dans toutes les communes du département ${code}</h2>
        <p class="lead" style="margin-top: var(--s-4); margin-bottom: var(--s-7);">
          Cliquez sur votre ville pour accéder à des informations locales détaillées (quartiers, contexte spécifique, cas traités).
        </p>
        <div class="dept-grid">${villesGrid}
        </div>
      </div>
    </section>

    <!-- GUIDES RECOMMANDÉS -->
    <section class="section">
      <div class="container">
        <span class="eyebrow">À lire aussi</span>
        <h2 style="margin-top: var(--s-2); max-width: 28ch;">Guides d'expert utiles pour le département ${code}</h2>
        <p class="lead" style="margin-top: var(--s-4); margin-bottom: var(--s-7);">
          Trois lectures sélectionnées pour leur pertinence par rapport aux pathologies dominantes en ${escapeHtml(geo.name)}.
        </p>
        <div style="display: grid; grid-template-columns: minmax(0, 1fr); gap: 1px; background: var(--mist-line); border: var(--bd);">
          ${guidesHtml}
        </div>
      </div>
    </section>

    <!-- FAQ DÉPARTEMENTALE -->
    <section class="section surface-deep">
      <div class="container container--narrow">
        <span class="eyebrow">Questions fréquentes</span>
        <h2 style="margin-top: var(--s-2);">Vos questions sur les fissures en ${escapeHtml(geo.name)}</h2>
        <div class="faq" style="margin-top: var(--s-6);">
          ${content.faq_specific.map(f => `<details>
            <summary>${escapeHtml(f.q)}</summary>
            <p>${escapeHtml(f.r)}</p>
          </details>`).join("\n          ")}
          <details>
            <summary>Le tribunal compétent en cas de litige est-il celui du département&nbsp;?</summary>
            <p>Oui. Pour les biens situés en ${escapeHtml(geo.name)} (${code}), le tribunal compétent en cas de litige relatif à des fissures (procédure judiciaire civile) est le <strong>${escapeHtml(geo.tribunal_competent)}</strong>. Notre rapport d'expertise est rédigé pour être directement recevable devant cette juridiction.</p>
          </details>
          <details>
            <summary>Combien de temps pour recevoir un expert dans le ${code}&nbsp;?</summary>
            <p>L'intervention sur site est programmée sous 7 à 15 jours après votre prise de contact. Pour les situations d'urgence (péril, fissure évolutive importante), nous priorisons votre dossier.</p>
          </details>
        </div>
      </div>
    </section>

    ${methodeBlock()}

    ${contactForm({
      title: `Une fissure en ${escapeAttr(geo.name)} ? Parlons-en.`,
      intro: `Décrivez-nous votre situation. Un expert de notre équipe Île-de-France vous rappelle sous 24 h ouvrées avec un devis personnalisé et une proposition de date d'intervention.`
    })}

  </main>

  ${footer()}
</body>
</html>`;
}

// ----------------- helpers --------------------------------------------------

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, "&quot;");
}

function formatPop(n) {
  return new Intl.NumberFormat("fr-FR").format(n).replace(/ /g, " ");
}

function shortBati(s) {
  // Tronque proprement si trop long
  if (s.length <= 50) return s;
  return s.slice(0, s.lastIndexOf(",", 50)).trim();
}

function slugToTitle(slug) {
  // ex. "fissure-secheresse-rga" → "Fissure sécheresse RGA"
  const overrides = {
    "fissure-secheresse-rga": "Fissures de sécheresse / RGA",
    "fissure-mur-exterieur-facade": "Fissure mur extérieur et façade",
    "fissure-mur-interieur": "Fissure mur intérieur",
    "fissure-dalle-beton": "Fissure dalle béton",
    "fissure-parpaing": "Fissure mur parpaing",
    "fissure-maison-ancienne": "Fissures dans une maison ancienne",
    "fissure-maison-neuve": "Fissures dans une maison neuve",
    "fissure-horizontale": "Fissure horizontale",
    "fissure-verticale": "Fissure verticale",
    "fissure-traversante": "Fissure traversante",
    "fissure-structurelle": "Fissure structurelle",
    "fissure-plafond": "Fissure au plafond",
    "fissure-enduit-crepi": "Fissure d'enduit ou de crépi",
    "microfissure": "Microfissure",
    "diagnostic-fissure-maison": "Diagnostic fissure maison",
    "tarif-expertise-fissure": "Tarif d'une expertise fissure",
    "expert-fissure-independant": "Expert fissure indépendant"
  };
  if (overrides[slug]) return overrides[slug];
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
