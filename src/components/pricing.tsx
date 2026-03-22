"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface PlanProps {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  cta: string;
  ctaClass: string;
  highlighted?: boolean;
  badge?: string;
}

const plans: PlanProps[] = [
  {
    name: "Starter",
    price: "R$ 97",
    period: "/mês",
    tagline: "Para quem está começando",
    features: ["3 agentes", "1 usuário", "Telegram + Web", "Suporte email"],
    cta: "Começar grátis",
    ctaClass:
      "border border-electric text-electric rounded-lg py-3 w-full hover:bg-electric/10 transition-colors",
  },
  {
    name: "Pro",
    price: "R$ 197",
    period: "/mês",
    tagline: "Para quem quer resultados",
    features: [
      "6 agentes",
      "5 usuários",
      "Todos os canais",
      "White-label básico",
      "Chat + email",
    ],
    cta: "\u{1F680} Comece Grátis",
    ctaClass:
      "bg-electric text-white glow rounded-lg py-3 w-full font-semibold hover:bg-electric/90 transition-colors",
    highlighted: true,
    badge: "\u2B50 Mais popular",
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    tagline: "Para equipes que exigem o máximo",
    features: [
      "Agentes ilimitados",
      "Usuários ilimitados",
      "White-label + domínio",
      "SLA dedicado",
      "Onboarding assistido",
    ],
    cta: "Falar com vendas",
    ctaClass:
      "border border-border-light text-text-secondary rounded-lg py-3 w-full hover:bg-white/5 transition-colors",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Planos que crescem com você
          </h2>
          <p className="text-text-secondary text-lg">
            Comece grátis. Escale quando precisar. Sem surpresas.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className={`bg-navy rounded-2xl p-8 relative flex flex-col ${
                plan.highlighted
                  ? "border-2 border-electric"
                  : "border border-border"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-electric text-white text-sm px-4 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-text-primary">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-text-secondary">{plan.period}</span>
                  )}
                </div>
                <p className="text-text-secondary text-sm">{plan.tagline}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald flex-shrink-0" />
                    <span className="text-text-secondary text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button className={`cursor-pointer ${plan.ctaClass}`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-text-tertiary text-sm text-center mt-12 max-w-3xl mx-auto"
        >
          Todos os planos incluem: criptografia AES-256, LGPD compliance,
          atualizações automáticas e 99.9% uptime.
        </motion.p>
      </div>
    </section>
  );
}
