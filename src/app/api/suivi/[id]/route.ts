import { NextRequest, NextResponse } from 'next/server';
import { getSafeTrackingOrderByNumberOrPhone } from '@/lib/orders-store';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trackingQuery = decodeURIComponent(params.id).trim();
    if (!trackingQuery) {
      return NextResponse.json(
        { success: false, error: 'Numéro de suivi ou téléphone manquant.' },
        { status: 400 }
      );
    }

    const trackingData = await getSafeTrackingOrderByNumberOrPhone(trackingQuery);
    if (!trackingData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Aucune commande trouvée pour cette référence ou ce numéro de téléphone.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, tracking: trackingData });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
