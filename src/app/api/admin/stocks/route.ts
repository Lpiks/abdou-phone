import { NextRequest, NextResponse } from 'next/server';
import { listAllProducts, updateProductVariantStock } from '@/lib/orders-store';
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
    const products = await listAllProducts();
    return NextResponse.json({ success: true, count: products.length, products });
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
    const { slug, variantIndex, stock } = await req.json();

    if (!slug || variantIndex === undefined || stock === undefined) {
      return NextResponse.json({ success: false, error: 'Paramètres manquants' }, { status: 400 });
    }

    const updated = await updateProductVariantStock(slug, Number(variantIndex), Number(stock));
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Produit ou variante introuvable' }, { status: 404 });
    }

    const token = req.cookies.get('abdou_admin_token')?.value;
    const admin = token ? verifyToken(token) : null;
    const clientIp = maskIp(req.headers.get('x-forwarded-for') || '127.0.0.1');

    await recordAuditLog({
      action: 'product_stock_update',
      adminEmail: admin?.email || 'admin@abdouphone.dz',
      targetType: 'product',
      targetId: slug,
      details: `Ajustement stock de la variante #${variantIndex} du produit ${slug} vers ${stock} unités.`,
      ipMasked: clientIp,
    });

    return NextResponse.json({ success: true, message: 'Stock mis à jour avec succès', stock });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
