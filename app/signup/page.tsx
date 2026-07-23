"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CITIES = ["تهران", "اصفهان", "شیراز", "مشهد", "تبریز", "کرج"];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "تهران" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("همه فیلدها الزامی است"); return; }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "خطا در ثبت‌نام"); return; }
    localStorage.setItem("token", data.token);
    router.push("/dashboard/customer");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4" dir="rtl">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-800">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2 text-center">ثبت‌نام</h1>
        <p className="text-gray-500 text-sm text-center mb-6">حساب مشتری بسازید</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">نام کامل</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="علی رضایی"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">ایمیل</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="ali@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">رمز عبور</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">شهر</label>
            <select name="city" value={form.city} onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition">
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition text-lg">ثبت‌نام</button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-500">
          حساب دارید؟{" "}
          <Link href="/login" className="text-yellow-400 hover:underline">وارد شوید</Link>
        </div>
      </div>
    </div>
  );
}
