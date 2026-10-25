'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Package, Plus, Check, Power, Boxes, RefreshCw } from 'lucide-react';
import CustomSelect from '@/components/common/CustomSelect';
import { INITIAL_PHONE_PRODUCTS } from '@/data/mock-products';
import { IProduct } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminProduitsPage() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<IProduct[]>(INITIAL_PHONE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/produits');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
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
    { value: 'supports', label: 'Supports' },
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
            <span>Gérer les unités & stocks</span>
          </Link>
        </div>
      </div>

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
    </div>
  );
}
