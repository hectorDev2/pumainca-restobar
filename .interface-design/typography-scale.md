# Jerarquía Tipográfica - Sistema Fuego y Tierra

## Escala de Tamaños

### Display (Hero)
```tsx
className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
// Uso: Títulos principales de landing, heros
// Color: text-cream con énfasis text-ember-600
```

### H1 (Página Principal)
```tsx
className="text-3xl md:text-5xl font-black leading-tight tracking-tight"
// Uso: Título principal de página
// Color: text-cream (default), text-ember-600 (énfasis)
```

### H2 (Sección)
```tsx
className="text-4xl md:text-5xl font-black leading-tight tracking-tight"
// Uso: Títulos de secciones importantes
// Color: text-cream, bg-gradient ember para destacados
```

### H3 (Subsección)
```tsx
className="text-2xl md:text-3xl font-bold leading-tight tracking-tight"
// Uso: Subtítulos, cards destacados
// Color: text-cream (default), hover:text-ember-600
```

### H4 (Card Title)
```tsx
className="text-lg md:text-xl font-bold leading-snug"
// Uso: Títulos de cards, componentes
// Color: text-cream con hover:text-ember-600
```

### Body Large
```tsx
className="text-base md:text-lg leading-relaxed"
// Uso: Párrafos destacados, introducciones
// Color: text-honey
```

### Body Default
```tsx
className="text-sm md:text-base leading-relaxed"
// Uso: Párrafos normales, descripciones
// Color: text-honey (default), text-honey/80 (secundario)
```

### Small / Caption
```tsx
className="text-xs md:text-sm leading-normal"
// Uso: Labels, metadatos, captions
// Color: text-honey/70
```

### Micro / Uppercase Label
```tsx
className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]"
// Uso: Tags, badges, labels especiales
// Color: text-ember-600, text-honey/70
```

---

## Propiedades Tipográficas

### Font Weights
- `font-black` (900) - Display, H1, H2, énfasis máximo
- `font-bold` (700) - H3, H4, botones
- `font-semibold` (600) - Labels, subtítulos menores
- `font-medium` (500) - Body text con énfasis leve

### Leading (Line Height)
- `leading-tight` - Headlines (H1-H3)
- `leading-snug` - H4, subtítulos cortos
- `leading-normal` - Captions, small text
- `leading-relaxed` - Body paragraphs (texto largo)

### Tracking (Letter Spacing)
- `tracking-tight` - Headlines grandes (Display, H1, H2)
- `tracking-normal` - Default (body, H3-H4)
- `tracking-wider` - Pequeño énfasis (0.05em)
- `tracking-[0.2em]` - Labels uppercase
- `tracking-[0.3em]` - Micro uppercase
- `tracking-[0.4em]` - Ultra-condensado tags

---

## Paleta de Colores Tipográficos

### Headings (Títulos)
```css
/* Principal */
text-cream         /* #F8F1E8 - Headings principales */
text-ember-600     /* #E63946 - Énfasis, hover states */

/* Gradientes especiales */
bg-gradient-to-r from-ember-600 to-ember-700
```

### Body (Cuerpo)
```css
text-honey         /* #CA9D5F - Body default */
text-honey/80      /* Secundario, menos énfasis */
text-honey/70      /* Captions, labels */
text-honey/60      /* Disabled, muy secundario */
```

### Énfasis
```css
text-ember-600     /* CTA, links importantes */
text-ember-700     /* Hover de ember-600 */
text-cream         /* Hover sobre honey en interacciones */
```

---

## Ejemplos de Uso

### Hero Section
```tsx
<h1 className="text-cream text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
  Sabores Auténticos
  <br />
  <span className="text-ember-600">Experiencia Inolvidable</span>
</h1>
<p className="text-honey text-lg md:text-xl leading-relaxed">
  Descubre la mejor cocina de autor...
</p>
```

### Section Heading
```tsx
<h2 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-ember-600 to-ember-700 bg-clip-text text-transparent">
  RECOMENDADOS
</h2>
<p className="text-honey/70 text-sm uppercase tracking-[0.3em] font-bold">
  Favoritos de la Casa
</p>
```

### Card Component
```tsx
<h3 className="text-2xl font-black tracking-tight text-cream group-hover:text-ember-600 transition-colors">
  {product.name}
</h3>
<p className="text-sm text-honey leading-relaxed">
  {product.description}
</p>
```

### Label/Badge
```tsx
<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ember-600">
  Premium
</span>
```

---

## Reglas de Oro

1. **Headlines = tight tracking** - `tracking-tight` para Display, H1, H2
2. **Body = relaxed leading** - `leading-relaxed` para lectura cómoda
3. **Uppercase = wide tracking** - Mínimo `tracking-[0.2em]` para legibilidad
4. **Cream para emphasis** - Headings y elementos importantes
5. **Honey para legibilidad** - Body text neutro y cálido
6. **Ember para acción** - CTAs, links, hover states
7. **No mezclar font-black con tracking-wide** - Se ve apretado
8. **Máximo 3 tamaños por componente** - Evita jerarquía confusa

---

**Última actualización:** 7 de febrero 2026
