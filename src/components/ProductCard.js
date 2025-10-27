'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import gsap from 'gsap';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
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
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="group rounded-2xl border border-white/10 p-4 hover:shadow-xl hover:-translate-y-1 transition-all bg-white/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/5">
        <img ref={imgRef} src={product.image} alt={product.name} className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium leading-tight">{product.name}</h3>
          <p className="text-sm text-zinc-500">{product.category}</p>
        </div>
        <div className="text-right">
          <div className="font-semibold">Rs {product.price.toLocaleString()}</div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={onAdd} className="rounded-full bg-black text-white px-4 py-2 text-sm">Add to Cart</button>
        <a href={`/products/${product.id}`} className="rounded-full border px-4 py-2 text-sm hover:bg-black/5">View</a>
      </div>
    </motion.div>
  );
}
