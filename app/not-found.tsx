import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
      <h1 className="text-[120px] font-black leading-none text-neon-green tracking-tighter">404</h1>
      <div className="bg-white text-black px-4 py-1 font-bold text-xl uppercase -rotate-2 mb-8 transform">
        PAGE NOT FOUND
      </div>
      <p className="font-mono text-gray-400 mb-8 max-w-md">
        Waduh, nyasar bos? Halaman yang lo cari kayaknya udah diculik alien atau emang gak pernah ada.
      </p>
      <Link href="/">
        <Button variant="neon">BALIK KE MARKAS</Button>
      </Link>
    </div>
  );
}
