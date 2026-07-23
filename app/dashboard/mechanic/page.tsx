// app/dashboard/mechanic/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type Booking = {
  id: number;
  date: string;
  status: string;
  confirmedTime?: string;
  customer: { name: string };
  service: { name: string; duration: number };
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "در انتظار تایید",
  CONFIRMED: "تایید شده",
  CANCELLED: "لغو شده",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-500 text-black",
  CONFIRMED: "bg-green-500 text-black",
  CANCELLED: "bg-red-500 text-white",
};

export default function MechanicDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [name, setName] = useState("");
  const [modal, setModal] = useState<number | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    fetch("/api/mechanics/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { router.push("/login"); return; }
        setName(data.name);
        setBookings(data.bookings);
      });
  }, []);

  const updateStatus = async (id: number, status: string, confirmedTime?: string) => {
    const res = await fetch(`/api/mechanics/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(confirmedTime && { confirmedTime }) }),
    });
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => b.id === id ? { ...b, status, ...(confirmedTime && { confirmedTime }) } : b)
      );
    }
  };

  const openModal = (id: number) => {
    setModal(id);
    setStartTime("");
    setEndTime("");
    setTimeError("");
  };

  const closeModal = () => {
    setModal(null);
    setTimeError("");
  };

  const handleConfirm = () => {
    if (!startTime || !endTime) { setTimeError("لطفاً ساعت شروع و پایان را وارد کنید"); return; }
    if (startTime >= endTime) { setTimeError("ساعت پایان باید بعد از ساعت شروع باشد"); return; }
    updateStatus(modal!, "CONFIRMED", `${startTime}-${endTime}`);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-1">پنل مکانیک 🔧</h1>
        <p className="text-gray-400 mb-8">سلام، {name}</p>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="font-bold text-lg text-yellow-400">نوبت‌های رزرو شده</h2>
            <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              {bookings.length} نوبت
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <div className="text-4xl mb-3">📭</div>
              <p>هنوز نوبتی رزرو نشده است</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-gray-800">
                  <th className="text-right py-3 px-6">مشتری</th>
                  <th className="text-right py-3 px-4">خدمت</th>
                  <th className="text-right py-3 px-4">تاریخ</th>
                  <th className="text-right py-3 px-4">بازه زمانی</th>
                  <th className="text-right py-3 px-4">وضعیت</th>
                  <th className="text-right py-3 px-4">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="py-4 px-6 font-medium">{b.customer.name}</td>
                    <td className="py-4 px-4 text-gray-400">{b.service?.name ?? "—"}</td>
                    <td className="py-4 px-4 text-gray-400">
                      {new Date(b.date).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="py-4 px-4">
                      {b.confirmedTime
                        ? <span className="text-green-400 font-mono">{b.confirmedTime}</span>
                        : <span className="text-gray-600">—</span>}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${STATUS_COLOR[b.status] ?? "bg-gray-600 text-white"}`}>
                        {STATUS_LABEL[b.status] ?? b.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {b.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button onClick={() => openModal(b.id)}
                            className="text-green-400 hover:text-green-300 text-lg" title="تایید">✔</button>
                          <button onClick={() => updateStatus(b.id, "CANCELLED")}
                            className="text-red-400 hover:text-red-300 text-lg" title="رد">✖</button>
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-80">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">تعیین بازه زمانی نوبت</h3>
            <label className="text-xs text-gray-400 mb-1 block">ساعت شروع</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white mb-3" />
            <label className="text-xs text-gray-400 mb-1 block">ساعت پایان</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white mb-2" />
            {timeError && <p className="text-red-400 text-xs mb-3">{timeError}</p>}
            <div className="flex gap-3 justify-end mt-2">
              <button onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm">انصراف</button>
              <button onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm">تایید</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
