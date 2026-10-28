'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function FloatingWhatsApp() {
  const storePhone = '0669014890';
  const cleanPhone = '213' + storePhone.replace(/^0/, '');

  return (
    <aside
      aria-label="Assistance WhatsApp"
      className="fixed bottom-5 left-5 z-40 print:hidden animate-in fade-in-0 duration-300"
    >
      <a
        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          "Salam Abdou Phone ! J'ai une question concernant un accessoire smartphone."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter Abdou Phone sur WhatsApp"
        className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/40 border border-emerald-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 fill-white text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white" />
        </div>
        <span className="text-xs font-bold font-mono hidden sm:inline-block">
          WhatsApp Abdou Phone
        </span>
      </a>
    </aside>
  );
}
