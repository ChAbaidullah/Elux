'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid = form.name && /.+@.+\..+/.test(form.email) && form.message.length > 5;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    }, 800);
  };

  return (
    <main className="mx-auto max-w-4xl px-6 pt-28 pb-16">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold tracking-tight">
        Contact Us
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-2 text-zinc-600">
        We typically respond within 1–2 business days.
      </motion.p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={submit} className="md:col-span-2 rounded-2xl border border-white/10 p-6 grid gap-4 bg-white/5">
          <div>
            <label className="text-sm text-zinc-600">Name</label>
            <input className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-zinc-600">Email</label>
            <input className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {!/.+@.+\..+/.test(form.email) && form.email && (
              <div className="mt-1 text-xs text-red-600">Enter a valid email.</div>
            )}
          </div>
          <div>
            <label className="text-sm text-zinc-600">Message</label>
            <textarea rows={6} className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            {form.message && form.message.length <= 5 && (
              <div className="mt-1 text-xs text-red-600">Please provide more details.</div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button disabled={!valid || loading} className={`rounded-full px-6 py-3 text-sm ${valid && !loading ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-500 cursor-not-allowed'}`}>
              {loading ? 'Sending…' : 'Send message'}
            </button>
            <AnimatePresence>
              {sent && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-green-600">
                  Message sent! We'll get back to you soon.
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </form>

        <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
          <h3 className="font-medium">Support</h3>
          <p className="mt-2 text-sm text-zinc-600">Hotline: 0800-ELUX</p>
          <p className="text-sm text-zinc-600">Email: support@elux.example</p>
          <div className="mt-6">
            <h4 className="text-sm font-medium">Head Office</h4>
            <p className="text-sm text-zinc-600">123 Elux Blvd, Karachi, Pakistan</p>
          </div>
        </div>
      </div>
    </main>
  );
}
