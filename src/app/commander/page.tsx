'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';
import StoreShell from '@/components/store/StoreShell';
import CustomSelect from '@/components/common/CustomSelect';
import { useCart } from '@/context/CartContext';
import wilayasData from '@/data/algeria-wilayas.json';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [selectedWilayaId, setSelectedWilayaId] = useState('16'); // Default Alger (16)
  const [selectedCommune, setSelectedCommune] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'domicile' | 'bureau'>('domicile');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 58 Wilayas options for CustomSelect
  const wilayaOptions = useMemo(() => {
    return wilayasData.map((w) => ({
      value: String(w.id),
      label: `${w.code} - ${w.name} (${w.arabicName})`,
      badge: `${deliveryType === 'domicile' ? w.homeDeliveryFee : w.deskDeliveryFee} DZD`,
    }));
  }, [deliveryType]);

  // Current selected wilaya
  const currentWilaya = useMemo(() => {
    return wilayasData.find((w) => String(w.id) === selectedWilayaId) || wilayasData[15];
  }, [selectedWilayaId]);

  // Communes options for CustomSelect
  const communeOptions = useMemo(() => {
    if (!currentWilaya || !currentWilaya.communes) return [];
    return currentWilaya.communes.map((c) => ({
      value: c,
      label: c,
    }));
  }, [currentWilaya]);

  const deliveryFee =
    deliveryType === 'domicile'
      ? currentWilaya.homeDeliveryFee
      : currentWilaya.deskDeliveryFee;

  const totalAmount = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Votre panier est vide.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('Veuillez saisir votre nom et prénom.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg('Veuillez saisir un numéro de téléphone valide.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            fullName: fullName.trim(),
            phone: cleanPhone,
            secondaryPhone: secondaryPhone.trim() || undefined,
            wilayaId: currentWilaya.id,
            wilayaName: currentWilaya.name,
            commune: selectedCommune || currentWilaya.communes[0] || currentWilaya.name,
            address: address.trim() || `Livraison à ${currentWilaya.name}`,
            notes: notes.trim() || undefined,
          },
          items,
          deliveryType,
          deliveryFee,
          totalAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la commande.');
      }

      clearCart();
      router.push(`/confirmation/${data.order.orderNumber}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <StoreShell>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-phone-surface border border-phone-border flex items-center justify-center text-phone-dim">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-phone-frost">Votre panier est actuellement vide</h1>
          <p className="text-sm text-phone-muted">
            Veuillez ajouter des accessoires smartphone à votre panier avant de passer commande.
          </p>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-phone-frost text-phone-void text-xs font-bold uppercase tracking-wider hover:bg-white transition-transform hover:scale-105 cursor-pointer"
          >
            <span>Découvrir le catalogue (~100 produits)</span>
          </Link>
        </div>
      </StoreShell>
    );
  }

  return (
    <StoreShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header Breadcrumbs */}
        <div className="mb-8">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continuer mes achats</span>
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-phone-frost tracking-tight mt-3">
            Finalisation de votre commande
          </h1>
          <p className="text-xs sm:text-sm text-phone-muted mt-1">
            Paiement en espèces à la livraison dans les 58 Wilayas d&apos;Algérie.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 rounded-2xl bg-phone-danger/10 border border-phone-danger/30 text-phone-danger text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-phone-surface border border-phone-border space-y-5">
              <h2 className="text-base font-bold uppercase tracking-wider text-phone-emerald font-mono flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>1. Informations du Destinataire</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-1.5">
                    Nom &amp; Prénom <span className="text-phone-emerald">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Amine Brahimi"
                    className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-sm focus:outline-none focus:border-phone-emerald/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-1.5">
                    Téléphone Principal <span className="text-phone-emerald">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 0661 23 45 67"
                    className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-sm font-mono focus:outline-none focus:border-phone-emerald/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-1.5">
                  Téléphone Secondaire (Optionnel)
                </label>
                <input
                  type="tel"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  placeholder="Ex: 0550 98 76 54"
                  className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-sm font-mono focus:outline-none focus:border-phone-emerald/60"
                />
              </div>

              {/* Wilaya Selection - 100% CustomSelect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <CustomSelect
                  label="Wilaya de Livraison"
                  required
                  searchable
                  value={selectedWilayaId}
                  onChange={(val) => {
                    setSelectedWilayaId(val);
                    setSelectedCommune('');
                  }}
                  options={wilayaOptions}
                  placeholder="Sélectionner la wilaya..."
                />

                {communeOptions.length > 0 ? (
                  <CustomSelect
                    label="Commune"
                    searchable
                    value={selectedCommune}
                    onChange={(val) => setSelectedCommune(val)}
                    options={communeOptions}
                    placeholder="Choisir votre commune..."
                  />
                ) : (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-1.5">
                      Commune
                    </label>
                    <input
                      type="text"
                      value={selectedCommune}
                      onChange={(e) => setSelectedCommune(e.target.value)}
                      placeholder="Ex: Kouba, Rouiba..."
                      className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-sm focus:outline-none focus:border-phone-emerald/60"
                    />
                  </div>
                )}
              </div>

              {/* Delivery Type Toggle */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-2">
                  Option de Réception
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('domicile')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      deliveryType === 'domicile'
                        ? 'bg-phone-emerald/10 border-phone-emerald text-phone-frost shadow-sm'
                        : 'bg-phone-surface-elevated border-phone-border text-phone-muted hover:border-phone-border-light'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">À Domicile</span>
                      {deliveryType === 'domicile' && (
                        <CheckCircle2 className="w-4 h-4 text-phone-emerald" />
                      )}
                    </div>
                    <div className="text-xs font-mono text-phone-emerald font-semibold">
                      {currentWilaya.homeDeliveryFee} DZD
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('bureau')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      deliveryType === 'bureau'
                        ? 'bg-phone-emerald/10 border-phone-emerald text-phone-frost shadow-sm'
                        : 'bg-phone-surface-elevated border-phone-border text-phone-muted hover:border-phone-border-light'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">Point Relais (Stop Desk)</span>
                      {deliveryType === 'bureau' && (
                        <CheckCircle2 className="w-4 h-4 text-phone-emerald" />
                      )}
                    </div>
                    <div className="text-xs font-mono text-phone-emerald font-semibold">
                      {currentWilaya.deskDeliveryFee} DZD
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-1.5">
                  Adresse exacte ou point de repère
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Cité 1200 logts, Bâtiment B, en face de la mosquée"
                  className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-sm focus:outline-none focus:border-phone-emerald/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-1.5">
                  Remarques ou instructions de livraison (Optionnel)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Appelez-moi avant 14h pour la livraison..."
                  className="w-full p-3 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-xs focus:outline-none focus:border-phone-emerald/60"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirmation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-phone-surface border border-phone-border space-y-5">
              <h2 className="text-base font-bold uppercase tracking-wider text-phone-frost font-mono">
                Récapitulatif de la Commande
              </h2>

              {/* Items List */}
              <div className="divide-y divide-phone-border max-h-72 overflow-y-auto pr-1">
                {items.map((it, idx) => (
                  <div key={idx} className="py-3 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-phone-void shrink-0">
                      <Image src={it.image} alt={it.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-phone-frost truncate">{it.title}</h4>
                      <p className="text-[11px] font-mono text-phone-dim truncate">
                        Qté : {it.quantity} • {it.selectedCompatibility}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-phone-frost shrink-0">
                      {(it.price * it.quantity).toLocaleString('fr-DZ')} DZD
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation Lines */}
              <div className="pt-4 border-t border-phone-border space-y-2 text-xs">
                <div className="flex justify-between text-phone-muted">
                  <span>Sous-total articles :</span>
                  <span className="font-mono text-phone-frost font-bold">
                    {subtotal.toLocaleString('fr-DZ')} DZD
                  </span>
                </div>
                <div className="flex justify-between text-phone-muted">
                  <span>Frais d&apos;expédition ({currentWilaya.name}) :</span>
                  <span className="font-mono text-phone-emerald font-bold">
                    {deliveryFee.toLocaleString('fr-DZ')} DZD
                  </span>
                </div>
                <div className="pt-3 border-t border-phone-border flex justify-between text-base font-bold text-phone-frost">
                  <span>Total à régler en espèces :</span>
                  <span className="font-mono text-xl text-phone-frost">
                    {totalAmount.toLocaleString('fr-DZ')} DZD
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-15 sm:h-16 min-h-[58px] sm:min-h-[62px] rounded-2xl bg-phone-frost hover:bg-white text-phone-void font-extrabold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-5 h-5 text-phone-void" />
                  <span>{isSubmitting ? 'Traitement...' : 'Confirmer la Commande (Paiement Cash)'}</span>
                </button>
                <p className="text-center text-[11px] text-phone-dim leading-relaxed">
                  Paiement sécurisé en espèces à la livraison. Vous vérifiez le contenu de votre colis avant de régler le livreur.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </StoreShell>
  );
}
