'use client';

import React, { useEffect } from 'react';
import { X, Printer, Share2 } from 'lucide-react';
import { IOrder } from '@/types';
import BordereauSlip from './BordereauSlip';

interface BordereauModalProps {
  order: IOrder;
  onClose: () => void;
}

export default function BordereauModal({ order, onClose }: BordereauModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const cleanPhone = order.customer.phone.replace(/\s+/g, '').replace(/^0/, '');
  const shareText = `Salam ${order.customer.fullName}, voici votre bon de commande Abdou Phone #${order.orderNumber} d'un montant de ${order.totalAmount.toLocaleString('fr-DZ')} DZD pour votre livraison à ${order.customer.wilayaName}.`;

  return (
    <div
      id="bordereau-modal-overlay"
      className="fixed inset-0 z-[60] flex flex-col items-center justify-start p-2 sm:p-6 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in-0 print:p-0 print:bg-white"
    >
      {/* Top Floating Control Bar (Hidden on print) */}
      <div className="w-full max-w-3xl mb-4 flex items-center justify-between gap-2 p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white shadow-2xl print:hidden sticky top-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-mono font-bold tracking-tight">
            Bordereau <span className="text-cyan-400">#{order.orderNumber}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* WhatsApp Share */}
          <a
            href={`https://wa.me/213${cleanPhone}?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Envoyer au client sur WhatsApp"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Direct Print / PDF */}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 sm:px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Imprimer / PDF</span>
          </button>

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer ml-1"
            title="Fermer la pop-up"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Sheet View */}
      <div className="w-full max-w-3xl pb-8 print:p-0 print:m-0 print:max-w-none">
        <BordereauSlip order={order} />
      </div>

      {/* Global Print Isolation Styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything outside the slip */
          body * {
            visibility: hidden !important;
          }
          #printable-bordereau-slip,
          #printable-bordereau-slip * {
            visibility: visible !important;
          }
          #printable-bordereau-slip {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 12mm 15mm !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: white !important;
            color: black !important;
          }
          /* Remove header/footer margins imposed by browser print dialog if supported */
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}</style>
    </div>
  );
}
