"use client";

import React from "react";
import { ModalBody, ModalContent } from "@/components/ui/animated-modal";

type DeleteProductModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName?: string;
  isPending: boolean;
};

export default function DeleteProductModal({
  open,
  onClose,
  onConfirm,
  productName,
  isPending,
}: DeleteProductModalProps) {
  if (!open) return null;

  return (
    <ModalBody
      open={open}
      onClose={onClose}
      className="md:max-w-125 bg-zinc-900 dark:bg-zinc-900 border-zinc-800"
    >
      <ModalContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-black mb-2">¿Eliminar producto?</h2>
            <p className="text-zinc-400 mb-4">
              Estás a punto de eliminar{" "}
              <span className="font-bold text-white">{productName}</span>
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm text-yellow-200">
              <p className="font-bold mb-2">⚠️ Esta acción es irreversible</p>
              <ul className="text-left space-y-1 text-xs">
                <li>• Se eliminará el producto de la base de datos</li>
                <li>• Se borrarán todas las imágenes asociadas del servidor</li>
                <li>• No se podrá recuperar esta información</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 w-full pt-4">
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50"
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </ModalContent>
    </ModalBody>
  );
}
