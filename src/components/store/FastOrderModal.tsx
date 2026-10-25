'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { IProduct } from '@/types';
import CustomSelect from '@/components/common/CustomSelect';
import wilayasData from '@/data/algeria-wilayas.json';
import { useLanguage } from '@/context/LanguageContext';

interface FastOrderModalProps {
  product: IProduct;
  isOpen: boolean;
  onClose: () => void;
}

export default function FastOrderModal({ product, isOpen, onClose }: FastOrderModalProps) {
  const router = useRouter();
  const { t, dir } = useLanguage();

  // State
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
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

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];

  // Wilayas options for CustomSelect
  const wilayaOptions = useMemo(() => {
    return wilayasData.map((w) => ({
      value: String(w.id),
      label: `${w.code} - ${w.name} (${w.arabicName})`,
      badge: `${deliveryType === 'domicile' ? w.homeDeliveryFee : w.deskDeliveryFee} DZD`,
    }));
  }, [deliveryType]);

  // Current wilaya data
  const currentWilaya = useMemo(() => {
    return wilayasData.find((w) => String(w.id) === selectedWilayaId) || wilayasData[15]; // Alger fallback
  }, [selectedWilayaId]);

  // Communes options for CustomSelect
  const communeOptions = useMemo(() => {
    if (!currentWilaya || !currentWilaya.communes) return [];
    return currentWilaya.communes.map((c) => ({
      value: c,
      label: c,
    }));
  }, [currentWilaya]);

  // Pricing calculations
  const deliveryFee = deliveryType === 'domicile' ? currentWilaya.homeDeliveryFee : currentWilaya.deskDeliveryFee;
  const subtotal = product.price * quantity;
  const totalAmount = subtotal + deliveryFee;

  // Submit Handler
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Veuillez saisir votre nom et prénom.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg('Veuillez saisir un numéro de téléphone valide (ex: 0550 12 34 56).');
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
          items: [
            {
              productId: product._id || product.slug,
              title: product.title,
              slug: product.slug,
              image: product.images[0],
              price: product.price,
              quantity,
              selectedCompatibility: activeVariant.compatibility,
              selectedColor: activeVariant.color,
            },
          ],
          subtotal,
          deliveryType,
          deliveryFee,
          totalAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la validation.');
      }

      onClose();
      router.push(`/confirmation/${data.order.orderNumber}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-phone-void/80 backdrop-blur-md animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-phone-surface border border-phone-border shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-phone-surface-elevated text-phone-dim hover:text-phone-frost hover:bg-phone-border transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-phone-emerald text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Zap className="w-4 h-4 fill-phone-emerald" />
          <span>{t('expressOrder')}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-phone-frost mb-4">
          {t('checkoutTitle')}
        </h2>

        {/* Product Summary Plate */}
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-phone-surface-elevated border border-phone-border mb-6">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-phone-void shrink-0">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-phone-frost truncate">{product.title}</h3>
            <div className="flex items-center gap-2 text-xs font-mono text-phone-muted mt-0.5">
              <span className="text-phone-emerald font-bold">
                {product.price.toLocaleString('fr-DZ')} {t('priceDzd')}
              </span>
              <span>•</span>
              <span className="truncate">{activeVariant.compatibility}</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-phone-danger/10 border border-phone-danger/30 text-phone-danger text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="space-y-5">
          {/* Variant Compatibility Selector */}
          {product.variants.length > 1 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-2">
                {t('selectModel')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedVariantIndex(i)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      selectedVariantIndex === i
                        ? 'bg-phone-emerald/15 border-phone-emerald text-phone-emerald font-bold shadow-sm'
                        : 'bg-phone-surface-elevated border-phone-border text-phone-frost hover:border-phone-border-light'
                    }`}
                  >
                    <div className="truncate">{v.compatibility}</div>
                    <div className="text-[10px] text-phone-dim mt-0.5">{v.color}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customer Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-1.5">
                {t('fullName')} <span className="text-phone-emerald">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Mohamed Benali"
                className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-sm focus:outline-none focus:border-phone-emerald/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-1.5">
                {t('phone')} <span className="text-phone-emerald">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 0550 12 34 56"
                className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-sm font-mono focus:outline-none focus:border-phone-emerald/60"
              />
            </div>
          </div>

          {/* Wilaya Selection - 100% CustomSelect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelect
              label={t('wilaya')}
              required
              searchable
              value={selectedWilayaId}
              onChange={(val) => {
                setSelectedWilayaId(val);
                setSelectedCommune('');
              }}
              options={wilayaOptions}
              placeholder="Choisir votre wilaya..."
            />

            {communeOptions.length > 0 ? (
              <CustomSelect
                label={t('commune')}
                searchable
                value={selectedCommune}
                onChange={(val) => setSelectedCommune(val)}
                options={communeOptions}
                placeholder="Choisir votre commune..."
              />
            ) : (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-1.5">
                  {t('commune')}
                </label>
                <input
                  type="text"
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  placeholder="Ex: Bab Ezzouar"
                  className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-sm focus:outline-none focus:border-phone-emerald/60"
                />
              </div>
            )}
          </div>

          {/* Delivery Type Option */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted mb-2">
              Mode d&apos;expédition
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
                  <span className="text-xs font-bold">{t('homeDelivery')}</span>
                  {deliveryType === 'domicile' && <CheckCircle2 className="w-4 h-4 text-phone-emerald" />}
                </div>
                <div className="text-[11px] font-mono text-phone-emerald font-semibold">
                  {currentWilaya.homeDeliveryFee} {t('priceDzd')}
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
                  <span className="text-xs font-bold">{t('stopDesk')}</span>
                  {deliveryType === 'bureau' && <CheckCircle2 className="w-4 h-4 text-phone-emerald" />}
                </div>
                <div className="text-[11px] font-mono text-phone-emerald font-semibold">
                  {currentWilaya.deskDeliveryFee} {t('priceDzd')}
                </div>
              </button>
            </div>
          </div>

          {/* Quantity and Order Recap */}
          <div className="p-4 rounded-2xl bg-phone-void border border-phone-border space-y-2">
            <div className="flex items-center justify-between text-xs text-phone-muted">
              <span>{t('subtotal')}</span>
              <span className="font-mono text-phone-frost font-bold">
                {subtotal.toLocaleString('fr-DZ')} {t('priceDzd')}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-phone-muted">
              <span>{t('deliveryFee')}</span>
              <span className="font-mono text-phone-emerald font-bold">
                {deliveryFee.toLocaleString('fr-DZ')} {t('priceDzd')}
              </span>
            </div>
            <div className="pt-2 border-t border-phone-border flex items-center justify-between text-base font-bold text-phone-frost">
              <span>{t('totalCod')}</span>
              <span className="font-mono text-xl text-phone-frost">
                {totalAmount.toLocaleString('fr-DZ')} {t('priceDzd')}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-13 rounded-2xl bg-phone-frost hover:bg-white text-phone-void font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? '...' : t('confirmOrderBtn')}</span>
            </button>
            <p className="text-center text-[11px] text-phone-dim leading-relaxed">
              {t('codNotice')}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
