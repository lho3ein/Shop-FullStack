import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SUGGESTIONS = ["آیفون", "سامسونگ", "شیائومی", "ایرپادز", "هدفون", "پاوربانک"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const suggestionsOnly = q.length === 0;

  if (q && q.length < 2) {
    return NextResponse.json({ products: [], suggestions: [] });
  }

  const products = suggestionsOnly
    ? []
    : await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { shortDescription: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
          price: true,
          originalPrice: true,
        },
        take: 6,
      });

  const suggestions = q
    ? SUGGESTIONS.filter((s) => s.includes(q) || q.includes(s)).slice(0, 5)
    : SUGGESTIONS;

  return NextResponse.json({ products, suggestions });
}