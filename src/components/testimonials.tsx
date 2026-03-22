"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

const testimonialKeys = ["marina", "rafael", "juliana"] as const;
const initials = { marina: "MC", rafael: "RM", juliana: "JA" };

export default function Testimonials() {
  const t = useTranslations("testimonials");
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonialKeys.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonialKeys.length) % testimonialKeys.length);
  }, []);

  // Auto-play every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const key = testimonialKeys[current];

  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-text-primary">
            {t("title")}
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border bg-navy min-h-[220px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -80 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full px-8 py-10 md:px-16"
              >
                <p className="text-lg md:text-xl text-text-primary italic leading-relaxed text-center">
                  &ldquo;{t(`items.${key}.quote`)}&rdquo;
                </p>

                <div className="w-12 h-0.5 bg-electric mx-auto my-6" />

                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center text-sm font-semibold text-text-secondary">
                    {initials[key]}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-text-primary">
                      {t(`items.${key}.name`)}
                    </p>
                    <p className="text-text-secondary text-sm">
                      {t(`items.${key}.role`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 rounded-full bg-navy border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-electric transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 rounded-full bg-navy border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-electric transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonialKeys.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                i === current
                  ? "bg-electric w-6"
                  : "bg-border hover:bg-text-tertiary"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
