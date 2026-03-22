"use client";

import { motion } from "framer-motion";
import { Rocket, Search, Target, Compass, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";

// Ship wheel (helm) icon — custom SVG matching Lucide style
function ShipWheel({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
      <line x1="12" y1="10" x2="12" y2="4" />
      <line x1="12" y1="14" x2="12" y2="20" />
      <line x1="10" y1="12" x2="4" y2="12" />
      <line x1="14" y1="12" x2="20" y2="12" />
    </svg>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = LucideIcon | ((props: any) => React.ReactElement);

const agentKeys = ["captain", "helmsman", "lookout", "gunner", "navigator", "blacksmith"] as const;

const agentIcons: Record<string, IconComponent> = {
  captain: Rocket,
  helmsman: ShipWheel,
  lookout: Search,
  gunner: Target,
  navigator: Compass,
  blacksmith: Wrench,
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Crew() {
  const t = useTranslations("crew");

  return (
    <section className="bg-midnight px-4 py-24" id="produto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="gradient-text text-4xl font-bold">
            {t("title")}
          </h2>
          <p className="mt-4 text-text-secondary">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {agentKeys.map((key) => {
            const Icon = agentIcons[key];
            return (
              <motion.div
                key={key}
                variants={item}
                className="card-hover rounded-2xl border border-border bg-navy p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-light">
                  <Icon className="h-6 w-6 text-electric" />
                </div>
                <h3 className="text-xl font-bold text-white">{t(`agents.${key}.name`)}</h3>
                <span className="text-sm font-medium text-electric">
                  {t(`agents.${key}.area`)}
                </span>
                <p className="mt-2 text-sm text-text-secondary">
                  {t(`agents.${key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer note */}
        <p className="mt-12 text-center text-sm italic text-text-tertiary">
          {t("footerNote")}
        </p>
      </div>
    </section>
  );
}
