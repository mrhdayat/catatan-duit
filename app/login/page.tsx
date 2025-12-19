"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Login gagal bro! Cek email sama password lo.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dots-pattern">
      <div className="max-w-md w-full bg-black/50 backdrop-blur-md border-[3px] border-carbon-500 p-8 shadow-[12px_12px_0_#333]">
        <div className="mb-8 border-b-2 border-dashed border-gray-600 pb-4">
          <h1 className="text-3xl font-black uppercase text-white">Login Markas</h1>
          <p className="font-mono text-xs text-neon-green mt-2">&gt; AUTHENTICATION_REQUIRED</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase mb-2 text-carbon-300">Email Lo</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-carbon-900 border-2 border-carbon-600 p-3 text-white focus:outline-none focus:border-neon-green font-mono"
              placeholder="user@catatanduit.com"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase mb-2 text-carbon-300">Password Rahasia</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-carbon-900 border-2 border-carbon-600 p-3 text-white focus:outline-none focus:border-neon-green font-mono"
              placeholder="******"
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 p-3 text-red-200 text-xs font-mono">
              KERNEL_PANIC: {error}
            </div>
          )}

          <Button type="submit" variant="neon" className="w-full" disabled={loading}>
            {loading ? "LOADING..." : "MASUK KE DALAM"}
          </Button>

          <div className="text-center pt-4">
            <Link href="/register" className="text-xs font-mono text-carbon-400 hover:text-white underline">
              Belum punya akses? Daftar sini bro.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
