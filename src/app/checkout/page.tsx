"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Anchor, Rocket, Shield, Zap, Check } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "R$ 210",
    period: "/mês",
    features: ["3 agentes", "1 canal", "BYOK", "1 usuário", "Agent Teams"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 420",
    period: "/mês",
    popular: true,
    features: [
      "10 agentes",
      "Todos os canais",
      "BYOK + fallback",
      "5 usuários",
      "White-label",
      "Agent Teams + Delegação",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    features: [
      "Agentes ilimitados",
      "Canais ilimitados",
      "SSO/SAML",
      "Usuários ilimitados",
      "SLA 99.9%",
      "Suporte dedicado",
    ],
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Mock: simula processamento de 2s
    setTimeout(() => {
      const mockUserId = `argo-${form.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;
      const mockToken = Array.from({ length: 32 }, () =>
        "abcdef0123456789"[Math.floor(Math.random() * 16)]
      ).join("");

      // Salva no sessionStorage para a página welcome
      sessionStorage.setItem(
        "argo_onboarding",
        JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          plan: selectedPlan,
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
          {/* Planos — coluna esquerda */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
              Escolha seu plano
            </h2>

            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left rounded-xl border p-5 transition-all ${
                  selectedPlan === plan.id
                    ? "border-electric bg-navy-light shadow-lg shadow-electric/10"
                    : "border-border bg-navy hover:border-border-light"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.id
                          ? "border-electric bg-electric"
                          : "border-text-tertiary"
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-lg font-semibold text-text-primary">
                      {plan.name}
                    </span>
                    {plan.popular && (
                      <span className="text-xs bg-electric/20 text-electric px-2 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-text-primary">
                      {plan.price}
                    </span>
                    <span className="text-text-tertiary text-sm">
                      {plan.period}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 ml-8">
                  {plan.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs text-text-secondary bg-midnight px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Formulário — coluna direita */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-navy p-6 sticky top-24">
              <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-6">
                Seus dados
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-text-secondary mb-1.5"
                  >
                    Nome completo *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Milton Silva"
                    className="w-full rounded-lg border border-border bg-midnight px-4 py-2.5 text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-text-secondary mb-1.5"
                  >
                    Email profissional *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="milton@vellus.tech"
                    className="w-full rounded-lg border border-border bg-midnight px-4 py-2.5 text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm text-text-secondary mb-1.5"
                  >
                    Empresa{" "}
                    <span className="text-text-tertiary">(opcional)</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    placeholder="Vellus Tecnologia"
                    className="w-full rounded-lg border border-border bg-midnight px-4 py-2.5 text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric transition"
                  />
                </div>

                {/* Resumo */}
                <div className="border-t border-border pt-4 mt-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Plano</span>
                    <span className="text-text-primary font-medium capitalize">
                      {selectedPlan}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Trial</span>
                    <span className="text-emerald font-medium">
                      7 dias grátis
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Hoje você paga</span>
                    <span className="text-text-primary font-bold">R$ 0,00</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !form.name || !form.email}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-electric hover:bg-electric-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 transition-all"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Preparando sua tripulação...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      Iniciar trial gratuito
                    </>
                  )}
                </button>

                <p className="text-xs text-text-tertiary text-center mt-3">
                  Ao continuar, você concorda com os{" "}
                  <a href="#" className="text-electric hover:underline">
                    Termos de Uso
                  </a>{" "}
                  e{" "}
                  <a href="#" className="text-electric hover:underline">
                    Política de Privacidade
                  </a>
                  .
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
      </main>
    </div>
  );
}
