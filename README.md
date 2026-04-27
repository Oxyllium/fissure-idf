# Expert Fissure Île-de-France

Site local SEO pour **Global Expertises**, dédié à l'expertise des fissures en Île-de-France.

> Stratégie de conquête locale visant à dépasser le concurrent principal `ingenieur-expert-batiment.fr` à 6 mois.

## Stack

- **HTML / CSS / JS vanilla** (zéro framework, zéro build pour l'instant)
- Typographies Google Fonts : **Fraunces** (titres) + **Sora** (corps)
- SVG inline pour la carte IDF, les icônes et les schémas de coupe géologique
- Schema.org : `LocalBusiness`, `Service`, `BreadcrumbList`, `FAQPage`, `Article` (à venir)

## Statut

| Étape | Périmètre | Statut |
|---|---|---|
| 1 | Fondations + home + contact + mentions légales | ✅ |
| 2 | 8 piliers départementaux (75/77/78/91/92/93/94/95) | ✅ |
| 3 | 17 guides + index `/guide/` (chef-d'œuvre `/guide/fissure-horizontale/`) | ✅ |
| 4 | 7 villes prioritaires P0 (Search Console) | ✅ |
| 5 | 20 pages villes Paris (arrondissements) | ✅ |
| 6 | ~28 pages villes petite couronne (92, 93, 94) | ✅ |
| 7 | ~30 pages villes grande couronne (77, 78, 91, 95) | ✅ |

Total livré : **107 pages** (1 home + 1 contact + 1 mentions + 8 dépt + 1 index guide + 17 guides + 78 villes).

## Structure du repo

```
.
├── index.html                       # Pilier régional /
├── 75/index.html … 95/index.html    # 8 piliers départementaux
├── contact/index.html               # /contact/
├── mentions-legales/index.html      # /mentions-legales/
├── build/                           # Générateur Node ES modules
│   ├── partials.mjs                 # Header, footer, blocs partagés
│   ├── render-dept.mjs              # Renderer pages dépt
│   └── build.mjs                    # Orchestrateur
├── css/
│   ├── tokens.css                   # Variables (palette, typo, spacing)
│   ├── reset.css
│   ├── base.css                     # Typo, body, layouts génériques
│   ├── layout.css                   # Hero, splits, figures, surfaces
│   └── components.css               # Header, footer, form, faq, sticky bar
├── js/
│   └── main.js                      # Sticky header, burger, form, smooth scroll
├── assets/
│   ├── fonts/                       # (à venir : Fraunces + Sora self-hosted woff2)
│   └── illustrations/
│       ├── carte-idf.svg            # Carte 8 dépt cliquable (footer)
│       ├── coupe-sol-idf.svg        # Coupe géologique éditoriale
│       └── icons.svg                # Sprite d'icônes (use href="#icon-…")
├── data/
│   ├── idf-geo.json                 # Géo : 8 dépt + 78 villes + sols + bâti
│   ├── global-expertises.json       # Identité, chiffres, processus, FAQ
│   ├── seo-pages.json               # Plan SEO 112 pages + insights GSC
│   └── dept-content.json            # Rédactionnel différencié par dépt
├── site.config.js                   # Config : email, tel, domaine, endpoint form
├── robots.txt
├── sitemap.xml                      # Incrémental, complété par étape
└── README.md
```

## Conventions

### URLs (slugs)
- Départements : `/75/`, `/77/`, `/78/`, `/91/`, `/92/`, `/93/`, `/94/`, `/95/`
- Villes : `/<dept>/<slug-ville>/` — ex. `/95/cergy/`, `/92/boulogne-billancourt/`
- Guides : `/guide/<slug>/`
- Toutes les URL en kebab-case sans accent, lowercase, **trailing slash obligatoire**.

### Title / meta
- Title : mot-clé principal à gauche, **pas de séparateur** (`|`, `-`), sentence case, 55-65 caractères.
- Meta description : 145-160 caractères, mot-clé dans la 1ère moitié, chiffre/bénéfice + CTA implicite.

### Maillage interne (cocon sémantique)
- **Descendant** : Accueil → Dépt → Ville (breadcrumb + liens contextuels)
- **Latéral** : chaque ville → 3-5 villes voisines du même dépt
- **Ascendant** : guides → pilier régional + 3-4 villes pertinentes
- **Transversal** : chaque ville → 2 guides thématiques (typiquement `fissure-horizontale` + un guide adapté au sol dominant du dépt)
- Profondeur max : 3 clics depuis l'accueil, **aucune page orpheline**.

## Configuration

Modifier `site.config.js` pour propager les coordonnées :
- `email` : `quentinwebredac@gmail.com` (placeholder)
- `phone` : à renseigner quand la ligne IDF sera disponible
- `formEndpoint` : actuellement `/api/contact` (placeholder) — à remplacer par Formspree, Web3Forms ou un endpoint custom

## Direction artistique

- **Palette restreinte** : noir profond `#111` / papier chaud `#f5f1ea` / accent ocre argile `#b8552e`
- **Typo titres** : Fraunces serif éditorial, italique expressif sur les mots-clés
- **Typo corps** : Sora sans-serif géométrique tempéré
- **Layout asymétrique** : hero 8/4, grilles de chiffres en filets, pas de hero centré générique
- **Sticky bar mobile uniquement** (header sticky desktop, pas mobile)

## Déploiement

Site 100 % statique. Compatible :
- GitHub Pages
- Netlify (drag-and-drop ou git connect)
- Cloudflare Pages
- OVH / Infomaniak hébergement statique

Builder Node ES modules en place dès l'étape 2. Pour régénérer toutes les pages dépt :
```bash
node build/build.mjs
```
Aucune dépendance externe (Node 18+ requis pour ESM natif).

## Crédits

Typographies sous SIL Open Font License : [Fraunces](https://fonts.google.com/specimen/Fraunces), [Sora](https://fonts.google.com/specimen/Sora).
