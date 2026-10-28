import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CheckCircle2, Package, Truck, ArrowRight, Home, MessageSquare } from 'lucide-react';
import StoreShell from '@/components/store/StoreShell';
import { getOrderByNumber } from '@/lib/orders-store';
import { ORDER_STATUS_DETAILS } from '@/data/order-status';

export const dynamic = 'force-dynamic';

export default async function ConfirmationPage({ params }: { params: { orderId: string } }) {
  const order = await getOrderByNumber(params.orderId);

  if (!order) {
    notFound();
  }

  const statusConfig = ORDER_STATUS_DETAILS[order.status] || ORDER_STATUS_DETAILS.en_attente;

  return (
    <StoreShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Success Header Badge */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-phone-emerald/15 border border-phone-emerald/30 flex items-center justify-center text-phone-emerald shadow-glow">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-phone-surface border border-phone-border text-xs font-mono font-bold text-phone-emerald">
            <span>Commande Enregistrée avec Succès</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-phone-frost tracking-tight">
            Merci pour votre commande !
          </h1>
          <p className="text-sm text-phone-muted max-w-md mx-auto">
            Notre équipe vous contactera sous peu par téléphone au{' '}
            <strong className="text-phone-frost font-mono">{order.customer.phone}</strong> pour
            confirmer l&apos;expédition de vos accessoires.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="rounded-3xl bg-phone-surface border border-phone-border p-6 sm:p-8 space-y-6 shadow-card">
          {/* Tracking Number Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-phone-border">
            <div>
              <div className="text-xs font-mono uppercase text-phone-dim">Numéro de Commande</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-phone-emerald tracking-wide">
                {order.orderNumber}
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-phone-surface-elevated border border-phone-border text-xs font-mono text-phone-frost">
              <span className="w-2 h-2 rounded-full bg-phone-emerald" />
              <span>{statusConfig.label}</span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-phone-muted">
              Articles commandés ({order.items.length})
            </div>
            <div className="divide-y divide-phone-border">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-3 flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-phone-void shrink-0">
                    <Image src={it.image} alt={it.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-phone-frost truncate">
                      {it.title}
                    </h3>
                    <p className="text-[11px] font-mono text-phone-dim truncate">
                      Qté: {it.quantity} • {it.selectedCompatibility} ({it.selectedColor})
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-bold text-phone-frost shrink-0">
                    {(it.price * it.quantity).toLocaleString('fr-DZ')} DZD
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-4 rounded-2xl bg-phone-void border border-phone-border space-y-2 text-xs">
            <div className="flex justify-between text-phone-muted">
              <span>Sous-total articles :</span>
              <span className="font-mono text-phone-frost font-bold">
                {order.subtotal.toLocaleString('fr-DZ')} DZD
              </span>
            </div>
            <div className="flex justify-between text-phone-muted">
              <span>Livraison ({order.customer.wilayaName} - {order.deliveryType}) :</span>
              <span className="font-mono text-phone-emerald font-bold">
                {order.deliveryFee.toLocaleString('fr-DZ')} DZD
              </span>
            </div>
            <div className="pt-2 border-t border-phone-border flex justify-between text-base font-bold text-phone-frost">
              <span>Montant Total à Payer (Espèces) :</span>
              <span className="font-mono text-xl text-phone-frost">
                {order.totalAmount.toLocaleString('fr-DZ')} DZD
              </span>
            </div>
          </div>

          {/* Delivery Recipient Details */}
          <div className="p-4 rounded-2xl bg-phone-surface-elevated border border-phone-border text-xs space-y-1">
            <div className="font-bold text-phone-frost">Adresse de réception :</div>
            <div className="text-phone-muted">
              {order.customer.fullName} • {order.customer.phone}
            </div>
            <div className="text-phone-dim">
              {order.customer.address}, {order.customer.commune}, Wilaya de {order.customer.wilayaName}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col gap-3">
            {/* 1-Click WhatsApp Quick Send for Algerian Buyers */}
            <a
              href={`https://wa.me/213669014890?text=${encodeURIComponent(
                `Salam Abdou Phone, je viens de passer la commande #${order.orderNumber} d'un montant de ${order.totalAmount} DZD pour ${order.customer.wilayaName} (${order.customer.commune}). Je vous confirme ma commande et je peux vous envoyer ma position GPS.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-13 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirmer &amp; Envoyer ma position GPS sur WhatsApp</span>
            </a>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/suivi-commande?num=${order.orderNumber}`}
                className="flex-1 h-12 rounded-xl bg-phone-frost hover:bg-white text-phone-void font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Suivre ma commande en direct</span>
              </Link>

              <Link
                href="/"
                className="h-12 px-6 rounded-xl bg-phone-surface border border-phone-border hover:bg-phone-surface-hover text-phone-frost font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Accueil</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
