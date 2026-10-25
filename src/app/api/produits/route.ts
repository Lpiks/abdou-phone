import { NextRequest, NextResponse } from 'next/server';
import { listAllProducts, createProduct } from '@/lib/orders-store';
import { recordAuditLog, maskIp } from '@/lib/audit';
import { verifyToken } from '@/lib/auth';

function checkAuth(req: NextRequest): boolean {
  const token = req.cookies.get('abdou_admin_token')?.value;
  if (!token) {
    if (process.env.NODE_ENV !== 'production') return true;
    return false;
  }
  return verifyToken(token) !== null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('q')?.toLowerCase().trim();

    let products = await listAllProducts(category);

    if (search) {
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.brand.toLowerCase().includes(search) ||
          p.variants.some((v) => v.compatibility.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      category,
      price,
      compareAtPrice,
      costPrice,
      images,
      brand,
      wattage,
      connector,
      warranty,
      features,
      badges,
      variants,
      isFeatured,
      isActive,
      tags,
    } = body;

    if (!title || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Le titre, le prix et la catégorie sont obligatoires.' },
        { status: 400 }
      );
    }

    const defaultImage =
      Array.isArray(images) && images.length > 0 && images[0].trim() !== ''
        ? images
        : ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'];

    const formattedVariants =
      Array.isArray(variants) && variants.length > 0
        ? variants
        : [
            {
              compatibility: 'Universel Smartphone',
              color: 'Noir Mat',
              colorHex: '#111111',
              stock: 20,
              sku: 'PROD-001',
            },
          ];

    const newProduct = await createProduct({
      title: title.trim(),
      slug: '',
      description: description?.trim() || 'Accessoire smartphone haute performance certifié par Abdou Phone.',
      category,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      costPrice: costPrice ? Number(costPrice) : undefined,
      images: defaultImage,
      brand: brand?.trim() || 'Abdou Phone Original',
      wattage: wattage?.trim() || undefined,
      connector: connector?.trim() || undefined,
      warranty: warranty?.trim() || 'Garantie 6 Mois Échange Express',
      features: Array.isArray(features) ? features : [],
      badges: Array.isArray(badges) ? badges : ['Nouveau'],
      variants: formattedVariants,
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      tags: Array.isArray(tags) ? tags : [category],
    });

    const token = req.cookies.get('abdou_admin_token')?.value;
    const admin = token ? verifyToken(token) : null;
    const clientIp = maskIp(req.headers.get('x-forwarded-for') || '127.0.0.1');

    await recordAuditLog({
      action: 'product_create',
      adminEmail: admin?.email || 'admin@abdouphone.dz',
      targetType: 'product',
      targetId: newProduct.slug,
      details: `Création du nouveau produit "${newProduct.title}" (Prix: ${newProduct.price} DZD, Catégorie: ${newProduct.category}).`,
      ipMasked: clientIp,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
