import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 0;

export async function GET(_req, { params }) {
  const { id } = await params;
  if (!id) return new NextResponse("Missing id", { status: 400 });
  try {
    const p = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!p) return new NextResponse("Not found", { status: 404 });

    const data = {
      id: p.id,
      name: p.title,
      price: p.price,
      category: p.category?.name || "",
      image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0]?.url : "/file.svg",
      description: p.description || "",
    };
    return NextResponse.json(data);
  } catch (e) {
    return new NextResponse("Error", { status: 500 });
  }
}
