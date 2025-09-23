"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Globe, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";

interface NavTranslations {
  home: string;
  properties: string;
  about: string;
  contact: string;
}

interface PageNavProps {
  nav: NavTranslations;
  current?: "home" | "properties" | "about" | "contact";
}

export function PageNav({ nav, current }: PageNavProps) {
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = (key: keyof NavTranslations) =>
    current === key
      ? "text-teal-600 font-medium"
      : "text-slate-700 hover:text-teal-600 font-medium";

  return (
    <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="Gliwicka 111 — Property Management"
          >
            <Image
              src="/gliwicka111.png"
              alt="Gliwicka 111 — Property Management"
              width={200}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={linkClass("home")}>
              {nav.home}
            </Link>
            <Link href="/properties" className={linkClass("properties")}>
              {nav.properties}
            </Link>
            <Link href="/about" className={linkClass("about")}>
              {nav.about}
            </Link>
            <Link href="/contact" className={linkClass("contact")}>
              {nav.contact}
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 bg-transparent"
            >
              <Globe className="w-4 h-4" />
              <span>{language.toUpperCase()}</span>
            </Button>
          </nav>
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 bg-transparent"
            >
              <Globe className="w-4 h-4" />
              <span>{language.toUpperCase()}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-slate-700 hover:text-teal-600 font-medium">
                {nav.home}
              </Link>
              <Link
                href="/properties"
                className="text-slate-700 hover:text-teal-600 font-medium"
              >
                {nav.properties}
              </Link>
              <Link
                href="/about"
                className={linkClass("about")}
              >
                {nav.about}
              </Link>
              <Link
                href="/contact"
                className="text-slate-700 hover:text-teal-600 font-medium"
              >
                {nav.contact}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default PageNav;

