"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

const modalSizes = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-[1200px]",
};

type AdminModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  size?: keyof typeof modalSizes;
  className?: string;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function AdminModal({
  open,
  onClose,
  title,
  size = "md",
  className,
  actions,
  children,
  footer,
}: AdminModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={cn(
              "relative w-full mx-4 rounded-[32px] border border-white/10 bg-zinc-950 shadow-2xl",
              modalSizes[size],
              className
            )}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(event) => event.stopPropagation()}
          >
            {(title || actions) && (
              <header className="flex items-center justify-between gap-4 px-6 py-5 border-b border-white/10">
                <div className="font-black text-lg text-white">{title}</div>
                <div className="flex items-center gap-3">
                  {actions}
                  <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition text-xl font-bold"
                    aria-label="Cerrar modal"
                  >
                    ×
                  </button>
                </div>
              </header>
            )}
            <div className="max-h-[85vh] overflow-y-auto px-6 py-6">{children}</div>
            {footer && (
              <div className="px-6 py-4 border-t border-white/5 bg-black/30">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
