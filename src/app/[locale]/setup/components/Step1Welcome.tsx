"use client";

import { useTranslations } from "next-intl";
import { Building2, Users, Briefcase, Target } from "lucide-react";
import type { SetupState } from "./WizardShell";

interface Props {
  state: SetupState;
  updateField: (field: keyof SetupState, value: unknown) => void;
}

const INDUSTRY_KEYS = [
  "technology",
  "finance",
  "healthcare",
  "education",
  "retail",
  "manufacturing",
  "services",
  "legal",
  "marketing",
  "other",
] as const;

const SIZE_KEYS = ["solo", "small", "medium", "large", "enterprise"] as const;

export default function Step1Welcome({ state, updateField }: Props) {
  const t = useTranslations("setup.step1");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          {t("title")}
        </h1>
        <p className="text-text-secondary text-lg">{t("subtitle")}</p>
      </div>

      <div className="space-y-6">
        {/* Company Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <Building2 className="w-4 h-4 text-electric" />
            {t("companyName")}
            <span className="text-red">*</span>
          </label>
          <input
            type="text"
            value={state.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            placeholder={t("companyNamePlaceholder")}
            className="w-full bg-navy border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <Briefcase className="w-4 h-4 text-electric" />
            {t("industry")}
          </label>
          <select
            value={state.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            className="w-full bg-navy border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition appearance-none"
          >
            <option value="" className="text-text-tertiary">
              {t("industryPlaceholder")}
            </option>
            {INDUSTRY_KEYS.map((key) => (
              <option key={key} value={key}>
                {t(`industries.${key}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Company Size */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <Users className="w-4 h-4 text-electric" />
            {t("companySize")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {SIZE_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => updateField("companySize", key)}
                className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition ${
                  state.companySize === key
                    ? "border-electric bg-electric/10 text-electric"
                    : "border-border bg-navy text-text-secondary hover:border-border-light"
                }`}
              >
                {t(`sizes.${key}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Use Case */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <Target className="w-4 h-4 text-electric" />
            {t("useCase")}
          </label>
          <textarea
            value={state.useCase}
            onChange={(e) => updateField("useCase", e.target.value)}
            placeholder={t("useCasePlaceholder")}
            rows={3}
            className="w-full bg-navy border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition resize-none"
          />
        </div>
      </div>
    </div>
  );
}
