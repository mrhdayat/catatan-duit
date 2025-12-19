"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "border-neon-green text-neon-green bg-black",
    error: "border-red-600 text-red-600 bg-black",
    info: "border-white text-white bg-black",
  };

  return createPortal(
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`fixed top-24 right-8 z-[100] border-2 px-6 py-4 font-mono shadow-[8px_8px_0_rgba(0,0,0,0.5)] ${colors[type]}`}
    >
      <div className="text-xs font-bold mb-1 uppercase">
        {type === "success" ? "SYSTEM_CONFIRMED" : "SYSTEM_ERROR"}
      </div>
      <div className="text-sm font-bold">{message}</div>
    </motion.div>,
    document.body
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([]);

  const addToast = (message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
};
