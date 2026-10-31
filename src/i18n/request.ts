import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "./config";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const candidate = locale ?? (await requestLocale);
  const resolved = isLocale(candidate) ? candidate : defaultLocale;

  return {
    locale: resolved,
    messages: (await import(`../../messages/${resolved}.json`)).default,
    // Missing keys are a bug: surface them in development, degrade gracefully in production.
    onError(error) {
      if (process.env.NODE_ENV !== "production") console.error(error.message);
    },
    getMessageFallback({ namespace, key }) {
      return [namespace, key].filter(Boolean).join(".");
    },
  };
});
