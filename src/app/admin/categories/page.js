"use client";

import { useEffect, useState } from "react";

export default function AdminCategoriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setItems(data);
    } catch (e) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || undefined,
          description: form.description || undefined,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setForm({ name: "", slug: "", description: "" });
      await load();
    } catch (e) {
      setError("Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-gray-600">Create and view categories.</p>
        </div>

        <form onSubmit={onCreate} className="border rounded p-4 grid gap-3">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2 text-sm" value={form.name} onChange={(e)=>setForm(v=>({...v,name:e.target.value}))} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Slug (optional)</label>
            <input className="w-full border rounded px-3 py-2 text-sm" value={form.slug} onChange={(e)=>setForm(v=>({...v,slug:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Description (optional)</label>
            <textarea className="w-full border rounded px-3 py-2 text-sm" value={form.description} onChange={(e)=>setForm(v=>({...v,description:e.target.value}))} />
          </div>
          <button disabled={saving} className="self-start bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-60">{saving?"Creating...":"Create"}</button>
        </form>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600 text-sm">{error}</div>
        ) : (
          <div className="border rounded">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Slug</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c)=> (
                  <CategoryRow key={c.id} c={c} onChanged={load} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryRow({ c, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState({ name: c.name, slug: c.slug, description: c.description || '' });

  async function onSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: local.name,
          slug: local.slug || undefined,
          description: local.description || null,
        }),
      });
      if (!res.ok) {
        alert(await res.text());
        return;
      }
      setEditing(false);
      onChanged();
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm('Delete this category? Products referencing it will block deletion.')) return;
    const res = await fetch(`/api/admin/categories/${c.id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert(await res.text());
      return;
    }
    onChanged();
  }

  return (
    <tr className="border-t align-top">
      <td className="p-2">
        {editing ? (
          <input className="w-full border rounded px-2 py-1" value={local.name} onChange={(e)=>setLocal(v=>({...v,name:e.target.value}))} />
        ) : (
          c.name
        )}
      </td>
      <td className="p-2">
        {editing ? (
          <input className="w-full border rounded px-2 py-1" value={local.slug} onChange={(e)=>setLocal(v=>({...v,slug:e.target.value}))} />
        ) : (
          c.slug
        )}
      </td>
      <td className="p-2">
        {editing ? (
          <input className="w-full border rounded px-2 py-1" value={local.description} onChange={(e)=>setLocal(v=>({...v,description:e.target.value}))} />
        ) : (
          c.description || ''
        )}
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
            <button className="px-2 py-1 border rounded text-xs" onClick={()=>{setEditing(false); setLocal({ name:c.name, slug:c.slug, description:c.description||'' });}}>Cancel</button>
          </>
        )}
      </td>
    </tr>
  );
}
