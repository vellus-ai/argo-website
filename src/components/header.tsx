"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, Menu, X, Globe, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { locales, type Locale } from "@/i18n/config";

const navLinkKeys = ["produto", "precos", "docs", "blog", "sobre"] as const;
const navLinkHrefs: Record<string, string> = {
  produto: "#produto",
  precos: "#precos",
  docs: "#docs",
  blog: "#blog",
  sobre: "#sobre",
};

// Short display labels for the language selector
const localeLabels: Record<string, string> = {
  "pt-BR": "PT",
  "en-US": "EN",
  "es-ES": "ES",
  "fr-FR": "FR",
  "it-IT": "IT",
  "de-DE": "DE",
};

export default function Header() {
  const t = useTranslations("header");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
  };

  return (
    <>
      <header className="glass fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Anchor className="h-6 w-6 text-electric" />
            <span className="text-lg font-bold text-white">ARGO</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinkKeys.map((key) => (
              <a
                key={key}
                href={navLinkHrefs[key]}
                className="text-sm text-text-secondary transition-colors hover:text-white"
              >
                {t(`nav.${key}`)}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs + Language */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-border-light px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-white/5 cursor-pointer"
                aria-label={t("language")}
              >
                <Globe className="h-4 w-4" />
                <span>{localeLabels[locale] || locale}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-navy py-1 shadow-xl z-50"
                  >
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                          locale === loc
                            ? "text-electric bg-electric/10"
                            : "text-text-secondary hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {tCommon(`languages.${loc}`)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#login"
              className="rounded-lg border border-border-light px-4 py-2 text-sm text-white transition-colors hover:bg-white/5"
            >
              {t("login")}
            </a>
            <a
              href="/checkout"
              className="rounded-lg bg-electric px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-electric/90"
            >
              {t("startFree")}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("toggleMenu")}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-72 bg-navy border-l border-border p-6 pt-20 md:hidden"
          >
            <nav className="flex flex-col gap-6">
              {navLinkKeys.map((key) => (
                <a
                  key={key}
                  href={navLinkHrefs[key]}
                  className="text-lg text-text-secondary transition-colors hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(`nav.${key}`)}
                </a>
              ))}

              {/* Mobile language selector */}
              <div className="border-t border-border pt-4">
                <p className="text-xs text-text-tertiary uppercase tracking-wider mb-2">
                  {t("language")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        switchLocale(loc);
                        setMobileOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        locale === loc
                          ? "bg-electric text-white"
                          : "border border-border text-text-secondary hover:border-electric/50"
                      }`}
                    >
                      {localeLabels[loc]}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-border" />
              <a
                href="#login"
                className="rounded-lg border border-border-light px-4 py-3 text-center text-sm text-white transition-colors hover:bg-white/5"
              >
                {t("login")}
              </a>
              <a
                href="/checkout"
                className="rounded-lg bg-electric px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-electric/90"
              >
                {t("startFree")}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Click outside to close language dropdown */}
      {langOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setLangOpen(false)}
        />
      )}
    </>
  );
}
