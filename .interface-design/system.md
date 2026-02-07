# Sistema de Diseño - Pumainca Restobar

## Concepto: "Fuego y Tierra"

Interfaz que refleja la fusión de tradición andina con alta cocina moderna. Cálida como brasas de carbón, orgánica como ingredientes naturales, sofisticada como una experiencia culinaria memorable.

---

## Paleta de Colores

### Fuego - Brasas Vivas
No rojo digital frío, sino el calor de carbones ardientes en parrilla:

```css
--ember-600: #E63946  /* Brasa brillante - acciones principales */
--ember-700: #D62828  /* Fuego profundo - hover estados */
--ember-800: #9D0208  /* Carbón ardiente - bordes/detalles */
--ember-900: #6A040F  /* Brasa apagándose - fondos oscuros */
```

**Uso:** Llamados a la acción, elementos interactivos, énfasis.

### Tierra - Noche Cálida
No negro puro ni gris neutro, sino la calidez de madera quemada y arcilla:

```css
--earth-950: #0D0A08  /* Noche con humo - fondo principal */
--earth-900: #1A1512  /* Madera quemada - superficies elevadas */
--earth-800: #2B2520  /* Arcilla oscura - hover surfaces */
--earth-700: #3D332E  /* Tierra tostada - bordes sutiles */
```

**Uso:** Fondos, superficies, contenedores.

### Accentos Naturales
Ingredientes que complementan:

```css
--sage: #52796F    /* Hierbas frescas - éxito/confirmación */
--honey: #CA9D5F   /* Miel/dorado - texto secundario */
--cream: #F8F1E8   /* Porcelana - texto principal */
```

**Uso:** 
- `cream` → Textos principales, headlines
- `honey` → Textos secundarios, descripciones
- `sage` → Estados de éxito, elementos naturales

---

## Elevación y Depth

**Estrategia:** Sombras sutiles + transiciones de color cálido

No saltos dramáticos. Elevación debe ser whisper-quiet:

```tsx
// Nivel 0 - Fondo base
className="bg-earth-950"

// Nivel 1 - Surface elevada
className="bg-earth-900"

// Nivel 2 - Hover/Focus
className="bg-earth-800 hover:bg-earth-700"

// Nivel 3 - Activo/Seleccionado
className="bg-earth-800 border border-ember-800/30"
```

### Sombras Orgánicas

```css
/* Sombra sutil - cards normales */
shadow-lg shadow-earth-900/40

/* Sombra cálida - elementos con ember */
shadow-lg shadow-ember-900/40

/* Sombra elevada - modales, dropdowns */
shadow-2xl shadow-earth-950/80
```

---

## Tipografía

### Escala

```tsx
// Display - Hero headlines
className="text-6xl lg:text-7xl font-black tracking-tight leading-[0.9]"

// H1 - Section titles
className="text-4xl md:text-5xl font-black tracking-tight"

// H2 - Subsections
className="text-3xl md:text-4xl font-bold tracking-tight"

// Body Large - Descripciones importantes
className="text-lg md:text-xl font-medium leading-relaxed"

// Body - Texto normal
className="text-base leading-relaxed"

// Small - Labels, metadata
className="text-sm font-medium tracking-wide"

// Micro - Captions
className="text-xs uppercase tracking-[0.3em]"
```

### Jerarquía de Color

```tsx
// Primario - Cream
className="text-cream"

// Secundario - Honey
className="text-honey"

// Énfasis - Ember
className="text-ember-600"

// Disabled
className="text-earth-700"
```

---

## Componentes Base

### Botones

```tsx
// Primary - Acción principal
className="
  bg-ember-600 hover:bg-ember-700 
  text-cream 
  shadow-lg shadow-ember-900/40 
  hover:shadow-ember-800/60
  transition-all duration-300
  px-6 py-3 rounded-md font-bold
"

// Secondary - Acción secundaria
className="
  bg-earth-800/60 hover:bg-earth-800 
  backdrop-blur-md 
  border border-honey/20 hover:border-honey/40 
  text-cream
  transition-all duration-300
  px-6 py-3 rounded-md font-bold
"

// Ghost - Acción terciaria
className="
  text-honey hover:text-cream 
  hover:bg-earth-800/40
  transition-all duration-200
  px-4 py-2 rounded-md font-medium
"
```

### Cards

```tsx
// Card base
className="
  bg-earth-900 
  border border-earth-700/30
  rounded-xl 
  p-6
  transition-all duration-300
"

// Card interactivo
className="
  bg-earth-900 hover:bg-earth-800
  border border-earth-700/30 hover:border-ember-800/30
  rounded-xl 
  p-6
  transition-all duration-300
  cursor-pointer
"
```

### Inputs

```tsx
className="
  w-full 
  bg-earth-800/60 
  border border-earth-700/50 
  focus:border-ember-600/50
  text-cream placeholder-honey/50
  rounded-xl 
  px-4 py-3
  transition-all duration-200
  focus:ring-2 focus:ring-ember-600/20
  outline-none
"
```

---

## Estados de Interacción

Todos los elementos interactivos necesitan:

```tsx
// Default
className="bg-ember-600 text-cream"

// Hover
className="hover:bg-ember-700 hover:shadow-ember-800/60"

// Focus
className="focus:ring-2 focus:ring-ember-600/20 outline-none"

// Active
className="active:scale-[0.98]"

// Disabled
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

---

## Spacing

Base unit: **4px** (Tailwind default)

```tsx
// Micro spacing
gap-1 (4px), gap-2 (8px)

// Component spacing
gap-4 (16px), gap-6 (24px)

// Section spacing
gap-8 (32px), gap-12 (48px), gap-16 (64px)

// Large section spacing
gap-20 (80px), gap-24 (96px)
```

---

## Animaciones

Micro-interacciones orgánicas, no mecánicas:

```tsx
// Rápidas - hover, focus
duration-200

// Normales - transiciones de estado
duration-300

// Lentas - animaciones complejas
duration-500

// Easing natural
transition-all
```

---

## Border Radius

Coherencia en todo el sistema:

```tsx
// Pequeño - badges, chips
rounded-md (6px)

// Normal - buttons, inputs, small cards
rounded-xl (12px)

// Grande - cards, modals
rounded-2xl (16px)

// Extra - hero elements
rounded-3xl (24px)

// Full - avatars, pills
rounded-full
```

---

## Aplicación del Sistema

### ✅ Hacer
- Usar colores ember para acciones y énfasis
- Mantener elevación sutil (whisper-quiet)
- Aplicar transiciones orgánicas (300ms)
- Usar honey para texto secundario
- Mantener contraste 4.5:1 mínimo

### ❌ Evitar
- Rojo puro digital (#FF0000)
- Negro puro (#000000)
- Saltos dramáticos de color
- Bordes gruesos y duros
- Animaciones bruscas o bouncy

---

## Próximos Pasos

1. ✅ Sistema de colores implementado
2. ✅ Signature element "Llama Flotante"
3. ✅ Refactorización de layering en componentes
4. ✅ Jerarquía tipográfica completa
5. ⏳ Layout asimétrico para menú

---

## Signature Element: "Llama Flotante"

**Implementado en:** `components/home/RecommendedCard.tsx`

### Concepto
Cards de productos con resplandor cálido que surge desde abajo en hover, simulando el brillo de brasas ardientes. No es un efecto mecánico - es orgánico, como una llama real.

### Código Base
```tsx
{/* Signature: Llama Flotante */}
<div 
  className="absolute inset-0 bg-gradient-to-t from-ember-700/30 via-ember-600/10 to-transparent transition-opacity duration-500 pointer-events-none z-[1]
    opacity-0 hover:opacity-100 hover:animate-glow-ember"
/>
```

### Animación
```css
@keyframes glowEmber {
  0%, 100% { opacity: 0; transform: translateY(20%); }
  50% { opacity: 1; transform: translateY(0); }
}
```

### Cuándo Usar
- ✅ Cards de productos destacados/recomendados
- ✅ Platos especiales del chef
- ✅ Items premium en el menú
- ❌ NO en elementos comunes (conserva su exclusividad)

### Por Qué Es Único
Este efecto identifica a Pumainca porque:
1. Refleja el fuego de cocina de alta gastronomía
2. Usa nuestra paleta ember exclusiva
3. Movimiento orgánico, no mecánico (no es bounce/spring)
4. Solo aparece en elementos premium

**Archivo de referencia:** `.interface-design/signature-llama-flotante.css`

**Última actualización:** 7 de febrero 2026
