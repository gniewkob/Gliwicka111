'use server'

import { cookies } from "next/headers";
import type { Language } from "./i18n";

export async function getCurrentLanguage(): Promise<Language> {
  const lang = cookies().get("lang")?.value;
  return lang === "en" ? "en" : "pl";
}

