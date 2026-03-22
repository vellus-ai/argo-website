"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap } from "lucide-react";

type BillingPeriod = "monthly" | "semiannual" | "annual" | "biennial";

interface PeriodOption {
  key: BillingPeriod;
  label: string;
  months: number;
  discount: number; // percentage
  badge?: string;
}

const periods: PeriodOption[] = [
  { key: "monthly", label: "Mensal", months: 1, discount: 0 },
  { key: "semiannual", label: "Semestral", months: 6, discount: 10, badge: "-10%" },
  { key: "annual", label: "Anual", months: 12, discount: 15, badge: "-15%" },
  { key: "biennial", label: "2 anos", months: 24, discount: 20, badge: "-20%" },
];

const BASE_PRICES = {
  starter: 210,
  pro: 420,
};

function calcPrice(base: number, discount: number): number {
  return Math.round(base * (1 - discount / 100));
}

interface PlanProps {
  name: string;
  basePrice: number;
  tagline: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  isEnterprise?: boolean;
}

const plans: PlanProps[] = [
  {
    name: "Starter",
    basePrice: BASE_PRICES.starter,
    tagline: "Para empreendedores e profissionais autônomos",
    features: [
      "3 agentes IA",
      "1 usuário",
      "Telegram + WhatsApp + Web",
      "Agent Teams (task board)",
      "BYOK (traga sua chave API)",
      "Suporte por email",
    ],
    cta: "Teste grátis por 7 dias",
  },
  {
    name: "Pro",
    basePrice: BASE_PRICES.pro,
    tagline: "Para equipes que querem resultados",
    features: [
      "10 agentes IA",
      "5 usuários",
      "Todos os canais",
      "Agent Teams + Delegação",
      "White-label básico",
      "Prompt caching (até 90% economia)",
      "Suporte prioritário",
    ],
    cta: "🚀 Teste grátis por 7 dias",
    highlighted: true,
    badge: "⭐ Mais popular",
  },
  {
    name: "Enterprise",
    basePrice: 0,
    tagline: "Para empresas que exigem o máximo",
    features: [
      "Agentes ilimitados",
      "Usuários ilimitados",
      "White-label completo + domínio próprio",
      "VM dedicada (isolamento total)",
      "SLA 99.9% com suporte dedicado",
      "Onboarding assistido",
      "Integrações customizadas",
    ],
    cta: "Falar com vendas",
    isEnterprise: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Pricing() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const currentPeriod = periods.find((p) => p.key === period)!;

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Planos que crescem com você
          </h2>
          <p className="text-text-secondary text-lg mb-2">
            Teste grátis por 7 dias. Sem cartão de crédito.
          </p>
          <p className="text-amber text-sm font-medium">
            ⏰ Promoção por tempo limitado — trial de 7 dias grátis
          </p>
        </motion.div>

        {/* Period Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`relative cursor-pointer px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                period === p.key
                  ? "bg-electric text-white shadow-lg shadow-electric/25"
                  : "bg-navy border border-border text-text-secondary hover:border-electric/50"
              }`}
            >
              {p.label}
              {p.badge && (
                <span className="absolute -top-2 -right-2 bg-emerald text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {p.badge}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Savings Banner */}
        <AnimatePresence mode="wait">
          {currentPeriod.discount > 0 && (
            <motion.div
              key={period}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center mb-8"
            >
              <span className="inline-flex items-center gap-2 bg-emerald/10 text-emerald px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                Economize {currentPeriod.discount}% — pague R${" "}
                {calcPrice(BASE_PRICES.starter, currentPeriod.discount)}/mês no
                Starter
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plans Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto"
        >
          {plans.map((plan) => {
            const price = plan.isEnterprise
              ? null
              : calcPrice(plan.basePrice, currentPeriod.discount);
            const originalPrice =
              !plan.isEnterprise && currentPeriod.discount > 0
                ? plan.basePrice
                : null;

            return (
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
                  <div className="flex items-baseline gap-2 mb-2">
                    {plan.isEnterprise ? (
                      <span className="text-3xl font-bold text-text-primary">
                        Sob consulta
                      </span>
                    ) : (
                      <>
                        {originalPrice && (
                          <span className="text-lg text-text-tertiary line-through">
                            R$ {originalPrice}
                          </span>
                        )}
                        <span className="text-4xl font-bold text-text-primary">
                          R$ {price}
                        </span>
                        <span className="text-text-secondary">/mês</span>
                      </>
                    )}
                  </div>
                  <p className="text-text-secondary text-sm">{plan.tagline}</p>
                  {!plan.isEnterprise && currentPeriod.months > 1 && (
                    <p className="text-emerald text-xs mt-1 font-medium">
                      Cobrado R$ {price! * currentPeriod.months} a cada{" "}
                      {currentPeriod.months} meses
                    </p>
                  )}
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

                <button
                  className={`cursor-pointer rounded-lg py-3 w-full font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-electric text-white glow hover:bg-electric/90"
                      : plan.isEnterprise
                      ? "border border-border-light text-text-secondary hover:bg-white/5"
                      : "border border-electric text-electric hover:bg-electric/10"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-text-tertiary text-sm text-center mt-12 max-w-3xl mx-auto"
        >
          Todos os planos incluem: criptografia AES-256, LGPD compliance,
          atualizações automáticas e 99.9% uptime. Cancele quando quiser.
        </motion.p>
      </div>
    </section>
  );
}
