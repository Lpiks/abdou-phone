import { NextRequest, NextResponse } from 'next/server';
import { IPromoCode } from '@/types';
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

declare global {
  // eslint-disable-next-line no-var
  var memoryPromos: IPromoCode[] | undefined;
}

const INITIAL_PROMOS: IPromoCode[] = [
  {
    _id: 'promo_1',
    code: 'ABDOU10',
    type: 'percentage',
    value: 10,
    minOrderAmount: 3000,
    maxUsage: 100,
    usedCount: 24,
    isActive: true,
    expiresAt: '2026-12-31',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'promo_2',
    code: 'RAMADAN2026',
    type: 'fixed',
    value: 500,
    minOrderAmount: 5000,
    maxUsage: 50,
    usedCount: 18,
    isActive: true,
    expiresAt: '2026-04-15',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'promo_3',
    code: 'GAMING20',
    type: 'percentage',
    value: 20,
    minOrderAmount: 8000,
    maxUsage: 30,
    usedCount: 30,
    isActive: false,
    expiresAt: '2026-01-01',
    createdAt: new Date().toISOString(),
  },
];

let inMemoryPromos: IPromoCode[] = global.memoryPromos || [...INITIAL_PROMOS];
if (!global.memoryPromos) global.memoryPromos = inMemoryPromos;

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  return NextResponse.json({ success: true, promos: inMemoryPromos });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { code, type, value, minOrderAmount, maxUsage, expiresAt } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Informations de coupon incomplètes' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    if (inMemoryPromos.some((p) => p.code === cleanCode)) {
      return NextResponse.json(
        { success: false, error: 'Ce code promotionnel existe déjà' },
        { status: 400 }
      );
    }

    const newPromo: IPromoCode = {
      _id: `promo_${Date.now()}`,
      code: cleanCode,
      type: type === 'fixed' ? 'fixed' : 'percentage',
      value: Number(value),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      maxUsage: maxUsage ? Number(maxUsage) : undefined,
      usedCount: 0,
      isActive: true,
      expiresAt: expiresAt || '2026-12-31',
      createdAt: new Date().toISOString(),
    };

    inMemoryPromos.unshift(newPromo);

    const token = req.cookies.get('abdou_admin_token')?.value;
    const admin = token ? verifyToken(token) : null;
    const clientIp = maskIp(req.headers.get('x-forwarded-for') || '127.0.0.1');

    await recordAuditLog({
      action: 'promo_create',
      adminEmail: admin?.email || 'admin@abdouphone.dz',
      targetType: 'promo',
      targetId: cleanCode,
      details: `Création du code promo ${cleanCode} (${newPromo.value}${newPromo.type === 'percentage' ? '%' : ' DZD'}).`,
      ipMasked: clientIp,
    });

    return NextResponse.json({ success: true, promo: newPromo });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 });
    }

    inMemoryPromos = inMemoryPromos.filter((p) => p._id !== id);
    global.memoryPromos = inMemoryPromos;

    return NextResponse.json({ success: true, message: 'Code promo supprimé' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
