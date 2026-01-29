"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import {
  useReservations,
  useReservationByCode,
  Reservation,
} from "@/lib/queries";

export default function AdminReservationsPage() {
  const [emailFilter, setEmailFilter] = useState("");
  const [codeFilter, setCodeFilter] = useState("");
  const [selected, setSelected] = useState<Reservation | null>(null);

  const { data: list, isLoading: loadingList } = useReservations(
    emailFilter || undefined,
  );
  const { data: byCode, isLoading: loadingCode } = useReservationByCode(
    codeFilter || undefined,
  );

  const results = codeFilter ? (byCode ? [byCode] : []) : (list ?? []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-white">
        <AdminHeader />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">Reservas (Admin)</h1>
            <p className="text-zinc-400">
              Buscar por código o por email para ver el historial.
            </p>
          </header>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm text-zinc-400 mb-1">
                Buscar por email
              </label>
              <div className="flex gap-2">
                <input
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                  placeholder="juan@ejemplo.com"
                  className="w-full bg-black/40 border border-zinc-700 rounded-xl px-3 py-2"
                />
                <button
                  onClick={() => setCodeFilter("")}
                  className="bg-primary px-4 py-2 rounded-xl"
                >
                  Filtrar
                </button>
              </div>
            </div>

            <div className="w-80">
              <label className="block text-sm text-zinc-400 mb-1">
                Buscar por código
              </label>
              <div className="flex gap-2">
                <input
                  value={codeFilter}
                  onChange={(e) => setCodeFilter(e.target.value)}
                  placeholder="RES202601200001"
                  className="w-full bg-black/40 border border-zinc-700 rounded-xl px-3 py-2"
                />
                <button
                  onClick={() => setEmailFilter("")}
                  className="bg-primary px-4 py-2 rounded-xl"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <h2 className="text-lg font-semibold mb-4">Resultados</h2>

            {loadingList || loadingCode ? (
              <p className="text-zinc-400">Cargando...</p>
            ) : results.length === 0 ? (
              <p className="text-zinc-500">No se encontraron reservas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-zinc-400 text-sm">
                      <th className="p-3">Código</th>
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Hora</th>
                      <th className="p-3">Personas</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr
                        key={r.reservation_code}
                        className="border-t border-zinc-800"
                      >
                        <td className="p-3 align-top">{r.reservation_code}</td>
                        <td className="p-3 align-top">{r.fullName}</td>
                        <td className="p-3 align-top">{r.email}</td>
                        <td className="p-3 align-top">{r.reservationDate}</td>
                        <td className="p-3 align-top">{r.reservationTime}</td>
                        <td className="p-3 align-top">{r.numberOfGuests}</td>
                        <td className="p-3 align-top">{r.status ?? "—"}</td>
                        <td className="p-3 align-top">
                          <button
                            onClick={() => setSelected(r)}
                            className="bg-white/5 px-3 py-1 rounded-md"
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selected && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-zinc-900 p-6 rounded-2xl max-w-lg w-full">
                <h3 className="text-xl font-bold mb-2">
                  Reserva {selected.reservation_code}
                </h3>
                <p className="text-zinc-400 mb-1">
                  Nombre:{" "}
                  <strong className="text-white">{selected.fullName}</strong>
                </p>
                <p className="text-zinc-400 mb-1">
                  Email:{" "}
                  <strong className="text-white">{selected.email}</strong>
                </p>
                <p className="text-zinc-400 mb-1">
                  Teléfono:{" "}
                  <strong className="text-white">{selected.phoneNumber}</strong>
                </p>
                <p className="text-zinc-400 mb-1">
                  Fecha:{" "}
                  <strong className="text-white">
                    {selected.reservationDate}
                  </strong>
                </p>
                <p className="text-zinc-400 mb-1">
                  Hora:{" "}
                  <strong className="text-white">
                    {selected.reservationTime}
                  </strong>
                </p>
                <p className="text-zinc-400 mb-1">
                  Personas:{" "}
                  <strong className="text-white">
                    {selected.numberOfGuests}
                  </strong>
                </p>
                {selected.specialRequests && (
                  <p className="text-zinc-400 mb-1">
                    Solicitudes:{" "}
                    <strong className="text-white">
                      {selected.specialRequests}
                    </strong>
                  </p>
                )}
                <p className="text-zinc-400 mb-4">
                  Status:{" "}
                  <strong className="text-white">
                    {selected.status ?? "—"}
                  </strong>
                </p>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 rounded-xl bg-white/5"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
