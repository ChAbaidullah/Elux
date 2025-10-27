import { notFound } from 'next/navigation';
import products from '@/data/products';
import ProductDetailClient from '@/components/ProductDetailClient';

export default async function ProductDetail({ params }) {
  const { id } = await params;
  const numericId = Number(id);
  const product = products.find((p) => p.id === numericId);
  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
}
