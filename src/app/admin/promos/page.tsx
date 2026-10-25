'use client';

import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Percent,
  Copy,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { IPromoCode } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import CustomSelect from '@/components/common/CustomSelect';

export default function AdminPromosPage() {
  const { t, language } = useLanguage();
  const [promos, setPromos] = useState<IPromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(3000);
  const [maxUsage, setMaxUsage] = useState<number>(100);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/promos');
      const data = await res.json();
      if (data.success) {
        setPromos(data.promos);
      }
    } catch (e) {
      console.warn('Failed to load promos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorMsg('Veuillez saisir un code coupon');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          type,
          value,
          minOrderAmount: minOrder,
          maxUsage,
          expiresAt,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPromos((prev) => [data.promo, ...prev]);
        setModalOpen(false);
        setCode('');
        setValue(10);
      } else {
        setErrorMsg(data.error || 'Erreur lors de la création');
      }
    } catch (err) {
      setErrorMsg('Erreur réseau');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce code promo ?')) return;

    try {
      const res = await fetch(`/api/admin/promos?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPromos((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (e) {
      console.warn('Failed to delete promo:', e);
    }
  };

  const typeOptions = [
    { value: 'percentage', label: 'Pourcentage de réduction (-%)' },
    { value: 'fixed', label: 'Montant fixe en Dinars (-DZD)' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-phone-frost tracking-tight flex items-center gap-2.5">
            <Tag className="w-7 h-7 text-phone-amber" />
            <span>{t('adminPromosTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-phone-muted mt-1">
            {t('adminPromosSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchPromos}
            className="p-2.5 rounded-xl bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-phone-emerald hover:bg-phone-emerald/90 text-phone-void font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('adminPromosNewBtn')}</span>
          </button>
        </div>
      </div>

      {copiedCode && (
        <div className="p-3 rounded-xl bg-phone-emerald/15 border border-phone-emerald/30 text-phone-emerald text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Code {copiedCode} copié dans le presse-papier !</span>
        </div>
      )}

      {/* Promos Table */}
      <div className="bg-phone-surface border border-phone-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-w-0">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-phone-surface-elevated/70 border-b border-phone-border text-phone-dim font-mono uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3 font-semibold">Code Promo</th>
                <th className="px-4 py-3 font-semibold">Type & Valeur</th>
                <th className="px-4 py-3 font-semibold">Panier Minimum</th>
                <th className="px-4 py-3 font-semibold">Utilisations</th>
                <th className="px-4 py-3 font-semibold">Date d’Expiration</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold text-right rtl:text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-phone-border/60">
              {promos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-phone-dim">
                    Aucun code promotionnel actif. Créez-en un pour vos campagnes marketing.
                  </td>
                </tr>
              ) : (
                promos.map((p) => {
                  const isExpired = new Date(p.expiresAt) < new Date();
                  const isLimitReached = p.maxUsage ? p.usedCount >= p.maxUsage : false;
                  const isActive = p.isActive && !isExpired && !isLimitReached;

                  return (
                    <tr key={p._id} className="hover:bg-phone-surface-elevated/40 transition-colors">
                      {/* Code */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-phone-frost text-sm tracking-wide bg-phone-surface-elevated px-2.5 py-1 rounded-lg border border-phone-border">
                            {p.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(p.code)}
                            className="p-1 rounded-lg text-phone-dim hover:text-phone-frost hover:bg-phone-surface-hover transition-colors cursor-pointer"
                            title="Copier le code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Value */}
                      <td className="px-4 py-3 font-mono font-bold text-phone-emerald whitespace-nowrap">
                        {p.type === 'percentage' ? `-${p.value}%` : `-${p.value.toLocaleString('fr-DZ')} DZD`}
                      </td>

                      {/* Min Cart */}
                      <td className="px-4 py-3 font-mono text-phone-muted whitespace-nowrap">
                        {p.minOrderAmount ? `${p.minOrderAmount.toLocaleString('fr-DZ')} DZD` : 'Aucun'}
                      </td>

                      {/* Usage */}
                      <td className="px-4 py-3 font-mono text-phone-dim whitespace-nowrap">
                        {p.usedCount} / {p.maxUsage ?? '∞'}
                      </td>

                      {/* Expiry */}
                      <td className="px-4 py-3 font-mono text-phone-muted whitespace-nowrap">
                        {p.expiresAt}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-phone-emerald/15 text-phone-emerald border border-phone-emerald/30'
                              : 'bg-phone-danger/15 text-phone-danger border border-phone-danger/30'
                          }`}
                        >
                          {isActive ? 'Actif' : isExpired ? 'Expiré' : 'Épuisé'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-right rtl:text-left whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => p._id && handleDelete(p._id)}
                          className="p-1.5 rounded-lg text-phone-danger hover:bg-phone-danger/10 transition-colors cursor-pointer"
                          title="Supprimer le code"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Promo Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-phone-surface border border-phone-border rounded-2xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-phone-border pb-4">
              <h3 className="text-base font-bold text-phone-frost flex items-center gap-2">
                <Tag className="w-4 h-4 text-phone-emerald" />
                <span>{t('adminPromosCreateModal')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-phone-dim hover:text-phone-frost cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-phone-danger/15 border border-phone-danger/30 text-phone-danger text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreatePromo} className="space-y-4">
              {/* Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                  {t('adminPromosCode')}
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex: ABDOU15 ou RAMADAN"
                  className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost font-mono font-bold text-sm focus:outline-none focus:border-phone-emerald uppercase tracking-wider"
                />
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                  Type de Remise
                </label>
                <CustomSelect
                  options={typeOptions}
                  value={type}
                  onChange={(val) => setType(val as 'percentage' | 'fixed')}
                />
              </div>

              {/* Value */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                    Valeur ({type === 'percentage' ? '%' : 'DZD'})
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                    className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost font-mono text-sm focus:outline-none focus:border-phone-emerald"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                    Panier Min (DZD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minOrder}
                    onChange={(e) => setMinOrder(parseInt(e.target.value) || 0)}
                    className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost font-mono text-sm focus:outline-none focus:border-phone-emerald"
                  />
                </div>
              </div>

              {/* Expiry & Usage */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                    Max Utilisations
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maxUsage}
                    onChange={(e) => setMaxUsage(parseInt(e.target.value) || 1)}
                    className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost font-mono text-sm focus:outline-none focus:border-phone-emerald"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                    Expiration
                  </label>
                  <input
                    type="date"
                    required
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost font-mono text-xs focus:outline-none focus:border-phone-emerald cursor-pointer"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-phone-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-phone-border text-phone-muted hover:text-phone-frost text-xs font-semibold cursor-pointer"
                >
                  {t('adminPromosCancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-phone-emerald hover:bg-phone-emerald/90 text-phone-void font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-transform hover:scale-[1.02]"
                >
                  {isSubmitting ? 'Création...' : t('adminPromosSave')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
