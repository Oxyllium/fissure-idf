/**
 * render-ville.mjs - page ville (P0/P1 enrichies, P2 standard).
 * Croise idf-geo.json (quartiers, cp, dept), seo-pages.json (title, h1, meta),
 * ville-content.json (rédactionnel enrichi, optionnel) + dept-content.json
 * (fallback : reprend les enjeux et guides du dépt si la ville n'a pas son propre contenu).
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

export function renderVille(ctx) {
  const { ville, dept, deptContent, content, seo, geoIndex, allGuidesSeo } = ctx;
  const code = dept.code;
  const slug = ville.slug;
  const path = `/${code}/${slug}/`;
  const canonical = `${SITE.domain}${path}`;
  const isEnriched = !!content;

  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: `${dept.name} (${code})`, href: `/${code}/` },
    { label: ville.name, href: path }
  ];

  // FAQ : spécifiques de la ville si enrichie, sinon génériques + tribunal du dépt
  const faqs = isEnriched && content.faq_specific?.length
    ? content.faq_specific
    : genericVilleFaqs(ville, dept);

  // Schemas
  const schemas = [
    schemaBreadcrumb(breadcrumbItems),
    `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Expertise fissure bâtiment",
    "areaServed": {"@type": "City", "name": "${esc(ville.name)}", "addressRegion": "${esc(dept.name)}", "postalCode": "${ville.cp}"},
    "provider": {
      "@type": "LocalBusiness",
      "name": "Expert Fissure Île-de-France",
      "url": "${SITE.domain}/",
      "email": "${SITE.email}"
    },
    "description": "${esc(`Diagnostic d'expert indépendant des fissures à ${ville.name} (${ville.cp}). Rapport opposable, intervention sous 7 à 15 jours.`)}",
    "url": "${canonical}"
  }
  </script>`,
    `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      ${faqs.map(f => `{"@type": "Question", "name": "${esc(f.q)}", "acceptedAnswer": {"@type": "Answer", "text": "${esc(f.r)}"}}`).join(",\n      ")}
    ]
  }
  </script>`
  ];

  // Quartiers : focus enrichi si ville P0, sinon liste simple
  const quartiersSection = isEnriched && content.quartiers_focus
    ? `
    <section class="section">
      <div class="container">
        <span class="eyebrow">Quartiers</span>
        <h2 style="margin-top: var(--s-2);">Pathologies dominantes par quartier</h2>
        <p class="lead" style="margin-top: var(--s-4); margin-bottom: var(--s-7);">${escapeHtml(ville.name)} ne fissure pas de la même façon partout. Voici les particularités que nos experts rencontrent dans chacun des grands quartiers.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1px; background: var(--mist-line); border: var(--bd);">
          ${content.quartiers_focus.map(q => `<div style="background: var(--paper); padding: var(--s-6);">
            <h3 style="margin-top: 0; font-family: var(--font-serif); font-size: 1.25rem;">${escapeHtml(q.nom)}</h3>
            <p style="margin-top: var(--s-3); color: var(--graphite); font-size: var(--fs-small); line-height: 1.6;">${escapeHtml(q.description)}</p>
          </div>`).join("")}
        </div>
      </div>
    </section>`
    : `
    <section class="section">
      <div class="container container--narrow">
        <span class="eyebrow">Quartiers couverts</span>
        <h2 style="margin-top: var(--s-2);">Nous intervenons dans tous les quartiers de ${escapeHtml(ville.name)}</h2>
        <p class="lead" style="margin-top: var(--s-4); margin-bottom: var(--s-6);">Diagnostic d'expert sur l'ensemble du territoire communal - centre, périphérie, zones pavillonnaires et résidentielles.</p>
        <ul style="display: flex; flex-wrap: wrap; gap: var(--s-3); list-style: none; margin-top: var(--s-5);">
          ${(ville.quartiers || []).map(q => `<li style="background: var(--mist); padding: var(--s-3) var(--s-5); font-family: var(--font-serif); font-style: italic; color: var(--ink);">${escapeHtml(q)}</li>`).join("")}
        </ul>
      </div>
    </section>`;

  // Section "pourquoi des fissures à [ville]"
  const contextSection = isEnriched
    ? `
    <section class="section">
      <div class="container">
        <div class="split split--7-5">
          <div>
            <span class="eyebrow">Contexte local</span>
            <h2 style="margin-top: var(--s-2);">Pourquoi des fissures à ${escapeHtml(ville.name)} ?</h2>
            ${content.intro_paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("\n            ")}
            ${content.pullquote ? `<p class="pullquote">«&nbsp;${escapeHtml(content.pullquote)}&nbsp;»</p>` : ""}
          </div>
          <aside style="background: var(--mist); padding: var(--s-6); border-left: 2px solid var(--ocre);">
            <span class="eyebrow">Sols dominants ${escapeHtml(dept.name)}</span>
            <ul style="display: flex; flex-direction: column; gap: var(--s-3); margin-top: var(--s-4);">
              ${dept.sols_dominants.map(s => `<li style="font-family: var(--font-serif); font-size: 1.0625rem; line-height: 1.4; padding-bottom: var(--s-3); border-bottom: 1px solid var(--mist-line);">${escapeHtml(s)}</li>`).join("")}
            </ul>
            <h3 style="margin-top: var(--s-6); font-size: 0.875rem; font-family: var(--font-sans); text-transform: uppercase; letter-spacing: var(--tracking-cap); color: var(--ocre); font-weight: 500;">Bâti dominant</h3>
            <p style="font-size: var(--fs-small); margin-top: var(--s-3);">${escapeHtml(dept.bati_dominant)}</p>
            <h3 style="margin-top: var(--s-5); font-size: 0.875rem; font-family: var(--font-sans); text-transform: uppercase; letter-spacing: var(--tracking-cap); color: var(--ocre); font-weight: 500;">Tribunal compétent</h3>
            <p style="font-size: var(--fs-small); margin-top: var(--s-3);">${escapeHtml(dept.tribunal_competent)}</p>
          </aside>
        </div>
      </div>
    </section>`
    : `
    <section class="section">
      <div class="container container--narrow">
        <span class="eyebrow">Contexte local</span>
        <h2 style="margin-top: var(--s-2);">Pourquoi des fissures à ${escapeHtml(ville.name)} ?</h2>
        <p>${escapeHtml(deptContent.intro_paragraphs[0])}</p>
        <p>${escapeHtml(deptContent.intro_paragraphs[1])}</p>
        ${deptContent.pullquote ? `<p class="pullquote">«&nbsp;${escapeHtml(deptContent.pullquote)}&nbsp;»</p>` : ""}
      </div>
    </section>`;

  // Enjeux locaux (si enrichie) ou enjeux du dept en fallback
  const enjeux = isEnriched ? content.enjeux_locaux : deptContent.enjeux;
  const enjeuxSection = `
    <section class="section surface-deep">
      <div class="container">
        <div class="offset-block">
          <div class="offset-block__label">Enjeux ${escapeHtml(ville.name)}</div>
          <div>
            <h2 style="margin-top: 0;">${isEnriched ? `Particularités techniques de ${escapeHtml(ville.name)}` : `Enjeux fissures dans le département ${code}`}</h2>
            <ol class="editorial-list">
              ${enjeux.map(e => `<li><div><h3 style="margin-top: 0; font-size: 1.125rem;">${escapeHtml(e)}</h3></div></li>`).join("")}
            </ol>
          </div>
        </div>
      </div>
    </section>`;

  // Cas locaux
  const cas = isEnriched ? content.cas_locaux : deptContent.cas_locaux;
  const casSection = `
    <section class="section">
      <div class="container container--narrow">
        <span class="eyebrow">Cas typiques</span>
        <h2 style="margin-top: var(--s-2);">Ce que nos experts rencontrent à ${escapeHtml(ville.name)}</h2>
        <ul style="display: flex; flex-direction: column; gap: var(--s-3); margin-top: var(--s-6);">
          ${cas.map(c => `<li style="display: grid; grid-template-columns: 24px 1fr; gap: var(--s-4); padding: var(--s-4) 0; border-top: var(--bd); align-items: start;">
            <svg width="20" height="20" aria-hidden="true" style="color: var(--ocre); margin-top: 4px;"><use href="/assets/illustrations/icons.svg#icon-check"/></svg>
            <span style="font-family: var(--font-serif); font-size: 1.125rem; line-height: 1.4;">${escapeHtml(c)}</span>
          </li>`).join("")}
        </ul>
      </div>
    </section>`;

  // Villes voisines
  const voisinsSlugs = (isEnriched && content.villes_voisines) || deptVoisinsAuto(ville, dept);
  const voisinsHtml = voisinsSlugs
    .map(s => geoIndex.findVille(s))
    .filter(Boolean)
    .slice(0, 4)
    .map(({ ville: v, dept: d }) => `
        <a href="/${d.code}/${v.slug}/" class="dept-card">
          <span class="dept-card__num">${v.cp}</span>
          <span class="dept-card__name">${escapeHtml(v.name)}</span>
          <span class="dept-card__arrow">→</span>
        </a>`).join("");

  const voisinsSection = voisinsHtml ? `
    <section class="section surface-deep">
      <div class="container">
        <span class="eyebrow">Communes voisines</span>
        <h2 style="margin-top: var(--s-2);">Nous intervenons aussi à proximité de ${escapeHtml(ville.name)}</h2>
        <p class="lead" style="margin-top: var(--s-4); margin-bottom: var(--s-7);">Diagnostic sur l'ensemble du département ${code}. Voici les communes les plus fréquemment couvertes en complément.</p>
        <div class="dept-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
          ${voisinsHtml}
        </div>
        <p style="margin-top: var(--s-6);">
          <a href="/${code}/" class="btn btn--ghost">Voir toutes les villes du département ${code}</a>
        </p>
      </div>
    </section>` : "";

  // Guides recommandés
  const guidesSlugs = isEnriched && content.guides_recommandes
    ? content.guides_recommandes
    : (deptContent.guides_recommandes || []);
  const guidesHtml = guidesSlugs.map(g => {
    const linkedSeo = allGuidesSeo[g.slug];
    if (!linkedSeo) return "";
    return `
      <a href="/guide/${g.slug}/" style="background: var(--paper); padding: var(--s-6); display: grid; gap: var(--s-3); text-decoration: none; color: var(--ink); border: var(--bd); transition: background var(--tr-fast);" onmouseover="this.style.background='var(--paper-deep)'" onmouseout="this.style.background='var(--paper)'">
        <span class="eyebrow">Guide d'expert</span>
        <h3 style="margin: 0; font-size: 1.125rem; font-family: var(--font-serif);">${escapeHtml(linkedSeo.h1)}</h3>
        <p style="margin: 0; color: var(--graphite); font-size: var(--fs-small);">${escapeHtml(g.raison)}</p>
      </a>`;
  }).join("");

  // FAQ générique pour villes (tribunal, délai)
  const faqHtml = faqs.map(f => `<details>
            <summary>${escapeHtml(f.q)}</summary>
            <p>${escapeHtml(f.r)}</p>
          </details>`).join("");

  // Hero
  const heroAccroche = isEnriched ? content.accroche : `Diagnostic indépendant des fissures à ${ville.name} (${ville.cp}). Cabinet d'expertise reconnu, intervention sur site sous 7 à 15 jours, rapport opposable.`;

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
            <h1 class="display hero__title">${formatH1(seo.h1)}</h1>
            <p class="lead" style="margin-top: var(--s-5);">${escapeHtml(heroAccroche)}</p>
            <div style="display:flex; gap: var(--s-3); flex-wrap: wrap; margin-top: var(--s-6);">
              <a href="#contact" class="btn btn--primary btn--lg">Demander un devis gratuit</a>
              <a href="/${code}/" class="btn btn--ghost">Voir toutes les villes</a>
            </div>
          </div>
          <dl class="hero__meta">
            <dt>Code postal</dt>
            <dd>${ville.cp}</dd>
            <dt>Département</dt>
            <dd>${escapeHtml(dept.name)} (${code})</dd>
            <dt>Tribunal compétent</dt>
            <dd>${escapeHtml(dept.tribunal_competent)}</dd>
          </dl>
        </div>
      </div>
    </section>

    ${independanceBlock()}

    ${figuresBlock()}

    ${contextSection}

    ${enjeuxSection}

    <!-- CTA milieu -->
    <section class="surface-ink section--sm">
      <div class="container">
        <div style="display:grid; grid-template-columns: 1fr; gap: var(--s-5); align-items: center;">
          <div style="display:flex; flex-direction: column; gap: var(--s-3);">
            <span class="eyebrow">Demande de devis</span>
            <h2 style="margin: 0; max-width: 28ch;">Une fissure à ${escapeHtml(ville.name)} ? Décrivez-la-nous, nous revenons sous 24 h.</h2>
          </div>
          <div>
            <a href="#contact" class="btn btn--primary btn--lg">Démarrer ma demande</a>
          </div>
        </div>
      </div>
    </section>

    ${casSection}

    ${quartiersSection}

    ${voisinsSection}

    ${guidesHtml ? `
    <section class="section">
      <div class="container">
        <span class="eyebrow">Guides associés</span>
        <h2 style="margin-top: var(--s-2);">Ressources techniques pertinentes pour ${escapeHtml(ville.name)}</h2>
        <p class="lead" style="margin-top: var(--s-4); margin-bottom: var(--s-7);">Trois lectures sélectionnées en fonction des pathologies dominantes localement.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--s-4);">
          ${guidesHtml}
        </div>
      </div>
    </section>` : ""}

    <!-- FAQ -->
    <section class="section surface-deep">
      <div class="container container--narrow">
        <span class="eyebrow">Questions fréquentes</span>
        <h2 style="margin-top: var(--s-2);">Vos questions sur les fissures à ${escapeHtml(ville.name)}</h2>
        <div class="faq" style="margin-top: var(--s-6);">
          ${faqHtml}
        </div>
      </div>
    </section>

    ${methodeBlock()}

    ${contactForm({
      title: `Une fissure à ${escapeAttr(ville.name)} ? Parlons-en.`,
      intro: `Décrivez-nous votre situation. Un expert de notre équipe Île-de-France vous rappelle sous 24 h ouvrées avec un devis personnalisé et une proposition de date d'intervention à ${escapeHtml(ville.name)}.`
    })}

  </main>

  ${footer()}
</body>
</html>`;
}

// ---------- helpers ---------------------------------------------------------

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, "&quot;");
}

/**
 * Détermine 4 villes voisines du même dept en l'absence de configuration explicite.
 */
function deptVoisinsAuto(ville, dept) {
  return dept.villes
    .filter(v => v.slug !== ville.slug)
    .slice(0, 4)
    .map(v => v.slug);
}

/**
 * FAQ générique pour villes non enrichies : reprend les questions de fond
 * mais adaptées avec le nom de la ville et le tribunal.
 */
function genericVilleFaqs(ville, dept) {
  return [
    {
      q: `Combien coûte une expertise fissure à ${ville.name} ?`,
      r: `Les tarifs pour une intervention à ${ville.name} dépendent de la surface du bien, de la complexité du sinistre et de l'éloignement. Comptez entre 800 € et 2 000 € HT en moyenne pour une maison individuelle, et 700 € à 1 600 € HT pour un appartement. Devis personnalisé et gratuit sous 24 h ouvrées.`
    },
    {
      q: `En combien de temps puis-je recevoir un expert à ${ville.name} ?`,
      r: `L'intervention sur site est programmée sous 7 à 15 jours après votre prise de contact. Pour les situations d'urgence (péril, fissure évolutive importante), nous priorisons votre dossier et pouvons intervenir dans les 48 à 72 h.`
    },
    {
      q: `Quel tribunal est compétent en cas de litige fissure à ${ville.name} ?`,
      r: `Pour les biens situés à ${ville.name} (${dept.name}), le tribunal compétent en cas de litige civil relatif à des fissures (procédure judiciaire) est le ${dept.tribunal_competent}. Notre rapport d'expertise est rédigé pour être directement recevable devant cette juridiction.`
    },
    {
      q: `Le rapport d'expertise est-il opposable à mon assurance ?`,
      r: `Oui. Notre rapport est reconnu par toutes les compagnies d'assurance et peut être produit comme pièce à charge dans une déclaration de sinistre, une contre-expertise amiable ou une procédure judiciaire. Sa rigueur méthodologique est conçue pour résister à la contre-expertise.`
    }
  ];
}

function formatH1(h1) {
  // Met "fissure" en italique ocre
  return escapeHtml(h1).replace(/fissure/i, "<em>$&</em>");
}
