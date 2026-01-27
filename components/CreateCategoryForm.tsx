"use client";

import React, { useState } from "react";
import { useCreateCategory } from "@/lib/queries";
import { FileUpload } from "@/components/ui/file-upload";

type Props = {
  onCreated?: (category: any) => void;
};

export default function CreateCategoryForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState<string | number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  React.useEffect(() => {
    if (!errorMessage) return;
    setShowToast(true);
    const t = setTimeout(() => {
      setShowToast(false);
      setErrorMessage(null);
    }, 5000);
    return () => clearTimeout(t);
  }, [errorMessage]);

  const [preview, setPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  const mutation = useCreateCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("El nombre es obligatorio");
    setErrorMessage(null);
    const fd = new FormData();
    fd.append("name", name.trim());
    if (description) fd.append("description", description.trim());
    if (file) fd.append("image", file);
    if (displayOrder !== undefined && displayOrder !== null)
      fd.append("display_order", String(displayOrder));

    mutation.mutate(fd, {
      onSuccess: (created) => {
        setName("");
        setDescription("");
        setFile(null);
        setPreview(null);
        setDisplayOrder(0);
        setErrorMessage(null);
        if (onCreated) onCreated(created);
      },
      onError: (err: any) => {
        // Normalize error message
        const raw = err?.message ?? "Error creando categoría";
        const text = Array.isArray(raw) ? raw.join(", ") : String(raw);
        setErrorMessage(text);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-bold text-zinc-400">
          Nombre *
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-black/40 border border-zinc-700 rounded-xl px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-black/40 border border-zinc-700 rounded-xl px-3 py-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400 mb-2">
            Imagen (opcional)
        </label>
        <div className="h-40 w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black/20 mb-2">
            {preview ? (
                <img
                    src={preview}
                    alt="Previsualización"
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full items-center justify-center text-zinc-500">
                   Sin imagen
                </div>
            )}
        </div>
        <FileUpload
            label="Seleccionar imagen"
            description="Máx. 5MB, JPG/PNG"
            accept="image/*"
            onChange={(files) => setFile(files[0] ?? null)}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400">
          Orden de despliegue
        </label>
        <input
          type="number"
          value={String(displayOrder)}
          onChange={(e) => setDisplayOrder(Number(e.target.value))}
          className="w-32 bg-black/40 border border-zinc-700 rounded-xl px-3 py-2"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-green-600 px-4 py-2 rounded-xl font-bold disabled:opacity-50"
        >
          {mutation.isPending ? "Creando..." : "Crear categoría"}
        </button>
      </div>
      {/* Toast */}
      {showToast && errorMessage ? (
        <div
          aria-live="assertive"
          className="fixed right-4 bottom-4 z-50 max-w-xs bg-red-700 text-white px-4 py-3 rounded-lg shadow-lg"
        >
          <div className="font-semibold">Error</div>
          <div className="text-sm mt-1">{errorMessage}</div>
        </div>
      ) : null}
    </form>
  );
}
