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
    .slice(0, 64);
}

export async function GET(_req, { params }) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing id", { status: 400 });
  const c = await prisma.category.findUnique({ where: { id } });
  if (!c) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(c);
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing id", { status: 400 });
  const body = await req.json().catch(() => ({}));
  const data = {};
  if (typeof body.name === "string") data.name = body.name;
  if (typeof body.slug === "string" && body.slug) data.slug = body.slug; else if (typeof body.name === "string") data.slug = slugify(body.name);
  if (body.description === null || typeof body.description === "string") data.description = body.description ?? null;

  if (Object.keys(data).length === 0) return new NextResponse("No changes", { status: 400 });

  try {
    const updated = await prisma.category.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e) {
    if (e && e.code === 'P2002') return new NextResponse("Duplicate slug", { status: 409 });
    const msg = typeof e?.message === 'string' && e.message ? e.message : 'Update failed';
    return new NextResponse(msg, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing id", { status: 400 });

  // Block delete if products exist for now
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return new NextResponse("Category has products. Reassign or delete products first.", { status: 409 });

  await prisma.category.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
