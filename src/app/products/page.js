'use client';

import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, setCategory } from '@/redux/slices/productSlice';
import products from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { query, category } = useSelector((s) => s.products);

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200000);

  const categories = useMemo(() => {
    const set = new Set(['All']);
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const inCat = category === 'All' || p.category === category;
      const inQuery = !query || p.name.toLowerCase().includes(query.toLowerCase());
      const inPrice = p.price >= priceMin && p.price <= priceMax;
      return inCat && inQuery && inPrice;
    });
  }, [query, category, priceMin, priceMax]);

  return (
    <main className="mx-auto max-w-7xl px-6 pt-28 pb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="text-zinc-600">Explore our premium lineup</p>
        </div>
        <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            placeholder="Search products..."
            className="w-full sm:w-64 rounded-full border px-4 py-2"
          />
          <select
            value={category}
            onChange={(e) => dispatch(setCategory(e.target.value))}
            className="w-full sm:w-56 rounded-full border px-4 py-2"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="col-span-2 sm:col-span-3 lg:col-span-4 rounded-2xl border p-4 flex flex-wrap items-center gap-4">
          <div className="text-sm text-zinc-600">Price</div>
          <div className="flex items-center gap-2">
            <input type="number" min={0} value={priceMin} onChange={(e) => setPriceMin(Number(e.target.value) || 0)} className="w-28 rounded-lg border px-3 py-2 text-sm" />
            <span className="text-zinc-400">—</span>
            <input type="number" min={0} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value) || 0)} className="w-28 rounded-lg border px-3 py-2 text-sm" />
          </div>
          <button onClick={() => { setPriceMin(0); setPriceMax(200000); }} className="ml-auto rounded-full border px-4 py-2 text-sm">Reset</button>
        </div>
      </div>

      <motion.div layout className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-zinc-600">No products match your filters.</div>
        )}
      </motion.div>
    </main>
  );
}
