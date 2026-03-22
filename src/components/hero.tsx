"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  const stats = [
    { value: "6", label: t("stats.agents") },
    { value: "8", label: t("stats.languages") },
    { value: "13+", label: t("stats.providers") },
    { value: "5 min", label: t("stats.setup") },
  ];

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,var(--color-navy)_0%,var(--color-midnight)_70%)] px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        {/* Badge */}
        <span className="mb-6 inline-block rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400">
          {t("badge")}
        </span>

        {/* H1 */}
        <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
          {t("title")}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-xl text-text-secondary">
          {t("subtitle")}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/checkout"
            className="glow rounded-lg bg-electric px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-electric/90"
          >
            {t("cta")}
          </a>
          <a
            href="#demo"
            className="rounded-lg border border-border-light px-6 py-3 text-white transition-colors hover:bg-white/5"
          >
            {t("demo")}
          </a>
        </div>

        {/* Trust line */}
        <p className="mt-4 text-sm text-text-tertiary">
          {t("trustLine")}
        </p>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center px-8 py-2 ${
                i > 0 ? "border-l border-border-light" : ""
              }`}
            >
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className="text-sm text-text-secondary">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
