"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setStep(2);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dots-pattern p-4">
      <div className="max-w-md w-full">
        <Card variant="outline" className="bg-black/80 backdrop-blur border-2 border-white p-8 shadow-[8px_8px_0_#FFF]">
          <div className="text-center mb-8 border-b-2 border-dashed border-gray-600 pb-4">
            <h1 className="text-2xl font-black uppercase text-white">Lupa Password?</h1>
            <p className="font-mono text-xs text-neon-green mt-2">SYSTEM_RECOVERY_MODE</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm font-mono text-gray-400 text-center">
                Santai, jangan panik. Masukin email lo di bawah, nanti kita kirim kode nuklir buat reset.
              </p>
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-carbon-900 border-2 border-carbon-600 p-3 text-white focus:outline-none focus:border-neon-green font-mono text-center"
                  placeholder="email.lo@sini.com"
                />
              </div>
              <Button type="submit" variant="neon" className="w-full">
                KIRIM LINK RESET
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-4xl">📨</div>
              <h3 className="text-xl font-bold text-white">Cek Email Lo!</h3>
              <p className="text-sm font-mono text-gray-400">
                Kalau email <strong>{email}</strong> beneran terdaftar, link reset udah meluncur ke sana.
                (Cek folder Spam juga, kali aja nyasar).
              </p>
              <div className="pt-4 border-t border-gray-700">
                <Link href="/login">
                  <Button variant="outline" className="w-full">BALIK LOGIN</Button>
                </Link>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <Link href="/login" className="text-xs font-mono text-gray-500 hover:text-white underline">
              {step === 1 && "Gak jadi, inget lagi passwordnya."}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
