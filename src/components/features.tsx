"use client";

import { motion } from "framer-motion";
import { Users, Key, Smartphone, Palette, Brain, ShoppingBag } from "lucide-react";

const features = [
  {
    icon: Users,
    iconBg: "bg-electric/20",
    iconColor: "text-electric",
    title: "Trabalho em equipe",
    description: "Seus agentes colaboram entre si com task board e delegação.",
  },
  {
    icon: Key,
    iconBg: "bg-cyan/20",
    iconColor: "text-cyan",
    title: "Sua chave, seu controle",
    description:
      "Traga sua API key (OpenAI, Anthropic, Google) ou use nosso provedor incluso. Sem vendor lock-in.",
  },
  {
    icon: Smartphone,
    iconBg: "bg-emerald/20",
    iconColor: "text-emerald",
    title: "Onde você já está",
    description: "Telegram, WhatsApp, Teams, Slack, Discord ou dashboard web.",
  },
  {
    icon: Palette,
    iconBg: "bg-amber/20",
    iconColor: "text-amber",
    title: "Sua marca, sua cara",
    description:
      "Logo, cores, domínio personalizado. Seus clientes veem a sua marca.",
  },
  {
    icon: Brain,
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
    title: "Fica mais esperto",
    description:
      "Cada conversa ensina algo novo. O agente adapta tom, preferências e expertise.",
  },
  {
    icon: ShoppingBag,
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
    title: "Expanda sem limites",
    description: "Plugins para CRM, finanças, calendário, propostas e mais.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Tudo que sua equipe de IA precisa
          </h2>
          <p className="text-text-secondary text-lg">
            Ferramentas poderosas, experiência simples.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="bg-navy rounded-2xl p-6 border border-border card-hover"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.iconBg}`}
              >
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
