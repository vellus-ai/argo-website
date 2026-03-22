"use client";

import { motion } from "framer-motion";

export default function CTABanner() {
  return (
    <section className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-electric to-cyan rounded-3xl mx-4 md:mx-auto max-w-5xl p-12 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Pronto para montar sua tripulação?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          7 dias grátis. Sem cartão de crédito. Sem complicação.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white text-electric font-semibold rounded-lg px-8 py-4 text-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Começar agora &rarr;
        </motion.button>

        <p className="text-white/60 text-sm mt-6">
          Setup em 5 minutos. Cancele quando quiser.
        </p>
      </motion.div>
    </section>
  );
}
