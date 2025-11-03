import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 0; // no cache during admin edits

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const featuredOnly = searchParams.get("featured") === "1" || searchParams.get("featured") === "true";
  const where = featuredOnly ? { featured: true } : {};
  const items = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  // Shape data for storefront ProductCard expectations
  const data = items.map((p) => ({
    id: p.id,
    name: p.title,
    price: p.price,
    category: p.category?.name || "",
    image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0]?.url : "/file.svg",
    featured: !!p.featured,
  }));

  return NextResponse.json(data);
}
