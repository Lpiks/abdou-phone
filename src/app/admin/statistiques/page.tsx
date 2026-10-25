'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  ShoppingBag,
  Truck,
  CheckCircle2,
  DollarSign,
  Percent,
  Download,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { IOrder } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

type DateRange = 'today' | '7days' | '30days' | 'all';

export default function AdminStatistiquesPage() {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('all');

  useEffect(() => {
    fetch('/api/admin/commandes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.orders);
      })
      .catch((e) => console.warn('Failed to load stats orders:', e))
      .finally(() => setLoading(false));
  }, []);

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    if (dateRange === 'all') return orders;

    const now = Date.now();
    const limits: Record<'today' | '7days' | '30days', number> = {
      today: 1000 * 60 * 60 * 24,
      '7days': 1000 * 60 * 60 * 24 * 7,
      '30days': 1000 * 60 * 60 * 24 * 30,
    };

    const maxAge = limits[dateRange];
    return orders.filter((o) => {
      const orderTime = new Date(o.createdAt || Date.now()).getTime();
      return now - orderTime <= maxAge;
    });
  }, [orders, dateRange]);

  // Financial Metrics
  const grossRevenue = useMemo(() => {
    return filteredOrders
      .filter((o) => o.status !== 'annule' && o.status !== 'retourne')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [filteredOrders]);

  const deliveredRevenue = useMemo(() => {
    return filteredOrders
      .filter((o) => o.status === 'livre')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [filteredOrders]);

  const averageBasket = useMemo(() => {
    const validOrders = filteredOrders.filter((o) => o.status !== 'annule' && o.status !== 'retourne');
    if (validOrders.length === 0) return 0;
    return Math.round(grossRevenue / validOrders.length);
  }, [filteredOrders, grossRevenue]);

  // Delivery Split
  const deliverySplit = useMemo(() => {
    let domicile = 0;
    let desk = 0;
    filteredOrders.forEach((o) => {
      if (o.deliveryType === 'domicile') domicile++;
      else desk++;
    });
    const total = domicile + desk || 1;
    return {
      domicile,
      desk,
      domicilePct: Math.round((domicile / total) * 100),
      deskPct: Math.round((desk / total) * 100),
    };
  }, [filteredOrders]);

  // Geographic Breakdown by Wilaya
  const wilayaDistribution = useMemo(() => {
    const map: Record<string, { count: number; total: number; name: string }> = {};

    filteredOrders.forEach((o) => {
      const key = o.customer.wilayaName || 'Autre';
      if (!map[key]) {
        map[key] = { count: 0, total: 0, name: key };
      }
      map[key].count += 1;
      if (o.status !== 'annule' && o.status !== 'retourne') {
        map[key].total += o.totalAmount;
      }
    });

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [filteredOrders]);

  const maxWilayaCount = wilayaDistribution[0]?.count || 1;

  // Top Selling Products
  const topProducts = useMemo(() => {
    const map: Record<string, { title: string; units: number; revenue: number }> = {};

    filteredOrders.forEach((o) => {
      if (o.status === 'annule' || o.status === 'retourne') return;
      o.items.forEach((item) => {
        if (!map[item.title]) {
          map[item.title] = { title: item.title, units: 0, revenue: 0 };
        }
        map[item.title].units += item.quantity;
        map[item.title].revenue += item.price * item.quantity;
      });
    });

    return Object.values(map)
      .sort((a, b) => b.units - a.units)
      .slice(0, 6);
  }, [filteredOrders]);

  const dateFilterButtons: { key: DateRange; label: string }[] = [
    { key: 'today', label: t('adminStatsToday') },
    { key: '7days', label: t('adminStats7Days') },
    { key: '30days', label: t('adminStats30Days') },
    { key: 'all', label: t('adminStatsAllTime') },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-phone-frost tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-phone-emerald" />
            <span>{t('adminStatsTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-phone-muted mt-1">
            {t('adminStatsSubtitle')}
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-phone-surface border border-phone-border self-start sm:self-auto">
          {dateFilterButtons.map((btn) => (
            <button
              key={btn.key}
              type="button"
              onClick={() => setDateRange(btn.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                dateRange === btn.key
                  ? 'bg-phone-emerald text-phone-void shadow-sm'
                  : 'text-phone-muted hover:text-phone-frost'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Financial & Volume KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-phone-muted">
            <span>{t('adminStatsTotalSales')}</span>
            <DollarSign className="w-4 h-4 text-phone-emerald" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-phone-emerald">
            {grossRevenue.toLocaleString('fr-DZ')}{' '}
            <span className="text-xs font-bold font-sans">DZD</span>
          </div>
          <div className="text-[11px] text-phone-dim">Commandes actives et validées</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-phone-muted">
            <span>Encaissé COD Livré</span>
            <CheckCircle2 className="w-4 h-4 text-phone-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-phone-cyan">
            {deliveredRevenue.toLocaleString('fr-DZ')}{' '}
            <span className="text-xs font-bold font-sans">DZD</span>
          </div>
          <div className="text-[11px] text-phone-dim">Paiements espèces encaissés</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-phone-muted">
            <span>{t('adminStatsAvgOrder')}</span>
            <TrendingUp className="w-4 h-4 text-phone-amber" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-phone-frost">
            {averageBasket.toLocaleString('fr-DZ')}{' '}
            <span className="text-xs font-bold font-sans">DZD</span>
          </div>
          <div className="text-[11px] text-phone-dim">Par panier confirmé</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-border space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-phone-muted">
            <span>Volume de Colis</span>
            <ShoppingBag className="w-4 h-4 text-phone-dim" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-phone-frost">
            {filteredOrders.length}
          </div>
          <div className="text-[11px] text-phone-dim">Commandes enregistrées</div>
        </div>
      </div>

      {/* 2 Analytical Blocks: Top Wilayas & Delivery Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wilayas Geographic Distribution */}
        <div className="lg:col-span-7 bg-phone-surface border border-phone-border rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-phone-frost flex items-center gap-2">
              <MapPin className="w-4 h-4 text-phone-emerald" />
              <span>{t('adminStatsTopWilayas')}</span>
            </h2>
            <span className="text-xs text-phone-dim font-mono">58 Wilayas</span>
          </div>

          <div className="space-y-3.5">
            {wilayaDistribution.length === 0 ? (
              <div className="py-6 text-center text-xs text-phone-dim">
                Aucune donnée géographique pour cette période.
              </div>
            ) : (
              wilayaDistribution.map((w, index) => {
                const percentage = Math.round((w.count / maxWilayaCount) * 100);
                return (
                  <div key={w.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-phone-surface-elevated font-mono text-[10px] text-phone-muted flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-phone-frost">{w.name}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-phone-muted">{w.count} colis</span>
                        <span className="text-phone-emerald font-bold">{w.total.toLocaleString('fr-DZ')} DZD</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-phone-surface-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-phone-emerald/80 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Delivery Method Split */}
        <div className="lg:col-span-5 bg-phone-surface border border-phone-border rounded-2xl p-5 sm:p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-phone-frost flex items-center gap-2">
              <Truck className="w-4 h-4 text-phone-cyan" />
              <span>{t('adminStatsDeliveryTypeSplit')}</span>
            </h2>

            <div className="space-y-4 pt-2">
              {/* Home Delivery Card */}
              <div className="p-4 rounded-xl bg-phone-surface-elevated border border-phone-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-phone-frost">Livraison à Domicile</span>
                  <span className="font-mono text-phone-cyan font-bold">{deliverySplit.domicilePct}%</span>
                </div>
                <div className="h-2 w-full bg-phone-void rounded-full overflow-hidden">
                  <div
                    className="h-full bg-phone-cyan rounded-full transition-all duration-500"
                    style={{ width: `${deliverySplit.domicilePct}%` }}
                  />
                </div>
                <div className="text-[11px] font-mono text-phone-dim flex justify-between">
                  <span>Remis en main propre</span>
                  <span>{deliverySplit.domicile} commandes</span>
                </div>
              </div>

              {/* Stop Desk Card */}
              <div className="p-4 rounded-xl bg-phone-surface-elevated border border-phone-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-phone-frost">Point Relais (Stop Desk)</span>
                  <span className="font-mono text-phone-amber font-bold">{deliverySplit.deskPct}%</span>
                </div>
                <div className="h-2 w-full bg-phone-void rounded-full overflow-hidden">
                  <div
                    className="h-full bg-phone-amber rounded-full transition-all duration-500"
                    style={{ width: `${deliverySplit.deskPct}%` }}
                  />
                </div>
                <div className="text-[11px] font-mono text-phone-dim flex justify-between">
                  <span>Retrait au bureau</span>
                  <span>{deliverySplit.desk} commandes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-phone-surface-elevated/40 border border-phone-border/60 text-[11px] text-phone-dim mt-4">
            💡 Astuce : Les livraisons Stop Desk ont un taux de retour inférieur de 30% par rapport au domicile en Algérie.
          </div>
        </div>
      </div>

      {/* Top Performing Accessories Table */}
      <div className="bg-phone-surface border border-phone-border rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-phone-frost flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-phone-amber" />
          <span>{t('adminStatsTopProducts')}</span>
        </h2>

        <div className="overflow-x-auto min-w-0">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="border-b border-phone-border text-phone-dim font-mono uppercase text-[10px]">
              <tr>
                <th className="py-2.5 font-semibold">Accessoire</th>
                <th className="py-2.5 font-semibold">Unités Vendues</th>
                <th className="py-2.5 font-semibold text-right rtl:text-left">Chiffre d’Affaires Généré</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-phone-border/60">
              {topProducts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-phone-dim">
                    Aucune vente enregistrée pour cette période.
                  </td>
                </tr>
              ) : (
                topProducts.map((p, idx) => (
                  <tr key={p.title} className="hover:bg-phone-surface-elevated/40 transition-colors">
                    <td className="py-3 font-semibold text-phone-frost flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-phone-surface-elevated font-mono text-[10px] text-phone-dim flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="line-clamp-1">{p.title}</span>
                    </td>
                    <td className="py-3 font-mono font-bold text-phone-frost">
                      {p.units} unités
                    </td>
                    <td className="py-3 font-mono font-bold text-phone-emerald text-right rtl:text-left">
                      {p.revenue.toLocaleString('fr-DZ')} DZD
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
