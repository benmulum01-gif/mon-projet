"use client";

import Script from "next/script";
import { integrations } from "@/config/integrations";
import { useConsent } from "./consent-provider";

/**
 * Loads third-party scripts ONLY for the purposes the visitor accepted.
 * Nothing is requested from these services before consent ("basic" consent
 * mode: Google tags are not loaded at all until accepted).
 */
export function ThirdPartyScripts() {
  const { choices } = useConsent();
  if (!choices) return null;
  const i = integrations;
  const googleIds = [choices.analytics ? i.googleAnalyticsId : null, choices.advertising ? i.googleAdsId : null].filter(Boolean) as string[];

  return (
    <>
      {googleIds.length ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleIds[0]}`} strategy="afterInteractive" />
          <Script id="google-tag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('consent','update',{analytics_storage:${choices.analytics ? "'granted'" : "'denied'"},ad_storage:${choices.advertising ? "'granted'" : "'denied'"},ad_user_data:${choices.advertising ? "'granted'" : "'denied'"},ad_personalization:${choices.advertising ? "'granted'" : "'denied'"}});
gtag('js',new Date());
${googleIds.map((id) => `gtag('config','${id}',{cookie_expires:33696000});`).join("\n")}`}
          </Script>
        </>
      ) : null}

      {choices.advertising && i.metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${i.metaPixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}

      {choices.advertising && i.linkedinPartnerId ? (
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`window._linkedin_partner_id='${i.linkedinPartnerId}';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';s.parentNode.insertBefore(b,s);})(window.lintrk);`}
        </Script>
      ) : null}

      {choices.advertising && i.tiktokPixelId ? (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
ttq.load('${i.tiktokPixelId}');ttq.page();}(window,document,'ttq');`}
        </Script>
      ) : null}

      {choices.chat && i.tawkPropertyId ? (
        <Script src={`https://embed.tawk.to/${i.tawkPropertyId}/${i.tawkWidgetId}`} strategy="lazyOnload" />
      ) : null}
    </>
  );
}
