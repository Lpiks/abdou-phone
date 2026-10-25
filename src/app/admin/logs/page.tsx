'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Search, FileText, Lock, RefreshCw, AlertCircle, Download } from 'lucide-react';
import CustomSelect from '@/components/common/CustomSelect';
import { IAuditEntry } from '@/lib/audit';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLogsPage() {
  const { t, language } = useLanguage();
  const [logs, setLogs] = useState<IAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.warn('Failed to fetch audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const exportLogsCsv = () => {
    const headers = ['Horodatage', 'Action', 'Operateur', 'Entite Ciblee', 'Details', 'IP Masquee'];
    const rows = filteredLogs.map((log) => [
      `"${new Date(log.createdAt).toISOString()}"`,
      log.action,
      log.adminEmail,
      log.targetId || '',
      `"${log.details.replace(/"/g, '""')}"`,
      log.ipMasked,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abdou_phone_audit_logs_loi18_07_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const actionOptions = [
    { value: 'all', label: 'Toutes les actions' },
    { value: 'admin_login', label: 'Connexions Administrateur' },
    { value: 'order_status_update', label: 'Mises à jour Commandes' },
    { value: 'product_stock_update', label: 'Ajustement des Stocks' },
    { value: 'promo_create', label: 'Gestion Codes Promotionnels' },
    { value: 'system_init', label: 'Initialisation Système' },
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter !== 'all' && !log.action.includes(actionFilter)) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return (
          log.action.toLowerCase().includes(q) ||
          log.adminEmail.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          (log.targetId && log.targetId.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [logs, actionFilter, search]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Title & Legal Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-phone-emerald/10 border border-phone-emerald/30 text-phone-emerald text-xs font-mono font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Conformité Loi 18-07 / ANPDP &amp; Loi 18-05 (Algérie)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-phone-frost tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-phone-emerald" />
            <span>{t('adminLogsTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-phone-muted mt-1 max-w-2xl">
            {t('adminLogsSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchLogs}
            className="p-2.5 rounded-xl bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={exportLogsCsv}
            className="h-10 px-4 rounded-xl bg-phone-surface border border-phone-border hover:border-phone-frost/30 text-phone-frost font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('adminLogsExport')}</span>
          </button>
        </div>
      </div>

      {/* Filter Controls (100% CustomSelect) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-border grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-7 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-phone-muted font-mono">
            Recherche dans les logs
          </label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-phone-dim absolute start-3.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Action, email, référence, IP..."
              className="w-full h-11 ps-10 pe-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-xs font-medium focus:outline-none focus:border-phone-emerald/60"
            />
          </div>
        </div>

        <div className="md:col-span-5">
          <CustomSelect
            label="Type d'Opération"
            value={actionFilter}
            onChange={(val) => setActionFilter(val)}
            options={actionOptions}
            placeholder="Toutes les opérations..."
          />
        </div>
      </div>

      {/* Logs Table / Responsive List */}
      <div className="rounded-2xl bg-phone-surface border border-phone-border overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-phone-dim flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-phone-emerald" />
            <span>Chargement des journaux de conformité...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-20 text-center text-xs text-phone-dim font-medium">
            Aucun événement d&apos;audit trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto min-w-0">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="border-b border-phone-border bg-phone-surface-elevated/70 text-phone-dim font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">{t('adminLogsTimestamp')} (UTC+1)</th>
                  <th className="py-3 px-4 font-semibold">{t('adminLogsAction')}</th>
                  <th className="py-3 px-4 font-semibold">{t('adminLogsAdmin')}</th>
                  <th className="py-3 px-4 font-semibold">{t('adminLogsDetails')}</th>
                  <th className="py-3 px-4 font-semibold">{t('adminLogsIp')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-phone-border/60">
                {filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-phone-surface-elevated/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-phone-dim whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleDateString('fr-DZ', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-phone-surface-elevated border border-phone-border text-phone-frost uppercase">
                        <Lock className="w-2.5 h-2.5 text-phone-emerald" />
                        <span>{log.action}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-phone-frost whitespace-nowrap">
                      {log.adminEmail}
                    </td>

                    <td className="py-3.5 px-4 text-phone-muted">
                      {log.details}
                      {log.targetId && (
                        <span className="ml-1.5 font-mono font-bold text-phone-emerald">
                          [{log.targetId}]
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-phone-dim whitespace-nowrap">
                      {log.ipMasked}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ANPDP Legal Note Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-border text-xs text-phone-dim flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-phone-emerald shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-phone-frost block font-sans">
            Note de Conformité Réglementaire (Loi 18-07 &amp; Loi 18-05) :
          </strong>
          <p className="leading-relaxed">
            {t('adminLogsLawNotice')} Les adresses IP sont systématiquement masquées (ex: <code>127.0.0.***</code>) afin de respecter le principe de minimisation des données de l&apos;ANPDP tout en assurant l&apos;imputabilité des modifications de commandes et de stocks.
          </p>
        </div>
      </div>
    </div>
  );
}
