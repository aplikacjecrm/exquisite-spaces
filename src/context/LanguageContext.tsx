"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { pl } from "../i18n/pl";
import { de } from "../i18n/de";
import { fr } from "../i18n/fr";
import { en } from "../i18n/en";
import { nl } from "../i18n/nl";
import type { Dict } from "../i18n/pl";

export type Lang = "pl" | "de" | "fr" | "en" | "nl";

const dicts: Record<Lang, Dict> = { pl, de, fr, en, nl };

const STORAGE_KEY = "es_lang";

function detectLang(): Lang {
  if (typeof window === "undefined") return "pl";
  const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (saved && saved in dicts) return saved;
  const browser = navigator.language.slice(0, 2).toLowerCase();
  if (browser in dicts) return browser as Lang;
  return "pl";
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "pl",
  setLang: () => {},
  t: pl,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pl");

  useEffect(() => {
    setLangState(detectLang());
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dicts[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const LANG_META: Record<Lang, { flag: string; label: string }> = {
  pl: { flag: "🇵🇱", label: "PL" },
  de: { flag: "🇩🇪", label: "DE" },
  fr: { flag: "🇫🇷", label: "FR" },
  en: { flag: "🇬🇧", label: "EN" },
  nl: { flag: "🇳🇱", label: "NL" },
};
