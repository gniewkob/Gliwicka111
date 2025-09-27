import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Target,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import Link from "next/link";
import Image from "next/image";
import { navTranslations, backTranslations } from "@/lib/i18n";
import { PageNav } from "@/components/page-nav";
import { getCurrentLanguage } from "@/lib/get-current-language";

const translations = {
  pl: {
    nav: navTranslations.pl,
    header: {
      title: "O firmie Gliwicka 111",
      subtitle: "Profesjonalizm i zaufanie w zarządzaniu nieruchomościami",
      description:
        "Jesteśmy dynamiczną firmą specjalizującą się w wynajmie powierzchni komercyjnych i kompleksowym zarządzaniu nieruchomościami w regionie Tarnowskich Gór.",
    },
    mission: {
      title: "Nasza misja",
      description:
        "Zapewniamy najwyższej jakości usługi w zakresie zarządzania nieruchomościami, oferując elastyczne rozwiązania dostosowane do indywidualnych potrzeb każdego klienta. Naszym celem jest budowanie długotrwałych relacji opartych na zaufaniu i profesjonalizmie.",
    },
    values: {
      title: "Nasze wartości",
      trust: {
        title: "Zaufanie",
        description:
          "Budujemy relacje oparte na wzajemnym zaufaniu i transparentności w każdej transakcji.",
      },
      quality: {
        title: "Jakość",
        description:
          "Oferujemy najwyższej jakości powierzchnie i usługi, dbając o każdy szczegół.",
      },
      flexibility: {
        title: "Elastyczność",
        description:
          "Dostosowujemy nasze oferty do indywidualnych potrzeb i wymagań klientów.",
      },
      innovation: {
        title: "Innowacyjność",
        description:
          "Stale rozwijamy nasze usługi i poszukujemy nowych rozwiązań dla klientów.",
      },
    },
    story: {
      title: "Nasza historia",
      description:
        "Firma Gliwicka 111 powstała z pasji do nieruchomości i chęci oferowania profesjonalnych rozwiązań dla lokalnego biznesu. Rozpoczęliśmy działalność od zarządzania własnymi nieruchomościami przy ulicy Gliwickiej 111 w Tarnowskich Górach, stopniowo rozszerzając naszą ofertę o dodatkowe usługi.",
      present:
        "Obecnie oferujemy różnorodne powierzchnie komercyjne - od hal przemysłowych, przez nowoczesne biura, po przestrzenie reklamowe. Nasze doświadczenie i znajomość lokalnego rynku pozwalają nam skutecznie wspierać rozwój firm w regionie.",
      future:
        "Planujemy dalszy rozwój naszego portfolio nieruchomości oraz rozszerzenie zakresu świadczonych usług, zawsze zachowując najwyższe standardy obsługi klienta.",
    },
    team: {
      title: "Nasz zespół",
      description:
        "Nasz zespół składa się z doświadczonych specjalistów z branży nieruchomości, którzy łączą wiedzę techniczną z umiejętnościami interpersonalnymi. Każdy członek zespołu jest zaangażowany w zapewnienie najlepszej obsługi naszym klientom.",
    },
    cta: {
      title: "Rozpocznij współpracę z nami",
      description:
        "Skontaktuj się z nami, aby dowiedzieć się więcej o naszych usługach i dostępnych nieruchomościach.",
      contact: "Skontaktuj się",
      properties: "Zobacz nieruchomości",
    },
    back: backTranslations.pl,
  },
  en: {
    nav: navTranslations.en,
    header: {
      title: "About Gliwicka 111",
      subtitle: "Professionalism and trust in property management",
      description:
        "We are a dynamic company specializing in commercial space rentals and comprehensive property management in the Tarnowskie Góry region.",
    },
    mission: {
      title: "Our mission",
      description:
        "We provide the highest quality property management services, offering flexible solutions tailored to the individual needs of each client. Our goal is to build long-term relationships based on trust and professionalism.",
    },
    values: {
      title: "Our values",
      trust: {
        title: "Trust",
        description:
          "We build relationships based on mutual trust and transparency in every transaction.",
      },
      quality: {
        title: "Quality",
        description:
          "We offer the highest quality spaces and services, paying attention to every detail.",
      },
      flexibility: {
        title: "Flexibility",
        description:
          "We adapt our offers to individual client needs and requirements.",
      },
      innovation: {
        title: "Innovation",
        description:
          "We continuously develop our services and seek new solutions for clients.",
      },
    },
    story: {
      title: "Our story",
      description:
        "Gliwicka 111 was born from a passion for real estate and the desire to offer professional solutions for local business. We started by managing our own properties at Gliwicka 111 street in Tarnowskie Góry, gradually expanding our offer with additional services.",
      present:
        "Currently, we offer various commercial spaces - from industrial halls, through modern offices, to advertising spaces. Our experience and knowledge of the local market allow us to effectively support business development in the region.",
      future:
        "We plan to further develop our property portfolio and expand the scope of services provided, always maintaining the highest standards of customer service.",
    },
    team: {
      title: "Our team",
      description:
        "Our team consists of experienced real estate professionals who combine technical knowledge with interpersonal skills. Each team member is committed to providing the best service to our clients.",
    },
    cta: {
      title: "Start working with us",
      description:
        "Contact us to learn more about our services and available properties.",
      contact: "Contact Us",
      properties: "View Properties",
    },
    back: backTranslations.en,
  },
};

export const dynamic = "force-static";

export default async function AboutPage() {
  const language = await getCurrentLanguage();
  const t = translations[language];

  const values = [
    {
      icon: Award,
      title: t.values.trust.title,
      description: t.values.trust.description,
    },
    {
      icon: Target,
      title: t.values.quality.title,
      description: t.values.quality.description,
    },
    {
      icon: Users,
      title: t.values.flexibility.title,
      description: t.values.flexibility.description,
    },
    {
      icon: TrendingUp,
      title: t.values.innovation.title,
      description: t.values.innovation.description,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageNav nav={t.nav} current="about" />

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

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                {t.mission.title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t.mission.description}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Our Mission"
                  width={400}
                  height={400}
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {t.values.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-slate-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8 text-center">
              {t.story.title}
            </h2>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  {t.story.description}
                </p>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  {t.story.present}
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {t.story.future}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Our Team"
                  width={400}
                  height={400}
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                {t.team.title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t.team.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {t.cta.title}
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {t.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
              <Link href="/contact">
                <Mail className="w-4 h-4 mr-2" />
                {t.cta.contact}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
            >
              <Link href="/properties">
                <Building2 className="w-4 h-4 mr-2" />
                {t.cta.properties}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <Link
                  href="/"
                  className="inline-flex items-center hover:opacity-80 transition-opacity"
                  aria-label="Gliwicka 111 — Property Management"
                >
                  <Image
                    src="/gliwicka111.png"
                    alt="Gliwicka 111 — Property Management"
                    width={200}
                    height={40}
                    className="h-10 w-auto"
                  />
                </Link>
                <div className="mt-3">
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
