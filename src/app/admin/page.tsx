"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Anchor, Users, Server, CreditCard, Clock, AlertTriangle,
  RefreshCw, Shield, TrendingUp, Activity, ChevronDown, LogOut,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-argo.consilium.tec.br";

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

export default function AdminPortal() {
  const [apiKey, setApiKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedTenant, setExpandedTenant] = useState<string | null>(null);

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
          throw new Error("API Key inválida");
        }
        throw new Error("Erro ao buscar dados");
      }

      const statsData = await statsRes.json();
      const tenantsData = await tenantsRes.json();

      setStats(statsData);
      setTenants(tenantsData.tenants || []);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const mrr = tenants.filter((t) => t.status === "active").reduce((sum, t) => sum + t.monthly_price, 0);
  const planCounts = tenants.reduce((acc, t) => {
    acc[t.plan] = (acc[t.plan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Anchor className="w-10 h-10 text-electric mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-text-primary">ARGO Admin</h1>
            <p className="text-text-tertiary text-sm mt-1">Portal Administrativo</p>
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
              {loading ? "Autenticando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-midnight">
      {/* Header */}
      <header className="bg-navy border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Anchor className="w-6 h-6 text-electric" />
            <span className="text-lg font-bold text-text-primary">ARGO Admin</span>
            <span className="text-xs bg-amber/20 text-amber px-2 py-0.5 rounded-full">Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData(apiKey)}
              disabled={loading}
              className="flex items-center gap-1.5 text-text-tertiary hover:text-text-primary text-sm transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-text-tertiary hover:text-red-400 text-sm transition cursor-pointer">
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <KPICard icon={Users} label="Total Tenants" value={stats?.total_tenants ?? 0} />
          <KPICard icon={Activity} label="Ativos" value={stats?.active_tenants ?? 0} color="text-emerald" />
          <KPICard icon={Clock} label="Em Trial" value={stats?.trial_tenants ?? 0} color="text-amber" />
          <KPICard icon={AlertTriangle} label="Suspensos" value={stats?.suspended_tenants ?? 0} color="text-red-400" />
          <KPICard icon={TrendingUp} label="MRR" value={formatPrice(mrr)} />
          <KPICard icon={Server} label="VMs Ativas" value="1" />
        </div>

        {/* Plan Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-navy rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">Por Plano</h3>
            <div className="space-y-2">
              {Object.entries(planCounts).map(([plan, count]) => (
                <div key={plan} className="flex justify-between items-center">
                  <span className="text-text-secondary capitalize">{plan}</span>
                  <span className="text-text-primary font-bold">{count}</span>
                </div>
              ))}
              {Object.keys(planCounts).length === 0 && <p className="text-text-tertiary text-sm">Nenhum tenant ainda</p>}
            </div>
          </div>

          <div className="bg-navy rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">Capacidade VM</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-text-secondary">Tenants/VM</span><span className="text-text-primary">{tenants.length}/50</span></div>
              <div className="w-full bg-midnight rounded-full h-2">
                <div className="bg-electric rounded-full h-2 transition-all" style={{ width: `${Math.min(100, (tenants.length / 50) * 100)}%` }} />
              </div>
              <p className="text-xs text-text-tertiary">Auto-provisioning nova VM aos 80% ({Math.round(50 * 0.8)} tenants)</p>
            </div>
          </div>

          <div className="bg-navy rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">Trials Expirando</h3>
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
                <p className="text-text-tertiary text-sm">Nenhum trial expirando em 3 dias</p>
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
              Última atualização: {stats?.timestamp ? formatDate(stats.timestamp) : "—"}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-text-tertiary text-left">
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">Plano</th>
                  <th className="px-5 py-3 font-medium">Período</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Trial</th>
                  <th className="px-5 py-3 font-medium">Valor/mês</th>
                  <th className="px-5 py-3 font-medium">Criado</th>
                  <th className="px-5 py-3 font-medium w-8"></th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <>
                    <tr
                      key={t.id}
                      className="border-b border-border/50 hover:bg-navy-light transition cursor-pointer"
                      onClick={() => setExpandedTenant(expandedTenant === t.id ? null : t.id)}
                    >
                      <td className="px-5 py-3 font-mono text-electric">{t.slug}</td>
                      <td className="px-5 py-3 text-text-primary">{t.company_name}</td>
                      <td className="px-5 py-3"><PlanBadge plan={t.plan} /></td>
                      <td className="px-5 py-3 text-text-secondary capitalize">{t.billing_period}</td>
                      <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                      <td className="px-5 py-3">
                        {daysUntil(t.trial_ends_at) > 0 ? (
                          <span className={daysUntil(t.trial_ends_at) <= 3 ? "text-amber" : "text-emerald"}>
                            {daysUntil(t.trial_ends_at)}d
                          </span>
                        ) : (
                          <span className="text-text-tertiary">Expirado</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-text-primary">{formatPrice(t.monthly_price)}</td>
                      <td className="px-5 py-3 text-text-tertiary">{formatDate(t.created_at)}</td>
                      <td className="px-5 py-3">
                        <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${expandedTenant === t.id ? "rotate-180" : ""}`} />
                      </td>
                    </tr>
                    {expandedTenant === t.id && (
                      <tr key={`${t.id}-detail`} className="bg-midnight/50">
                        <td colSpan={9} className="px-5 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div><span className="text-text-tertiary">Max Agentes:</span> <span className="text-text-primary ml-1">{t.max_agents}</span></div>
                            <div><span className="text-text-tertiary">Max Usuários:</span> <span className="text-text-primary ml-1">{t.max_users}</span></div>
                            <div><span className="text-text-tertiary">Storage:</span> <span className="text-text-primary ml-1">{t.max_storage_mb >= 1024 ? `${(t.max_storage_mb / 1024).toFixed(0)} GB` : `${t.max_storage_mb} MB`}</span></div>
                            <div><span className="text-text-tertiary">Dashboard:</span> <a href={`https://${t.slug}.argo.consilium.tec.br`} target="_blank" rel="noopener noreferrer" className="text-electric hover:underline ml-1">{t.slug}.argo...</a></div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {tenants.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-8 text-center text-text-tertiary">
                      Nenhum tenant registrado ainda. Aguardando primeiro checkout.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-text-tertiary text-center mt-8">
          ARGO Admin Portal — Dados atualizados em tempo real via Provisioning API
        </p>
      </main>
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
