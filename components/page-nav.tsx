"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Globe, Menu, X, ChevronDown } from "lucide-react"
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

  // Localized labels for the Offer dropdown so nav is consistent on all pages
  const labels = language === "pl"
    ? {
        offer: "Nasza oferta",
        vo: "Biuro wirtualne",
        cw: "Coworking i biura",
        mr: "Sale spotkań",
        ad: "Reklama zewnętrzna",
        sd: "Oferty specjalne",
      }
    : {
        offer: "Our offer",
        vo: "Virtual office",
        cw: "Coworking & offices",
        mr: "Meeting rooms",
        ad: "Outdoor advertising",
        sd: "Special deals",
      };

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
            />
          </Link>
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className={linkClass("home")}>
              {nav.home}
            </Link>
            {/* Offer dropdown */}
            <div className="relative group">
              <button className="text-slate-700 hover:text-teal-600 font-medium transition-colors flex items-center">
                {labels.offer}
                <ChevronDown className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <Link href="/#virtual-office" className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded">{labels.vo}</Link>
                  <Link href="/#coworking" className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded">{labels.cw}</Link>
                  <Link href="/#meeting-rooms" className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded">{labels.mr}</Link>
                  <Link href="/#advertising" className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded">{labels.ad}</Link>
                  <Link href="/#special-deals" className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded">{labels.sd}</Link>
                </div>
              </div>
            </div>
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
              <Link href="/#virtual-office" className="text-slate-700 hover:text-teal-600 font-medium pl-4">{labels.vo}</Link>
              <Link href="/#coworking" className="text-slate-700 hover:text-teal-600 font-medium pl-4">{labels.cw}</Link>
              <Link href="/#meeting-rooms" className="text-slate-700 hover:text-teal-600 font-medium pl-4">{labels.mr}</Link>
              <Link href="/#advertising" className="text-slate-700 hover:text-teal-600 font-medium pl-4">{labels.ad}</Link>
              <Link href="/#special-deals" className="text-slate-700 hover:text-teal-600 font-medium pl-4">{labels.sd}</Link>
              <Link href="/properties" className="text-slate-700 hover:text-teal-600 font-medium">{nav.properties}</Link>
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

