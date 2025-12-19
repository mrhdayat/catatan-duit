"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center border-2 border-red-500 m-8 bg-red-950/20">
      <h2 className="text-3xl font-black text-red-500 mb-4 uppercase">SYSTEM FAILURE</h2>
      <p className="font-mono text-gray-300 mb-6">
        Ada yang error nih bos. "Something went wrong" kata sistemnya.
      </p>
      <div className="bg-black p-4 border border-gray-700 mb-6 w-full max-w-lg overflow-auto">
        <code className="text-xs text-red-400 font-mono">
          {error.message || "Unknown Error"}
        </code>
      </div>
      <Button variant="solid" onClick={() => reset()}>
        COBA LAGI
      </Button>
    </div>
  );
}
