"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Anchor, Rocket, Shield, Zap, Check, ChevronDown } from "lucide-react";

type BillingPeriod = "monthly" | "semiannual" | "annual" | "biennial";

interface PeriodOption {
  key: BillingPeriod;
  label: string;
  months: number;
  discount: number;
  badge?: string;
}

const periods: PeriodOption[] = [
  { key: "monthly", label: "Mensal", months: 1, discount: 0 },
  { key: "semiannual", label: "Semestral", months: 6, discount: 10, badge: "-10%" },
  { key: "annual", label: "Anual", months: 12, discount: 15, badge: "-15%" },
  { key: "biennial", label: "2 anos", months: 24, discount: 20, badge: "-20%" },
];

const BASE_PRICES: Record<string, number> = {
  starter: 210,
  pro: 420,
};

function calcPrice(base: number, discount: number): number {
  return Math.round(base * (1 - discount / 100));
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    features: ["3 agentes IA", "1 usuário", "5 GB storage", "Telegram + WhatsApp + Web", "BYOK", "Agent Teams"],
  },
  {
    id: "pro",
    name: "Pro",
    popular: true,
    features: ["10 agentes IA", "5 usuários", "20 GB storage", "Todos os canais", "White-label", "Agent Teams + Delegação", "Container dedicado"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    features: ["Agentes ilimitados", "Usuários ilimitados", "Storage ilimitado", "KVM dedicada", "SLA 99.9%", "SSO/SAML"],
  },
];

const faqs = [
  {
    q: "Como funciona a cobrança?",
    a: "Você começa com 7 dias grátis. Após o trial, a cobrança é feita automaticamente no cartão de crédito no período escolhido (mensal, semestral, anual ou bienal). Quanto maior o compromisso, maior o desconto — até 20% no plano bienal.",
  },
  {
    q: "Posso fazer upgrade ou downgrade?",
    a: "Sim. Você pode alterar seu plano a qualquer momento nas configurações de pagamento. No upgrade, o valor é ajustado proporcionalmente (pro rata). No downgrade, a mudança entra em vigor no próximo ciclo de cobrança.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Não há multa de cancelamento. Seu acesso continua até o final do período já pago. Após o cancelamento, seus dados ficam retidos por 30 dias para eventual reativação.",
  },
  {
    q: "Os preços incluem impostos?",
    a: "Os preços exibidos não incluem impostos ou taxas aplicáveis (como IVA ou imposto sobre vendas), a menos que explicitamente indicado. O valor final será calculado na etapa de pagamento conforme sua localização.",
  },
  {
    q: "O que acontece se eu exceder os limites do plano?",
    a: "Você recebe uma notificação quando atingir 80% da capacidade. Ao atingir o limite, novos agentes não podem ser criados. Recomendamos fazer upgrade — sem perda de dados ou configurações.",
  },
  {
    q: "Qual a infraestrutura por trás do ARGO?",
    a: "O ARGO roda em infraestrutura Google Cloud com virtualização KVM (Kernel-based Virtual Machine). No plano Starter, seu ambiente compartilha recursos com isolamento por container. No Pro, você tem um container dedicado (2 vCPU, 4 GB RAM). No Enterprise, uma KVM dedicada com recursos exclusivos.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "Sim. Criptografia AES-256-GCM para dados em repouso, TLS 1.3 em trânsito. Chaves API (BYOK) são encriptadas e nunca expostas em logs. Compliance com LGPD e SOC 2 (em andamento).",
  },
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Read plan + period from URL params (from pricing page CTAs)
  useEffect(() => {
    const plan = searchParams.get("plan");
    const period = searchParams.get("period");
    if (plan && ["starter", "pro", "enterprise"].includes(plan)) setSelectedPlan(plan);
    if (period && ["monthly", "semiannual", "annual", "biennial"].includes(period))
      setBillingPeriod(period as BillingPeriod);
  }, [searchParams]);

  const currentPeriod = periods.find((p) => p.key === billingPeriod)!;
  const isEnterprise = selectedPlan === "enterprise";
  const basePrice = BASE_PRICES[selectedPlan] || 0;
  const monthlyPrice = isEnterprise ? 0 : calcPrice(basePrice, currentPeriod.discount);
  const totalPrice = monthlyPrice * currentPeriod.months;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEnterprise) {
      window.location.href = "mailto:contato@vellus.tech?subject=ARGO%20Enterprise";
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const mockUserId = `argo-${form.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;
      const mockToken = Array.from({ length: 32 }, () =>
        "abcdef0123456789"[Math.floor(Math.random() * 16)]
      ).join("");
      sessionStorage.setItem(
        "argo_onboarding",
        JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          plan: selectedPlan,
          period: billingPeriod,
          monthlyPrice,
          totalPrice,
          userId: mockUserId,
          token: mockToken,
          createdAt: new Date().toISOString(),
        })
      );
      router.push("/welcome");
    }, 2000);
  };

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
            <span>Ambiente seguro</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Monte sua tripulação
          </h1>
          <p className="text-text-secondary text-lg">
            7 dias grátis. Sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left column — Plan + Period */}
          <div className="lg:col-span-3 space-y-6">
            {/* Plan selection */}
            <div>
              <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
                1. Escolha seu plano
              </h2>
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full text-left rounded-xl border p-5 mb-3 transition-all cursor-pointer ${
                    selectedPlan === plan.id
                      ? "border-electric bg-navy-light shadow-lg shadow-electric/10"
                      : "border-border bg-navy hover:border-border-light"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPlan === plan.id ? "border-electric bg-electric" : "border-text-tertiary"
                        }`}
                      >
                        {selectedPlan === plan.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-lg font-semibold text-text-primary">{plan.name}</span>
                      {plan.popular && (
                        <span className="text-xs bg-electric/20 text-electric px-2 py-0.5 rounded-full font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    {!isEnterprise && plan.id !== "enterprise" && (
                      <div className="text-right">
                        <span className="text-xl font-bold text-text-primary">
                          R$ {calcPrice(BASE_PRICES[plan.id], currentPeriod.discount)}
                        </span>
                        <span className="text-text-tertiary text-sm">/mês</span>
                      </div>
                    )}
                    {plan.id === "enterprise" && (
                      <span className="text-text-secondary text-sm">Sob consulta</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 ml-8">
                    {plan.features.map((f) => (
                      <span key={f} className="text-xs text-text-secondary bg-midnight px-2 py-1 rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Billing period */}
            {!isEnterprise && (
              <div>
                <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
                  2. Período de contratação
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {periods.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setBillingPeriod(p.key)}
                      className={`relative cursor-pointer rounded-xl border p-4 text-center transition-all ${
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
                      <span className="block text-sm font-semibold text-text-primary">{p.label}</span>
                      {p.discount > 0 && (
                        <span className="block text-xs text-emerald mt-1">
                          R$ {calcPrice(basePrice, p.discount)}/mês
                        </span>
                      )}
                      {p.discount === 0 && (
                        <span className="block text-xs text-text-tertiary mt-1">
                          R$ {basePrice}/mês
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {currentPeriod.discount > 0 && (
                  <p className="text-emerald text-xs mt-3 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Você economiza R$ {(basePrice - monthlyPrice) * currentPeriod.months} no período{" "}
                    {currentPeriod.label.toLowerCase()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right column — Form + Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-navy p-6 sticky top-24">
              <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-6">
                {isEnterprise ? "Contato comercial" : "3. Seus dados"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-text-secondary mb-1.5">
                    Nome completo *
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
                    Email profissional *
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
                    Empresa <span className="text-text-tertiary">(opcional)</span>
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
                    <span className="text-text-secondary">Plano</span>
                    <span className="text-text-primary font-medium capitalize">{selectedPlan}</span>
                  </div>
                  {!isEnterprise && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Período</span>
                        <span className="text-text-primary font-medium">{currentPeriod.label}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Valor mensal</span>
                        <span className="text-text-primary">
                          {currentPeriod.discount > 0 && (
                            <span className="text-text-tertiary line-through mr-2 text-xs">
                              R$ {basePrice}
                            </span>
                          )}
                          R$ {monthlyPrice}/mês
                        </span>
                      </div>
                      {currentPeriod.months > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Total período</span>
                          <span className="text-text-primary font-bold">R$ {totalPrice}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Trial</span>
                    <span className="text-emerald font-medium">7 dias grátis</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-text-secondary">Hoje você paga</span>
                    <span className="text-text-primary font-bold text-lg">R$ 0,00</span>
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
                      Preparando sua tripulação...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      {isEnterprise ? "Falar com vendas" : "Iniciar trial gratuito"}
                    </>
                  )}
                </button>

                <p className="text-xs text-text-tertiary text-center mt-3">
                  Ao continuar, você concorda com os{" "}
                  <a href="#" className="text-electric hover:underline">Termos de Uso</a> e{" "}
                  <a href="#" className="text-electric hover:underline">Política de Privacidade</a>.
                  {!isEnterprise && (
                    <span className="block mt-1">
                      Após o trial, será cobrado R$ {monthlyPrice}/mês
                      {currentPeriod.months > 1 ? ` (R$ ${totalPrice} a cada ${currentPeriod.months} meses)` : ""}.
                    </span>
                  )}
                </p>
              </form>

              {/* Trust signals */}
              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <Shield className="w-3.5 h-3.5 text-emerald" />
                  Dados protegidos com criptografia AES-256
                </div>
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <Zap className="w-3.5 h-3.5 text-amber" />
                  Setup em menos de 5 minutos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
            Perguntas frequentes sobre cobrança
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-xl bg-navy overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <span className="text-sm font-medium text-text-primary pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-text-tertiary flex-shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-text-tertiary text-center mt-8">
            Os preços exibidos não incluem impostos ou taxas aplicáveis (como IVA ou imposto sobre vendas),
            a menos que explicitamente indicado. Infraestrutura baseada em KVM (Kernel-based Virtual Machine)
            no Google Cloud Platform.
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
