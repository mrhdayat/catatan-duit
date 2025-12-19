"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
            className="fixed z-[201] left-1/2 top-1/2 w-[90%] md:w-full md:max-w-lg"
          >
            <Card variant="outline" className="bg-carbon-900 border-2 border-white shadow-[8px_8px_0_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                <h3 className="text-xl font-bold uppercase text-white">{title}</h3>
                <button onClick={onClose} className="text-white hover:text-neon-green text-xl font-bold">X</button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                {children}
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
