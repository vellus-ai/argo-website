"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

type BillingPeriod = "monthly" | "semiannual" | "annual" | "biennial";

interface PeriodOption {
  key: BillingPeriod;
  months: number;
  discount: number;
  badge?: string;
}

interface APIPlan {
  id: string;
  name: string;
  tagline: string;
  base_price_cents: number;
  currency: string;
  max_agents: number;
  max_users: number;
  max_storage_mb: number;
  features: string[];
  discounts: Record<string, number>;
  is_popular: boolean;
  is_enterprise: boolean;
  display_order: number;
  active: boolean;
  container_spec: string;
}

const defaultPeriods: PeriodOption[] = [
  { key: "monthly", months: 1, discount: 0 },
  { key: "semiannual", months: 6, discount: 10, badge: "-10%" },
  { key: "annual", months: 12, discount: 15, badge: "-15%" },
  { key: "biennial", months: 24, discount: 20, badge: "-20%" },
];

const CURRENCY = "US$";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-argo.consilium.tec.br";

function calcPrice(base: number, discount: number): number {
  return Math.round(base * (1 - discount / 100));
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Pricing() {
  const t = useTranslations("pricing");
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [plans, setPlans] = useState<APIPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/plans`)
      .then((res) => {
        if (!res.ok) throw new Error("plans API error");
        return res.json() as Promise<APIPlan[]>;
      })
      .then((data) => {
        const activePlans = data
          .filter((p) => p.active)
          .sort((a, b) => a.display_order - b.display_order);
        setPlans(activePlans);
      })
      .catch(() => {
        // Fallback static plans
        setPlans([
          { id: "starter", name: "Starter", tagline: "Para empreendedores solo", base_price_cents: 5000, currency: "usd", max_agents: 3, max_users: 1, max_storage_mb: 5120, features: ["3 agentes IA", "1 usuário", "5 GB storage", "Telegram + WhatsApp + Web", "BYOK", "Agent Teams"], discounts: { semiannual: 10, annual: 15, biennial: 20 }, is_popular: false, is_enterprise: false, display_order: 1, active: true, container_spec: "" },
          { id: "pro", name: "Pro", tagline: "Para equipes que querem resultados", base_price_cents: 9900, currency: "usd", max_agents: 10, max_users: 5, max_storage_mb: 20480, features: ["10 agentes IA", "5 usuários", "20 GB storage", "Todos os canais", "White-label", "Agent Teams + Delegação", "Container dedicado"], discounts: { semiannual: 10, annual: 15, biennial: 20 }, is_popular: true, is_enterprise: false, display_order: 2, active: true, container_spec: "" },
          { id: "enterprise", name: "Enterprise", tagline: "Para empresas que exigem o melhor", base_price_cents: 0, currency: "usd", max_agents: 999, max_users: 999, max_storage_mb: 102400, features: ["Agentes ilimitados", "Usuários ilimitados", "Storage ilimitado", "KVM dedicada", "SLA 99.9%", "SSO/SAML"], discounts: {}, is_popular: false, is_enterprise: true, display_order: 3, active: true, container_spec: "" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentPeriod = defaultPeriods.find((p) => p.key === period)!;

  // Build periods from first plan's discounts (or use defaults)
  const periods = plans.length > 0 && plans[0].discounts
    ? defaultPeriods.map((p) => ({
        ...p,
        discount: plans[0].discounts[p.key] ?? p.discount,
        badge: (plans[0].discounts[p.key] ?? p.discount) > 0 ? `-${plans[0].discounts[p.key] ?? p.discount}%` : undefined,
      }))
    : defaultPeriods;

  const frequencyLabel = () => {
    if (currentPeriod.months === 6) return t("frequency.semiannually");
    if (currentPeriod.months === 12) return t("frequency.annually");
    return t("frequency.biennially");
  };

  if (loading) {
    return (
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-8 h-8 border-2 border-electric/30 border-t-electric rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

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
            {t("title")}
          </h2>
          <p className="text-text-secondary text-lg mb-2">
            {t("subtitle")}
          </p>
          <p className="text-amber text-sm font-medium">
            {t("promo")}
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
              {t(`periods.${p.key}`)}
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
                {t("savingsBanner", { discount: currentPeriod.discount, frequency: frequencyLabel() })}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plans Grid — dynamically rendered from API */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid grid-cols-1 gap-8 items-stretch max-w-5xl mx-auto ${
            plans.length === 1 ? "md:grid-cols-1 max-w-md" :
            plans.length === 2 ? "md:grid-cols-2 max-w-3xl" :
            plans.length >= 3 ? "md:grid-cols-3" : ""
          }`}
        >
          {plans.map((plan) => {
            const basePrice = plan.is_enterprise ? 0 : Math.round(plan.base_price_cents / 100);
            const discount = plan.discounts?.[period] ?? currentPeriod.discount;
            const price = plan.is_enterprise ? null : calcPrice(basePrice, discount);
            const originalPrice = !plan.is_enterprise && discount > 0 ? basePrice : null;

            return (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                className={`bg-navy rounded-2xl p-8 relative flex flex-col ${
                  plan.is_popular
                    ? "border-2 border-electric"
                    : "border border-border"
                }`}
              >
                {plan.is_popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-electric text-white text-sm px-4 py-1 rounded-full whitespace-nowrap">
                    {t("popular")}
                  </span>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    {plan.is_enterprise ? (
                      <span className="text-3xl font-bold text-text-primary">
                        {t("onRequest")}
                      </span>
                    ) : (
                      <>
                        {originalPrice && (
                          <span className="text-lg text-text-tertiary line-through">
                            {CURRENCY} {originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        )}
                        <span className="text-4xl font-bold text-text-primary">
                          {CURRENCY} {price?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-text-secondary">{t("perMonth")}</span>
                      </>
                    )}
                  </div>
                  <p className="text-text-secondary text-sm">{plan.tagline}</p>
                  {!plan.is_enterprise && currentPeriod.months > 1 && price && (
                    <p className="text-emerald text-xs mt-1 font-medium">
                      {t("billedEvery", { total: (price * currentPeriod.months).toLocaleString("en-US", { minimumFractionDigits: 2 }), months: currentPeriod.months })}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {(plan.features || []).map((feature: string) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-emerald flex-shrink-0" />
                      <span className="text-text-secondary text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.is_enterprise ? "mailto:contato@vellus.tech?subject=ARGO%20Enterprise" : `/checkout?plan=${plan.id}&period=${period}`}
                  className={`block text-center cursor-pointer rounded-lg py-3 w-full font-semibold transition-colors ${
                    plan.is_popular
                      ? "bg-electric text-white glow hover:bg-electric/90"
                      : plan.is_enterprise
                      ? "border border-border-light text-text-secondary hover:bg-white/5"
                      : "border border-electric text-electric hover:bg-electric/10"
                  }`}
                >
                  {plan.is_enterprise ? t("enterprise_cta") : t("start_cta")}
                </a>
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
          {t("footer")}
          <br />
          <span className="text-text-tertiary/70 text-xs mt-2 block">
            {t("taxNote")}
          </span>
        </motion.p>
      </div>
    </section>
  );
}
