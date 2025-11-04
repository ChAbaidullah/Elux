import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import ProductDetailClient from '@/components/ProductDetailClient';

export default async function ProductDetail({ params }) {
  const { id } = await params;
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const protocol = h.get('x-forwarded-proto') || 'http';
  const base = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${protocol}://${host}` : 'http://localhost:3000');
  const url = `${base}/api/products/${id}`;
  const res = await fetch(url, {
    cache: 'no-store',
  });
  if (!res.ok) return notFound();
  const product = await res.json();

  return <ProductDetailClient product={product} />;
}
