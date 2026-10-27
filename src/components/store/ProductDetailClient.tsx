'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  ShoppingBag,
  Check,
  ArrowLeft,
  ChevronRight,
  Plus,
  Minus,
} from 'lucide-react';
import StoreShell from '@/components/store/StoreShell';
import FastOrderModal from '@/components/store/FastOrderModal';
import { useCart } from '@/context/CartContext';
import { IProduct } from '@/types';

interface ProductDetailClientProps {
  initialProduct: IProduct;
}

export default function ProductDetailClient({ initialProduct }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [product] = useState<IProduct>(initialProduct);
  const variants = product.variants && product.variants.length > 0
    ? product.variants
    : [
        {
          compatibility: 'Universel Smartphone',
          color: 'Standard',
          stock: 10,
        },
      ];

  const initialVariantIdx = Math.max(
    0,
    variants.findIndex((v) => v.stock > 0)
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(initialVariantIdx);
  const [quantity, setQuantity] = useState(1);
  const [isFastModalOpen, setIsFastModalOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'];

  const currentImage = images[activeImageIndex] || images[0];
  const activeVariant = variants[selectedVariantIndex] || variants[0];
  const totalStock = variants.reduce((s, v) => s + v.stock, 0);
  const isOutOfStock = activeVariant.stock <= 0;
  const isAllOutOfStock = totalStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product._id || product.slug,
      title: product.title,
      slug: product.slug,
      image: currentImage,
      price: product.price,
      quantity,
      selectedCompatibility: activeVariant.compatibility,
      selectedColor: activeVariant.color,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <StoreShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-phone-muted mb-8 overflow-x-auto">
          <Link href="/" className="hover:text-phone-frost transition-colors cursor-pointer">
            Accueil
          </Link>
          <ChevronRight className="w-3 h-3 text-phone-dim" />
          <Link href="/boutique" className="hover:text-phone-frost transition-colors cursor-pointer">
            Boutique
          </Link>
          <ChevronRight className="w-3 h-3 text-phone-dim" />
          <Link
            href={`/boutique?cat=${product.category}`}
            className="capitalize hover:text-phone-frost transition-colors cursor-pointer"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-phone-dim" />
          <span className="text-phone-frost truncate">{product.title}</span>
        </nav>

        {/* Main Product Stage: 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Column: Visual Gallery */}
          <div className="space-y-4">
            {/* Main Stage View */}
            <div className="relative aspect-square w-full rounded-3xl bg-phone-surface border border-phone-border overflow-hidden shadow-card">
              <Image
                src={currentImage}
                alt={product.title}
                fill
                priority
                className="object-cover object-center"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.badges && product.badges.length > 0 && (
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-phone-frost text-phone-void shadow-md">
                    {product.badges[0]}
                  </span>
                )}
                {product.wattage && (
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-phone-void/85 border border-phone-border text-phone-emerald backdrop-blur-sm">
                    {product.wattage}
                  </span>
                )}
              </div>

              {/* In-Stock Indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-phone-void/90 border border-phone-border backdrop-blur-sm z-10">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOutOfStock ? 'bg-phone-danger' : 'bg-phone-emerald animate-pulse'
                  }`}
                />
                <span
                  className={`text-xs font-mono font-bold uppercase ${
                    isOutOfStock ? 'text-phone-danger' : 'text-phone-frost'
                  }`}
                >
                  {isOutOfStock ? 'Rupture de Stock' : 'En Stock (Livraison Immédiate)'}
                </span>
              </div>
            </div>

            {/* Thumbnail Preview Selector (Multi-Image) */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-phone-emerald scale-105 shadow-glow'
                        : 'border-phone-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Aperçu ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specs & Purchasing Interface */}
          <div className="flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Brand & Category Header */}
              <div className="flex items-center justify-between text-xs font-mono text-phone-dim">
                <span className="uppercase tracking-widest text-phone-muted font-bold">
                  {product.brand}
                </span>
                <span className="text-phone-emerald">{product.warranty}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-phone-frost tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-phone-surface border border-phone-border flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-phone-frost">
                    {product.price.toLocaleString('fr-DZ')}
                  </span>
                  <span className="text-sm font-bold text-phone-muted">DZD</span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm font-mono line-through text-phone-dim ml-2">
                      {product.compareAtPrice.toLocaleString('fr-DZ')} DZD
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono font-bold text-phone-emerald uppercase">
                  Paiement Cash à Réception
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-phone-muted leading-relaxed">
                {product.description}
              </p>

              {/* Variants Compatibility Selector */}
              {variants.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-phone-muted">
                    <span>Sélectionner le modèle de téléphone / Version :</span>
                    <span className="text-phone-frost font-mono">{activeVariant.compatibility}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {variants.map((v, idx) => {
                      const out = v.stock <= 0;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={out}
                          onClick={() => {
                            setSelectedVariantIndex(idx);
                            if (quantity > v.stock && v.stock > 0) {
                              setQuantity(v.stock);
                            }
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            out
                              ? 'bg-phone-surface/40 border-phone-border/40 opacity-40 cursor-not-allowed select-none'
                              : selectedVariantIndex === idx
                              ? 'bg-phone-emerald/15 border-phone-emerald text-phone-emerald font-bold shadow-sm cursor-pointer'
                              : 'bg-phone-surface border-phone-border text-phone-frost hover:border-phone-border-light cursor-pointer'
                          }`}
                        >
                          <div className="text-xs truncate flex items-center justify-between">
                            <span>{v.compatibility}</span>
                            {out && <span className="text-[9px] font-mono text-phone-danger">Épuisé</span>}
                          </div>
                          <div className="text-[11px] text-phone-dim font-normal mt-0.5 flex items-center justify-between">
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

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-phone-muted">
                  Quantité :
                </span>
                <div className="flex items-center gap-3 p-1.5 rounded-xl bg-phone-surface border border-phone-border">
                  <button
                    type="button"
                    disabled={quantity <= 1 || isOutOfStock}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-phone-surface-elevated text-phone-frost flex items-center justify-center hover:bg-phone-border transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-phone-frost text-sm">
                    {isOutOfStock ? 0 : quantity}
                  </span>
                  <button
                    type="button"
                    disabled={isOutOfStock || quantity >= activeVariant.stock}
                    onClick={() => setQuantity(Math.min(activeVariant.stock, quantity + 1))}
                    className="w-8 h-8 rounded-lg bg-phone-surface-elevated text-phone-frost flex items-center justify-center hover:bg-phone-border transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {!isOutOfStock && activeVariant.stock > 0 && (
                  <span className="text-[11px] font-mono text-phone-dim">
                    (Max: {activeVariant.stock} pcs)
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setIsFastModalOpen(true)}
                  className="w-full h-14 rounded-2xl bg-phone-frost hover:bg-white text-phone-void font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Zap className="w-5 h-5 fill-phone-void text-phone-void" />
                  <span>{isOutOfStock ? 'Variante Épuisée' : 'Commander Express (Sans inscription)'}</span>
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`w-full h-12 rounded-2xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    addedNotice
                      ? 'bg-phone-emerald text-phone-void border-phone-emerald'
                      : isOutOfStock
                      ? 'bg-phone-surface border-phone-border text-phone-dim'
                      : 'bg-phone-surface border-phone-border text-phone-frost hover:border-phone-emerald/50 hover:bg-phone-surface-hover'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Ajouté au Panier avec succès</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Non disponible en stock</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Ajouter au Panier</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3 Guarantees Box */}
            <div className="p-4 rounded-2xl bg-phone-surface border border-phone-border space-y-3">
              <div className="flex items-center gap-3 text-xs text-phone-muted">
                <Truck className="w-4 h-4 text-phone-emerald shrink-0" />
                <span>Expédition rapide dans les 58 wilayas d&apos;Algérie (24h à 72h).</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-phone-muted">
                <ShieldCheck className="w-4 h-4 text-phone-emerald shrink-0" />
                <span>Paiement en espèces à la livraison : vous vérifiez le colis avant de régler.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-phone-muted">
                <RotateCcw className="w-4 h-4 text-phone-emerald shrink-0" />
                <span>Garantie échange à neuf 6 mois en cas de dysfonctionnement technique.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs & Features Sheet */}
        <div className="mt-16 pt-12 border-t border-phone-border">
          <h2 className="text-xl sm:text-2xl font-bold text-phone-frost mb-6">
            Spécifications Techniques &amp; Caractéristiques
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Features Bullet List */}
            {product.features && product.features.length > 0 && (
              <div className="p-6 rounded-3xl bg-phone-surface border border-phone-border space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-phone-emerald font-mono">
                  Points Forts du Produit
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-phone-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-phone-emerald mt-2 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs Table */}
            <div className="p-6 rounded-3xl bg-phone-surface border border-phone-border space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-phone-emerald font-mono">
                Fiche Technique
              </h3>
              <div className="divide-y divide-phone-border text-xs sm:text-sm">
                <div className="py-2.5 flex justify-between">
                  <span className="text-phone-muted">Marque</span>
                  <span className="font-semibold text-phone-frost">{product.brand}</span>
                </div>
                {product.wattage && (
                  <div className="py-2.5 flex justify-between">
                    <span className="text-phone-muted">Puissance nominale</span>
                    <span className="font-mono font-semibold text-phone-emerald">{product.wattage}</span>
                  </div>
                )}
                {product.connector && (
                  <div className="py-2.5 flex justify-between">
                    <span className="text-phone-muted">Connectique</span>
                    <span className="font-semibold text-phone-frost">{product.connector}</span>
                  </div>
                )}
                <div className="py-2.5 flex justify-between">
                  <span className="text-phone-muted">Garantie constructeur</span>
                  <span className="font-semibold text-phone-frost">{product.warranty}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-phone-muted">Disponibilité</span>
                  <span className="font-semibold text-phone-emerald">En Stock - Expédition Immédiate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au catalogue complet</span>
          </Link>
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
    </StoreShell>
  );
}
