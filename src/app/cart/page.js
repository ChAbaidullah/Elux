'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { incrementQty, decrementQty, removeFromCart, clearCart } from '@/redux/slices/cartSlice';

export default function CartPage() {
  const { items, totalQty, totalAmount } = useSelector((s) => s.cart);
  const dispatch = useDispatch();

  return (
    <main className="mx-auto max-w-7xl px-6 pt-28 pb-16">
      <h1 className="text-3xl font-semibold tracking-tight">Your Cart</h1>
      <p className="text-zinc-600">Review items and proceed to checkout</p>

      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border p-10 text-center">
          <p className="text-zinc-600">Your cart is empty.</p>
          <Link href="/products" className="mt-6 inline-block rounded-full bg-black text-white px-6 py-3 text-sm">Browse Products</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-4 py-5 border-b"
                >
                  <div className="h-24 w-24 rounded-xl bg-zinc-50 grid place-items-center overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium leading-tight">{item.name}</div>
                    <div className="text-sm text-zinc-500">Rs {item.price.toLocaleString()}</div>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => dispatch(decrementQty(item.id))} className="h-8 w-8 rounded-full border grid place-items-center">-</button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button onClick={() => dispatch(incrementQty(item.id))} className="h-8 w-8 rounded-full border grid place-items-center">+</button>
                      <button onClick={() => dispatch(removeFromCart(item.id))} className="ml-4 text-sm text-red-600 hover:underline">Remove</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div>
            <div className="sticky top-28 rounded-2xl border p-6">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Items</span>
                <span className="font-medium">{totalQty}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-semibold">Rs {totalAmount.toLocaleString()}</span>
              </div>
              <div className="mt-6 grid gap-3">
                <Link href="/checkout" className="rounded-full bg-black text-white px-6 py-3 text-center text-sm">Proceed to Checkout</Link>
                <button onClick={() => dispatch(clearCart())} className="rounded-full border px-6 py-3 text-sm">Clear cart</button>
              </div>
              <p className="mt-3 text-xs text-zinc-500">Taxes and shipping calculated at checkout.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
