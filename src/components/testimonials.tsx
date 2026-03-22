"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const testimonialKeys = ["marina", "rafael", "juliana"] as const;
const initials = { marina: "MC", rafael: "RM", juliana: "JA" };

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-text-primary">
            {t("title")}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex gap-6 overflow-x-auto snap-x pb-4 scrollbar-hide"
        >
          {testimonialKeys.map((key) => (
            <motion.div
              key={key}
              variants={cardVariants}
              className="bg-navy rounded-2xl p-8 min-w-[350px] snap-center border border-border flex-shrink-0"
            >
              <p className="text-lg text-text-primary italic mb-6">
                &ldquo;{t(`items.${key}.quote`)}&rdquo;
              </p>

              <div className="w-12 h-0.5 bg-electric my-4" />

              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center text-sm font-semibold text-text-secondary">
                  {initials[key]}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">
                    {t(`items.${key}.name`)}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {t(`items.${key}.role`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
