"use client";

import { useEffect } from "react";

/**
 * PWA Service Worker Registration
 * 
 * Este componente registra el service worker para habilitar PWA
 * Solo se ejecuta en producción y en el navegador (client-side)
 */
export default function PWARegister() {
  useEffect(() => {
    // Solo registrar en producción y si el navegador soporta service workers
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      window.addEventListener("load", () => {
        registerServiceWorker();
      });
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("✅ Service Worker registered successfully:", registration.scope);

      // Escuchar actualizaciones del service worker
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Hay una nueva versión disponible
              console.log("🔄 Nueva versión de la PWA disponible");
              
              // Opcionalmente mostrar notificación al usuario
              if (confirm("Hay una nueva versión disponible. ¿Deseas actualizar?")) {
                newWorker.postMessage({ type: "SKIP_WAITING" });
                window.location.reload();
              }
            }
          });
        }
      });

      // Verificar actualizaciones cada hora
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // 1 hora

    } catch (error) {
      console.error("❌ Service Worker registration failed:", error);
    }
  };

  // Este componente no renderiza nada
  return null;
}
