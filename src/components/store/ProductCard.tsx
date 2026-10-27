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

  const totalStock = product.variants ? product.variants.reduce((s, v) => s + v.stock, 0) : 10;
  const isOutOfStock = totalStock <= 0;
  const hasMultipleVariants = product.variants && product.variants.length > 1;

  const defaultVariant = (product.variants && product.variants.find((v) => v.stock > 0)) || product.variants[0] || {
    compatibility: 'Universel',
    color: 'Standard',
    stock: 0,
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    // If multiple models or colors exist, open FastOrderModal so user can choose
    if (hasMultipleVariants) {
      setIsFastModalOpen(true);
      return;
    }

    // Only 1 variant and has stock: direct fast add
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
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 pointer-events-none z-10">
            {product.badges && product.badges.length > 0 && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-phone-frost text-phone-void shadow-sm">
                {product.badges[0]}
              </span>
            )}
            {product.wattage && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-phone-void/85 border border-phone-border text-phone-emerald backdrop-blur-sm">
                {product.wattage}
              </span>
            )}
          </div>

          {/* In-Stock or Out-of-Stock Status Pill */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-phone-void/90 border border-phone-border backdrop-blur-md shadow-sm z-10 pointer-events-none">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOutOfStock ? 'bg-phone-danger' : 'bg-phone-emerald animate-pulse'
              }`}
            />
            <span
              className={`text-[9px] font-mono uppercase font-bold tracking-wider ${
                isOutOfStock ? 'text-phone-danger' : 'text-phone-frost'
              }`}
            >
              {isOutOfStock ? 'Épuisé' : t('inStock')}
            </span>
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
              disabled={isOutOfStock}
              onClick={handleActionClick}
              aria-label={isOutOfStock ? 'Épuisé' : hasMultipleVariants ? 'Choisir le modèle' : t('addToCart')}
              className={`h-11 px-4 sm:px-4.5 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer active:scale-95 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                justAdded
                  ? 'bg-phone-emerald text-phone-void border-phone-emerald shadow-glow'
                  : isOutOfStock
                  ? 'bg-phone-surface border-phone-border text-phone-dim'
                  : 'bg-phone-surface-elevated border-phone-border text-phone-frost hover:border-phone-emerald/50 hover:bg-phone-surface-hover hover:text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('addedToCart')}</span>
                </>
              ) : isOutOfStock ? (
                <span>Rupture</span>
              ) : hasMultipleVariants ? (
                <>
                  <Zap className="w-4 h-4 text-phone-emerald" />
                  <span>Choisir</span>
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
