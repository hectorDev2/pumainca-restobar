"use client";

import React, { useState } from "react";
import { useCreateCategory } from "@/lib/queries";
import { FileUpload } from "@/components/ui/file-upload";
import FormField from "./FormField";
import FormSubmitButton from "./FormSubmitButton";
import FormError from "./FormError";

type Props = {
  onCreated?: (category: any) => void;
};

/**
 * Formulario para crear nuevas categorías
 * Responsabilidad única: gestionar creación de categorías
 */
export default function CreateCategoryForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState<string | number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
        const raw = err?.message ?? "Error creando categoría";
        const text = Array.isArray(raw) ? raw.join(", ") : String(raw);
        setErrorMessage(text);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <FormField
        label="Nombre *"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <FormField
        label="Descripción"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        as="textarea"
        rows={3}
      />

      {/* Image Upload */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 mb-2">
          Imagen (opcional)
        </label>
        <div className="h-40 w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black/20 mb-2">
          {preview ? (
            <img src={preview} alt="Previsualización" className="h-full w-full object-cover" />
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

      <FormField
        label="Orden de despliegue"
        id="displayOrder"
        type="number"
        value={String(displayOrder)}
        onChange={(e) => setDisplayOrder(Number(e.target.value))}
        className="w-32"
      />

      <FormSubmitButton loading={mutation.isPending} text="Crear categoría" />

      {showToast && errorMessage && <FormError message={errorMessage} />}
    </form>
  );
}
