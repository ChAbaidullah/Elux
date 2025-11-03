"use client";

import { useEffect, useMemo, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: 0,
    categoryId: "",
    imagesCsv: "", // comma-separated URLs for MVP; Cloudinary integration next
    featured: false,
  });

  const canSave = useMemo(() => {
    return (
      form.title.trim().length > 0 &&
      String(form.price).trim().length > 0 &&
      Number.isFinite(Number(form.price)) &&
      form.categoryId
    );
  }, [form]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/admin/products", { cache: "no-store" }),
        fetch("/api/admin/categories", { cache: "no-store" }),
      ]);
      if (!prodRes.ok) throw new Error(await prodRes.text());
      if (!catRes.ok) throw new Error(await catRes.text());
      const [prod, cats] = await Promise.all([prodRes.json(), catRes.json()]);
      setProducts(prod);
      setCategories(cats);
      if (!form.categoryId && cats.length > 0) {
        setForm((v) => ({ ...v, categoryId: cats[0].id }));
      }
    } catch (e) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setError("");
    try {
      const images = (form.imagesCsv || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((url) => ({ url }));
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          price: Number(form.price),
          stock: Number.isInteger(form.stock)
            ? form.stock
            : parseInt(String(form.stock || 0), 10),
          categoryId: form.categoryId,
          images,
          featured: !!form.featured,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setForm({ title: "", description: "", price: "", stock: 0, categoryId: categories[0]?.id || "", imagesCsv: "", featured: false });
      await load();
    } catch (e) {
      setError("Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-gray-600">Create and view products.</p>
        </div>

        {/* Create form */}
        <form onSubmit={onCreate} className="border rounded p-4 grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={form.title} onChange={(e)=>setForm(v=>({...v,title:e.target.value}))} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Price</label>
              <input className="w-full border rounded px-3 py-2 text-sm" type="number" step="0.01" value={form.price} onChange={(e)=>setForm(v=>({...v,price:e.target.value}))} required />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Stock</label>
              <input className="w-full border rounded px-3 py-2 text-sm" type="number" value={form.stock} onChange={(e)=>setForm(v=>({...v,stock:parseInt(e.target.value||"0",10)}))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Category</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.categoryId} onChange={(e)=>setForm(v=>({...v,categoryId:e.target.value}))}>
                {categories.map((c)=> (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2 text-sm" value={form.description} onChange={(e)=>setForm(v=>({...v,description:e.target.value}))} />
          </div>
          <div className="flex items-center gap-2">
            <input id="featured" type="checkbox" checked={form.featured} onChange={(e)=>setForm(v=>({...v, featured: e.target.checked}))} />
            <label htmlFor="featured" className="text-sm">Featured</label>
          </div>
          <div>
            <label className="block text-sm mb-1">Image URLs (comma-separated)</label>
            <input className="w-full border rounded px-3 py-2 text-sm" value={form.imagesCsv} onChange={(e)=>setForm(v=>({...v,imagesCsv:e.target.value}))} placeholder="https://.../image1.jpg, https://.../image2.jpg" />
          </div>
          <button disabled={saving || !canSave} className="self-start bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-60">{saving?"Creating...":"Create"}</button>
        </form>

        {/* List */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600 text-sm">{error}</div>
        ) : (
          <div className="border rounded overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-2">Title</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Images</th>
                  <th className="p-2">Featured</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p)=> (
                  <ProductRow key={p.id} p={p} onChanged={load} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductRow({ p, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState({
    title: p.title,
    price: p.price,
    stock: p.stock,
    description: p.description || '',
    categoryId: p.categoryId,
    featured: !!p.featured,
  });

  async function toggleFeatured(e) {
    const checked = e.target.checked;
    setLocal((v) => ({ ...v, featured: checked }));
    await fetch(`/api/admin/products/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: checked }),
    });
    onChanged();
  }

  async function onDelete() {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' });
    onChanged();
  }

  async function onSave(e) {
    e?.preventDefault?.();
    setSaving(true);
    try {
      await fetch(`/api/admin/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: local.title,
          price: Number(local.price),
          stock: Number.isInteger(local.stock) ? local.stock : parseInt(String(local.stock||0),10),
          description: local.description || null,
          categoryId: local.categoryId,
          featured: !!local.featured,
        }),
      });
      setEditing(false);
      onChanged();
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className="border-t align-top">
      <td className="p-2">
        {editing ? (
          <input className="w-full border rounded px-2 py-1" value={local.title} onChange={(e)=>setLocal(v=>({...v,title:e.target.value}))} />
        ) : (
          p.title
        )}
      </td>
      <td className="p-2">{p.category?.name || ''}</td>
      <td className="p-2">
        {editing ? (
          <input type="number" step="0.01" className="w-28 border rounded px-2 py-1" value={local.price} onChange={(e)=>setLocal(v=>({...v,price:e.target.value}))} />
        ) : (
          p.price
        )}
      </td>
      <td className="p-2">
        {editing ? (
          <input type="number" className="w-20 border rounded px-2 py-1" value={local.stock} onChange={(e)=>setLocal(v=>({...v,stock:parseInt(e.target.value||'0',10)}))} />
        ) : (
          p.stock
        )}
      </td>
      <td className="p-2">{(p.images||[]).length}</td>
      <td className="p-2">
        <input type="checkbox" checked={!!(p.featured || local.featured)} onChange={toggleFeatured} />
      </td>
      <td className="p-2 space-x-2">
        {!editing ? (
          <>
            <button className="px-2 py-1 border rounded text-xs" onClick={()=>setEditing(true)}>Edit</button>
            <button className="px-2 py-1 border rounded text-xs" onClick={onDelete}>Delete</button>
          </>
        ) : (
          <>
            <button className="px-2 py-1 border rounded text-xs" disabled={saving} onClick={onSave}>{saving?'Saving...':'Save'}</button>
            <button className="px-2 py-1 border rounded text-xs" onClick={()=>{setEditing(false); setLocal({title:p.title,price:p.price,stock:p.stock,description:p.description||'',categoryId:p.categoryId,featured:!!p.featured});}}>Cancel</button>
          </>
        )}
      </td>
    </tr>
  );
}
