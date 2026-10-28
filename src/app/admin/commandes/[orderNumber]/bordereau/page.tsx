import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getOrderByNumber } from '@/lib/orders-store';
import BordereauActions from '@/components/admin/BordereauActions';
import BordereauSlip from '@/components/admin/BordereauSlip';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { orderNumber: string };
}

export default async function BordereauPage({ params }: PageProps) {
  const order = await getOrderByNumber(params.orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-4 sm:p-8 print:p-0 print:bg-white print:text-black">
      {/* Top action bar (hidden on print) */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/admin/commandes"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux commandes</span>
        </Link>

        <BordereauActions
          orderNumber={order.orderNumber}
          customerName={order.customer.fullName}
          customerPhone={order.customer.phone}
          wilayaName={order.customer.wilayaName}
          totalAmount={order.totalAmount}
        />
      </div>

      {/* The Printable Slip Sheet */}
      <div className="max-w-3xl mx-auto print:max-w-none print:w-full">
        <BordereauSlip order={order} />
      </div>
    </div>
  );
}
