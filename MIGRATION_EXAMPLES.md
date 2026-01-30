# 🔧 Ejemplos de Migración - Antes vs Después

Guía práctica con ejemplos reales de cómo migrar código a la nueva estructura modular.

## 1️⃣ Ejemplo: Actualizar Imports de Componentes

### ❌ ANTES
```typescript
// app/layout.tsx
import { Navbar, Footer, Sidebar, AdminHeader } from '@/components'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

### ✅ DESPUÉS
```typescript
// app/layout.tsx
import { Navbar, Footer } from '@/components/layout'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

## 2️⃣ Ejemplo: Usar Tipos Segregados

### ❌ ANTES
```typescript
// app/menu/page.tsx
import type { Product } from '@/types'

const MenuPage = async () => {
  const products: Product[] = await fetchProducts()
  // ...
}
```

### ✅ DESPUÉS
```typescript
// app/menu/page.tsx
import type { Product } from '@/types/domain'
import type { PaginatedResponse } from '@/types/api'

const MenuPage = async () => {
  const response: PaginatedResponse<Product> = await fetchProducts()
  // Tipos mejor segregados y claros
}
```

## 3️⃣ Ejemplo: Usar Constantes Centralizadas

### ❌ ANTES
```typescript
// components/Sidebar.tsx
const categories = [
  { id: 'todo', name: 'Todo el Menú', icon: 'restaurant' },
  { id: 'platos-principales', name: 'Platos Principales', icon: 'dinner_dining' },
  // ... más repetidas en otros archivos
]

const adminLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/categories', label: 'Categorías' },
  // ... repetidas en AdminHeader.tsx también
]
```

### ✅ DESPUÉS
```typescript
// components/layout/Sidebar.tsx
import { PRODUCT_CATEGORIES } from '@/constants/categories'
import { ADMIN_NAV_ITEMS } from '@/constants/routes'

const allCategories = [
  { id: 'todo', name: 'Todo el Menú', icon: 'restaurant' },
  ...PRODUCT_CATEGORIES,
]
```

## 4️⃣ Ejemplo: Usar Custom Hooks

### ❌ ANTES
```typescript
// components/Navbar.tsx
const [searchTerm, setSearchTerm] = useState("")
const [debouncedTerm, setDebouncedTerm] = useState("")

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTerm(searchTerm)
  }, 300)
  return () => clearTimeout(timer)
}, [searchTerm])

// Más código de búsqueda...
```

### ✅ DESPUÉS
```typescript
// components/layout/NavbarSearch.tsx
import { useNavbarSearch } from '@/hooks'

const NavbarSearch = () => {
  const { searchTerm, setSearchTerm, searchResults, isLoading } = useNavbarSearch()
  
  // Mucho más limpio, toda la lógica está en el hook
}
```

## 5️⃣ Ejemplo: Usar Utilidades

### ❌ ANTES
```typescript
// Formulario de categoría
const mutation = useCreateCategory()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!name.trim()) return alert("El nombre es obligatorio")
  
  // Manejo de errores repetido
  mutation.mutate(fd, {
    onError: (err: any) => {
      const raw = err?.message ?? "Error creando categoría"
      const text = Array.isArray(raw) ? raw.join(", ") : String(raw)
      setErrorMessage(text)
    },
  })
}
```

### ✅ DESPUÉS
```typescript
// components/forms/CreateCategoryForm.tsx
import { useFormValidation, validateRequired } from '@/hooks'
import { validateForm } from '@/lib/utils/validators'
import { FormField, FormSubmitButton } from '@/components/forms'

const CreateCategoryForm = () => {
  const { values, errors, handleSubmit } = useFormValidation(
    { name: '', description: '' },
    async (values) => {
      await createCategory(values)
    },
    (values) => validateForm(values, {
      name: { required: true, minLength: 3 }
    })
  )

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Nombre" error={errors.name} {...} />
      <FormSubmitButton loading={isPending} />
    </form>
  )
}
```

## 6️⃣ Ejemplo: Crear Formulario Reutilizable

### ❌ ANTES
```typescript
// admin/categories/page.tsx - Todo mezclado
export default function CategoriesPage() {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [showToast, setShowToast] = useState(false)
  
  const handleSubmit = async (e) => {
    // lógica de creación
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-black/40 border..."
      />
      <button>Crear</button>
      {showToast && <div className="...">Error</div>}
    </form>
  )
}
```

### ✅ DESPUÉS
```typescript
// components/forms/ProductForm.tsx
import { FormField, FormSubmitButton } from '@/components/forms'
import { useFormValidation } from '@/hooks'

export function ProductForm() {
  const { values, errors, handleSubmit } = useFormValidation(
    { name: '', price: 0 },
    async (v) => createProduct(v)
  )

  return (
    <form onSubmit={handleSubmit}>
      <FormField 
        label="Nombre" 
        id="name" 
        error={errors.name}
        value={values.name}
      />
      <FormField 
        label="Precio" 
        id="price" 
        type="number"
        value={values.price}
      />
      <FormSubmitButton text="Crear" />
    </form>
  )
}

// admin/products/page.tsx
import { ProductForm } from '@/components/forms'

export default function ProductsPage() {
  return <ProductForm />
}
```

## 7️⃣ Ejemplo: Validación de Formularios

### ❌ ANTES
```typescript
// Validación manual repetida
const handleSubmit = (e) => {
  e.preventDefault()
  
  if (!email || !email.includes('@')) {
    setError("Email inválido")
    return
  }
  
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
  if (!phoneRegex.test(phone)) {
    setError("Teléfono inválido")
    return
  }
  
  // submit...
}
```

### ✅ DESPUÉS
```typescript
// components/reservation/ReservationForm.tsx
import { useFormValidation } from '@/hooks'
import { validateForm } from '@/lib/utils/validators'
import { VALIDATION } from '@/constants/validation'

export function ReservationForm() {
  const { values, errors, handleSubmit } = useFormValidation(
    { email: '', phone: '' },
    async (v) => submitReservation(v),
    (v) => validateForm(v, {
      email: { required: true, pattern: VALIDATION.EMAIL },
      phone: { required: true, pattern: VALIDATION.PHONE },
    })
  )

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Email" error={errors.email} {...} />
      <FormField label="Teléfono" error={errors.phone} {...} />
      <FormSubmitButton />
    </form>
  )
}
```

## 8️⃣ Ejemplo: Usar Hooks de Performance

### ❌ ANTES
```typescript
// Búsqueda sin optimización
const [search, setSearch] = useState("")

const { data: results } = useQuery(
  ["search", search],  // Re-query en cada keystroke
  () => fetchSearch(search)
)
```

### ✅ DESPUÉS
```typescript
// components/ProductSearch.tsx
import { useDebounce } from '@/hooks'
import { useProducts } from '@/lib/queries'

export function ProductSearch() {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)  // Espera 300ms
  
  const { data: results } = useProducts({ 
    search: debouncedSearch 
  })  // Query solo después del debounce

  return (
    <input 
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Buscar..."
    />
  )
}
```

## 9️⃣ Ejemplo: Componentes Genéricos

### ❌ ANTES
```typescript
// Botones específicos en cada componente
<button className="bg-green-600 px-4 py-2 rounded-xl">Crear</button>
<button className="bg-red-600 px-4 py-2 rounded-xl">Eliminar</button>
<button className="bg-blue-600 px-4 py-2 rounded-xl">Editar</button>

// Campos repetidos en cada forma
<input 
  type="text"
  className="w-full bg-black/40 border border-zinc-700 rounded-xl px-3 py-2"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### ✅ DESPUÉS
```typescript
// components/forms/FormField.tsx - Genérico
<FormField 
  label="Nombre" 
  id="name" 
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={errors.name}
/>

// components/forms/FormSubmitButton.tsx - Genérico
<FormSubmitButton 
  text="Crear" 
  variant="primary"
  loading={isPending}
/>
```

## 🔟 Ejemplo: Estructura Completa de Página

### ❌ ANTES - Todo en un archivo (500+ líneas)
```typescript
// admin/products/page.tsx
import React, { useState } from 'react'
import { useCreateProduct } from '@/lib/queries'

export default function ProductsPage() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState("")
  const [file, setFile] = useState(null)
  
  // Búsqueda
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])
  
  // Obtener productos
  const { data: products } = useQuery(...)
  
  // Filtrados
  const filtered = products.filter(...)
  
  // Crear producto
  const mutation = useCreateProduct()
  const handleCreate = async (e) => { ... }
  
  // Validación
  const validate = () => { ... }
  
  return (
    <div>
      <h1>Productos</h1>
      
      {/* Formulario */}
      <form onSubmit={handleCreate}>
        <input value={name} onChange={...} />
        <input type="number" value={price} onChange={...} />
        <select value={category} onChange={...}>...</select>
        <input type="file" onChange={...} />
        <button type="submit">Crear</button>
      </form>
      
      {/* Búsqueda */}
      <input value={search} onChange={...} placeholder="Buscar..." />
      
      {/* Lista */}
      <div>
        {filtered.map(p => (
          <div key={p.id}>...</div>
        ))}
      </div>
    </div>
  )
}
```

### ✅ DESPUÉS - Separado en componentes
```typescript
// admin/products/page.tsx - Limpio y simple
import { ProductSearch } from '@/components/product/ProductSearch'
import { ProductForm } from '@/components/forms/ProductForm'
import { ProductList } from '@/components/product/ProductList'

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  
  return (
    <div>
      <h1>Productos</h1>
      <ProductForm />
      <ProductSearch value={search} onChange={setSearch} />
      <ProductList search={search} />
    </div>
  )
}

// components/product/ProductSearch.tsx
import { useDebounce } from '@/hooks'

export function ProductSearch({ value, onChange }) {
  return <input value={value} onChange={onChange} />
}

// components/product/ProductList.tsx
import { useProducts } from '@/lib/queries'

export function ProductList({ search }) {
  const debouncedSearch = useDebounce(search, 300)
  const { data } = useProducts({ search: debouncedSearch })
  
  return (
    <div>
      {data?.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

// components/product/ProductCard.tsx
export function ProductCard({ product }) {
  return <div>...</div>
}
```

## 📋 Checklist de Migración

Para cada archivo existente:

- [ ] Actualizar imports de componentes layout
- [ ] Actualizar imports de tipos a `types/domain`
- [ ] Reemplazar constantes hardcodeadas por `constants/`
- [ ] Usar hooks de `hooks/` en lugar de lógica inline
- [ ] Extraer utilidades a `lib/utils/`
- [ ] Usar `FormField` y `FormSubmitButton` en formularios
- [ ] Testear que funciona después de cambios
- [ ] Verificar que no hay imports circulares

## 🚀 Orden de Migración Recomendado

1. **Primero**: Actualizar importes en `app/layout.tsx`
2. **Luego**: Actualizar `app/admin/layout.tsx`
3. **Después**: Formularios en admin
4. **Finalmente**: Componentes en páginas públicas

---

**Tip**: Usa buscar y reemplazar en VS Code para cambios masivos.

```
Find: import { (.*) } from '@/components'
Replace: import { $1 } from '@/components/layout'
```
