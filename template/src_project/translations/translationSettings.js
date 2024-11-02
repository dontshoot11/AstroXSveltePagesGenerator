import { createTranslationManager } from "./translationManager";
import en from "./en.json";
import es from "./es.json";

const langs = {
  en: en,
  es: es,
};

export const getLangSettings = (url) => {
  return createTranslationManager(url, langs);
};
