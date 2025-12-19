"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-carbon-800 bg-[#1a1a1a]/90 backdrop-blur font-mono uppercase text-xs tracking-widest px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold bg-white text-black px-2 py-1 hover:bg-neon-green transition-colors">
            CATATAN_DUIT
          </Link>
          <span className="text-carbon-500 hidden sm:inline-block">:: SYS.ONLINE</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-neon-green transition-colors">[MARKAS]</Link>
          <Link href="/dashboard/laporan" className="hover:text-neon-green transition-colors">[LAPORAN]</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              <div className="text-right">
                <p className="text-carbon-400">USER: {session.user?.name}</p>
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

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-4 flex flex-col gap-4 border-t border-carbon-800 pt-4"
          >
            <Link href="/dashboard" className="hover:text-neon-green transition-colors py-2 block border-b border-carbon-800">[MARKAS]</Link>
            <Link href="/dashboard/laporan" className="hover:text-neon-green transition-colors py-2 block border-b border-carbon-800">[LAPORAN]</Link>

            {session ? (
              <div className="flex flex-col gap-4 pt-2">
                <p className="text-carbon-400">USER: {session.user?.name}</p>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-left py-2 text-red-500 hover:text-white"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link href="/login" className="py-2 text-neon-green hover:text-white">
                LOGIN
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
