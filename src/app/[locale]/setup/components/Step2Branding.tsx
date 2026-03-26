"use client";

import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { Upload, Image as ImageIcon, Palette, Type, Globe, Check, X } from "lucide-react";
import type { SetupState } from "./WizardShell";

interface Props {
  state: SetupState;
  updateField: (field: keyof SetupState, value: unknown) => void;
}

const ACCEPTED_LOGO_TYPES = ["image/png", "image/jpeg", "image/svg+xml"];
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FAVICON_TYPES = ["image/png", "image/x-icon", "image/vnd.microsoft.icon"];
const MAX_FAVICON_SIZE = 1 * 1024 * 1024; // 1MB

const PRESET_COLORS = [
  "#3B82F6", // Electric blue (default)
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#8B5CF6", // Violet
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
  "#F97316", // Orange
];

export default function Step2Branding({ state, updateField }: Props) {
  const t = useTranslations("setup.step2");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");

  const handleLogoDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) processLogoFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const processLogoFile = useCallback(
    (file: File) => {
      setLogoError("");

      if (!ACCEPTED_LOGO_TYPES.includes(file.type)) {
        setLogoError(t("logoFormatError"));
        return;
      }
      if (file.size > MAX_LOGO_SIZE) {
        setLogoError(t("logoError"));
        return;
      }

      updateField("logoFile", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        updateField("logoPreview", e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [t, updateField]
  );

  const processFaviconFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_FAVICON_TYPES.includes(file.type)) return;
      if (file.size > MAX_FAVICON_SIZE) return;

      updateField("faviconFile", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFaviconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [updateField]
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
          {t("title")}
        </h1>
        <p className="text-text-secondary text-lg">{t("subtitle")}</p>
      </div>

      <div className="space-y-8">
        {/* Logo Upload */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <ImageIcon className="w-4 h-4 text-electric" />
            {t("logo")}
          </label>

          {state.logoPreview ? (
            <div className="relative rounded-xl border border-border bg-navy p-6 flex items-center gap-4">
              <img
                src={state.logoPreview}
                alt="Logo"
                className="w-16 h-16 object-contain rounded-lg bg-midnight p-2"
              />
              <div className="flex-1">
                <p className="text-sm text-emerald flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  {t("logoUploaded")}
                </p>
              </div>
              <button
                onClick={() => {
                  updateField("logoFile", null);
                  updateField("logoPreview", "");
                }}
                className="p-2 rounded-lg hover:bg-navy-light transition"
              >
                <X className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleLogoDrop}
              onClick={() => logoInputRef.current?.click()}
              className="rounded-xl border-2 border-dashed border-border hover:border-electric/50 bg-navy p-8 text-center cursor-pointer transition group"
            >
              <Upload className="w-8 h-8 text-text-tertiary mx-auto mb-3 group-hover:text-electric transition" />
              <p className="text-sm text-text-secondary">{t("logoHint")}</p>
            </div>
          )}

          {logoError && (
            <p className="text-red text-sm mt-2">{logoError}</p>
          )}

          <input
            ref={logoInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.svg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processLogoFile(file);
            }}
          />
        </div>

        {/* Primary Color */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <Palette className="w-4 h-4 text-electric" />
            {t("primaryColor")}
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateField("primaryColor", color)}
                className={`w-10 h-10 rounded-full border-2 transition ${
                  state.primaryColor === color
                    ? "border-white scale-110"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                aria-label={color}
              />
            ))}
            <label className="relative">
              <input
                type="color"
                value={state.primaryColor}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-10 h-10"
              />
              <div
                className="w-10 h-10 rounded-full border-2 border-dashed border-border-light flex items-center justify-center cursor-pointer hover:border-electric/50 transition"
                style={{ backgroundColor: state.primaryColor }}
              >
                <Palette className="w-4 h-4 text-white/70" />
              </div>
            </label>
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <Type className="w-4 h-4 text-electric" />
            {t("productName")}
          </label>
          <input
            type="text"
            value={state.productName}
            onChange={(e) => updateField("productName", e.target.value)}
            placeholder={t("productNamePlaceholder")}
            className="w-full bg-navy border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition"
          />
          <p className="text-xs text-text-tertiary mt-1">{t("productNameHint")}</p>
        </div>

        {/* Favicon */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
            <Globe className="w-4 h-4 text-electric" />
            {t("favicon")}
          </label>
          <div className="flex items-center gap-4">
            {faviconPreview ? (
              <div className="flex items-center gap-3">
                <img
                  src={faviconPreview}
                  alt="Favicon"
                  className="w-8 h-8 object-contain rounded bg-midnight p-1"
                />
                <button
                  onClick={() => {
                    updateField("faviconFile", null);
                    setFaviconPreview("");
                  }}
                  className="text-text-tertiary hover:text-red transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => faviconInputRef.current?.click()}
                className="rounded-lg border border-dashed border-border hover:border-electric/50 bg-navy py-2.5 px-4 text-sm text-text-secondary hover:text-text-primary transition"
              >
                {t("faviconHint")}
              </button>
            )}
          </div>
          <input
            ref={faviconInputRef}
            type="file"
            accept=".png,.ico"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processFaviconFile(file);
            }}
          />
        </div>
      </div>
    </div>
  );
}
