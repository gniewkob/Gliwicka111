"use client";

import type React from "react";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  Globe,
  ArrowLeft,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Checkbox,
  Label,
} from "@/components/ui";
import Link from "next/link";
import { navTranslations, backTranslations } from "@/lib/i18n";
import PageNav from "@/components/page-nav";

const translations = {
  pl: {
    nav: navTranslations.pl,
    header: {
      title: "Skontaktuj się z nami",
      subtitle: "Jesteśmy tutaj, aby pomóc",
      description:
        "Masz pytania dotyczące naszych nieruchomości? Chcesz umówić się na oględziny? Skontaktuj się z nami - odpowiemy na wszystkie pytania.",
    },
    form: {
      title: "Wyślij wiadomość",
      name: "Imię i nazwisko",
      namePlaceholder: "Wprowadź swoje imię i nazwisko",
      email: "Adres e-mail",
      emailPlaceholder: "twoj@email.pl",
      phone: "Telefon (opcjonalnie)",
      phonePlaceholder: "+48 123 456 789",
      subject: "Temat",
      subjectPlaceholder: "Wybierz temat zapytania",
      message: "Wiadomość",
      messagePlaceholder: "Opisz swoje zapytanie...",
      rodo: "Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z RODO w celu odpowiedzi na zapytanie.",
      marketing:
        "Wyrażam zgodę na otrzymywanie informacji marketingowych (opcjonalnie).",
      send: "Wyślij wiadomość",
      sending: "Wysyłanie...",
      success: "Wiadomość została wysłana!",
      error: "Wystąpił błąd. Spróbuj ponownie.",
      subjects: [
        "Wynajem hali 110m²",
        "Wynajem biura 80m²",
        "Wynajem placu 500m²",
        "Reklama mobilna",
        "Zarządzanie nieruchomością",
        "Inne",
      ],
    },
    contact: {
      title: "Informacje kontaktowe",
      address: "Adres",
      phone: "Telefon",
      email: "E-mail",
      hours: "Godziny pracy",
      hoursValue: "Pon-Pt: 8:00-17:00",
      directions: "Dojazd",
    },
    map: {
      title: "Nasza lokalizacja",
      description:
        "Znajdziesz nas przy ulicy Gliwickiej 111 w Tarnowskich Górach. Doskonała lokalizacja z łatwym dostępem komunikacyjnym.",
    },
    back: backTranslations.pl,
  },
  en: {
    nav: navTranslations.en,
    header: {
      title: "Contact Us",
      subtitle: "We are here to help",
      description:
        "Do you have questions about our properties? Want to schedule a viewing? Contact us - we will answer all your questions.",
    },
    form: {
      title: "Send Message",
      name: "Full Name",
      namePlaceholder: "Enter your full name",
      email: "Email Address",
      emailPlaceholder: "your@email.com",
      phone: "Phone (optional)",
      phonePlaceholder: "+48 123 456 789",
      subject: "Subject",
      subjectPlaceholder: "Choose inquiry subject",
      message: "Message",
      messagePlaceholder: "Describe your inquiry...",
      rodo: "I consent to the processing of my personal data in accordance with GDPR for the purpose of responding to the inquiry.",
      marketing: "I consent to receiving marketing information (optional).",
      send: "Send Message",
      sending: "Sending...",
      success: "Message sent successfully!",
      error: "An error occurred. Please try again.",
      subjects: [
        "Hall rental 110m²",
        "Office rental 80m²",
        "Area rental 500m²",
        "Mobile advertising",
        "Property management",
        "Other",
      ],
    },
    contact: {
      title: "Contact Information",
      address: "Address",
      phone: "Phone",
      email: "Email",
      hours: "Business Hours",
      hoursValue: "Mon-Fri: 8:00-17:00",
      directions: "Directions",
    },
    map: {
      title: "Our Location",
      description:
        "You can find us at Gliwicka 111 street in Tarnowskie Góry. Excellent location with easy transportation access.",
    },
    back: backTranslations.en,
  },
};

export default function ContactPage() {
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    rodo: false,
    marketing: false,
  });
  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const t = translations[language];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.rodo) {
      alert(
        language === "pl"
          ? "Musisz wyrazić zgodę na przetwarzanie danych osobowych."
          : "You must consent to personal data processing.",
      );
      return;
    }

    setFormStatus("sending");

    try {
      const fd = new FormData();
      fd.set("name", formData.name);
      fd.set("email", formData.email);
      if (formData.phone) fd.set("phone", formData.phone);
      fd.set("subject", formData.subject);
      fd.set("message", formData.message);
      // Backend expects these names
      fd.set("gdprConsent", String(Boolean(formData.rodo)));
      fd.set("marketingConsent", String(Boolean(formData.marketing)));

      const csrfToken = (() => {
        try {
          return document.cookie
            .split('; ')
            .find((c) => c.startsWith('csrf-token='))
            ?.split('=')[1] || '';
        } catch {
          return '';
        }
      })();
    
      const res = await fetch("/api/forms/contact", {
        method: "POST",
        body: fd,
        headers: {
          // Ensure server can detect lang
          "Accept-Language": language,
          // CSRF protection header required by middleware
          "x-csrf-token": csrfToken,
        },
      });

      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };

      if (res.ok && data?.success) {
        setFormStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          rodo: false,
          marketing: false,
        });
        setTimeout(() => setFormStatus("idle"), 3000);
      } else {
        setFormStatus("error");
        setTimeout(() => setFormStatus("idle"), 3000);
      }
    } catch (error) {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <PageNav nav={t.nav} current="contact" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Button asChild variant="ghost" className="mb-6">
              <Link
                href="/"
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.back}</span>
              </Link>
            </Button>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              {t.header.title}
            </h1>
            <p className="text-xl text-teal-600 mb-6">{t.header.subtitle}</p>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              {t.header.description}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">
                  {t.form.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t.form.name} *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t.form.namePlaceholder}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t.form.email} *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t.form.emailPlaceholder}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">{t.form.phone}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t.form.phonePlaceholder}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">{t.form.subject} *</Label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="">{t.form.subjectPlaceholder}</option>
                        {t.form.subjects.map((subject, index) => (
                          <option key={index} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">{t.form.message} *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t.form.messagePlaceholder}
                      rows={5}
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="rodo"
                        checked={formData.rodo}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("rodo", checked as boolean)
                        }
                        className="mt-1"
                      />
                      <Label
                        htmlFor="rodo"
                        className="text-sm text-slate-600 leading-relaxed"
                      >
                        {t.form.rodo} *
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="marketing"
                        checked={formData.marketing}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("marketing", checked as boolean)
                        }
                        className="mt-1"
                      />
                      <Label
                        htmlFor="marketing"
                        className="text-sm text-slate-600 leading-relaxed"
                      >
                        {t.form.marketing}
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={formStatus === "sending"}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    {formStatus === "sending" && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    )}
                    {formStatus === "success" && (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {formStatus === "sending"
                      ? t.form.sending
                      : formStatus === "success"
                        ? t.form.success
                        : formStatus === "error"
                          ? t.form.error
                          : t.form.send}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900">
                    {t.contact.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-teal-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {t.contact.address}
                      </h4>
                      <p className="text-slate-600">Gliwicka 111</p>
                      <p className="text-slate-600">42-600 Tarnowskie Góry</p>
                      <p className="text-slate-600">Polska</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-teal-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {t.contact.phone}
                      </h4>
                      <a
                        href="tel:+48791554674"
                        className="text-teal-600 hover:text-teal-700"
                      >
                        +48 791 554 674
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-teal-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {t.contact.email}
                      </h4>
                      <a
                        href="mailto:kontakt@gliwicka111.pl"
                        className="text-teal-600 hover:text-teal-700"
                      >
                        kontakt@gliwicka111.pl
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-teal-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {t.contact.hours}
                      </h4>
                      <p className="text-slate-600">{t.contact.hoursValue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 bg-transparent"
                >
                  <a
                    href="tel:+48791554674"
                    className="flex flex-col items-center space-y-2"
                  >
                    <Phone className="w-6 h-6 text-teal-600" />
                    <span className="text-sm font-medium">
                      {language === "pl" ? "Zadzwoń" : "Call"}
                    </span>
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 bg-transparent"
                >
                  <a
                    href="mailto:kontakt@gliwicka111.pl"
                    className="flex flex-col items-center space-y-2"
                  >
                    <Mail className="w-6 h-6 text-teal-600" />
                    <span className="text-sm font-medium">
                      {language === "pl" ? "E-mail" : "Email"}
                    </span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {t.map.title}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t.map.description}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-video">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2548.0720834585965!2d18.846092877122503!3d50.36999599631825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716ce5b5c5c5c5b%3A0x123456789abcdef!2sGliwicka%20111%2C%2042-600%20Tarnowskie%20G%C3%B3ry%2C%20Polska!5e0!3m2!1spl!2spl!4v1700000000000!5m2!1spl!2spl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokalizacja Gliwicka 111"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Gliwicka 111</h3>
                  <p className="text-sm text-slate-400">Property Management</p>
                </div>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                {language === "pl"
                  ? "Profesjonalne zarządzanie nieruchomościami i wynajem powierzchni komercyjnych."
                  : "Professional property management and commercial space rentals."}
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>Gliwicka 111, 42-600 Tarnowskie Góry</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Phone className="w-4 h-4" />
                  <span>+48 791 554 674</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span>kontakt@gliwicka111.pl</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === "pl" ? "Szybkie linki" : "Quick Links"}
              </h4>
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {t.nav.home}
                </Link>
                <Link
                  href="/properties"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {t.nav.properties}
                </Link>
                <Link
                  href="/about"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {t.nav.about}
                </Link>
                <Link
                  href="/contact"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {t.nav.contact}
                </Link>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === "pl" ? "Informacje prawne" : "Legal Information"}
              </h4>
              <nav className="space-y-2">
                <Link
                  href="/privacy"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {language === "pl"
                    ? "Polityka prywatności"
                    : "Privacy Policy"}
                </Link>
                <Link
                  href="/terms"
                  className="block text-slate-400 hover:text-white transition-colors"
                >
                  {language === "pl" ? "Regulamin" : "Terms of Service"}
                </Link>
              </nav>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>
              &copy; 2024 Gliwicka 111.{" "}
              {language === "pl"
                ? "Wszystkie prawa zastrzeżone."
                : "All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
