import { NextRequest, NextResponse } from 'next/server';
import { listAllProducts } from '@/lib/orders-store';

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
