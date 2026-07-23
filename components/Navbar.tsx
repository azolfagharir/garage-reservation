"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const userStr = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null;
  const user = userStr ? JSON.parse(userStr) : null;

  const logout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link href="/" className="text-xl font-bold text-yellow-400">
<img src="/acharino.png" className="w-20" alt="Acharino" />
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-gray-300 text-sm">سلام، {user.name}</span>
            <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg text-sm transition">خروج</button>
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
