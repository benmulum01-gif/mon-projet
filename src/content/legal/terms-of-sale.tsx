import { company } from "@/config/company";
import type { Locale } from "@/i18n/config";
import { H2, P, UL, V } from "./shared";

export function TermsOfSale({ locale }: { locale: Locale }) {
  const c = company;
  const v = (value: string | null, fr: string, en: string) => <V value={value} label={{ fr, en }} locale={locale} />;
  const email = v(c.email, "e-mail de contact", "contact email");
  const mediator = (
    <>
      {v(c.mediator.name, "MÉDIATEUR À CHOISIR — nom", "MEDIATOR TO BE CHOSEN — name")}, {v(c.mediator.address, "adresse du médiateur", "mediator address")},{" "}
      {v(c.mediator.website, "site du médiateur", "mediator website")}
    </>
  );

  if (locale === "fr") {
    return (
      <>
        <P>
          Les présentes conditions générales de vente (CGV) s’appliquent aux prestations sur mesure de conception et de mise en place de systèmes d’acquisition client
          proposées par {c.brand}. Certaines clauses ne concernent que les clients <strong>consommateurs</strong> (personnes physiques agissant hors de leur activité
          professionnelle) ou que les clients <strong>professionnels</strong> ; elles sont signalées comme telles.
        </P>

        <H2 id="art1">1. Prestataire</H2>
        <P>
          {v(c.legalName, "dénomination sociale", "company name")}, {v(c.legalForm, "forme juridique", "legal form")} au capital de {v(c.shareCapital, "capital", "share capital")},
          siège : {v(c.address, "adresse", "address")}, {c.country.fr}, RCCM {v(c.rccm, "RCCM", "RCCM")}, Id. Nat. {v(c.idNat, "Id. Nat.", "Id. Nat.")}, NIF{" "}
          {v(c.nif, "NIF", "NIF")}. Contact : {email}{c.phone ? `, ${c.phone}` : ""}.
        </P>

        <H2 id="art2">2. Prestations</H2>
        <P>
          Selon le devis, une prestation peut comprendre : un audit de la gestion des demandes du client, la configuration de l’application {c.brand} (pipeline, modèles de
          messages bilingues, automatisations), la formation des utilisateurs, un accompagnement et des ajustements. Les caractéristiques essentielles, le périmètre, les livrables,
          le calendrier et le prix de chaque prestation sont décrits dans le devis.
        </P>
        <P>
          {c.brand} est tenue d’une obligation de moyens : les résultats commerciaux (nombre de prospects, taux de conversion, chiffre d’affaires) dépendent de nombreux facteurs
          extérieurs et ne sont pas garantis.
        </P>

        <H2 id="art3">3. Devis et commande</H2>
        <UL>
          <li>Toute prestation fait l’objet d’un devis écrit et détaillé, remis avec les présentes CGV sur un support durable (PDF par e-mail).</li>
          <li>Sauf mention contraire, le devis est valable 30 jours.</li>
          <li>
            Le contrat est formé lorsque le client signe le devis (signature manuscrite ou électronique) en déclarant avoir lu et accepté les CGV. Une confirmation est envoyée
            par e-mail.
          </li>
          <li>En cas de contradiction, le devis prévaut sur les CGV, et les CGV sur tout autre document du client.</li>
        </UL>

        <H2 id="art4">4. Prix</H2>
        <UL>
          <li>Les prix sont indiqués dans le devis, en euros. Pour les consommateurs, ils sont indiqués toutes taxes comprises.</li>
          <li>Régime de TVA applicable : {v(null, "régime de TVA à valider avec un fiscaliste (OSS, autoliquidation…)", "VAT treatment to validate with a tax adviser")}.</li>
          <li>Les frais éventuels (déplacement, outils tiers payants) ne sont dus que s’ils figurent dans le devis.</li>
        </UL>

        <H2 id="art5">5. Paiement</H2>
        <UL>
          <li>Le paiement s’effectue sur facture, par virement bancaire ou via PayPal. {c.brand} ne reçoit jamais vos données de carte bancaire.</li>
          <li>L’échéancier (acompte éventuel, solde) figure dans le devis.</li>
          <li>Consommateurs : aucun paiement n’est exigé avant l’expiration du délai de rétractation, sauf si vous demandez que la prestation commence avant (article 7).</li>
          <li>
            Professionnels : sauf délai plus court prévu au devis, les factures sont payables à 30 jours à compter de leur date d’émission. Tout retard entraîne de plein droit des
            pénalités égales à trois fois le taux d’intérêt légal, ainsi qu’une indemnité forfaitaire pour frais de recouvrement de 40 euros, sans préjudice d’une indemnisation
            complémentaire sur justificatifs. Aucun escompte n’est accordé pour paiement anticipé.
          </li>
        </UL>

        <H2 id="art6">6. Exécution</H2>
        <P>
          Les prestations sont réalisées à distance, dans les délais prévus au devis. Le client fournit en temps utile les informations et accès nécessaires ; un retard de sa part
          décale d’autant le calendrier. Les livrables sont considérés comme acceptés à défaut de réserves écrites et motivées dans les 8 jours suivant leur remise.
        </P>

        <H2 id="art7">7. Droit de rétractation (consommateurs)</H2>
        <UL>
          <li>Vous disposez de 14 jours à compter de la conclusion du contrat pour vous rétracter, sans avoir à motiver votre décision ni à payer de pénalité.</li>
          <li>Pour l’exercer, envoyez avant l’expiration du délai une déclaration dénuée d’ambiguïté à {email}, par exemple à l’aide du formulaire figurant en annexe.</li>
          <li>Nous vous remboursons au plus tard 14 jours après réception de votre décision, par le même moyen de paiement, sauf accord contraire.</li>
          <li>
            Si vous demandez expressément, sur support durable, que la prestation commence avant la fin du délai, vous restez libre de vous rétracter, mais vous devez payer la
            part de la prestation déjà fournie jusqu’à votre rétractation, proportionnellement au prix total.
          </li>
          <li>
            Vous perdez votre droit de rétractation si la prestation a été entièrement exécutée avant la fin du délai, après votre accord préalable exprès et votre
            reconnaissance de la perte de ce droit.
          </li>
        </UL>

        <H2 id="art8">8. Accès à l’application {c.brand}</H2>
        <P>
          Lorsque la prestation comprend un accès à l’application {c.brand}, cet accès est régi par les conditions générales d’utilisation (CGU), qui comprennent l’accord de
          sous-traitance des données personnelles. Sa durée et ses conditions de fin sont fixées dans le devis.
        </P>

        <H2 id="art9">9. Garanties légales (consommateurs)</H2>
        <P>
          Pour la partie numérique de la prestation (accès à l’application {c.brand}), vous bénéficiez de la garantie légale de conformité des contenus et services numériques
          pendant toute la durée de fourniture du service : en cas de défaut de conformité, vous pouvez obtenir la mise en conformité, ou à défaut une réduction du prix ou la
          résolution du contrat. Les prestations intellectuelles (conseil, formation) doivent être exécutées conformément au devis et avec soin. La garantie des vices cachés
          concerne la vente de biens et ne s’applique pas, aucun bien n’étant vendu.
        </P>

        <H2 id="art10">10. Responsabilité</H2>
        <UL>
          <li>{c.brand} est responsable des dommages directs résultant d’un manquement prouvé à ses obligations.</li>
          <li>
            Professionnels : la responsabilité de {c.brand} est limitée au montant payé au titre de la prestation concernée au cours des 12 derniers mois, sauf faute lourde ou
            dolosive ; les dommages indirects (perte de chiffre d’affaires, de clientèle, de données non sauvegardées) sont exclus.
          </li>
          <li>Consommateurs : les limitations ci-dessus ne s’appliquent pas lorsque la loi l’interdit.</li>
        </UL>

        <H2 id="art11">11. Propriété intellectuelle</H2>
        <P>
          {c.brand} reste propriétaire de son logiciel, de ses méthodes et de ses outils. Les livrables spécifiques au client (modèles de messages, paramétrages, documents)
          peuvent être librement utilisés par le client pour son activité. Professionnels : ce droit d’utilisation n’est transféré qu’après paiement complet du prix (réserve de
          propriété).
        </P>

        <H2 id="art12">12. Confidentialité et données personnelles</H2>
        <P>
          Chaque partie garde confidentielles les informations non publiques de l’autre. Les traitements de données personnelles sont décrits dans la politique de
          confidentialité ; pour les données des prospects du client, {c.brand} agit comme sous-traitant selon l’annexe des CGU.
        </P>

        <H2 id="art13">13. Durée et résiliation</H2>
        <P>
          La durée de chaque prestation figure au devis. En cas de manquement grave d’une partie non corrigé 15 jours après une mise en demeure écrite, l’autre partie peut résilier
          le contrat de plein droit. Les sommes correspondant aux prestations réalisées restent dues.
        </P>

        <H2 id="art14">14. Réclamations et médiation</H2>
        <P>Toute réclamation peut être adressée à {email}. Nous y répondons dans un délai de 15 jours.</P>
        <P>
          Consommateurs : si votre réclamation écrite n’a pas abouti, vous pouvez saisir gratuitement le médiateur de la consommation, dans un délai d’un an à compter de votre
          réclamation : {mediator}.
        </P>

        <H2 id="art15">15. Force majeure</H2>
        <P>Aucune partie n’est responsable d’un retard ou d’une inexécution causé par un événement de force majeure. Si l’empêchement dure plus de 60 jours, chaque partie peut résilier le contrat.</P>

        <H2 id="art16">16. Loi applicable et litiges</H2>
        <P>
          Les présentes CGV sont soumises au {c.governingLaw.fr} {v(null, "choix de la loi applicable à valider par un avocat", "governing law to validate with a lawyer")}.
          Consommateurs : ce choix ne vous prive pas de la protection des dispositions impératives de la loi de votre pays de résidence habituelle, et vous pouvez saisir les
          juridictions de votre domicile. Professionnels : à défaut d’accord amiable, tout litige relève de la compétence exclusive des tribunaux de{" "}
          {v(c.b2bCourt, "ville du tribunal compétent", "competent court")}.
        </P>

        <H2 id="annexe">Annexe — Formulaire de rétractation (consommateurs)</H2>
        <P>Veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous rétracter du contrat.</P>
        <div className="mt-3 rounded-lg border border-line bg-surface p-4 text-ink-700">
          <P>
            À l’attention de {v(c.legalName, "dénomination sociale", "company name")}, {v(c.address, "adresse", "address")}, {email} :
          </P>
          <P>Je vous notifie par la présente ma rétractation du contrat portant sur la prestation de services ci-dessous :</P>
          <UL>
            <li>Commandé le : ……………………</li>
            <li>Référence du devis : ……………………</li>
            <li>Nom du consommateur : ……………………</li>
            <li>Adresse du consommateur : ……………………</li>
            <li>Signature du consommateur (uniquement en cas de notification sur papier) : ……………………</li>
            <li>Date : ……………………</li>
          </UL>
        </div>
      </>
    );
  }

  return (
    <>
      <P>
        These terms of sale apply to the custom services of designing and setting up customer acquisition systems offered by {c.brand}. Some clauses apply only to{" "}
        <strong>consumer</strong> customers (individuals acting outside their trade or profession) or only to <strong>business</strong> customers; they are marked as such.
      </P>

      <H2 id="art1">1. Provider</H2>
      <P>
        {v(c.legalName, "dénomination sociale", "company name")}, {v(c.legalForm, "forme juridique", "legal form")} with a share capital of {v(c.shareCapital, "capital", "share capital")},
        registered office: {v(c.address, "adresse", "address")}, {c.country.en}, RCCM {v(c.rccm, "RCCM", "RCCM")}, Id. Nat. {v(c.idNat, "Id. Nat.", "Id. Nat.")}, NIF {v(c.nif, "NIF", "NIF")}.
        Contact: {email}{c.phone ? `, ${c.phone}` : ""}.
      </P>

      <H2 id="art2">2. Services</H2>
      <P>
        Depending on the quote, a service may include: an audit of how the customer handles enquiries, configuration of the {c.brand} application (pipeline, bilingual message
        templates, automations), user training, support and adjustments. The essential characteristics, scope, deliverables, schedule and price of each service are set out in the
        quote.
      </P>
      <P>{c.brand} has an obligation of means: commercial results (number of leads, conversion rate, revenue) depend on many external factors and are not guaranteed.</P>

      <H2 id="art3">3. Quote and order</H2>
      <UL>
        <li>Every service is covered by a detailed written quote, provided together with these terms on a durable medium (PDF by email).</li>
        <li>Unless stated otherwise, quotes are valid for 30 days.</li>
        <li>The contract is formed when the customer signs the quote (by hand or electronically), declaring that they have read and accepted these terms. A confirmation is sent by email.</li>
        <li>In case of conflict, the quote prevails over these terms, and these terms over any document of the customer.</li>
      </UL>

      <H2 id="art4">4. Prices</H2>
      <UL>
        <li>Prices are stated in the quote, in euros. For consumers, they include all taxes.</li>
        <li>Applicable VAT treatment: {v(null, "régime de TVA à valider avec un fiscaliste (OSS, autoliquidation…)", "VAT treatment to validate with a tax adviser")}.</li>
        <li>Any additional costs (travel, paid third-party tools) are only due if stated in the quote.</li>
      </UL>

      <H2 id="art5">5. Payment</H2>
      <UL>
        <li>Payment is made on invoice, by bank transfer or via PayPal. {c.brand} never receives your card details.</li>
        <li>The payment schedule (any deposit, balance) is set out in the quote.</li>
        <li>Consumers: no payment is required before the withdrawal period ends, unless you ask for the service to start earlier (section 7).</li>
        <li>
          Business customers: unless the quote sets a shorter term, invoices are payable within 30 days of their issue date. Late payment automatically triggers penalties equal to
          three times the legal interest rate and a fixed recovery fee of 40 euros, without prejudice to further compensation on proof. No discount is granted for early payment.
        </li>
      </UL>

      <H2 id="art6">6. Performance</H2>
      <P>
        Services are performed remotely, within the time frames set in the quote. The customer provides the necessary information and access in good time; any delay on its side
        postpones the schedule accordingly. Deliverables are deemed accepted unless written, reasoned objections are made within 8 days of delivery.
      </P>

      <H2 id="art7">7. Right of withdrawal (consumers)</H2>
      <UL>
        <li>You have 14 days from the conclusion of the contract to withdraw, without giving any reason and without penalty.</li>
        <li>To withdraw, send an unambiguous statement to {email} before the period expires, for example using the form in the annex.</li>
        <li>We refund you within 14 days of receiving your decision, using the same means of payment unless agreed otherwise.</li>
        <li>
          If you expressly request, on a durable medium, that the service start before the end of the period, you may still withdraw, but you must pay for the part of the service
          already provided until your withdrawal, in proportion to the total price.
        </li>
        <li>You lose your right of withdrawal if the service has been fully performed before the end of the period, with your prior express consent and acknowledgement that you lose this right.</li>
      </UL>

      <H2 id="art8">8. Access to the {c.brand} application</H2>
      <P>
        When the service includes access to the {c.brand} application, that access is governed by the terms of use, which include the personal data processing agreement. Its
        duration and end conditions are set out in the quote.
      </P>

      <H2 id="art9">9. Legal guarantees (consumers)</H2>
      <P>
        For the digital part of the service (access to the {c.brand} application), you benefit from the legal guarantee of conformity of digital content and services for the
        whole duration of supply: in case of non-conformity, you can obtain conformity or, failing that, a price reduction or termination of the contract. Intellectual services
        (advice, training) must be performed carefully and in line with the quote. The guarantee against hidden defects concerns the sale of goods and does not apply, as no goods
        are sold.
      </P>

      <H2 id="art10">10. Liability</H2>
      <UL>
        <li>{c.brand} is liable for direct damage resulting from a proven breach of its obligations.</li>
        <li>
          Business customers: {c.brand}’s liability is limited to the amount paid for the service concerned over the last 12 months, except in case of gross negligence or wilful
          misconduct; indirect damage (loss of revenue, customers, unsaved data) is excluded.
        </li>
        <li>Consumers: the above limitations do not apply where the law prohibits them.</li>
      </UL>

      <H2 id="art11">11. Intellectual property</H2>
      <P>
        {c.brand} remains the owner of its software, methods and tools. Customer-specific deliverables (message templates, configurations, documents) may be freely used by the
        customer for its business. Business customers: this right of use is only transferred after full payment of the price (retention of title).
      </P>

      <H2 id="art12">12. Confidentiality and personal data</H2>
      <P>
        Each party keeps the other’s non-public information confidential. Personal data processing is described in the privacy policy; for the customer’s lead data, {c.brand}
        acts as a processor under the annex to the terms of use.
      </P>

      <H2 id="art13">13. Term and termination</H2>
      <P>
        The term of each service is set out in the quote. If a party commits a serious breach that is not remedied within 15 days of a written notice, the other party may
        terminate the contract. Amounts for services already performed remain due.
      </P>

      <H2 id="art14">14. Complaints and mediation</H2>
      <P>Complaints can be sent to {email}. We reply within 15 days.</P>
      <P>
        Consumers: if your written complaint has not been resolved, you can refer the matter free of charge to the consumer mediator, within one year of your complaint: {mediator}.
      </P>

      <H2 id="art15">15. Force majeure</H2>
      <P>Neither party is liable for a delay or failure caused by force majeure. If the impediment lasts more than 60 days, either party may terminate the contract.</P>

      <H2 id="art16">16. Governing law and disputes</H2>
      <P>
        These terms are governed by {c.governingLaw.en} {v(null, "choix de la loi applicable à valider par un avocat", "governing law to validate with a lawyer")}. Consumers: this
        choice does not deprive you of the protection of the mandatory provisions of the law of your country of habitual residence, and you may bring proceedings before the
        courts of your place of residence. Business customers: failing an amicable settlement, any dispute falls under the exclusive jurisdiction of the courts of{" "}
        {v(c.b2bCourt, "ville du tribunal compétent", "competent court")}.
      </P>

      <H2 id="annex">Annex — Withdrawal form (consumers)</H2>
      <P>Complete and return this form only if you wish to withdraw from the contract.</P>
      <div className="mt-3 rounded-lg border border-line bg-surface p-4 text-ink-700">
        <P>To {v(c.legalName, "dénomination sociale", "company name")}, {v(c.address, "adresse", "address")}, {email}:</P>
        <P>I hereby give notice that I withdraw from my contract for the provision of the following service:</P>
        <UL>
          <li>Ordered on: ……………………</li>
          <li>Quote reference: ……………………</li>
          <li>Name of consumer: ……………………</li>
          <li>Address of consumer: ……………………</li>
          <li>Signature of consumer (only if this form is notified on paper): ……………………</li>
          <li>Date: ……………………</li>
        </UL>
      </div>
    </>
  );
}

