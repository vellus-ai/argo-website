"use client";

interface GenderOption {
  value: string;
  label: string;
}

interface GenderSelectorProps {
  label: string;
  options: GenderOption[];
  value: string;
  onChange: (value: string) => void;
}

export function GenderSelector({ label, options, value, onChange }: GenderSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer rounded-lg border px-3 py-2 text-sm hover:bg-accent transition-colors [&:has(input:checked)]:border-primary [&:has(input:checked)]:bg-primary/5"
          >
            <input
              type="radio"
              name="gender"
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(e.target.value)}
              className="accent-primary"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
