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
              <p className="text-zinc-400">Cargando pedidos...</p>
            ) : isError ? (
              <p className="text-red-400">Error cargando pedidos</p>
            ) : !ordersResp ||
              !ordersResp.data ||
              ordersResp.data.length === 0 ? (
              <p className="text-zinc-400">No hay pedidos.</p>
            ) : (
              <div className="grid gap-4">
                {ordersResp.data.map((o: any) => (
                  <div
                    key={o.id ?? o.order_number}
                    className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold">#{o.order_number ?? o.id}</div>
                      <div className="text-sm text-zinc-400">
                        {o.customer_name ||
                          o.customer_email ||
                          "Cliente anónimo"}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {new Date(
                          o.created_at || o.createdAt || o.created
                        ).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-full bg-zinc-800 text-sm font-bold">
                        {o.payment_status ?? o.paymentStatus ?? "-"}
                      </div>
                      <div className="text-sm font-bold">
                        S/. {Number(o.total || o.amount || 0).toFixed(2)}
                      </div>

                      <select
                        className="bg-black/30 border border-zinc-800 rounded px-2 py-1 text-sm"
                        value={o.status ?? o.order_status ?? "pending"}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            orderId: o.id,
                            body: { status: e.target.value },
                          })
                        }
                        disabled={updateStatusMutation.isLoading}
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>

                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl text-sm"
                        onClick={() => {
                          if (!o.id) return;
                          if (!confirm("¿Cancelar pedido?")) return;
                          cancelMutation.mutate(o.id);
                        }}
                        disabled={cancelMutation.isLoading}
                      >
                        {cancelMutation.isLoading
                          ? "Procesando..."
                          : "Cancelar"}
                      </button>

                      <button
                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-xl text-sm"
                        onClick={() => setSelected(o)}
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {selected && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
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
                <pre className="text-sm text-zinc-300 bg-black/30 p-4 rounded">
                  {JSON.stringify(selected, null, 2)}
                </pre>
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
