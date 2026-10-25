import { NextRequest, NextResponse } from 'next/server';
import { listAllOrders, updateOrderStatus } from '@/lib/orders-store';
import { verifyToken } from '@/lib/auth';
import { recordAuditLog, maskIp } from '@/lib/audit';

function checkAuth(req: NextRequest): boolean {
  const token = req.cookies.get('abdou_admin_token')?.value;
  if (!token) {
    if (process.env.NODE_ENV !== 'production') return true;
    return false;
  }
  return verifyToken(token) !== null;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const orders = await listAllOrders(200);
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { orderNumber, status, adminNotes } = await req.json();

    if (!orderNumber || !status) {
      return NextResponse.json(
        { success: false, error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(orderNumber, status, adminNotes);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Commande introuvable' },
        { status: 404 }
      );
    }

    const token = req.cookies.get('abdou_admin_token')?.value;
    const admin = token ? verifyToken(token) : null;
    const clientIp = maskIp(req.headers.get('x-forwarded-for') || '127.0.0.1');

    await recordAuditLog({
      action: 'order_status_update',
      adminEmail: admin?.email || 'admin@abdouphone.dz',
      targetType: 'order',
      targetId: orderNumber,
      details: `Mise à jour statut commande ${orderNumber} vers: ${status}`,
      ipMasked: clientIp,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
