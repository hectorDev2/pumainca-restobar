"use client";

import React, { useState } from "react";
import { useCreateCategory } from "@/lib/queries";

type Props = {
  onCreated?: (category: any) => void;
};

export default function CreateCategoryForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState<string | number>(0);
  const [file, setFile] = useState<File | null>(null);

  const mutation = useCreateCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("El nombre es obligatorio");

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
        setDisplayOrder(0);
        if (onCreated) onCreated(created);
      },
      onError: (err: any) => {
        alert(err?.message ?? "Error creando categoría");
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
        <label className="block text-xs font-bold text-zinc-400">
          Imagen (opcional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-2"
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
          disabled={mutation.isLoading}
          className="bg-green-600 px-4 py-2 rounded-xl font-bold disabled:opacity-50"
        >
          {mutation.isLoading ? "Creando..." : "Crear categoría"}
        </button>
      </div>
    </form>
  );
}
