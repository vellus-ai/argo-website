"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Anchor,
  Rocket,
  Copy,
  Check,
  Mail,
  ArrowRight,
  Sparkles,
  PartyPopper,
  Loader2,
  ShieldCheck,
} from "lucide-react";

interface ProvisioningData {
  name: string;
  email: string;
  company: string;
  plan: string;
  slug: string;
  dashboardUrl: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-argo.consilium.tec.br";

export default function WelcomePage() {
  const t = useTranslations("welcome");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [data, setData] = useState<ProvisioningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  const fetchStatus = useCallback(async (signal?: AbortSignal) => {
    if (!sessionId) {
      setError(t("noSessionId"));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/checkout/session-status/${sessionId}`, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (result.status === "complete" && result.slug && result.slug.length > 0) {
        setData({
          name: result.name || "",
          email: result.email || "",
          company: result.company || "",
          plan: result.plan || "starter",
          slug: result.slug || "",
          dashboardUrl: result.dashboard_url || `https://${result.slug}-argo.consilium.tec.br`,
        });
        setShowConfetti(true);
        setLoading(false);
        setTimeout(() => setShowConfetti(false), 3000);
      } else if (pollCount < 15) {
        setPollCount((c) => c + 1);
      } else {
        setError(t("provisioningTimeout"));
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (pollCount < 10) {
        setPollCount((c) => c + 1);
      } else {
        setError(t("fetchError"));
        setLoading(false);
      }
    }
  }, [sessionId, pollCount, t]);

  useEffect(() => {
    if (loading && !data) {
      const controller = new AbortController();
      const timer = setTimeout(() => fetchStatus(controller.signal), pollCount === 0 ? 0 : 2000);
      return () => {
        controller.abort();
        clearTimeout(timer);
      };
    }
  }, [fetchStatus, loading, data, pollCount]);

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-electric mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            {t("preparingEnvironment")}
          </h2>
          <p className="text-text-secondary">{t("provisioningStatus")}</p>
          <div className="mt-4 flex items-center justify-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-electric animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <Anchor className="w-12 h-12 text-electric mx-auto mb-4" />
          <p className="text-text-secondary mb-4">{error || t("noRecord")}</p>
          <a
            href="/checkout"
            className="text-electric hover:underline inline-flex items-center gap-1"
          >
            {t("goToCheckout")} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const firstName = data.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-midnight">
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

      <header className="py-6 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Anchor className="w-6 h-6 text-electric" />
          <span className="text-xl font-bold text-text-primary">ARGO</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald/10 text-emerald text-sm font-medium px-4 py-2 rounded-full mb-6">
            <PartyPopper className="w-4 h-4" />
            {t("trialActivated")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            {t("welcomeTitle", { firstName })}
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            {t("welcomeSubtitle")}
          </p>
        </div>

        {/* Credentials — email-based login */}
        <div className="rounded-xl border border-border bg-navy p-6 mb-8">
          <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-6">
            {t("credentials.title")}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-text-tertiary mb-1">
                {t("credentials.dashboard")}
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-midnight rounded-lg px-4 py-2.5 text-cyan font-mono text-sm border border-border">
                  {data.dashboardUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(data.dashboardUrl, "url")}
                  className="p-2.5 rounded-lg border border-border hover:border-electric transition"
                >
                  {copiedField === "url" ? <Check className="w-4 h-4 text-emerald" /> : <Copy className="w-4 h-4 text-text-tertiary" />}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3 bg-midnight rounded-lg p-4 border border-border">
            <Mail className="w-5 h-5 text-electric mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-text-primary">
                {t("credentials.emailSent")} <span className="text-electric font-medium">{data.email}</span>
              </p>
              <p className="text-xs text-text-tertiary mt-1">{t("credentials.passwordInEmail")}</p>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-3 bg-amber/5 rounded-lg p-4 border border-amber/20">
            <ShieldCheck className="w-5 h-5 text-amber mt-0.5 shrink-0" />
            <p className="text-xs text-amber/80">{t("credentials.changePasswordWarning")}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-border bg-navy p-6 mb-8">
          <h2 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
            {t("trialSummary.title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-text-tertiary">{t("trialSummary.plan")}</p>
              <p className="text-text-primary font-medium capitalize">{data.plan}</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">{t("trialSummary.period")}</p>
              <p className="text-emerald font-medium">{t("trialSummary.freeTrialDays")}</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Email</p>
              <p className="text-text-primary font-medium text-sm truncate">{data.email}</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">{t("trialSummary.account")}</p>
              <p className="text-text-primary font-medium">{data.company || data.name || "\u2014"}</p>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="rounded-xl border border-electric/30 bg-electric/5 p-6 mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">{t("nextSteps.title")}</h2>
          <ol className="space-y-3">
            {[1, 2, 3].map((step) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-electric text-white text-xs font-bold shrink-0 mt-0.5">
                  {step}
                </span>
                <div>
                  <p className="text-text-primary font-medium">{t(`nextSteps.step${step}.title`)}</p>
                  <p className="text-sm text-text-secondary">{t(`nextSteps.step${step}.description`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={data.dashboardUrl}
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-electric hover:bg-electric-hover text-white font-semibold py-3 px-8 transition-all shadow-lg shadow-electric/25"
          >
            <Rocket className="w-5 h-5" />
            {t("accessDashboard")}
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-text-tertiary text-sm mt-4">
            {t("needHelp")}{" "}
            <a href="mailto:suporte@vellus.tech" className="text-electric hover:underline">
              suporte@vellus.tech
            </a>
          </p>
        </div>
      </main>

      <footer className="py-8 px-4 mt-16">
        <div className="max-w-3xl mx-auto text-center text-text-tertiary text-sm">
          &copy; 2026 Vellus Tecnologia
        </div>
      </footer>
    </div>
  );
}
