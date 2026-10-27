'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, Zap, ShieldCheck, CheckCircle2, Plus, Minus } from 'lucide-react';
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

  const initialVariantIdx = Math.max(
    0,
    product.variants.findIndex((v) => v.stock > 0)
  );

  // State
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(initialVariantIdx);
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
    const isAlgerianMobile = /^(0)(5|6|7)\d{8}$/.test(cleanPhone) || /^(\+213|00213)(5|6|7)\d{8}$/.test(cleanPhone) || /^(5|6|7)\d{8}$/.test(cleanPhone);
    if (!isAlgerianMobile) {
      setErrorMsg('Veuillez saisir un numéro de mobile algérien valide (ex: 0550 12 34 56, 06.. ou 07..).');
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
                {product.variants.map((v, i) => {
                  const out = v.stock <= 0;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={out}
                      onClick={() => {
                        setSelectedVariantIndex(i);
                        if (quantity > v.stock && v.stock > 0) setQuantity(v.stock);
                      }}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                        out
                          ? 'bg-phone-surface/30 border-phone-border/40 opacity-40 cursor-not-allowed select-none'
                          : selectedVariantIndex === i
                          ? 'bg-phone-emerald/15 border-phone-emerald text-phone-emerald font-bold shadow-sm cursor-pointer'
                          : 'bg-phone-surface-elevated border-phone-border text-phone-frost hover:border-phone-border-light cursor-pointer'
                      }`}
                    >
                      <div className="truncate flex items-center justify-between">
                        <span>{v.compatibility}</span>
                        {out && <span className="text-[9px] font-mono text-phone-danger">Épuisé</span>}
                      </div>
                      <div className="text-[10px] text-phone-dim mt-0.5 flex items-center justify-between">
                        <span>{v.color}</span>
                        {!out && v.stock <= 5 && (
                          <span className="text-[9px] font-mono text-amber-400">Reste {v.stock}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
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

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-phone-surface-elevated border border-phone-border">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-phone-frost">
                Quantité :
              </span>
              {activeVariant.stock > 0 && activeVariant.stock <= 5 && (
                <span className="text-[10px] font-mono text-amber-400">
                  Plus que {activeVariant.stock} en stock !
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={quantity <= 1 || activeVariant.stock <= 0}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-phone-surface text-phone-frost flex items-center justify-center hover:bg-phone-border transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-mono font-bold text-phone-frost text-sm">
                {activeVariant.stock <= 0 ? 0 : quantity}
              </span>
              <button
                type="button"
                disabled={activeVariant.stock <= 0 || quantity >= activeVariant.stock}
                onClick={() => setQuantity(Math.min(activeVariant.stock, quantity + 1))}
                className="w-8 h-8 rounded-lg bg-phone-surface text-phone-frost flex items-center justify-center hover:bg-phone-border transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
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
          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || activeVariant.stock <= 0}
              className="w-full h-15 sm:h-16 min-h-[58px] sm:min-h-[62px] rounded-2xl bg-phone-frost hover:bg-white text-phone-void font-extrabold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-5 h-5 text-phone-void" />
              <span>
                {isSubmitting
                  ? '...'
                  : activeVariant.stock <= 0
                  ? 'Variante Épuisée'
                  : t('confirmOrderBtn')}
              </span>
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
