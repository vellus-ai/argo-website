"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Anchor, Rocket, Shield, Zap, Check, ChevronDown, CreditCard } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51TEEAtAoPvt8J4RKVXMxPbR5pJ4vdS43IVlLqVwJ5bTkK80hj40L6A4YFDLR3gRWeDRSVQ5lM1P2MQqnXKILmk6B00hxQTkbUo");

type BillingPeriod = "monthly" | "semiannual" | "annual" | "biennial";

interface PeriodOption {
  key: BillingPeriod;
  months: number;
  discount: number;
  badge?: string;
}

const periods: PeriodOption[] = [
  { key: "monthly", months: 1, discount: 0 },
  { key: "semiannual", months: 6, discount: 10, badge: "-10%" },
  { key: "annual", months: 12, discount: 15, badge: "-15%" },
  { key: "biennial", months: 24, discount: 20, badge: "-20%" },
];

const FALLBACK_PRICES: Record<string, number> = {
  starter: 50,
  pro: 99,
};

function calcPrice(base: number, discount: number): number {
  return Math.round(base * (1 - discount / 100));
}

const planIds = ["starter", "pro", "enterprise"] as const;

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("checkout");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-argo.consilium.tec.br";

  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [basePrices, setBasePrices] = useState<Record<string, number>>(FALLBACK_PRICES);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/plans`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((plans: Array<{ id: string; base_price_cents: number; is_enterprise: boolean; active: boolean }>) => {
        const prices: Record<string, number> = { ...FALLBACK_PRICES };
        for (const plan of plans) {
          if (!plan.is_enterprise && plan.active) {
            prices[plan.id] = Math.round(plan.base_price_cents / 100);
          }
        }
        setBasePrices(prices);
      })
      .catch(() => {
        // Silently use fallback prices
      });
  }, [API_URL]);

  useEffect(() => {
    const plan = searchParams.get("plan");
    const period = searchParams.get("period");
    if (plan && (["starter", "pro", "enterprise"] as string[]).includes(plan)) setSelectedPlan(plan);
    if (period && (["monthly", "semiannual", "annual", "biennial"] as string[]).includes(period))
      setBillingPeriod(period as BillingPeriod);
  }, [searchParams]);

  const currentPeriod = periods.find((p) => p.key === billingPeriod)!;
  const isEnterprise = selectedPlan === "enterprise";
  const basePrice = basePrices[selectedPlan] ?? 0;
  const monthlyPrice = isEnterprise ? 0 : calcPrice(basePrice, currentPeriod.discount);
  const totalPrice = monthlyPrice * currentPeriod.months;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEnterprise) {
      window.location.href = "mailto:contato@vellus.tech?subject=ARGO%20Enterprise";
      return;
    }
    setSubmitting(true);

    try {
      // Save checkout data for welcome page
      sessionStorage.setItem("argo_checkout_data", JSON.stringify({
        name: form.name,
        email: form.email,
        company: form.company,
        plan: selectedPlan,
        period: billingPeriod,
        monthlyPrice,
        totalPrice,
        createdAt: new Date().toISOString(),
      }));

      // Create embedded checkout session
      const res = await fetch(`${API_URL}/api/v1/checkout/create-embedded`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          plan: selectedPlan,
          period: billingPeriod,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create checkout session");
      }

      const data = await res.json();
      setClientSecret(data.client_secret);
      setShowPayment(true);
    } catch (err) {
      console.error("Checkout error:", err);
      setSubmitting(false);
    }
  };

  const periodLabels: Record<string, string> = {
    monthly: t("periods.monthly"),
    semiannual: t("periods.semiannual"),
    annual: t("periods.annual"),
    biennial: t("periods.biennial"),
  };

  const savingsLabel = (months: number) => {
    if (months === 6) return t("savings.semiannually");
    if (months === 12) return t("savings.annually");
    return t("savings.biennially");
  };

  const faqKeys = ["billing", "upgrade", "cancel", "taxes", "limits", "infrastructure", "security"] as const;

  // Show embedded Stripe payment form
  if (showPayment && clientSecret) {
    return (
      <div className="min-h-screen bg-midnight">
        <header className="py-6 px-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <Anchor className="w-6 h-6 text-electric" />
              <span className="text-xl font-bold text-text-primary">ARGO</span>
            </a>
            <button
              onClick={() => { setShowPayment(false); setClientSecret(null); setSubmitting(false); }}
              className="text-text-tertiary hover:text-text-primary text-sm"
            >
              ← {t("backToCheckout") || "Voltar"}
            </button>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              <CreditCard className="inline w-6 h-6 mr-2 text-electric" />
              {t("paymentTitle") || "Finalizar pagamento"}
            </h1>
            <p className="text-text-secondary">
              {t("paymentSubtitle") || "Dados protegidos com criptografia de ponta a ponta"}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald/10 text-emerald px-4 py-2 rounded-full text-sm font-medium">
              <Rocket className="w-4 h-4" />
              {t("trialBadge") || "7 dias grátis — cancele a qualquer momento"}
            </div>
          </div>

          <div className="bg-navy rounded-2xl border border-border overflow-hidden">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
              <EmbeddedCheckout className="stripe-embedded" />
            </EmbeddedCheckoutProvider>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-text-tertiary text-xs">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>PCI DSS Level 1</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>256-bit SSL</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <Anchor className="w-6 h-6 text-electric" />
            <span className="text-xl font-bold text-text-primary">ARGO</span>
          </a>
          <div className="flex items-center gap-2 text-text-tertiary text-sm">
            <Shield className="w-4 h-4" />
            <span>{t("secureEnvironment")}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            {t("title")}
          </h1>
          <p className="text-text-secondary">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-4">
            {/* 1. Billing period */}
            {!isEnterprise && (
              <div>
                <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                  {t("step1")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {periods.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setBillingPeriod(p.key)}
                      className={`relative cursor-pointer rounded-lg border p-3 text-center transition-all ${
                        billingPeriod === p.key
                          ? "border-electric bg-navy-light shadow-lg shadow-electric/10"
                          : "border-border bg-navy hover:border-border-light"
                      }`}
                    >
                      {p.badge && (
                        <span className="absolute -top-2 right-2 bg-emerald text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          {p.badge}
                        </span>
                      )}
                      <span className="block text-sm font-semibold text-text-primary">{periodLabels[p.key]}</span>
                      <span className={`block text-xs mt-0.5 ${p.discount > 0 ? "text-emerald" : "text-text-tertiary"}`}>
                        {p.discount > 0 ? `US$ ${calcPrice(basePrice, p.discount)}/${t("perMonth")}` : `US$ ${basePrice}/${t("perMonth")}`}
                      </span>
                    </button>
                  ))}
                </div>
                {currentPeriod.discount > 0 && (
                  <p className="text-emerald text-xs mt-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {t("saveBanner", { discount: currentPeriod.discount, amount: (basePrice - monthlyPrice) * currentPeriod.months })}
                  </p>
                )}
              </div>
            )}

            {/* 2. Plan selection */}
            <div>
              <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                {t("step2")}
              </h2>
              {planIds.map((planId) => {
                const planFeatures = t.raw(`plans.${planId}.features`) as string[];
                const isPopular = planId === "pro";
                return (
                  <button
                    key={planId}
                    onClick={() => setSelectedPlan(planId)}
                    className={`w-full text-left rounded-lg border p-4 mb-2 transition-all cursor-pointer ${
                      selectedPlan === planId
                        ? "border-electric bg-navy-light shadow-lg shadow-electric/10"
                        : "border-border bg-navy hover:border-border-light"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedPlan === planId ? "border-electric bg-electric" : "border-text-tertiary"
                          }`}
                        >
                          {selectedPlan === planId && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className="text-base font-semibold text-text-primary">{t(`plans.${planId}.name`)}</span>
                        {isPopular && (
                          <span className="text-[10px] bg-electric/20 text-electric px-2 py-0.5 rounded-full font-medium">
                            {t("popular")}
                          </span>
                        )}
                      </div>
                      {planId !== "enterprise" && (
                        <div className="text-right">
                          {currentPeriod.discount > 0 && (
                            <span className="text-xs text-text-tertiary line-through mr-1">US$ {basePrices[planId] ?? 0}</span>
                          )}
                          <span className="text-lg font-bold text-text-primary">
                            US$ {calcPrice(basePrices[planId] ?? 0, currentPeriod.discount)}
                          </span>
                          <span className="text-text-tertiary text-xs">/{t("perMonth")}</span>
                        </div>
                      )}
                      {planId === "enterprise" && (
                        <span className="text-text-secondary text-sm">{t("onRequest")}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 ml-7">
                      {planFeatures.map((f: string) => (
                        <span key={f} className="text-[11px] text-text-secondary bg-midnight px-2 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column — Form + Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-navy p-5 sticky top-20">
              <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
                {isEnterprise ? t("contactSales") : t("step3")}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-text-secondary mb-1.5">
                    {t("form.fullName")} *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Milton Silva"
                    className="w-full rounded-lg border border-border bg-midnight px-4 py-2.5 text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric transition"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-text-secondary mb-1.5">
                    {t("form.email")} *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="milton@vellus.tech"
                    className="w-full rounded-lg border border-border bg-midnight px-4 py-2.5 text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric transition"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm text-text-secondary mb-1.5">
                    {t("form.company")} <span className="text-text-tertiary">({t("form.optional")})</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Vellus Tecnologia"
                    className="w-full rounded-lg border border-border bg-midnight px-4 py-2.5 text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric transition"
                  />
                </div>

                {/* Summary */}
                <div className="border-t border-border pt-4 mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{t("summary.plan")}</span>
                    <span className="text-text-primary font-medium capitalize">{selectedPlan}</span>
                  </div>
                  {!isEnterprise && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">{t("summary.period")}</span>
                        <span className="text-text-primary font-medium">{periodLabels[billingPeriod]}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">{t("summary.monthlyValue")}</span>
                        <span className="text-text-primary">
                          {currentPeriod.discount > 0 && (
                            <span className="text-text-tertiary line-through mr-2 text-xs">
                              US$ {basePrice}
                            </span>
                          )}
                          US$ {monthlyPrice}/{t("perMonth")}
                        </span>
                      </div>
                      {currentPeriod.months > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">{t("summary.totalPeriod")}</span>
                          <span className="text-text-primary font-bold">US$ {totalPrice}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Trial</span>
                    <span className="text-emerald font-medium">{t("summary.trialFree")}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-text-secondary">{t("summary.todayYouPay")}</span>
                    <span className="text-text-primary font-bold text-lg">US$ 0,00</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !form.name || !form.email}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-electric hover:bg-electric-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 transition-all cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      {isEnterprise ? t("talkToSales") : t("startTrial")}
                    </>
                  )}
                </button>

                <p className="text-xs text-text-tertiary text-center mt-3">
                  {t("terms.prefix")}{" "}
                  <a href="#" className="text-electric hover:underline">{t("terms.termsOfUse")}</a> {t("terms.and")}{" "}
                  <a href="#" className="text-electric hover:underline">{t("terms.privacyPolicy")}</a>.
                  {!isEnterprise && (
                    <span className="block mt-1">
                      {t("terms.afterTrial", { monthlyPrice, totalPrice, months: currentPeriod.months })}
                    </span>
                  )}
                </p>
              </form>

              {/* Trust signals */}
              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <Shield className="w-3.5 h-3.5 text-emerald" />
                  {t("trust.encryption")}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <Zap className="w-3.5 h-3.5 text-amber" />
                  {t("trust.setup")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
            {t("faqTitle")}
          </h2>
          <div className="space-y-3">
            {faqKeys.map((key, i) => (
              <div key={key} className="border border-border rounded-xl bg-navy overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <span className="text-sm font-medium text-text-primary pr-4">{t(`faqs.${key}.q`)}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-text-tertiary flex-shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                    {t(`faqs.${key}.a`)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-text-tertiary text-center mt-8">
            {t("taxDisclaimer")}
          </p>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-midnight" />}>
      <CheckoutContent />
    </Suspense>
  );
}
