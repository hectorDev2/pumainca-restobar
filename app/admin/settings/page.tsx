"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail(user?.email ?? "");
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const attributes: any = {};
      if (email !== user?.email) attributes.email = email;
      if (password) attributes.password = password;

      if (Object.keys(attributes).length === 0) {
        setMessage("No hay cambios para guardar.");
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser(attributes);

      if (error) throw error;
      
      setMessage("Ajustes actualizados. (Si cambiaste el email, verifica tu nueva dirección)");
      setPassword(""); // Clear password field
    } catch (err: any) {
      setMessage(err.message || "Error al actualizar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-white">
        <AdminHeader />

        <main className="max-w-4xl mx-auto px-4 py-8">
          <header>
            <h1 className="text-3xl font-black">Ajustes</h1>
            <p className="text-zinc-400">Configuración general del negocio</p>
          </header>

          <div className="mt-6 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-xs text-zinc-400 mb-2">
                  Email del administrador
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-700 rounded-xl px-3 py-2"
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-2">
                  Nueva contraseña (dejar en blanco para no cambiar)
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-700 rounded-xl px-3 py-2"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 px-4 py-2 rounded-xl font-bold disabled:opacity-50"
                >
                  {isLoading ? "Guardando..." : "Guardar"}
                </button>
                {message && (
                  <div className="text-sm text-amber-300">{message}</div>
                )}
              </div>
              <div className="text-sm text-zinc-400">
                Información actual: <strong>{user?.email ?? "—"}</strong> —
                Role: <strong>{user?.role ?? "—"}</strong>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
