"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminHeader from "@/components/AdminHeader";
import {
  useOrders,
  useCancelOrder,
  useOrdersSummary,
  useUpdateOrderStatus,
} from "@/lib/queries";
import { Loader } from "@/components/ui/loader";

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [paymentFilter, setPaymentFilter] = useState<string | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    data: ordersResp,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useOrders({
    status: statusFilter,
    paymentStatus: paymentFilter,
    page,
    limit,
  });
  const cancelMutation = useCancelOrder();
  const updateStatusMutation = useUpdateOrderStatus();
  const { data: summary } = useOrdersSummary();
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-white">
        <AdminHeader />

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <header>
            <h1 className="text-3xl font-black">Pedidos</h1>
            <p className="text-zinc-400">Lista de pedidos recibidos</p>
          </header>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <select
                className="bg-black/40 border border-zinc-700 rounded px-3 py-2 text-sm"
                value={statusFilter ?? ""}
                onChange={(e) => {
                  setStatusFilter(e.target.value || undefined);
                  setPage(1);
                }}
              >
                <option value="">Todos estados</option>
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
              <select
                className="bg-black/40 border border-zinc-700 rounded px-3 py-2 text-sm"
                value={paymentFilter ?? ""}
                onChange={(e) => {
                  setPaymentFilter(e.target.value || undefined);
                  setPage(1);
                }}
              >
                <option value="">Todos pagos</option>
                <option value="pending">pending</option>
                <option value="completed">completed</option>
              </select>
              <div className="text-sm text-zinc-400 ml-auto">
                Total pedidos: {summary?.total ?? "-"}
              </div>
              <button
                onClick={() => refetch()}
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-sm"
              >
                {isFetching ? "Refrescando..." : "Refrescar"}
              </button>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader text="Cargando pedidos..." />
              </div>
            ) : isError ? (
              <p className="text-red-400">Error cargando pedidos</p>
            ) : !ordersResp ||
              !ordersResp.data ||
              ordersResp.data.length === 0 ? (
              <p className="text-zinc-400">No hay pedidos.</p>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-black/50 text-xs uppercase font-bold text-zinc-500">
                      <tr>
                        <th className="px-6 py-4"># Pedido</th>
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4">Estado Pago</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {ordersResp.data.map((o: any) => (
                        <tr
                          key={o.id ?? o.order_number}
                          className="hover:bg-zinc-800/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-white">
                            {o.order_number ?? o.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-white">
                              {o.customer_name ||
                                o.customer_email ||
                                "Cliente anónimo"}
                            </div>
                            <div className="text-xs">{o.customer_phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            {new Date(
                              o.created_at || o.createdAt || o.created
                            ).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                o.payment_status === "completed"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-yellow-500/10 text-yellow-500"
                              }`}
                            >
                              {o.payment_status === "completed" 
                                ? "Pagado" 
                                : o.payment_status === "pending" 
                                  ? "Pendiente" 
                                  : o.payment_status ?? "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-white">
                            S/. {Number(o.total || o.amount || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              className={`bg-transparent border-none font-bold text-sm focus:ring-0 cursor-pointer rounded px-2 py-1 ${
                                o.status === "completed"
                                  ? "text-green-500"
                                  : o.status === "cancelled"
                                  ? "text-red-500"
                                  : o.status === "confirmed"
                                  ? "text-blue-500"
                                  : "text-yellow-500"
                              }`}
                              value={o.status ?? o.order_status ?? "pending"}
                              onChange={(e) =>
                                updateStatusMutation.mutate({
                                  orderId: o.id,
                                  body: { status: e.target.value },
                                })
                              }
                              disabled={updateStatusMutation.isPending}
                            >
                              <option value="pending" className="text-black">
                                Pendiente
                              </option>
                              <option value="confirmed" className="text-black">
                                Confirmado
                              </option>
                              <option value="completed" className="text-black">
                                Completado
                              </option>
                              <option value="cancelled" className="text-black">
                                Cancelado
                              </option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              className="text-primary hover:text-white transition-colors"
                              onClick={() => setSelected(o)}
                              title="Ver detalles"
                            >
                              <span className="material-symbols-outlined">
                                visibility
                              </span>
                            </button>
                            <button
                              className="text-red-500 hover:text-red-400 transition-colors"
                              onClick={() => {
                                if (!o.id) return;
                                if (!confirm("¿Cancelar pedido?")) return;
                                cancelMutation.mutate(o.id);
                              }}
                              disabled={cancelMutation.isPending}
                              title="Cancelar pedido"
                            >
                              <span className="material-symbols-outlined">
                                cancel
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {selected && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80">
              <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-black">
                    Detalle Pedido #{selected.order_number ?? selected.id}
                  </h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-zinc-400 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-400">Cliente</p>
                      <p className="font-bold">{selected.customer_name ?? "—"}</p>
                      <p className="text-zinc-400">{selected.customer_email}</p>
                      <p className="text-zinc-400">{selected.customer_phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-400">Fecha</p>
                      <p className="font-bold">{new Date(selected.created_at).toLocaleString()}</p>
                      <p className="mt-2 text-zinc-400">Estado Pago</p>
                      <p className="font-bold capitalize">{selected.payment_status}</p>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-zinc-400">
                        <tr>
                          <th className="p-3">Producto</th>
                          <th className="p-3 text-center">Cant.</th>
                          <th className="p-3 text-right">Precio</th>
                          <th className="p-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {selected.items?.map((item: any) => (
                          <tr key={item.id}>
                            <td className="p-3">
                              <p className="font-bold">{item.product_name}</p>
                              {item.selected_size && <span className="text-xs text-zinc-400 mr-2">Tamaño: {item.selected_size}</span>}
                              {item.special_instructions && <div className="text-xs text-amber-500/80 italic mt-1">Note: {item.special_instructions}</div>}
                            </td>
                            <td className="p-3 text-center">{item.quantity}</td>
                            <td className="p-3 text-right">S/. {Number(item.unit_price).toFixed(2)}</td>
                            <td className="p-3 text-right font-bold text-primary">S/. {Number(item.subtotal).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-white/5 font-bold">
                        <tr>
                          <td colSpan={3} className="p-3 text-right text-zinc-400">Subtotal</td>
                          <td className="p-3 text-right">S/. {Number(selected.subtotal).toFixed(2)}</td>
                        </tr>
                         <tr>
                          <td colSpan={3} className="p-3 text-right text-zinc-400">IGV (18%)</td>
                          <td className="p-3 text-right">S/. {Number(selected.tax_amount).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="p-3 text-right text-zinc-400">Servicio</td>
                          <td className="p-3 text-right">S/. {Number(selected.service_fee).toFixed(2)}</td>
                        </tr>
                        <tr className="text-lg">
                          <td colSpan={3} className="p-3 text-right">Total</td>
                          <td className="p-3 text-right text-primary">S/. {Number(selected.total_amount).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {selected.special_instructions && (
                     <div className="bg-amber-900/20 border border-amber-900/50 p-3 rounded-xl text-amber-200 text-sm">
                        <span className="font-bold">Instrucciones del pedido:</span> {selected.special_instructions}
                     </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Pagination */}
          {ordersResp?.meta && (
            <div className="flex items-center gap-3 justify-center mt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-black/30 rounded"
              >
                Anterior
              </button>
              <div className="text-sm">
                {page} / {ordersResp.meta.pages}
              </div>
              <button
                disabled={page >= (ordersResp.meta.pages || 1)}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-black/30 rounded"
              >
                Siguiente
              </button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
