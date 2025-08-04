export const navTranslations = {
  pl: {
    home: "Strona główna",
    properties: "Nieruchomości",
    about: "O nas",
    contact: "Kontakt",
  },
  en: {
    home: "Home",
    properties: "Properties",
    about: "About",
    contact: "Contact",
  },
} as const

export const backTranslations = {
  pl: "Powrót do strony głównej",
  en: "Back to homepage",
} as const

export type Language = keyof typeof navTranslations
