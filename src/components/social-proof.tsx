"use client";

import { Building2 } from "lucide-react";

const logos = Array.from({ length: 6 }, (_, i) => `Empresa ${i + 1}`);

export default function SocialProof() {
  return (
    <section className="border-y border-border bg-navy/50 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <p className="mb-8 text-center text-sm uppercase tracking-wider text-text-tertiary">
          Confiado por equipes que constroem o futuro
        </p>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {logos.map((name) => (
            <div
              key={name}
              className="flex items-center gap-2 opacity-50 transition-opacity hover:opacity-100"
            >
              <Building2 className="h-8 w-8 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
