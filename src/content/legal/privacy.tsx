import { company } from "@/config/company";
import type { Locale } from "@/i18n/config";
import { processings } from "./data";
import { H2, H3, P, Table, UL, V } from "./shared";

export function PrivacyPolicy({ locale }: { locale: Locale }) {
  const c = company;
  const v = (value: string | null, fr: string, en: string) => <V value={value} label={{ fr, en }} locale={locale} />;
  const privacyEmail = v(c.privacyEmail ?? c.email, "e-mail pour les demandes RGPD", "privacy email");
  const fr = locale === "fr";
  const table = (
    <Table
      caption={fr ? "Traitements de données personnelles" : "Personal data processing"}
      head={fr ? ["Finalité", "Données", "Base légale", "Durée de conservation", "Destinataires", "Transfert hors UE"] : ["Purpose", "Data", "Legal basis", "Retention", "Recipients", "Transfer outside the EU"]}
      rows={processings.map((p) => [p.purpose[locale], p.data[locale], p.basis[locale], p.retention[locale], p.recipients[locale], p.transfers[locale]])}
    />
  );

  if (fr) {
    return (
      <>
        <P>
          Cette politique explique quelles données personnelles {c.brand} traite, pourquoi, sur quelle base, combien de temps, avec qui, et comment exercer vos droits.
          Elle s’applique au site public, aux formulaires et à l’application {c.brand}.
        </P>

        <H2 id="responsable">Responsable du traitement</H2>
        <P>
          {v(c.legalName, "dénomination sociale", "company name")}, {v(c.address, "adresse du siège", "registered office")}, {c.country.fr}. Contact pour toute question sur vos
          données : {privacyEmail}.
        </P>
        <P>
          Notre société étant établie hors de l’Union européenne, nous appliquons le RGPD aux personnes situées dans l’Union et avons désigné un représentant (article 27) :{" "}
          {v(c.euRepresentative.name, "représentant UE", "EU representative")}, {v(c.euRepresentative.address, "adresse", "address")}, {v(c.euRepresentative.email, "e-mail", "email")}.
          Nous respectons également la réglementation congolaise sur la protection des données personnelles.
        </P>

        <H2 id="roles">Deux rôles différents</H2>
        <UL>
          <li>Pour les visiteurs du site, nos prospects, nos clients et les utilisateurs de {c.brand}, nous sommes <strong>responsable du traitement</strong>.</li>
          <li>
            Pour les données des prospects que nos clients enregistrent dans {c.brand}, nous sommes <strong>sous-traitant</strong> : chaque client décide de l’usage de ces données.
            Si vous êtes le prospect d’un de nos clients, adressez vos demandes à cette entreprise ; nous l’aiderons à y répondre.
          </li>
        </UL>

        <H2 id="traitements">Ce que nous faisons de vos données</H2>
        {table}
        <P>Les champs obligatoires des formulaires sont signalés par un astérisque. Sans eux, nous ne pouvons pas traiter votre demande.</P>

        <H2 id="ia">Intelligence artificielle</H2>
        <P>
          Les fonctions d’IA de {c.brand} utilisent le modèle Claude d’Anthropic. Elles ne s’exécutent que lorsqu’un utilisateur les déclenche. Leurs résultats sont des propositions
          signalées comme générées par l’IA ; aucun message n’est envoyé sans validation humaine. Aucune décision produisant des effets juridiques à votre égard n’est prise de façon
          automatisée.
        </P>

        <H2 id="transferts">Transferts hors de l’Union européenne</H2>
        <P>
          Certains destinataires sont situés hors de l’Union européenne, notamment notre équipe en République démocratique du Congo, pays qui ne bénéficie pas d’une décision
          d’adéquation, et des prestataires aux États-Unis. Ces transferts sont encadrés par les clauses contractuelles types de la Commission européenne ou, pour les entreprises
          américaines certifiées, par le cadre de protection des données UE–États-Unis (Data Privacy Framework). Vous pouvez obtenir une copie de ces garanties en écrivant à{" "}
          {privacyEmail}.
        </P>

        <H2 id="securite">Sécurité</H2>
        <P>
          Chaque espace de travail est cloisonné en base de données ; les échanges sont chiffrés (HTTPS) ; les mots de passe sont stockés sous forme chiffrée irréversible ; l’accès
          aux données est limité aux personnes qui en ont besoin.
        </P>

        <H2 id="droits">Vos droits</H2>
        <P>Vous disposez des droits suivants sur vos données :</P>
        <UL>
          <li>accès : obtenir une copie de vos données ;</li>
          <li>rectification : corriger des données inexactes ;</li>
          <li>effacement : demander la suppression de vos données ;</li>
          <li>opposition : vous opposer à un traitement fondé sur l’intérêt légitime, et à tout moment à la prospection ;</li>
          <li>limitation : demander le gel temporaire d’un traitement ;</li>
          <li>portabilité : recevoir les données que vous nous avez fournies dans un format lisible par machine ;</li>
          <li>retrait du consentement, à tout moment, sans remettre en cause les traitements passés (cookies : « Gérer mes cookies » ; lettre d’information : lien présent dans chaque e-mail) ;</li>
          <li>définir des directives sur le sort de vos données après votre décès.</li>
        </UL>
        <H3>Comment les exercer</H3>
        <P>
          Écrivez à {privacyEmail} ou à notre représentant dans l’Union européenne. Nous répondons dans un délai d’un mois, prolongeable de deux mois pour les demandes complexes.
          Nous pouvons vous demander de justifier de votre identité en cas de doute raisonnable.
        </P>
        <H3>Réclamation</H3>
        <P>
          Vous pouvez introduire une réclamation auprès de l’autorité de protection des données de votre pays de résidence. En France : Commission nationale de l’informatique et
          des libertés (CNIL), 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — www.cnil.fr.
        </P>

        <H2 id="modifications">Modifications</H2>
        <P>Nous mettrons cette politique à jour si nos traitements changent. La date de dernière mise à jour figure en haut de la page.</P>
      </>
    );
  }

  return (
    <>
      <P>
        This policy explains what personal data {c.brand} processes, why, on what legal basis, for how long, with whom, and how to exercise your rights. It applies to the public
        website, the forms and the {c.brand} application.
      </P>

      <H2 id="controller">Data controller</H2>
      <P>
        {v(c.legalName, "dénomination sociale", "company name")}, {v(c.address, "adresse du siège", "registered office")}, {c.country.en}. Contact for any question about your data:{" "}
        {privacyEmail}.
      </P>
      <P>
        As our company is established outside the European Union, we apply the GDPR to people located in the Union and have appointed a representative (Article 27):{" "}
        {v(c.euRepresentative.name, "représentant UE", "EU representative")}, {v(c.euRepresentative.address, "adresse", "address")}, {v(c.euRepresentative.email, "e-mail", "email")}.
        We also comply with Congolese personal data protection law.
      </P>

      <H2 id="roles">Two different roles</H2>
      <UL>
        <li>For website visitors, our prospects, our customers and {c.brand} users, we are the <strong>controller</strong>.</li>
        <li>
          For the lead data our customers record in {c.brand}, we are a <strong>processor</strong>: each customer decides how this data is used. If you are a lead of one of our
          customers, please contact that company; we will help it answer you.
        </li>
      </UL>

      <H2 id="processing">What we do with your data</H2>
      {table}
      <P>Required form fields are marked with an asterisk. Without them, we cannot handle your request.</P>

      <H2 id="ai">Artificial intelligence</H2>
      <P>
        {c.brand}’s AI features use Anthropic’s Claude model. They only run when a user triggers them. Their results are suggestions labelled as AI-generated; no message is sent
        without human approval. No decision producing legal effects concerning you is made by automated means.
      </P>

      <H2 id="transfers">Transfers outside the European Union</H2>
      <P>
        Some recipients are located outside the European Union, in particular our team in the Democratic Republic of the Congo, which does not benefit from an adequacy decision,
        and providers in the United States. These transfers are covered by the European Commission’s standard contractual clauses or, for certified US companies, by the EU–US
        Data Privacy Framework. You can obtain a copy of these safeguards by writing to {privacyEmail}.
      </P>

      <H2 id="security">Security</H2>
      <P>
        Each workspace is isolated in the database; traffic is encrypted (HTTPS); passwords are stored as an irreversible hash; access to data is limited to the people who need it.
      </P>

      <H2 id="rights">Your rights</H2>
      <P>You have the following rights over your data:</P>
      <UL>
        <li>access: obtain a copy of your data;</li>
        <li>rectification: correct inaccurate data;</li>
        <li>erasure: ask for your data to be deleted;</li>
        <li>objection: object to processing based on legitimate interest, and at any time to direct marketing;</li>
        <li>restriction: ask for processing to be temporarily frozen;</li>
        <li>portability: receive the data you provided in a machine-readable format;</li>
        <li>withdrawal of consent at any time, without affecting past processing (cookies: “Manage cookies”; newsletter: link in each email).</li>
      </UL>
      <H3>How to exercise them</H3>
      <P>
        Write to {privacyEmail} or to our representative in the European Union. We reply within one month, which may be extended by two months for complex requests. We may ask
        you to prove your identity if we have reasonable doubts.
      </P>
      <H3>Complaints</H3>
      <P>
        You can lodge a complaint with the data protection authority of your country of residence. In France: Commission nationale de l’informatique et des libertés (CNIL),
        3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — www.cnil.fr.
      </P>

      <H2 id="changes">Changes</H2>
      <P>We will update this policy if our processing changes. The date of the last update is shown at the top of the page.</P>
    </>
  );
}
