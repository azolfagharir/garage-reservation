// app/dashboard/customer/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Mechanic = {
  id: number;
  user: { name: string };
  city: string;
  address: string;
  workStart: string;
  workEnd: string;
};

type Booking = {
  id: number;
  date: string;
  status: string;
  confirmedTime?: string;
  mechanic: { user: { name: string } };
  service: { name: string };
};

export default function CustomerPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; city: string } | null>(null);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (data.role !== "CUSTOMER") { router.push("/dashboard/mechanic"); return; }
        setUser(data);
        return Promise.all([
          fetch(`/api/mechanics?city=${encodeURIComponent(data.city || "")}`).then((r) => r.ok ? r.json() : []),
          fetch("/api/customer/bookings").then((r) => r.ok ? r.json() : []),
        ]);
      })
      .then((results) => {
        if (!results) return;
        setMechanics(results[0]);
        setBookings(results[1]);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (!user) return null;

  const statusLabel: Record<string, string> = {
    PENDING: "در انتظار تایید تعمیرکار",
    CONFIRMED: "تایید شده",
    CANCELLED: "لغو شده",
  };

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-500 text-black",
    CONFIRMED: "bg-green-500 text-black",
    CANCELLED: "bg-red-500 text-white",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-1">سلام، {user.name} 👋</h1>
        <p className="text-gray-400 mb-8">
          مکانیک‌های موجود در <span className="text-yellow-400 font-semibold">{user.city || "تهران"}</span>
        </p>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="font-bold text-lg text-yellow-400">رزروهای من</h2>
            <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">{bookings.length} نوبت</span>
          </div>
          {bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-3">📭</div>
              <p>هنوز رزروی ثبت نکرده‌اید</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-right py-3 px-6">مکانیک</th>
                  <th className="text-right py-3 px-4">خدمت</th>
                  <th className="text-right py-3 px-4">تاریخ</th>
                  <th className="text-right py-3 px-4">ساعت</th>
                  <th className="text-right py-3 px-4">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="py-4 px-6 font-medium">{b.mechanic.user.name}</td>
                    <td className="py-4 px-4 text-gray-400">{b.service.name}</td>
                    <td className="py-4 px-4 text-gray-400">{new Date(b.date).toLocaleDateString("fa-IR")}</td>
                    <td className="py-4 px-4 text-gray-400">
                      {b.confirmedTime ?? <span className="text-gray-600">—</span>}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${statusColor[b.status] ?? "bg-gray-600 text-white"}`}>
                        {statusLabel[b.status] ?? b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {mechanics.length === 0 ? (
          <p className="text-gray-500">مکانیکی در شهر شما یافت نشد.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mechanics.map((m) => (
              <Link key={m.id} href={`/dashboard/customer/mechanic/${m.id}`}
                className="bg-gray-900 border border-gray-800 hover:border-yellow-500 rounded-2xl p-6 transition group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">🔧</div>
                  <div>
                    <h2 className="text-xl font-bold group-hover:text-yellow-400 transition">{m.user.name}</h2>
                    <p className="text-gray-400 text-sm">{m.city}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>📍 {m.address}</span>
                  <span>🕐 {m.workStart} تا {m.workEnd}</span>
                  <span className="text-yellow-500 font-semibold">رزرو نوبت ←</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
