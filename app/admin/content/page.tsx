"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import { useSiteContent, useUpdateSiteContent } from "@/lib/queries";


export default function AdminContentPage() {
  const { data: content, isLoading: isContentLoading } = useSiteContent();
  const updateMutation = useUpdateSiteContent();
  
  const [formData, setFormData] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",
    history_label: "",
    history_title: "",
    history_description: "",
    footer_description: "",
    contact_address: "",
    contact_phone: "",
    philosophy_label: "",
    philosophy_title: "",
    philosophy_description: "",
    philosophy_badge_1: "",
    philosophy_badge_2: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (content) {
      setFormData({
        hero_title: content.hero_title || "",
        hero_subtitle: content.hero_subtitle || "",
        hero_description: content.hero_description || "",
        history_label: content.history_label || "",
        history_title: content.history_title || "",
        history_description: content.history_description || "",
        footer_description: content.footer_description || "",
        contact_address: content.contact_address || "",
        contact_phone: content.contact_phone || "",
        philosophy_label: content.philosophy_label || "",
        philosophy_title: content.philosophy_title || "",
        philosophy_description: content.philosophy_description || "",
        philosophy_badge_1: content.philosophy_badge_1 || "",
        philosophy_badge_2: content.philosophy_badge_2 || "",
      });
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    updateMutation.mutate(formData, {
      onSuccess: () => {
        setMessage("Contenido actualizado correctamente.");
      },
      onError: (err) => {
        setMessage("Error al actualizar: " + err.message);
      },
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-white">
        <AdminHeader />

        <main className="max-w-4xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-black">Gestión de Contenido</h1>
            <p className="text-zinc-400">Edita los textos principales de la página web.</p>
          </header>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
            {isContentLoading ? (
              <div className="py-8 text-center text-zinc-400">Cargando contenido...</div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Hero Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-primary">Sección Principal (Hero)</h3>
                  
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Título Principal (Línea 1)</label>
                    <input
                      name="hero_title"
                      value={formData.hero_title}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                      type="text"
                      placeholder="Ej: Sabores Auténticos,"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Subtítulo (Línea 2 - Color)</label>
                    <input
                      name="hero_subtitle"
                      value={formData.hero_subtitle}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                      type="text"
                      placeholder="Ej: Experiencia Inolvidable."
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Descripción</label>
                    <textarea
                      name="hero_description"
                      value={formData.hero_description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Descripción breve..."
                    />
                  </div>
                </div>

                {/* History Section */}
                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <h3 className="text-xl font-bold text-primary">Sección Historia</h3>
                  
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Etiqueta (Label)</label>
                    <input
                      name="history_label"
                      value={formData.history_label}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                      type="text"
                      placeholder="Ej: Orígenes"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Título de Historia</label>
                    <input
                      name="history_title"
                      value={formData.history_title}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                      type="text"
                      placeholder="Ej: Raíces profundas en los Andes"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Descripción de Historia</label>
                    <textarea
                      name="history_description"
                      value={formData.history_description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Descripción de la historia..."
                    />
                  </div>
                </div>

                {/* Philosophy Section */}
                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <h3 className="text-xl font-bold text-primary">Sección Filosofía</h3>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Etiqueta (Label)</label>
                    <input
                      name="philosophy_label"
                      value={formData.philosophy_label}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                      type="text"
                      placeholder="Ej: Filosofía"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Título</label>
                    <input
                      name="philosophy_title"
                      value={formData.philosophy_title}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                      type="text"
                      placeholder="Ej: Respeto por el ingrediente"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Descripción</label>
                    <textarea
                      name="philosophy_description"
                      value={formData.philosophy_description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Descripción de la filosofía..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-2">Badge 1 (Texto)</label>
                      <input
                        name="philosophy_badge_1"
                        value={formData.philosophy_badge_1}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                        type="text"
                        placeholder="Ej: 100% Orgánico"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-2">Badge 2 (Texto)</label>
                      <input
                        name="philosophy_badge_2"
                        value={formData.philosophy_badge_2}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                        type="text"
                        placeholder="Ej: Comercio Justo"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <h3 className="text-xl font-bold text-primary">Pie de Página (Footer)</h3>
                  
                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Descripción del Footer</label>
                    <textarea
                      name="footer_description"
                      value={formData.footer_description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Texto breve del footer..."
                    />
                  </div>


                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Dirección</label>
                    <input
                      name="contact_address"
                      value={formData.contact_address}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                      type="text"
                      placeholder="Ej: Av. La Mar 1234, Miraflores"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Teléfono</label>
                    <input
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                      type="text"
                      placeholder="Ej: +51 1 555-0199"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
                  >
                    {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                  </button>
                  
                  {message && (
                    <span className={`text-sm font-medium ${message.includes("Error") ? "text-red-400" : "text-green-400"}`}>
                      {message}
                    </span>
                  )}
                </div>

              </form>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
