"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Componente InstallPWAPrompt
 * 
 * Muestra un banner invitando al usuario a instalar la PWA
 * Solo se muestra si:
 * - El navegador soporta PWA (evento beforeinstallprompt)
 * - El usuario no ha instalado la app
 * - El usuario no ha rechazado la instalación previamente
 * 
 * Se puede configurar para aparecer:
 * - Inmediatamente
 * - Después de X segundos
 * - Después de X visitas
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Verificar si ya instaló o rechazó previamente
    const userDismissed = localStorage.getItem("pwa-prompt-dismissed");
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;

    if (userDismissed || isInstalled) {
      return;
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Mostrar el prompt después de 5 segundos (para no ser intrusivo)
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detectar si la app fue instalada
    window.addEventListener("appinstalled", () => {
      console.log("✅ PWA instalada exitosamente");
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem("pwa-installed", "true");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Mostrar el prompt nativo de instalación
    deferredPrompt.prompt();

    // Esperar la decisión del usuario
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("✅ Usuario aceptó instalar la PWA");
    } else {
      console.log("❌ Usuario rechazó instalar la PWA");
    }

    // Limpiar el prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", "true");
    
    // Opcional: Volver a mostrar después de 7 días
    const dismissedDate = new Date().getTime();
    localStorage.setItem("pwa-prompt-dismissed-date", dismissedDate.toString());
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Barra superior decorativa */}
            <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

            <div className="p-5">
              {/* Header con icono */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-lg mb-1">
                    Instalar Pumainca App
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Accede más rápido con nuestra app. Funciona offline y se
                    siente como una app nativa.
                  </p>
                </div>

                {/* Botón cerrar */}
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label="Cerrar"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-zinc-800">
                <div className="text-center">
                  <div className="text-lg mb-1">⚡</div>
                  <div className="text-xs text-zinc-400">Más rápida</div>
                </div>
                <div className="text-center">
                  <div className="text-lg mb-1">🔌</div>
                  <div className="text-xs text-zinc-400">Offline</div>
                </div>
                <div className="text-center">
                  <div className="text-lg mb-1">🏠</div>
                  <div className="text-xs text-zinc-400">Pantalla inicio</div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3">
                <button
                  onClick={handleDismiss}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-sm transition-colors"
                >
                  Ahora no
                </button>
                <button
                  onClick={handleInstall}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium text-sm transition-all shadow-lg shadow-amber-500/20"
                >
                  Instalar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
