import { company } from "@/config/company";
import type { Locale } from "@/i18n/config";
import { H2, H3, P, UL, V } from "./shared";

export function TermsOfUse({ locale }: { locale: Locale }) {
  const c = company;
  const v = (value: string | null, fr: string, en: string) => <V value={value} label={{ fr, en }} locale={locale} />;
  const email = v(c.email, "e-mail de contact", "contact email");
  const host = v(c.host.name, "hébergeur", "host");

  if (locale === "fr") {
    return (
      <>
        <P>
          Les présentes conditions générales d’utilisation (CGU) encadrent l’utilisation de l’application {c.brand}, éditée par {v(c.legalName, "dénomination sociale", "company name")}
          {" "}(voir les mentions légales). Elles sont acceptées lors de la création du compte, par une case à cocher. Version : {c.termsVersion}.
        </P>

        <H2 id="definitions">1. Définitions</H2>
        <UL>
          <li><strong>Client</strong> : l’entreprise ou la personne qui a souscrit une prestation incluant l’accès à {c.brand}.</li>
          <li><strong>Utilisateur</strong> : toute personne disposant d’un compte, agissant pour le Client.</li>
          <li><strong>Espace de travail</strong> : l’espace du Client, cloisonné des autres.</li>
          <li><strong>Données du Client</strong> : les informations saisies dans l’Espace de travail, notamment celles des prospects du Client.</li>
        </UL>

        <H2 id="acces">2. Accès et compte</H2>
        <UL>
          <li>L’inscription est réservée aux personnes majeures agissant pour une entreprise ou pour elles-mêmes, qui fournissent des informations exactes.</li>
          <li>L’Utilisateur garde ses identifiants confidentiels et signale sans délai toute utilisation non autorisée à {email}.</li>
          <li>L’accès payant éventuel est régi par le devis et les conditions générales de vente.</li>
        </UL>

        <H2 id="service">3. Le service</H2>
        <P>
          {c.brand} permet de gérer des prospects, un pipeline commercial, des rendez-vous, des conversations, des modèles de messages bilingues, des automatisations et des
          analyses, en français et en anglais. Les connexions directes à la messagerie, aux SMS et aux agendas ne sont pas encore disponibles : les messages sont enregistrés dans
          {" "}{c.brand} et envoyés par l’Utilisateur depuis ses propres outils. Aucun message automatique ou proposé par l’IA n’est marqué comme envoyé sans validation humaine.
        </P>

        <H2 id="regles">4. Règles d’utilisation</H2>
        <P>L’Utilisateur s’engage à utiliser {c.brand} de manière licite. Il est notamment interdit :</P>
        <UL>
          <li>d’enregistrer des données de personnes sans base légale, ou de les prospecter en violation des règles applicables (par exemple, l’e-mail de prospection envoyé à des particuliers sans leur consentement préalable, sauf exceptions légales) ;</li>
          <li>d’enregistrer des données sensibles (santé, opinions, origine, religion, orientation sexuelle, condamnations…) dans les notes ou messages ;</li>
          <li>de diffuser des contenus illicites, trompeurs, haineux ou portant atteinte aux droits de tiers ;</li>
          <li>d’utiliser les fonctions d’IA pour produire des contenus illégaux ou trompeurs, ou en violation des politiques d’utilisation d’Anthropic ;</li>
          <li>de tenter d’accéder aux données d’un autre Espace de travail, de contourner les mesures de sécurité, de surcharger le service ou de le copier.</li>
        </UL>

        <H2 id="ia">5. Fonctions d’intelligence artificielle</H2>
        <P>
          Les contenus générés par l’IA (réponses, résumés, traductions, modèles) sont des propositions qui peuvent contenir des erreurs. Ils sont signalés comme tels.
          L’Utilisateur les relit avant toute utilisation et reste responsable des messages qu’il envoie, y compris de l’information des destinataires lorsque la réglementation
          l’impose. Les données nécessaires sont transmises à Anthropic uniquement lorsque l’Utilisateur déclenche une fonction d’IA.
        </P>

        <H2 id="donnees">6. Données du Client</H2>
        <P>
          Le Client est responsable du traitement des Données du Client ; {c.brand} agit comme sous-traitant conformément à l’annexe ci-dessous. Le Client garantit disposer d’une
          base légale pour ces données et informer les personnes concernées. Les données saisies sont conservées telles quelles et ne sont jamais traduites automatiquement.
        </P>

        <H2 id="pi">7. Propriété intellectuelle</H2>
        <P>
          {c.brand} reste titulaire de tous les droits sur l’application. Le Client reçoit un droit d’utilisation personnel et non transférable pendant la durée de son accès.
          Le Client reste propriétaire des Données du Client.
        </P>

        <H2 id="disponibilite">8. Disponibilité</H2>
        <P>
          {c.brand} met en œuvre des moyens raisonnables pour assurer l’accès au service, sans garantie de disponibilité permanente, sauf engagement de niveau de service prévu au
          devis. Des interruptions peuvent avoir lieu pour maintenance ou sécurité.
        </P>

        <H2 id="responsabilite">9. Responsabilité</H2>
        <P>
          L’Utilisateur est responsable de l’usage qu’il fait du service et des contenus qu’il saisit ou envoie. La responsabilité de {c.brand} est encadrée par les conditions
          générales de vente.
        </P>

        <H2 id="fin">10. Suspension, résiliation et sort des données</H2>
        <UL>
          <li>L’Utilisateur peut demander la fermeture de son compte à tout moment en écrivant à {email}.</li>
          <li>{c.brand} peut suspendre un compte en cas de manquement grave aux présentes CGU, après avertissement sauf urgence.</li>
          <li>
            À la fin de l’accès, le Client peut demander l’export de ses données dans les 30 jours ; elles sont ensuite supprimées dans un délai de 30 jours, sauf obligation légale
            de conservation.
          </li>
        </UL>

        <H2 id="modifications">11. Modification des CGU</H2>
        <P>
          {c.brand} peut modifier les CGU. Les Utilisateurs sont informés au moins 30 jours avant l’entrée en vigueur d’une modification importante ; leur acceptation leur est
          demandée à nouveau. À défaut, ils peuvent fermer leur compte.
        </P>

        <H2 id="loi">12. Loi applicable</H2>
        <P>Les présentes CGU sont soumises à la même loi et aux mêmes règles de litiges que les conditions générales de vente.</P>

        <H2 id="annexe">Annexe — Accord de sous-traitance (article 28 du RGPD)</H2>
        <H3>Objet et durée</H3>
        <P>{c.brand} (le sous-traitant) traite les Données du Client pour le compte du Client (le responsable du traitement), pendant la durée de l’accès au service.</P>
        <H3>Nature, finalité et données</H3>
        <UL>
          <li>Finalité : fournir le service {c.brand} (gestion des prospects, conversations, rendez-vous, automatisations, fonctions d’IA).</li>
          <li>Données : identité et coordonnées des prospects, entreprise, langue, messages, rendez-vous, notes, valeur estimée.</li>
          <li>Personnes concernées : prospects, clients et contacts du Client.</li>
        </UL>
        <H3>Engagements du sous-traitant</H3>
        <UL>
          <li>traiter les données uniquement sur instruction documentée du Client (les présentes CGU et l’utilisation du service valent instructions) ;</li>
          <li>soumettre son personnel à une obligation de confidentialité ;</li>
          <li>assurer la sécurité : cloisonnement des Espaces de travail en base de données, chiffrement des échanges, mots de passe chiffrés, accès restreints, sauvegardes de l’hébergeur ;</li>
          <li>aider le Client à répondre aux demandes d’exercice des droits et, si nécessaire, à réaliser une analyse d’impact ;</li>
          <li>notifier au Client toute violation de données dans les meilleurs délais et au plus tard 48 heures après en avoir eu connaissance ;</li>
          <li>supprimer ou restituer les données à la fin du service, selon le choix du Client ;</li>
          <li>mettre à disposition les informations nécessaires pour démontrer le respect de ces obligations et permettre des audits raisonnables.</li>
        </UL>
        <H3>Sous-traitants ultérieurs autorisés</H3>
        <UL>
          <li>Supabase Inc. — base de données et authentification — région : {v(c.databaseRegion, "région Supabase", "Supabase region")}</li>
          <li>Anthropic PBC — fonctions d’IA (États-Unis)</li>
          <li>{host} — hébergement de l’application</li>
        </UL>
        <P>Le Client est informé au moins 30 jours à l’avance de tout ajout ou remplacement et peut s’y opposer pour un motif légitime.</P>
        <H3>Transferts</H3>
        <P>
          {c.brand} étant établie en République démocratique du Congo, et certains sous-traitants aux États-Unis, les transferts sont encadrés par les clauses contractuelles
          types de la Commission européenne {v(null, "clauses à signer avec chaque client et sous-traitant ; à faire valider par un avocat", "clauses to be signed; to validate with a lawyer")}.
        </P>
      </>
    );
  }

  return (
    <>
      <P>
        These terms of use govern the use of the {c.brand} application, published by {v(c.legalName, "dénomination sociale", "company name")} (see the legal notice). They are
        accepted when creating an account, by ticking a box. Version: {c.termsVersion}.
      </P>

      <H2 id="definitions">1. Definitions</H2>
      <UL>
        <li><strong>Customer</strong>: the business or person that purchased a service including access to {c.brand}.</li>
        <li><strong>User</strong>: anyone with an account, acting on behalf of the Customer.</li>
        <li><strong>Workspace</strong>: the Customer’s space, isolated from all others.</li>
        <li><strong>Customer Data</strong>: the information entered in the Workspace, in particular about the Customer’s leads.</li>
      </UL>

      <H2 id="access">2. Access and account</H2>
      <UL>
        <li>Registration is open to adults acting for a business or for themselves who provide accurate information.</li>
        <li>Users keep their credentials confidential and promptly report any unauthorised use to {email}.</li>
        <li>Any paid access is governed by the quote and the terms of sale.</li>
      </UL>

      <H2 id="service">3. The service</H2>
      <P>
        {c.brand} lets you manage leads, a sales pipeline, appointments, conversations, bilingual message templates, automations and analytics, in English and French. Direct
        connections to email, SMS and calendars are not available yet: messages are recorded in {c.brand} and sent by the User from their own tools. No automated or AI-suggested
        message is marked as sent without human approval.
      </P>

      <H2 id="rules">4. Rules of use</H2>
      <P>Users must use {c.brand} lawfully. In particular, it is forbidden:</P>
      <UL>
        <li>to record people’s data without a legal basis, or to market to them in breach of applicable rules (for example, marketing emails to consumers without their prior consent, save legal exceptions);</li>
        <li>to record sensitive data (health, opinions, origin, religion, sexual orientation, convictions…) in notes or messages;</li>
        <li>to publish unlawful, misleading or hateful content, or content infringing third-party rights;</li>
        <li>to use the AI features to produce illegal or misleading content, or in breach of Anthropic’s usage policies;</li>
        <li>to try to access another Workspace’s data, bypass security measures, overload the service or copy it.</li>
      </UL>

      <H2 id="ai">5. Artificial intelligence features</H2>
      <P>
        AI-generated content (replies, summaries, translations, templates) consists of suggestions that may contain errors, and is labelled as such. Users review it before any
        use and remain responsible for the messages they send, including informing recipients where the law requires it. The necessary data is sent to Anthropic only when a User
        triggers an AI feature.
      </P>

      <H2 id="data">6. Customer Data</H2>
      <P>
        The Customer is the controller of Customer Data; {c.brand} acts as a processor under the annex below. The Customer warrants that it has a legal basis for this data and
        informs the people concerned. Data is stored exactly as entered and is never translated automatically.
      </P>

      <H2 id="ip">7. Intellectual property</H2>
      <P>{c.brand} retains all rights in the application. The Customer receives a personal, non-transferable right of use for the duration of its access, and remains the owner of Customer Data.</P>

      <H2 id="availability">8. Availability</H2>
      <P>
        {c.brand} uses reasonable efforts to keep the service available, without guaranteeing permanent availability unless a service level is agreed in the quote. Interruptions
        may occur for maintenance or security.
      </P>

      <H2 id="liability">9. Liability</H2>
      <P>Users are responsible for their use of the service and for the content they enter or send. {c.brand}’s liability is governed by the terms of sale.</P>

      <H2 id="end">10. Suspension, termination and data</H2>
      <UL>
        <li>Users can ask for their account to be closed at any time by writing to {email}.</li>
        <li>{c.brand} may suspend an account in case of serious breach of these terms, after a warning except in emergencies.</li>
        <li>When access ends, the Customer can request an export of its data within 30 days; the data is then deleted within 30 days, unless the law requires it to be kept.</li>
      </UL>

      <H2 id="changes">11. Changes to these terms</H2>
      <P>
        {c.brand} may change these terms. Users are informed at least 30 days before a significant change takes effect and are asked to accept it again. Otherwise, they may close
        their account.
      </P>

      <H2 id="law">12. Governing law</H2>
      <P>These terms are subject to the same law and dispute rules as the terms of sale.</P>

      <H2 id="annex">Annex — Data processing agreement (GDPR Article 28)</H2>
      <H3>Subject matter and duration</H3>
      <P>{c.brand} (the processor) processes Customer Data on behalf of the Customer (the controller) for the duration of access to the service.</P>
      <H3>Nature, purpose and data</H3>
      <UL>
        <li>Purpose: providing the {c.brand} service (lead management, conversations, appointments, automations, AI features).</li>
        <li>Data: leads’ identity and contact details, company, language, messages, appointments, notes, estimated value.</li>
        <li>Data subjects: the Customer’s leads, customers and contacts.</li>
      </UL>
      <H3>Processor commitments</H3>
      <UL>
        <li>process data only on the Customer’s documented instructions (these terms and the use of the service constitute instructions);</li>
        <li>bind its staff to confidentiality;</li>
        <li>ensure security: Workspace isolation in the database, encrypted traffic, hashed passwords, restricted access, host backups;</li>
        <li>help the Customer answer data subject requests and, where needed, carry out an impact assessment;</li>
        <li>notify the Customer of any personal data breach without undue delay and at the latest 48 hours after becoming aware of it;</li>
        <li>delete or return the data at the end of the service, as the Customer chooses;</li>
        <li>make available the information needed to demonstrate compliance and allow reasonable audits.</li>
      </UL>
      <H3>Authorised sub-processors</H3>
      <UL>
        <li>Supabase Inc. — database and authentication — region: {v(c.databaseRegion, "région Supabase", "Supabase region")}</li>
        <li>Anthropic PBC — AI features (United States)</li>
        <li>{host} — application hosting</li>
      </UL>
      <P>The Customer is informed at least 30 days in advance of any addition or replacement and may object on legitimate grounds.</P>
      <H3>Transfers</H3>
      <P>
        As {c.brand} is established in the Democratic Republic of the Congo, and some sub-processors in the United States, transfers are covered by the European Commission’s
        standard contractual clauses {v(null, "clauses à signer avec chaque client et sous-traitant ; à faire valider par un avocat", "clauses to be signed; to validate with a lawyer")}.
      </P>
    </>
  );
}
