# Estructura de Datos para Backend - Pumainca Restobar

## 📋 Resumen General

La aplicación necesita 4 entidades principales:
1. **Categories** (Categorías de Menú)
2. **Products** (Platos/Productos)
3. **Reservations** (Reservas)
4. **Orders** (Pedidos)

---

## 1. CATEGORIES (Categorías)

### Tabla: `categories`

```sql
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Ejemplo de Datos:
```json
{
  "id": "platos-principales",
  "name": "Platos Principales",
  "description": "Nuestras especialidades principales",
  "image_url": "https://...",
  "display_order": 1
}
```

### Subcategorías (relación):

```sql
CREATE TABLE subcategories (
  id VARCHAR(50) PRIMARY KEY,
  category_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

---

## 2. PRODUCTS (Platos/Productos)

### Tabla: `products`

```sql
CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id VARCHAR(50) NOT NULL,
  subcategory_id VARCHAR(50),
  image_url VARCHAR(500),
  price DECIMAL(10, 2),
  is_variable_price BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_spicy BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  is_chef_special BOOLEAN DEFAULT FALSE,
  is_recommended BOOLEAN DEFAULT FALSE,
  preparation_time_minutes INT DEFAULT 15,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
);
```

### Tabla: `product_prices` (para productos con múltiples precios)

```sql
CREATE TABLE product_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  size_name VARCHAR(50) NOT NULL, -- "pequeño", "mediano", "familiar"
  price DECIMAL(10, 2) NOT NULL,
  UNIQUE KEY unique_product_size (product_id, size_name),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### Tabla: `product_ingredients` (ingredientes)

```sql
CREATE TABLE product_ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  ingredient_name VARCHAR(100) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### Tabla: `product_allergens` (alérgenos)

```sql
CREATE TABLE product_allergens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  allergen_name VARCHAR(100) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### Tabla: `product_gallery` (galerías de imágenes)

```sql
CREATE TABLE product_gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### Ejemplo de Respuesta API GET /api/products:

```json
{
  "id": "lomo-saltado",
  "name": "Lomo Saltado",
  "description": "Lomo fino macerado en especias...",
  "category_id": "platos-principales",
  "image_url": "https://...",
  "price": 30.00,
  "is_variable_price": false,
  "is_available": true,
  "is_vegetarian": false,
  "is_recommended": true,
  "ingredients": [
    "Lomo de res",
    "Cebolla",
    "Tomate",
    "Ají amarillo",
    "Arroz",
    "Papas andinas"
  ],
  "allergens": ["Picante"],
  "preparation_time_minutes": 20
}
```

---

## 3. RESERVATIONS (Reservas)

### Tabla: `reservations`

```sql
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_code VARCHAR(20) UNIQUE NOT NULL, -- Ej: RES202601120001
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  number_of_guests INT NOT NULL,
  special_requests TEXT,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_reservation_date (reservation_date)
);
```

### Ejemplo de Datos:

```json
{
  "full_name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "phone_number": "+51 999 999 999",
  "reservation_date": "2026-01-18",
  "reservation_time": "19:00",
  "number_of_guests": 4,
  "special_requests": "Alergia a mariscos",
  "status": "pending"
}
```

### Respuesta API POST /api/reservations:

```json
{
  "id": 1,
  "reservation_code": "RES202601180001",
  "status": "confirmed",
  "message": "Reserva confirmada exitosamente",
  "created_at": "2026-01-12T14:30:00Z"
}
```

---

## 4. ORDERS (Pedidos)

### Tabla: `orders`

```sql
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL, -- Ej: PED202601120001
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_name VARCHAR(255),
  
  -- Detalles de entrega
  pickup_time TIME,
  pickup_time_estimate ENUM('20m', '45m', '1h') DEFAULT '20m',
  special_instructions TEXT,
  
  -- Totales
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  service_fee DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  
  -- Método de pago
  payment_method ENUM('cash', 'card', 'transfer') DEFAULT 'cash',
  payment_status ENUM('pending', 'completed', 'refunded') DEFAULT 'pending',
  
  -- Estado del pedido
  status ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customer_email (customer_email),
  INDEX idx_created_date (created_at),
  INDEX idx_status (status)
);
```

### Tabla: `order_items` (Items del Pedido)

```sql
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  
  -- Opciones seleccionadas
  selected_size VARCHAR(50),
  cooking_point VARCHAR(50), -- "poco hecho", "medio hecho", etc
  special_instructions TEXT,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Ejemplo de Pedido Completo:

**POST /api/orders**

```json
{
  "customer_name": "Juan Pérez",
  "customer_email": "juan@ejemplo.com",
  "customer_phone": "+51 999 999 999",
  "pickup_time_estimate": "20m",
  "special_instructions": "Sin pimienta en el plato",
  "payment_method": "cash",
  "items": [
    {
      "product_id": "lomo-saltado",
      "quantity": 2,
      "unit_price": 30.00,
      "cooking_point": "al punto",
      "special_instructions": "Sin ají"
    },
    {
      "product_id": "pizza-roemix",
      "quantity": 1,
      "unit_price": 29.00,
      "selected_size": "mediano"
    }
  ],
  "subtotal": 89.00,
  "tax_amount": 16.02,
  "service_fee": 0,
  "total_amount": 105.02
}
```

**Respuesta: POST /api/orders**

```json
{
  "id": 123,
  "order_number": "PED202601120001",
  "status": "confirmed",
  "total_amount": 105.02,
  "estimated_pickup_time": "2026-01-12 14:32:00",
  "message": "Pedido confirmado. Te notificaremos cuando esté listo.",
  "created_at": "2026-01-12T14:12:00Z"
}
```

---

## 5. ENDPOINTS API REQUERIDOS

### Categorías
- `GET /api/categories` - Obtener todas las categorías
- `GET /api/categories/:id` - Obtener detalle de categoría
- `GET /api/categories/:id/subcategories` - Obtener subcategorías

### Productos
- `GET /api/products` - Obtener todos (con filtros: category, search, sort)
- `GET /api/products/:id` - Obtener detalle
- `GET /api/products?category=platos-principales` - Filtrar por categoría
- `GET /api/products?search=lomo` - Buscar

### Reservas
- `POST /api/reservations` - Crear reserva
- `GET /api/reservations/:code` - Obtener estado de reserva
- `GET /api/reservations?email=...` - Obtener reservas del usuario

### Pedidos
- `POST /api/orders` - Crear pedido
- `GET /api/orders/:number` - Obtener estado de pedido
- `GET /api/orders/:id/status` - Obtener estado actualizado
- `PUT /api/orders/:id/cancel` - Cancelar pedido

---

## 6. ESTRUCTURA DE RESPUESTA DE ERRORES

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descripción del error en español",
    "details": [
      {
        "field": "phone_number",
        "message": "Formato de teléfono inválido"
      }
    ]
  }
}
```

---

## 7. VALIDACIONES REQUERIDAS

### Reservas
- Fecha: no puede ser anterior a hoy
- Hora: entre 12:00 PM - 23:00 PM
- Número de personas: 1-12
- Email: formato válido
- Teléfono: formato válido (Perú: +51)

### Pedidos
- Mínimo un item
- Cantidad mínima: 1
- Email y teléfono obligatorios
- Total > 0

---

## 8. ÍNDICES RECOMENDADOS

```sql
-- Products
CREATE INDEX idx_category_id ON products(category_id);
CREATE INDEX idx_available ON products(is_available);
CREATE INDEX idx_name ON products(name);

-- Orders
CREATE INDEX idx_order_number ON orders(order_number);
CREATE INDEX idx_payment_status ON orders(payment_status);
CREATE INDEX idx_created_date ON orders(created_at);

-- Reservations
CREATE INDEX idx_res_date_time ON reservations(reservation_date, reservation_time);
```

---

## 9. CAMPOS ADICIONALES OPCIONALES

Para futuras expansiones:
- **Discounts/Coupons** - Sistema de cupones
- **Customer Profiles** - Perfil de clientes registrados
- **Reviews** - Reseñas de productos
- **Inventory** - Control de inventario
- **Operating Hours** - Horarios de operación
- **Analytics** - Datos de análisis

