import React from 'react';
import { IOrder } from '@/types';

interface BordereauSlipProps {
  order: IOrder;
}

export default function BordereauSlip({ order }: BordereauSlipProps) {
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('fr-DZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      id="printable-bordereau-slip"
      className="bg-white text-black p-6 sm:p-10 rounded-2xl shadow-xl print:shadow-none border border-neutral-300 print:border-none w-full max-w-3xl mx-auto text-left"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-black pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-black">
            Abdou Phone
          </h1>
          <p className="text-xs font-mono text-neutral-600 mt-0.5">
            Accessoires Smartphone &amp; Hardware Haute Performance
          </p>
          <p className="text-xs font-mono text-neutral-600">
            Tél : 0669 01 48 90 • Alger Centre, Algérie
          </p>
        </div>

        <div className="text-right">
          <div className="inline-block bg-black text-white text-xs font-mono font-bold px-3 py-1 rounded uppercase tracking-wider">
            Bordereau de Livraison
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono tracking-wider mt-1 text-black">
            {order.orderNumber}
          </div>
          <div className="text-[11px] font-mono text-neutral-500 mt-0.5">
            Date : {orderDate}
          </div>
        </div>
      </div>

      {/* Customer & Shipping Details Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-xl border border-neutral-300 bg-neutral-50 print:bg-white text-xs">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase text-neutral-500 mb-1">
            Destinataire (Client) :
          </div>
          <div className="text-sm font-black text-black">
            {order.customer.fullName}
          </div>
          <div className="text-sm font-mono font-bold text-neutral-900 mt-0.5">
            📞 {order.customer.phone}
            {order.customer.secondaryPhone && (
              <span className="text-neutral-600 font-normal"> / {order.customer.secondaryPhone}</span>
            )}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-mono font-bold uppercase text-neutral-500 mb-1">
            Lieu de Destination :
          </div>
          <div className="font-bold text-black">
            Wilaya : {order.customer.wilayaName} ({order.customer.commune})
          </div>
          <div className="text-neutral-700 mt-0.5">
            {order.customer.address}
          </div>
          <div className="mt-1">
            <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-neutral-200 text-black uppercase">
              {order.deliveryType === 'bureau' ? '📦 Récupération Stop Desk' : '🚚 Livraison à Domicile'}
            </span>
          </div>
        </div>

        {order.customer.notes && (
          <div className="col-span-1 sm:col-span-2 pt-2 border-t border-neutral-200 text-[11px] text-neutral-600 italic">
            Instructions spéciales : &ldquo;{order.customer.notes}&rdquo;
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="my-6">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-black font-mono text-[11px] uppercase text-black">
              <th className="py-2">Article / Accessoire</th>
              <th className="py-2">Modèle &amp; Couleur</th>
              <th className="py-2 text-center">Qté</th>
              <th className="py-2 text-right">P.U (DZD)</th>
              <th className="py-2 text-right">Total (DZD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {order.items.map((it, idx) => (
              <tr key={idx} className="py-2">
                <td className="py-2.5 font-bold pr-2 text-black">{it.title}</td>
                <td className="py-2.5 text-neutral-600 font-mono text-[11px]">
                  {it.selectedCompatibility} ({it.selectedColor})
                </td>
                <td className="py-2.5 text-center font-mono font-bold text-black">{it.quantity}</td>
                <td className="py-2.5 text-right font-mono text-neutral-800">{it.price.toLocaleString('fr-DZ')}</td>
                <td className="py-2.5 text-right font-mono font-bold text-black">
                  {(it.price * it.quantity).toLocaleString('fr-DZ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary & Giant COD Box */}
      <div className="my-6 pt-4 border-t-2 border-black flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div className="text-xs text-neutral-600 space-y-1">
          <p>• Paiement sécurisé en espèces à la livraison (Cash on Delivery).</p>
          <p>• Vérification de la conformité du colis autorisée avant règlement.</p>
          <p>• Garantie échange à neuf 6 mois Abdou Phone certifiée.</p>
        </div>

        <div className="w-full sm:w-72 space-y-1 text-xs">
          <div className="flex justify-between text-neutral-600">
            <span>Sous-total articles :</span>
            <span className="font-mono font-bold text-black">
              {order.subtotal.toLocaleString('fr-DZ')} DZD
            </span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Frais de port ({order.customer.wilayaName}) :</span>
            <span className="font-mono font-bold text-black">
              {order.deliveryFee.toLocaleString('fr-DZ')} DZD
            </span>
          </div>

          {/* Giant COD Box */}
          <div className="mt-3 p-3 bg-black text-white rounded-xl text-center space-y-0.5">
            <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-neutral-300">
              Montant Total à Encaisser :
            </div>
            <div className="text-2xl font-black font-mono tracking-tight text-white">
              {order.totalAmount.toLocaleString('fr-DZ')} DZD
            </div>
          </div>
        </div>
      </div>

      {/* Footer Signature */}
      <div className="mt-8 pt-4 border-t border-neutral-300 grid grid-cols-2 text-center text-xs text-neutral-500 font-mono">
        <div>Cachet &amp; Signature Expéditeur</div>
        <div>Signature &amp; Émargement Réceptionnaire</div>
      </div>
    </div>
  );
}
