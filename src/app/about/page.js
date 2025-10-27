'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 animated-gradient-bg opacity-20" />
        <div className="mx-auto max-w-5xl px-6">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-4xl md:text-5xl font-semibold tracking-tight"
          >
            About Elux
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-4 max-w-2xl text-zinc-600"
          >
            We craft luxury-grade home appliances that blend cutting-edge engineering with timeless design. Our mission is to elevate everyday living through performance, efficiency, and aesthetics.
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Innovation', desc: 'R&D driven features, inverter tech, and smart connectivity.' },
            { title: 'Design', desc: 'Minimal, modern, and built with premium materials.' },
            { title: 'Sustainability', desc: 'Energy-efficient products for a lower carbon footprint.' },
          ].map((b, i) => (
            <motion.div
              key={b.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-2xl border border-white/10 p-6 bg-white/5"
            >
              <div className="h-10 w-10 rounded-full animated-gradient-bg" />
              <h3 className="mt-4 text-lg font-medium">{b.title}</h3>
              <p className="mt-1 text-sm text-zinc-600">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-2xl border border-white/10 p-8 bg-white/5"
          >
            <h3 className="text-xl font-semibold">Our Promise</h3>
            <p className="mt-3 text-zinc-600">
              Every Elux product is backed by rigorous testing, a comprehensive warranty, and a customer-first support ethos.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl border border-white/10 p-4 bg-white/5">
                <div className="font-medium">Quality Assurance</div>
                <p className="text-zinc-600">Multi-stage QA and certification</p>
              </div>
              <div className="rounded-xl border border-white/10 p-4 bg-white/5">
                <div className="font-medium">Trusted Service</div>
                <p className="text-zinc-600">Nationwide service network</p>
              </div>
              <div className="rounded-xl border border-white/10 p-4 bg-white/5">
                <div className="font-medium">Satisfaction</div>
                <p className="text-zinc-600">30-day return policy</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
