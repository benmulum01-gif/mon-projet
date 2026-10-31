import { company } from "@/config/company";
import type { Locale } from "@/i18n/config";
import { trackers } from "./data";
import { H2, P, Table, UL } from "./shared";
import { ManageCookiesLink } from "./manage-cookies-link";

const categoryLabel = {
  necessary: { fr: "Strictement nécessaire", en: "Strictly necessary" },
  analytics: { fr: "Mesure d’audience", en: "Audience measurement" },
  advertising: { fr: "Publicité", en: "Advertising" },
  media: { fr: "Vidéos et prise de rendez-vous", en: "Videos and appointment booking" },
  chat: { fr: "Discussion en direct", en: "Live chat" },
};

export function CookiePolicy({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  const table = (
    <Table
      caption={fr ? "Liste des cookies et traceurs" : "List of cookies and trackers"}
      head={fr ? ["Cookie", "Émetteur", "Catégorie", "Finalité", "Durée"] : ["Cookie", "Set by", "Category", "Purpose", "Lifetime"]}
      rows={trackers.map((t) => [<code key="n" className="break-all">{t.name}</code>, t.provider, categoryLabel[t.category][locale], t.purpose[locale], t.duration[locale]])}
    />
  );

  if (fr) {
    return (
      <>
        <P>
          Un cookie est un petit fichier déposé sur votre appareil. Cette page liste les cookies et traceurs utilisés sur le site {company.brand}, qui les dépose, pourquoi et
          pour combien de temps.
        </P>
        <H2 id="regles">Nos règles</H2>
        <UL>
          <li>Les cookies strictement nécessaires (connexion, langue, mémorisation de vos choix) sont déposés sans consentement.</li>
          <li>Tous les autres ne sont déposés qu’après votre accord, finalité par finalité. Avant votre choix, aucun script de ces services n’est chargé.</li>
          <li>« Tout refuser » est aussi simple que « Tout accepter ». Refuser n’a aucune conséquence sur votre accès au site.</li>
          <li>Votre choix est conservé 6 mois, puis nous vous le redemandons.</li>
          <li>Les traceurs publicitaires et de mesure ne sont jamais chargés dans l’espace connecté de l’application.</li>
        </UL>
        <H2 id="liste">Liste des cookies</H2>
        {table}
        <P>Les services tiers (Google, Meta, LinkedIn, TikTok, Calendly, Tawk.to) peuvent aussi déposer des cookies sur leurs propres domaines, selon leurs politiques.</P>
        <H2 id="gerer">Modifier ou retirer votre consentement</H2>
        <P>Vous pouvez changer d’avis à tout moment, aussi simplement que vous avez donné votre accord :</P>
        <P><ManageCookiesLink label="Modifier mes choix de cookies" /></P>
        <P>Ce lien est aussi présent en bas de chaque page (« Gérer mes cookies »). Quand vous retirez votre accord, nous supprimons les cookies concernés de notre domaine et rechargeons la page. Vous pouvez également bloquer les cookies dans les réglages de votre navigateur.</P>
      </>
    );
  }

  return (
    <>
      <P>A cookie is a small file stored on your device. This page lists the cookies and trackers used on the {company.brand} website, who sets them, why and for how long.</P>
      <H2 id="rules">Our rules</H2>
      <UL>
        <li>Strictly necessary cookies (sign-in, language, storing your choices) are set without consent.</li>
        <li>All others are only set after you agree, purpose by purpose. Before you choose, no script from these services is loaded.</li>
        <li>“Reject all” is as simple as “Accept all”. Refusing has no effect on your access to the site.</li>
        <li>Your choice is kept for 6 months, after which we ask again.</li>
        <li>Advertising and measurement trackers are never loaded in the signed-in application.</li>
      </UL>
      <H2 id="list">List of cookies</H2>
      {table}
      <P>Third-party services (Google, Meta, LinkedIn, TikTok, Calendly, Tawk.to) may also set cookies on their own domains, under their own policies.</P>
      <H2 id="manage">Changing or withdrawing your consent</H2>
      <P>You can change your mind at any time, as easily as you gave your consent:</P>
      <P><ManageCookiesLink label="Change my cookie choices" /></P>
      <P>This link is also at the bottom of every page (“Manage cookies”). When you withdraw consent, we delete the related cookies from our domain and reload the page. You can also block cookies in your browser settings.</P>
    </>
  );
}
