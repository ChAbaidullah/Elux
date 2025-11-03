"use client";

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function Featured() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/products?featured=1', { cache: 'no-store' });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (mounted) setItems(data);
      } catch (e) {
        if (mounted) setError('Failed to load featured products');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="featured" className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Featured Products</h2>
            <p className="text-zinc-600">Curated picks from our latest lineup</p>
          </div>
          <a href="/products" className="text-sm underline hover:opacity-80">View all</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading && <div className="col-span-full text-center text-zinc-600">Loading...</div>}
          {error && <div className="col-span-full text-center text-red-600 text-sm">{error}</div>}
          {!loading && !error && items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {!loading && !error && items.length === 0 && (
            <div className="col-span-full text-center text-zinc-600 text-sm">No featured products yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
