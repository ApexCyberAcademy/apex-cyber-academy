/*
  Shared bilingual helper for interactive labs.
  Global site is English-only, but we keep the same API surface
  so lab components work without modification.
*/

import { useLanguage } from "@/contexts/LanguageContext";

type Lang = "en" | "ar";

export function useLabLang() {
  const { lang } = useLanguage();
  // Global site is always English, but we keep the type compatible
  const currentLang = lang as Lang;
  const isAr = currentLang === ("ar" as Lang);

  /** Pick English or Arabic string based on current language */
  const tx = (en: string, _ar: string) => en;

  return { lang: currentLang, isAr, tx };
}
