'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import TechModel from './TechModel';

export default function Hero() {
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      .fromTo(subRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .fromTo(ctaRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3');
  }, []);

  return (
    <section className="relative overflow-hidden pt-24">
      <div className="absolute inset-0 -z-10 animated-gradient-bg opacity-30" />

      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="py-10">
          <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Premium Home Appliances for Modern Living
          </h1>
          <p ref={subRef} className="mt-4 text-zinc-600 max-w-prose">
            Discover luxury-grade air conditioners, refrigerators, and washers engineered for performance, efficiency, and style.
          </p>
          <div ref={ctaRef} className="mt-8 flex gap-4">
            <motion.a
              href="/products"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-black text-white px-6 py-3 text-sm"
            >
              Shop Products
            </motion.a>
            <motion.a
              href="#featured"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border px-6 py-3 text-sm"
            >
              Explore Featured
            </motion.a>
          </div>
        </div>
        <div className="relative h-[380px] md:h-[520px]">
          <TechModel />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}
