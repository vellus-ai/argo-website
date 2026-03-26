"use client";

import { useTranslations } from "next-intl";
import { Bot, PenTool, Compass, Anchor, Eye, Target, Hammer, Wrench } from "lucide-react";
import type { SetupState } from "./WizardShell";

interface Props {
  state: SetupState;
  updateField: (field: keyof SetupState, value: unknown) => void;
}

const PRESET_KEYS = [
  "captain",
  "helmsman",
  "lookout",
  "gunner",
  "navigator",
  "blacksmith",
] as const;

const PRESET_ICONS: Record<string, React.ReactNode> = {
  captain: <Anchor className="w-5 h-5" />,
  helmsman: <Compass className="w-5 h-5" />,
  lookout: <Eye className="w-5 h-5" />,
  gunner: <Target className="w-5 h-5" />,
  navigator: <Compass className="w-5 h-5" />,
  blacksmith: <Hammer className="w-5 h-5" />,
};

export default function Step4Agent({ state, updateField }: Props) {
  const t = useTranslations("setup.step4");

  const handlePresetSelect = (preset: string) => {
    if (preset === state.preset) {
      // Deselect
      updateField("preset", "");
      updateField("agentName", "");
      updateField("persona", "");
    } else {
      updateField("preset", preset);
      updateField("agentName", t(`presets.${preset}.name`));
      updateField("persona", t(`presets.${preset}.description`));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          {t("title")}
        </h1>
        <p className="text-text-secondary text-lg">{t("subtitle")}</p>
      </div>

      <div className="space-y-8">
        {/* Presets grid */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
            <Wrench className="w-4 h-4 text-electric" />
            {t("preset")}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PRESET_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => handlePresetSelect(key)}
                className={`rounded-xl border p-4 text-left transition ${
                  state.preset === key
                    ? "border-electric bg-electric/10"
                    : "border-border bg-navy hover:border-border-light"
                }`}
              >
                <div
                  className={`mb-2 ${
                    state.preset === key ? "text-electric" : "text-text-tertiary"
                  }`}
                >
                  {PRESET_ICONS[key]}
                </div>
                <p
                  className={`font-semibold text-sm ${
                    state.preset === key ? "text-electric" : "text-text-primary"
                  }`}
                >
                  {t(`presets.${key}.name`)}
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  {t(`presets.${key}.area`)}
                </p>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                  {t(`presets.${key}.description`)}
                </p>
              </button>
            ))}
          </div>

          {/* Custom option */}
          <button
            onClick={() => {
              updateField("preset", "custom");
              updateField("agentName", "");
              updateField("persona", "");
            }}
            className={`w-full mt-3 rounded-xl border p-4 text-left transition ${
              state.preset === "custom"
                ? "border-electric bg-electric/10"
                : "border-border bg-navy hover:border-border-light"
            }`}
          >
            <div className="flex items-center gap-3">
              <PenTool
                className={`w-5 h-5 ${
                  state.preset === "custom" ? "text-electric" : "text-text-tertiary"
                }`}
              />
              <div>
                <p
                  className={`font-semibold text-sm ${
                    state.preset === "custom" ? "text-electric" : "text-text-primary"
                  }`}
                >
                  {t("presetCustom")}
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Agent Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <Bot className="w-4 h-4 text-electric" />
            {t("agentName")}
          </label>
          <input
            type="text"
            value={state.agentName}
            onChange={(e) => updateField("agentName", e.target.value)}
            placeholder={t("agentNamePlaceholder")}
            className="w-full bg-navy border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition"
          />
        </div>

        {/* Persona */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <PenTool className="w-4 h-4 text-electric" />
            {t("persona")}
          </label>
          <textarea
            value={state.persona}
            onChange={(e) => updateField("persona", e.target.value)}
            placeholder={t("personaPlaceholder")}
            rows={4}
            className="w-full bg-navy border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition resize-none"
          />
        </div>
      </div>
    </div>
  );
}
