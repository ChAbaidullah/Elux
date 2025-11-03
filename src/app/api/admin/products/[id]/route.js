import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function slugify(s) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function GET(_req, { params }) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing id", { status: 400 });
  const p = await prisma.product.findUnique({ where: { id }, include: { category: true } });
  if (!p) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(p);
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing id", { status: 400 });
  const body = await req.json().catch(() => ({}));
  const data = {};

  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.slug === "string" && body.slug) data.slug = body.slug;
  if (body.description === null || typeof body.description === "string") data.description = body.description ?? null;
  if (typeof body.price !== "undefined") {
    const v = typeof body.price === "number" ? body.price : parseFloat(body.price);
    if (!Number.isFinite(v)) return new NextResponse("Invalid price", { status: 400 });
    data.price = v;
  }
  if (typeof body.stock !== "undefined") {
    const s = Number.isInteger(body.stock) ? body.stock : parseInt(String(body.stock), 10);
    if (!Number.isFinite(s)) return new NextResponse("Invalid stock", { status: 400 });
    data.stock = s;
  }
  if (typeof body.categoryId === "string") data.categoryId = body.categoryId;
  if (typeof body.featured !== "undefined") data.featured = !!body.featured;

  if (Array.isArray(body.images)) {
    data.images = body.images
      .map((img) => (img && typeof img === "object" ? { url: String(img.url || ""), alt: img.alt ? String(img.alt) : null } : null))
      .filter((x) => x && x.url);
  }
  if (typeof body.attributes !== "undefined") data.attributes = body.attributes ?? null;

  if (Object.keys(data).length === 0) return new NextResponse("No changes", { status: 400 });

  // Handle slug collision gracefully once
  if (data.slug === undefined && typeof body.title === "string") {
    data.slug = slugify(body.title);
  }

  try {
    const updated = await prisma.product.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e) {
    if (e && e.code === 'P2002') {
      // duplicate slug -> retry with suffix
      if (data.slug) {
        try {
          const updated2 = await prisma.product.update({ where: { id }, data: { ...data, slug: `${data.slug}-${Date.now().toString(36).slice(-4)}` } });
          return NextResponse.json(updated2);
        } catch (e2) {
          return new NextResponse("Duplicate slug", { status: 409 });
        }
      }
    }
    const message = typeof e?.message === 'string' && e.message ? e.message : 'Update failed';
    return new NextResponse(message, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing id", { status: 400 });
  try {
    await prisma.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return new NextResponse("Delete failed", { status: 400 });
  }
}
