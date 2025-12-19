"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-mono uppercase text-carbon-300">Password Rahasia</label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full bg-carbon-900 border-2 border-carbon-600 p-3 pr-10 text-white focus:outline-none focus:border-neon-green font-mono"
                placeholder="******"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="text-right mt-1">
              <Link href="/lupa-password" className="text-[10px] text-carbon-400 hover:text-neon-orange hover:underline">
                Lupa password? Kebiasaan lo!
              </Link>
            </div>
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
