// app/dashboard/mechanic/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

type Booking = {
  id: number;
  date: string;
  status: string;
  confirmedTime?: string;
  customer: { name: string };
  service: { name: string };
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "در انتظار",
  CONFIRMED: "تایید شده",
  CANCELLED: "لغو شده",
  COMPLETED: "تکمیل شده",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  CONFIRMED: "bg-green-500/10 text-green-500",
  CANCELLED: "bg-red-500/10 text-red-400",
  COMPLETED: "bg-blue-500/10 text-blue-400",
};

export default function MechanicDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mechanicName, setMechanicName] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<number | null>(null);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/mechanics/bookings");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setMechanicName(data.name || "");
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch {
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string, confirmedTime?: string) => {
    const res = await fetch(`/api/mechanics/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, confirmedTime }),
    });
    if (res.ok) {
      toast.success("وضعیت به‌روزرسانی شد");
      fetchBookings();
      setModal(null);
    } else {
      const err = await res.json();
      toast.error(err.error || "خطایی رخ داد");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-yellow-500">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      <Navbar />
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">سلام، {mechanicName} 👋</h1>
          <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
            {bookings.length} نوبت
          </span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-3">📭</div>
              <p>نوبتی یافت نشد.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-right py-3 px-6">مشتری</th>
                  <th className="text-right py-3 px-4">خدمت</th>
                  <th className="text-right py-3 px-4">تاریخ</th>
                  <th className="text-right py-3 px-4">ساعت</th>
                  <th className="text-right py-3 px-4">وضعیت</th>
                  <th className="text-right py-3 px-4">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="py-4 px-6 font-medium">{b.customer?.name ?? "نامشخص"}</td>
                    <td className="py-4 px-4 text-gray-400">{b.service?.name ?? "—"}</td>
                    <td className="py-4 px-4 text-gray-400">
                      {new Date(b.date).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="py-4 px-4 text-gray-400">
                      {b.confirmedTime ?? <span className="text-gray-600">—</span>}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${STATUS_COLOR[b.status] ?? "bg-gray-600 text-white"}`}>
                        {STATUS_LABEL[b.status] ?? b.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {b.status === "PENDING" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => setModal(b.id)}
                            className="bg-green-500/20 text-green-500 p-1.5 rounded-lg hover:bg-green-500 hover:text-black transition-all"
                          >
                            ✔
                          </button>
                          <button
                            onClick={() => updateStatus(b.id, "CANCELLED")}
                            className="bg-red-500/20 text-red-500 p-1.5 rounded-lg hover:bg-red-500 hover:text-black transition-all"
                          >
                            ✖
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">تعیین بازه زمانی نوبت</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">ساعت شروع</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">ساعت پایان</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={() => updateStatus(modal!, "CONFIRMED", `${startTime}-${endTime}`)}
                className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition-colors"
              >
                تایید نهایی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
