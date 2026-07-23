"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CurrentUser = { name: string; city: string | null; role: string } | null;

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link href="/" className="text-xl font-bold text-yellow-400">
        <img src="/acharino.png" className="w-20" alt="Acharino" />
      </Link>
      <div className="flex gap-4 items-center">
        {loading ? null : user ? (
          <>
            <span className="text-gray-300 text-sm">سلام، {user.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg text-sm transition"
            >
              خروج
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-yellow-400 transition text-sm">ورود</Link>
            <Link href="/signup" className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1.5 rounded-lg text-sm font-semibold transition">ثبت‌نام</Link>
          </>
        )}
      </div>
    </nav>
  );
}