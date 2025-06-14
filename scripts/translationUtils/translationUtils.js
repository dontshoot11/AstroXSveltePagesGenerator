export function getCurrentLang(defaultLang = "en") {
  // works in Astro context
  if (globalThis.AstroUrl) {
    const supportedLanguages = [
      "aa", // Afar
      "ab", // Abkhazian
      "af", // Afrikaans
      "ak", // Akan
      "am", // Amharic
      "an", // Aragonese
      "ar", // Arabic
      "as", // Assamese
      "av", // Avaric
      "ay", // Aymara
      "az", // Azerbaijani
      "ba", // Bashkir
      "be", // Belarusian
      "bg", // Bulgarian
      "bh", // Bihari
      "bi", // Bislama
      "bm", // Bambara
      "bn", // Bengali
      "bo", // Tibetan
      "br", // Breton
      "bs", // Bosnian
      "ca", // Catalan
      "ce", // Chechen
      "ch", // Chamorro
      "co", // Corsican
      "cr", // Cree
      "cs", // Czech
      "cu", // Church Slavonic
      "cv", // Chuvash
      "cy", // Welsh
      "da", // Danish
      "de", // German
      "dz", // Dzongkha
      "ee", // Ewe
      "el", // Greek
      "en", // English
      "eo", // Esperanto
      "es", // Spanish
      "et", // Estonian
      "eu", // Basque
      "fa", // Persian
      "ff", // Fulah
      "fi", // Finnish
      "fj", // Fijian
      "fo", // Faroese
      "fr", // French
      "fy", // Frisian
      "ga", // Irish
      "gd", // Scottish Gaelic
      "gl", // Galician
      "gn", // Guarani
      "gu", // Gujarati
      "gv", // Manx
      "ha", // Hausa
      "he", // Hebrew
      "hi", // Hindi
      "ho", // Hiri Motu
      "hr", // Croatian
      "ht", // Haitian Creole
      "hu", // Hungarian
      "hy", // Armenian
      "hz", // Herero
      "ia", // Interlingua
      "id", // Indonesian
      "ie", // Interlingue
      "ig", // Igbo
      "ii", // Sichuan Yi
      "ik", // Inupiaq
      "io", // Ido
      "is", // Icelandic
      "it", // Italian
      "iu", // Inuktitut
      "ja", // Japanese
      "jv", // Javanese
      "ka", // Georgian
      "kk", // Kazakh
      "kl", // Kalaallisut
      "km", // Khmer
      "kn", // Kannada
      "ko", // Korean
      "kr", // Kanuri
      "ks", // Kashmiri
      "ku", // Kurdish
      "kv", // Komi
      "kw", // Cornish
      "ky", // Kyrgyz
      "la", // Latin
      "lb", // Luxembourgish
      "lo", // Lao
      "lt", // Lithuanian
      "lu", // Luba-Katanga
      "lv", // Latvian
      "mg", // Malagasy
      "mh", // Marshallese
      "mk", // Macedonian
      "ml", // Malayalam
      "mn", // Mongolian
      "mr", // Marathi
      "ms", // Malay
      "mt", // Maltese
      "my", // Burmese
      "na", // Nauru
      "nb", // Norwegian Bokmål
      "nd", // Northern Ndebele
      "ne", // Nepali
      "nl", // Dutch
      "nn", // Norwegian Nynorsk
      "no", // Norwegian
      "nr", // Southern Ndebele
      "nv", // Navajo
      "ny", // Chichewa
      "oc", // Occitan
      "om", // Oromo
      "or", // Oriya
      "os", // Ossetian
      "pa", // Punjabi
      "pi", // Pali
      "pl", // Polish
      "ps", // Pashto
      "pt", // Portuguese
      "qu", // Quechua
      "rm", // Romansh
      "rn", // Rundi
      "ro", // Romanian
      "ru", // Russian
      "rw", // Kinyarwanda
      "se", // Northern Sami
      "sg", // Sango
      "si", // Sinhala
      "sk", // Slovak
      "sl", // Slovenian
      "sm", // Samoan
      "sn", // Shona
      "so", // Somali
      "sq", // Albanian
      "sr", // Serbian
      "ss", // Swati
      "st", // Sotho
      "su", // Sundanese
      "sv", // Swedish
      "sw", // Swahili
      "ta", // Tamil
      "te", // Telugu
      "tg", // Tajik
      "th", // Thai
      "ti", // Tigrinya
      "tk", // Turkmen
      "tl", // Tagalog
      "tn", // Tswana
      "to", // Tongan
      "tr", // Turkish
      "ts", // Tsonga
      "tt", // Tatar
      "tw", // Twi
      "ty", // Tahitian
      "ug", // Uyghur
      "uk", // Ukrainian
      "ur", // Urdu
      "uz", // Uzbek
      "ve", // Venda
      "vi", // Vietnamese
      "wa", // Walloon
      "wo", // Wolof
      "xh", // Xhosa
      "yi", // Yiddish
      "zu", // Zulu
    ];

    const regex = new RegExp(
      `\/(${supportedLanguages.join("|")})(?:[-_][a-zA-Z]{2,3})?(\/|$)`,
      "i"
    );

    const match = globalThis.AstroUrl.pathname.match(regex);
    const locale = match ? match[1] : defaultLang;

    return locale;
  }
  if (typeof document !== "undefined" && document?.documentElement?.lang) {
    // works in browser context
    return document.documentElement.lang;
  }

  return defaultLang;
}

export const getTranslate = (key, defaultMessage) => {
  const lang = getCurrentLang();
  if (!lang) {
    return defaultMessage;
  }
  let t;
  if (typeof window !== "undefined") {
    t = JSON.parse(document.documentElement.dataset.pageTranslations);
  } else {
    t = globalThis.translations[lang];
  }

  if (!t) {
    return defaultMessage;
  }

  const valuesSet = new Set(Object.values(t));

  if (valuesSet.has(key)) {
    return key;
  }

  return key && t[key] ? t[key] : defaultMessage;
};
