// app/api/mechanics/bookings/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const TIME_RANGE_REGEX = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: userId } = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const { id } = await params;
    const bookingId = parseInt(id);
    const { status, confirmedTime } = await req.json();

    if (confirmedTime && !TIME_RANGE_REGEX.test(confirmedTime)) {
      return NextResponse.json(
        { error: "فرمت بازه زمانی نامعتبر است. مثال صحیح: 08:00-10:00" },
        { status: 400 }
      );
    }

    if (confirmedTime) {
      const [start, end] = confirmedTime.split("-");
      if (start >= end) {
        return NextResponse.json(
          { error: "ساعت پایان باید بعد از ساعت شروع باشد" },
          { status: 400 }
        );
      }
    }

    const mechanic = await prisma.mechanic.findUnique({ where: { userId } });
    if (!mechanic) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.mechanicId !== mechanic.id)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        ...(confirmedTime && { confirmedTime }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("خطا در به‌روزرسانی رزرو:", err);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
