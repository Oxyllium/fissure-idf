/**
 * render-blog.mjs - renderers du silo blog :
 *   - renderBlogIndex : page /blog/ (hub éditorial)
 *   - renderBlogCategory : pages /blog/{slug-cat}/
 *   - renderBlogArticle : pages /blog/{slug-article}/
 */

import {
  head,
  header,
  breadcrumb,
  schemaBreadcrumb,
  contactForm,
  footer,
  esc,
  SITE
} from "./partials.mjs";

const SLUG_LABELS = {
  "diagnostic-expertise": "Diagnostic & expertise",
  "types-de-fissures": "Types de fissures",
  "reparation-solutions": "Réparation & solutions",
  "cas-pratiques": "Cas pratiques",
  "assurance-reglementation": "Assurance & réglementation",
  "actualites-idf": "Actualités IDF"
};

// --------------------------------------------------------------------- INDEX

export function renderBlogIndex(ctx) {
  const { seo, blogContent, articles, categoriesSeo } = ctx;
  const path = "/blog/";
  const canonical = `${SITE.domain}${path}`;
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Blog", href: path }
  ];

  const schemas = [
    schemaBreadcrumb(breadcrumbItems),
    `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "${esc(seo.h1)}",
    "description": "${esc(seo.meta_description)}",
    "url": "${canonical}",
    "publisher": {"@type": "Organization", "name": "Expert Fissure Île-de-France"}
  }
  </script>`
  ];

  // Cartes de catégories
  const categoriesHtml = Object.entries(blogContent.categories).map(([slug, c]) => {
    const seoCat = categoriesSeo[slug] || {};
    const label = SLUG_LABELS[slug] || slug;
    return `
      <a href="/blog/${slug}/" style="background: var(--paper); padding: var(--s-6); display: grid; gap: var(--s-3); text-decoration: none; color: var(--ink); border: var(--bd); transition: background var(--tr-fast);" onmouseover="this.style.background='var(--paper-deep)'" onmouseout="this.style.background='var(--paper)'">
        <span class="eyebrow">Catégorie</span>
        <h3 style="margin: 0; font-family: var(--font-serif); font-size: 1.25rem;">${escapeHtml(label)}</h3>
        <p style="color: var(--graphite); font-size: var(--fs-small); margin: 0; line-height: 1.5;">${escapeHtml((seoCat.description || "").trim())}</p>
        <span style="color: var(--ocre); font-family: var(--font-sans); font-size: var(--fs-small); font-weight: 500; margin-top: var(--s-2);">Voir la catégorie →</span>
      </a>`;
  }).join("");

  // Liste des articles publiés
  const articlesHtml = articles.length ? articles.map(a => `
        <article style="display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s-3); padding: var(--s-6) 0; border-top: var(--bd);">
          <span class="eyebrow">${escapeHtml(SLUG_LABELS[a.category] || a.category)} · ${formatDate(a.date_published)}</span>
          <h3 style="margin: 0; font-family: var(--font-serif); font-size: 1.5rem;"><a href="/blog/${a.slug}/" style="color: var(--ink); text-decoration: none;">${escapeHtml(a.h1)}</a></h3>
          <p style="margin: 0; color: var(--graphite); max-width: 65ch;">${escapeHtml(a.meta_description)}</p>
          <a href="/blog/${a.slug}/" style="color: var(--ocre); font-family: var(--font-sans); font-size: var(--fs-small); font-weight: 500; margin-top: var(--s-2);">Lire l'article →</a>
        </article>`).join("") : "";

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
            <span class="eyebrow">Hub éditorial</span>
            <h1 class="display hero__title">Actualités, cas pratiques, conseils - par nos <em>ingénieurs experts</em>.</h1>
            <p class="lead" style="margin-top: var(--s-5);">
              Le blog de notre cabinet rassemble retours de terrain anonymisés, actualités réglementaires (arrêtés sécheresse, jurisprudence), méthodes de diagnostic et avancées techniques. Un complément vivant à nos guides d'expert.
            </p>
            <div style="display:flex; gap: var(--s-3); flex-wrap: wrap; margin-top: var(--s-6);">
              <a href="#categories" class="btn btn--primary">Explorer les catégories</a>
              <a href="/guide/" class="btn btn--ghost">Voir aussi nos guides</a>
            </div>
          </div>
          <dl class="hero__meta">
            <dt>Rédaction</dt>
            <dd>Ingénieurs experts bâtiment</dd>
            <dt>Mise à jour</dt>
            <dd>Avril 2026</dd>
            <dt>Spécialité</dt>
            <dd>Île-de-France</dd>
          </dl>
        </div>
      </div>
    </section>

    ${articlesHtml ? `
    <section class="section">
      <div class="container container--narrow">
        <span class="eyebrow">Derniers articles</span>
        <h2 style="margin-top: var(--s-2);">À lire en ce moment</h2>
        ${articlesHtml}
      </div>
    </section>` : ""}

    <section class="section surface-deep" id="categories">
      <div class="container">
        <span class="eyebrow">6 catégories</span>
        <h2 style="margin-top: var(--s-2);">Explorer par thème</h2>
        <p class="lead" style="margin-top: var(--s-4); margin-bottom: var(--s-7); max-width: 65ch;">
          Chaque catégorie regroupe des articles courts (5-10 minutes de lecture), pratiques, ancrés dans la réalité de notre activité quotidienne.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--s-4);">
          ${categoriesHtml}
        </div>
      </div>
    </section>

    ${contactForm({
      title: "Une situation à diagnostiquer ?",
      intro: "Les articles posent les bonnes questions, mais rien ne remplace une visite sur site par un ingénieur. Décrivez-nous votre cas."
    })}

  </main>

  ${footer()}
</body>
</html>`;
}

// ----------------------------------------------------------------- CATEGORIE

export function renderBlogCategory(ctx) {
  const { slug, content, seo, articles } = ctx;
  const path = `/blog/${slug}/`;
  const canonical = `${SITE.domain}${path}`;
  const label = SLUG_LABELS[slug] || slug;
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Blog", href: "/blog/" },
    { label: label, href: path }
  ];

  const schemas = [
    schemaBreadcrumb(breadcrumbItems),
    `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "${esc(seo.h1 || label)}",
    "description": "${esc(seo.description || content.intro_long)}",
    "url": "${canonical}",
    "isPartOf": {"@type": "Blog", "name": "Blog Expert Fissure IDF", "url": "${SITE.domain}/blog/"}
  }
  </script>`
  ];

  const articlesHtml = articles.length ? articles.map(a => `
        <article style="display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s-3); padding: var(--s-6) 0; border-top: var(--bd);">
          <span class="eyebrow">${formatDate(a.date_published)}</span>
          <h3 style="margin: 0; font-family: var(--font-serif); font-size: 1.5rem;"><a href="/blog/${a.slug}/" style="color: var(--ink); text-decoration: none;">${escapeHtml(a.h1)}</a></h3>
          <p style="margin: 0; color: var(--graphite); max-width: 65ch;">${escapeHtml(a.meta_description)}</p>
          <a href="/blog/${a.slug}/" style="color: var(--ocre); font-family: var(--font-sans); font-size: var(--fs-small); font-weight: 500; margin-top: var(--s-2);">Lire l'article →</a>
        </article>`).join("") : `
        <div style="background: var(--paper-deep); padding: var(--s-7); border-left: 2px solid var(--ocre); margin-top: var(--s-6);">
          <p style="font-family: var(--font-serif); font-size: 1.125rem; line-height: 1.65; color: var(--ink);">Cette catégorie démarre. De nouveaux articles seront publiés régulièrement courant 2026.</p>
        </div>`;

  return `${head({
    title: seo.title || `${label} - Blog Expert Fissure IDF`,
    description: seo.description || content.intro_long.slice(0, 158),
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
            <span class="eyebrow">Catégorie · Blog</span>
            <h1 class="display hero__title">${escapeHtml(seo.h1 || label)}</h1>
            <p class="lead" style="margin-top: var(--s-5);">${escapeHtml(content.intro_long)}</p>
          </div>
          <dl class="hero__meta">
            <dt>Catégorie</dt>
            <dd>${escapeHtml(label)}</dd>
            <dt>Articles publiés</dt>
            <dd>${articles.length}</dd>
          </dl>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container container--narrow">
        <span class="eyebrow">Thèmes couverts</span>
        <h2 style="margin-top: var(--s-2);">Ce que vous trouverez ici</h2>
        <ul style="display: flex; flex-direction: column; gap: var(--s-3); margin-top: var(--s-5);">
          ${content.themes_couverts.map(t => `<li style="display: grid; grid-template-columns: 24px 1fr; gap: var(--s-3); padding: var(--s-3) 0; border-top: var(--bd);">
            <svg width="20" height="20" aria-hidden="true" style="color: var(--ocre); margin-top: 4px;"><use href="/assets/illustrations/icons.svg#icon-check"/></svg>
            <span style="font-family: var(--font-serif); font-size: 1.0625rem; line-height: 1.5;">${escapeHtml(t)}</span>
          </li>`).join("")}
        </ul>
      </div>
    </section>

    <section class="section surface-deep">
      <div class="container container--narrow">
        <span class="eyebrow">Articles</span>
        <h2 style="margin-top: var(--s-2);">Publications dans cette catégorie</h2>
        ${articlesHtml}
      </div>
    </section>

    ${contactForm({
      title: "Vos fissures méritent un diagnostic d'expert",
      intro: "Décrivez-nous votre situation. Un expert vous recontacte sous 24 h ouvrées avec un devis personnalisé."
    })}

  </main>

  ${footer()}
</body>
</html>`;
}

// ----------------------------------------------------------------- ARTICLE

export function renderBlogArticle(ctx) {
  const { slug, article, geoIndex, allGuidesSeo } = ctx;
  const path = `/blog/${slug}/`;
  const canonical = `${SITE.domain}${path}`;
  const categoryLabel = SLUG_LABELS[article.category] || article.category;
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Blog", href: "/blog/" },
    { label: categoryLabel, href: `/blog/${article.category}/` },
    { label: stripHtml(article.h1), href: path }
  ];

  const schemas = [
    schemaBreadcrumb(breadcrumbItems),
    `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${esc(article.h1)}",
    "description": "${esc(article.meta_description)}",
    "author": {"@type": "Organization", "name": "Expert Fissure Île-de-France"},
    "publisher": {"@type": "Organization", "name": "Expert Fissure Île-de-France", "url": "${SITE.domain}/"},
    "datePublished": "${article.date_published}",
    "dateModified": "${article.date_modified}",
    "mainEntityOfPage": {"@type": "WebPage", "@id": "${canonical}"},
    "articleSection": "${esc(categoryLabel)}",
    "image": "${SITE.domain}/assets/og-default.jpg"
  }
  </script>`
  ];

  // Sections de l'article
  const sectionsHtml = article.sections.map((sec, i) => {
    const id = `s-${i + 1}`;
    let body = (sec.paragraphs || []).map(p => `<p>${p}</p>`).join("");
    if (sec.list) {
      body += `<ul style="display: flex; flex-direction: column; gap: var(--s-3); margin-top: var(--s-4);">
        ${sec.list.map(li => `<li style="display: grid; grid-template-columns: 24px 1fr; gap: var(--s-3); padding: var(--s-3) 0; border-top: var(--bd); align-items: start;">
          <svg width="20" height="20" aria-hidden="true" style="color: var(--ocre); margin-top: 4px;"><use href="/assets/illustrations/icons.svg#icon-check"/></svg>
          <span style="font-family: var(--font-serif); font-size: 1.0625rem; line-height: 1.5;">${li}</span>
        </li>`).join("")}
      </ul>`;
    }
    return `<section id="${id}" style="margin-top: var(--s-7);">
      <h2>${escapeHtml(sec.h2)}</h2>
      ${body}
    </section>`;
  }).join("");

  // Sommaire
  const tocItems = article.sections.map((sec, i) => ({ id: `s-${i + 1}`, label: sec.h2 }));
  const tocHtml = tocItems.map(t => `<li><a href="#${t.id}" style="text-decoration: none; color: var(--ink); border-bottom: 1px solid var(--mist-line); transition: border-color var(--tr-fast);" onmouseover="this.style.borderColor='var(--ocre)'" onmouseout="this.style.borderColor='var(--mist-line)'">${escapeHtml(t.label)}</a></li>`).join("\n        ");

  // CTA box
  const ctaBoxHtml = article.cta_box ? `
    <aside style="background: var(--ink); color: var(--paper); padding: var(--s-7); margin: var(--s-8) 0;">
      <span class="eyebrow" style="color: var(--ocre-soft);">Demande de devis</span>
      <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--paper); margin-top: var(--s-3);">${escapeHtml(article.cta_box.title)}</h3>
      <p style="color: rgba(245, 241, 234, 0.85); margin-top: var(--s-3); margin-bottom: var(--s-5); max-width: 60ch;">${escapeHtml(article.cta_box.text)}</p>
      <a href="#contact" class="btn btn--primary">Demander un devis gratuit</a>
    </aside>` : "";

  // Guides liés
  const guidesLiesHtml = (article.guides_lies || []).map(s => {
    const guide = allGuidesSeo[s];
    if (!guide) return "";
    return `
      <a href="/guide/${s}/" style="background: var(--paper); padding: var(--s-5); display: grid; gap: var(--s-2); text-decoration: none; color: var(--ink); border: var(--bd); transition: background var(--tr-fast);" onmouseover="this.style.background='var(--paper-deep)'" onmouseout="this.style.background='var(--paper)'">
        <span class="eyebrow">Guide d'expert</span>
        <h3 style="margin: 0; font-size: 1.0625rem; font-family: var(--font-serif);">${escapeHtml(guide.h1)}</h3>
      </a>`;
  }).join("");

  // Villes phares
  const villesHtml = (article.villes_phares || []).map(p => {
    const label = pathToLabel(p, geoIndex);
    return `<a href="${p}" style="background: var(--mist); padding: var(--s-4) var(--s-5); display: inline-flex; align-items: center; gap: var(--s-2); color: var(--ink); text-decoration: none; transition: background var(--tr-fast);" onmouseover="this.style.background='var(--paper-deep)'" onmouseout="this.style.background='var(--mist)'">
        <span style="font-family: var(--font-serif); font-style: italic; color: var(--ocre);">→</span>
        <span style="font-family: var(--font-sans); font-size: var(--fs-small); font-weight: 500;">${escapeHtml(label)}</span>
      </a>`;
  }).join("");

  return `${head({
    title: article.title,
    description: article.meta_description,
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
            <span class="eyebrow">${escapeHtml(categoryLabel)} · Publié le ${formatDate(article.date_published)}</span>
            <h1 class="display hero__title">${escapeHtml(article.h1)}</h1>
            ${article.intro_paragraphs.map((p, i) => i === 0
              ? `<p class="lead" style="margin-top: var(--s-5);">${escapeHtml(p)}</p>`
              : `<p style="margin-top: var(--s-4); color: var(--graphite);">${escapeHtml(p)}</p>`).join("")}
          </div>
          <dl class="hero__meta">
            <dt>Catégorie</dt>
            <dd><a href="/blog/${article.category}/" style="border-bottom: 1px solid var(--mist-line);">${escapeHtml(categoryLabel)}</a></dd>
            <dt>Mise à jour</dt>
            <dd>${formatDate(article.date_modified)}</dd>
            <dt>Lecture</dt>
            <dd>~ 7 minutes</dd>
          </dl>
        </div>
      </div>
    </section>

    <!-- SOMMAIRE -->
    <nav class="container" aria-label="Sommaire" style="padding: var(--s-6) var(--gutter); border-top: var(--bd); border-bottom: var(--bd);">
      <span class="eyebrow">Sommaire</span>
      <ol style="display: flex; flex-wrap: wrap; gap: var(--s-3) var(--s-5); margin-top: var(--s-3); list-style: decimal-leading-zero inside; font-family: var(--font-serif); color: var(--ink);">
        ${tocHtml}
      </ol>
    </nav>

    <!-- CONTENU -->
    <article class="section">
      <div class="container container--narrow">
        ${sectionsHtml}
        ${ctaBoxHtml}
      </div>
    </article>

    <!-- MAILLAGE LOCAL -->
    ${villesHtml ? `
    <section class="section surface-deep">
      <div class="container container--narrow">
        <span class="eyebrow">Maillage local</span>
        <h2 style="margin-top: var(--s-2);">Ce sujet vous concerne particulièrement si vous habitez ici</h2>
        <p class="lead" style="margin-top: var(--s-4); margin-bottom: var(--s-7);">Pages locales pertinentes pour ce sujet.</p>
        <div style="display: flex; flex-wrap: wrap; gap: var(--s-3);">
          ${villesHtml}
        </div>
      </div>
    </section>` : ""}

    <!-- GUIDES LIÉS -->
    ${guidesLiesHtml ? `
    <section class="section">
      <div class="container">
        <span class="eyebrow">À lire aussi</span>
        <h2 style="margin-top: var(--s-2);">Guides d'expert sur des sujets connexes</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--s-4); margin-top: var(--s-6);">
          ${guidesLiesHtml}
        </div>
      </div>
    </section>` : ""}

    ${contactForm({
      title: "Vous êtes concerné par ce sujet ?",
      intro: "Décrivez-nous votre situation. Un expert vous recontacte sous 24 h ouvrées avec un devis personnalisé."
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
function stripHtml(s) {
  return String(s).replace(/<[^>]+>/g, "");
}
function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const months = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}
function pathToLabel(p, geoIndex) {
  if (p === "/") return "Île-de-France";
  const parts = p.split("/").filter(Boolean);
  if (parts.length === 1) {
    const dept = geoIndex.byCode[parts[0]];
    return dept ? `${dept.name} (${parts[0]})` : parts[0];
  }
  if (parts.length === 2) {
    const dept = geoIndex.byCode[parts[0]];
    const ville = dept?.villes.find(v => v.slug === parts[1]);
    return ville ? `${ville.name} (${parts[0]})` : parts[1];
  }
  return p;
}
