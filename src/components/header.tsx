"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Produto", href: "#produto" },
  { label: "Preços", href: "#precos" },
  { label: "Docs", href: "#docs" },
  { label: "Blog", href: "#blog" },
  { label: "Sobre", href: "#sobre" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="glass fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Anchor className="h-6 w-6 text-electric" />
            <span className="text-lg font-bold text-white">ARGO</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-text-secondary transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#login"
              className="rounded-lg border border-border-light px-4 py-2 text-sm text-white transition-colors hover:bg-white/5"
            >
              Login
            </a>
            <a
              href="#signup"
              className="rounded-lg bg-electric px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-electric/90"
            >
              Comece Grátis
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-72 bg-navy border-l border-border p-6 pt-20 md:hidden"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-lg text-text-secondary transition-colors hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-border" />
              <a
                href="#login"
                className="rounded-lg border border-border-light px-4 py-3 text-center text-sm text-white transition-colors hover:bg-white/5"
              >
                Login
              </a>
              <a
                href="#signup"
                className="rounded-lg bg-electric px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-electric/90"
              >
                Comece Grátis
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
