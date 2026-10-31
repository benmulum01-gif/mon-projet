import type { L } from "./shared";

/**
 * Inventory built from the code (see docs/COMPLIANCE.md). Keep it in sync when
 * a form, a table or a third-party service is added.
 */

export type Processing = {
  id: string;
  purpose: L;
  data: L;
  basis: L;
  retention: L;
  recipients: L;
  transfers: L;
};

const VERIFY = { fr: "[À VÉRIFIER]", en: "[TO BE VERIFIED]" };

export const processings: Processing[] = [
  {
    id: "contact",
    purpose: { fr: "Répondre aux demandes de contact et de devis (formulaire « Nous contacter »)", en: "Answering contact and quote requests (“Contact us” form)" },
    data: { fr: "Nom, e-mail, entreprise (facultatif), message, langue de la page", en: "Name, email, company (optional), message, page language" },
    basis: { fr: "Mesures précontractuelles prises à votre demande (art. 6.1.b RGPD) ; intérêt légitime à répondre aux demandes professionnelles (art. 6.1.f)", en: "Pre-contractual steps taken at your request (GDPR art. 6(1)(b)); legitimate interest in answering business enquiries (art. 6(1)(f))" },
    retention: { fr: "3 ans après le dernier contact, puis suppression automatique", en: "3 years after the last contact, then automatic deletion" },
    recipients: { fr: "Notre équipe ; Supabase (base de données) ; notre hébergeur", en: "Our team; Supabase (database); our host" },
    transfers: { fr: "Oui : notre équipe en RDC ; Supabase Inc. (États-Unis)", en: "Yes: our team in the DRC; Supabase Inc. (United States)" },
  },
  {
    id: "booking",
    purpose: { fr: "Prise de rendez-vous en ligne (page « Prendre rendez-vous »)", en: "Online appointment booking (“Book a call” page)" },
    data: { fr: "Nom, e-mail, créneau choisi, réponses saisies dans le formulaire de réservation", en: "Name, email, chosen time slot, answers given in the booking form" },
    basis: { fr: "Mesures précontractuelles (art. 6.1.b) ; l'affichage du calendrier nécessite votre consentement (cookies)", en: "Pre-contractual steps (art. 6(1)(b)); displaying the calendar requires your consent (cookies)" },
    retention: { fr: "3 ans après le dernier contact", en: "3 years after the last contact" },
    recipients: { fr: "Notre équipe ; Calendly LLC", en: "Our team; Calendly LLC" },
    transfers: { fr: "Oui : Calendly LLC (États-Unis)", en: "Yes: Calendly LLC (United States)" },
  },
  {
    id: "customers",
    purpose: { fr: "Gestion des clients : devis, contrats, facturation, paiements, réclamations", en: "Customer management: quotes, contracts, invoicing, payments, complaints" },
    data: { fr: "Identité, coordonnées, entreprise, contenu des devis et contrats, factures, informations de paiement transmises par PayPal (nous ne recevons pas vos numéros de carte)", en: "Identity, contact details, company, quotes and contracts, invoices, payment information provided by PayPal (we never receive card numbers)" },
    basis: { fr: "Exécution du contrat (art. 6.1.b) ; obligations légales comptables et fiscales (art. 6.1.c)", en: "Performance of the contract (art. 6(1)(b)); legal accounting and tax obligations (art. 6(1)(c))" },
    retention: { fr: "Durée du contrat + 5 ans (prescription) ; pièces comptables : durée légale applicable", en: "Contract duration + 5 years (limitation period); accounting records: applicable legal period" },
    recipients: { fr: "Notre équipe ; PayPal ; notre comptable ; les autorités sur demande légale", en: "Our team; PayPal; our accountant; authorities upon legal request" },
    transfers: { fr: "Oui : notre équipe en RDC ; PayPal selon son entité contractante", en: "Yes: our team in the DRC; PayPal depending on its contracting entity" },
  },
  {
    id: "accounts",
    purpose: { fr: "Création et gestion des comptes SAVAN, sécurité de la connexion", en: "Creating and managing SAVAN accounts, sign-in security" },
    data: { fr: "E-mail, mot de passe (stocké uniquement sous forme chiffrée irréversible), nom (facultatif), langue de l'interface, date et version des CGU acceptées", en: "Email, password (stored only as an irreversible hash), name (optional), interface language, date and version of accepted terms" },
    basis: { fr: "Exécution du contrat (art. 6.1.b)", en: "Performance of the contract (art. 6(1)(b))" },
    retention: { fr: "Pendant la durée du compte ; suppression dans les 30 jours suivant sa fermeture (la preuve d'acceptation des CGU est conservée 5 ans)", en: "For the life of the account; deleted within 30 days of closure (proof of acceptance of the terms is kept 5 years)" },
    recipients: { fr: "Notre équipe ; Supabase ; notre hébergeur", en: "Our team; Supabase; our host" },
    transfers: { fr: "Oui : Supabase Inc. (États-Unis) ; notre équipe en RDC", en: "Yes: Supabase Inc. (United States); our team in the DRC" },
  },
  {
    id: "ai",
    purpose: { fr: "Fonctions d'IA de SAVAN (suggestion de réponse, résumé, traduction, rédaction de modèles), uniquement à la demande d'un utilisateur", en: "SAVAN AI features (reply suggestion, summary, translation, template drafting), only when a user requests them" },
    data: { fr: "Extraits des conversations, fiche du prospect concerné, texte du modèle", en: "Conversation excerpts, the relevant lead record, template text" },
    basis: { fr: "Exécution du contrat avec le client (art. 6.1.b) ; pour les données des prospects, nous agissons sur instruction du client (sous-traitance)", en: "Performance of the contract with the customer (art. 6(1)(b)); for lead data, we act on the customer's instructions (processor)" },
    retention: { fr: "Résultats conservés seulement s'ils sont enregistrés par l'utilisateur ; chez Anthropic, selon ses conditions commerciales " + VERIFY.fr + " — pas d'entraînement de modèles sur ces données selon ces conditions", en: "Results kept only if saved by the user; at Anthropic, under its commercial terms " + VERIFY.en + " — no model training on this data under those terms" },
    recipients: { fr: "Anthropic PBC (modèle Claude)", en: "Anthropic PBC (Claude model)" },
    transfers: { fr: "Oui : Anthropic PBC (États-Unis)", en: "Yes: Anthropic PBC (United States)" },
  },
  {
    id: "leads",
    purpose: { fr: "Données des prospects saisies par nos clients dans SAVAN (prospects, conversations, rendez-vous, notes)", en: "Lead data entered by our customers in SAVAN (leads, conversations, appointments, notes)" },
    data: { fr: "Nom, e-mail, téléphone, entreprise, langue préférée, messages, rendez-vous, notes, valeur estimée", en: "Name, email, phone, company, preferred language, messages, appointments, notes, estimated value" },
    basis: { fr: "Nous sommes sous-traitant : chaque client est responsable de ces données et de leur base légale (voir l'annexe « Sous-traitance » des CGU)", en: "We are a processor: each customer is the controller of this data and of its legal basis (see the “Data processing” annex of the terms of use)" },
    retention: { fr: "Fixée par le client ; suppression au plus tard 30 jours après la fin du contrat", en: "Set by the customer; deleted at the latest 30 days after the end of the contract" },
    recipients: { fr: "Le client et ses utilisateurs ; nos sous-traitants ultérieurs : Supabase, Anthropic, notre hébergeur", en: "The customer and its users; our sub-processors: Supabase, Anthropic, our host" },
    transfers: { fr: "Oui : notre équipe en RDC ; Supabase Inc. et Anthropic PBC (États-Unis)", en: "Yes: our team in the DRC; Supabase Inc. and Anthropic PBC (United States)" },
  },
  {
    id: "newsletter",
    purpose: { fr: "Envoi de la lettre d'information", en: "Sending the newsletter" },
    data: { fr: "E-mail, langue, date et version du consentement", en: "Email, language, date and version of consent" },
    basis: { fr: "Votre consentement (art. 6.1.a), retirable à tout moment", en: "Your consent (art. 6(1)(a)), which you can withdraw at any time" },
    retention: { fr: "Jusqu'à votre désinscription ; suppression 30 jours après", en: "Until you unsubscribe; deleted 30 days later" },
    recipients: { fr: "Notre équipe ; notre outil d'envoi d'e-mails " + "[À COMPLÉTER]", en: "Our team; our email sending tool [TO BE COMPLETED]" },
    transfers: { fr: "Selon l'outil d'envoi choisi " + VERIFY.fr, en: "Depending on the sending tool chosen " + VERIFY.en },
  },
  {
    id: "analytics",
    purpose: { fr: "Mesure d'audience du site (Google Analytics 4)", en: "Website audience measurement (Google Analytics 4)" },
    data: { fr: "Identifiant de cookie, pages vues, appareil, navigateur, localisation approximative, source de la visite", en: "Cookie identifier, pages viewed, device, browser, approximate location, traffic source" },
    basis: { fr: "Votre consentement (art. 6.1.a) — rien n'est chargé sans votre accord", en: "Your consent (art. 6(1)(a)) — nothing loads without your agreement" },
    retention: { fr: "Cookies : 13 mois maximum ; données dans Google Analytics : 14 mois", en: "Cookies: 13 months maximum; data in Google Analytics: 14 months" },
    recipients: { fr: "Google Ireland Limited", en: "Google Ireland Limited" },
    transfers: { fr: "Oui : Google LLC (États-Unis), Data Privacy Framework UE–États-Unis", en: "Yes: Google LLC (United States), EU–US Data Privacy Framework" },
  },
  {
    id: "advertising",
    purpose: { fr: "Mesure de nos campagnes publicitaires et publicité ciblée sur les plateformes", en: "Measuring our ad campaigns and targeted advertising on the platforms" },
    data: { fr: "Identifiants de cookie, pages vues, actions sur le site, adresse IP, informations sur l'appareil", en: "Cookie identifiers, pages viewed, actions on the site, IP address, device information" },
    basis: { fr: "Votre consentement (art. 6.1.a)", en: "Your consent (art. 6(1)(a))" },
    retention: { fr: "Voir la durée de chaque cookie dans la politique de cookies", en: "See each cookie's lifetime in the cookie policy" },
    recipients: { fr: "Meta Platforms Ireland Ltd ; Google Ireland Limited ; LinkedIn Ireland Unlimited Company ; TikTok Technology Limited (responsables conjoints pour la collecte)", en: "Meta Platforms Ireland Ltd; Google Ireland Limited; LinkedIn Ireland Unlimited Company; TikTok Technology Limited (joint controllers for the collection)" },
    transfers: { fr: "Oui : États-Unis (et, pour TikTok, accès possibles depuis d'autres pays dont la Chine) " + VERIFY.fr, en: "Yes: United States (and, for TikTok, possible access from other countries including China) " + VERIFY.en },
  },
  {
    id: "chat",
    purpose: { fr: "Discussion en direct avec notre équipe (Tawk.to)", en: "Live chat with our team (Tawk.to)" },
    data: { fr: "Messages échangés, nom et e-mail si vous les donnez, adresse IP, navigateur, pages consultées", en: "Messages exchanged, name and email if you give them, IP address, browser, pages viewed" },
    basis: { fr: "Votre consentement pour charger le chat (art. 6.1.a) ; mesures précontractuelles pour vous répondre (art. 6.1.b)", en: "Your consent to load the chat (art. 6(1)(a)); pre-contractual steps to answer you (art. 6(1)(b))" },
    retention: { fr: "3 ans après le dernier échange " + VERIFY.fr + " (à paramétrer dans Tawk.to)", en: "3 years after the last exchange " + VERIFY.en + " (to configure in Tawk.to)" },
    recipients: { fr: "Notre équipe ; tawk.to inc.", en: "Our team; tawk.to inc." },
    transfers: { fr: "Oui : tawk.to inc. (États-Unis) " + VERIFY.fr, en: "Yes: tawk.to inc. (United States) " + VERIFY.en },
  },
  {
    id: "videos",
    purpose: { fr: "Lecture de vidéos intégrées (YouTube)", en: "Playing embedded videos (YouTube)" },
    data: { fr: "Adresse IP, identifiants de cookie, données de lecture", en: "IP address, cookie identifiers, playback data" },
    basis: { fr: "Votre consentement (art. 6.1.a)", en: "Your consent (art. 6(1)(a))" },
    retention: { fr: "Voir la politique de cookies", en: "See the cookie policy" },
    recipients: { fr: "Google Ireland Limited (YouTube)", en: "Google Ireland Limited (YouTube)" },
    transfers: { fr: "Oui : Google LLC (États-Unis), Data Privacy Framework", en: "Yes: Google LLC (United States), Data Privacy Framework" },
  },
  {
    id: "security",
    purpose: { fr: "Sécurité et bon fonctionnement du site (journaux techniques)", en: "Security and proper operation of the site (technical logs)" },
    data: { fr: "Adresse IP, date et heure, page demandée, navigateur", en: "IP address, date and time, page requested, browser" },
    basis: { fr: "Intérêt légitime à sécuriser le service (art. 6.1.f)", en: "Legitimate interest in securing the service (art. 6(1)(f))" },
    retention: { fr: "6 à 12 mois " + VERIFY.fr + " (selon le paramétrage de l'hébergeur)", en: "6 to 12 months " + VERIFY.en + " (depending on host settings)" },
    recipients: { fr: "Notre hébergeur ; Supabase", en: "Our host; Supabase" },
    transfers: { fr: "Selon l'hébergeur choisi " + VERIFY.fr, en: "Depending on the chosen host " + VERIFY.en },
  },
];

export type Tracker = { name: string; provider: string; category: "necessary" | "analytics" | "advertising" | "media" | "chat"; purpose: L; duration: L };

const D = (fr: string, en: string): L => ({ fr, en });

export const trackers: Tracker[] = [
  { name: "sb-*-auth-token", provider: "SAVAN (Supabase)", category: "necessary", purpose: D("Maintenir la connexion à votre compte", "Keep you signed in"), duration: D("Jusqu'à la déconnexion (400 jours maximum)", "Until sign-out (400 days maximum)") },
  { name: "NEXT_LOCALE", provider: "SAVAN", category: "necessary", purpose: D("Mémoriser la langue choisie", "Remember the chosen language"), duration: D("1 an", "1 year") },
  { name: "savan_consent", provider: "SAVAN", category: "necessary", purpose: D("Mémoriser vos choix en matière de cookies", "Remember your cookie choices"), duration: D("6 mois", "6 months") },
  { name: "_ga, _ga_*", provider: "Google Analytics", category: "analytics", purpose: D("Distinguer les visiteurs et mesurer l'audience", "Distinguish visitors and measure audience"), duration: D("13 mois", "13 months") },
  { name: "_gcl_au", provider: "Google Ads", category: "advertising", purpose: D("Mesurer les conversions publicitaires", "Measure ad conversions"), duration: D("90 jours", "90 days") },
  { name: "_fbp, _fbc", provider: "Meta", category: "advertising", purpose: D("Mesurer et cibler les publicités Meta", "Measure and target Meta ads"), duration: D("90 jours", "90 days") },
  { name: "li_fat_id, lidc, bcookie, UserMatchHistory, AnalyticsSyncHistory", provider: "LinkedIn", category: "advertising", purpose: D("Mesurer et cibler les publicités LinkedIn", "Measure and target LinkedIn ads"), duration: D("1 jour à 1 an selon le cookie [À VÉRIFIER]", "1 day to 1 year depending on the cookie [TO BE VERIFIED]") },
  { name: "_ttp, _tt_enable_cookie", provider: "TikTok", category: "advertising", purpose: D("Mesurer et cibler les publicités TikTok", "Measure and target TikTok ads"), duration: D("13 mois", "13 months") },
  { name: "VISITOR_INFO1_LIVE, YSC", provider: "YouTube (Google)", category: "media", purpose: D("Lire les vidéos et mesurer leur visionnage", "Play videos and measure viewing"), duration: D("Session à 6 mois", "Session to 6 months") },
  { name: "Cookies Calendly (__cf_bm, …)", provider: "Calendly", category: "media", purpose: D("Afficher le calendrier et sécuriser la réservation", "Display the calendar and secure booking"), duration: D("Selon Calendly [À VÉRIFIER]", "Set by Calendly [TO BE VERIFIED]") },
  { name: "twk_*, TawkConnectionTime", provider: "Tawk.to", category: "chat", purpose: D("Faire fonctionner la discussion en direct et retrouver l'historique", "Run the live chat and keep its history"), duration: D("Session à 6 mois [À VÉRIFIER]", "Session to 6 months [TO BE VERIFIED]") },
];
