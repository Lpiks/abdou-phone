'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  Save,
  Download,
  RefreshCw,
  XCircle,
  Filter,
} from 'lucide-react';
import { IProduct, ProductCategory } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import CustomSelect from '@/components/common/CustomSelect';

export default function AdminStocksPage() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'out'>('all');
  const [stockChanges, setStockChanges] = useState<Record<string, number>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stocks');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.warn('Failed to fetch stock products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Flatten products into variant rows
  const allVariants = useMemo(() => {
    return products.flatMap((product) =>
      product.variants.map((v, variantIdx) => ({
        key: `${product.slug}_${variantIdx}`,
        slug: product.slug,
        variantIdx,
        productTitle: product.title,
        category: product.category,
        brand: product.brand,
        image: product.images[0] || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=200&q=80',
        compatibility: v.compatibility,
        color: v.color,
        colorHex: v.colorHex,
        sku: v.sku || `${product.brand.slice(0, 3).toUpperCase()}-${variantIdx + 1}`,
        stock: stockChanges[`${product.slug}_${variantIdx}`] ?? v.stock,
        originalStock: v.stock,
      }))
    );
  }, [products, stockChanges]);

  // Statistics
  const totalUnits = useMemo(() => {
    return allVariants.reduce((sum, v) => sum + v.stock, 0);
  }, [allVariants]);

  const criticalItems = useMemo(() => {
    return allVariants.filter((v) => v.stock > 0 && v.stock < 10);
  }, [allVariants]);

  const outOfStockItems = useMemo(() => {
    return allVariants.filter((v) => v.stock === 0);
  }, [allVariants]);

  // Filtering
  const filteredVariants = useMemo(() => {
    return allVariants.filter((v) => {
      const matchSearch =
        v.productTitle.toLowerCase().includes(search.toLowerCase()) ||
        v.sku.toLowerCase().includes(search.toLowerCase()) ||
        v.compatibility.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase());

      const matchCategory = categoryFilter === 'all' || v.category === categoryFilter;

      let matchStatus = true;
      if (statusFilter === 'critical') matchStatus = v.stock > 0 && v.stock < 10;
      if (statusFilter === 'out') matchStatus = v.stock === 0;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [allVariants, search, categoryFilter, statusFilter]);

  const handleAdjust = (key: string, delta: number) => {
    setStockChanges((prev) => {
      const current = prev[key] ?? allVariants.find((v) => v.key === key)?.stock ?? 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [key]: next };
    });
  };

  const handleSetExact = (key: string, value: number) => {
    const next = Math.max(0, value);
    setStockChanges((prev) => ({ ...prev, [key]: next }));
  };

  const handleSaveStock = async (slug: string, variantIdx: number, key: string) => {
    const newStock = stockChanges[key];
    if (newStock === undefined) return;

    setSavingKey(key);
    try {
      const res = await fetch('/api/admin/stocks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, variantIndex: variantIdx, stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage(`Stock mis à jour (${newStock} unités)`);
        setTimeout(() => setSaveMessage(''), 2500);
      }
    } catch (e) {
      console.warn('Failed to update stock:', e);
    } finally {
      setSavingKey(null);
    }
  };

  const exportStockCsv = () => {
    const headers = ['Produit', 'Catégorie', 'Compatibilité', 'Couleur', 'SKU', 'Stock'];
    const rows = filteredVariants.map((v) => [
      `"${v.productTitle.replace(/"/g, '""')}"`,
      v.category,
      `"${v.compatibility.replace(/"/g, '""')}"`,
      `"${v.color.replace(/"/g, '""')}"`,
      v.sku,
      v.stock,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abdou_phone_stocks_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-phone-frost tracking-tight flex items-center gap-2.5">
            <Boxes className="w-7 h-7 text-phone-cyan" />
            <span>{t('adminStocksTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-phone-muted mt-1">
            {t('adminStocksSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={exportStockCsv}
            className="h-10 px-4 rounded-xl bg-phone-surface border border-phone-border hover:border-phone-frost/30 text-phone-frost font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 rounded-xl bg-phone-emerald/15 border border-phone-emerald/30 text-phone-emerald text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-border space-y-1">
          <div className="text-xs font-mono text-phone-muted">{t('adminStocksTotalUnits')}</div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-phone-frost">
            {totalUnits.toLocaleString('fr-DZ')}
          </div>
          <div className="text-[11px] text-phone-dim">{allVariants.length} variantes au total</div>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'critical' ? 'all' : 'critical')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'critical'
              ? 'bg-phone-amber/15 border-phone-amber'
              : 'bg-phone-surface border-phone-amber/30 hover:border-phone-amber/60'
          }`}
        >
          <div className="text-xs font-mono text-phone-amber flex items-center justify-between">
            <span>Stock Critique (&lt; 10)</span>
            <AlertTriangle className="w-4 h-4 text-phone-amber" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-phone-amber">
            {criticalItems.length}
          </div>
          <div className="text-[11px] text-phone-dim">Cliquez pour filtrer les urgences</div>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'out' ? 'all' : 'out')}
          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'out'
              ? 'bg-phone-danger/15 border-phone-danger'
              : 'bg-phone-surface border-phone-danger/30 hover:border-phone-danger/60'
          }`}
        >
          <div className="text-xs font-mono text-phone-danger flex items-center justify-between">
            <span>Rupture de Stock (0)</span>
            <XCircle className="w-4 h-4 text-phone-danger" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-phone-danger">
            {outOfStockItems.length}
          </div>
          <div className="text-[11px] text-phone-dim">Articles indisponibles à la vente</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-7 relative">
          <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-phone-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('adminStocksSearch')}
            className="w-full h-11 ps-10 pe-4 rounded-xl bg-phone-surface border border-phone-border text-phone-frost placeholder-phone-dim text-xs font-medium focus:outline-none focus:border-phone-cyan/60 transition-colors"
          />
        </div>

        <div className="sm:col-span-5">
          <CustomSelect
            options={categoryOptions}
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            placeholder="Filtrer par catégorie"
          />
        </div>
      </div>

      {/* Stock Management Table */}
      <div className="bg-phone-surface border border-phone-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-w-0">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-phone-surface-elevated/70 border-b border-phone-border text-phone-dim font-mono uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3 font-semibold">Produit</th>
                <th className="px-4 py-3 font-semibold">Rayon</th>
                <th className="px-4 py-3 font-semibold">Compatibilité & Couleur</th>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Niveau Stock</th>
                <th className="px-4 py-3 font-semibold text-center">Ajustement Rapide</th>
                <th className="px-4 py-3 font-semibold text-right rtl:text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-phone-border/60">
              {filteredVariants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-phone-dim">
                    Aucun article ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filteredVariants.map((item) => {
                  const hasChanged = stockChanges[item.key] !== undefined && stockChanges[item.key] !== item.originalStock;
                  const isSaving = savingKey === item.key;

                  return (
                    <tr key={item.key} className="hover:bg-phone-surface-elevated/40 transition-colors">
                      {/* Product */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-phone-surface-elevated border border-phone-border overflow-hidden shrink-0 relative">
                            <Image
                              src={item.image}
                              alt={item.productTitle}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-phone-frost line-clamp-1 max-w-[200px]">
                              {item.productTitle}
                            </div>
                            <div className="text-[10px] font-mono text-phone-dim">{item.brand}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-phone-muted whitespace-nowrap uppercase font-mono text-[10px]">
                        {item.category}
                      </td>

                      {/* Variant */}
                      <td className="px-4 py-3 text-phone-frost whitespace-nowrap">
                        <div className="font-medium">{item.compatibility}</div>
                        <div className="flex items-center gap-1.5 text-[11px] text-phone-dim">
                          {item.colorHex && (
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-phone-border inline-block shrink-0"
                              style={{ backgroundColor: item.colorHex }}
                            />
                          )}
                          <span>{item.color}</span>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-4 py-3 font-mono text-phone-dim text-[11px] whitespace-nowrap">
                        {item.sku}
                      </td>

                      {/* Stock Level Badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                            item.stock === 0
                              ? 'bg-phone-danger/15 text-phone-danger border border-phone-danger/30'
                              : item.stock < 10
                              ? 'bg-phone-amber/15 text-phone-amber border border-phone-amber/30'
                              : 'bg-phone-emerald/15 text-phone-emerald border border-phone-emerald/30'
                          }`}
                        >
                          {item.stock} unités
                        </span>
                      </td>

                      {/* Quick Adjust Buttons */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1.5 bg-phone-void/60 border border-phone-border p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => handleAdjust(item.key, -1)}
                            className="w-7 h-7 rounded-lg bg-phone-surface border border-phone-border text-phone-frost hover:bg-phone-surface-hover flex items-center justify-center transition-colors cursor-pointer select-none"
                            title="Retirer 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={item.stock}
                            onChange={(e) => handleSetExact(item.key, parseInt(e.target.value) || 0)}
                            className="w-12 h-7 rounded-lg bg-phone-surface text-center font-mono font-bold text-xs text-phone-frost border border-phone-border focus:outline-none focus:border-phone-cyan/60"
                          />

                          <button
                            type="button"
                            onClick={() => handleAdjust(item.key, 1)}
                            className="w-7 h-7 rounded-lg bg-phone-surface border border-phone-border text-phone-frost hover:bg-phone-surface-hover flex items-center justify-center transition-colors cursor-pointer select-none"
                            title="Ajouter 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Save Action */}
                      <td className="px-4 py-3 text-right rtl:text-left whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleSaveStock(item.slug, item.variantIdx, item.key)}
                          disabled={!hasChanged || isSaving}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all select-none cursor-pointer ${
                            hasChanged
                              ? 'bg-phone-emerald text-phone-void hover:bg-phone-emerald/90 shadow-sm animate-pulse'
                              : 'bg-phone-surface-elevated text-phone-dim border border-phone-border opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{isSaving ? 'Envoi...' : 'Sauvegarder'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
