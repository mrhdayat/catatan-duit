"use client";

import { registerUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Toast, useToast } from "@/components/ui/Toast";
import { AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await registerUser(formData);
    setLoading(false);

    if (result?.error) {
      if (typeof result.error === 'string') {
        addToast(result.error, "error");
      } else {
        // Flatten field errors
        const msg = Object.values(result.error).flat().join(", ");
        addToast(msg, "error");
      }
    } else {
      addToast("AKUN TERBUAT! Redirecting...", "success");
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dots-pattern">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>

      <div className="max-w-md w-full bg-black/50 backdrop-blur-md border-[3px] border-carbon-500 p-8 shadow-[12px_12px_0_#333]">
        <div className="mb-8 border-b-2 border-dashed border-gray-600 pb-4">
          <h1 className="text-3xl font-black uppercase text-white">Daftar Akun Baru</h1>
          <p className="font-mono text-xs text-neon-orange mt-2">&gt; CREATE_NEW_IDENTITY</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase mb-2 text-carbon-300">Nama Panggilan</label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-carbon-900 border-2 border-carbon-600 p-3 text-white focus:outline-none focus:border-neon-green font-mono"
              placeholder="Si Paling Hemat"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase mb-2 text-carbon-300">Email Lo</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-carbon-900 border-2 border-carbon-600 p-3 text-white focus:outline-none focus:border-neon-green font-mono"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase mb-2 text-carbon-300">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-carbon-900 border-2 border-carbon-600 p-3 text-white focus:outline-none focus:border-neon-green font-mono"
              placeholder="******"
            />
          </div>

          <Button type="submit" variant="outline" className="w-full hover:bg-neon-green hover:text-black hover:border-neon-green" disabled={loading}>
            {loading ? "PROCESSING..." : "DAFTAR SEKARANG"}
          </Button>

          <div className="text-center pt-4">
            <Link href="/login" className="text-xs font-mono text-carbon-400 hover:text-white underline">
              Udah punya akun? Masuk aja.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
