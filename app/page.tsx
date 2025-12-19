import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-grid-pattern bg-[size:40px_40px]">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/80 pointer-events-none" />

      <main className="relative z-10 max-w-2xl w-full flex flex-col items-start gap-8 border-l-4 border-neon-green pl-6 py-4 bg-black/40 backdrop-blur-sm">
        <div className="space-y-2">
          <p className="font-mono text-neon-green text-sm tracking-widest typing-effect">
            &gt; INISIALISASI SISTEM...
          </p>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-carbon-500">
            Catatan<br />Duit
          </h1>
          <p className="text-xl md:text-2xl text-carbon-300 max-w-lg font-sans">
            Transparansi Keuangan Brutal. <br />
            <span className="text-carbon-500 text-sm font-mono">GAK PAKE RIBET. GAK PAKE TIPU-TIPU.</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full pt-8">
          <Button href="/login" variant="neon" className="w-full sm:w-auto text-lg py-4">
            &gt; MASUK MARKAS
          </Button>
          <Button href="/register" variant="outline" className="w-full sm:w-auto opacity-70">
            DAFTAR BARU
          </Button>
        </div>

        <div className="text-xs font-mono text-carbon-400 bg-carbon-900/50 p-2 border border-carbon-700 mt-4">
          [DEBUG_MODE] Dummy Account: demo@catatanduit.com / password123
        </div>

        <div className="absolute top-0 right-0 p-4 border border-carbon-800 text-xs font-mono text-carbon-500">
          V1.0.0-BETA
        </div>
      </main>

      <footer className="absolute bottom-8 left-8 text-xs font-mono text-carbon-600">
        SYSTEM_ID: CD-9982-X <br />
        STATUS: ONLINE
      </footer>
    </div>
  );
}
