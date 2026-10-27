'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, PackageCheck, Menu, X } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { t, dir } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/boutique') {
      return pathname === '/boutique';
    }
    if (href === '/suivi-commande') return pathname === '/suivi-commande';
    return pathname.startsWith(href);
  };

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/boutique', label: t('navCatalog') },
    { href: '/boutique?cat=chargeurs', label: t('navChargers') },
    { href: '/boutique?cat=coques', label: t('navCases') },
    { href: '/boutique?cat=powerbanks', label: t('navPowerbanks') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-phone-void/90 backdrop-blur-md border-b border-phone-border transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo - Responsive sizing for small screens */}
        <div className="shrink-0">
          <BrandLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors cursor-pointer ${
              pathname === '/'
                ? 'text-phone-emerald font-bold border-b-2 border-phone-emerald pb-0.5'
                : 'text-phone-muted hover:text-phone-frost'
            }`}
          >
            {t('navHome')}
          </Link>
          <Link
            href="/boutique"
            className={`transition-colors cursor-pointer ${
              pathname === '/boutique'
                ? 'text-phone-emerald font-bold border-b-2 border-phone-emerald pb-0.5'
                : 'text-phone-muted hover:text-phone-frost'
            }`}
          >
            {t('navCatalog')}
          </Link>
          <Link
            href="/boutique?cat=chargeurs"
            className="text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
          >
            {t('navChargers')}
          </Link>
          <Link
            href="/boutique?cat=coques"
            className="text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
          >
            {t('navCases')}
          </Link>
          <Link
            href="/boutique?cat=powerbanks"
            className="text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
          >
            {t('navPowerbanks')}
          </Link>
          <Link
            href="/suivi-commande"
            className={`flex items-center gap-1.5 text-xs font-mono uppercase px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              pathname === '/suivi-commande'
                ? 'bg-phone-emerald/15 border-phone-emerald text-phone-emerald font-bold shadow-sm'
                : 'bg-phone-surface border-phone-border text-phone-muted hover:text-phone-emerald hover:border-phone-emerald/40'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5 text-phone-emerald" />
            <span>{t('navTrackOrder')}</span>
          </Link>
        </nav>

        {/* Action Controls & Language Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Compact Dropdown Switcher */}
          <LanguageSwitcher />

          {/* Quick Search Link */}
          <Link
            href="/boutique"
            aria-label={t('navSearch')}
            className="p-2 sm:p-2.5 h-9 sm:h-10 w-9 sm:w-10 flex items-center justify-center rounded-xl bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-frost hover:bg-phone-surface-hover transition-colors cursor-pointer shrink-0"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={openCart}
            aria-label={t('navCart')}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 h-9 sm:h-10 rounded-xl bg-phone-surface border border-phone-border text-phone-frost hover:border-phone-emerald/50 hover:bg-phone-surface-hover transition-all cursor-pointer relative group shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-phone-frost group-hover:text-phone-emerald transition-colors" />
            <span className="text-xs font-bold font-mono">
              {itemCount > 0 ? itemCount : 0}
            </span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-phone-emerald ring-2 ring-phone-void animate-pulse" />
            )}
          </button>

          {/* Mobile Menu Toggle (Tablets & Mobile) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 sm:p-2.5 h-9 sm:h-10 w-9 sm:w-10 flex items-center justify-center rounded-xl bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-frost cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-phone-border bg-phone-void px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          {/* Language Switcher in Mobile Drawer */}
          <div className="pb-3 border-b border-phone-border flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-phone-muted font-bold">Langue / اللغة :</span>
            <LanguageSwitcher />
          </div>

          <div className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3.5 py-2.5 rounded-xl font-semibold transition-colors ${
                pathname === '/'
                  ? 'bg-phone-emerald/15 text-phone-emerald border border-phone-emerald/30 font-bold'
                  : 'hover:bg-phone-surface text-phone-muted hover:text-phone-frost'
              }`}
            >
              {t('navHome')}
            </Link>
            <Link
              href="/boutique"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3.5 py-2.5 rounded-xl transition-colors ${
                pathname === '/boutique'
                  ? 'bg-phone-emerald/15 text-phone-emerald border border-phone-emerald/30 font-bold'
                  : 'hover:bg-phone-surface text-phone-muted hover:text-phone-frost'
              }`}
            >
              {t('navCatalog')}
            </Link>
            <Link
              href="/boutique?cat=chargeurs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl hover:bg-phone-surface text-phone-muted hover:text-phone-frost"
            >
              {t('navChargers')}
            </Link>
            <Link
              href="/boutique?cat=coques"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl hover:bg-phone-surface text-phone-muted hover:text-phone-frost"
            >
              {t('navCases')}
            </Link>
            <Link
              href="/boutique?cat=powerbanks"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl hover:bg-phone-surface text-phone-muted hover:text-phone-frost"
            >
              {t('navPowerbanks')}
            </Link>
            <Link
              href="/suivi-commande"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3.5 py-3 rounded-xl font-bold transition-colors ${
                pathname === '/suivi-commande'
                  ? 'bg-phone-emerald/20 border border-phone-emerald text-phone-emerald'
                  : 'bg-phone-emerald/10 border border-phone-emerald/30 text-phone-emerald'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>{t('navTrackOrder')} (58 Wilayas)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
