"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "O Capitão me economiza 2h por dia só em priorização. É como ter um sócio que nunca dorme.",
    name: "Marina Costa",
    role: "CEO, TechFlow",
    initials: "MC",
  },
  {
    quote:
      "Antes eu gastava a manhã em relatórios. O Artilheiro entrega em 30 segundos.",
    name: "Rafael Mendes",
    role: "CFO, Pitflow",
    initials: "RM",
  },
  {
    quote:
      "O Navegador encontrou 3 cláusulas de risco que nosso advogado deixou passar.",
    name: "Juliana Alves",
    role: "COO, DataBridge",
    initials: "JA",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-text-primary">
            Quem usa, recomenda
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex gap-6 overflow-x-auto snap-x pb-4 scrollbar-hide"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              className="bg-navy rounded-2xl p-8 min-w-[350px] snap-center border border-border flex-shrink-0"
            >
              <p className="text-lg text-text-primary italic mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="w-12 h-0.5 bg-electric my-4" />

              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center text-sm font-semibold text-text-secondary">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
