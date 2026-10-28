'use client';

import React from 'react';
import { Printer, Share2 } from 'lucide-react';

interface BordereauActionsProps {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  wilayaName: string;
  totalAmount: number;
}

export default function BordereauActions({
  orderNumber,
  customerName,
  customerPhone,
  wilayaName,
  totalAmount,
}: BordereauActionsProps) {
  const cleanPhone = customerPhone.replace(/\s+/g, '').replace(/^0/, '');
  const shareText = `Salam ${customerName}, voici votre bon de commande Abdou Phone #${orderNumber} d'un montant de ${totalAmount.toLocaleString('fr-DZ')} DZD pour votre livraison à ${wilayaName}.`;

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://wa.me/213${cleanPhone}?text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span>Partager WhatsApp</span>
      </a>

      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-white hover:bg-neutral-100 text-black text-xs font-extrabold uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer"
      >
        <Printer className="w-4 h-4" />
        <span>Imprimer / PDF</span>
      </button>
    </div>
  );
}
