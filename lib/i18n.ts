import { cookies } from "next/headers"

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

export const messages = {
  form: {
    validationError: {
      pl: "Formularz zawiera błędy. Sprawdź wprowadzone dane.",
      en: "The form contains errors. Check your input.",
    },
    success: {
      pl: "Formularz został wysłany pomyślnie. Skontaktujemy się z Tobą wkrótce.",
      en: "The form was sent successfully. We will contact you soon.",
    },
    serverError: {
      pl: "Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.",
      en: "An error occurred while sending the form. Please try again.",
    },
  },
  admin: {
    notFound: {
      pl: "Nie znaleziono zgłoszenia",
      en: "Submission not found",
    },
  },
} as const

export type Language = keyof typeof navTranslations

export function getCurrentLanguage(): Language {
  const lang = cookies().get("lang")?.value
  return lang === "en" ? "en" : "pl"
}
