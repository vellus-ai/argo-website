import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL("https://argo.consilium.tec.br"),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  title: "ARGO — Sua tripulacao de IA | Agentes inteligentes para empresas",
  description:
    "Monte sua equipe de agentes de IA em 5 minutos. Estrategia, operacoes, pesquisa, dados, juridico e engenharia. Trial gratis de 7 dias.",
  openGraph: {
    title: "ARGO — Sua tripulacao de IA",
    description:
      "6 agentes especializados de IA trabalhando para voce. Telegram, WhatsApp, Teams. Setup em 5 minutos.",
    url: "https://argo.vellus.tech",
    siteName: "ARGO by Vellus",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARGO — Sua tripulacao de IA",
    description: "Monte sua equipe de IA em 5 minutos. Trial gratis.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
