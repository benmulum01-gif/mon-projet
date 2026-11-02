# Prompts ChatGPT : maquettes des pages SAVAN

Prompts construits avec le skill `ui-ux-pro-max` (style « Flat + Swiss / Trust & Authority »
recommandé pour un CRM immobilier, structure « Hero-centric + Trust », un seul appel à l'action
principal, contrastes AA, icônes au trait).

**Mode d'emploi :** dans UNE seule conversation ChatGPT, colle d'abord le **prompt maître**
(avec le bloc de la direction choisie), puis envoie les prompts de pages un par un.
ChatGPT garde ainsi le même logo, les mêmes couleurs et la même typographie sur toutes les pages.

---

## 1. Prompt maître (à envoyer en premier)

```
Tu es designer UI/UX senior. Tu vas créer des maquettes haute fidélité des pages web de SAVAN,
une seule image par message, rendue comme une vraie capture d'écran de site (pas un dessin,
pas une photo d'écran en perspective, pas de mockup d'ordinateur autour).

LE PRODUIT
SAVAN aide les agences immobilières (vente et location) et les agents indépendants en Europe
à répondre vite aux demandes d'acquéreurs et de locataires, à les qualifier avec l'IA
(budget, financement, secteur, délai), à gérer leurs biens et à organiser les visites.
Offre sur devis. Site bilingue français / anglais. Impression recherchée : CONFIANCE et SÉRIEUX.

IDENTITÉ (identique sur toutes les maquettes)
- Logo : le mot « SAVAN » + un symbole simple (voir direction). Toujours en haut à gauche.
- Grille 12 colonnes, largeur de contenu 1200 px, marges généreuses, alignements stricts.
- Coins légèrement arrondis (voir direction), ombres très légères ou aucune.
- Icônes au trait fin, style Lucide, jamais d'émoji.
- Textes en français, courts et lisibles, orthographe exacte (je te donne les textes).
- Contraste élevé : texte foncé sur fond clair, boutons lisibles.
- Aucun logo de marque existante (portails, banques, réseaux sociaux).
- Personnes : pas de visages réalistes présentés comme de vrais clients ; préfère des
  captures de l'application, des fiches de biens et des photos d'architecture.
- Aucun chiffre de résultat inventé (pas de « +300 % », pas de faux avis clients).

DIRECTION VISUELLE
[COLLE ICI UN SEUL DES BLOCS A, B OU C]

Réponds seulement « Prêt » et attends mes demandes de pages.
```

### Bloc A : « L'Étude » (institutionnel, notarial)
```
Palette : bleu marine #14213D (titres, boutons principaux), laiton #8A6A24 (filets, détails),
fond blanc #FFFFFF, fond secondaire #F7F8FB, texte secondaire #4A5568, bordures #E2E6EE.
Typo : titres en serif « Source Serif 4 » semi-gras ; textes en « Source Sans 3 ».
Logo : « SAVAN » en capitales espacées (serif) précédé d'un petit losange au trait laiton.
Coins : 4 px. Ambiance calme, symétrique, intemporelle.
```

### Bloc B : « Le Cadastre » (moderne, outil métier)
```
Palette : vert sapin #1D5C48 (boutons, accents), encre #15302A (titres), fond #F6F8F7
avec une trame de plan très légère (quadrillage 28 px, #E4EBE8), cartes blanches,
puces vert clair #E3EFE9, texte secondaire #4B5F59.
Typo : « IBM Plex Sans » pour tout ; « IBM Plex Mono » pour les références et heures
(ex. MANDAT 2026-041, 22:14).
Logo : « savan » en minuscules semi-grasses précédé d'un carré au trait barré d'une diagonale
(évoque un plan cadastral).
Coins : 8 px. Ambiance précise, ordonnée, chiffres mis en avant.
```

### Bloc C : « Le Prestige » (haut de gamme)
```
Palette : anthracite #1B1D22 (fond), sable #D9C7A3 (accents, boutons), crème #F2EDE4 (textes),
cartes #24272E, texte secondaire #C4BCAE.
Typo : titres « Cinzel » ; textes « Josefin Sans ».
Logo : « SAVAN » en capitales gravées très espacées.
Coins : 0 px (angles nets). Ambiance élégante, beaucoup d'espace vide.
```

---

## 2. Prompts de pages (à envoyer un par un après le prompt maître)

### Page d'accueil (ordinateur)
```
Maquette : page d'accueil, ordinateur 1440 px de large, page complète en une image verticale.
1. En-tête : logo ; menu « Fonctionnement · Agences · Tarifs · FAQ · Contact » ; sélecteur
   « Français » ; lien « Connexion » ; bouton principal « Demander un devis ».
2. Hero : sur-titre « Acquisition client pour agences immobilières » ; titre
   « Chaque demande d'acquéreur reçoit une réponse, même à 22 h. » ; texte « SAVAN centralise
   les demandes de vos portails et de votre site, qualifie budget et financement avec l'IA,
   et propose des créneaux de visite. Votre équipe valide avant tout envoi. » ;
   boutons « Demander un devis » et « Prendre rendez-vous ». À droite : une fiche de bien
   (« Appartement T3 traversant · Lyon 6e · 78 m² · 412 000 € · DPE C ») et une carte
   « Nouvelle demande · 22 h 14 · Claire M., acquéreuse · Budget 420 k€ · Prêt accordé ·
   Visite proposée jeudi 18 h 30 ».
3. Bande de 4 bénéfices avec icônes : « Répondez plus vite », « Qualifiez chaque acquéreur »,
   « Organisez vos visites », « Suivez vos mandats ».
4. « Comment ça marche » en 3 étapes : « Centralisez », « Qualifiez », « Concluez ».
5. Section bilingue : « Vos clients écrivent en anglais ? SAVAN répond dans leur langue. »
6. Bandeau final : « Prêt à ne plus perdre de demandes ? » + bouton « Demander un devis ».
7. Pied de page : liens Produit, Entreprise, newsletter, « Mentions légales · Confidentialité ·
   Cookies · CGV · CGU · Accessibilité : partiellement conforme · Gérer mes cookies ».
```

### Page d'accueil (mobile)
```
Même page d'accueil en version mobile, 390 px de large, image verticale.
Menu replié en bouton « Menu », hero empilé (texte puis fiche de bien), bénéfices en une
colonne, boutons pleine largeur d'au moins 44 px de haut.
```

### Page Tarifs (sur devis)
```
Maquette : page « Tarifs », ordinateur 1440 px.
Titre « Tarifs » ; sous-titre « Chaque agence est différente. Nous concevons votre système
d'acquisition avec vous et le chiffrons avant tout engagement. »
Bloc « Ce qu'une prestation peut comprendre » avec 4 lignes cochées : audit de vos demandes
actuelles ; mise en place de SAVAN (pipeline, modèles bilingues, automatisations) ;
formation de votre équipe ; suivi et ajustements.
Bloc « Comment le prix est établi » : devis écrit et détaillé avant tout démarrage ;
« Paiement sur facture, par virement ou PayPal. » ; boutons « Demander un devis » et
« Prendre rendez-vous ». Aucun prix affiché.
```

### Page Agences (secteurs)
```
Maquette : page « Pour les professionnels de l'immobilier », ordinateur 1440 px.
3 cartes : « Agences de transaction » (demandes d'acquéreurs, estimations vendeurs, visites) ;
« Agences de location » (dossiers locataires, pièces justificatives, visites groupées) ;
« Agents indépendants » (un seul outil pour toutes les demandes, réponses en déplacement).
Sous chaque carte, une mini-capture de l'écran SAVAN correspondant.
Appel à l'action : « Parlez-nous de votre agence ».
```

### Page Contact / Demande de devis
```
Maquette : page « Nous contacter ou demander un devis », ordinateur 1440 px.
Formulaire à gauche : Nom complet*, E-mail*, Agence (facultatif), Message*, mention
« Les champs marqués d'un * sont obligatoires. », phrase sur l'usage des données avec lien
« politique de confidentialité », bouton « Envoyer le message ».
À droite : bloc « Vous préférez la messagerie ? » avec bouton WhatsApp au trait (sans logo
officiel), et bloc « Prendre rendez-vous » avec un calendrier simplifié.
```

### Page Connexion
```
Maquette : page « Connexion », ordinateur 1440 px, très épurée.
Carte centrée : logo, titre « Connexion », « Bon retour sur SAVAN. », champs E-mail et
Mot de passe, bouton « Se connecter », lien « Pas encore de compte ? Créer un compte ».
Sélecteur de langue en haut à droite, liens légaux discrets en bas.
```

### Application : tableau de bord
```
Maquette : application SAVAN connectée, ordinateur 1440 px.
Barre latérale gauche : logo, nom de l'agence « Agence Saint-Paul » ; menu « Vue d'ensemble,
Prospects, Biens, Visites, Pipeline commercial, Conversations, Automatisations, Analyses,
Paramètres » (Vue d'ensemble active) ; en bas sélecteur « Français » et e-mail.
Contenu : titre « Vue d'ensemble » ; 6 tuiles chiffrées « Prospects au total 128 ·
Nouveaux sur 7 jours 14 · Visites cette semaine 9 · Biens en mandat 23 ·
Messages à valider 3 · Valeur du pipeline 2 840 000 € » ; liste « Demandes récentes »
avec statuts en pastilles (Nouveau prospect, Qualifié, Visite planifiée) ;
encart « Prochaines visites » avec adresse du bien et heure.
Ces chiffres sont des exemples d'interface, pas des résultats.
```

### Application : fiche d'un bien
```
Maquette : écran « Fiche du bien », ordinateur 1440 px, même barre latérale (Biens actif).
En-tête : « Appartement T3 traversant · Lyon 6e », pastilles « Vente » et « Mandat exclusif »,
prix « 412 000 € », référence « MANDAT 2026-041 ».
Colonne gauche : galerie de 4 photos d'intérieur sobres ; caractéristiques en tableau
(surface 78 m², 3 pièces, 3e étage, balcon, DPE C, GES B, charges 180 €/mois).
Colonne droite : « Acquéreurs correspondants » (3 profils avec budget et pastille
« Financement validé ») ; « Visites » (2 créneaux planifiés) ; bouton
« Proposer une visite ».
```

### Application : liste des biens
```
Maquette : écran « Biens », ordinateur 1440 px.
Filtres en haut : Type (Vente / Location), Ville, Prix, Statut du mandat ; bouton
« Ajouter un bien ». Grille de 6 cartes de biens : photo, titre, ville, surface, prix
(ou loyer « 1 150 € / mois CC »), étiquette DPE, nombre de demandes reçues.
```

### Application : pipeline
```
Maquette : écran « Pipeline commercial », ordinateur 1440 px.
6 colonnes : Nouveau prospect, Contacté, Qualifié, Visite planifiée, Offre, Gagné.
Cartes de prospects avec nom, bien visé, budget, prochaine action. Une carte porte
la mention « Réponse proposée par l'IA · à valider ».
```

### Application : conversation avec suggestion IA
```
Maquette : écran « Conversation avec Claire M. », ordinateur 1440 px.
Fil de messages : message reçu en anglais (original conservé) avec lien « Traduire en
français » ; à droite, panneau « Assistant IA » : « Langue de sortie : Anglais » ;
bouton « Suggérer une réponse » ; brouillon proposé avec la mention « Contenu généré par
l'IA : relisez-le avant de l'utiliser » ; boutons « Enregistrer comme brouillon » et
« Valider ».
```

### Logo seul (planche)
```
Planche de logo SAVAN selon la direction choisie, fond blanc, image carrée :
version principale (symbole + mot), version symbole seul, version sur fond foncé,
version monochrome. Lignes simples, lisible en 16 px (favicon).
```

---

## 3. Après la génération

- Envoie-moi les maquettes retenues : je les transforme en vraies pages Next.js avec le
  système de design (tokens, composants), bilingues, accessibles et testées.
- Les maquettes servent de référence visuelle : les textes, les chiffres et les noms qui y
  figurent sont des exemples et ne doivent pas être publiés comme des résultats réels.
- Pour le logo définitif, demande un fichier vectoriel (SVG) ou fais redessiner le logo
  retenu : une image générée n'est pas un fichier exploitable tel quel pour un dépôt de marque.
