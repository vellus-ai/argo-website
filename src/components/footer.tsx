"use client";

import { Anchor, Github, Linkedin, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";

const columnKeys = ["product", "company", "resources", "legal"] as const;

const socialLinks = [
  { icon: Github, label: "GitHub" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Twitter, label: "Twitter" },
];

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="py-16 px-4 bg-midnight">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {columnKeys.map((colKey) => {
            const links = t.raw(`columns.${colKey}.links`) as string[];
            return (
              <div key={colKey}>
                <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                  {t(`columns.${colKey}.title`)}
                </h4>
                <ul className="space-y-1">
                  {links.map((link: string) => (
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
            );
          })}
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-electric" />
              <span className="font-bold text-text-primary">ARGO</span>
              <span className="text-text-tertiary text-sm">{t("byVellus")}</span>
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
              &copy; {t("copyright")}
            </p>
          </div>

          <p className="text-text-tertiary text-xs text-center mt-4">
            {t("madeIn", { rocket: "\u{1F680}" })}
          </p>
        </div>
      </div>
    </footer>
  );
}
