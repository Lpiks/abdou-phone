'use client';

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Phone,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Copy,
  Clock,
  MapPin,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { IOrder, OrderStatus } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminRecuperationPage() {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScriptLang, setActiveScriptLang] = useState<'fr' | 'ar' | 'en'>('fr');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/commandes');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.warn('Failed to load recovery orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const pendingOrders = orders.filter((o) => o.status === 'en_attente');

  const updateStatus = async (orderNumber: string, newStatus: OrderStatus, notes?: string) => {
    try {
      const res = await fetch('/api/admin/commandes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, status: newStatus, adminNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.orderNumber === orderNumber ? { ...o, status: newStatus, adminNotes: notes || o.adminNotes } : o
          )
        );
        setActionFeedback(`Commande ${orderNumber} passée en statut : ${newStatus}`);
        setTimeout(() => setActionFeedback(null), 3000);
      }
    } catch (e) {
      console.warn('Failed to update order in recovery:', e);
    }
  };

  const getConfirmationScript = (order: IOrder, lang: 'fr' | 'ar' | 'en') => {
    const customerName = order.customer.fullName;
    const itemsList = order.items.map((it) => it.title).join(', ');
    const wilaya = order.customer.wilayaName;

    if (lang === 'ar') {
      return `السلام عليكم خويا/أختي ${customerName}، معاك خدمة الزبائن من متجر عبدو فون (Abdou Phone). شَفْنا طلبيتك رقم ${order.orderNumber} الخاصة بـ (${itemsList}) نحو ولاية ${wilaya}. حَبّينا نأكدوا معاك العنوان باش نخرجوها في الشحن اليوم والدفع نقدًا عند الاستلام ؟`;
    }

    if (lang === 'en') {
      return `Hello ${customerName}, this is Abdou Phone customer care regarding your order ${order.orderNumber} (${itemsList}) to ${wilaya}. We are preparing today's express shipments with Cash on Delivery. Could you please confirm if you would like us to dispatch your parcel today? Thank you!`;
    }

    return `Bonjour ${customerName}, c'est Abdou Phone ! Nous préparons les expéditions express du jour vers ${wilaya} pour votre commande ${order.orderNumber} (${itemsList}) avec paiement à la livraison. Confirmez-vous l'envoi afin que notre livreur vous l'achemine sous 24h-48h ? Merci de votre confiance !`;
  };

  const copyScript = (order: IOrder) => {
    const text = getConfirmationScript(order, activeScriptLang);
    navigator.clipboard.writeText(text);
    setCopiedId(order.orderNumber);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-phone-frost tracking-tight flex items-center gap-2.5">
            <PhoneCall className="w-7 h-7 text-phone-amber" />
            <span>{t('adminRecoveryTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-phone-muted mt-1">
            {t('adminRecoverySubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Script Language Switcher */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-phone-surface border border-phone-border">
            <button
              type="button"
              onClick={() => setActiveScriptLang('fr')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeScriptLang === 'fr'
                  ? 'bg-phone-frost text-phone-void'
                  : 'text-phone-muted hover:text-phone-frost'
              }`}
            >
              Français
            </button>
            <button
              type="button"
              onClick={() => setActiveScriptLang('ar')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeScriptLang === 'ar'
                  ? 'bg-phone-frost text-phone-void'
                  : 'text-phone-muted hover:text-phone-frost'
              }`}
            >
              الدارجة الجزائري
            </button>
            <button
              type="button"
              onClick={() => setActiveScriptLang('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeScriptLang === 'en'
                  ? 'bg-phone-frost text-phone-void'
                  : 'text-phone-muted hover:text-phone-frost'
              }`}
            >
              English
            </button>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            className="p-2.5 rounded-xl bg-phone-surface border border-phone-border text-phone-muted hover:text-phone-frost transition-colors cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3 rounded-xl bg-phone-emerald/15 border border-phone-emerald/30 text-phone-emerald text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Pending Counter Banner */}
      <div className="p-4 rounded-2xl bg-phone-amber/10 border border-phone-amber/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-phone-amber animate-pulse" />
          <div>
            <div className="text-xs font-bold text-phone-amber uppercase tracking-wider">
              {pendingOrders.length} {t('adminRecoveryPendingBadge')}
            </div>
            <div className="text-[11px] text-phone-dim mt-0.5">
              Un appel rapide sous 30 minutes augmente le taux de livraison réussie de 85% en Algérie.
            </div>
          </div>
        </div>
      </div>

      {/* List of Pending Confirmation Cards */}
      <div className="space-y-4">
        {pendingOrders.length === 0 ? (
          <div className="p-10 rounded-2xl bg-phone-surface border border-phone-border text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-phone-emerald mx-auto" />
            <div className="text-sm font-bold text-phone-frost">
              Toutes les commandes ont été confirmées !
            </div>
            <div className="text-xs text-phone-dim">
              Aucune commande en attente d’appel client actuellement.
            </div>
          </div>
        ) : (
          pendingOrders.map((order) => {
            const script = getConfirmationScript(order, activeScriptLang);
            const isCopied = copiedId === order.orderNumber;

            return (
              <div
                key={order.orderNumber}
                className="p-5 sm:p-6 rounded-2xl bg-phone-surface border border-phone-border space-y-4 shadow-sm"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-phone-border pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-base text-phone-frost">
                      {order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-phone-amber/15 text-phone-amber border border-phone-amber/30">
                      En attente d’appel
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Call Customer Direct Link */}
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="px-4 py-2 rounded-xl bg-phone-emerald hover:bg-phone-emerald/90 text-phone-void font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t('adminRecoveryCallNow')} ({order.customer.phone})</span>
                    </a>

                    {order.customer.secondaryPhone && (
                      <a
                        href={`tel:${order.customer.secondaryPhone}`}
                        className="p-2 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost hover:text-phone-emerald text-xs font-semibold cursor-pointer"
                        title={`Appeler tél 2 : ${order.customer.secondaryPhone}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Customer info */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-phone-dim uppercase">Destinataire</div>
                    <div className="font-bold text-phone-frost">{order.customer.fullName}</div>
                    <div className="text-phone-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-phone-emerald shrink-0" />
                      <span>{order.customer.wilayaName} • {order.customer.commune}</span>
                    </div>
                    <div className="text-[11px] text-phone-dim line-clamp-1">{order.customer.address}</div>
                  </div>

                  {/* Order items */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-phone-dim uppercase">Accessoires Commandés</div>
                    <div className="font-medium text-phone-frost space-y-0.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="line-clamp-1">
                          • {item.quantity}x {item.title} ({item.selectedCompatibility})
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and total */}
                  <div className="space-y-1 sm:text-right rtl:sm:text-left">
                    <div className="text-[10px] font-mono text-phone-dim uppercase">Montant Total COD</div>
                    <div className="text-base font-black font-mono text-phone-emerald">
                      {order.totalAmount.toLocaleString('fr-DZ')} DZD
                    </div>
                    <div className="text-[11px] text-phone-dim">
                      Livraison : {order.deliveryType === 'domicile' ? 'À Domicile' : 'Stop Desk'}
                    </div>
                  </div>
                </div>

                {/* Script Box */}
                <div className="p-3.5 rounded-xl bg-phone-void/80 border border-phone-border space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-phone-dim uppercase font-bold flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-phone-cyan" />
                      <span>Script d’Appel ou SMS ({activeScriptLang.toUpperCase()})</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => copyScript(order)}
                      className="inline-flex items-center gap-1 text-xs text-phone-emerald hover:underline font-semibold cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{isCopied ? 'Copié !' : t('adminRecoverySmsScript')}</span>
                    </button>
                  </div>

                  <p
                    className="text-xs text-phone-frost/90 italic leading-relaxed"
                    dir={activeScriptLang === 'ar' ? 'rtl' : 'ltr'}
                  >
                    « {script} »
                  </p>
                </div>

                {/* Quick Status Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-phone-border/60">
                  <button
                    type="button"
                    onClick={() => updateStatus(order.orderNumber, 'annule', 'Client injoignable ou désistement')}
                    className="px-3 py-1.5 rounded-lg border border-phone-danger/30 text-phone-danger hover:bg-phone-danger/10 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Annuler Commande
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        order.orderNumber,
                        'en_attente',
                        `Client injoignable le ${new Date().toLocaleTimeString('fr-DZ')} - À rappeler`
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-phone-border text-phone-muted hover:text-phone-frost text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Injoignable (Noter rappel)
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStatus(order.orderNumber, 'confirme', 'Confirmé verbalement par téléphone')}
                    className="px-4 py-1.5 rounded-lg bg-phone-emerald text-phone-void font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-phone-emerald/90 cursor-pointer transition-all shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('adminRecoveryMarkConfirmed')}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
