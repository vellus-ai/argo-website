"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Anchor, Users, Server, CreditCard, Clock, AlertTriangle,
  RefreshCw, Shield, TrendingUp, Activity, ChevronDown, LogOut,
  Mail, Languages, Sparkles, Save, Eye, LayoutDashboard,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-argo.consilium.tec.br";

const VELLUS_SLUG = "vellus";

const SUPPORTED_LANGUAGES = [
  { code: "pt-BR", label: "PT-BR" },
  { code: "en-US", label: "EN-US" },
  { code: "es-ES", label: "ES-ES" },
  { code: "fr-FR", label: "FR-FR" },
  { code: "it-IT", label: "IT-IT" },
  { code: "de-DE", label: "DE-DE" },
] as const;

type LangCode = typeof SUPPORTED_LANGUAGES[number]["code"];

interface TemplateContent {
  subject: string;
  body: string;
}

type TemplateData = Record<LangCode, TemplateContent>;

const PLACEHOLDER_VARS = ["{{name}}", "{{company}}", "{{dashboardUrl}}", "{{userId}}", "{{gatewayToken}}", "{{trialDays}}", "{{plan}}"];

const SAMPLE_DATA: Record<string, string> = {
  "{{name}}": "Maria Silva",
  "{{company}}": "Acme Corp",
  "{{dashboardUrl}}": "https://acme-argo.consilium.tec.br",
  "{{userId}}": "usr_abc123",
  "{{gatewayToken}}": "gw_tok_xyz789",
  "{{trialDays}}": "7",
  "{{plan}}": "Pro",
};

const DEFAULT_PT_BR: TemplateContent = {
  subject: "Bem-vindo ao ARGO, {{name}}! Sua conta {{company}} est\u00e1 pronta",
  body: `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #0a0f1c; color: #e2e8f0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #2563eb, #0ea5e9); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">\u2693 ARGO</h1>
      <p style="color: rgba(255,255,255,0.85); margin-top: 8px;">Plataforma de Agentes IA</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #f1f5f9; margin-top: 0;">Ol\u00e1, {{name}}! \ud83d\ude80</h2>
      <p>Sua conta da empresa <strong style="color: #60a5fa;">{{company}}</strong> foi provisionada com sucesso no ARGO.</p>

      <div style="background-color: #0a0f1c; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #1e293b;">
        <h3 style="color: #60a5fa; margin-top: 0;">Dados de Acesso</h3>
        <p><strong>Dashboard:</strong> <a href="{{dashboardUrl}}" style="color: #0ea5e9;">{{dashboardUrl}}</a></p>
        <p><strong>Seu usu\u00e1rio:</strong> {{userId}}</p>
        <p><strong>Token do Gateway:</strong> <code style="background: #1e293b; padding: 2px 8px; border-radius: 4px; color: #fbbf24;">{{gatewayToken}}</code></p>
        <p><strong>Plano:</strong> {{plan}} | <strong>Trial:</strong> {{trialDays}} dias</p>
      </div>

      <h3 style="color: #f1f5f9;">Pr\u00f3ximos passos:</h3>
      <ol style="line-height: 1.8;">
        <li>Acesse seu <a href="{{dashboardUrl}}" style="color: #0ea5e9;">dashboard</a></li>
        <li>Configure seu primeiro agente IA</li>
        <li>Conecte seu LLM preferido (OpenAI, Anthropic, etc.)</li>
        <li>Crie seus fluxos de automa\u00e7\u00e3o</li>
      </ol>

      <p style="margin-top: 24px;">D\u00favidas? Responda este email ou acesse nossa documenta\u00e7\u00e3o.</p>
      <p style="color: #64748b; font-size: 14px; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
        Equipe ARGO \u2014 Vellus Tecnologia<br/>
        <a href="https://argo.vellus.tech" style="color: #0ea5e9;">argo.vellus.tech</a>
      </p>
    </div>
  </div>
</body>
</html>`,
};

const MOCK_TRANSLATIONS: Partial<Record<LangCode, TemplateContent>> = {
  "en-US": {
    subject: "Welcome to ARGO, {{name}}! Your {{company}} account is ready",
    body: `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #0a0f1c; color: #e2e8f0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #2563eb, #0ea5e9); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">\u2693 ARGO</h1>
      <p style="color: rgba(255,255,255,0.85); margin-top: 8px;">AI Agents Platform</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #f1f5f9; margin-top: 0;">Hello, {{name}}! \ud83d\ude80</h2>
      <p>Your <strong style="color: #60a5fa;">{{company}}</strong> account has been successfully provisioned on ARGO.</p>
      <div style="background-color: #0a0f1c; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #1e293b;">
        <h3 style="color: #60a5fa; margin-top: 0;">Access Details</h3>
        <p><strong>Dashboard:</strong> <a href="{{dashboardUrl}}" style="color: #0ea5e9;">{{dashboardUrl}}</a></p>
        <p><strong>Your user:</strong> {{userId}}</p>
        <p><strong>Gateway Token:</strong> <code style="background: #1e293b; padding: 2px 8px; border-radius: 4px; color: #fbbf24;">{{gatewayToken}}</code></p>
        <p><strong>Plan:</strong> {{plan}} | <strong>Trial:</strong> {{trialDays}} days</p>
      </div>
      <h3 style="color: #f1f5f9;">Next steps:</h3>
      <ol style="line-height: 1.8;">
        <li>Access your <a href="{{dashboardUrl}}" style="color: #0ea5e9;">dashboard</a></li>
        <li>Set up your first AI agent</li>
        <li>Connect your preferred LLM (OpenAI, Anthropic, etc.)</li>
        <li>Create your automation flows</li>
      </ol>
      <p style="margin-top: 24px;">Questions? Reply to this email or check our documentation.</p>
      <p style="color: #64748b; font-size: 14px; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
        ARGO Team \u2014 Vellus Tecnologia<br/>
        <a href="https://argo.vellus.tech" style="color: #0ea5e9;">argo.vellus.tech</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  },
  "es-ES": {
    subject: "Bienvenido a ARGO, {{name}}! Tu cuenta {{company}} est\u00e1 lista",
    body: `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #0a0f1c; color: #e2e8f0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #2563eb, #0ea5e9); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">\u2693 ARGO</h1>
      <p style="color: rgba(255,255,255,0.85); margin-top: 8px;">Plataforma de Agentes IA</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #f1f5f9; margin-top: 0;">\u00a1Hola, {{name}}! \ud83d\ude80</h2>
      <p>Tu cuenta de <strong style="color: #60a5fa;">{{company}}</strong> ha sido aprovisionada con \u00e9xito en ARGO.</p>
      <div style="background-color: #0a0f1c; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #1e293b;">
        <h3 style="color: #60a5fa; margin-top: 0;">Datos de Acceso</h3>
        <p><strong>Dashboard:</strong> <a href="{{dashboardUrl}}" style="color: #0ea5e9;">{{dashboardUrl}}</a></p>
        <p><strong>Tu usuario:</strong> {{userId}}</p>
        <p><strong>Token del Gateway:</strong> <code style="background: #1e293b; padding: 2px 8px; border-radius: 4px; color: #fbbf24;">{{gatewayToken}}</code></p>
        <p><strong>Plan:</strong> {{plan}} | <strong>Prueba:</strong> {{trialDays}} d\u00edas</p>
      </div>
      <h3 style="color: #f1f5f9;">Pr\u00f3ximos pasos:</h3>
      <ol style="line-height: 1.8;">
        <li>Accede a tu <a href="{{dashboardUrl}}" style="color: #0ea5e9;">dashboard</a></li>
        <li>Configura tu primer agente IA</li>
        <li>Conecta tu LLM preferido (OpenAI, Anthropic, etc.)</li>
        <li>Crea tus flujos de automatizaci\u00f3n</li>
      </ol>
      <p style="margin-top: 24px;">\u00bfPreguntas? Responde a este email o consulta nuestra documentaci\u00f3n.</p>
      <p style="color: #64748b; font-size: 14px; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
        Equipo ARGO \u2014 Vellus Tecnologia<br/>
        <a href="https://argo.vellus.tech" style="color: #0ea5e9;">argo.vellus.tech</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  },
  "fr-FR": {
    subject: "Bienvenue sur ARGO, {{name}} ! Votre compte {{company}} est pr\u00eat",
    body: `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #0a0f1c; color: #e2e8f0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #2563eb, #0ea5e9); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">\u2693 ARGO</h1>
      <p style="color: rgba(255,255,255,0.85); margin-top: 8px;">Plateforme d'Agents IA</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #f1f5f9; margin-top: 0;">Bonjour, {{name}} ! \ud83d\ude80</h2>
      <p>Votre compte <strong style="color: #60a5fa;">{{company}}</strong> a \u00e9t\u00e9 provisionn\u00e9 avec succ\u00e8s sur ARGO.</p>
      <div style="background-color: #0a0f1c; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #1e293b;">
        <h3 style="color: #60a5fa; margin-top: 0;">Donn\u00e9es d'Acc\u00e8s</h3>
        <p><strong>Dashboard :</strong> <a href="{{dashboardUrl}}" style="color: #0ea5e9;">{{dashboardUrl}}</a></p>
        <p><strong>Votre identifiant :</strong> {{userId}}</p>
        <p><strong>Token Gateway :</strong> <code style="background: #1e293b; padding: 2px 8px; border-radius: 4px; color: #fbbf24;">{{gatewayToken}}</code></p>
        <p><strong>Plan :</strong> {{plan}} | <strong>Essai :</strong> {{trialDays}} jours</p>
      </div>
      <h3 style="color: #f1f5f9;">Prochaines \u00e9tapes :</h3>
      <ol style="line-height: 1.8;">
        <li>Acc\u00e9dez \u00e0 votre <a href="{{dashboardUrl}}" style="color: #0ea5e9;">dashboard</a></li>
        <li>Configurez votre premier agent IA</li>
        <li>Connectez votre LLM pr\u00e9f\u00e9r\u00e9 (OpenAI, Anthropic, etc.)</li>
        <li>Cr\u00e9ez vos flux d'automatisation</li>
      </ol>
      <p style="margin-top: 24px;">Des questions ? R\u00e9pondez \u00e0 cet email ou consultez notre documentation.</p>
      <p style="color: #64748b; font-size: 14px; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
        \u00c9quipe ARGO \u2014 Vellus Tecnologia<br/>
        <a href="https://argo.vellus.tech" style="color: #0ea5e9;">argo.vellus.tech</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  },
  "it-IT": {
    subject: "Benvenuto su ARGO, {{name}}! Il tuo account {{company}} \u00e8 pronto",
    body: `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #0a0f1c; color: #e2e8f0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #2563eb, #0ea5e9); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">\u2693 ARGO</h1>
      <p style="color: rgba(255,255,255,0.85); margin-top: 8px;">Piattaforma di Agenti IA</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #f1f5f9; margin-top: 0;">Ciao, {{name}}! \ud83d\ude80</h2>
      <p>Il tuo account <strong style="color: #60a5fa;">{{company}}</strong> \u00e8 stato fornito con successo su ARGO.</p>
      <div style="background-color: #0a0f1c; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #1e293b;">
        <h3 style="color: #60a5fa; margin-top: 0;">Dati di Accesso</h3>
        <p><strong>Dashboard:</strong> <a href="{{dashboardUrl}}" style="color: #0ea5e9;">{{dashboardUrl}}</a></p>
        <p><strong>Il tuo utente:</strong> {{userId}}</p>
        <p><strong>Token Gateway:</strong> <code style="background: #1e293b; padding: 2px 8px; border-radius: 4px; color: #fbbf24;">{{gatewayToken}}</code></p>
        <p><strong>Piano:</strong> {{plan}} | <strong>Prova:</strong> {{trialDays}} giorni</p>
      </div>
      <h3 style="color: #f1f5f9;">Prossimi passi:</h3>
      <ol style="line-height: 1.8;">
        <li>Accedi al tuo <a href="{{dashboardUrl}}" style="color: #0ea5e9;">dashboard</a></li>
        <li>Configura il tuo primo agente IA</li>
        <li>Collega il tuo LLM preferito (OpenAI, Anthropic, ecc.)</li>
        <li>Crea i tuoi flussi di automazione</li>
      </ol>
      <p style="margin-top: 24px;">Domande? Rispondi a questa email o consulta la nostra documentazione.</p>
      <p style="color: #64748b; font-size: 14px; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
        Team ARGO \u2014 Vellus Tecnologia<br/>
        <a href="https://argo.vellus.tech" style="color: #0ea5e9;">argo.vellus.tech</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  },
  "de-DE": {
    subject: "Willkommen bei ARGO, {{name}}! Ihr {{company}}-Konto ist bereit",
    body: `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #0a0f1c; color: #e2e8f0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #2563eb, #0ea5e9); padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">\u2693 ARGO</h1>
      <p style="color: rgba(255,255,255,0.85); margin-top: 8px;">KI-Agenten-Plattform</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="color: #f1f5f9; margin-top: 0;">Hallo, {{name}}! \ud83d\ude80</h2>
      <p>Ihr <strong style="color: #60a5fa;">{{company}}</strong>-Konto wurde erfolgreich auf ARGO bereitgestellt.</p>
      <div style="background-color: #0a0f1c; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #1e293b;">
        <h3 style="color: #60a5fa; margin-top: 0;">Zugangsdaten</h3>
        <p><strong>Dashboard:</strong> <a href="{{dashboardUrl}}" style="color: #0ea5e9;">{{dashboardUrl}}</a></p>
        <p><strong>Ihr Benutzer:</strong> {{userId}}</p>
        <p><strong>Gateway-Token:</strong> <code style="background: #1e293b; padding: 2px 8px; border-radius: 4px; color: #fbbf24;">{{gatewayToken}}</code></p>
        <p><strong>Plan:</strong> {{plan}} | <strong>Testphase:</strong> {{trialDays}} Tage</p>
      </div>
      <h3 style="color: #f1f5f9;">N\u00e4chste Schritte:</h3>
      <ol style="line-height: 1.8;">
        <li>Greifen Sie auf Ihr <a href="{{dashboardUrl}}" style="color: #0ea5e9;">Dashboard</a> zu</li>
        <li>Richten Sie Ihren ersten KI-Agenten ein</li>
        <li>Verbinden Sie Ihr bevorzugtes LLM (OpenAI, Anthropic, etc.)</li>
        <li>Erstellen Sie Ihre Automatisierungsabl\u00e4ufe</li>
      </ol>
      <p style="margin-top: 24px;">Fragen? Antworten Sie auf diese E-Mail oder besuchen Sie unsere Dokumentation.</p>
      <p style="color: #64748b; font-size: 14px; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
        ARGO Team \u2014 Vellus Tecnologia<br/>
        <a href="https://argo.vellus.tech" style="color: #0ea5e9;">argo.vellus.tech</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  },
};

interface Tenant {
  id: string;
  slug: string;
  company_name: string;
  plan: string;
  billing_period: string;
  status: string;
  trial_ends_at: string;
  monthly_price: number;
  max_agents: number;
  max_users: number;
  max_storage_mb: number;
  created_at: string;
}

interface Stats {
  total_tenants: number;
  active_tenants: number;
  trial_tenants: number;
  suspended_tenants: number;
  timestamp: string;
}

function getInitialTemplateData(): TemplateData {
  const saved = typeof window !== "undefined" ? localStorage.getItem("argo_email_templates") : null;
  if (saved) {
    try { return JSON.parse(saved); } catch { /* ignore */ }
  }
  const empty: TemplateContent = { subject: "", body: "" };
  return {
    "pt-BR": { ...DEFAULT_PT_BR },
    "en-US": { ...empty },
    "es-ES": { ...empty },
    "fr-FR": { ...empty },
    "it-IT": { ...empty },
    "de-DE": { ...empty },
  };
}

export default function AdminPortal() {
  const t = useTranslations("admin");
  const [apiKey, setApiKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedTenant, setExpandedTenant] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<"dashboard" | "templates">("dashboard");

  // Template state
  const [templateData, setTemplateData] = useState<TemplateData>(getInitialTemplateData);
  const [activeLang, setActiveLang] = useState<LangCode>("pt-BR");
  const [translating, setTranslating] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const fetchData = useCallback(async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

      const [statsRes, tenantsRes] = await Promise.all([
        fetch(`${API_URL}/admin/v1/stats`, { headers }),
        fetch(`${API_URL}/admin/v1/tenants`, { headers }),
      ]);

      if (!statsRes.ok || !tenantsRes.ok) {
        if (statsRes.status === 401 || statsRes.status === 403) {
          throw new Error(t("errors.invalidKey"));
        }
        throw new Error(t("errors.fetchError"));
      }

      const statsData = await statsRes.json();
      const tenantsData = await tenantsRes.json();

      setStats(statsData);
      setTenants(tenantsData.tenants || []);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.unknown"));
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [t]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      sessionStorage.setItem("argo_admin_key", apiKey);
      fetchData(apiKey);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("argo_admin_key");
    if (saved) {
      setApiKey(saved);
      fetchData(saved);
    }
  }, [fetchData]);

  const handleLogout = () => {
    sessionStorage.removeItem("argo_admin_key");
    setAuthenticated(false);
    setApiKey("");
    setStats(null);
    setTenants([]);
  };

  const formatPrice = (centavos: number) => `R$ ${(centavos / 100).toFixed(2)}`;
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  const daysUntil = (iso: string) => Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const mrr = tenants.filter((t) => t.status === "active" && t.slug !== VELLUS_SLUG).reduce((sum, t) => sum + t.monthly_price, 0);
  const planCounts = tenants.reduce((acc, t) => {
    if (t.slug === VELLUS_SLUG) return acc;
    acc[t.plan] = (acc[t.plan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Template handlers
  const updateTemplate = (field: "subject" | "body", value: string) => {
    setTemplateData((prev) => ({
      ...prev,
      [activeLang]: { ...prev[activeLang], [field]: value },
    }));
  };

  const handleAutoTranslate = () => {
    setTranslating(true);
    setTimeout(() => {
      setTemplateData((prev) => {
        const updated = { ...prev };
        for (const lang of SUPPORTED_LANGUAGES) {
          if (lang.code !== "pt-BR" && MOCK_TRANSLATIONS[lang.code]) {
            updated[lang.code] = { ...MOCK_TRANSLATIONS[lang.code]! };
          }
        }
        return updated;
      });
      setTranslating(false);
    }, 2000);
  };

  const handleSaveTemplate = () => {
    localStorage.setItem("argo_email_templates", JSON.stringify(templateData));
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const previewHtml = useMemo(() => {
    let html = templateData[activeLang].body;
    for (const [key, value] of Object.entries(SAMPLE_DATA)) {
      html = html.replaceAll(key, value);
    }
    return html;
  }, [templateData, activeLang]);

  const previewSubject = useMemo(() => {
    let subj = templateData[activeLang].subject;
    for (const [key, value] of Object.entries(SAMPLE_DATA)) {
      subj = subj.replaceAll(key, value);
    }
    return subj;
  }, [templateData, activeLang]);

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Anchor className="w-10 h-10 text-electric mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-text-primary">ARGO Admin</h1>
            <p className="text-text-tertiary text-sm mt-1">{t("login.subtitle")}</p>
          </div>
          <form onSubmit={handleLogin} className="bg-navy rounded-xl border border-border p-6 space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Admin API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="argo-admin-..."
                className="w-full rounded-lg border border-border bg-midnight px-4 py-2.5 text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !apiKey}
              className="w-full bg-electric text-white rounded-lg py-2.5 font-semibold hover:bg-electric/90 disabled:opacity-50 cursor-pointer"
            >
              {loading ? t("login.authenticating") : t("login.enter")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard + Templates
  return (
    <div className="min-h-screen bg-midnight">
      {/* Header */}
      <header className="bg-navy border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Anchor className="w-6 h-6 text-electric" />
            <span className="text-lg font-bold text-text-primary">ARGO Admin</span>
            <span className="text-xs bg-amber/20 text-amber px-2 py-0.5 rounded-full">Portal</span>

            {/* Tab Pills */}
            <div className="flex items-center gap-1 ml-4 bg-midnight rounded-lg p-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-electric text-white"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("templates")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${
                  activeTab === "templates"
                    ? "bg-electric text-white"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Templates
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData(apiKey)}
              disabled={loading}
              className="flex items-center gap-1.5 text-text-tertiary hover:text-text-primary text-sm transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {t("dashboard.refresh")}
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-text-tertiary hover:text-red-400 text-sm transition cursor-pointer">
              <LogOut className="w-4 h-4" />
              {t("dashboard.logout")}
            </button>
          </div>
        </div>
      </header>

      {/* ===== DASHBOARD TAB ===== */}
      {activeTab === "dashboard" && (
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <KPICard icon={Users} label={t("kpi.totalTenants")} value={stats?.total_tenants ?? 0} />
            <KPICard icon={Activity} label={t("kpi.active")} value={stats?.active_tenants ?? 0} color="text-emerald" />
            <KPICard icon={Clock} label={t("kpi.inTrial")} value={stats?.trial_tenants ?? 0} color="text-amber" />
            <KPICard icon={AlertTriangle} label={t("kpi.suspended")} value={stats?.suspended_tenants ?? 0} color="text-red-400" />
            <KPICard icon={TrendingUp} label="MRR" value={formatPrice(mrr)} />
            <KPICard icon={Server} label={t("kpi.activeVMs")} value="1" />
          </div>

          {/* Plan Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-navy rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">{t("dashboard.byPlan")}</h3>
              <div className="space-y-2">
                {Object.entries(planCounts).map(([plan, count]) => (
                  <div key={plan} className="flex justify-between items-center">
                    <span className="text-text-secondary capitalize">{plan}</span>
                    <span className="text-text-primary font-bold">{count}</span>
                  </div>
                ))}
                {Object.keys(planCounts).length === 0 && <p className="text-text-tertiary text-sm">{t("dashboard.noTenants")}</p>}
              </div>
            </div>

            <div className="bg-navy rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">{t("dashboard.vmCapacity")}</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-text-secondary">Tenants/VM</span><span className="text-text-primary">{tenants.length}/50</span></div>
                <div className="w-full bg-midnight rounded-full h-2">
                  <div className="bg-electric rounded-full h-2 transition-all" style={{ width: `${Math.min(100, (tenants.length / 50) * 100)}%` }} />
                </div>
                <p className="text-xs text-text-tertiary">{t("dashboard.autoProvisioning", { threshold: Math.round(50 * 0.8) })}</p>
              </div>
            </div>

            <div className="bg-navy rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">{t("dashboard.expiringTrials")}</h3>
              <div className="space-y-2">
                {tenants.filter((t) => t.status === "active" && daysUntil(t.trial_ends_at) <= 3 && daysUntil(t.trial_ends_at) > 0).length > 0 ? (
                  tenants.filter((t) => t.status === "active" && daysUntil(t.trial_ends_at) <= 3 && daysUntil(t.trial_ends_at) > 0)
                    .map((t) => (
                      <div key={t.id} className="flex justify-between">
                        <span className="text-text-secondary text-sm">{t.slug}</span>
                        <span className="text-amber text-sm font-medium">{daysUntil(t.trial_ends_at)}d</span>
                      </div>
                    ))
                ) : (
                  <p className="text-text-tertiary text-sm">{t("dashboard.noExpiringTrials")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tenants Table */}
          <div className="bg-navy rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider">
                Tenants ({tenants.length})
              </h3>
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <Shield className="w-3.5 h-3.5" />
                {t("dashboard.lastUpdate")}: {stats?.timestamp ? formatDate(stats.timestamp) : "\u2014"}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-text-tertiary text-left">
                    <th className="px-5 py-3 font-medium">Slug</th>
                    <th className="px-5 py-3 font-medium">{t("table.company")}</th>
                    <th className="px-5 py-3 font-medium">{t("table.plan")}</th>
                    <th className="px-5 py-3 font-medium">{t("table.period")}</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Trial</th>
                    <th className="px-5 py-3 font-medium">{t("table.monthlyValue")}</th>
                    <th className="px-5 py-3 font-medium">{t("table.created")}</th>
                    <th className="px-5 py-3 font-medium w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <>
                      <tr
                        key={tenant.id}
                        className="border-b border-border/50 hover:bg-navy-light transition cursor-pointer"
                        onClick={() => setExpandedTenant(expandedTenant === tenant.id ? null : tenant.id)}
                      >
                        <td className="px-5 py-3 font-mono text-electric">{tenant.slug}</td>
                        <td className="px-5 py-3 text-text-primary">{tenant.company_name}</td>
                        <td className="px-5 py-3">
                          {tenant.slug === VELLUS_SLUG ? (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-electric/20 text-electric">
                              Propriet\u00e1rio
                            </span>
                          ) : (
                            <PlanBadge plan={tenant.plan} />
                          )}
                        </td>
                        <td className="px-5 py-3 text-text-secondary capitalize">{tenant.billing_period}</td>
                        <td className="px-5 py-3"><StatusBadge status={tenant.status} /></td>
                        <td className="px-5 py-3">
                          {daysUntil(tenant.trial_ends_at) > 0 ? (
                            <span className={daysUntil(tenant.trial_ends_at) <= 3 ? "text-amber" : "text-emerald"}>
                              {daysUntil(tenant.trial_ends_at)}d
                            </span>
                          ) : (
                            <span className="text-text-tertiary">{t("table.expired")}</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-text-primary">
                          {tenant.slug === VELLUS_SLUG ? (
                            <span className="text-electric font-medium">Incluso</span>
                          ) : (
                            formatPrice(tenant.monthly_price)
                          )}
                        </td>
                        <td className="px-5 py-3 text-text-tertiary">{formatDate(tenant.created_at)}</td>
                        <td className="px-5 py-3">
                          <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${expandedTenant === tenant.id ? "rotate-180" : ""}`} />
                        </td>
                      </tr>
                      {expandedTenant === tenant.id && (
                        <tr key={`${tenant.id}-detail`} className="bg-midnight/50">
                          <td colSpan={9} className="px-5 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div><span className="text-text-tertiary">{t("table.maxAgents")}:</span> <span className="text-text-primary ml-1">{tenant.max_agents}</span></div>
                              <div><span className="text-text-tertiary">{t("table.maxUsers")}:</span> <span className="text-text-primary ml-1">{tenant.max_users}</span></div>
                              <div><span className="text-text-tertiary">Storage:</span> <span className="text-text-primary ml-1">{tenant.max_storage_mb >= 1024 ? `${(tenant.max_storage_mb / 1024).toFixed(0)} GB` : `${tenant.max_storage_mb} MB`}</span></div>
                              <div><span className="text-text-tertiary">Dashboard:</span> <a href={`https://${tenant.slug}-argo.consilium.tec.br`} target="_blank" rel="noopener noreferrer" className="text-electric hover:underline ml-1">{tenant.slug}.argo...</a></div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                  {tenants.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-5 py-8 text-center text-text-tertiary">
                        {t("dashboard.noTenantsRegistered")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-text-tertiary text-center mt-8">
            {t("dashboard.footer")}
          </p>
        </main>
      )}

      {/* ===== TEMPLATES TAB ===== */}
      {activeTab === "templates" && (
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Mail className="w-5 h-5 text-electric" />
                Email Templates
              </h2>
              <p className="text-sm text-text-tertiary mt-1">
                Template do email de boas-vindas enviado ao provisionar um tenant
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAutoTranslate}
                disabled={translating}
                className="flex items-center gap-2 px-4 py-2 bg-midnight border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-electric/50 transition cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 text-amber ${translating ? "animate-pulse" : ""}`} />
                {translating ? "Traduzindo com IA..." : "Auto-traduzir para todos os idiomas"}
              </button>
              <button
                onClick={handleSaveTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-semibold hover:bg-electric/90 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Salvar template
              </button>
            </div>
          </div>

          {/* Success Toast */}
          {saveToast && (
            <div className="fixed top-4 right-4 z-50 bg-emerald/20 border border-emerald/40 text-emerald px-4 py-2.5 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Template salvo!
            </div>
          )}

          {/* Language Tabs */}
          <div className="flex items-center gap-1 mb-6 bg-navy rounded-lg p-1 border border-border w-fit">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setActiveLang(lang.code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer ${
                  activeLang === lang.code
                    ? "bg-electric text-white"
                    : "text-text-tertiary hover:text-text-secondary"
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                {lang.label}
              </button>
            ))}
          </div>

          {/* Placeholder Variables Reference */}
          <div className="bg-navy rounded-xl border border-border p-4 mb-6">
            <p className="text-xs text-text-tertiary uppercase tracking-wider font-semibold mb-2">
              Vari\u00e1veis dispon\u00edveis
            </p>
            <div className="flex flex-wrap gap-2">
              {PLACEHOLDER_VARS.map((v) => (
                <code key={v} className="text-xs bg-midnight px-2 py-1 rounded text-amber border border-border">
                  {v}
                </code>
              ))}
            </div>
          </div>

          {/* Editor + Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor Side */}
            <div className="space-y-4">
              <div className="bg-navy rounded-xl border border-border p-5">
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Assunto (Subject)
                </label>
                <input
                  type="text"
                  value={templateData[activeLang].subject}
                  onChange={(e) => updateTemplate("subject", e.target.value)}
                  placeholder={activeLang !== "pt-BR" ? "Clique em 'Auto-traduzir' para gerar" : ""}
                  className="w-full rounded-lg border border-border bg-midnight px-4 py-2.5 text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric text-sm"
                />
              </div>

              <div className="bg-navy rounded-xl border border-border p-5">
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Corpo (HTML Body)
                </label>
                <textarea
                  value={templateData[activeLang].body}
                  onChange={(e) => updateTemplate("body", e.target.value)}
                  placeholder={activeLang !== "pt-BR" ? "Clique em 'Auto-traduzir' para gerar" : ""}
                  rows={24}
                  className="w-full rounded-lg border border-border bg-midnight px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric text-sm font-mono leading-relaxed resize-y"
                />
              </div>
            </div>

            {/* Preview Side */}
            <div className="space-y-4">
              <div className="bg-navy rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-electric" />
                  <h3 className="text-sm font-semibold text-text-secondary">Preview</h3>
                  <span className="text-xs text-text-tertiary ml-auto">Dados de exemplo preenchidos</span>
                </div>

                {/* Subject Preview */}
                <div className="bg-midnight rounded-lg border border-border p-3 mb-3">
                  <p className="text-xs text-text-tertiary mb-1">Assunto:</p>
                  <p className="text-sm text-text-primary font-medium">
                    {previewSubject || <span className="text-text-tertiary italic">Sem assunto</span>}
                  </p>
                </div>

                {/* Body Preview */}
                <div className="bg-white rounded-lg overflow-hidden border border-border" style={{ minHeight: 400 }}>
                  {templateData[activeLang].body ? (
                    <iframe
                      srcDoc={previewHtml}
                      title="Email Preview"
                      className="w-full border-0"
                      style={{ minHeight: 500 }}
                      sandbox="allow-same-origin"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                      <div className="text-center">
                        <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Nenhum conte\u00fado para pr\u00e9-visualizar</p>
                        <p className="text-xs mt-1">Edite o template ou use Auto-traduzir</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-text-tertiary text-center mt-8">
            {t("dashboard.footer")}
          </p>
        </main>
      )}
    </div>
  );
}

// --- Sub-components ---

function KPICard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-navy rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color || "text-electric"}`} />
        <span className="text-xs text-text-tertiary uppercase tracking-wider">{label}</span>
      </div>
      <span className={`text-2xl font-bold ${color || "text-text-primary"}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald/20 text-emerald",
    suspended: "bg-red-400/20 text-red-400",
    cancelled: "bg-text-tertiary/20 text-text-tertiary",
    provisioning: "bg-amber/20 text-amber",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || styles.active}`}>
      {status}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    starter: "bg-electric/10 text-electric",
    pro: "bg-cyan/10 text-cyan",
    enterprise: "bg-amber/10 text-amber",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${styles[plan] || styles.starter}`}>
      {plan}
    </span>
  );
}
