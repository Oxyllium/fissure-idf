/**
 * Partials HTML réutilisables : header, footer, sticky bar, head commun.
 * Chaque fonction renvoie une chaîne HTML.
 */

export const SITE = {
  domain: "https://expert-fissure-idf.fr",
  brand: "Expert Fissure IDF",
  email: "quentinwebredac@gmail.com"
};

const FONTS_LINK = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Sora:wght@400;500;600&display=swap" rel="stylesheet">`;

const STYLES_LINK = `
  <link rel="stylesheet" href="/css/tokens.css">
  <link rel="stylesheet" href="/css/reset.css">
  <link rel="stylesheet" href="/css/base.css">
  <link rel="stylesheet" href="/css/layout.css">
  <link rel="stylesheet" href="/css/components.css">`;

/**
 * <head> commun.
 * @param {{title, description, canonical, ogImage?, robots?, schemas?: string[]}} p
 */
export function head(p) {
  const robots = p.robots || "index, follow, max-image-preview:large";
  const ogImage = p.ogImage || `${SITE.domain}/assets/og-default.jpg`;
  const schemaBlocks = (p.schemas || []).join("\n  ");
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${p.title}</title>
  <meta name="description" content="${p.description}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${p.canonical}">
  <meta name="theme-color" content="#f5f1ea">

  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${p.canonical}">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:site_name" content="Expert Fissure IDF">
  <meta property="og:image" content="${ogImage}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${p.title}">
  <meta name="twitter:description" content="${p.description}">
  ${FONTS_LINK}
  ${STYLES_LINK}

  ${schemaBlocks}

  <script src="/js/main.js" defer></script>
</head>`;
}

/**
 * Header (sticky desktop, burger mobile).
 * @param {{currentPath?: string}} p
 */
export function header(p = {}) {
  const isContact = p.currentPath === "/contact/";
  const isGuide = p.currentPath?.startsWith("/guide/");
  return `
  <header class="site-header">
    <div class="site-header__inner">
      <a class="brand" href="/">
        <span class="brand__mark">Expert <em>Fissure</em></span>
        <span class="brand__sub">Île-de-France</span>
      </a>
      <nav class="site-nav" aria-label="Navigation principale">
        <a href="/guide/"${isGuide ? ' aria-current="page"' : ''}>Guides</a>
        <a href="/#departements">Départements</a>
        <a href="/contact/"${isContact ? ' aria-current="page"' : ''}>Contact</a>
      </nav>
      <div class="header-actions">
        <a class="btn btn--email" href="mailto:${SITE.email}">
          <svg width="16" height="16" aria-hidden="true"><use href="/assets/illustrations/icons.svg#icon-mail"/></svg>
          Email
        </a>
        <a class="btn btn--primary" href="#contact">Demander un devis</a>
        <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-menu">
          <svg aria-hidden="true"><use href="/assets/illustrations/icons.svg#icon-burger"/></svg>
        </button>
      </div>
    </div>
    <div class="mobile-menu" id="mobile-menu">
      <ul>
        <li><a href="/guide/">Guides</a></li>
        <li><a href="/#departements">Départements</a></li>
        <li><a href="/contact/">Contact</a></li>
        <li><a href="mailto:${SITE.email}">Nous écrire</a></li>
      </ul>
    </div>
  </header>`;
}

/**
 * Breadcrumb component (HTML + JSON-LD séparé via schemaBreadcrumb).
 * @param {{label, href}[]} items
 */
export function breadcrumb(items) {
  const last = items.length - 1;
  return `
    <nav class="breadcrumb container" aria-label="Fil d'Ariane">
      <ol>
        ${items.map((it, i) =>
          i === last
            ? `<li><span aria-current="page">${it.label}</span></li>`
            : `<li><a href="${it.href}">${it.label}</a></li>`
        ).join("\n        ")}
      </ol>
    </nav>`;
}

export function schemaBreadcrumb(items) {
  return `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      ${items.map((it, i) => `{"@type": "ListItem", "position": ${i + 1}, "name": "${esc(it.label)}", "item": "${SITE.domain}${it.href}"}`).join(",\n      ")}
    ]
  }
  </script>`;
}

/**
 * Bloc 5 chiffres-clés (réassurance).
 */
export function figuresBlock() {
  return `
    <section class="section--sm" aria-label="Chiffres clés">
      <div class="container">
        <div class="figures">
          <div class="figure">
            <span class="figure__value"><em>1<sup>er</sup></em></span>
            <span class="figure__label">cabinet d'expertise bâtiment de France</span>
          </div>
          <div class="figure">
            <span class="figure__value">300<em>–</em>400</span>
            <span class="figure__label">dossiers traités chaque mois</span>
          </div>
          <div class="figure">
            <span class="figure__value">90&thinsp;%</span>
            <span class="figure__label">de clients particuliers</span>
          </div>
          <div class="figure">
            <span class="figure__value">8</span>
            <span class="figure__label">départements couverts en Île-de-France</span>
          </div>
          <div class="figure">
            <span class="figure__value">24&thinsp;h</span>
            <span class="figure__label">délai de prise de contact</span>
          </div>
        </div>
      </div>
    </section>`;
}

/**
 * Bloc indépendance (argument SEO différenciant).
 */
export function independanceBlock() {
  return `
    <section class="section section--sm">
      <div class="container">
        <div class="independance">
          <span class="eyebrow">Notre engagement</span>
          <h2>Expert fissure indépendant&nbsp;: ce que cela change pour vous</h2>
          <p style="max-width: 60ch; margin-top: var(--s-3);">
            Trop d'expertises de fissures sont commandées par votre propre assurance ou par une entreprise de travaux. Les conclusions y sont rarement neutres. Notre cabinet n'a aucun lien capitalistique ni commercial avec ces deux acteurs. Vous obtenez une lecture technique, opposable, qui défend uniquement les faits.
          </p>
          <ul>
            <li><svg aria-hidden="true"><use href="/assets/illustrations/icons.svg#icon-check"/></svg><span>Aucune relation d'affaires avec les assureurs ou les entreprises de réparation.</span></li>
            <li><svg aria-hidden="true"><use href="/assets/illustrations/icons.svg#icon-check"/></svg><span>Rapport reconnu par les compagnies d'assurance et recevable devant les tribunaux.</span></li>
            <li><svg aria-hidden="true"><use href="/assets/illustrations/icons.svg#icon-check"/></svg><span>Préconisations de travaux chiffrées, sans intérêt à les sur-évaluer.</span></li>
            <li><svg aria-hidden="true"><use href="/assets/illustrations/icons.svg#icon-check"/></svg><span>Accompagnement neutre dans la déclaration de sinistre et la contre-expertise.</span></li>
          </ul>
        </div>
      </div>
    </section>`;
}

/**
 * Bloc méthode 4 étapes.
 */
export function methodeBlock() {
  return `
    <section class="section">
      <div class="container">
        <div class="offset-block">
          <div class="offset-block__label">Méthode</div>
          <div>
            <h2 style="margin-top: 0;">Notre méthode d'expertise, en quatre temps</h2>
            <p class="lead" style="margin-bottom: var(--s-6);">
              Une démarche éprouvée sur plusieurs milliers de dossiers en France. Chaque étape est cadrée, datée, traçable.
            </p>
            <ol class="editorial-list">
              <li>
                <div>
                  <h3 style="margin-top: 0;">Prise de contact <span style="color: var(--graphite-soft); font-family: var(--font-sans); font-size: var(--fs-small); margin-left: var(--s-3);">- sous 24 h ouvrées</span></h3>
                  <p>Vous nous contactez par formulaire ou par email. Un expert vous rappelle pour analyser votre situation, comprendre l'évolution des désordres et planifier l'intervention.</p>
                </div>
              </li>
              <li>
                <div>
                  <h3 style="margin-top: 0;">Visite sur site <span style="color: var(--graphite-soft); font-family: var(--font-sans); font-size: var(--fs-small); margin-left: var(--s-3);">- sous 7 à 15 jours</span></h3>
                  <p>L'ingénieur se déplace à votre domicile. Relevés métriques, photographies haute définition, lecture du bâti et du sol environnant, entretien sur l'historique du bien.</p>
                </div>
              </li>
              <li>
                <div>
                  <h3 style="margin-top: 0;">Rapport d'expertise <span style="color: var(--graphite-soft); font-family: var(--font-sans); font-size: var(--fs-small); margin-left: var(--s-3);">- sous 10 à 15 jours après visite</span></h3>
                  <p>Document technique détaillé&nbsp;: identification des désordres, hypothèses causales argumentées, niveau de gravité, préconisations de travaux et chiffrage indicatif.</p>
                </div>
              </li>
              <li>
                <div>
                  <h3 style="margin-top: 0;">Accompagnement post-expertise <span style="color: var(--graphite-soft); font-family: var(--font-sans); font-size: var(--fs-small); margin-left: var(--s-3);">- selon besoin</span></h3>
                  <p>Assistance dans les démarches d'assurance, contre-expertise, dialogue avec les entreprises de réparation, et présence en expertise judiciaire si nécessaire.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>`;
}

/**
 * Formulaire de contact réutilisable.
 * @param {{anchor?: string, eyebrow?: string, title?: string, intro?: string}} p
 */
export function contactForm(p = {}) {
  const anchor = p.anchor || "contact";
  const eyebrow = p.eyebrow || "Demande de devis";
  const title = p.title || "Parlons de vos fissures";
  const intro = p.intro || "Décrivez-nous brièvement votre situation. Un expert vous recontacte sous 24 h ouvrées avec un devis personnalisé et une proposition de date d'intervention.";
  return `
    <section class="contact-block" id="${anchor}">
      <div class="container">
        <div class="contact-block__grid">
          <div class="contact-intro">
            <span class="eyebrow">${eyebrow}</span>
            <h2>${title}</h2>
            <p>${intro}</p>
            <ul class="contact-intro__list">
              <li><svg aria-hidden="true"><use href="/assets/illustrations/icons.svg#icon-clock"/></svg><span>Réponse sous 24 h ouvrées, devis gratuit et sans engagement.</span></li>
              <li><svg aria-hidden="true"><use href="/assets/illustrations/icons.svg#icon-shield"/></svg><span>Confidentialité garantie, vos données ne sont jamais transmises à un tiers.</span></li>
              <li><svg aria-hidden="true"><use href="/assets/illustrations/icons.svg#icon-mail"/></svg><span>Vous préférez écrire&nbsp;? <a href="mailto:${SITE.email}">${SITE.email}</a></span></li>
            </ul>
          </div>
          <form class="contact-form" data-contact-form name="contact" method="POST" action="/merci/" data-netlify="true" data-netlify-honeypot="bot-field" novalidate>
            <input type="hidden" name="form-name" value="contact">
            <p hidden><label>Ne pas remplir si vous êtes humain : <input name="bot-field"></label></p>
            <div class="field--row">
              <div class="field">
                <label for="f-nom">Nom et prénom <span class="req">*</span></label>
                <input id="f-nom" name="nom" type="text" required autocomplete="name">
                <span class="field__error">Champ requis.</span>
              </div>
              <div class="field">
                <label for="f-email">Email <span class="req">*</span></label>
                <input id="f-email" name="email" type="email" required autocomplete="email" inputmode="email">
                <span class="field__error">Email invalide.</span>
              </div>
            </div>
            <div class="field--row">
              <div class="field">
                <label for="f-tel">Téléphone</label>
                <input id="f-tel" name="telephone" type="tel" autocomplete="tel" inputmode="tel">
                <span class="field__hint">Optionnel - facilite la prise de contact.</span>
              </div>
              <div class="field">
                <label for="f-ville">Ville d'intervention <span class="req">*</span></label>
                <input id="f-ville" name="ville" type="text" required placeholder="Ex. Boulogne-Billancourt, Meaux…">
                <span class="field__error">Champ requis.</span>
              </div>
            </div>
            <div class="field">
              <label for="f-type">Type de fissure observée</label>
              <select id="f-type" name="type_fissure">
                <option value="">- Sélectionner -</option>
                <option>Fissure horizontale</option>
                <option>Fissure verticale</option>
                <option>Fissure en escalier / oblique</option>
                <option>Fissure traversante</option>
                <option>Fissure de plafond</option>
                <option>Fissure de façade extérieure</option>
                <option>Microfissures multiples</option>
                <option>Je ne sais pas</option>
              </select>
            </div>
            <div class="field">
              <label for="f-message">Décrivez votre situation <span class="req">*</span></label>
              <textarea id="f-message" name="message" required placeholder="Type de bien, ancienneté, nombre de fissures, évolution récente, contexte (sécheresse, chantier voisin…)"></textarea>
              <span class="field__error">Champ requis.</span>
            </div>
            <div class="field">
              <label class="form-consent">
                <input type="checkbox" name="consent" required>
                <span>J'accepte que mes données soient utilisées pour traiter ma demande. Voir <a href="/mentions-legales/">mentions légales</a>.</span>
              </label>
              <span class="field__error" style="margin-left: 32px;">Vous devez accepter pour continuer.</span>
            </div>
            <div class="form-feedback" role="status" aria-live="polite"></div>
            <div>
              <button type="submit" class="btn btn--ink btn--lg" data-label="Envoyer ma demande">Envoyer ma demande</button>
            </div>
          </form>
        </div>
      </div>
    </section>`;
}

/**
 * Footer commun.
 */
export function footer() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__top">
        <div class="footer-brand">
          <span class="brand__mark">Expert <em>Fissure</em></span>
          <p>Cabinet d'expertise en bâtiment, équipe dédiée Île-de-France. Diagnostic indépendant des fissures, rapport opposable, accompagnement sinistre.</p>
          <p>Écrivez-nous : <a href="mailto:${SITE.email}">${SITE.email}</a></p>
        </div>
        <div class="footer-map">
          <h3>Nous intervenons</h3>
          <object type="image/svg+xml" data="/assets/illustrations/carte-idf.svg" aria-label="Carte des 8 départements d'Île-de-France" class="footer-map__svg"></object>
        </div>
      </div>
      <div class="footer-cols" style="padding-top: var(--s-7);">
        <div>
          <h4>Départements</h4>
          <ul>
            <li><a href="/75/">Paris (75)</a></li>
            <li><a href="/77/">Seine-et-Marne (77)</a></li>
            <li><a href="/78/">Yvelines (78)</a></li>
            <li><a href="/91/">Essonne (91)</a></li>
            <li><a href="/92/">Hauts-de-Seine (92)</a></li>
            <li><a href="/93/">Seine-Saint-Denis (93)</a></li>
            <li><a href="/94/">Val-de-Marne (94)</a></li>
            <li><a href="/95/">Val-d'Oise (95)</a></li>
          </ul>
        </div>
        <div>
          <h4>Guides</h4>
          <ul>
            <li><a href="/guide/fissure-horizontale/">Fissure horizontale</a></li>
            <li><a href="/guide/fissure-secheresse-rga/">Sécheresse / RGA</a></li>
            <li><a href="/guide/fissure-maison-ancienne/">Maison ancienne</a></li>
            <li><a href="/guide/diagnostic-fissure-maison/">Diagnostic fissure</a></li>
            <li><a href="/guide/expert-fissure-independant/">Expert indépendant</a></li>
            <li><a href="/guide/">Tous les guides</a></li>
          </ul>
        </div>
        <div>
          <h4>Cabinet</h4>
          <ul>
            <li><a href="/contact/">Nous contacter</a></li>
            <li><a href="/mentions-legales/">Mentions légales</a></li>
            <li><a href="mailto:${SITE.email}">Email</a></li>
          </ul>
        </div>
      </div>
      <div class="site-footer__bottom">
        <span>© <span id="y"></span> Expert Fissure Île-de-France · Tous droits réservés.</span>
        <span><a href="/mentions-legales/">Mentions légales</a></span>
      </div>
    </div>
  </footer>

  <aside class="mobile-sticky-bar" aria-label="Demande rapide">
    <div class="mobile-sticky-bar__msg">
      <strong>Devis gratuit</strong><br>
      Réponse sous 24 h
    </div>
    <a href="#contact" class="mobile-sticky-bar__cta">Demander un devis</a>
  </aside>

  <script>document.getElementById('y').textContent=new Date().getFullYear();</script>
</body>
</html>`;
}

// Helper minimal escape pour JSON-LD strings (pas pour HTML - pour ça utiliser textContent côté client).
export function esc(s) {
  return String(s).replace(/"/g, '\\"').replace(/\n/g, '\\n');
}
