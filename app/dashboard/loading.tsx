export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#1a1a1a]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-carbon-700 border-t-neon-green rounded-full animate-spin"></div>
        <p className="font-mono text-neon-green text-sm animate-pulse">LOADING_FINANCIAL_CORE...</p>
      </div>
    </div>
  );
}
