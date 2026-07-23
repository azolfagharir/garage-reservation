import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-4 bg-gradient-to-b from-gray-900 to-gray-950">
        <h1 className="text-5xl font-extrabold mb-4 text-yellow-400">رزرو نوبت تعمیرگاه</h1>
        <p className="text-gray-400 text-lg max-w-xl mb-8">
          سریع‌ترین راه برای پیدا کردن مکانیک معتمد در شهر شما. نوبت بگیرید، وقت‌تان را هدر ندهید.
        </p>
        <div className="flex gap-4">
          <Link href="/signup" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-xl text-lg transition">ثبت‌نام رایگان</Link>
          <Link href="/login" className="border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black font-bold px-8 py-3 rounded-xl text-lg transition">ورود به حساب</Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: "🔍", title: "جستجوی مکانیک", desc: "مکانیک‌های معتمد شهر خود را پیدا کنید" },
          { icon: "📅", title: "رزرو آنلاین", desc: "نوبت خود را در کمتر از یک دقیقه ثبت کنید" },
          { icon: "⭐", title: "مکانیک‌های تأییدشده", desc: "تمام مکانیک‌ها تأیید هویت شده‌اند" },
        ].map((f) => (
          <div key={f.title} className="bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-700 transition">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center py-16 bg-gray-900">
        <h2 className="text-3xl font-bold mb-4">همین الان شروع کنید</h2>
        <p className="text-gray-400 mb-6">ثبت‌نام رایگان است و کمتر از ۳۰ ثانیه طول می‌کشد</p>
        <Link href="/signup" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-10 py-3 rounded-xl text-lg transition">شروع کنید</Link>
      </section>

      <footer className="text-center text-gray-600 py-6 text-sm">
        © ۱۴۰۳ گاراژ آنلاین — تمام حقوق محفوظ است
      </footer>
    </div>
  );
}
