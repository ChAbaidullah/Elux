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

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { name, slug, description } = body || {};
  if (!name || typeof name !== "string") {
    return new NextResponse("Invalid name", { status: 400 });
  }
  const finalSlug = (slug && typeof slug === "string" ? slug : slugify(name));
  try {
    const created = await prisma.category.create({
      data: { name, slug: finalSlug, description: description || null },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return new NextResponse("Category create failed", { status: 400 });
  }
}
