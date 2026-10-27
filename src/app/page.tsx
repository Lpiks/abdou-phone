import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Truck, ArrowRight, Cpu, BatteryCharging, Headphones, Smartphone } from 'lucide-react';
import StoreShell from '@/components/store/StoreShell';
import ProductCard from '@/components/store/ProductCard';
import { listAllProducts } from '@/lib/orders-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const allProducts = await listAllProducts();
  const featuredProducts = allProducts.filter((p) => p.isFeatured).slice(0, 6);
  const chargers = allProducts.filter((p) => p.category === 'chargeurs').slice(0, 3);

  const categories = [
    { id: 'chargeurs', name: 'Chargeurs GaN', icon: <Zap className="w-5 h-5 text-phone-emerald" />, desc: '20W à 65W Ultra-rapide' },
    { id: 'cables', name: 'Câbles Blindés', icon: <Cpu className="w-5 h-5 text-phone-emerald" />, desc: '100W PD & Nylon Tressé' },
    { id: 'coques', name: 'Coques & MagSafe', icon: <Smartphone className="w-5 h-5 text-phone-emerald" />, desc: 'Grade Militaire Antichoc' },
    { id: 'protection', name: 'Verres 9H & Privacy', icon: <ShieldCheck className="w-5 h-5 text-phone-emerald" />, desc: 'Anti-espion & Saphir' },
    { id: 'powerbanks', name: 'Batteries Externes', icon: <BatteryCharging className="w-5 h-5 text-phone-emerald" />, desc: '10K & 20K mAh Turbo' },
    { id: 'audio', name: 'Audio & Écouteurs', icon: <Headphones className="w-5 h-5 text-phone-emerald" />, desc: 'ANC Réduction de Bruit' },
  ];

  return (
    <StoreShell>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28 border-b border-phone-border">
        {/* Ambient Radial Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[220px] sm:h-[350px] bg-phone-emerald/10 blur-[80px] sm:blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 sm:space-y-6">
          {/* Hardware Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-phone-surface border border-phone-border shadow-sm max-w-full">
            <span className="w-2 h-2 rounded-full bg-phone-emerald animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-phone-frost truncate">
              Hardware &amp; Accessoires Smartphone • Algérie
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-phone-frost max-w-4xl mx-auto leading-tight sm:leading-none">
            La Puissance &amp; La Protection{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-phone-frost via-phone-muted to-phone-emerald">
              Sans Compromis.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base lg:text-lg text-phone-muted max-w-2xl mx-auto leading-relaxed px-1">
            Chargeurs GaN certifiés, câbles tressés 100W, coques MagSafe et verres trempés haute résistance. Testés rigoureusement et livrés dans les 58 wilayas d&apos;Algérie avec paiement en espèces à la livraison.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 sm:pt-4">
            <Link
              href="/boutique"
              className="w-full sm:w-auto h-12 sm:h-13 px-6 sm:px-8 rounded-2xl bg-phone-frost hover:bg-white text-phone-void font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explorer tout le catalogue (~100 SKUs)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/suivi-commande"
              className="w-full sm:w-auto h-12 sm:h-13 px-5 sm:px-6 rounded-2xl bg-phone-surface border border-phone-border hover:border-phone-border-light hover:bg-phone-surface-hover text-phone-frost font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Truck className="w-4 h-4 text-phone-emerald" />
              <span>Suivre mon colis (58 Wilayas)</span>
            </Link>
          </div>

          {/* 4 Metrics */}
          <div className="pt-6 sm:pt-12 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-phone-surface/50 border border-phone-border">
              <div className="text-xl sm:text-2xl font-bold font-mono text-phone-frost">58</div>
              <div className="text-[11px] sm:text-xs text-phone-muted">Wilayas desservies</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-phone-surface/50 border border-phone-border">
              <div className="text-xl sm:text-2xl font-bold font-mono text-phone-emerald">6 Mois</div>
              <div className="text-[11px] sm:text-xs text-phone-muted">Garantie échange neuf</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-phone-surface/50 border border-phone-border">
              <div className="text-xl sm:text-2xl font-bold font-mono text-phone-frost">100%</div>
              <div className="text-[11px] sm:text-xs text-phone-muted">Paiement à la livraison</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-phone-surface/50 border border-phone-border">
              <div className="text-xl sm:text-2xl font-bold font-mono text-phone-frost">0 Bloat</div>
              <div className="text-[11px] sm:text-xs text-phone-muted">Rapide &amp; Direct</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-phone-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-phone-emerald mb-1">
              Rayons &amp; Accessoires
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-phone-frost">
              Explorez par catégorie d&apos;équipement
            </h2>
          </div>
          <Link
            href="/boutique"
            className="text-xs font-bold font-mono text-phone-muted hover:text-phone-frost flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Voir toutes les catégories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/boutique?cat=${cat.id}`}
              className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-border hover:border-phone-border-light hover:bg-phone-surface-elevated transition-all group flex flex-col justify-between gap-4 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-phone-surface-elevated border border-phone-border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-phone-frost group-hover:text-phone-emerald transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-phone-dim mt-0.5 line-clamp-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (TOP GEAR) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-phone-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-phone-emerald mb-1">
              Sélection Incontournable
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-phone-frost">
              Les Accessoires les plus demandés en Algérie
            </h2>
          </div>
          <Link
            href="/boutique"
            className="text-xs font-bold font-mono text-phone-muted hover:text-phone-frost flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Voir les ~100 références</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* 4. HARDWARE SPOTLIGHT: GaN TECHNOLOGY */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-phone-surface border border-phone-border p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-phone-surface-elevated border border-phone-border text-[11px] font-mono font-bold text-phone-emerald">
              <Zap className="w-3.5 h-3.5 fill-phone-emerald" />
              <span>Dossier Technique • Révolution GaN III</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-phone-frost leading-tight">
              Pourquoi remplacer vos vieux chargeurs par du Nitrure de Gallium (GaN) ?
            </h2>
            <p className="text-sm text-phone-muted leading-relaxed">
              Le GaN dissipe 3 fois moins de chaleur que le silicium traditionnel. Vos smartphones se rechargent à puissance maximale sans faire chauffer la batterie, prolongeant directement la durée de vie de votre appareil.
            </p>
            <div className="pt-2">
              <Link
                href="/boutique?cat=chargeurs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-phone-frost hover:bg-white text-phone-void text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105 cursor-pointer"
              >
                <span>Découvrir la gamme GaN (20W à 65W)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </StoreShell>
  );
}
