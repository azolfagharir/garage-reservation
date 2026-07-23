import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const mechanic = await prisma.mechanic.findUnique({
    where: { id: parseInt(id) },
    include: {
      services: true, // مهم: بدون این خط، services برنمی‌گردد
      user: { select: { name: true } },
    },
  });

  if (!mechanic) {
    return NextResponse.json({ error: "مکانیک یافت نشد" }, { status: 404 });
  }

  return NextResponse.json(mechanic);
}