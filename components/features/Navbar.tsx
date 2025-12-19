"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-carbon-800 bg-[#1a1a1a]/90 backdrop-blur font-mono uppercase text-xs tracking-widest flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold bg-white text-black px-2 py-1 hover:bg-neon-green transition-colors">
          CATATAN_DUIT
        </Link>
        <span className="text-carbon-500 hidden sm:inline-block">:: SYS.ONLINE</span>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="hover:text-neon-green transition-colors">[MARKAS]</Link>
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <div className="text-right hidden md:block">
              <p className="text-carbon-400">USER: {session.user?.name}</p>
              <p className="text-[10px] text-neon-green">SECURE_LEVEL_5</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-3 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors"
            >
              LOGOUT
            </button>
          </>
        ) : (
          <Link href="/login" className="px-3 py-1 border border-neon-green text-neon-green hover:bg-neon-green hover:text-black transition-colors">
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
}
