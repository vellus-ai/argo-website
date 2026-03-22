"use client";

import { Anchor, Github, Linkedin, Twitter } from "lucide-react";

const columns = [
  {
    title: "Produto",
    links: ["Funcionalidades", "Preços", "Changelog", "Status"],
  },
  {
    title: "Empresa",
    links: ["Sobre nós", "Blog", "Carreiras", "Contato"],
  },
  {
    title: "Recursos",
    links: ["Documentação", "API", "Marketplace", "Comunidade"],
  },
  {
    title: "Legal",
    links: ["Termos de Uso", "Privacidade", "LGPD", "Cookies"],
  },
];

const socialLinks = [
  { icon: Github, label: "GitHub" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Twitter, label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="py-16 px-4 bg-midnight">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                {column.title}
              </h4>
              <ul className="space-y-1">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-text-secondary hover:text-white transition block py-1"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-electric" />
              <span className="font-bold text-text-primary">ARGO</span>
              <span className="text-text-tertiary text-sm">by Vellus</span>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-text-tertiary hover:text-white transition"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <p className="text-text-tertiary text-sm">
              &copy; 2026 Vellus Tecnologia
            </p>
          </div>

          <p className="text-text-tertiary text-xs text-center mt-4">
            Feito com {"\u{1F680}"} no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
