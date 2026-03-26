"use client";

import { useTranslations } from "next-intl";
import { MessageCircle, Send, Phone, Gamepad2, Hash, Info } from "lucide-react";
import type { SetupState } from "./WizardShell";

interface Props {
  state: SetupState;
  updateField: (field: keyof SetupState, value: unknown) => void;
}

const CHANNEL_KEYS = ["webchat", "telegram", "whatsapp", "discord", "slack"] as const;

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  webchat: <MessageCircle className="w-5 h-5" />,
  telegram: <Send className="w-5 h-5" />,
  whatsapp: <Phone className="w-5 h-5" />,
  discord: <Gamepad2 className="w-5 h-5" />,
  slack: <Hash className="w-5 h-5" />,
};

// Plan-based restrictions: channels available by plan
const CHANNEL_MIN_PLAN: Record<string, string> = {
  webchat: "starter",
  telegram: "starter",
  whatsapp: "starter",
  discord: "pro",
  slack: "pro",
};

export default function Step5Channels({ state, updateField }: Props) {
  const t = useTranslations("setup.step5");

  const toggleChannel = (channel: string) => {
    const current = { ...state.channels };
    current[channel] = !current[channel];
    updateField("channels", current);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          {t("title")}
        </h1>
        <p className="text-text-secondary text-lg">{t("subtitle")}</p>
      </div>

      <div className="space-y-3">
        {CHANNEL_KEYS.map((key) => {
          const isEnabled = state.channels[key] ?? false;
          const minPlan = CHANNEL_MIN_PLAN[key];
          const isPro = minPlan === "pro";

          return (
            <button
              key={key}
              role="switch"
              aria-checked={isEnabled}
              aria-label={t(`channels.${key}.name`)}
              onClick={() => toggleChannel(key)}
              className={`w-full flex items-center gap-4 rounded-xl border p-4 transition ${
                isEnabled
                  ? "border-electric bg-electric/10"
                  : "border-border bg-navy hover:border-border-light"
              }`}
            >
              {/* Icon */}
              <div
                className={`shrink-0 ${
                  isEnabled ? "text-electric" : "text-text-tertiary"
                }`}
              >
                {CHANNEL_ICONS[key]}
              </div>

              {/* Text */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-semibold text-sm ${
                      isEnabled ? "text-electric" : "text-text-primary"
                    }`}
                  >
                    {t(`channels.${key}.name`)}
                  </p>
                  {isPro && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber/10 text-amber px-1.5 py-0.5 rounded">
                      Pro
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  {t(`channels.${key}.description`)}
                </p>
              </div>

              {/* Toggle */}
              <div
                className={`w-10 h-6 rounded-full transition-all shrink-0 relative ${
                  isEnabled ? "bg-electric" : "bg-border-light"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                    isEnabled ? "left-5" : "left-1"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-text-tertiary text-center mt-6 flex items-center justify-center gap-1">
        <Info className="w-3 h-3" />
        {t("skipHint")}
      </p>
    </div>
  );
}
