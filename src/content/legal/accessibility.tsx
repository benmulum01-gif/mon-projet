import { company } from "@/config/company";
import type { Locale } from "@/i18n/config";
import { H2, P, UL, V } from "./shared";

export function AccessibilityStatement({ locale }: { locale: Locale }) {
  const c = company;
  const email = <V value={c.email} label={{ fr: "e-mail de contact", en: "contact email" }} locale={locale} />;

  if (locale === "fr") {
    return (
      <>
        <P>
          {c.brand} s’engage à rendre son site et son application accessibles, conformément à la directive (UE) 2019/882 (European Accessibility Act) et au référentiel
          général d’amélioration de l’accessibilité (RGAA), qui reprend les critères WCAG 2.1 de niveau AA. Cette déclaration s’applique au site public et à l’application {c.brand}.
        </P>
        <H2 id="etat">État de conformité</H2>
        <P>
          Le site est <strong>partiellement conforme</strong> au RGAA. Aucun audit complet par un organisme indépendant n’a encore été réalisé : la conformité totale ne peut donc
          pas être déclarée.
        </P>
        <H2 id="mesures">Mesures déjà prises</H2>
        <UL>
          <li>langue de chaque page déclarée (français ou anglais) et changement de langue sans perte de contexte ;</li>
          <li>structure sémantique (en-tête, navigation, contenu principal, pied de page), un seul titre de niveau 1 par page, lien d’évitement ;</li>
          <li>navigation complète au clavier, focus visible ;</li>
          <li>chaque champ de formulaire a une étiquette, les champs obligatoires et les erreurs sont signalés en texte ;</li>
          <li>contrastes conformes au niveau AA, informations jamais transmises par la seule couleur ;</li>
          <li>mises en page adaptées aux mobiles et au zoom, sans défilement horizontal ;</li>
          <li>contrôles automatisés (axe-core) intégrés aux tests sur toutes les pages, en français et en anglais.</li>
        </UL>
        <H2 id="non-conforme">Contenus non accessibles ou non vérifiés</H2>
        <UL>
          <li>les contenus de services tiers (calendrier Calendly, discussion Tawk.to, vidéos YouTube), dont l’accessibilité dépend de leurs éditeurs ;</li>
          <li>les vidéos éventuelles devront être sous-titrées avant publication ;</li>
          <li>la compatibilité avec les lecteurs d’écran n’a pas encore été testée manuellement de façon exhaustive.</li>
        </UL>
        <H2 id="etablissement">Établissement de cette déclaration</H2>
        <P>Déclaration établie le {c.legalUpdatedAt}, sur la base de contrôles automatisés et manuels réalisés avec Chromium sur ordinateur, tablette et mobile.</P>
        <H2 id="contact">Signaler un problème</H2>
        <P>Si vous ne pouvez pas accéder à un contenu ou à un service, écrivez-nous à {email} : nous vous proposerons une alternative accessible et corrigerons le problème.</P>
        <H2 id="recours">Voies de recours</H2>
        <P>
          Si vous n’obtenez pas de réponse satisfaisante, vous pouvez saisir l’autorité de surveillance du marché de votre pays. En France : le Défenseur des droits
          (www.defenseurdesdroits.fr) ou la DGCCRF pour les services soumis à l’European Accessibility Act.
        </P>
      </>
    );
  }

  return (
    <>
      <P>
        {c.brand} is committed to making its website and application accessible, in line with Directive (EU) 2019/882 (European Accessibility Act) and the WCAG 2.1 level AA
        criteria. This statement applies to the public website and the {c.brand} application.
      </P>
      <H2 id="status">Compliance status</H2>
      <P>
        The site is <strong>partially compliant</strong>. No full audit by an independent body has been carried out yet, so full compliance cannot be declared.
      </P>
      <H2 id="measures">Measures already taken</H2>
      <UL>
        <li>the language of each page is declared (English or French), and switching language keeps the context;</li>
        <li>semantic structure (header, navigation, main content, footer), a single level-1 heading per page, skip link;</li>
        <li>full keyboard navigation with visible focus;</li>
        <li>every form field has a label; required fields and errors are announced in text;</li>
        <li>AA-level contrast; information is never conveyed by colour alone;</li>
        <li>layouts adapted to mobile and zoom, without horizontal scrolling;</li>
        <li>automated checks (axe-core) run in the tests on every page, in English and French.</li>
      </UL>
      <H2 id="non-compliant">Content not accessible or not yet verified</H2>
      <UL>
        <li>third-party content (Calendly calendar, Tawk.to chat, YouTube videos), whose accessibility depends on their providers;</li>
        <li>any videos must be captioned before publication;</li>
        <li>compatibility with screen readers has not yet been fully tested manually.</li>
      </UL>
      <H2 id="preparation">Preparation of this statement</H2>
      <P>Statement prepared on {c.legalUpdatedAt}, based on automated and manual checks performed with Chromium on desktop, tablet and mobile.</P>
      <H2 id="feedback">Reporting a problem</H2>
      <P>If you cannot access some content or a service, write to {email}: we will offer an accessible alternative and fix the problem.</P>
      <H2 id="enforcement">Enforcement</H2>
      <P>If you do not receive a satisfactory answer, you can contact the market surveillance authority of your country.</P>
    </>
  );
}
