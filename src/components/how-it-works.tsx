"use client";

import { motion } from "framer-motion";
import { CreditCard, Settings, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";

const stepKeys = ["step1", "step2", "step3"] as const;
const stepIcons: LucideIcon[] = [CreditCard, Settings, MessageSquare];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section className="bg-midnight px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white">
            {t("title")}
          </h2>
          <p className="mt-4 text-text-secondary">
            {t("subtitle")}
          </p>
        </div>

        {/* Steps grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {stepKeys.map((key, index) => {
            const Icon = stepIcons[index];
            return (
              <motion.div
                key={key}
                variants={item}
                className="rounded-2xl border border-border bg-navy p-8"
              >
                {/* Step number */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-electric to-cyan text-lg font-bold text-white">
                  {index + 1}
                </div>

                {/* Title */}
                <h3 className="mt-4 text-lg font-bold uppercase tracking-wider text-white">
                  {t(`steps.${key}.title`)}
                </h3>

                {/* Description */}
                <p className="mt-2 text-text-secondary">{t(`steps.${key}.description`)}</p>

                {/* Bottom icon */}
                <Icon className="mt-4 h-6 w-6 text-electric" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
