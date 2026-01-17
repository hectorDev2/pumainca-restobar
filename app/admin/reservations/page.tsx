"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import { useReservations, useReservationByCode, useUpdateReservationStatus, Reservation } from "@/lib/queries";

export default function AdminReservationsPage() {
  const [emailFilter, setEmailFilter] = useState("");
  const [codeFilter, setCodeFilter] = useState("");
  const [selected, setSelected] = useState<Reservation | null>(null);

  const { data: list, isLoading: loadingList } = useReservations(emailFilter || undefined);
  const { data: byCode, isLoading: loadingCode } = useReservationByCode(codeFilter || undefined);
  const updateMutation = useUpdateReservationStatus();

  const results = codeFilter ? (byCode ? [byCode] : []) : list ?? [];

  const getStatusColor = (status?: string) => {
    switch(status) {
      case 'completed': return 'text-green-500';
      case 'confirmed': return 'text-blue-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-white">
        <AdminHeader />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">Reservas (Admin)</h1>
            <p className="text-zinc-400">Buscar por código o por email para ver el historial.</p>
          </header>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm text-zinc-400 mb-1">Buscar por email</label>
              <div className="flex gap-2">
                <input value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} placeholder="juan@ejemplo.com" className="w-full bg-black/40 border border-zinc-700 rounded-xl px-3 py-2" />
                <button onClick={() => setCodeFilter("")} className="bg-primary px-4 py-2 rounded-xl">Filtrar</button>
              </div>
            </div>

            <div className="w-80">
              <label className="block text-sm text-zinc-400 mb-1">Buscar por código</label>
              <div className="flex gap-2">
                <input value={codeFilter} onChange={(e) => setCodeFilter(e.target.value)} placeholder="RES202601200001" className="w-full bg-black/40 border border-zinc-700 rounded-xl px-3 py-2" />
                <button onClick={() => setEmailFilter("")} className="bg-primary px-4 py-2 rounded-xl">Buscar</button>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <h2 className="text-lg font-semibold p-4 border-b border-zinc-800">Resultados</h2>

            {loadingList || loadingCode ? (
              <p className="p-4 text-zinc-400">Cargando...</p>
            ) : results.length === 0 ? (
              <p className="p-4 text-zinc-500">No se encontraron reservas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black/20">
                    <tr className="text-zinc-400 text-sm border-b border-zinc-800">
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
                      <tr key={r.reservation_code} className="border-b border-zinc-800 hover:bg-zinc-800/30">
                        <td className="p-3 align-middle font-mono text-sm text-zinc-400">{r.reservation_code}</td>
                        <td className="p-3 align-middle font-bold">{r.fullName}</td>
                        <td className="p-3 align-middle text-sm text-zinc-400">{r.email}</td>
                        <td className="p-3 align-middle">{r.reservationDate}</td>
                        <td className="p-3 align-middle">{r.reservationTime}</td>
                        <td className="p-3 align-middle text-center">{r.numberOfGuests}</td>
                        <td className="p-3 align-middle">
                           <select
                              className={`bg-transparent border-none font-bold text-sm focus:ring-0 cursor-pointer rounded px-2 py-1 ${getStatusColor(r.status)}`}
                              value={r.status ?? "pending"}
                              onChange={(e) => updateMutation.mutate({ code: r.reservation_code, status: e.target.value })}
                              disabled={updateMutation.isPending}
                            >
                              <option value="pending" className="text-black">Pendiente</option>
                              <option value="confirmed" className="text-black">Confirmado</option>
                              <option value="completed" className="text-black">Completado</option>
                              <option value="cancelled" className="text-black">Cancelado</option>
                            </select>
                        </td>
                        <td className="p-3 align-middle">
                          <button onClick={() => setSelected(r)} className="bg-zinc-800 hover:bg-zinc-700 transition-colors px-3 py-1 rounded-md text-sm">Ver</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selected && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-lg w-full shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">Reserva {selected.reservation_code}</h3>
                    <button onClick={() => setSelected(null)} className="text-zinc-400 hover:text-white">✕</button>
                </div>
                
                <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-zinc-500 text-xs uppercase font-bold">Cliente</p>
                            <p className="text-white font-medium">{selected.fullName}</p>
                            <p className="text-zinc-400 text-sm">{selected.email}</p>
                            <p className="text-zinc-400 text-sm">{selected.phoneNumber}</p>
                        </div>
                         <div>
                            <p className="text-zinc-500 text-xs uppercase font-bold">Detalles</p>
                            <p className="text-white">{selected.reservationDate} a las {selected.reservationTime}</p>
                            <p className="text-zinc-400 text-sm">{selected.numberOfGuests} personas</p>
                        </div>
                    </div>
                    
                    {selected.specialRequests && (
                        <div className="bg-amber-900/10 border border-amber-900/30 p-3 rounded-lg">
                            <p className="text-amber-500 text-xs uppercase font-bold mb-1">Solicitudes Especiales</p>
                            <p className="text-amber-200 text-sm italic">{selected.specialRequests}</p>
                        </div>
                    )}

                    <div>
                         <p className="text-zinc-500 text-xs uppercase font-bold mb-2">Estado de la Reserva</p>
                         <select
                              className={`w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-2 font-bold ${getStatusColor(selected.status)}`}
                              value={selected.status ?? "pending"}
                              onChange={(e) => updateMutation.mutate({ code: selected.reservation_code, status: e.target.value })}
                              disabled={updateMutation.isPending}
                            >
                              <option value="pending" className="text-black">Pendiente</option>
                              <option value="confirmed" className="text-black">Confirmado</option>
                              <option value="completed" className="text-black">Completado</option>
                              <option value="cancelled" className="text-black">Cancelado</option>
                            </select>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium">Cerrar</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
