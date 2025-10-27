'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { clearCart } from '@/redux/slices/cartSlice';
import Lottie from 'lottie-react';

export default function CheckoutPage() {
  const { items, totalAmount } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const [step, setStep] = useState(1); // 1=Address, 2=Payment, 3=Confirm
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    line1: '',
    city: '',
  });
  const [payment, setPayment] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const validAddress = address.fullName && address.phone && address.line1 && address.city;
  const validPayment = payment.cardName && payment.cardNumber && payment.expiry && payment.cvc;

  const successAnim = useMemo(() => ({
    v: '5.7.4',
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: 'check',
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: 'circle',
        sr: 1,
        ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [100, 100, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [0, 0, 100] } },
        shapes: [
          { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [180, 180] }, nm: 'Ellipse Path 1' },
          { ty: 'st', c: { a: 0, k: [0.067, 0.62, 0.404, 1] }, o: { a: 0, k: 100 }, w: 10, lc: 2, lj: 2, nm: 'Stroke 1' },
          { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 1, k: [0, 0], ix: 6 }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
        ],
        ef: [],
        ao: 0,
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: 'check',
        sr: 1,
        ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [100, 100, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } },
        shapes: [
          { ty: 'sh', ks: { a: 0, k: { i: [], o: [], v: [[-35, 0], [-5, 30], [40, -25]], c: false } }, nm: 'Path 1' },
          { ty: 'st', c: { a: 0, k: [0.067, 0.62, 0.404, 1] }, o: { a: 0, k: 100 }, w: 12, lc: 2, lj: 2, nm: 'Stroke 1' },
        ],
        ao: 0,
      },
    ],
    markers: [],
  }), []);

  useEffect(() => {
    if (success) dispatch(clearCart());
  }, [success, dispatch]);

  const placeOrder = async () => {
    if (!validAddress || !validPayment || items.length === 0) return;
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setStep(4);
    }, 1200);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 pt-28 pb-16">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      <p className="text-zinc-600">Secure and fast. Complete your order in three steps.</p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ol className="flex items-center gap-4 text-sm">
            <li className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-black text-white' : 'bg-zinc-100'}`}>1. Address</li>
            <li className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-black text-white' : 'bg-zinc-100'}`}>2. Payment</li>
            <li className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-black text-white' : 'bg-zinc-100'}`}>3. Confirm</li>
          </ol>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="address" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border p-6 grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-zinc-600">Full name</label>
                      <input className="mt-1 w-full rounded-lg border px-3 py-2" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm text-zinc-600">Phone</label>
                      <input className="mt-1 w-full rounded-lg border px-3 py-2" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-600">Address line</label>
                    <input className="mt-1 w-full rounded-lg border px-3 py-2" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm text-zinc-600">City</label>
                      <input className="mt-1 w-full rounded-lg border px-3 py-2" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button disabled={!validAddress} onClick={() => setStep(2)} className={`rounded-full px-6 py-3 text-sm ${validAddress ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-500 cursor-not-allowed'}`}>Continue to payment</button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="payment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border p-6 grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-zinc-600">Name on card</label>
                      <input className="mt-1 w-full rounded-lg border px-3 py-2" value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm text-zinc-600">Card number</label>
                      <input className="mt-1 w-full rounded-lg border px-3 py-2" value={payment.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-zinc-600">Expiry</label>
                      <input placeholder="MM/YY" className="mt-1 w-full rounded-lg border px-3 py-2" value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm text-zinc-600">CVC</label>
                      <input className="mt-1 w-full rounded-lg border px-3 py-2" value={payment.cvc} onChange={(e) => setPayment({ ...payment, cvc: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button onClick={() => setStep(1)} className="rounded-full border px-6 py-3 text-sm">Back</button>
                    <button disabled={!validPayment} onClick={() => setStep(3)} className={`rounded-full px-6 py-3 text-sm ${validPayment ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-500 cursor-not-allowed'}`}>Review order</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="confirm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border p-6">
                  <h3 className="text-lg font-medium">Order summary</h3>
                  <div className="mt-4 space-y-3">
                    {items.map((i) => (
                      <div key={i.id} className="flex items-center justify-between text-sm">
                        <span className="text-zinc-600">{i.name} × {i.qty}</span>
                        <span className="font-medium">Rs {(i.price * i.qty).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="mt-2 flex items-center justify-between border-t pt-3">
                      <span className="text-zinc-600">Total</span>
                      <span className="text-lg font-semibold">Rs {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button onClick={() => setStep(2)} className="rounded-full border px-6 py-3 text-sm">Back</button>
                    <button disabled={submitting} onClick={placeOrder} className="rounded-full bg-black text-white px-6 py-3 text-sm">
                      {submitting ? 'Placing order...' : 'Place order'}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && success && (
                <motion.div key="success" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-10 text-center">
                  <div className="mx-auto h-32 w-32">
                    <Lottie animationData={successAnim} loop={false} autoplay />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">Order placed successfully!</h3>
                  <p className="text-zinc-600">You will receive a confirmation SMS shortly.</p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Link href="/products" className="rounded-full bg-black text-white px-6 py-3 text-sm">Continue shopping</Link>
                    <Link href="/" className="rounded-full border px-6 py-3 text-sm">Go to Home</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <aside>
          <div className="sticky top-28 rounded-2xl border p-6">
            <h3 className="font-medium">Items</h3>
            <div className="mt-3 space-y-3 max-h-[320px] overflow-auto pr-2">
              {items.length === 0 && <div className="text-sm text-zinc-500">No items in cart.</div>}
              {items.map((i) => (
                <div key={i.id} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">{i.name}</span>
                  <span className="font-medium">{i.qty} × Rs {i.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-zinc-600">Subtotal</span>
              <span className="font-semibold">Rs {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
