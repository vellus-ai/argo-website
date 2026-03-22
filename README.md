# ARGO by Vellus — Landing Page

> Sua tripulação de IA.

Landing page e portal SaaS do ARGO — plataforma de agentes de IA para empresas.

## Stack

- **Next.js 15** (App Router, SSR/SSG)
- **Tailwind CSS 4** (design tokens via @theme)
- **Framer Motion** (animações)
- **Lucide React** (ícones)
- **TypeScript 5.8**

## Setup

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build   # production build
```

## Deploy

Vercel ou Cloudflare Pages com preview deploys automáticos.

## Estrutura

```
src/
├── app/
│   ├── layout.tsx      # Root layout (fonts, metadata, OG tags)
│   ├── page.tsx        # Home page (composição das seções)
│   └── globals.css     # Design tokens ARGO (@theme)
├── components/
│   ├── header.tsx      # Sticky nav glass-morphism
│   ├── hero.tsx        # Hero 100vh + stats
│   ├── social-proof.tsx
│   ├── crew.tsx        # 6 agent cards
│   ├── how-it-works.tsx
│   ├── features.tsx    # 6 feature cards
│   ├── pricing.tsx     # 3 plans (Starter, Pro, Enterprise)
│   ├── testimonials.tsx
│   ├── faq.tsx         # Accordion
│   ├── cta-banner.tsx  # Gradient CTA
│   └── footer.tsx      # 4 columns
└── lib/
```

## Documentação Relacionada

- [System Design Spec](../vellus-ai-agents-platform/docs/ARGO-Landing-Page-System-Design.md)
- [PRD Marketing](../vellus-ai-agents-platform/docs/ARGO-Landing-Page-PRD-Marketing.md)
- [Design System](../argoclaw/design/)

---

Vellus Tecnologia — 2026
