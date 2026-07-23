import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toJalaali } from "jalaali-js";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const mechanicId = parseInt(id);
    if (isNaN(mechanicId)) return NextResponse.json([], { status: 200 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setDate(today.getDate() + 30);

    const bookings = await prisma.booking.findMany({
      where: { mechanicId, date: { gte: today, lt: end } },
      select: { date: true },
    });

    const countMap: Record<string, number> = {};
    for (const b of bookings) {
      const key = `${b.date.getUTCFullYear()}-${String(b.date.getUTCMonth() + 1).padStart(2, "0")}-${String(b.date.getUTCDate()).padStart(2, "0")}`;
      countMap[key] = (countMap[key] ?? 0) + 1;
    }

    const result = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
      const iso = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const j = toJalaali(y, m, day);
      return {
        date: iso,
        persianDate: `${j.jy}/${String(j.jm).padStart(2, "0")}/${String(j.jd).padStart(2, "0")}`,
        disabled: (countMap[iso] ?? 0) >= 15,
      };
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("[available-dates error]", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
