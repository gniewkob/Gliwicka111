"use server";

import { cookies } from "next/headers";
import type { Language } from "./i18n";

/**
 * Reads the `lang` cookie and returns the current interface language.
 *
 * This server action is typically invoked within other server functions to
 * determine which set of localized messages should be used.
 *
 * @returns {Promise<Language>} The active language code, falling back to Polish
 * if no cookie is present or it contains an unknown value.
 */
export async function getCurrentLanguage(): Promise<Language> {
  const lang = cookies().get("lang")?.value;
  return lang === "en" ? "en" : "pl";
}
