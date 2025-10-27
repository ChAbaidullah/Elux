'use client';

import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

export default function ProductDetailClient({ product }) {
  const dispatch = useDispatch();
  const [tab, setTab] = useState('Description');
  const imgRef = useRef(null);

  const flyToCart = () => {
    const img = imgRef.current;
    const cart = document.querySelector('header a[href="/cart"]');
    if (!img || !cart) return;
    const imgRect = img.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();
    const clone = img.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = imgRect.left + 'px';
    clone.style.top = imgRect.top + 'px';
    clone.style.width = imgRect.width + 'px';
    clone.style.height = imgRect.height + 'px';
    clone.style.zIndex = 70;
    document.body.appendChild(clone);
    gsap.to(clone, {
      duration: 0.8,
      ease: 'power2.inOut',
      x: cartRect.left - imgRect.left,
      y: cartRect.top - imgRect.top,
      scale: 0.2,
      opacity: 0.6,
      onComplete: () => clone.remove(),
    });
  };

  const onAdd = () => {
    dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }));
    flyToCart();
  };

  return (
    <main className="mx-auto max-w-7xl px-6 pt-28 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="relative aspect-[4/3] rounded-2xl bg-zinc-50 overflow-hidden">
            <img ref={imgRef} src={product.image} alt={product.name} className="h-full w-full object-contain p-6" />
          </div>
          <div className="mt-4 flex gap-2">
            <button className="h-14 w-20 rounded-xl border bg-white">
              <img src={product.image} alt="thumb" className="h-full w-full object-contain p-2" />
            </button>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">{product.name}</h1>
          <p className="mt-2 text-zinc-600">{product.category}</p>
          <div className="mt-4 text-2xl font-semibold">Rs {product.price.toLocaleString()}</div>
          <div className="mt-6 flex gap-3">
            <button onClick={onAdd} className="rounded-full bg-black text-white px-6 py-3 text-sm">Add to Cart</button>
            <button className="rounded-full border px-6 py-3 text-sm">Add to Wishlist</button>
          </div>

          <div className="mt-10">
            <div className="flex gap-3 text-sm">
              {['Description', 'Specs', 'Reviews'].map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 border ${tab === t ? 'bg-black text-white' : ''}`}>{t}</button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border p-6 min-h-40">
              <AnimatePresence mode="wait">
                {tab === 'Description' && (
                  <motion.div key="desc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <p className="text-zinc-700">{product.description}</p>
                    <ul className="mt-4 list-disc pl-5 text-sm text-zinc-600">
                      <li>Energy efficient inverter technology</li>
                      <li>Premium build quality and modern design</li>
                      <li>1-year warranty</li>
                    </ul>
                  </motion.div>
                )}
                {tab === 'Specs' && (
                  <motion.div key="specs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-zinc-600">Brand</div><div>Elux</div>
                    <div className="text-zinc-600">Model</div><div>2025 Edition</div>
                    <div className="text-zinc-600">Category</div><div>{product.category}</div>
                    <div className="text-zinc-600">Warranty</div><div>12 Months</div>
                  </motion.div>
                )}
                {tab === 'Reviews' && (
                  <motion.div key="reviews" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                    <div className="rounded-xl border p-4">
                      <div className="font-medium">Ayesha</div>
                      <p className="text-sm text-zinc-600">Excellent quality and fast cooling. Totally recommended.</p>
                    </div>
                    <div className="rounded-xl border p-4">
                      <div className="font-medium">Hassan</div>
                      <p className="text-sm text-zinc-600">Stylish and efficient. Great value for money.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
