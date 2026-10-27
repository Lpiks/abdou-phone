'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  UploadCloud,
  Loader2,
  Edit,
  Eye,
  Tag,
  ExternalLink,
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
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [previewingProduct, setPreviewingProduct] = useState<IProduct | null>(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);

  const handleOpenPreview = (prod: IProduct) => {
    setPreviewImageIndex(0);
    setPreviewingProduct(prod);
  };
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatArabic, setNewCatArabic] = useState('');
  const [submittingCat, setSubmittingCat] = useState(false);
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
  // Multi-Image Gallery State (Deferred Cloudinary Upload on Save)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setDynamicCategories(data.categories);
      }
    } catch (e) {
      console.warn('Failed to fetch categories:', e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const categoryOptions = useMemo(() => {
    if (dynamicCategories.length > 0) {
      return [
        { value: 'all', label: 'Toutes les catégories' },
        ...dynamicCategories.map((c) => ({ value: c.id, label: c.name })),
      ];
    }
    return [
      { value: 'all', label: 'Toutes les catégories' },
      { value: 'chargeurs', label: 'Chargeurs GaN' },
      { value: 'cables', label: 'Câbles 100W' },
      { value: 'coques', label: 'Coques & MagSafe' },
      { value: 'protection', label: 'Verres 9H & Privacy' },
      { value: 'powerbanks', label: 'Batteries Externes' },
      { value: 'audio', label: 'Audio & Écouteurs' },
      { value: 'supports', label: 'Supports Voiture' },
    ];
  }, [dynamicCategories]);

  const modalCategoryOptions = useMemo(() => {
    if (dynamicCategories.length > 0) {
      return dynamicCategories.map((c) => ({ value: c.id, label: c.name }));
    }
    return [
      { value: 'chargeurs', label: 'Chargeurs GaN' },
      { value: 'cables', label: 'Câbles 100W' },
      { value: 'coques', label: 'Coques & MagSafe' },
      { value: 'protection', label: 'Verres 9H & Privacy' },
      { value: 'powerbanks', label: 'Batteries Externes' },
      { value: 'audio', label: 'Audio & Écouteurs' },
      { value: 'supports', label: 'Supports Voiture' },
    ];
  }, [dynamicCategories]);

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

  // Multi-Image Local Preview Handlers (ZERO Cloudinary upload until final Save)
  const handleSelectFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    const validItems: { id: string; file: File; preview: string }[] = [];

    for (const f of list) {
      if (!f.type.startsWith('image/')) {
        setErrorMsg(`Format non supporté: ${f.name}. Utilisez JPG, PNG, WEBP ou AVIF.`);
        continue;
      }
      if (f.size > 10 * 1024 * 1024) {
        setErrorMsg(`Fichier trop lourd: ${f.name} (max 10 Mo).`);
        continue;
      }
      validItems.push({
        id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        file: f,
        preview: URL.createObjectURL(f),
      });
    }

    if (validItems.length > 0) {
      setErrorMsg('');
      setPendingFiles((prev) => [...prev, ...validItems].slice(0, 6));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleSelectFiles(e.target.files);
    }
  };

  const handleRemovePendingFile = (id: string) => {
    setPendingFiles((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddManualUrl = () => {
    if (manualImageUrl.trim()) {
      setExistingImages((prev) => [...prev, manualImageUrl.trim()]);
      setManualImageUrl('');
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    // Revoke old previews
    pendingFiles.forEach((p) => URL.revokeObjectURL(p.preview));
    setEditingProduct(null);
    setTitle('');
    setCategory('chargeurs');
    setBrand('Abdou Phone Pro');
    setPrice(3500);
    setCompareAtPrice(4500);
    setWattage('65W GaN Fast Charge');
    setConnector('Type-C vers Type-C');
    setWarranty('Garantie 6 Mois Échange à Neuf');
    setDescription('');
    setExistingImages([]);
    setPendingFiles([]);
    setManualImageUrl('');
    setVariants([
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
    setErrorMsg('');
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (prod: IProduct) => {
    // Revoke old previews
    pendingFiles.forEach((p) => URL.revokeObjectURL(p.preview));
    setEditingProduct(prod);
    setTitle(prod.title);
    setCategory(prod.category);
    setBrand(prod.brand);
    setPrice(prod.price);
    setCompareAtPrice(prod.compareAtPrice || 0);
    setWattage(prod.wattage || '');
    setConnector(prod.connector || '');
    setWarranty(prod.warranty || '');
    setDescription(prod.description || '');
    setExistingImages(Array.isArray(prod.images) ? [...prod.images] : []);
    setPendingFiles([]);
    setManualImageUrl('');
    setVariants(prod.variants && prod.variants.length > 0 ? [...prod.variants] : [
      {
        compatibility: 'Universel Smartphone',
        color: 'Standard',
        colorHex: '#111111',
        stock: 10,
        sku: 'ACC-01',
      }
    ]);
    setErrorMsg('');
    setModalOpen(true);
  };

  // Delete Product
  const handleDeleteProduct = async (slug: string, prodTitle: string) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer définitivement "${prodTitle}" du catalogue ?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/produits?slug=${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.slug !== slug));
        setSuccessMsg(`Produit "${prodTitle}" supprimé avec succès.`);
        if (previewingProduct?.slug === slug) setPreviewingProduct(null);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.error || 'Erreur lors de la suppression.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur de connexion au serveur.');
    }
  };

  // Add Category Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      setSubmittingCat(true);
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName.trim(),
          arabicName: newCatArabic.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.category) {
        setDynamicCategories((prev) => [...prev, data.category]);
        setNewCatName('');
        setNewCatArabic('');
        setSuccessMsg(`Rayon "${data.category.name}" ajouté avec succès !`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.error || "Erreur lors de l'ajout du rayon.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingCat(false);
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!window.confirm(`Supprimer le rayon "${catName}" ?`)) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${catId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDynamicCategories((prev) => prev.filter((c) => c.id !== catId));
        setSuccessMsg(`Rayon "${catName}" supprimé.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Handler (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
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
      // 1. Deferred Cloudinary Upload: Upload pending files in parallel ONLY now!
      const uploadedUrls: string[] = [];
      if (pendingFiles.length > 0) {
        setIsUploading(true);
        for (const item of pendingFiles) {
          try {
            const formData = new FormData();
            formData.append('file', item.file);
            const resUpload = await fetch('/api/admin/upload', {
              method: 'POST',
              body: formData,
            });
            const dataUpload = await resUpload.json();
            if (dataUpload.success && dataUpload.url) {
              uploadedUrls.push(dataUpload.url);
            }
          } catch (err) {
            console.error('File upload error:', err);
          }
        }
        setIsUploading(false);
      }

      const defaultPlaceholder = 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80';
      const allImages = [...existingImages, ...uploadedUrls];
      const finalImages = allImages.length > 0 ? allImages : [defaultPlaceholder];

      if (editingProduct) {
        // UPDATE existing product
        const res = await fetch('/api/produits', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: editingProduct.slug,
            title,
            category,
            brand,
            price,
            compareAtPrice: compareAtPrice || undefined,
            wattage: wattage || undefined,
            connector: connector || undefined,
            warranty: warranty || undefined,
            description: description || `Accessoire smartphone officiel haute performance sélectionné par Abdou Phone.`,
            images: finalImages,
            variants,
          }),
        });

        const data = await res.json();
        if (data.success && data.product) {
          setProducts((prev) => prev.map((p) => (p.slug === editingProduct.slug ? data.product : p)));
          setSuccessMsg(`Produit "${data.product.title}" mis à jour avec succès !`);
          pendingFiles.forEach((p) => URL.revokeObjectURL(p.preview));
          setPendingFiles([]);
          setExistingImages([]);
          setModalOpen(false);
          setEditingProduct(null);
          setTimeout(() => setSuccessMsg(''), 4000);
        } else {
          setErrorMsg(data.error || 'Erreur lors de la mise à jour.');
        }
      } else {
        // CREATE new product
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
            images: finalImages,
            variants,
            isFeatured: true,
            isActive: true,
          }),
        });

        const data = await res.json();
        if (data.success && data.product) {
          setProducts((prev) => [data.product, ...prev]);
          setSuccessMsg(`Produit "${data.product.title}" ajouté avec succès !`);
          pendingFiles.forEach((p) => URL.revokeObjectURL(p.preview));
          setPendingFiles([]);
          setExistingImages([]);
          setModalOpen(false);
          setTimeout(() => setSuccessMsg(''), 4000);
        } else {
          setErrorMsg(data.error || 'Erreur lors de la création du produit.');
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erreur de connexion au serveur.');
    } finally {
      setSubmitting(false);
      setIsUploading(false);
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

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Manage Categories Button */}
          <button
            type="button"
            onClick={() => setCategoryModalOpen(true)}
            className="h-10 px-3.5 rounded-xl bg-phone-surface border border-phone-border hover:border-phone-emerald/40 text-phone-frost font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Tag className="w-4 h-4 text-phone-emerald" />
            <span>Rayons ({dynamicCategories.length})</span>
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
            onClick={handleOpenCreateModal}
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
                <th className="py-3 px-4 text-right rtl:text-left font-semibold">Actions &amp; Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-phone-border/60">
              {filteredProducts.map((p) => {
                const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={p.slug} className="hover:bg-phone-surface-elevated/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => handleOpenPreview(p)}
                          className="relative w-11 h-11 rounded-xl overflow-hidden bg-phone-void shrink-0 border border-phone-border cursor-pointer group"
                        >
                          <Image src={p.images[0]} alt={p.title} fill sizes="44px" className="object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <div
                            onClick={() => handleOpenPreview(p)}
                            className="font-semibold text-phone-frost truncate hover:text-phone-emerald cursor-pointer"
                          >
                            {p.title}
                          </div>
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
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick View Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(p)}
                          className="p-1.5 rounded-lg bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-cyan hover:border-phone-cyan/40 transition-colors cursor-pointer"
                          title="Fiche Produit"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-emerald hover:border-phone-emerald/40 transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.slug, p.title)}
                          className="p-1.5 rounded-lg bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-danger hover:border-phone-danger/40 transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Status Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleProductActive(p.slug)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer select-none ${
                            p.isActive
                              ? 'bg-phone-emerald/15 text-phone-emerald border border-phone-emerald/30'
                              : 'bg-phone-dim/20 text-phone-dim border border-phone-border'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{p.isActive ? 'Actif' : 'Off'}</span>
                        </button>
                      </div>
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
                  <span>{editingProduct ? 'Édition Produit' : 'Nouveau Référencement Catalogue'}</span>
                </div>
                <h2 className="text-xl font-bold text-phone-frost">
                  {editingProduct ? `Modifier "${editingProduct.title}"` : 'Ajouter un Accessoire Smartphone'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setEditingProduct(null);
                }}
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

            <form onSubmit={handleSaveProduct} className="space-y-5">
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

              {/* Row 4: Multi-Image Gallery Builder (Deferred Upload) */}
              <div className="space-y-3 p-4 rounded-2xl bg-phone-void border border-phone-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-phone-muted uppercase font-mono flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-phone-cyan" />
                    <span>Galerie Photos du Produit ({existingImages.length + pendingFiles.length} / 6)</span>
                  </label>
                  <span className="text-[10px] font-mono text-phone-emerald bg-phone-emerald/10 border border-phone-emerald/30 px-2 py-0.5 rounded-full">
                    ● Envoi Cloudinary uniquement à l&apos;enregistrement
                  </span>
                </div>

                {/* Hidden Multi-file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Images Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Existing Saved Images */}
                  {existingImages.map((imgUrl, idx) => (
                    <div
                      key={`exist_${idx}`}
                      className="relative aspect-square rounded-xl bg-phone-surface border border-phone-border overflow-hidden group shadow-sm"
                    >
                      <Image src={imgUrl} alt={`Photo ${idx + 1}`} fill sizes="120px" className="object-cover" />
                      {idx === 0 && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-phone-frost text-phone-void shadow-sm z-10">
                          Couverture
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-phone-danger text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                        title="Supprimer cette image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Pending New Images (Local 0ms Preview) */}
                  {pendingFiles.map((item, idx) => {
                    const isFirstOverall = existingImages.length === 0 && idx === 0;
                    return (
                      <div
                        key={item.id}
                        className="relative aspect-square rounded-xl bg-phone-surface border-2 border-phone-cyan/60 overflow-hidden group shadow-sm"
                      >
                        <Image src={item.preview} alt="Aperçu local" fill sizes="120px" className="object-cover" />
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-phone-cyan text-phone-void shadow-sm z-10">
                          {isFirstOverall ? 'Couverture' : 'Nouvelle'}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePendingFile(item.id)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-phone-danger text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                          title="Supprimer cette image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Add Photos Dropzone Card */}
                  {existingImages.length + pendingFiles.length < 6 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files) handleSelectFiles(e.dataTransfer.files);
                      }}
                      className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 p-3 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-phone-emerald bg-phone-emerald/10'
                          : 'border-phone-border hover:border-phone-emerald/50 hover:bg-phone-surface-elevated bg-phone-surface'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-phone-surface-elevated border border-phone-border flex items-center justify-center text-phone-emerald">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-phone-frost leading-tight">
                        Ajouter des photos
                      </span>
                      <span className="text-[9px] font-mono text-phone-dim">JPG, PNG, WEBP</span>
                    </div>
                  )}
                </div>

                {/* Optional Fallback for manual link */}
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShowUrlFallback((prev) => !prev)}
                    className="text-phone-dim hover:text-phone-cyan underline cursor-pointer"
                  >
                    {showUrlFallback ? 'Masquer la saisie URL' : 'Ou ajouter une URL d’image externe'}
                  </button>
                  {isUploading && (
                    <span className="text-phone-cyan flex items-center gap-1 font-mono text-[10px]">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Téléversement Cloudinary en cours...
                    </span>
                  )}
                </div>

                {showUrlFallback && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="url"
                      value={manualImageUrl}
                      onChange={(e) => setManualImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 h-9 px-3 rounded-xl bg-phone-surface border border-phone-border text-phone-frost text-xs font-mono focus:outline-none focus:border-phone-emerald"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualUrl}
                      className="h-9 px-3 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost text-xs font-bold hover:bg-phone-surface"
                    >
                      Ajouter
                    </button>
                  </div>
                )}
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
                  onClick={() => {
                    setModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-phone-border text-phone-muted hover:text-phone-frost text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-phone-emerald hover:bg-phone-emerald/90 text-phone-void font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {submitting
                    ? 'Enregistrement...'
                    : editingProduct
                    ? 'Enregistrer les Modifications'
                    : 'Enregistrer le Produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK VIEW PRODUCT DRAWER */}
      {previewingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="w-full max-w-lg h-full bg-phone-surface border-l border-phone-border p-6 sm:p-8 space-y-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-phone-border pb-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-phone-cyan font-bold">
                <Eye className="w-4 h-4" />
                <span>Fiche Technique Article</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingProduct(null)}
                className="p-2 rounded-xl bg-phone-surface-elevated text-phone-dim hover:text-phone-frost cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Image Stage */}
            <div className="space-y-3">
              <div className="relative aspect-video sm:aspect-square w-full rounded-2xl bg-phone-void border border-phone-border overflow-hidden shadow-sm">
                <Image
                  src={previewingProduct.images[previewImageIndex] || previewingProduct.images[0] || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'}
                  alt={previewingProduct.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-phone-surface/90 border border-phone-border text-phone-frost">
                  {previewingProduct.category}
                </div>
              </div>

              {/* Thumbnails if multi-image */}
              {previewingProduct.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {previewingProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPreviewImageIndex(idx)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        previewImageIndex === idx
                          ? 'border-phone-cyan scale-105 shadow-sm'
                          : 'border-phone-border opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`Miniature ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-phone-dim">{previewingProduct.brand} • SKU {previewingProduct.slug}</div>
              <h3 className="text-xl font-bold text-phone-frost">{previewingProduct.title}</h3>
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-extrabold font-mono text-phone-emerald">
                  {previewingProduct.price.toLocaleString('fr-DZ')} DZD
                </span>
                {previewingProduct.compareAtPrice && (
                  <span className="text-sm font-mono text-phone-dim line-through">
                    {previewingProduct.compareAtPrice.toLocaleString('fr-DZ')} DZD
                  </span>
                )}
              </div>
            </div>

            {/* Hardware Specs */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-phone-void border border-phone-border text-xs">
              <div>
                <span className="text-[10px] font-mono text-phone-dim uppercase block">Puissance</span>
                <span className="font-semibold text-phone-frost">{previewingProduct.wattage || 'Standard'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-phone-dim uppercase block">Connectique</span>
                <span className="font-semibold text-phone-frost">{previewingProduct.connector || 'Universel'}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-phone-border/50">
                <span className="text-[10px] font-mono text-phone-dim uppercase block">Garantie</span>
                <span className="font-semibold text-phone-emerald">{previewingProduct.warranty || 'Garantie 6 Mois'}</span>
              </div>
            </div>

            {/* Variants & Stocks */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-phone-dim">
                Variantes &amp; Unités Disponibles ({previewingProduct.variants.length})
              </div>
              <div className="space-y-2">
                {previewingProduct.variants.map((v, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-phone-surface-elevated border border-phone-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-phone-frost">{v.color}</div>
                      <div className="text-[11px] text-phone-dim">{v.compatibility}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-phone-frost">{v.stock}</span>
                      <span className="text-[10px] text-phone-muted block">en stock</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-phone-dim block">Description</span>
              <p className="text-phone-muted leading-relaxed">{previewingProduct.description}</p>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-phone-border flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const p = previewingProduct;
                  setPreviewingProduct(null);
                  handleOpenEditModal(p);
                }}
                className="flex-1 h-11 rounded-xl bg-phone-emerald hover:bg-phone-emerald/90 text-phone-void font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier l&apos;Article</span>
              </button>

              <Link
                href={`/produit/${previewingProduct.slug}`}
                target="_blank"
                className="h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border hover:text-phone-frost text-phone-muted flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Voir sur la boutique"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Boutique</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MANAGEMENT MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-phone-surface border border-phone-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-phone-border pb-4">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase text-phone-emerald font-bold flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-phone-emerald" />
                  <span>Gestion des Rayons</span>
                </div>
                <h2 className="text-xl font-bold text-phone-frost">Rayons &amp; Catégories ({dynamicCategories.length})</h2>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="p-2 rounded-xl bg-phone-surface-elevated text-phone-dim hover:text-phone-frost cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add New Category Form */}
            <form onSubmit={handleAddCategory} className="p-4 rounded-2xl bg-phone-void border border-phone-border space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-phone-frost flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-phone-emerald" />
                <span>Ajouter un nouveau rayon</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Nom (ex: Montres Connectées)"
                  className="w-full h-10 px-3 rounded-xl bg-phone-surface border border-phone-border text-phone-frost text-xs focus:outline-none focus:border-phone-emerald"
                />
                <input
                  type="text"
                  value={newCatArabic}
                  onChange={(e) => setNewCatArabic(e.target.value)}
                  placeholder="Nom en Arabe (ساعات ذكية)"
                  dir="rtl"
                  className="w-full h-10 px-3 rounded-xl bg-phone-surface border border-phone-border text-phone-frost text-xs focus:outline-none focus:border-phone-emerald"
                />
              </div>
              <button
                type="submit"
                disabled={submittingCat || !newCatName.trim()}
                className="w-full h-10 rounded-xl bg-phone-emerald hover:bg-phone-emerald/90 text-phone-void font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
              >
                {submittingCat ? 'Ajout en cours...' : 'Ajouter le Rayon'}
              </button>
            </form>

            {/* Existing Categories List */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase text-phone-dim">Rayons Actifs</div>
              <div className="divide-y divide-phone-border/50 max-h-60 overflow-y-auto">
                {dynamicCategories.map((c) => {
                  const prodCount = products.filter((p) => p.category === c.id).length;
                  return (
                    <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-phone-frost">{c.name}</span>
                        {c.arabicName && <span className="text-phone-dim text-[11px] ms-2 font-arabic">({c.arabicName})</span>}
                        <span className="text-[10px] font-mono text-phone-dim block">
                          ID: {c.id} • {prodCount} article{prodCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c.id, c.name)}
                        className="p-1.5 rounded-lg text-phone-dim hover:text-phone-danger hover:bg-phone-danger/10 transition-colors cursor-pointer"
                        title="Supprimer ce rayon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
