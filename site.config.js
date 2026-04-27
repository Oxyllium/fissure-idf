/**
 * Configuration globale du site Expert Fissure IDF.
 * Modifier ce fichier pour propager les coordonnées sur toutes les pages.
 *
 * NOTE : ces valeurs sont aussi dupliquées en dur dans les <head> et templates
 * pour garantir le rendu statique sans JS. Si tu modifies ici, mets aussi à jour
 * les pages HTML correspondantes (header, footer, schema.org).
 */
export const SITE = {
  domain: "https://expert-fissure-idf.fr",
  brand: "Expert Fissure IDF",
  brandLong: "Expert Fissure Île-de-France",
  email: "quentinwebredac@gmail.com",
  phone: null, // À renseigner quand la ligne IDF sera disponible
  formEndpoint: "/api/contact", // À remplacer par Formspree/Web3Forms/endpoint custom
  responseTime: "24 heures ouvrées",
  zone: "Île-de-France (75, 77, 78, 91, 92, 93, 94, 95)"
};
