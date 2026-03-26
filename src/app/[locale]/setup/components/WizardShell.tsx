"use client";

import { useReducer, useEffect, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Anchor, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";
import Step1Welcome from "./Step1Welcome";
import Step2Branding from "./Step2Branding";
import Step3Provider from "./Step3Provider";
import Step4Agent from "./Step4Agent";
import Step5Channels from "./Step5Channels";
import Step6Review from "./Step6Review";

/* ────────────────────────── Types ────────────────────────── */

export interface SetupState {
  currentStep: number;
  // Step 1
  companyName: string;
  industry: string;
  companySize: string;
  useCase: string;
  // Step 2
  logoFile: File | null;
  logoPreview: string;
  primaryColor: string;
  productName: string;
  faviconFile: File | null;
  // Step 3
  provider: string;
  apiKey: string;
  model: string;
  connectionTested: boolean;
  // Step 4
  agentName: string;
  persona: string;
  preset: string;
  // Step 5
  channels: Record<string, boolean>;
}

export type SetupAction =
  | { type: "SET_FIELD"; field: keyof SetupState; value: unknown }
  | { type: "SET_STEP"; step: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "LOAD_STATE"; state: Partial<SetupState> };

const TOTAL_STEPS = 6;
const STORAGE_KEY = "argo_setup_wizard";

const initialState: SetupState = {
  currentStep: 1,
  companyName: "",
  industry: "",
  companySize: "",
  useCase: "",
  logoFile: null,
  logoPreview: "",
  primaryColor: "#3B82F6",
  productName: "",
  faviconFile: null,
  provider: "",
  apiKey: "",
  model: "",
  connectionTested: false,
  agentName: "",
  persona: "",
  preset: "",
  channels: {
    webchat: true,
    telegram: false,
    whatsapp: false,
    discord: false,
    slack: false,
  },
};

function reducer(state: SetupState, action: SetupAction): SetupState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_STEP":
      return { ...state, currentStep: Math.max(1, Math.min(TOTAL_STEPS, action.step)) };
    case "NEXT_STEP":
      return { ...state, currentStep: Math.min(TOTAL_STEPS, state.currentStep + 1) };
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(1, state.currentStep - 1) };
    case "LOAD_STATE":
      return { ...state, ...action.state };
    default:
      return state;
  }
}

/* ────────────────────────── Helpers ────────────────────────── */

function serializableState(state: SetupState) {
  // Exclude File objects and sensitive data from serialization
  const { logoFile, faviconFile, apiKey, ...rest } = state;
  void logoFile;
  void faviconFile;
  void apiKey;
  return rest;
}

/** Sanitize a string for safe use in URL path segments */
function sanitizePathSegment(input: string): string {
  return input.replace(/[^a-zA-Z0-9_-]/g, "");
}

/* ────────────────────────── Step Labels ────────────────────────── */

const STEP_KEYS = ["welcome", "branding", "provider", "agent", "channels", "review"] as const;
const SKIPPABLE_STEPS = [3, 4, 5]; // Steps that can be skipped

/* ────────────────────────── Component ────────────────────────── */

export default function WizardShell() {
  const t = useTranslations("setup");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [saving, setSaving] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: "LOAD_STATE", state: parsed });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist state to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableState(state)));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  const updateField = useCallback(
    (field: keyof SetupState, value: unknown) => {
      dispatch({ type: "SET_FIELD", field, value });
    },
    []
  );

  // Save step to API
  const saveStep = useCallback(
    async (stepData: Record<string, unknown>) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) return;

      const rawTenantId = sessionStorage.getItem("argo_tenant_id");
      if (!rawTenantId) return;
      const tenantId = sanitizePathSegment(rawTenantId);

      setSaving(true);
      try {
        await fetch(`${apiUrl}/api/v1/tenants/${tenantId}/setup`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: state.currentStep, ...stepData }),
        });
      } catch {
        // Silently fail — user can retry
      } finally {
        setSaving(false);
      }
    },
    [state.currentStep]
  );

  const handleNext = useCallback(async () => {
    await saveStep(serializableState(state));
    dispatch({ type: "NEXT_STEP" });
  }, [saveStep, state]);

  const handleBack = useCallback(() => {
    dispatch({ type: "PREV_STEP" });
  }, []);

  const handleSkip = useCallback(() => {
    dispatch({ type: "NEXT_STEP" });
  }, []);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const canSkip = SKIPPABLE_STEPS.includes(state.currentStep);
  const isLastStep = state.currentStep === TOTAL_STEPS;
  const isFirstStep = state.currentStep === 1;

  // Validate step 1 (required)
  const isStep1Valid = state.companyName.trim().length > 0;

  const canProceed = (() => {
    switch (state.currentStep) {
      case 1:
        return isStep1Valid;
      case 2:
      case 3:
      case 4:
      case 5:
        return true; // optional steps
      case 6:
        return isStep1Valid;
      default:
        return true;
    }
  })();

  return (
    <div className="min-h-screen bg-midnight">
      {/* Header */}
      <header className="py-6 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Anchor className="w-6 h-6 text-electric" />
          <span className="text-xl font-bold text-text-primary">ARGO</span>
          <span className="text-text-tertiary text-sm ml-2">— {t("title")}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="flex items-center gap-1 mb-2">
          {STEP_KEYS.map((key, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === state.currentStep;
            const isCompleted = stepNum < state.currentStep;
            return (
              <button
                key={key}
                onClick={() => stepNum <= state.currentStep && goToStep(stepNum)}
                disabled={stepNum > state.currentStep}
                className={`flex-1 h-2 rounded-full transition-all relative after:absolute after:-inset-2 after:content-[''] ${
                  isActive
                    ? "bg-electric"
                    : isCompleted
                      ? "bg-electric/60"
                      : "bg-border"
                } ${stepNum <= state.currentStep ? "cursor-pointer" : "cursor-default"}`}
                aria-label={`${t(`steps.${key}`)} — ${isCompleted ? "completed" : isActive ? "current" : "upcoming"}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-text-tertiary mb-8">
          <span>
            {state.currentStep}/{TOTAL_STEPS}
          </span>
          <span>{t(`steps.${STEP_KEYS[state.currentStep - 1]}`)}</span>
        </div>
      </div>

      {/* Step content */}
      <main className="max-w-4xl mx-auto px-4 pb-32">
        {state.currentStep === 1 && (
          <Step1Welcome state={state} updateField={updateField} />
        )}
        {state.currentStep === 2 && (
          <Step2Branding state={state} updateField={updateField} />
        )}
        {state.currentStep === 3 && (
          <Step3Provider state={state} updateField={updateField} />
        )}
        {state.currentStep === 4 && (
          <Step4Agent state={state} updateField={updateField} />
        )}
        {state.currentStep === 5 && (
          <Step5Channels state={state} updateField={updateField} />
        )}
        {state.currentStep === 6 && (
          <Step6Review state={state} goToStep={goToStep} saveStep={saveStep} />
        )}
      </main>

      {/* Bottom navigation */}
      {!isLastStep && (
        <div className="fixed bottom-0 left-0 right-0 bg-navy border-t border-border py-4 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={isFirstStep}
              className={`inline-flex items-center gap-2 text-sm font-medium py-2.5 px-4 rounded-lg transition ${
                isFirstStep
                  ? "text-text-tertiary cursor-not-allowed"
                  : "text-text-secondary hover:text-text-primary hover:bg-navy-light"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {t("nav.back")}
            </button>

            <div className="flex items-center gap-3">
              {canSkip && (
                <button
                  onClick={handleSkip}
                  className="inline-flex items-center gap-1 text-sm text-text-tertiary hover:text-text-secondary py-2.5 px-4 rounded-lg transition"
                >
                  <SkipForward className="w-4 h-4" />
                  {t("nav.skip")}
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={!canProceed || saving}
                className={`inline-flex items-center gap-2 text-sm font-semibold py-2.5 px-6 rounded-lg transition ${
                  canProceed && !saving
                    ? "bg-electric hover:bg-electric-hover text-white shadow-lg shadow-electric/25"
                    : "bg-border text-text-tertiary cursor-not-allowed"
                }`}
              >
                {saving ? (
                  <span className="animate-pulse">{t("nav.next")}</span>
                ) : (
                  <>
                    {t("nav.next")}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
