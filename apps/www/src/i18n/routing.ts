import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    "en", // English
    "id", // Indonesian
    "jv", // Javanese
    "es", // Spanish
    "fr", // French
    "de", // German
    "pt", // Portuguese
    "ru", // Russian
    "ja", // Japanese
    "ko", // Korean
    "zh", // Chinese (Simplified)
    "ar", // Arabic
    "hi", // Hindi
  ],

  // Used when no locale matches
  defaultLocale: "en",
  localePrefix: "as-needed",
});
