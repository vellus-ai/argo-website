"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Cpu, Key, Layers, Zap, Check, AlertCircle, Shield } from "lucide-react";
import type { SetupState } from "./WizardShell";

interface Props {
  state: SetupState;
  updateField: (field: keyof SetupState, value: unknown) => void;
}

const PROVIDERS = ["anthropic", "openai", "google", "custom"] as const;

const MODELS_BY_PROVIDER: Record<string, string[]> = {
  anthropic: ["claude-sonnet-4-20250514", "claude-3-5-haiku-20241022"],
  openai: ["gpt-4o", "gpt-4o-mini"],
  google: ["gemini-2.5-pro", "gemini-2.5-flash"],
};

export default function Step3Provider({ state, updateField }: Props) {
  const t = useTranslations("setup.step3");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const handleTestConnection = useCallback(async () => {
    if (!state.apiKey || !state.provider) return;

    setTesting(true);
    setTestResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        // Simulate test in dev
        await new Promise((r) => setTimeout(r, 1500));
        setTestResult("success");
        updateField("connectionTested", true);
        return;
      }

      const res = await fetch(`${apiUrl}/api/v1/llm/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: state.provider,
          apiKey: state.apiKey,
          model: state.model,
        }),
      });

      if (res.ok) {
        setTestResult("success");
        updateField("connectionTested", true);
      } else {
        setTestResult("error");
      }
    } catch {
      setTestResult("error");
    } finally {
      setTesting(false);
    }
  }, [state.apiKey, state.provider, state.model, updateField]);

  const currentModels = MODELS_BY_PROVIDER[state.provider] || [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          {t("title")}
        </h1>
        <p className="text-text-secondary text-lg">{t("subtitle")}</p>
      </div>

      <div className="space-y-6">
        {/* Provider */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <Cpu className="w-4 h-4 text-electric" />
            {t("provider")}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PROVIDERS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  updateField("provider", p);
                  updateField("model", "");
                  updateField("connectionTested", false);
                  setTestResult(null);
                }}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition text-center ${
                  state.provider === p
                    ? "border-electric bg-electric/10 text-electric"
                    : "border-border bg-navy text-text-secondary hover:border-border-light"
                }`}
              >
                {t(`providers.${p}`)}
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        {state.provider && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <Key className="w-4 h-4 text-electric" />
              {t("apiKey")}
            </label>
            <input
              type="password"
              value={state.apiKey}
              onChange={(e) => {
                updateField("apiKey", e.target.value);
                updateField("connectionTested", false);
                setTestResult(null);
              }}
              placeholder={t("apiKeyPlaceholder")}
              className="w-full bg-navy border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition font-mono"
            />
            <p className="text-xs text-text-tertiary mt-1 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {t("apiKeyHint")}
            </p>
          </div>
        )}

        {/* Model */}
        {state.provider && state.provider !== "custom" && currentModels.length > 0 && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
              <Layers className="w-4 h-4 text-electric" />
              {t("model")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {currentModels.map((model) => (
                <button
                  key={model}
                  onClick={() => updateField("model", model)}
                  className={`py-3 px-4 rounded-lg border text-sm font-medium transition ${
                    state.model === model
                      ? "border-electric bg-electric/10 text-electric"
                      : "border-border bg-navy text-text-secondary hover:border-border-light"
                  }`}
                >
                  {t(`models.${state.provider}.${model}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Test Connection */}
        {state.provider && state.apiKey && (
          <div>
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className={`inline-flex items-center gap-2 text-sm font-semibold py-2.5 px-6 rounded-lg transition ${
                testing
                  ? "bg-border text-text-tertiary cursor-not-allowed"
                  : "bg-navy border border-electric text-electric hover:bg-electric/10"
              }`}
            >
              <Zap className="w-4 h-4" />
              {testing ? t("testing") : t("testConnection")}
            </button>

            {testResult === "success" && (
              <p className="text-emerald text-sm mt-3 flex items-center gap-1">
                <Check className="w-4 h-4" />
                {t("testSuccess")}
              </p>
            )}
            {testResult === "error" && (
              <p className="text-red text-sm mt-3 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {t("testError")}
              </p>
            )}
          </div>
        )}

        {/* Skip hint */}
        <p className="text-xs text-text-tertiary text-center pt-4">
          {t("skipHint")}
        </p>
      </div>
    </div>
  );
}
