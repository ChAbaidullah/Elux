import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';

export default async function ProductDetail({ params }) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) return notFound();
  const product = await res.json();

  return <ProductDetailClient product={product} />;
}
