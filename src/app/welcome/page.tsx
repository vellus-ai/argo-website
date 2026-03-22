"use client";

import { useEffect, useState } from "react";
import {
  Anchor,
  Rocket,
  Copy,
  Check,
  Mail,
  ArrowRight,
  Sparkles,
  PartyPopper,
} from "lucide-react";

interface OnboardingData {
  name: string;
  email: string;
  company: string;
  plan: string;
  userId: string;
  token: string;
  createdAt: string;
}

export default function WelcomePage() {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("argo_onboarding");
    if (stored) {
      setData(JSON.parse(stored));
    }
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <Anchor className="w-12 h-12 text-electric mx-auto mb-4" />
          <p className="text-text-secondary mb-4">
            Nenhum registro encontrado.
          </p>
          <a
            href="/checkout"
            className="text-electric hover:underline inline-flex items-center gap-1"
          >
            Ir para o checkout <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const firstName = data.name.split(" ")[0];
  const dashboardUrl = `https://${data.company ? data.company.toLowerCase().replace(/\s+/g, "-") : firstName.toLowerCase()}.argo.vellus.tech`;

  return (
    <div className="min-h-screen bg-midnight">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-start justify-center overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 40}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              <Sparkles
                className="w-4 h-4"
                style={{
                  color: ["#3B82F6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Anchor className="w-6 h-6 text-electric" />
          <span className="text-xl font-bold text-text-primary">ARGO</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Welcome card */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald/10 text-emerald text-sm font-medium px-4 py-2 rounded-full mb-6">
            <PartyPopper className="w-4 h-4" />
            Trial ativado com sucesso!
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Bem-vindo a bordo, Capitão {firstName}! 🚀
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Sua tripulação está sendo preparada. Use as credenciais abaixo para
            acessar sua ponte de comando.
          </p>
        </div>

        {/* Credenciais */}
        <div className="rounded-xl border border-border bg-navy p-6 mb-8">
          <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-6">
            Suas credenciais de acesso
          </h2>

          <div className="space-y-4">
            {/* Dashboard URL */}
            <div>
              <label className="block text-xs text-text-tertiary mb-1">
                Ponte de Comando (Dashboard)
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-midnight rounded-lg px-4 py-2.5 text-cyan font-mono text-sm border border-border">
                  {dashboardUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(dashboardUrl, "url")}
                  className="p-2.5 rounded-lg border border-border hover:border-electric transition"
                  title="Copiar"
                >
                  {copiedField === "url" ? (
                    <Check className="w-4 h-4 text-emerald" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-tertiary" />
                  )}
                </button>
              </div>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-xs text-text-tertiary mb-1">
                User ID
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-midnight rounded-lg px-4 py-2.5 text-text-primary font-mono text-sm border border-border">
                  {data.userId}
                </code>
                <button
                  onClick={() => copyToClipboard(data.userId, "userId")}
                  className="p-2.5 rounded-lg border border-border hover:border-electric transition"
                  title="Copiar"
                >
                  {copiedField === "userId" ? (
                    <Check className="w-4 h-4 text-emerald" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-tertiary" />
                  )}
                </button>
              </div>
            </div>

            {/* Gateway Token */}
            <div>
              <label className="block text-xs text-text-tertiary mb-1">
                Gateway Token
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-midnight rounded-lg px-4 py-2.5 text-amber font-mono text-sm border border-border">
                  {data.token}
                </code>
                <button
                  onClick={() => copyToClipboard(data.token, "token")}
                  className="p-2.5 rounded-lg border border-border hover:border-electric transition"
                  title="Copiar"
                >
                  {copiedField === "token" ? (
                    <Check className="w-4 h-4 text-emerald" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-tertiary" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Email notification */}
          <div className="mt-6 flex items-start gap-3 bg-midnight rounded-lg p-4 border border-border">
            <Mail className="w-5 h-5 text-electric mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-text-primary">
                Enviamos essas credenciais para{" "}
                <span className="text-electric font-medium">{data.email}</span>
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                Guarde o token em local seguro. Ele será necessário no primeiro
                acesso.
              </p>
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className="rounded-xl border border-border bg-navy p-6 mb-8">
          <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
            Resumo do trial
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-text-tertiary">Plano</p>
              <p className="text-text-primary font-medium capitalize">
                {data.plan}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Período</p>
              <p className="text-emerald font-medium">14 dias grátis</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Email</p>
              <p className="text-text-primary font-medium text-sm truncate">
                {data.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Empresa</p>
              <p className="text-text-primary font-medium">
                {data.company || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Próximos passos */}
        <div className="rounded-xl border border-electric/30 bg-electric/5 p-6 mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Próximos passos
          </h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-electric text-white text-xs font-bold shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="text-text-primary font-medium">
                  Acesse sua ponte de comando
                </p>
                <p className="text-sm text-text-secondary">
                  Abra o link acima e insira seu User ID + Token
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-electric text-white text-xs font-bold shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="text-text-primary font-medium">
                  Configure seu login permanente
                </p>
                <p className="text-sm text-text-secondary">
                  Crie email + senha no primeiro acesso (o token expira em 24h)
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-electric text-white text-xs font-bold shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="text-text-primary font-medium">
                  Monte sua tripulação
                </p>
                <p className="text-sm text-text-secondary">
                  O setup guiado vai te ajudar a criar seu primeiro agente em 5
                  minutos
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={dashboardUrl}
            className="inline-flex items-center gap-2 rounded-xl bg-electric hover:bg-electric-hover text-white font-semibold py-3 px-8 transition-all shadow-lg shadow-electric/25"
          >
            <Rocket className="w-5 h-5" />
            Acessar minha ponte de comando
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-text-tertiary text-sm mt-4">
            Precisa de ajuda?{" "}
            <a href="mailto:suporte@vellus.tech" className="text-electric hover:underline">
              suporte@vellus.tech
            </a>
          </p>
        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="py-8 px-4 mt-16">
        <div className="max-w-3xl mx-auto text-center text-text-tertiary text-sm">
          &copy; 2026 Vellus Tecnologia — Feito com 🚀 no Brasil
        </div>
      </footer>
    </div>
  );
}
