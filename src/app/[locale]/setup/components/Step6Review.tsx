"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";
import {
  Rocket,
  Check,
  Circle,
  Pencil,
  Building2,
  Palette,
  Cpu,
  Bot,
  Radio,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import type { SetupState } from "./WizardShell";

interface Props {
  state: SetupState;
  goToStep: (step: number) => void;
  saveStep: (data: Record<string, unknown>) => Promise<void>;
}

export default function Step6Review({ state, goToStep, saveStep }: Props) {
  const t = useTranslations("setup.step6");
  const tSteps = useTranslations("setup");
  const tStep1 = useTranslations("setup.step1");
  const tStep3 = useTranslations("setup.step3");
  const tStep4 = useTranslations("setup.step4");
  const tStep5 = useTranslations("setup.step5");

  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Checklist items
  const checks = {
    company: state.companyName.trim().length > 0,
    provider: state.provider.length > 0 && state.apiKey.length > 0,
    agent: state.agentName.trim().length > 0,
    channels: Object.values(state.channels).some(Boolean),
  };

  const allChecked = checks.company; // Only company is truly required

  const handleActivate = useCallback(async () => {
    setActivating(true);
    try {
      await saveStep({
        step: 6,
        action: "activate",
        companyName: state.companyName,
        industry: state.industry,
        companySize: state.companySize,
        useCase: state.useCase,
        primaryColor: state.primaryColor,
        productName: state.productName,
        provider: state.provider,
        model: state.model,
        agentName: state.agentName,
        preset: state.preset,
        persona: state.persona,
        channels: state.channels,
      });

      setActivated(true);
      setShowConfetti(true);

      // Clean up wizard state
      localStorage.removeItem("argo_setup_wizard");

      // Redirect after delay (only allow relative paths or same-origin URLs)
      setTimeout(() => {
        const dashboardUrl = sessionStorage.getItem("argo_dashboard_url");
        if (dashboardUrl) {
          try {
            const url = new URL(dashboardUrl, window.location.origin);
            if (url.origin === window.location.origin) {
              window.location.href = url.href;
            }
          } catch {
            // Invalid URL — ignore
          }
        }
      }, 4000);
    } catch {
      // Allow retry
    } finally {
      setActivating(false);
    }
  }, [saveStep, state]);

  // Clean confetti after 3s
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const activeChannels = Object.entries(state.channels)
    .filter(([, v]) => v)
    .map(([k]) => tStep5(`channels.${k}.name`))
    .join(", ");

  if (activated) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-start justify-center overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
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

        <div className="inline-flex items-center gap-2 bg-emerald/10 text-emerald text-sm font-medium px-4 py-2 rounded-full mb-6">
          <PartyPopper className="w-4 h-4" />
          {t("success")}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          {t("success")}
        </h1>
        <p className="text-text-secondary text-lg">{t("successSubtitle")}</p>

        <div className="mt-8">
          <div className="animate-pulse inline-flex items-center gap-2 text-electric">
            <Rocket className="w-5 h-5" />
            <span className="text-sm font-medium">{t("activating")}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          {t("title")}
        </h1>
        <p className="text-text-secondary text-lg">{t("subtitle")}</p>
      </div>

      {/* Summary sections */}
      <div className="space-y-4 mb-8">
        {/* Company */}
        <SummaryCard
          icon={<Building2 className="w-4 h-4" />}
          title={t("sections.company")}
          onEdit={() => goToStep(1)}
          editLabel={t("edit")}
        >
          <SummaryRow label={t("fields.companyName")} value={state.companyName} />
          <SummaryRow
            label={t("fields.industry")}
            value={state.industry ? tStep1(`industries.${state.industry}`) : "—"}
          />
          <SummaryRow
            label={t("fields.companySize")}
            value={state.companySize ? tStep1(`sizes.${state.companySize}`) : "—"}
          />
          {state.useCase && (
            <SummaryRow label={t("fields.useCase")} value={state.useCase} />
          )}
        </SummaryCard>

        {/* Branding */}
        <SummaryCard
          icon={<Palette className="w-4 h-4" />}
          title={t("sections.branding")}
          onEdit={() => goToStep(2)}
          editLabel={t("edit")}
        >
          <SummaryRow
            label={t("fields.logo")}
            value={state.logoPreview ? t("uploaded") : t("notConfigured")}
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary">{t("fields.primaryColor")}:</span>
            <div
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: state.primaryColor }}
            />
            <span className="text-xs text-text-secondary font-mono">{state.primaryColor}</span>
          </div>
          {state.productName && (
            <SummaryRow label={t("fields.productName")} value={state.productName} />
          )}
        </SummaryCard>

        {/* Provider */}
        <SummaryCard
          icon={<Cpu className="w-4 h-4" />}
          title={t("sections.provider")}
          onEdit={() => goToStep(3)}
          editLabel={t("edit")}
        >
          <SummaryRow
            label={t("fields.provider")}
            value={state.provider ? tStep3(`providers.${state.provider}`) : t("notConfigured")}
          />
          {state.model && (
            <SummaryRow
              label={t("fields.model")}
              value={
                state.provider && state.provider !== "custom"
                  ? tStep3(`models.${state.provider}.${state.model}`)
                  : state.model
              }
            />
          )}
        </SummaryCard>

        {/* Agent */}
        <SummaryCard
          icon={<Bot className="w-4 h-4" />}
          title={t("sections.agent")}
          onEdit={() => goToStep(4)}
          editLabel={t("edit")}
        >
          <SummaryRow
            label={t("fields.agentName")}
            value={state.agentName || t("notConfigured")}
          />
          <SummaryRow
            label={t("fields.preset")}
            value={
              state.preset === "custom"
                ? t("custom")
                : state.preset
                  ? tStep4(`presets.${state.preset}.name`)
                  : "—"
            }
          />
        </SummaryCard>

        {/* Channels */}
        <SummaryCard
          icon={<Radio className="w-4 h-4" />}
          title={t("sections.channels")}
          onEdit={() => goToStep(5)}
          editLabel={t("edit")}
        >
          <SummaryRow
            label={t("fields.activeChannels")}
            value={activeChannels || t("notConfigured")}
          />
        </SummaryCard>
      </div>

      {/* Checklist */}
      <div className="rounded-xl border border-border bg-navy p-6 mb-8">
        <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-4">
          {t("checklist.title")}
        </h3>
        <div className="space-y-2">
          <CheckItem checked={checks.company} label={t("checklist.company")} />
          <CheckItem checked={checks.provider} label={t("checklist.provider")} />
          <CheckItem checked={checks.agent} label={t("checklist.agent")} />
          <CheckItem checked={checks.channels} label={t("checklist.channels")} />
        </div>
      </div>

      {/* Activate button */}
      <div className="text-center">
        <button
          onClick={handleActivate}
          disabled={!allChecked || activating}
          className={`inline-flex items-center gap-2 rounded-xl font-semibold py-3.5 px-10 text-lg transition-all ${
            allChecked && !activating
              ? "bg-electric hover:bg-electric-hover text-white shadow-lg shadow-electric/25 glow"
              : "bg-border text-text-tertiary cursor-not-allowed"
          }`}
        >
          <Rocket className="w-5 h-5" />
          {activating ? t("activating") : tSteps("nav.finish")}
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────── Sub-components ────────────────────────── */

function SummaryCard({
  icon,
  title,
  onEdit,
  editLabel,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  onEdit: () => void;
  editLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-navy p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-text-primary font-medium text-sm">
          <span className="text-electric">{icon}</span>
          {title}
        </div>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs text-electric hover:underline"
        >
          <Pencil className="w-3 h-3" />
          {editLabel}
        </button>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="text-text-tertiary shrink-0">{label}:</span>
      <span className="text-text-secondary">{value}</span>
    </div>
  );
}

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {checked ? (
        <Check className="w-4 h-4 text-emerald shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-text-tertiary shrink-0" />
      )}
      <span
        className={`text-sm ${checked ? "text-text-primary" : "text-text-tertiary"}`}
      >
        {label}
      </span>
    </div>
  );
}
