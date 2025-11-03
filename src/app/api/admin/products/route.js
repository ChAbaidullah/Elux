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

export async function GET() {
  const items = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json(items);
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const {
    title,
    slug,
    description,
    price,
    stock = 0,
    categoryId,
    images = [],
    attributes = null,
    featured = false,
  } = body || {};

  if (!title || typeof title !== "string")
    return new NextResponse("Invalid title", { status: 400 });
  if (!categoryId || typeof categoryId !== "string")
    return new NextResponse("Invalid categoryId", { status: 400 });

  const parsedPrice = typeof price === "number" ? price : parseFloat(price);
  if (!Number.isFinite(parsedPrice))
    return new NextResponse("Invalid price", { status: 400 });

  let finalSlug = slug && typeof slug === "string" ? slug : slugify(title);

  // Normalize images: array of { url, alt? }
  const normImages = Array.isArray(images)
    ? images
        .map((img) =>
          img && typeof img === "object"
            ? { url: String(img.url || ""), alt: img.alt ? String(img.alt) : null }
            : null
        )
        .filter((x) => x && x.url)
    : [];

  try {
    const created = await prisma.product.create({
      data: {
        title,
        slug: finalSlug,
        description: description || null,
        price: parsedPrice,
        stock: Number.isInteger(stock) ? stock : parseInt(stock || 0, 10),
        categoryId,
        images: normImages,
        attributes: attributes ?? null,
        featured: !!featured,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    if (e && e.code === 'P2002' && Array.isArray(e.meta?.target) ? e.meta.target.includes('slug') : String(e.meta?.target || '').includes('slug')) {
      try {
        finalSlug = `${finalSlug}-${Date.now().toString(36).slice(-4)}`;
        const created2 = await prisma.product.create({
          data: {
            title,
            slug: finalSlug,
            description: description || null,
            price: parsedPrice,
            stock: Number.isInteger(stock) ? stock : parseInt(stock || 0, 10),
            categoryId,
            images: normImages,
            attributes: attributes ?? null,
            featured: !!featured,
          },
        });
        return NextResponse.json(created2, { status: 201 });
      } catch (e2) {
        return new NextResponse("Duplicate slug", { status: 409 });
      }
    }
    const message = typeof e?.message === 'string' && e.message ? e.message : 'Product create failed';
    return new NextResponse(message, { status: 400 });
  }
}
