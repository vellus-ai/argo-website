import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "ARGO — Sua tripulação de IA | Agentes inteligentes para empresas",
  description:
    "Monte sua equipe de agentes de IA em 5 minutos. Estratégia, operações, pesquisa, dados, jurídico e engenharia. Trial grátis de 14 dias.",
  openGraph: {
    title: "ARGO — Sua tripulação de IA",
    description:
      "6 agentes especializados de IA trabalhando para você. Telegram, WhatsApp, Teams. Setup em 5 minutos.",
    url: "https://argo.vellus.tech",
    siteName: "ARGO by Vellus",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARGO — Sua tripulação de IA",
    description: "Monte sua equipe de IA em 5 minutos. Trial grátis.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
