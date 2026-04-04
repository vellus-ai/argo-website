import { useTranslations } from "next-intl";
import { Anchor, ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  const t = useTranslations("legal.terms");

  return (
    <div className="min-h-screen bg-midnight">
      <header className="py-6 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Anchor className="w-6 h-6 text-electric" />
          <span className="text-xl font-bold text-text-primary">ARGO</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center">
          <FileText className="w-12 h-12 text-electric mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-text-primary mb-3">
            {t("title")}
          </h1>
          <span className="inline-block bg-amber/10 text-amber text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            {t("comingSoon")}
          </span>
          <p className="text-text-secondary max-w-md mx-auto mb-8">
            {t("description")}
          </p>
          <a
            href="/checkout"
            className="inline-flex items-center gap-2 text-electric hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToCheckout")}
          </a>
        </div>
      </main>

      <footer className="py-8 px-4 mt-16">
        <div className="max-w-3xl mx-auto text-center text-text-tertiary text-sm">
          &copy; 2026 Vellus Tecnologia
        </div>
      </footer>
    </div>
  );
}
