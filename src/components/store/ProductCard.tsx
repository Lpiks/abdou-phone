'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Zap, Eye, Check } from 'lucide-react';
import { IProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import FastOrderModal from './FastOrderModal';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [isFastModalOpen, setIsFastModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const defaultVariant = product.variants[0] || {
    compatibility: 'Universel',
    color: 'Standard',
    stock: 10,
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product._id || product.slug,
      title: product.title,
      slug: product.slug,
      image: product.images[0] || '',
      price: product.price,
      quantity: 1,
      selectedCompatibility: defaultVariant.compatibility,
      selectedColor: defaultVariant.color,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleOpenFastOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFastModalOpen(true);
  };

  return (
    <>
      <div className="group relative flex flex-col rounded-2xl bg-phone-surface border border-phone-border hover:border-phone-border-light hover:bg-phone-surface-elevated transition-all duration-300 shadow-sm hover:shadow-card overflow-hidden">
        {/* Card Header & Badges */}
        <div className="relative aspect-square w-full bg-phone-void/60 overflow-hidden">
          <Link href={`/produit/${product.slug}`} className="block w-full h-full cursor-pointer relative">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Badges Container */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none z-10">
            {product.badges && product.badges.length > 0 && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-phone-frost text-phone-void shadow-sm">
                {product.badges[0]}
              </span>
            )}
            {product.wattage && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-phone-void/80 border border-phone-border text-phone-emerald backdrop-blur-sm">
                {product.wattage}
              </span>
            )}
          </div>

          {/* In-Stock Status Dot */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-phone-void/85 border border-phone-border backdrop-blur-sm z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-phone-emerald animate-pulse" />
            <span className="text-[9px] font-mono uppercase font-semibold text-phone-frost">
              {t('inStock')}
            </span>
          </div>

          {/* Hover Quick Actions Overlay */}
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              type="button"
              onClick={handleOpenFastOrder}
              className="flex-1 h-10.5 rounded-xl bg-phone-frost hover:bg-white text-phone-void font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-phone-void text-phone-void" />
              <span>{t('expressOrder')}</span>
            </button>

            <Link
              href={`/produit/${product.slug}`}
              className="h-10.5 w-10.5 rounded-xl bg-phone-surface border border-phone-border text-phone-frost hover:bg-phone-surface-hover flex items-center justify-center shrink-0 transition-transform hover:scale-105 cursor-pointer"
              title="Voir les détails"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
          <div className="space-y-1.5">
            {/* Brand & Category */}
            <div className="flex items-center justify-between text-[11px] font-mono text-phone-dim">
              <span className="uppercase tracking-wider font-semibold text-phone-muted">
                {product.brand}
              </span>
              <span>{defaultVariant.compatibility}</span>
            </div>

            {/* Product Title */}
            <Link
              href={`/produit/${product.slug}`}
              className="block font-semibold text-sm sm:text-base text-phone-frost hover:text-phone-emerald transition-colors line-clamp-2 leading-snug cursor-pointer"
            >
              {product.title}
            </Link>
          </div>

          {/* Price & Action Button */}
          <div className="pt-2 border-t border-phone-border flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-bold font-mono text-phone-frost">
                  {product.price.toLocaleString('fr-DZ')}
                </span>
                <span className="text-xs font-semibold text-phone-muted">{t('priceDzd')}</span>
              </div>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-[11px] font-mono line-through text-phone-dim">
                  {product.compareAtPrice.toLocaleString('fr-DZ')} {t('priceDzd')}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label={t('addToCart')}
              className={`h-11 px-4 sm:px-4.5 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95 shadow-sm ${
                justAdded
                  ? 'bg-phone-emerald text-phone-void border-phone-emerald shadow-glow'
                  : 'bg-phone-surface-elevated border-phone-border text-phone-frost hover:border-phone-emerald/50 hover:bg-phone-surface-hover hover:text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('addedToCart')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-phone-emerald" />
                  <span>{t('navCart')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Fast Order Modal */}
      {isFastModalOpen && (
        <FastOrderModal
          product={product}
          isOpen={isFastModalOpen}
          onClose={() => setIsFastModalOpen(false)}
        />
      )}
    </>
  );
}
