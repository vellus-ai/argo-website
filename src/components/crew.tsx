"use client";

import { motion } from "framer-motion";
import { Rocket, Search, Target, Compass, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Ship wheel (helm) icon — custom SVG matching Lucide style
function ShipWheel({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="8" />
      {/* Inner circle (hub) */}
      <circle cx="12" cy="12" r="2" />
      {/* 8 spokes with handles extending beyond outer circle */}
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
      {/* Inner spokes */}
      <line x1="12" y1="10" x2="12" y2="4" />
      <line x1="12" y1="14" x2="12" y2="20" />
      <line x1="10" y1="12" x2="4" y2="12" />
      <line x1="14" y1="12" x2="20" y2="12" />
    </svg>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComponent = LucideIcon | ((props: any) => React.ReactElement);

interface Agent {
  icon: IconComponent;
  name: string;
  area: string;
  description: string;
}

const agents: Agent[] = [
  {
    icon: Rocket,
    name: "Capitão",
    area: "Estratégia",
    description:
      "Seu estrategista pessoal. Prioriza o que importa, analisa cenários e sugere os próximos passos.",
  },
  {
    icon: ShipWheel,
    name: "Timoneiro",
    area: "Operações",
    description:
      "Operações sob controle. Gerencia tarefas, prazos e processos. Nada escapa.",
  },
  {
    icon: Search,
    name: "Vigia",
    area: "Pesquisa",
    description:
      "Pesquisa em profundidade. Investiga mercados, analisa concorrentes e entrega relatórios.",
  },
  {
    icon: Target,
    name: "Artilheiro",
    area: "Dados/Finanças",
    description:
      "Números que fazem sentido. Dashboards, KPIs, P&L, fluxo de caixa.",
  },
  {
    icon: Compass,
    name: "Navegador",
    area: "Jurídico",
    description:
      "Segurança jurídica. Revisa contratos, checa compliance e cuida da LGPD.",
  },
  {
    icon: Wrench,
    name: "Ferreiro",
    area: "Engenharia",
    description:
      "Código que funciona. Arquitetura, code review, DevOps e deploy.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Crew() {
  return (
    <section className="bg-midnight px-4 py-24" id="produto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="gradient-text text-4xl font-bold">
            Conheça sua tripulação
          </h2>
          <p className="mt-4 text-text-secondary">
            Seis agentes especializados. Um objetivo: fazer você render mais.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.name}
                variants={item}
                className="card-hover rounded-2xl border border-border bg-navy p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-light">
                  <Icon className="h-6 w-6 text-electric" />
                </div>
                <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                <span className="text-sm font-medium text-electric">
                  {agent.area}
                </span>
                <p className="mt-2 text-sm text-text-secondary">
                  {agent.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer note */}
        <p className="mt-12 text-center text-sm italic text-text-tertiary">
          Cada agente evolui com você. Quanto mais usa, mais inteligente fica.
        </p>
      </div>
    </section>
  );
}
