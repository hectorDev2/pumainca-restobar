"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import { useSettings, useUpdateSettings } from "@/lib/queries";
import { Loader } from "@/components/ui/loader";

export default function AdminContentPage() {
  const { data: content, isLoading: isContentLoading } = useSettings();
  const updateMutation = useUpdateSettings();
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",
    hero_background_image: "",
    history_label: "",
    history_title: "",
    history_description: "",
    history_image: "",
    footer_description: "",
    contact_address: "",
    contact_phone: "",
    philosophy_label: "",
    philosophy_title: "",
    philosophy_description: "",
    philosophy_image: "",
    philosophy_badge_1: "",
    philosophy_badge_2: "",
    cta_background_image: "",
  });

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (content) {
      setFormData({
        hero_title: content.hero_title || "",
        hero_subtitle: content.hero_subtitle || "",
        hero_description: content.hero_description || "",
        hero_background_image: content.hero_background_image || "",
        history_label: content.history_label || "",
        history_title: content.history_title || "",
        history_description: content.history_description || "",
        history_image: content.history_image || "",
        footer_description: content.footer_description || "",
        contact_address: content.contact_address || "",
        contact_phone: content.contact_phone || "",
        philosophy_label: content.philosophy_label || "",
        philosophy_title: content.philosophy_title || "",
        philosophy_description: content.philosophy_description || "",
        philosophy_image: content.philosophy_image || "",
        philosophy_badge_1: content.philosophy_badge_1 || "",
        philosophy_badge_2: content.philosophy_badge_2 || "",
        cta_background_image: content.cta_background_image || "",
      });
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField(field);
      
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "site-content");
      uploadData.append("fileName", field);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      
      setFormData((prev) => ({ ...prev, [field]: url }));
      setMessage(`Imagen para ${field} subida correctamente.`);
    } catch (err) {
      console.error(err);
      setMessage("Error al subir imagen.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    updateMutation.mutate(formData, {
      onSuccess: () => {
        setMessage("Contenido actualizado correctamente.");
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMessage(null);
        }, 3000);
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
              <div className="flex justify-center py-20">
                <Loader text="Cargando configuración..." />
              </div>
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

                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Imagen de Fondo (Hero)</label>
                    <div className="flex gap-4 items-start">
                        <img 
                            src={formData.hero_background_image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuATXk6MPNKGx57CMdde5-DdiTX5gT1k4FcksnnlebD-cSsZFtfTZkEOgg_qGAjRMBkKnN4lRmk49DGt_CkCnIJFhxgb4ErT87gcJieqE--4p4lwbdOPE_2u4PSiak7lkRXM5tG1-Rg1GaX7rKU8PVe4hgi63r5GhAuwJt4_rxs6JEmmq-BxmIeVKzoWkYRiXEjFcbdZPwWSsXPmoMFDY0TmAY9VuYan0app-qcECaPVlAWW08ArAi-n6B_nzpEYj3gAopAgZ-06bNJZ'} 
                            alt="Hero" 
                            className="w-24 h-16 object-cover rounded-md border border-zinc-700" 
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "hero_background_image")}
                            disabled={uploadingField === "hero_background_image"}
                            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                        />
                        {uploadingField === "hero_background_image" && <span className="text-sm text-primary animate-pulse">Subiendo...</span>}
                    </div>
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

                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Imagen Historia</label>
                    <div className="flex gap-4 items-start">
                        <img 
                            src={formData.history_image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3GvdLR0O-ER0B-sxxrf96gAi13pxiiPGAtbv6w6VjPTONsilcTJTXM78DO_lmjKg7DB2uL8HHKbhHMXs-vS6khXEBXFZ2AdZ63PshtY8fBfYqUWM_PD7796N1gmnUPVOL5sdQEfprp531eehNJU17kRuf301TwQNYLclmxY8vQrGN5nTXTTwQj6gCO8eKEssD20UixEwt8kXFlD1lZZ95mNKWGIxOWnSLyIg_5ftjpfp7BzA4dXGWK9htHIfpI7c5HYmWwhpTuvaP'} 
                            alt="History" 
                            className="w-24 h-16 object-cover rounded-md border border-zinc-700" 
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "history_image")}
                            disabled={uploadingField === "history_image"}
                            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                        />
                         {uploadingField === "history_image" && <span className="text-sm text-primary animate-pulse">Subiendo...</span>}
                    </div>
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

                  <div>
                    <label className="block text-xs text-zinc-400 mb-2">Imagen Filosofía</label>
                    <div className="flex gap-4 items-start">
                        <img 
                            src={formData.philosophy_image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDztdE740-TFm6yhUQ3PH1VV9KdanoNC0UmkJ0eIXv7otH1TSK87gsmbwOi2O_sVT05IwslnbE2Uw9bvlyisgCYBW1f3Hgn4Y-ADGT_SVbtQ-3jx6Xa03nzU2QEFZsdT5YpS7nMK9IiyI1NIfLVRyHxcbOrzPyyZGmgtQVf8x4r8CaBFoVZ2nb10uopliC5R8vqEE4-q8bNq2YeKGEa_O0C1db7Yn8TQUYrou8LdZ3xtdmihkOcf9gujQkTXdWCsnVX7zUI9u7FFYiZ'} 
                            alt="Philosophy" 
                            className="w-24 h-16 object-cover rounded-md border border-zinc-700" 
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "philosophy_image")}
                            disabled={uploadingField === "philosophy_image"}
                            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                        />
                         {uploadingField === "philosophy_image" && <span className="text-sm text-primary animate-pulse">Subiendo...</span>}
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <h3 className="text-xl font-bold text-primary">Sección Llamada a la Acción (CTA)</h3>
                   <div>
                    <label className="block text-xs text-zinc-400 mb-2">Imagen de Fondo (CTA)</label>
                    <div className="flex gap-4 items-start">
                        <img 
                            src={formData.cta_background_image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfxQRQI_nY_alVkqrgyxhTercMQFH1L_JrrMiE_17KFcyOYzXgs6Hew6Jt_xIO71kyJTwmIH6nyayvR6bayj9QTk-dyQEX3lA3e2MvbQaenoeAlZ6sq9S3vUoZBWJkOIquC4jvCTRMERmgtYbjtyN4Q1wRazaeTZhvooOAk7aQ8C5MIGS0yALbovg16DglqAL6lbYMIuS45PoTT8zU5Xxj1CqNCBuKSpZfqQm6gGtG7-6ETDKmueADaq4vO7TSOt5t9uWGiipSJjw1'} 
                            alt="CTA" 
                            className="w-24 h-16 object-cover rounded-md border border-zinc-700" 
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "cta_background_image")}
                            disabled={uploadingField === "cta_background_image"}
                            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                        />
                         {uploadingField === "cta_background_image" && <span className="text-sm text-primary animate-pulse">Subiendo...</span>}
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
