'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

export default function Navbar() {
  const totalQty = useSelector((s) => s.cart.totalQty);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors ${
        solid ? 'bg-black/40 backdrop-blur border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full animated-gradient-bg" />
          <span className="text-lg font-semibold tracking-tight">Elux</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/products" className="hover:opacity-80">Products</Link>
          <Link href="/about" className="hover:opacity-80">About</Link>
          <Link href="/contact" className="hover:opacity-80">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open ? 'true' : 'false'}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-white/10 hover:bg-white/5 active:scale-95 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/cart" className="relative">
            <img
              src="/elux-cart.svg"
              alt="Cart"
              className="h-6 w-6 select-none drop-shadow-sm transition-transform hover:scale-[1.06]"
            />
            {totalQty > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-black text-white text-[10px] grid place-items-center px-1">
                {totalQty}
              </span>
            )}
          </Link>
        </div>
      </nav>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="md:hidden absolute top-full left-0 right-0 border-t border-white/10 bg-black/80 backdrop-blur"
        >
          <div className="mx-auto max-w-7xl px-6 py-3 flex flex-col gap-2 text-sm">
            <Link href="/products" className="py-2 hover:opacity-80" onClick={() => setOpen(false)}>Products</Link>
            <Link href="/about" className="py-2 hover:opacity-80" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" className="py-2 hover:opacity-80" onClick={() => setOpen(false)}>Contact</Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
