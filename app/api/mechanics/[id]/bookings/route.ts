import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    const { id } = await params;
    const mechanicId = parseInt(id);
    const { serviceId, date } = await req.json();

    if (!serviceId || !date || isNaN(mechanicId)) {
      return NextResponse.json({ error: "داده‌های ارسالی ناقص است" }, { status: 400 });
    }

    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return NextResponse.json({ error: "تاریخ انتخابی معتبر نیست" }, { status: 400 });
    }

    const count = await prisma.booking.count({
      where: {
        mechanicId,
        date: {
          gte: new Date(date),
          lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        },
      },
    });

    if (count >= 15) {
      return NextResponse.json({ error: "ظرفیت این روز تکمیل است" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        mechanicId,
        customerId: userId,
        serviceId,
        date: bookingDate,
        status: "PENDING",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    console.error("خطا در ثبت رزرو:", err);
    return NextResponse.json({ error: "خطای سرور در ثبت رزرو" }, { status: 500 });
  }
}
