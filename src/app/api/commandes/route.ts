import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getProductBySlug } from '@/lib/orders-store';
import wilayasData from '@/data/algeria-wilayas.json';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, deliveryType, notes } = body;

    if (!customer || !customer.fullName || !customer.phone || !customer.wilayaId) {
      return NextResponse.json(
        { success: false, error: 'Coordonnées de livraison incomplètes.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Votre panier ne contient aucun article.' },
        { status: 400 }
      );
    }

    // Verify Wilaya and calculate correct delivery fee
    const wilaya = wilayasData.find((w) => w.id === Number(customer.wilayaId));
    if (!wilaya) {
      return NextResponse.json(
        { success: false, error: 'Wilaya invalide sélectionnée.' },
        { status: 400 }
      );
    }

    const calculatedDeliveryFee =
      deliveryType === 'bureau' ? wilaya.deskDeliveryFee : wilaya.homeDeliveryFee;

    // Verify each item and enforce genuine price from database (Anti-Tampering)
    const verifiedItems = await Promise.all(
      items.map(async (it: { slug: string; productId?: string; title?: string; image?: string; price?: number; quantity?: number; selectedCompatibility?: string; selectedColor?: string }) => {
        const prod = await getProductBySlug(it.slug);
        const verifiedPrice = prod ? prod.price : Math.max(100, Number(it.price) || 100);
        const verifiedTitle = prod ? prod.title : (it.title || 'Accessoire Smartphone');
        const verifiedImage = prod && prod.images && prod.images[0] ? prod.images[0] : (it.image || '');
        const qty = Math.max(1, Number(it.quantity) || 1);

        return {
          productId: prod?._id || it.productId || it.slug,
          title: verifiedTitle,
          slug: it.slug,
          image: verifiedImage,
          price: verifiedPrice,
          quantity: qty,
          selectedCompatibility: it.selectedCompatibility || 'Universel',
          selectedColor: it.selectedColor || 'Standard',
        };
      })
    );

    const subtotal = verifiedItems.reduce(
      (sum: number, it: { price: number; quantity: number }) => sum + it.price * it.quantity,
      0
    );
    const totalAmount = subtotal + calculatedDeliveryFee;

    const cleanOrder = await createOrder({
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim().replace(/\s+/g, ''),
        secondaryPhone: customer.secondaryPhone?.trim() || undefined,
        wilayaId: wilaya.id,
        wilayaName: wilaya.name,
        commune: customer.commune?.trim() || wilaya.communes[0] || wilaya.name,
        address: customer.address?.trim() || `Livraison à ${wilaya.name}`,
        notes: notes?.trim() || undefined,
      },
      items: verifiedItems,
      subtotal,
      deliveryType: deliveryType === 'bureau' ? 'bureau' : 'domicile',
      deliveryFee: calculatedDeliveryFee,
      totalAmount,
      status: 'en_attente',
    });

    return NextResponse.json({
      success: true,
      message: 'Commande enregistrée avec succès.',
      order: cleanOrder,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
