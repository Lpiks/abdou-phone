'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  DollarSign,
  Package,
  ArrowRight,
  Boxes,
  ShieldCheck,
  Tag,
  PhoneCall,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import { IOrder, IProduct } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ORDER_STATUS_DETAILS } from '@/lib/orders-store';

export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resOrders, resProducts] = await Promise.all([
        fetch('/api/admin/commandes'),
        fetch('/api/produits'),
      ]);
      const dataOrders = await resOrders.json();
      const dataProducts = await resProducts.json();

      if (dataOrders.success) setOrders(dataOrders.orders);
      if (Array.isArray(dataProducts)) setProducts(dataProducts);
    } catch (e) {
      console.warn('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingOrders = orders.filter((o) => o.status === 'en_attente');
  const deliveredOrders = orders.filter((o) => o.status === 'livre');
  const totalRevenue = orders
    .filter((o) => o.status !== 'annule' && o.status !== 'retourne')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Critical stock items
  const criticalStockItems = products.flatMap((p) =>
    p.variants
      .filter((v) => v.stock < 10)
      .map((v) => ({
        productTitle: p.title,
        variant: `${v.compatibility} - ${v.color}`,
        stock: v.stock,
      }))
  );

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-phone-frost tracking-tight">
            {t('adminDashTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-phone-muted mt-1">
            {t('adminDashSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/commandes"
            className="h-10 px-4 rounded-xl bg-phone-frost hover:bg-white text-phone-void font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <span>{t('adminDashViewAllOrders')}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-border space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-phone-muted">
            <span>{t('adminDashTotalOrders')}</span>
            <ShoppingCart className="w-4 h-4 text-phone-dim" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-phone-frost">
            {orders.length}
          </div>
          <div className="text-[11px] text-phone-dim">
            {deliveredOrders.length} {t('stepDelivered')}
          </div>
        </div>

        {/* Pending Phone Call */}
        <Link
          href="/admin/recuperation"
          className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-amber/30 hover:border-phone-amber/60 transition-all space-y-2 relative overflow-hidden group cursor-pointer block"
        >
          <div className="flex items-center justify-between text-xs font-mono text-phone-amber">
            <span>{t('adminDashPendingCall')}</span>
            <Clock className="w-4 h-4 text-phone-amber animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-phone-amber">
            {pendingOrders.length}
          </div>
          <div className="text-[11px] text-phone-amber/80 flex items-center justify-between">
            <span>À contacter d’urgence</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Total Revenue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-emerald/30 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-phone-emerald">
            <span>{t('adminDashRevenue')}</span>
            <DollarSign className="w-4 h-4 text-phone-emerald" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-phone-emerald truncate">
            {totalRevenue.toLocaleString('fr-DZ')}{' '}
            <span className="text-xs font-bold font-sans">DZD</span>
          </div>
          <div className="text-[11px] text-phone-dim">Paiements Cash on Delivery</div>
        </div>

        {/* Catalog Products */}
        <Link
          href="/admin/produits"
          className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-border hover:border-phone-frost/30 transition-all space-y-2 relative overflow-hidden cursor-pointer block"
        >
          <div className="flex items-center justify-between text-xs font-mono text-phone-muted">
            <span>{t('adminDashActiveProducts')}</span>
            <Package className="w-4 h-4 text-phone-dim" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-phone-frost">
            {products.length}
          </div>
          <div className="text-[11px] text-phone-dim">Accessoires en vente active</div>
        </Link>
      </div>

      {/* Critical Stock Alert Banner (if any) */}
      {criticalStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-phone-amber/10 border border-phone-amber/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-phone-amber/20 flex items-center justify-center shrink-0 text-phone-amber">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-phone-amber uppercase tracking-wider">
                Alerte de Réapprovisionnement ({criticalStockItems.length} variantes)
              </h4>
              <p className="text-xs text-phone-muted mt-0.5">
                Certains accessoires ont moins de 10 unités restantes en rayon.
              </p>
            </div>
          </div>

          <Link
            href="/admin/stocks"
            className="px-3.5 py-1.5 rounded-xl bg-phone-amber text-phone-void font-bold text-xs flex items-center gap-1.5 hover:bg-phone-amber/90 transition-colors cursor-pointer shrink-0"
          >
            <span>Gérer les stocks</span>
            <ArrowRight className="w-3 h-3 rtl:rotate-180" />
          </Link>
        </div>
      )}

      {/* Quick Navigation Action Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-phone-muted">
          {t('adminDashQuickActions')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/commandes"
            className="p-3.5 rounded-xl bg-phone-surface border border-phone-border hover:border-phone-emerald/40 hover:bg-phone-surface-elevated transition-all flex flex-col gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-phone-emerald" />
            <span className="text-xs font-bold text-phone-frost">{t('adminNavOrders')}</span>
            <span className="text-[10px] text-phone-dim">Filtres 58 Wilayas & statuts</span>
          </Link>

          <Link
            href="/admin/stocks"
            className="p-3.5 rounded-xl bg-phone-surface border border-phone-border hover:border-phone-emerald/40 hover:bg-phone-surface-elevated transition-all flex flex-col gap-2 cursor-pointer"
          >
            <Boxes className="w-5 h-5 text-phone-cyan" />
            <span className="text-xs font-bold text-phone-frost">{t('adminNavStocks')}</span>
            <span className="text-[10px] text-phone-dim">Ajustement rapide des unités</span>
          </Link>

          <Link
            href="/admin/statistiques"
            className="p-3.5 rounded-xl bg-phone-surface border border-phone-border hover:border-phone-emerald/40 hover:bg-phone-surface-elevated transition-all flex flex-col gap-2 cursor-pointer"
          >
            <BarChart3 className="w-5 h-5 text-phone-frost" />
            <span className="text-xs font-bold text-phone-frost">{t('adminNavStats')}</span>
            <span className="text-[10px] text-phone-dim">Rapports & Ventes par wilaya</span>
          </Link>

          <Link
            href="/admin/promos"
            className="p-3.5 rounded-xl bg-phone-surface border border-phone-border hover:border-phone-emerald/40 hover:bg-phone-surface-elevated transition-all flex flex-col gap-2 cursor-pointer"
          >
            <Tag className="w-5 h-5 text-phone-amber" />
            <span className="text-xs font-bold text-phone-frost">{t('adminNavPromos')}</span>
            <span className="text-[10px] text-phone-dim">Codes rabais & influenceurs</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-phone-frost">
            {t('adminDashRecentOrders')}
          </h2>
          <Link
            href="/admin/commandes"
            className="text-xs text-phone-emerald hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Voir tout</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>

        <div className="bg-phone-surface border border-phone-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-w-0">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-phone-surface-elevated/70 border-b border-phone-border text-phone-dim font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Référence</th>
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Wilaya</th>
                  <th className="px-4 py-3 font-semibold">Articles</th>
                  <th className="px-4 py-3 font-semibold">Montant (DZD)</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold text-right rtl:text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-phone-border/60">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-phone-dim">
                      Aucune commande enregistrée pour le moment.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    const statusDetail = ORDER_STATUS_DETAILS[order.status] || ORDER_STATUS_DETAILS.en_attente;
                    return (
                      <tr key={order.orderNumber} className="hover:bg-phone-surface-elevated/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-phone-frost whitespace-nowrap">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3 font-medium text-phone-frost whitespace-nowrap">
                          <div>{order.customer.fullName}</div>
                          <div className="text-[11px] font-mono text-phone-dim">{order.customer.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-phone-muted whitespace-nowrap">
                          {order.customer.wilayaName} ({order.deliveryType === 'domicile' ? 'Domicile' : 'Stop Desk'})
                        </td>
                        <td className="px-4 py-3 text-phone-dim whitespace-nowrap">
                          {order.items.length} {order.items.length > 1 ? 'articles' : 'article'}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-phone-emerald whitespace-nowrap">
                          {order.totalAmount.toLocaleString('fr-DZ')} DZD
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'en_attente'
                                ? 'bg-phone-amber/15 text-phone-amber border border-phone-amber/30'
                                : order.status === 'confirme'
                                ? 'bg-phone-cyan/15 text-phone-cyan border border-phone-cyan/30'
                                : order.status === 'livre'
                                ? 'bg-phone-emerald/15 text-phone-emerald border border-phone-emerald/30'
                                : order.status === 'annule'
                                ? 'bg-phone-danger/15 text-phone-danger border border-phone-danger/30'
                                : 'bg-phone-border text-phone-frost'
                            }`}
                          >
                            {statusDetail.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right rtl:text-left whitespace-nowrap">
                          <Link
                            href={`/admin/commandes?num=${order.orderNumber}`}
                            className="px-2.5 py-1 rounded-lg bg-phone-surface-elevated border border-phone-border text-phone-frost hover:text-phone-emerald hover:border-phone-emerald/40 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Détails
                          </Link>
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
    </div>
  );
}
