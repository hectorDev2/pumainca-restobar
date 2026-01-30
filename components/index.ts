/**
 * Index de componentes
 * Re-exporta todos los componentes para mantener compatibilidad con imports antiguos
 * Nueva estructura recomendada en REFACTORING_GUIDE.md
 */

// PWA Components
export { default as InstallPWAPrompt } from "./InstallPWAPrompt";
export { default as PWARegister } from "./PWARegister";
export { default as ProtectedRoute } from "./ProtectedRoute";

// Re-export all subfolders
export * from "./layout";
export * from "./forms";
