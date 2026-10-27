import { listAllProducts, listAllCategories } from '@/lib/orders-store';
import BoutiqueClient from '@/components/store/BoutiqueClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams?: Promise<{ cat?: string; q?: string; compat?: string }> | { cat?: string; q?: string; compat?: string };
}

export default async function BoutiquePage({ searchParams }: PageProps) {
  const [products, categories] = await Promise.all([
    listAllProducts(),
    listAllCategories(),
  ]);

  const resolvedParams = searchParams ? await searchParams : {};

  return (
    <BoutiqueClient
      initialProducts={products}
      initialCategories={categories}
      initialCategory={resolvedParams?.cat || 'all'}
      initialSearch={resolvedParams?.q || ''}
      initialCompat={resolvedParams?.compat || 'all'}
    />
  );
}
