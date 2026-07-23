import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id: userId } = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const bookings = await prisma.booking.findMany({
      where: { customerId: userId },
      include: {
        mechanic: { include: { user: { select: { name: true } } } },
        service: { select: { name: true, duration: true } },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
