"use client";

import React from "react";
import { ModalBody, ModalContent, ModalFooter } from "@/components/ui/animated-modal";
import CreateCategoryForm from "@/components/CreateCategoryForm";

type CreateCategoryModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateCategoryModal({
  open,
  onClose,
  onCreated,
}: CreateCategoryModalProps) {
  if (!open) return null;

  return (
    <ModalBody
      open={open}
      onClose={onClose}
      className="md:max-w-[40%] bg-zinc-900 dark:bg-zinc-900 border-zinc-800"
    >
      <ModalContent className="p-6">
        <h2 className="text-2xl font-black mb-4">Nueva Categoría</h2>
        <div className="space-y-4">
          <CreateCategoryForm onCreated={onCreated} />
          <ModalFooter className="bg-transparent p-0 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400"
            >
              Cancelar
            </button>
          </ModalFooter>
        </div>
      </ModalContent>
    </ModalBody>
  );
}
