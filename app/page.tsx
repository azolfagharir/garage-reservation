// app/page.tsx
"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useEffect, useRef } from "react";

const features = [
  {
    icon: "🔍",
    title: "جستجوی مکانیک",
    desc: "مکانیک‌های معتمد شهر خود را پیدا کنید",
  },
  {
    icon: "📅",
    title: "رزرو آنلاین",
    desc: "نوبت خود را در کمتر از یک دقیقه ثبت کنید",
  },
  {
    icon: "⭐",
    title: "مکانیک‌های تأییدشده",
    desc: "تمام مکانیک‌ها تأیید هویت شده‌اند",
  },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) =>
          e.target.classList.toggle("opacity-0", !e.isIntersecting),
        ),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-950 text-white overflow-x-hidden"
      dir="rtl"
    >
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.6);opacity:0} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .float { animation: float 4s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #eab308 0%, #fde68a 40%, #eab308 60%, #ca8a04 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .reveal { transition: opacity 0.7s ease, transform 0.7s ease; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(234,179,8,0.15); }
        .btn-glow:hover { box-shadow: 0 0 24px rgba(234,179,8,0.5); }
        .ring-pulse::before {
          content:''; position:absolute; inset:-4px; border-radius:inherit;
          border:2px solid rgba(234,179,8,0.4);
          animation: pulse-ring 2s ease-out infinite;
        }
        .grid-bg {
          background-image: linear-gradient(rgba(234,179,8,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234,179,8,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .spin-slow { animation: spin-slow 20s linear infinite; }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.8s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.8s 0.25s ease both; }
        .fade-up-3 { animation: fadeUp 0.8s 0.4s ease both; }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center py-32 px-4 overflow-hidden grid-bg"
      >
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Spinning ring */}
        <div className="absolute w-[500px] h-[500px] border border-yellow-500/10 rounded-full spin-slow pointer-events-none" />
        <div
          className="absolute w-[700px] h-[700px] border border-yellow-500/5 rounded-full spin-slow pointer-events-none"
          style={{ animationDirection: "reverse", animationDuration: "30s" }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <span className="fade-up inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wider">
            🚗 سریع‌ترین راه رزرو نوبت
          </span>

          <h1 className="fade-up-1 text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="shimmer-text">رزرو نوبت</span>
            <br />
            <span className="text-white">تعمیرگاه آنلاین</span>
          </h1>

          <p className="fade-up-2 text-gray-400 text-lg max-w-xl mb-10 leading-relaxed">
            سریع‌ترین راه برای پیدا کردن مکانیک معتمد در شهر شما.
            <br />
            نوبت بگیرید، وقت‌تان را هدر ندهید.
          </p>

          <div className="fade-up-3 flex flex-wrap gap-4 justify-center">
            <Link
              href="/signup"
              className="relative btn-glow ring-pulse bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-10 py-3.5 rounded-2xl text-lg transition-all duration-300"
            >
              ثبت‌نام رایگان
            </Link>
            <Link
              href="/login"
              className="border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 font-bold px-10 py-3.5 rounded-2xl text-lg transition-all duration-300"
            >
              ورود به حساب
            </Link>
          </div>

          {/* Stats */}
          <div className="fade-up-3 flex gap-10 mt-14 text-center">
            {[
              ["۱۲۰۰+", "مکانیک فعال"],
              ["۴۸۰۰+", "رزرو موفق"],
              ["۴.۹", "امتیاز کاربران"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-extrabold text-yellow-400">
                  {n}
                </div>
                <div className="text-xs text-gray-500 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">چرا آچارینو؟</h2>
          <div className="w-16 h-1 bg-yellow-500 rounded-full mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card-hover reveal bg-gray-900 border border-gray-800 hover:border-yellow-500/40 rounded-2xl p-8 text-center"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="float inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-2xl text-3xl mb-5">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            چطور کار می‌کند؟
          </h2>
          <div className="w-16 h-1 bg-yellow-500 rounded-full mx-auto" />
        </div>
        <div className="relative flex flex-col md:flex-row gap-6 items-start">
          <div className="hidden md:block absolute top-8 right-[12%] left-[12%] h-px bg-gradient-to-l from-transparent via-yellow-500/40 to-transparent" />
          {[
            { n: "۱", t: "ثبت‌نام کنید", d: "یک حساب رایگان بسازید" },
            {
              n: "۲",
              t: "مکانیک انتخاب کنید",
              d: "از لیست مکانیک‌های تأییدشده",
            },
            { n: "۳", t: "نوبت بگیرید", d: "زمان دلخواه خود را رزرو کنید" },
          ].map((s) => (
            <div
              key={s.n}
              className="reveal flex-1 flex flex-col items-center text-center"
            >
              <div className="relative w-16 h-16 bg-yellow-500 text-black font-extrabold text-xl rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20">
                {s.n}
              </div>
              <h4 className="font-bold text-white mb-1">{s.t}</h4>
              <p className="text-gray-500 text-sm">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 mx-4 mb-12 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-yellow-500/20 text-center max-w-5xl md:mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.08),transparent_70%)]" />
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold mb-3">همین الان شروع کنید</h2>
          <p className="text-gray-400 mb-8">
            ثبت‌نام رایگان است و کمتر از ۳۰ ثانیه طول می‌کشد
          </p>
          <Link
            href="/signup"
            className="btn-glow inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-12 py-4 rounded-2xl text-lg transition-all duration-300"
          >
            شروع کنید ←
          </Link>
        </div>
      </section>

      <footer className="text-center text-gray-600 py-8 text-sm border-t border-gray-900">
        © ۱۴۰5 آچارینو آنلاین — تمام حقوق محفوظ است
      </footer>
    </div>
  );
}
