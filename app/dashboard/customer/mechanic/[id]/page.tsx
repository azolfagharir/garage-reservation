"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

const SERVICES = [
  { id: 1, name: "تعویض روغن موتور" },
  { id: 2, name: "تعویض لنت ترمز" },
  { id: 3, name: "تنظیم موتور" },
  { id: 4, name: "تعویض فیلتر هوا" },
  { id: 5, name: "شارژ کولر" },
  { id: 6, name: "تعویض باتری" },
  { id: 7, name: "تعویض واتر پمپ" },
  { id: 8, name: "تنظیم فرمان" },
  { id: 9, name: "تعویض تسمه تایم" },
  { id: 10, name: "دیاگ خودرو" },
];

type DaySlot = { date: string; persianDate: string; disabled: boolean };

function toPersianDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BookMechanicPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [days, setDays] = useState<DaySlot[]>([]);
  const [serviceId, setServiceId] = useState<number>(SERVICES[0].id);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

useEffect(() => {
  fetch(`/api/mechanics/${id}/available-dates`)
    .then((r) => r.json())
    .then((data) => setDays(Array.isArray(data) ? data : []));
}, [id]);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate) { setError("لطفاً یک تاریخ انتخاب کنید"); return; }
    setLoading(true);
    setError("");
  const res = await fetch(`/api/mechanics/${id}/bookings`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ serviceId, date: selectedDate }),
});
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setSuccess(true);
    setTimeout(() => router.push("/dashboard/customer"), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">رزرو نوبت</h1>

        {success ? (
          <div className="bg-green-900 border border-green-600 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-green-300 font-semibold">رزرو با موفقیت ثبت شد</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-6">

            {/* انتخاب خدمت */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">نوع خدمت</label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
              >
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* انتخاب تاریخ */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">انتخاب تاریخ</label>
              <div className="grid grid-cols-3 gap-2">
                {days.map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    disabled={d.disabled}
                    onClick={() => setSelectedDate(d.date)}
                    className={`py-2 px-1 rounded-xl text-xs font-medium border transition
                      ${d.disabled
                        ? "border-gray-700 text-gray-600 bg-gray-800 cursor-not-allowed line-through"
                        : selectedDate === d.date
                          ? "border-yellow-500 bg-yellow-500 text-black"
                          : "border-gray-700 bg-gray-800 hover:border-yellow-500 text-gray-300"
                      }`}
                  >
                  {d.persianDate}
                  {d.disabled && <span className="block text-[10px] text-red-500">تکمیل</span>}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading || !selectedDate}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "در حال ثبت..." : "ثبت رزرو"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
