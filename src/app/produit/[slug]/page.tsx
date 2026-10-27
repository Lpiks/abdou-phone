import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/orders-store';
import ProductDetailClient from '@/components/store/ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient initialProduct={product} />;
}
