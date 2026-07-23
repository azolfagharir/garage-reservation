import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city");
  const mechanics = await prisma.mechanic.findMany({
    where: city ? { city } : undefined,
    include: { user: { select: { name: true } } },
  });
  return NextResponse.json(mechanics);
}
