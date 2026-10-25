'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Search, PackageCheck, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import StoreShell from '@/components/store/StoreShell';
import { ISafeTrackingOrder } from '@/lib/orders-store';

function SuiviCommandeContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('num') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<ISafeTrackingOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTracking = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/suivi/${encodeURIComponent(searchVal.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Commande introuvable.');
      }

      setTrackingData(data.tracking);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de recherche';
      setErrorMsg(message);
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(query);
  };

  const steps = [
    { num: 1, label: 'En attente', desc: 'Commande enregistrée' },
    { num: 2, label: 'Confirmée', desc: 'Appel validé' },
    { num: 3, label: 'Préparation', desc: 'Emballage soigné' },
    { num: 4, label: 'Expédiée', desc: 'En route' },
    { num: 5, label: 'Livrée', desc: 'Encaissée' },
  ];

  return (
    <StoreShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Title Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-phone-surface border border-phone-border text-xs font-mono font-bold text-phone-emerald">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Suivi de Livraison • 58 Wilayas</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-phone-frost tracking-tight">
            Suivre l&apos;acheminement de mon colis
          </h1>
          <p className="text-sm text-phone-muted max-w-lg mx-auto">
            Saisissez votre référence de commande (ex: <code className="text-phone-frost">ABD-2026-4021</code>) ou votre numéro de téléphone.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-12">
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-phone-surface border border-phone-border shadow-card">
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-phone-dim absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: ABD-2026-1024 ou 0550123456"
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-transparent text-sm text-phone-frost placeholder-phone-dim font-mono focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-11 px-6 rounded-xl bg-phone-frost hover:bg-white text-phone-void font-bold text-xs uppercase tracking-wider flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="max-w-xl mx-auto mb-10 p-4 rounded-2xl bg-phone-danger/10 border border-phone-danger/30 text-phone-danger text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tracking Details View */}
        {trackingData && (
          <div className="rounded-3xl bg-phone-surface border border-phone-border p-6 sm:p-8 space-y-8 shadow-card animate-in fade-in-0 duration-300">
            {/* Header Plate */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-phone-border">
              <div>
                <div className="text-xs font-mono uppercase text-phone-dim">Numéro de Commande</div>
                <div className="text-2xl font-black font-mono text-phone-emerald tracking-wide">
                  {trackingData.orderNumber}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-phone-surface-elevated border border-phone-border text-left sm:text-right">
                <div className="text-[11px] font-mono text-phone-dim">Statut en temps réel</div>
                <div className="text-sm font-bold text-phone-frost">{trackingData.statusLabel}</div>
              </div>
            </div>

            {/* Visual Step Timeline */}
            <div className="space-y-4">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-phone-muted">
                Progression de l&apos;Acheminement
              </div>
              <div className="grid grid-cols-5 gap-2 text-center">
                {steps.map((st) => {
                  const isDone = trackingData.statusStep >= st.num;
                  const isCurrent = trackingData.statusStep === st.num;
                  return (
                    <div key={st.num} className="space-y-2">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          isDone
                            ? 'bg-phone-emerald shadow-glow'
                            : 'bg-phone-border'
                        }`}
                      />
                      <div className="space-y-0.5">
                        <div
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-phone-emerald'
                              : isDone
                              ? 'text-phone-frost'
                              : 'text-phone-dim'
                          }`}
                        >
                          {st.label}
                        </div>
                        <div className="text-[10px] text-phone-dim hidden sm:block">
                          {st.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Description Box */}
              <div className="p-4 rounded-2xl bg-phone-void border border-phone-border flex items-start gap-3">
                <Clock className="w-4 h-4 text-phone-emerald shrink-0 mt-0.5" />
                <p className="text-xs text-phone-muted leading-relaxed">
                  {trackingData.statusDescription}
                </p>
              </div>
            </div>

            {/* Destination & Items Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-phone-border">
              <div className="p-4 rounded-2xl bg-phone-surface-elevated border border-phone-border space-y-1 text-xs">
                <div className="font-bold text-phone-frost uppercase font-mono text-[11px]">
                  Destinataire &amp; Wilaya
                </div>
                <div className="text-phone-frost font-medium">
                  {trackingData.customerSummary.fullName}
                </div>
                <div className="font-mono text-phone-muted">
                  Tél : {trackingData.customerSummary.phoneMasked}
                </div>
                <div className="text-phone-dim">
                  Wilaya : {trackingData.wilayaName} ({trackingData.deliveryType})
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-phone-surface-elevated border border-phone-border space-y-1 text-xs">
                <div className="font-bold text-phone-frost uppercase font-mono text-[11px]">
                  Paiement à la Réception
                </div>
                <div className="text-phone-muted flex justify-between">
                  <span>Sous-total :</span>
                  <span className="font-mono text-phone-frost">
                    {trackingData.subtotal.toLocaleString('fr-DZ')} DZD
                  </span>
                </div>
                <div className="text-phone-muted flex justify-between">
                  <span>Frais de port :</span>
                  <span className="font-mono text-phone-emerald">
                    {trackingData.deliveryFee.toLocaleString('fr-DZ')} DZD
                  </span>
                </div>
                <div className="pt-1 border-t border-phone-border text-phone-frost font-bold flex justify-between text-sm">
                  <span>Total espèces :</span>
                  <span className="font-mono text-phone-frost">
                    {trackingData.totalAmount.toLocaleString('fr-DZ')} DZD
                  </span>
                </div>
              </div>
            </div>

            {/* Items Thumbnails List */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-phone-muted">
                Contenu du colis ({trackingData.items.length} article{trackingData.items.length > 1 ? 's' : ''})
              </div>
              <div className="divide-y divide-phone-border">
                {trackingData.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-phone-void shrink-0">
                      <Image src={it.image} alt={it.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="text-phone-frost font-semibold truncate">{it.title}</div>
                      <div className="text-phone-dim font-mono text-[11px]">
                        Qté: {it.quantity} • {it.selectedCompatibility} ({it.selectedColor})
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-phone-frost">
                      {(it.price * it.quantity).toLocaleString('fr-DZ')} DZD
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreShell>
  );
}

export default function SuiviCommandePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-phone-void" />}>
      <SuiviCommandeContent />
    </Suspense>
  );
}
