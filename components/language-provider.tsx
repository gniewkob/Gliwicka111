'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Language = 'pl' | 'en'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode
  initialLanguage: Language
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage)

  useEffect(() => {
    document.cookie = `lang=${language}; path=/; max-age=${60 * 60 * 24 * 365}`
  }, [language])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'pl' ? 'en' : 'pl'))
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

