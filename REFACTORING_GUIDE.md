# Guía de Refactorización Modular

## 📋 Resumen de Cambios

Se ha realizado una refactorización completa del código con el principio de **responsabilidad única**. Cada componente, hook y utilidad ahora tiene una sola responsabilidad clara.

## 🗂️ Nueva Estructura

```
project/
├── types/                    # 🆕 Tipos segregados por dominio
│   ├── index.ts
│   ├── domain.ts            # Entidades core (Producto, Categoría, Pedido, etc)
│   ├── api.ts               # Payloads y respuestas de API
│   ├── ui.ts                # Tipos de UI (Toast, Modal, Theme, etc)
│   └── common.ts            # Tipos compartidos (User, Settings, etc)
│
├── hooks/                    # 🆕 Custom hooks segregados
│   ├── index.ts
│   ├── useDebounce.ts       # Debounce genérico
│   ├── useClickOutside.ts   # Detectar clicks fuera
│   ├── useNavbarSearch.ts   # Lógica específica de búsqueda
│   ├── useToast.ts          # Gestión de notificaciones
│   └── useFormValidation.ts # Validación de formularios
│
├── constants/               # 🆕 Constantes y datos estáticos
│   ├── index.ts
│   ├── categories.ts        # Constantes de categorías
│   ├── routes.ts            # Rutas de la app
│   ├── validation.ts        # Patrones de validación
│   └── ui.ts                # Constantes de UI
│
├── lib/
│   ├── utils/               # 🆕 Utilidades reorganizadas
│   │   ├── index.ts
│   │   ├── classname.ts     # cn() - merge de clases
│   │   ├── formatters.ts    # formatPrice, formatDate, etc
│   │   ├── validators.ts    # validateEmail, validateForm, etc
│   │   └── performance.ts   # debounce, throttle, memoize
│   ├── api.ts
│   ├── imagekit.ts
│   ├── queries.ts
│   ├── supabase.ts
│   └── Providers.tsx
│
├── components/
│   ├── layout/              # 🆕 Componentes de layout
│   │   ├── index.ts
│   │   ├── Navbar.tsx       # Navbar principal
│   │   ├── NavbarSearch.tsx # 🆕 Búsqueda navbar (responsabilidad única)
│   │   ├── NavbarMenu.tsx   # 🆕 Menú navbar (responsabilidad única)
│   │   ├── MobileMenu.tsx   # 🆕 Menú mobile (responsabilidad única)
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── AdminHeader.tsx
│   │
│   ├── forms/               # 🆕 Componentes de formulario
│   │   ├── index.ts
│   │   ├── CreateCategoryForm.tsx
│   │   ├── FormField.tsx    # 🆕 Campo genérico
│   │   ├── FormSubmitButton.tsx # 🆕 Botón submit
│   │   └── FormError.tsx    # 🆕 Componente de error
│   │
│   ├── ui/                  # Componentes UI base
│   ├── home/                # Componentes de home
│   ├── AdminHeader.tsx      # 🗑️ Movido a layout/
│   ├── CreateCategoryForm.tsx # 🗑️ Movido a forms/
│   ├── Footer.tsx           # 🗑️ Movido a layout/
│   ├── Navbar.tsx           # 🗑️ Movido a layout/
│   ├── Sidebar.tsx          # 🗑️ Movido a layout/
│   ├── InstallPWAPrompt.tsx
│   ├── PWARegister.tsx
│   └── ProtectedRoute.tsx
```

## 🎯 Principios Aplicados

### 1. **Single Responsibility Principle (SRP)**
Cada componente tiene una única responsabilidad:

```typescript
// ❌ ANTES: Navbar manejaba búsqueda, menú, y más
const Navbar = () => {
  // 100+ líneas de búsqueda, debounce, dropdown, menú...
}

// ✅ DESPUÉS: Navbar orquesta subcomponentes
const Navbar = () => {
  return (
    <>
      <NavbarMenu />
      <NavbarSearch />
      <MobileMenu />
    </>
  )
}
```

### 2. **Separation of Concerns**
- **Tipos** en carpeta `types/` segregados por dominio
- **Constantes** en carpeta `constants/`
- **Hooks** en carpeta `hooks/`
- **Utilidades** en `lib/utils/`
- **Componentes** organizados por dominio

### 3. **Reusability**
Componentes genéricos y reutilizables:

```typescript
// FormField es genérico
<FormField label="Email" id="email" type="email" />
<FormField label="Descripción" id="desc" as="textarea" />

// useDebounce es reutilizable
const debouncedValue = useDebounce(value, 300);
```

### 4. **Testability**
Componentes pequeños son más fáciles de testear:

```typescript
// Fácil de testear
<FormField label="Name" />
<FormSubmitButton loading={false} text="Enviar" />

// Vs componentes monolíticos
<ComplexForm />
```

## 📦 Estructura de Tipos (types/)

```typescript
// types/domain.ts - Entidades del negocio
export interface Product { ... }
export interface Order { ... }
export interface Category { ... }

// types/api.ts - Comunicación
export interface OrderPayload { ... }
export interface ApiResponse<T> { ... }

// types/ui.ts - UI
export type Theme = 'light' | 'dark';
export interface ToastMessage { ... }

// types/common.ts - Compartidos
export interface User { ... }
export type Optional<T> = T | undefined;
```

## 🎣 Custom Hooks (hooks/)

Cada hook tiene una responsabilidad única:

```typescript
// useDebounce - Debounce genérico
const debouncedValue = useDebounce(value, 300);

// useClickOutside - Detectar clicks fuera
const ref = useClickOutside(() => setOpen(false));

// useNavbarSearch - Búsqueda específica navbar
const { searchTerm, searchResults, isLoading } = useNavbarSearch();

// useToast - Notificaciones
const { addToast } = useToast();

// useFormValidation - Validación de formularios
const { values, errors, handleSubmit } = useFormValidation(...)
```

## ⚙️ Utilidades (lib/utils/)

```typescript
// classname.ts
export function cn(...inputs: ClassValue[]) { ... }

// formatters.ts
export function formatPrice(price: number) { ... }
export function formatDate(date: Date) { ... }
export function calculateTax(amount: number) { ... }

// validators.ts
export function validateEmail(email: string) { ... }
export function validateForm(values, rules) { ... }

// performance.ts
export function debounce(func, delay) { ... }
export function throttle(func, limit) { ... }
export function memoize(func) { ... }
```

## 🔀 Migrando Imports

### Antes:
```typescript
import { Navbar, Footer, Sidebar } from '@/components'
import { formatPrice } from '@/lib/utils'
import { Category, Product } from '@/types'
```

### Después (manteniendo compatibilidad):
```typescript
// Layout
import { Navbar, Footer, Sidebar, AdminHeader } from '@/components/layout'
import { NavbarSearch, NavbarMenu } from '@/components/layout'

// Forms
import { CreateCategoryForm, FormField } from '@/components/forms'

// Types (segregados por dominio)
import type { Product, Category } from '@/types/domain'
import type { OrderPayload } from '@/types/api'

// Hooks
import { useDebounce, useNavbarSearch } from '@/hooks'

// Utils
import { cn, formatPrice, validateEmail } from '@/lib/utils'

// Constants
import { PRODUCT_CATEGORIES, ROUTES } from '@/constants'
```

## 🔧 Actualizar Imports en Archivos Existentes

### Paso 1: Layout Components
```bash
# Archivos que usan Navbar, Footer, etc
# Cambiar de: import { Navbar } from '@/components'
# A: import { Navbar } from '@/components/layout'
```

### Paso 2: Types
```bash
# Cambiar de: import type { Product } from '@/types'
# A: import type { Product } from '@/types/domain'
```

### Paso 3: Utilidades
```bash
# Cambiar de: import { cn, formatPrice } from '@/lib/utils'
# A: import { cn, formatPrice } from '@/lib/utils'
# (ya está configurado para redirigir correctamente)
```

## 📝 Ejemplos de Uso

### Crear un nuevo formulario modal
```typescript
import { FormField, FormSubmitButton } from '@/components/forms'
import { useFormValidation } from '@/hooks'

export function NewProductForm() {
  const { values, errors, handleSubmit } = useFormValidation(
    { name: '', price: 0 },
    async (values) => {
      await createProduct(values)
    }
  )

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Nombre" error={errors.name} {...} />
      <FormField label="Precio" type="number" {...} />
      <FormSubmitButton text="Crear" />
    </form>
  )
}
```

### Usar hooks en componentes
```typescript
import { useDebounce, useClickOutside } from '@/hooks'

export function Search() {
  const [term, setTerm] = useState('')
  const debouncedTerm = useDebounce(term, 300)
  const ref = useClickOutside(() => setOpen(false))

  return <input ref={ref} value={term} onChange={(e) => setTerm(e.target.value)} />
}
```

## ✅ Checklist de Migración

- [ ] Actualizar imports de componentes layout
- [ ] Actualizar imports de tipos
- [ ] Reemplazar `CreateCategoryForm` en archivos admin
- [ ] Usar `FormField` en nuevos formularios
- [ ] Reemplazar constantes hardcodeadas por `constants/`
- [ ] Usar hooks de `hooks/` en lugar de lógica inline
- [ ] Actualizar tests si existen
- [ ] Verificar que la app funciona después de cambios

## 🚀 Próximos Pasos

1. Migrar resto de componentes a estructura modular
2. Crear más componentes granulares en `components/`
3. Extraer lógica de modales a componentes
4. Crear carpeta `components/product/` para componentes de productos
5. Crear carpeta `components/orders/` para componentes de pedidos
6. Agregar tests unitarios para cada componente/hook

## 📚 Referencias

- Single Responsibility Principle: https://en.wikipedia.org/wiki/Single-responsibility_principle
- Component Composition: https://react.dev/learn/passing-props-to-a-component
- Custom Hooks: https://react.dev/learn/reusing-logic-with-custom-hooks
