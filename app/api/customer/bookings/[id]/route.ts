// app/api/customer/bookings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id: userId } = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const { id } = await params;
    const bookingId = parseInt(id);

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (booking.customerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (booking.status !== "PENDING") return NextResponse.json({ error: "Only PENDING bookings can be deleted" }, { status: 400 });

    await prisma.booking.delete({ where: { id: bookingId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
