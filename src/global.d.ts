import type messages from "../messages/en.json";
import type { Locale } from "./i18n/config";

// English is the reference dictionary: every key used in code must exist there,
// and scripts/check-i18n.mjs verifies French has exactly the same keys.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
