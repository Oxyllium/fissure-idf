# Brief Claude Code — Site local Expert Fissure Île-de-France

## Contexte de la mission

Tu vas construire un **site local SEO** pour **Global Expertises**, premier cabinet d'expertise en bâtiment de France (300-400 dossiers/mois, 90 % de clients particuliers). 

Ce site dédié vise une seule prestation (**expertise des fissures**) sur une seule zone géographique (**l'Île-de-France**). Il s'inscrit dans une stratégie de **conquête locale** qui doit dépasser le concurrent principal **Ingénieur Expert Bâtiment** (https://ingenieur-expert-batiment.fr/) à 6 mois.

L'analyse Search Console du site principal (Global Expertises) a révélé :
- Une demande mesurée mais non capturée sur "fissure × IDF" (4 250+ impressions sur 16 mois sans page dédiée)
- Une formule de contenu validée : "fissure horizontale" génère 323 clicks à elle seule chez Global Expertises
- Un argument différenciant fort : "expert fissure indépendant" (1 371 impressions, sous-exploité)

**Tu utiliseras le skill `website-creator`** pour produire un site HTML/CSS/JS vanilla, optimisé SEO, avec push automatique sur GitHub.

---

## Mode opératoire — TRÈS IMPORTANT

**Tu ne dois PAS produire les 112 pages d'un coup.**

Tu vas travailler **par lots** pour garantir la qualité de chaque contenu. Chaque page doit être unique, riche, et exploiter les spécificités locales (sol dominant, bâti dominant, contexte fissures du département, quartiers). Un contenu copié-collé entre deux villes est inacceptable.

### Découpage en 7 étapes obligatoires

Tu dois traiter **une étape à la fois** et attendre ma validation avant de passer à la suivante.

**Étape 1 — Fondations**
- Architecture du repo, design system, variables CSS, composants partagés (header, footer, sticky bar mobile, formulaire de contact, schema.org partagé)
- Page d'accueil (pilier régional `/`)
- Page contact `/contact/`
- Page mentions légales `/mentions-legales/`
- Push initial sur GitHub

**Étape 2 — 8 piliers départementaux**
- `/75/`, `/77/`, `/78/`, `/91/`, `/92/`, `/93/`, `/94/`, `/95/`
- Chaque page exploite les `sols_dominants`, `bati_dominant`, `contexte_fissures`, `tribunal_competent` du JSON `idf-geo.json`
- Maillage vers toutes les villes du département

**Étape 3 — Silo Guide (18 pages thématiques + index)**
- Index `/guide/`
- Les 18 guides définis dans `seo-pages.json` (fissure horizontale, plafond, mur intérieur, façade, sécheresse/RGA, maison ancienne, etc.)
- **Priorité absolue : `/guide/fissure-horizontale/`** car c'est la formule prouvée chez Global Expertises (174 clicks, CTR 4,79 %). Cette page doit être ton chef-d'œuvre éditorial : 1 800-2 500 mots, visuels explicatifs (schémas), FAQ, cas concrets.

**Étape 4 — 7 villes prioritaires P0 (Search Console)**
Ces villes ont des impressions déjà mesurées sur Global Expertises. Pages enrichies (1 200-1 800 mots), avec quartiers détaillés, données locales :
- `/92/boulogne-billancourt/`
- `/93/saint-denis/`
- `/95/argenteuil/`
- `/91/evry-courcouronnes/`
- `/93/montreuil/`
- `/75/paris-15e/` (le plus peuplé de Paris)
- `/75/paris-16e/` (forte zone d'enjeu)

**Étape 5 — Pages villes Paris (20 arrondissements)**
- 20 pages `/75/[arrondissement]/`
- Différenciation par les quartiers du JSON

**Étape 6 — Pages villes petite couronne (92, 93, 94)**
- ~28 pages
- Différenciation par sols (gypse 93, alluvions 92/94…) et typologies bâti

**Étape 7 — Pages villes grande couronne (77, 78, 91, 95)**
- ~30 pages
- Forte coloration RGA / sécheresse / pavillonnaire

À chaque étape : tu produis le code, tu commit, tu push sur GitHub, et tu attends ma validation.

---

## Données fournies (à charger en début de mission)

Trois fichiers JSON à utiliser comme source de vérité :

### 1. `idf-geo.json`
Structure géographique complète :
- 1 région (Île-de-France) avec contexte fissures détaillé, sols, bâti
- 8 départements avec leurs spécificités (sols dominants, bâti dominant, tribunal compétent, contexte local des fissures)
- 78 villes avec : nom, slug, code postal, population, quartiers

**Tu DOIS exploiter ces données pour faire un contenu unique par page.** Une page "Saint-Denis" doit parler de gypse antéludien, de l'ancien bassin industriel, des chantiers du Grand Paris (lignes 15-16-17). Une page "Meaux" doit parler d'argiles vertes, de pavillonnaire, de sécheresses 2018-2023. Etc.

### 2. `global-expertises.json`
Identité, positionnement, chiffres-clés, arguments différenciants, processus, cas traités, FAQ types.

**Argument prioritaire à mettre en avant :** "Expert fissure indépendant" (validé par 1 371 impressions Search Console). Le mettre en H2 ou bloc dédié sur toutes les pages.

**À NE PAS mentionner sur ce site :** Toulouse / siège social toulousain. Le site doit donner une impression de cabinet IDF dédié. Communiquer sur "couverture nationale + équipe dédiée IDF".

### 3. `seo-pages.json`
Pour chaque page :
- URL/slug
- H1
- Title (mot-clé à gauche, sans séparateur, sentence case, 55-65 caractères)
- Meta description (145-160 caractères)
- Canonical
- Mot-clé principal et mots-clés secondaires
- Cible de maillage interne

Contient aussi une section `gsc_insights` qui liste les villes P0/P1, les mots-clés validés et les angles éditoriaux à privilégier.

**Convention de nommage des slugs (à respecter strictement) :**
- Départements : `/75/`, `/77/`, `/78/`, `/91/`, `/92/`, `/93/`, `/94/`, `/95/`
- Villes : `/[code-dept]/[slug-ville]/` — exemple `/95/cergy/`, `/92/boulogne-billancourt/`
- Guides : `/guide/[slug]/`

---

## Spécifications fonctionnelles

### Conversion (priorité absolue)

Chaque page doit comporter :
- **Header sticky** avec numéro de téléphone cliquable + bouton "Demander un devis"
- **Formulaire de contact en fin de page** (nom, téléphone, email, ville, type de fissure observée, message)
- **Bloc CTA milieu de page** (variation textuelle selon le type de page)
- **Sticky bar mobile en bas** avec téléphone cliquable + CTA
- **Bloc réassurance** avec les 5 chiffres-clés du JSON `global-expertises`

### Contenu type par page ville (à adapter selon page)

1. **H1** + accroche locale (1 phrase mentionnant la ville et les enjeux fissures locaux)
2. **Bloc réassurance** (5 chiffres-clés)
3. **"Pourquoi des fissures à [ville] ?"** — exploite les sols/bâti/contexte du dept depuis `idf-geo.json`
4. **"Notre méthode d'expertise"** — 4 étapes (depuis `processus_expertise` du JSON)
5. **"Expert fissure indépendant : ce que ça change pour vous"** — argument SEO validé
6. **"Quartiers & communes voisines couverts"** — exploite les quartiers + lien vers 3-5 villes voisines du même dept
7. **"Cas typiques traités à [ville]"** — exploite `cas_traites` + ancrage local
8. **FAQ** — questions du JSON adaptées à la ville
9. **Bloc CTA** + formulaire contact
10. **Maillage** : breadcrumb (Accueil > Dept > Ville) + bloc "Vous êtes peut-être aussi concerné par" qui lie vers 2-3 guides pertinents

### Contenu type par page guide

1. **H1** + accroche directe (le problème + promesse de réponse)
2. **Sommaire ancré** (table des matières cliquable)
3. **Définition / typologie** (avec schémas visuels)
4. **"Quand s'inquiéter ?"** — critères visuels d'évaluation, niveaux de gravité
5. **Causes fréquentes** (en priorisant les causes IDF si pertinent)
6. **Méthode de diagnostic d'expert**
7. **Solutions et coûts** (fourchettes)
8. **FAQ**
9. **Bloc CTA contextuel** vers la page locale la plus pertinente
10. **Maillage** : 3-4 guides connexes + 4-6 villes IDF où ce type de fissure est le plus fréquent

### SEO technique obligatoire

- **Schema.org** :
  - `LocalBusiness` sur la home avec `areaServed` étendu à toute l'IDF
  - `Service` sur les pages dept et villes
  - `BreadcrumbList` sur toutes les pages internes
  - `FAQPage` sur les sections FAQ
  - `Article` sur les guides
- **Sitemap.xml** généré automatiquement
- **Robots.txt** avec lien vers le sitemap
- **Open Graph** et **Twitter Cards** sur toutes les pages
- **Hreflang** : `fr-FR` partout

### Maillage interne (cocon sémantique)

À implémenter rigoureusement (cf. plan déjà validé) :

- **Descendant** : Accueil → Dept → Ville (breadcrumb + liens contextuels)
- **Latéral** : chaque page Ville liée à 3-5 villes voisines du même dept (bloc "Nous intervenons aussi à…")
- **Ascendant** : chaque page Guide envoie vers la page régionale + 3-4 villes les plus pertinentes
- **Transversal** : chaque page Ville cite et lie vers 2 guides thématiques pertinents (typiquement : "fissure horizontale" + un guide adapté au sol dominant du dept, par exemple "fissure sécheresse" pour le 77, "fissure parpaing" pour les zones pavillonnaires)
- **Profondeur max** : 3 clics depuis l'accueil
- **Pas de pages orphelines**

### Design system

**Direction artistique** : sobriété et autorité (cabinet d'expertise sérieux, pas startup). Inspiration : presse économique de qualité, sites institutionnels modernes type Doctrine.fr ou Gallileo.

**Anti-patterns à éviter absolument** (cf. skill) :
- Inter / Roboto / Poppins (surexploitées)
- Hero centré titre+sous-titre+bouton
- 3 cards services côte à côte génériques
- Gradient bleu-violet
- Footer 4 colonnes standard
- Icônes Lucide grille de 6

**Privilégier** :
- Typographie expressive avec serif éditorial pour les titres (Fraunces, Playfair Display, DM Serif Display ou similaire) + sans-serif lisible pour le corps (Outfit, Sora, Space Grotesk)
- Layouts asymétriques avec espaces négatifs dramatiques
- Palette restreinte (noir profond / blanc cassé / un accent unique)
- Schémas et illustrations vectorielles propres pour les guides (croquis de fissures, coupes de sol)
- Photographies réelles (pas de stock générique)

### Performance

- Lighthouse cible : ≥ 95 sur tous les critères
- Images en WebP avec fallback
- CSS critique inline, reste en async
- Fonts en `woff2` avec `preload`
- Aucune dépendance JS lourde (pas de framework)
- LCP < 2 s, CLS < 0.1

---

## Données spécifiques à demander à Pierre Compas avant de démarrer

À me confirmer avant l'étape 1 :
- **Numéro de téléphone** à afficher (siège ou ligne dédiée IDF ?)
- **Email de réception** des demandes de devis
- **Nom de domaine** définitif (en attendant, utiliser `https://expert-fissure-idf.fr` comme placeholder)
- **Compte / repo GitHub** où pousser le code
- **Logo / charte** existante de Global Expertises à reprendre, ou identité visuelle distincte pour ce site local ?
- **Photos disponibles** (équipe, interventions, bureau IDF) ou utiliser des illustrations vectorielles uniquement ?
- **Mentions des certifications** réelles à indiquer (le JSON contient un placeholder "à compléter")

---

## Livrable final attendu

À la fin des 7 étapes :
- 112 pages HTML statiques optimisées SEO et conversion
- Repo GitHub avec README, sitemap, robots
- Score Lighthouse ≥ 95
- Compatible déploiement statique (Netlify / Cloudflare Pages / OVH)
- Documentation des conventions appliquées dans le README

---

## Démarrage

**Étape immédiate** : confirme-moi que tu as lu et compris le brief, charge les 3 JSONs, propose-moi le design system détaillé (palette + typographies + spacing tokens) et l'architecture du repo. **N'écris pas encore de code.**

Une fois que j'ai validé le design system, on lance l'**étape 1 (fondations)**.
