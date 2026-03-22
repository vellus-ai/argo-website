"use client";

import { motion } from "framer-motion";
import { Users, Key, Smartphone, Palette, Brain, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

const featureKeys = ["teamwork", "byok", "channels", "whitelabel", "learning", "plugins"] as const;

const featureMeta = [
  { icon: Users, iconBg: "bg-electric/20", iconColor: "text-electric" },
  { icon: Key, iconBg: "bg-cyan/20", iconColor: "text-cyan" },
  { icon: Smartphone, iconBg: "bg-emerald/20", iconColor: "text-emerald" },
  { icon: Palette, iconBg: "bg-amber/20", iconColor: "text-amber" },
  { icon: Brain, iconBg: "bg-purple-500/20", iconColor: "text-purple-400" },
  { icon: ShoppingBag, iconBg: "bg-rose-500/20", iconColor: "text-rose-400" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Features() {
  const t = useTranslations("features");

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            {t("title")}
          </h2>
          <p className="text-text-secondary text-lg">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featureKeys.map((key, index) => {
            const meta = featureMeta[index];
            return (
              <motion.div
                key={key}
                variants={cardVariants}
                className="bg-navy rounded-2xl p-6 border border-border card-hover"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${meta.iconBg}`}
                >
                  <meta.icon className={`w-6 h-6 ${meta.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-text-secondary text-sm">
                  {t(`items.${key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
