'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Bell, ShoppingBag, X, CheckCircle2, ArrowRight, Volume2 } from 'lucide-react';
import { IOrder } from '@/types';

function playOrderChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';

    // Pleasant high-end cashier ding (D5 -> A5)
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // Autoplay restrictions or audio disabled
  }
}

export default function LiveOrderNotifier() {
  const [latestOrder, setLatestOrder] = useState<IOrder | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Auto-unlock audio on user's first click or touch anywhere on the page
  useEffect(() => {
    const unlockAudio = () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
        }
      } catch {}
    };
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  useEffect(() => {
    let es: EventSource | null = null;

    try {
      es = new EventSource('/api/admin/live-orders');
      eventSourceRef.current = es;

      es.addEventListener('new_order', (e: MessageEvent) => {
        try {
          const newOrder: IOrder = JSON.parse(e.data);
          playOrderChime();
          setLatestOrder(newOrder);

          // Dispatch globally in browser for Admin pages to catch
          window.dispatchEvent(
            new CustomEvent('new_order_received', { detail: newOrder })
          );
        } catch (err) {
          console.warn('[SSE] Parse new order failed:', err);
        }
      });
    } catch (err) {
      console.warn('[SSE] Connection error:', err);
    }

    return () => {
      if (es) {
        es.close();
      }
    };
  }, []);

  return (
    <>
      {/* Floating Instant Notification Toast */}
      {latestOrder && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-phone-surface-elevated/95 border-2 border-phone-emerald text-phone-frost p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="w-10 h-10 rounded-xl bg-phone-emerald/20 border border-phone-emerald/40 flex items-center justify-center shrink-0 text-phone-emerald">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-phone-emerald flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-phone-emerald" />
                  Nouvelle Commande 0ms
                </span>
                <span className="text-[10px] font-mono text-phone-dim">
                  {latestOrder.orderNumber}
                </span>
              </div>

              <div className="font-bold text-xs text-phone-frost truncate">
                {latestOrder.customer.fullName} • {latestOrder.customer.wilayaName}
              </div>

              <div className="text-[11px] font-mono text-phone-emerald font-bold">
                {latestOrder.totalAmount.toLocaleString('fr-DZ')} DZD (COD)
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLatestOrder(null)}
              className="p-1 rounded-lg text-phone-dim hover:text-phone-frost cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-phone-border flex items-center justify-between">
            <span className="text-[10px] text-phone-dim">
              {latestOrder.items.length} article{latestOrder.items.length > 1 ? 's' : ''}
            </span>

            <Link
              href={`/admin/commandes?num=${latestOrder.orderNumber}`}
              onClick={() => setLatestOrder(null)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-phone-cyan hover:underline cursor-pointer"
            >
              <span>Traiter la commande</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
