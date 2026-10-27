'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Package, RefreshCw } from 'lucide-react';
import StoreShell from '@/components/store/StoreShell';
import ProductCard from '@/components/store/ProductCard';
import CustomSelect from '@/components/common/CustomSelect';
import { IProduct } from '@/types';
import { ICategoryItem } from '@/models/Category';

interface BoutiqueClientProps {
  initialProducts: IProduct[];
  initialCategories: ICategoryItem[];
  initialCategory?: string;
  initialSearch?: string;
  initialCompat?: string;
}

export default function BoutiqueClient({
  initialProducts,
  initialCategories,
  initialCategory = 'all',
  initialSearch = '',
  initialCompat = 'all',
}: BoutiqueClientProps) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedCompatibility, setSelectedCompatibility] = useState<string>(initialCompat);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Categories list initialized from server
  const categoriesList = useMemo(() => {
    return [
      { id: 'all', label: 'Tous les produits' },
      ...initialCategories.map((c) => ({ id: c.id, label: c.name })),
    ];
  }, [initialCategories]);

  // Background sync to ensure live data if products are added/edited in admin
  useEffect(() => {
    const syncProducts = async () => {
      try {
        const res = await fetch('/api/produits', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (err) {
        console.warn('Sync failed:', err);
      }
    };
    syncProducts();
  }, []);

  const compatibilityOptions = [
    { value: 'all', label: 'Tous les modèles de téléphones' },
    { value: 'iphone', label: 'Apple iPhone (Séries 11 à 16 Pro Max)' },
    { value: 'samsung', label: 'Samsung Galaxy (S20 à S24 Ultra & A-series)' },
    { value: 'xiaomi', label: 'Xiaomi & Redmi' },
    { value: 'universel', label: 'Universel USB-C' },
  ];

  const sortOptions = [
    { value: 'featured', label: 'Recommandés (Best-sellers)' },
    { value: 'price_asc', label: 'Prix : Croissant' },
    { value: 'price_desc', label: 'Prix : Décroissant' },
    { value: 'name_asc', label: 'Ordre alphabétique' },
  ];

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    let result: IProduct[] = [...products];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by Device Compatibility
    if (selectedCompatibility !== 'all') {
      const comp = selectedCompatibility.toLowerCase();
      result = result.filter(
        (p) =>
          p.variants.some((v) => v.compatibility.toLowerCase().includes(comp)) ||
          p.title.toLowerCase().includes(comp) ||
          p.tags?.some((t) => t.toLowerCase().includes(comp))
      );
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, selectedCategory, searchQuery, selectedCompatibility, sortBy]);

  return (
    <StoreShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header Title */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-phone-surface border border-phone-border text-xs font-mono font-bold text-phone-emerald">
            <Package className="w-3.5 h-3.5" />
            <span>Catalogue Accessoires Smartphone Algérie</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-phone-frost tracking-tight">
            Tous nos Équipements &amp; Accessoires
          </h1>
          <p className="text-sm text-phone-muted max-w-2xl">
            Retrouvez tous les produits disponibles en stock immédiat avec livraison à domicile ou stop desk 58 wilayas.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-6 rounded-3xl bg-phone-surface border border-phone-border mb-10 space-y-5">
          {/* Top Row: Search and Selects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-phone-muted">
                Recherche par mot-clé
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-phone-dim absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: GaN 65W, Coque iPhone 16, Câble..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-sm focus:outline-none focus:border-phone-emerald/60"
                />
              </div>
            </div>

            {/* Device Compatibility Select */}
            <CustomSelect
              label="Filtrer par Smartphone"
              value={selectedCompatibility}
              onChange={(val) => setSelectedCompatibility(val)}
              options={compatibilityOptions}
              placeholder="Tous les modèles..."
            />

            {/* Sorting Select */}
            <CustomSelect
              label="Trier par"
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              options={sortOptions}
              placeholder="Trier..."
            />
          </div>

          {/* Category Pills */}
          <div className="pt-2 border-t border-phone-border flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-9 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-phone-frost text-phone-void shadow-sm'
                    : 'bg-phone-surface-elevated border border-phone-border text-phone-muted hover:text-phone-frost hover:border-phone-border-light'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {(selectedCategory !== 'all' || selectedCompatibility !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCompatibility('all');
                  setSearchQuery('');
                }}
                className="h-9 px-3 rounded-xl border border-phone-danger/40 text-phone-danger text-xs font-bold hover:bg-phone-danger/10 transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-phone-muted mb-6">
          <span>
            Affichage de <strong className="text-phone-frost">{filteredProducts.length}</strong> accessoire{filteredProducts.length > 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-phone-emerald" />
            <span>Paiement en espèces à la livraison</span>
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center rounded-3xl bg-phone-surface border border-phone-border space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-phone-surface-elevated border border-phone-border flex items-center justify-center text-phone-dim">
              <Package className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-phone-frost">Aucun produit ne correspond à vos filtres</h3>
              <p className="text-xs text-phone-muted">
                Essayez d&apos;élargir vos termes de recherche ou de réinitialiser la compatibilité.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCompatibility('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-phone-frost text-phone-void text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </StoreShell>
  );
}
