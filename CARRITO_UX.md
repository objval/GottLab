# UX del Sistema de Carrito

## 🎯 Comportamiento por Dispositivo

### 📱 Mobile
```
Usuario toca icono del carrito
  ↓
Redirige a /carrito (página completa)
  ↓
Vista optimizada para móvil:
  - Items en lista vertical
  - Controles de cantidad grandes
  - Resumen sticky al final
  - Botón "Proceder al pago" destacado
```

### 💻 Desktop
```
Usuario hace click en icono del carrito
  ↓
Abre dropdown flotante (sin cambiar de página)
  ↓
Muestra:
  - Hasta 3-4 items visibles (scroll si hay más)
  - Miniatura + nombre + precio
  - Botón eliminar por item
  - Subtotal
  - Botón "Ver carrito completo" → /carrito
```

## 🔔 Contador de Items

### Ubicación
- **Desktop:** Navbar superior derecha, antes de "Iniciar Sesión"
- **Mobile:** Navbar superior derecha, antes del toggle de tema

### Apariencia
```
┌─────────┐
│    🛒   │  ← Icono del carrito
│      ③  │  ← Badge verde con número
└─────────┘
```

### Estados
- **Vacío (0 items):** Sin badge, solo icono
- **Con items (1+):** Badge verde con número
- **Color:** Verde (#059669) para coincidir con el tema

## ⏱️ Expiración Silenciosa

### Comportamiento
```
Usuario agrega producto al carrito
  ↓
Se crea reserva con fecha_expiracion = ahora + 15 min
  ↓
Usuario navega, ve otros productos, etc.
  ↓
Después de 15 minutos:
  - Reserva se elimina automáticamente
  - Stock se libera
  - NO se notifica al usuario
  - Próxima vez que abra el carrito, el item no estará
```

### Limpieza Automática
- Se ejecuta en **cada acción del carrito**:
  - Al abrir dropdown/página
  - Al agregar producto
  - Al actualizar cantidad
  - Al eliminar item
- También se ejecuta cada **60 segundos** en background (CarritoContext)

## 🎨 Integración Visual

### Colores del Icono
El icono del carrito cambia de color según el contexto del navbar:

| Contexto | Color del Icono |
|----------|----------------|
| Home (sin scroll) + Light | Gris oscuro (#292524) |
| Home (sin scroll) + Dark | Gris oscuro (#292524) |
| Home (con scroll) + Light | Gris (#57534e) |
| Home (con scroll) + Dark | Blanco (#ffffff) |
| Otras páginas (sin scroll) + Light | Gris oscuro (#292524) |
| Otras páginas (sin scroll) + Dark | Blanco (#ffffff) |
| Otras páginas (con scroll) + Light | Gris (#57534e) |
| Otras páginas (con scroll) + Dark | Blanco (#ffffff) |
| Preventas (sin scroll) | Blanco (#ffffff) |

### Badge del Contador
- **Siempre verde:** `bg-green-600` (#059669)
- **Texto blanco:** Para máximo contraste
- **Posición:** Top-right del icono (-top-1 -right-1)
- **Tamaño:** 20px × 20px (h-5 w-5)
- **Fuente:** Bold, text-xs

## 📊 Flujo Completo del Usuario

### Escenario 1: Compra Rápida (Desktop)
```
1. Usuario navega /productos
2. Click "Agregar al carrito" en producto
3. Botón muestra "Agregado al carrito" (2 seg)
4. Badge del navbar actualiza: 0 → 1
5. Usuario sigue navegando
6. Click en icono del carrito
7. Dropdown muestra el producto
8. Click "Ver carrito completo"
9. Página /carrito con todos los detalles
10. Click "Proceder al pago"
```

### Escenario 2: Compra Rápida (Mobile)
```
1. Usuario navega /productos
2. Click "Agregar al carrito" en producto
3. Botón muestra "Agregado al carrito" (2 seg)
4. Badge del navbar actualiza: 0 → 1
5. Usuario toca icono del carrito
6. Redirige a /carrito (página completa)
7. Ve todos los items, ajusta cantidades
8. Click "Proceder al pago"
```

### Escenario 3: Reserva Expirada
```
1. Usuario agrega 3 productos al carrito
2. Badge muestra: 3
3. Usuario se distrae, navega otras páginas
4. Pasan 15 minutos
5. Usuario vuelve y abre el carrito
6. Carrito está vacío
7. Badge muestra: 0
8. Mensaje: "Tu carrito está vacío"
9. Stock de los 3 productos ya está disponible para otros
```

## 🚀 Ventajas del Sistema

### Para el Usuario
✅ **Sin presión:** No hay notificaciones molestas de expiración
✅ **Rápido en desktop:** Dropdown evita cambios de página
✅ **Optimizado en mobile:** Página completa con controles grandes
✅ **Visual claro:** Badge siempre visible con el contador

### Para el Negocio
✅ **Previene sobreventa:** Stock bloqueado temporalmente
✅ **Libera stock automáticamente:** Sin intervención manual
✅ **Reduce carritos abandonados:** Expiración silenciosa es menos frustrante
✅ **Datos limpios:** No hay reservas antiguas acumulándose

## 🔧 Personalización

### Cambiar Tiempo de Expiración
```javascript
// En lib/actions/carrito.js
const EXPIRACION_MINUTOS = 15; // Cambiar a 10, 20, 30, etc.
```

### Cambiar Frecuencia de Limpieza
```typescript
// En contexts/CarritoContext.tsx
const interval = setInterval(cargarCarrito, 60000) // 60000ms = 1 min
```

### Cambiar Máximo de Items en Dropdown
```typescript
// En components/CarritoDropdown.tsx
<div className="max-h-96 overflow-y-auto"> // Ajustar max-h-XX
```
