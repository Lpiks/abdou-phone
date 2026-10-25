'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Package,
  Plus,
  Check,
  Power,
  Boxes,
  RefreshCw,
  X,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import CustomSelect from '@/components/common/CustomSelect';
import { INITIAL_PHONE_PRODUCTS } from '@/data/mock-products';
import { IProduct, ProductCategory, IProductVariant } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminProduitsPage() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<IProduct[]>(INITIAL_PHONE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('chargeurs');
  const [brand, setBrand] = useState('Abdou Phone Pro');
  const [price, setPrice] = useState<number>(3500);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(4500);
  const [wattage, setWattage] = useState('65W GaN Fast Charge');
  const [connector, setConnector] = useState('Type-C vers Type-C');
  const [warranty, setWarranty] = useState('Garantie 6 Mois Échange à Neuf');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');
  const [variants, setVariants] = useState<IProductVariant[]>([
    {
      compatibility: 'Universel (iPhone / Samsung / Xiaomi)',
      color: 'Noir Titane',
      colorHex: '#111111',
      stock: 30,
      sku: 'ACC-BLK-01',
    },
    {
      compatibility: 'Universel (iPhone / Samsung / Xiaomi)',
      color: 'Blanc Givré',
      colorHex: '#F8FAFC',
      stock: 20,
      sku: 'ACC-WHT-02',
    },
  ]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/produits');
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      } else if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    } catch (e) {
      console.warn('Failed to fetch products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categoryOptions = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'chargeurs', label: 'Chargeurs GaN' },
    { value: 'cables', label: 'Câbles 100W' },
    { value: 'coques', label: 'Coques & MagSafe' },
    { value: 'protection', label: 'Verres 9H & Privacy' },
    { value: 'powerbanks', label: 'Batteries Externes' },
    { value: 'audio', label: 'Audio & Écouteurs' },
    { value: 'supports', label: 'Supports Voiture' },
  ];

  const modalCategoryOptions = [
    { value: 'chargeurs', label: 'Chargeurs GaN' },
    { value: 'cables', label: 'Câbles 100W' },
    { value: 'coques', label: 'Coques & MagSafe' },
    { value: 'protection', label: 'Verres 9H & Privacy' },
    { value: 'powerbanks', label: 'Batteries Externes' },
    { value: 'audio', label: 'Audio & Écouteurs' },
    { value: 'supports', label: 'Supports Voiture' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return (
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, categoryFilter, search]);

  const toggleProductActive = (slug: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Variant helpers
  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        compatibility: 'Universel Smartphone',
        color: 'Noir Mat',
        colorHex: '#111111',
        stock: 25,
        sku: `ACC-${prev.length + 1}`,
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateVariant = (index: number, field: keyof IProductVariant, value: string | number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  // Submit Handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Veuillez spécifier le titre du produit.');
      return;
    }
    if (!price || price <= 0) {
      setErrorMsg('Veuillez indiquer un prix valide supérieur à 0 DZD.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/produits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          brand,
          price,
          compareAtPrice: compareAtPrice || undefined,
          wattage: wattage || undefined,
          connector: connector || undefined,
          warranty: warranty || undefined,
          description: description || `Accessoire smartphone officiel haute performance sélectionné par Abdou Phone.`,
          images: [imageUrl],
          variants,
          isFeatured: true,
          isActive: true,
        }),
      });

      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) => [data.product, ...prev]);
        setSuccessMsg(`Produit "${data.product.title}" ajouté avec succès !`);
        setModalOpen(false);

        // Reset form
        setTitle('');
        setPrice(3500);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.error || 'Erreur lors de la création du produit.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur de connexion au serveur.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-phone-frost tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-phone-emerald" />
            <span>{t('adminNavProducts')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-phone-muted mt-1">
            Catalogue officiel des accessoires smartphone haute performance et gestion des fiches articles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/stocks"
            className="h-10 px-4 rounded-xl bg-phone-surface border border-phone-border hover:border-phone-cyan/40 text-phone-frost font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Boxes className="w-4 h-4 text-phone-cyan" />
            <span>Gérer les unités</span>
          </Link>

          {/* New Product Trigger Button */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-phone-emerald hover:bg-phone-emerald/90 text-phone-void font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Produit</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-phone-emerald/15 border border-phone-emerald/30 text-phone-emerald text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Controls (100% CustomSelect) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-border grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-7 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-phone-muted font-mono">
            Rechercher un produit
          </label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-phone-dim absolute start-3.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Titre, marque, modèle, puissance..."
              className="w-full h-11 ps-10 pe-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-xs font-medium focus:outline-none focus:border-phone-emerald/60"
            />
          </div>
        </div>

        <div className="md:col-span-5">
          <CustomSelect
            label="Filtrer par Catégorie"
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            options={categoryOptions}
            placeholder="Toutes les catégories..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-phone-surface border border-phone-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-w-0">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="border-b border-phone-border bg-phone-surface-elevated/70 text-phone-dim font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Article</th>
                <th className="py-3 px-4 font-semibold">Catégorie</th>
                <th className="py-3 px-4 font-semibold">Prix Vente</th>
                <th className="py-3 px-4 font-semibold">Compatibilité / Versions</th>
                <th className="py-3 px-4 font-semibold">Stock Total</th>
                <th className="py-3 px-4 text-right rtl:text-left font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-phone-border/60">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={p.slug} className="hover:bg-phone-surface-elevated/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-phone-void shrink-0 border border-phone-border">
                          <Image src={p.images[0]} alt={p.title} fill sizes="44px" className="object-cover" />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <div className="font-semibold text-phone-frost truncate">{p.title}</div>
                          <div className="text-[10px] font-mono text-phone-dim">
                            {p.brand} {p.wattage ? `• ${p.wattage}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono capitalize text-phone-muted whitespace-nowrap">
                      {p.category}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-phone-emerald whitespace-nowrap">
                      {p.price.toLocaleString('fr-DZ')} DZD
                    </td>

                    <td className="py-3.5 px-4 text-phone-dim text-[11px] whitespace-nowrap">
                      {p.variants.length} variante{p.variants.length > 1 ? 's' : ''} (
                      {p.variants.map((v) => v.compatibility).slice(0, 2).join(', ')}
                      {p.variants.length > 2 ? '...' : ''})
                    </td>

                    <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                      <span className="font-bold text-phone-frost">{totalStock}</span> pcs
                    </td>

                    <td className="py-3.5 px-4 text-right rtl:text-left whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleProductActive(p.slug)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer select-none ${
                          p.isActive
                            ? 'bg-phone-emerald/15 text-phone-emerald border border-phone-emerald/30'
                            : 'bg-phone-dim/20 text-phone-dim border border-phone-border'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{p.isActive ? 'Actif' : 'Masqué'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PRODUCT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-phone-surface border border-phone-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex items-center justify-between border-b border-phone-border pb-4">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase text-phone-emerald font-bold flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-phone-emerald" />
                  <span>Nouveau Référencement Catalogue</span>
                </div>
                <h2 className="text-xl font-bold text-phone-frost">
                  Ajouter un Accessoire Smartphone
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-phone-surface-elevated text-phone-dim hover:text-phone-frost cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-phone-danger/15 border border-phone-danger/30 text-phone-danger text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-5">
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                    Nom du Produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Chargeur 65W GaN Dual USB-C"
                    className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost text-xs font-medium focus:outline-none focus:border-phone-emerald"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                    Rayon / Catégorie *
                  </label>
                  <CustomSelect
                    options={modalCategoryOptions}
                    value={category}
                    onChange={(val) => setCategory(val as ProductCategory)}
                  />
                </div>
              </div>

              {/* Row 2: Brand & Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                    Marque
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ex: Abdou Phone Pro, Anker"
                    className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost text-xs font-medium focus:outline-none focus:border-phone-emerald"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                    Prix de Vente (DZD) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost font-mono font-bold text-xs focus:outline-none focus:border-phone-emerald"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                    Prix Barré (Optionnel)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(parseInt(e.target.value) || 0)}
                    placeholder="Ex: 4800"
                    className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost font-mono text-xs focus:outline-none focus:border-phone-emerald"
                  />
                </div>
              </div>

              {/* Row 3: Technical Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                    Puissance / Wattage
                  </label>
                  <input
                    type="text"
                    value={wattage}
                    onChange={(e) => setWattage(e.target.value)}
                    placeholder="Ex: 65W GaN, 20W PD"
                    className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost text-xs focus:outline-none focus:border-phone-emerald"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                    Type de Connecteur
                  </label>
                  <input
                    type="text"
                    value={connector}
                    onChange={(e) => setConnector(e.target.value)}
                    placeholder="Ex: 2x Type-C + 1x USB-A"
                    className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost text-xs focus:outline-none focus:border-phone-emerald"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                    Garantie Échange
                  </label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="Ex: Garantie 6 Mois Échange"
                    className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost text-xs focus:outline-none focus:border-phone-emerald"
                  />
                </div>
              </div>

              {/* Row 4: Image URL & Preview */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                  URL de l&apos;Image Principale
                </label>
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full h-11 px-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost text-xs font-mono focus:outline-none focus:border-phone-emerald"
                    />
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-phone-void border border-phone-border overflow-hidden shrink-0 relative">
                    {imageUrl ? (
                      <Image src={imageUrl} alt="Preview" fill sizes="44px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-phone-dim">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 5: Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-phone-muted uppercase font-mono">
                  Description Commerciale &amp; Technique
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Technologie avancée, matériaux antichoc, protection contre les surtensions..."
                  className="w-full p-3.5 rounded-xl bg-phone-void border border-phone-border text-phone-frost text-xs focus:outline-none focus:border-phone-emerald"
                />
              </div>

              {/* Row 6: Variants Builder */}
              <div className="p-4 rounded-2xl bg-phone-void border border-phone-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono uppercase text-phone-frost font-bold flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-phone-cyan" />
                    <span>Variantes &amp; Compatibilités Smartphone ({variants.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-xs text-phone-emerald hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Ajouter une variante</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {variants.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-phone-surface border border-phone-border grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center text-xs"
                    >
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          required
                          value={v.compatibility}
                          onChange={(e) => handleUpdateVariant(idx, 'compatibility', e.target.value)}
                          placeholder="Compatibilité (ex: iPhone 16 Pro)"
                          className="w-full h-9 px-2.5 rounded-lg bg-phone-void border border-phone-border text-phone-frost text-xs focus:outline-none focus:border-phone-emerald"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          required
                          value={v.color}
                          onChange={(e) => handleUpdateVariant(idx, 'color', e.target.value)}
                          placeholder="Couleur (ex: Noir Titane)"
                          className="w-full h-9 px-2.5 rounded-lg bg-phone-void border border-phone-border text-phone-frost text-xs focus:outline-none focus:border-phone-emerald"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-phone-dim font-mono">Stock:</span>
                          <input
                            type="number"
                            min="0"
                            required
                            value={v.stock}
                            onChange={(e) => handleUpdateVariant(idx, 'stock', parseInt(e.target.value) || 0)}
                            className="w-full h-9 px-2 rounded-lg bg-phone-void border border-phone-border text-phone-frost font-mono text-xs focus:outline-none focus:border-phone-emerald"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          disabled={variants.length <= 1}
                          className="p-1.5 rounded-lg text-phone-danger hover:bg-phone-danger/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-phone-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-phone-border text-phone-muted hover:text-phone-frost text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-phone-emerald hover:bg-phone-emerald/90 text-phone-void font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {submitting ? 'Enregistrement...' : 'Enregistrer le Produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
