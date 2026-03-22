"use client";

import { motion } from "framer-motion";
import { CreditCard, Settings, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    icon: CreditCard,
    title: "CONTRATE",
    description:
      "Escolha seu plano e crie sua conta com trial de 7 dias. Sem cartão, sem compromisso.",
  },
  {
    number: 2,
    icon: Settings,
    title: "CONFIGURE",
    description:
      "Conecte sua IA preferida (OpenAI, Claude, Gemini) ou use a nossa. Personalize nome, personalidade e canais.",
  },
  {
    number: 3,
    icon: MessageSquare,
    title: "COMANDE",
    description:
      "Fale com seus agentes pelo Telegram, WhatsApp, Teams ou direto no dashboard. Eles já estão prontos.",
  },
];

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
  return (
    <section className="bg-midnight px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white">
            Do zero à sua tripulação em 5 minutos
          </h2>
          <p className="mt-4 text-text-secondary">
            Três passos. Sem instalação. Sem complicação.
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
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={item}
                className="rounded-2xl border border-border bg-navy p-8"
              >
                {/* Step number */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-electric to-cyan text-lg font-bold text-white">
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="mt-4 text-lg font-bold uppercase tracking-wider text-white">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-text-secondary">{step.description}</p>

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
