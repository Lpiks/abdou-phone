'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  BarChart3,
  Tag,
  PhoneCall,
  ShieldCheck,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import LiveOrderNotifier from '@/components/admin/LiveOrderNotifier';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render bare without the admin frame
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const isRtl = language === 'ar';

  const navItems = [
    { href: '/admin/dashboard', label: t('adminNavDashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/admin/commandes', label: t('adminNavOrders'), icon: <ShoppingCart className="w-4 h-4" /> },
    { href: '/admin/produits', label: t('adminNavProducts'), icon: <Package className="w-4 h-4" /> },
    { href: '/admin/stocks', label: t('adminNavStocks'), icon: <Boxes className="w-4 h-4" /> },
    { href: '/admin/statistiques', label: t('adminNavStats'), icon: <BarChart3 className="w-4 h-4" /> },
    { href: '/admin/promos', label: t('adminNavPromos'), icon: <Tag className="w-4 h-4" /> },
    { href: '/admin/recuperation', label: t('adminNavRecovery'), icon: <PhoneCall className="w-4 h-4" /> },
    { href: '/admin/logs', label: t('adminNavLogs'), icon: <ShieldCheck className="w-4 h-4" /> },
    { href: '/admin/parametres', label: t('adminNavSettings'), icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div
      className="h-screen w-screen overflow-hidden bg-phone-void text-phone-frost hardware-grid flex flex-col md:flex-row"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top Mobile/Tablet Header Bar */}
      <header className="md:hidden w-full bg-phone-surface border-b border-phone-border px-4 py-3 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost hover:text-phone-emerald cursor-pointer transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <BrandLogo size="sm" asLink={false} />
        </div>

        <div className="flex items-center gap-2">
          <LiveOrderNotifier />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Desktop Fixed & Mobile Sliding Drawer) */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 md:w-64 lg:w-72 bg-phone-surface border-r rtl:border-r-0 rtl:border-l border-phone-border flex flex-col justify-between shrink-0 z-50 transition-transform duration-300 ${
          mobileMenuOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full md:translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {/* Brand & Language Switcher (Desktop) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <BrandLogo size="sm" asLink={false} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-phone-dim hover:text-phone-frost cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="hidden md:flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-phone-emerald uppercase tracking-wider font-bold">
                <Shield className="w-3 h-3 text-phone-emerald" />
                <span>{t('adminNavRole')}</span>
              </div>
              <div className="flex items-center gap-2">
                <LiveOrderNotifier />
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono uppercase tracking-widest text-phone-dim font-bold px-3 pt-2 border-t border-phone-border">
            Console d&apos;Administration
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-phone-emerald/15 text-phone-emerald border border-phone-emerald/30 shadow-sm'
                      : 'text-phone-muted hover:text-phone-frost hover:bg-phone-surface-elevated'
                  }`}
                >
                  <span className={isActive ? 'text-phone-emerald' : 'text-phone-dim'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-phone-border space-y-2 bg-phone-surface">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-phone-muted hover:text-phone-frost hover:bg-phone-surface-elevated transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t('adminNavViewStore')}</span>
            </span>
            <span className="text-[10px] font-mono text-phone-dim">Client</span>
          </Link>

          <Link
            href="/admin/login"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-phone-danger hover:bg-phone-danger/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('adminNavLogout')}</span>
          </Link>
        </div>
      </aside>

      {/* Main Administrative Stage */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10 max-w-full">
        {children}
      </main>
    </div>
  );
}
