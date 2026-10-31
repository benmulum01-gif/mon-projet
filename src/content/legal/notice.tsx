import { company } from "@/config/company";
import type { Locale } from "@/i18n/config";
import { H2, P, UL, V } from "./shared";

export function LegalNotice({ locale }: { locale: Locale }) {
  const c = company;
  const v = (value: string | null, fr: string, en: string) => <V value={value} label={{ fr, en }} locale={locale} />;

  if (locale === "fr") {
    return (
      <>
        <H2 id="editeur">Éditeur du site</H2>
        <UL>
          <li>Dénomination sociale : {v(c.legalName, "dénomination sociale", "company name")} (marque « {c.brand} »)</li>
          <li>Forme juridique : {v(c.legalForm, "forme juridique", "legal form")}</li>
          <li>Capital social : {v(c.shareCapital, "capital social", "share capital")}</li>
          <li>Siège social : {v(c.address, "adresse du siège", "registered office")}, {c.country.fr}</li>
          <li>Registre du Commerce et du Crédit Mobilier (RCCM) : {v(c.rccm, "numéro RCCM et ville", "RCCM number and city")}</li>
          <li>Identification nationale (Id. Nat.) : {v(c.idNat, "Id. Nat.", "Id. Nat.")}</li>
          <li>Numéro d’impôt (NIF) : {v(c.nif, "NIF", "tax number")}</li>
          {c.euVatNumber ? <li>Numéro de TVA dans l’Union européenne : {c.euVatNumber}</li> : null}
          <li>E-mail : {v(c.email, "e-mail de contact", "contact email")}</li>
          {c.phone ? <li>Téléphone : {c.phone}</li> : null}
        </UL>

        <H2 id="directeur">Directeur de la publication</H2>
        <P>{v(c.publicationDirector, "nom du directeur de la publication", "publication director")}</P>

        <H2 id="representant">Représentant dans l’Union européenne</H2>
        <P>
          {c.brand} étant établie hors de l’Union européenne, elle a désigné un représentant au sens de l’article 27 du RGPD :{" "}
          {v(c.euRepresentative.name, "nom du représentant UE", "EU representative")}, {v(c.euRepresentative.address, "adresse", "address")},{" "}
          {v(c.euRepresentative.email, "e-mail", "email")}.
        </P>

        <H2 id="hebergement">Hébergement</H2>
        <UL>
          <li>
            Site : {v(c.host.name, "nom de l’hébergeur", "host name")}, {v(c.host.address, "adresse de l’hébergeur", "host address")}, {v(c.host.phone, "téléphone de l’hébergeur", "host phone")}
          </li>
          <li>Base de données : Supabase Inc. (adresse indiquée dans son contrat : {v(null, "adresse de Supabase", "Supabase address")}) — région d’hébergement des données : {v(c.databaseRegion, "région du projet Supabase", "Supabase project region")}</li>
        </UL>

        <H2 id="propriete">Propriété intellectuelle</H2>
        <P>
          Les textes, l’identité visuelle, l’interface et le logiciel {c.brand} sont protégés par le droit d’auteur et le droit des marques. Toute
          reproduction ou réutilisation sans autorisation écrite est interdite, sauf exceptions prévues par la loi.
        </P>

        <H2 id="signalement">Signaler un contenu</H2>
        <P>Pour signaler un contenu illicite ou une erreur, écrivez à {v(c.email, "e-mail de contact", "contact email")} en précisant l’adresse de la page et le motif.</P>

        <H2 id="autres">Autres informations</H2>
        <P>
          Le traitement de vos données personnelles est décrit dans la politique de confidentialité, l’utilisation des cookies dans la politique de cookies, et les
          conditions de nos prestations dans les conditions générales de vente.
        </P>
      </>
    );
  }

  return (
    <>
      <H2 id="publisher">Website publisher</H2>
      <UL>
        <li>Company name: {v(c.legalName, "dénomination sociale", "company name")} (brand “{c.brand}”)</li>
        <li>Legal form: {v(c.legalForm, "forme juridique", "legal form")}</li>
        <li>Share capital: {v(c.shareCapital, "capital social", "share capital")}</li>
        <li>Registered office: {v(c.address, "adresse du siège", "registered office")}, {c.country.en}</li>
        <li>Trade and Personal Property Credit Register (RCCM): {v(c.rccm, "numéro RCCM et ville", "RCCM number and city")}</li>
        <li>National identification (Id. Nat.): {v(c.idNat, "Id. Nat.", "Id. Nat.")}</li>
        <li>Tax number (NIF): {v(c.nif, "NIF", "tax number")}</li>
        {c.euVatNumber ? <li>EU VAT number: {c.euVatNumber}</li> : null}
        <li>Email: {v(c.email, "e-mail de contact", "contact email")}</li>
        {c.phone ? <li>Phone: {c.phone}</li> : null}
      </UL>

      <H2 id="director">Publication director</H2>
      <P>{v(c.publicationDirector, "nom du directeur de la publication", "publication director")}</P>

      <H2 id="representative">Representative in the European Union</H2>
      <P>
        As {c.brand} is established outside the European Union, it has appointed a representative under Article 27 GDPR:{" "}
        {v(c.euRepresentative.name, "nom du représentant UE", "EU representative")}, {v(c.euRepresentative.address, "adresse", "address")},{" "}
        {v(c.euRepresentative.email, "e-mail", "email")}.
      </P>

      <H2 id="hosting">Hosting</H2>
      <UL>
        <li>Website: {v(c.host.name, "nom de l’hébergeur", "host name")}, {v(c.host.address, "adresse de l’hébergeur", "host address")}, {v(c.host.phone, "téléphone de l’hébergeur", "host phone")}</li>
        <li>Database: Supabase Inc. (address stated in its contract: {v(null, "adresse de Supabase", "Supabase address")}) — data hosting region: {v(c.databaseRegion, "région du projet Supabase", "Supabase project region")}</li>
      </UL>

      <H2 id="ip">Intellectual property</H2>
      <P>
        The texts, visual identity, interface and {c.brand} software are protected by copyright and trademark law. Any reproduction or reuse without written
        permission is prohibited, except where the law allows it.
      </P>

      <H2 id="report">Reporting content</H2>
      <P>To report unlawful content or an error, write to {v(c.email, "e-mail de contact", "contact email")}, stating the page address and the reason.</P>

      <H2 id="other">Other information</H2>
      <P>How we process personal data is explained in the privacy policy, our use of cookies in the cookie policy, and the conditions of our services in the terms of sale.</P>
    </>
  );
}
