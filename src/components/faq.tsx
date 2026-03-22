"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "O que é o ARGO?",
    answer:
      "ARGO é uma plataforma que dá a cada profissional uma equipe de agentes de IA especializados: estratégia, operações, pesquisa, dados, jurídico e engenharia.",
  },
  {
    question: "Preciso saber programar?",
    answer:
      "Não. O setup leva 5 minutos e é 100% visual. Você conversa com seus agentes como conversa com um colega.",
  },
  {
    question: "O que é BYOK?",
    answer:
      "BYOK significa Bring Your Own Key. Você conecta sua conta da OpenAI, Anthropic, Google ou outro provedor. Controle custos e escolha o modelo.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. Criptografia AES-256-GCM, autenticação PCI DSS, LGPD compliant. Dados isolados por empresa.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim, sem multa e sem burocracia. Cancele direto no dashboard.",
  },
  {
    question: "O trial precisa de cartão?",
    answer:
      "Não. 7 dias grátis sem cartão. Só pedimos pagamento quando decidir continuar.",
  },
  {
    question: "Como funciona o white-label?",
    answer:
      "No Pro: logo e cores. No Enterprise: domínio próprio e email personalizado.",
  },
  {
    question: "Os agentes falam português?",
    answer:
      "Sim! 8 idiomas: pt-BR, en-US, es-ES, fr-FR, it-IT, de-DE, vi, zh.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-text-secondary text-lg">
            Tudo o que você precisa saber antes de começar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border py-5">
              <button
                onClick={() => toggle(index)}
                className="flex justify-between items-center w-full text-left cursor-pointer"
              >
                <span className="font-semibold text-lg text-text-primary pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-text-secondary" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-text-secondary pt-3 pb-1">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
