# ARGO Website

Next.js landing page, checkout flow, and admin portal for ARGO (argo.consilium.tec.br).

## Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, next-intl (i18n), Framer Motion, Stripe React SDK
**Package manager:** Use `npm` (check package.json for scripts)

## Project Structure

```
src/
├── app/[locale]/           Next.js app router pages
│   ├── admin/page.tsx      Admin portal (Dashboard, Templates, Plans tabs)
│   ├── checkout/page.tsx   Stripe checkout flow
│   └── ...                 Other pages
├── components/
│   └── pricing.tsx         Pricing section (fetches plans from API)
├── messages/               i18n translations (pt-BR, en-US, es-ES, fr-FR, it-IT, de-DE)
```

## Gestão de Contexto
- Sessões curtas e focadas (uma tarefa por sessão)
- `/compact` manual após ~45 min ou ao mudar de assunto
- Decisões importantes → registrar aqui na hora
- Fluxo: branch → commit → push → PR (nunca direto na main)

## Key Conventions

- Plans/prices fetched dynamically from `GET /api/v1/plans` (API_URL = `NEXT_PUBLIC_API_URL`)
- Static fallback prices used if API is unreachable: `{ starter: 50, pro: 99 }` (USD)
- Currency always displayed as **US$** (never R$)
- Admin portal authenticates via Bearer token (`argo_admin_key` in sessionStorage)
- All price values from API are in **USD cents** → divide by 100 for display

## Abordagem de Testes (OBRIGATÓRIO)

- **TDD**: Escrever testes antes da implementação sempre que possível
- **PBT** (Property-Based Testing): Aplicar para validações e transformações de dados
- **Cobertura mínima: 85%** — usar Jest/Vitest com `--coverage`
- Padrão de referência backend: `argo-provisioning-api/internal/models/plan_test.go`

## Environment Variables

```
NEXT_PUBLIC_API_URL=https://api-argo.consilium.tec.br
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```
