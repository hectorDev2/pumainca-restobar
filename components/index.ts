/**
 * Index de componentes
 * Re-exporta componentes para mantener compatibilidad con imports antiguos
 * Nueva estructura recomendada en REFACTORING_GUIDE.md
 */

// Layout
export { default as Navbar } from './layout/Navbar'
export { default as Footer } from './layout/Footer'
export { default as Sidebar } from './layout/Sidebar'
export { default as AdminHeader } from './layout/AdminHeader'

// Forms (nueva ubicación)
export { default as CreateCategoryForm } from './forms/CreateCategoryForm'
export { default as FormField } from './forms/FormField'
export { default as FormSubmitButton } from './forms/FormSubmitButton'
export { default as FormError } from './forms/FormError'

// PWA
export { default as InstallPWAPrompt } from './InstallPWAPrompt'
export { default as PWARegister } from './PWARegister'
export { default as ProtectedRoute } from './ProtectedRoute'

// Re-export subfolderes
export * from './layout'
export * from './forms'
export * from './ui'
export * from './home'
