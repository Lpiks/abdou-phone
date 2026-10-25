'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function SlideCart() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in-0 duration-200">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-phone-void/80 backdrop-blur-sm transition-opacity cursor-pointer"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-phone-surface border-l border-phone-border shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-phone-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-phone-emerald" />
              <h2 className="text-base sm:text-lg font-bold text-phone-frost">
                {t('cartTitle')} <span className="text-xs font-mono font-normal text-phone-muted">({itemCount})</span>
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-xl bg-phone-surface-elevated text-phone-dim hover:text-phone-frost transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-phone-surface-elevated border border-phone-border flex items-center justify-center text-phone-dim">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-phone-frost">{t('cartEmpty')}</p>
                  <p className="text-xs text-phone-muted">
                    Découvrez nos chargeurs GaN, coques et câbles blindés.
                  </p>
                </div>
                <Link
                  href="/boutique"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-phone-frost text-phone-void text-xs font-bold uppercase tracking-wider hover:bg-white transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>{t('heroCtaCatalog')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((it, idx) => (
                <div
                  key={`${it.productId}-${it.selectedCompatibility}-${it.selectedColor}-${idx}`}
                  className="p-3.5 rounded-2xl bg-phone-surface-elevated border border-phone-border flex items-center gap-3.5"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-phone-void shrink-0">
                    <Image
                      src={it.image}
                      alt={it.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-phone-frost truncate">{it.title}</h3>
                    <div className="text-[11px] font-mono text-phone-dim truncate mt-0.5">
                      {it.selectedCompatibility} • {it.selectedColor}
                    </div>
                    <div className="text-xs font-mono font-bold text-phone-emerald mt-1">
                      {(it.price * it.quantity).toLocaleString('fr-DZ')} DZD
                    </div>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                    <button
                      type="button"
                      onClick={() => removeItem(it.productId, it.selectedCompatibility, it.selectedColor)}
                      className="p-1 rounded text-phone-dim hover:text-phone-danger transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-phone-surface border border-phone-border text-xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(it.productId, it.selectedCompatibility, it.selectedColor, -1)}
                        className="w-5 h-5 flex items-center justify-center rounded text-phone-muted hover:text-phone-frost cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-4 text-center font-mono font-bold text-phone-frost text-xs">
                        {it.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(it.productId, it.selectedCompatibility, it.selectedColor, 1)}
                        className="w-5 h-5 flex items-center justify-center rounded text-phone-muted hover:text-phone-frost cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-phone-border bg-phone-surface-elevated/50 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-phone-muted">
                  <span>{t('subtotal')}</span>
                  <span className="font-mono text-phone-frost font-bold">
                    {subtotal.toLocaleString('fr-DZ')} {t('priceDzd')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-phone-muted">
                  <span>{t('deliveryFee')}</span>
                  <span className="font-mono text-phone-emerald">58 Wilayas</span>
                </div>
              </div>

              <Link
                href="/commander"
                onClick={closeCart}
                className="w-full h-12 rounded-xl bg-phone-frost hover:bg-white text-phone-void font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{t('checkoutBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
