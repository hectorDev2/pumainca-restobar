"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Página Offline Fallback
 *
 * Se muestra cuando el usuario intenta acceder a una página
 * que no está en caché mientras está sin conexión.
 *
 * Features:
 * - Detecta cuando vuelve la conexión
 * - Botón de reintentar
 * - Diseño amigable y claro
 */
export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Detectar cambio de estado de conexión
    const handleOnline = () => {
      setIsOnline(true);
      // Esperar 1 segundo y recargar
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Verificar estado inicial
    setIsOnline(navigator.onLine);

    // Escuchar eventos de conexión
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      alert("Aún no hay conexión a internet. Por favor, verifica tu conexión.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icono animado de WiFi desconectado */}
        <div className="mb-8 relative inline-block">
          <svg
            className="w-32 h-32 mx-auto text-zinc-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
            {/* Línea diagonal para indicar "sin conexión" */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3l18 18"
              className="text-red-500"
            />
          </svg>

          {isOnline && (
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              Conectando...
            </div>
          )}
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Sin Conexión a Internet
        </h1>

        {/* Descripción */}
        <p className="text-zinc-400 mb-8 leading-relaxed">
          No hay conexión a internet en este momento. Por favor, verifica tu
          conexión WiFi o datos móviles e intenta nuevamente.
        </p>

        {/* Estado de conexión */}
        <div className="mb-8 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-zinc-300">
              Estado: {isOnline ? "Conectando..." : "Desconectado"}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Reintentar Conexión
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 border border-zinc-700"
          >
            Ir a Inicio
          </button>
        </div>

        {/* Ayuda adicional */}
        <div className="mt-8 text-xs text-zinc-500">
          <p>
            💡 Tip: Algunas páginas que ya visitaste pueden estar disponibles
            sin conexión.
          </p>
        </div>
      </div>
    </div>
  );
}
