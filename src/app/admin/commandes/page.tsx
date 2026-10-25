'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, ShoppingCart, Check, AlertCircle, Eye, Phone, MapPin, X, Download, RefreshCw } from 'lucide-react';
import CustomSelect from '@/components/common/CustomSelect';
import { IOrder, OrderStatus } from '@/types';
import { ORDER_STATUS_DETAILS } from '@/data/order-status';
import { useLanguage } from '@/context/LanguageContext';

function AdminCommandesContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const targetNumber = searchParams.get('num') || '';

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(targetNumber);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [updatingStatusNumber, setUpdatingStatusNumber] = useState<string | null>(null);
  const [updateMsg, setUpdateMsg] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/commandes');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        if (targetNumber) {
          const found = data.orders.find((o: IOrder) => o.orderNumber === targetNumber);
          if (found) setSelectedOrder(found);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch admin orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderNumber: string, newStatus: OrderStatus) => {
    setUpdatingStatusNumber(orderNumber);
    try {
      const res = await fetch('/api/admin/commandes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        setUpdateMsg(`Statut mis à jour : ${ORDER_STATUS_DETAILS[newStatus]?.label}`);
        setTimeout(() => setUpdateMsg(''), 2500);
      }
    } catch (e) {
      console.warn('Failed to update status:', e);
    } finally {
      setUpdatingStatusNumber(null);
    }
  };

  const exportOrdersCsv = () => {
    const headers = ['Référence', 'Date', 'Client', 'Téléphone', 'Wilaya', 'Commune', 'Mode', 'Montant DZD', 'Statut'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      `"${new Date(o.createdAt || Date.now()).toLocaleDateString('fr-DZ')}"`,
      `"${o.customer.fullName.replace(/"/g, '""')}"`,
      o.customer.phone,
      `"${o.customer.wilayaName.replace(/"/g, '""')}"`,
      `"${o.customer.commune.replace(/"/g, '""')}"`,
      o.deliveryType,
      o.totalAmount,
      o.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abdou_phone_commandes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusOptions = [
    { value: 'all', label: t('adminOrdersAllStatuses') },
    { value: 'en_attente', label: t('adminOrdersStatusPending') },
    { value: 'confirme', label: t('adminOrdersStatusConfirmed') },
    { value: 'en_preparation', label: t('adminOrdersStatusPreparing') },
    { value: 'expedie', label: t('adminOrdersStatusShipped') },
    { value: 'livre', label: t('adminOrdersStatusDelivered') },
    { value: 'annule', label: t('adminOrdersStatusCancelled') },
  ];

  const updateStatusOptions = [
    { value: 'en_attente', label: t('adminOrdersStatusPending') },
    { value: 'confirme', label: t('adminOrdersStatusConfirmed') },
    { value: 'en_preparation', label: t('adminOrdersStatusPreparing') },
    { value: 'expedie', label: t('adminOrdersStatusShipped') },
    { value: 'livre', label: t('adminOrdersStatusDelivered') },
    { value: 'annule', label: t('adminOrdersStatusCancelled') },
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (statusFilter !== 'all' && ord.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesNumber = ord.orderNumber.toLowerCase().includes(q);
        const matchesName = ord.customer.fullName.toLowerCase().includes(q);
        const matchesPhone = ord.customer.phone.includes(q);
        const matchesWilaya = ord.customer.wilayaName.toLowerCase().includes(q);
        return matchesNumber || matchesName || matchesPhone || matchesWilaya;
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-phone-frost tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-phone-emerald" />
            <span>{t('adminOrdersTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-phone-muted mt-1">
            {t('adminOrdersSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchOrders}
            className="p-2.5 rounded-xl bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={exportOrdersCsv}
            className="h-10 px-4 rounded-xl bg-phone-surface border border-phone-border hover:border-phone-frost/30 text-phone-frost font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('adminOrdersExport')}</span>
          </button>
        </div>
      </div>

      {updateMsg && (
        <div className="p-3.5 rounded-xl bg-phone-emerald/15 border border-phone-emerald/30 text-phone-emerald text-xs font-semibold animate-in fade-in-0 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{updateMsg}</span>
        </div>
      )}

      {/* Filter Controls (100% CustomSelect) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-phone-surface border border-phone-border grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-7 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-phone-muted font-mono">
            {t('adminOrdersSearch')}
          </label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-phone-dim absolute start-3.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ex: ABD-2026-1041, Amine, 0550..."
              className="w-full h-11 ps-10 pe-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-xs font-medium focus:outline-none focus:border-phone-emerald/60"
            />
          </div>
        </div>

        <div className="md:col-span-5">
          <CustomSelect
            label={t('adminOrdersStatusFilter')}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={statusOptions}
            placeholder={t('adminOrdersAllStatuses')}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-phone-surface border border-phone-border overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-phone-dim flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-phone-emerald" />
            <span>Chargement des commandes...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-xs text-phone-dim font-medium">
            Aucune commande ne correspond à ces critères.
          </div>
        ) : (
          <div className="overflow-x-auto min-w-0">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="border-b border-phone-border bg-phone-surface-elevated/70 text-phone-dim font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">{t('adminOrdersDate')}</th>
                  <th className="py-3 px-4 font-semibold">{t('adminOrdersCustomer')}</th>
                  <th className="py-3 px-4 font-semibold">{t('adminOrdersWilaya')}</th>
                  <th className="py-3 px-4 font-semibold">{t('adminOrdersTotal')}</th>
                  <th className="py-3 px-4 font-semibold">{t('adminOrdersChangeStatus')}</th>
                  <th className="py-3 px-4 text-right rtl:text-left font-semibold">{t('adminOrdersActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-phone-border/60">
                {filteredOrders.map((ord) => (
                  <tr key={ord.orderNumber} className="hover:bg-phone-surface-elevated/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-phone-emerald">
                        {ord.orderNumber}
                      </div>
                      <div className="text-[10px] text-phone-dim font-mono">
                        {new Date(ord.createdAt || Date.now()).toLocaleDateString('fr-DZ', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-phone-frost">{ord.customer.fullName}</div>
                      <a
                        href={`tel:${ord.customer.phone}`}
                        className="text-[11px] font-mono text-phone-muted hover:text-phone-emerald transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{ord.customer.phone}</span>
                      </a>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-phone-frost">{ord.customer.wilayaName}</div>
                      <div className="text-[10px] text-phone-dim">
                        {ord.customer.commune} • <span className="capitalize">{ord.deliveryType === 'domicile' ? 'Domicile' : 'Stop Desk'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-phone-frost whitespace-nowrap">
                      {ord.totalAmount.toLocaleString('fr-DZ')} DZD
                    </td>

                    <td className="py-3.5 px-4 w-44 whitespace-nowrap">
                      <CustomSelect
                        size="sm"
                        value={ord.status}
                        disabled={updatingStatusNumber === ord.orderNumber}
                        onChange={(val) => handleUpdateStatus(ord.orderNumber, val as OrderStatus)}
                        options={updateStatusOptions}
                      />
                    </td>

                    <td className="py-3.5 px-4 text-right rtl:text-left whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 rounded-lg bg-phone-surface-elevated border border-phone-border text-[11px] font-bold text-phone-frost hover:bg-phone-border hover:text-phone-emerald transition-colors cursor-pointer"
                      >
                        {t('viewDetails')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-phone-void/80 backdrop-blur-md animate-in fade-in-0">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-phone-surface border border-phone-border shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-2 rounded-xl bg-phone-surface-elevated text-phone-dim hover:text-phone-frost cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-mono uppercase text-phone-emerald font-bold">
                {t('adminOrdersModalTitle')}
              </div>
              <h2 className="text-2xl font-bold font-mono text-phone-frost">
                {selectedOrder.orderNumber}
              </h2>
            </div>

            {/* Customer Box */}
            <div className="p-4 rounded-2xl bg-phone-surface-elevated border border-phone-border space-y-2 text-xs">
              <div className="font-bold uppercase tracking-wider text-phone-muted font-mono">
                Coordonnées Client &amp; Livraison
              </div>
              <div className="text-phone-frost font-semibold text-sm">
                {selectedOrder.customer.fullName}
              </div>
              <div className="flex items-center gap-3 font-mono text-phone-emerald">
                <a href={`tel:${selectedOrder.customer.phone}`} className="hover:underline cursor-pointer">
                  {selectedOrder.customer.phone}
                </a>
                {selectedOrder.customer.secondaryPhone && (
                  <>
                    <span>/</span>
                    <a href={`tel:${selectedOrder.customer.secondaryPhone}`} className="hover:underline cursor-pointer">
                      {selectedOrder.customer.secondaryPhone}
                    </a>
                  </>
                )}
              </div>
              <div className="text-phone-dim flex items-start gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-phone-dim shrink-0 mt-0.5" />
                <span>
                  {selectedOrder.customer.address}, {selectedOrder.customer.commune}, Wilaya :{' '}
                  {selectedOrder.customer.wilayaName} ({selectedOrder.deliveryType})
                </span>
              </div>
              {selectedOrder.customer.notes && (
                <div className="pt-2 border-t border-phone-border text-phone-muted italic">
                  Note : &ldquo;{selectedOrder.customer.notes}&rdquo;
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-phone-muted font-mono">
                Articles
              </div>
              <div className="divide-y divide-phone-border">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-phone-frost">{it.title}</div>
                      <div className="text-[11px] font-mono text-phone-dim">
                        Qté : {it.quantity} • {it.selectedCompatibility} ({it.selectedColor})
                      </div>
                    </div>
                    <span className="font-mono font-bold text-phone-frost">
                      {(it.price * it.quantity).toLocaleString('fr-DZ')} DZD
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="p-4 rounded-2xl bg-phone-void border border-phone-border space-y-1.5 text-xs">
              <div className="flex justify-between text-phone-muted">
                <span>Sous-total articles :</span>
                <span className="font-mono font-bold text-phone-frost">
                  {selectedOrder.subtotal.toLocaleString('fr-DZ')} DZD
                </span>
              </div>
              <div className="flex justify-between text-phone-muted">
                <span>Frais de port :</span>
                <span className="font-mono font-bold text-phone-emerald">
                  {selectedOrder.deliveryFee.toLocaleString('fr-DZ')} DZD
                </span>
              </div>
              <div className="pt-2 border-t border-phone-border flex justify-between text-sm font-bold text-phone-frost">
                <span>Total à encaisser :</span>
                <span className="font-mono text-base text-phone-frost">
                  {selectedOrder.totalAmount.toLocaleString('fr-DZ')} DZD
                </span>
              </div>
            </div>

            <div className="pt-2">
              <CustomSelect
                label={t('adminOrdersChangeStatus')}
                value={selectedOrder.status}
                onChange={(val) => handleUpdateStatus(selectedOrder.orderNumber, val as OrderStatus)}
                options={updateStatusOptions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCommandesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-phone-dim">Chargement...</div>}>
      <AdminCommandesContent />
    </Suspense>
  );
}
