# Mise en conformité légale de SAVAN — octobre 2026

> Ce document ne remplace pas un avis juridique. Faites relire l'ensemble par un avocat
> (droit européen de la consommation et des données) et par un juriste en droit congolais
> avant la mise en ligne.

## Le cas de SAVAN

Société établie en **République démocratique du Congo**, vendant des **prestations sur mesure**
(conception et mise en place d'un système d'acquisition client avec IA, l'application SAVAN
étant fournie dans ce cadre) à des **professionnels et des particuliers en Europe**.
10 salariés ou plus, ou plus de 2 M€ de chiffre d'affaires. Paiement sur facture (virement, PayPal).
Outils tiers : Google Analytics 4, pixels Meta, Google Ads, LinkedIn et TikTok, YouTube,
Calendly, Tawk.to, WhatsApp. Site lisible et citable par les IA, sans entraînement.

## Fichiers créés ou modifiés

| Fichier | Rôle |
|---|---|
| `src/config/company.ts` | Identité de la société, source unique pour toutes les pages (champs `null` = à compléter) |
| `src/config/integrations.ts` | Identifiants des outils tiers (variables `NEXT_PUBLIC_*`) et catégories actives |
| `src/lib/consent.ts` | Lecture et écriture du consentement (6 mois), suppression des cookies au retrait |
| `src/components/consent/consent-provider.tsx` | État du consentement côté navigateur |
| `src/components/consent/consent-banner.tsx` | Bandeau : Tout refuser = Tout accepter, choix par finalité, bouton « Gérer mes cookies » |
| `src/components/consent/third-party-scripts.tsx` | Chargement de GA4, Google Ads, Meta, LinkedIn, TikTok et Tawk.to uniquement après accord |
| `src/components/consent/consent-gate.tsx` | Blocage de YouTube et Calendly avant accord, avec lien direct de remplacement |
| `src/content/legal/*.tsx` | Mentions légales, confidentialité, cookies, CGV, CGU + accord de sous-traitance, accessibilité (FR/EN) |
| `src/content/legal/data.ts` | Inventaire des traitements et des cookies, tiré du code |
| `src/app/[locale]/(marketing)/legal/[page]/page.tsx` | Route des 6 pages légales |
| `src/app/[locale]/(marketing)/book/page.tsx` | Prise de rendez-vous (Calendly, bloqué jusqu'au consentement) |
| `src/app/[locale]/(marketing)/newsletter/unsubscribe/*` | Désinscription en un clic (bouton POST) |
| `src/components/marketing/newsletter-form.tsx`, `src/lib/actions/newsletter.ts` | Newsletter avec case de consentement non pré-cochée |
| `src/components/legal-links.tsx`, `src/components/marketing/site-footer.tsx` | Pied de page unifié, liens légaux sur toutes les pages (site, connexion, application) |
| `src/app/[locale]/(marketing)/pricing/page.tsx` | Offre « sur devis » à la place des abonnements fictifs |
| `src/app/[locale]/(auth)/sign-up/*`, `(auth)/actions.ts` | Acceptation des CGU obligatoire, case non pré-cochée, version enregistrée |
| `src/app/[locale]/(marketing)/contact/*` | Mentions sous le formulaire (finalité, confidentialité, CGV), champs obligatoires signalés, lien WhatsApp |
| `src/app/robots.ts` | Robots d'entraînement IA bloqués, moteurs de recherche et assistants IA autorisés |
| `src/app/llms.txt/route.ts` | Description du site pour les IA |
| `src/lib/seo.ts`, pages publiques | Open Graph, canonical et hreflang sur chaque page publique |
| `src/app/[locale]/(marketing)/page.tsx` | Données structurées : Organization et ProfessionalService |
| `src/app/sitemap.ts` | Ajout de la page de rendez-vous et des pages légales |
| `supabase/migrations/20261031010000_compliance.sql` | Suppression de la table Stripe, preuve d'acceptation des CGU, newsletter, purge à 3 ans |
| `supabase/tests/compliance.test.sql` | Tests : preuve CGU, newsletter fermée en lecture, désinscription |
| Supprimés : `src/lib/stripe.ts`, `src/lib/actions/billing.ts`, `src/app/api/stripe/`, page Abonnement, dépendance `stripe` | Plus de paiement en ligne sur le site |
| `src/app/[locale]/app/(shell)/page.tsx`, `analytics/page.tsx` | Correction d'accessibilité (structure des listes `dl`) |
| Tableaux (prospects, conversations, rendez-vous, pages légales) | Zone défilante accessible au clavier |
| `messages/en.json`, `messages/fr.json` | Nouveaux textes : consentement, newsletter, rendez-vous, mentions légales, offre sur devis |
| `tests/e2e/run.mjs` | Audit axe-core (WCAG 2.1 AA) sur chaque page, tests du bandeau, des CGU et de la newsletter |
| `scripts/check-legal.mjs` | `npm run check:legal` : liste des champs légaux encore vides |

## À faire par un humain

### Informations à remplir dans `src/config/company.ts`
Lancez `npm run check:legal` pour obtenir la liste à jour. Champs à remplir : dénomination, forme juridique,
capital, adresse, RCCM, Id. Nat., NIF, numéro de TVA UE (si immatriculé), directeur de la publication,
e-mail, e-mail pour les demandes RGPD, représentant dans l'UE (nom, adresse, e-mail), hébergeur (nom,
adresse, téléphone), région du projet Supabase, médiateur (nom, adresse, site), tribunal compétent
pour les litiges avec les professionnels.

### Décisions et démarches
1. **Représentant dans l'UE (RGPD, art. 27)** : en désigner un par contrat (prestataires spécialisés).
2. **Médiateur de la consommation** : en choisir un sur la liste officielle de la Commission d'évaluation et de contrôle de la médiation de la consommation (CECMC, economie.gouv.fr/mediation-conso) et **y adhérer** avant de le citer. Vérifiez qu'il accepte une entreprise établie hors de l'UE.
3. **Hébergeur et Supabase** : choisir un hébergement et une région Supabase **dans l'UE**, puis compléter les mentions.
4. **Contrats de transfert** : signer les clauses contractuelles types (CCT) pour les transferts vers la RDC et les États-Unis. Les CCT doivent être signées avec chaque client professionnel pour l'accord de sous-traitance, et avec Supabase et Anthropic (vérifier leurs DPA).
5. **TVA** : faire valider le régime applicable par un fiscaliste (guichet OSS hors UE pour la part numérique vendue aux particuliers, autoliquidation pour les professionnels).
6. **Loi applicable** : les CGV proposent le droit français ; à valider par un avocat. Les clauses de pénalités de retard (3 fois le taux d'intérêt légal, 40 €) s'appuient sur ce choix.
7. **PayPal** : vérifier que ton compte professionnel en RDC peut encaisser des clients européens, et l'entité PayPal qui te contracte.
8. **Factures** : mettre en place une facturation conforme. PayPal ne délivre pas de factures à ta place.
9. **Outil d'envoi de la newsletter** : le choisir, l'ajouter à la politique de confidentialité, et mettre le lien `/fr/newsletter/unsubscribe?token=…` dans chaque e-mail.
10. **Outils tiers** : créer les comptes et renseigner les identifiants `NEXT_PUBLIC_*`. Dans Google Analytics, régler la conservation des données à 14 mois. Dans Tawk.to, régler la durée de conservation. Vérifier les durées marquées [À VÉRIFIER] dans la politique de cookies.
11. **Devis** : chaque devis doit joindre les CGV (PDF) et porter la mention « lu et approuvé, CGV acceptées ». Pour les particuliers, ajouter la demande expresse de démarrage avant la fin du délai de rétractation et le formulaire de rétractation.
12. **Purge des données** : planifier `select public.purge_expired_data();` (pg_cron Supabase, une fois par jour).
13. **Inscription ouverte** : décider si la création de compte reste ouverte à tous ou si elle est réservée aux clients sous contrat.
14. **Droit congolais** : faire vérifier par un juriste local (Code du numérique de 2023, déclaration éventuelle auprès de l'autorité de protection des données).
15. **Relecture par un avocat** de toutes les pages légales avant la mise en ligne, en particulier les CGV et l'accord de sous-traitance.
16. **Accessibilité** : faire réaliser un audit complet (RGAA ou WCAG) et sous-titrer les vidéos avant de les publier.
17. **Promesses commerciales** : confirmer la validité des devis (30 jours) et le délai de réponse aux réclamations (15 jours) indiqués dans les CGV.
