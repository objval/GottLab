# Sistema de Carrito con Reservas Temporales

## Descripción

Sistema de carrito de compras que utiliza la tabla `Reservas` de la base de datos para crear reservas temporales de productos. Las reservas expiran automáticamente después de 15 minutos, liberando el stock para otros usuarios.

## Arquitectura

### Base de Datos

**Tabla: `reservas`**
- `id_reserva` (PK) - ID único de la reserva
- `id_cliente` (FK) - ID del cliente que reservó
- `id_producto` (FK) - ID del producto reservado
- `cantidad` (INT) - Cantidad reservada
- `fecha_expiracion` (TIMESTAMP) - Fecha/hora de expiración

### Componentes

1. **`lib/actions/carrito.js`** - Server actions para manejar el carrito
   - `getCarrito(idCliente)` - Obtiene items del carrito
   - `agregarAlCarrito(idCliente, idProducto, cantidad)` - Agrega producto
   - `actualizarCantidad(idReserva, nuevaCantidad)` - Actualiza cantidad
   - `eliminarDelCarrito(idReserva)` - Elimina item
   - `vaciarCarrito(idCliente)` - Vacía todo el carrito
   - `getContadorCarrito(idCliente)` - Obtiene total de items

2. **`contexts/CarritoContext.tsx`** - Context API para estado global
   - Provee acceso al carrito en toda la app
   - Auto-refresca cada minuto
   - Maneja loading states

3. **`components/AgregarAlCarritoBtn.tsx`** - Botón para agregar productos
   - Feedback visual (loading, agregado)
   - Manejo de errores

4. **`components/CarritoDropdown.tsx`** - Dropdown del carrito
   - **Desktop:** Menú desplegable con vista rápida
   - **Mobile:** Redirige a página completa
   - Contador de items en badge
   - Eliminar productos inline
   - Adaptado a tema del navbar

5. **`app/carrito/page.tsx`** - Página completa del carrito
   - Vista de items reservados
   - Controles de cantidad
   - Resumen de compra
   - Solo visible en mobile o al hacer click en "Ver carrito completo"

## Flujo de Funcionamiento

### 1. Agregar al Carrito
```
Usuario click "Agregar al carrito"
  ↓
Verificar stock disponible (total - reservas activas)
  ↓
Si hay stock:
  - Crear/actualizar reserva con expiración en 15 min
  - Actualizar contador en navbar
Si no hay stock:
  - Mostrar error
```

### 2. Expiración Automática
```
Cada acción del carrito ejecuta limpiarReservasExpiradas()
  ↓
Elimina reservas donde fecha_expiracion < ahora
  ↓
Stock se libera automáticamente
```

### 3. Gestión de Stock
```
Stock Real = productos.stock_total
Stock Reservado = SUM(reservas.cantidad) WHERE fecha_expiracion > ahora
Stock Disponible = Stock Real - Stock Reservado
```

## Configuración

### Tiempo de Expiración
Editar en `lib/actions/carrito.js`:
```javascript
const EXPIRACION_MINUTOS = 15; // Cambiar según necesidad
```

### ID de Cliente Temporal
Actualmente usa `ID_CLIENTE_TEMPORAL = 1` en `CarritoContext.tsx`.

**TODO:** Reemplazar con sistema de autenticación real:
```typescript
// En CarritoContext.tsx
const { user } = useAuth() // Tu hook de autenticación
const idCliente = user?.id || null
```

## Características

✅ **Reservas temporales** - Stock bloqueado por tiempo limitado (15 min)
✅ **Expiración silenciosa** - Reservas expiran automáticamente sin notificar al usuario
✅ **Validación de stock** - Previene sobreventa
✅ **Contador en navbar** - Badge con número de items
✅ **Dropdown en desktop** - Vista rápida del carrito sin cambiar de página
✅ **Página completa en mobile** - Experiencia optimizada para móviles
✅ **Persistencia** - Reservas en base de datos
✅ **Dark mode** - Soporte completo
✅ **Responsive** - Adaptado a cada dispositivo

## Próximos Pasos

### 1. Sistema de Autenticación
- Implementar login/registro
- Reemplazar ID_CLIENTE_TEMPORAL
- Asociar carrito a usuario real

### 2. Proceso de Checkout
- Crear tabla `pedidos`
- Convertir reservas en pedidos
- Integración con pasarela de pago
- Descontar stock real al confirmar

### 3. Mejoras
- Notificaciones cuando expira reserva
- Opción de "guardar para después"
- Historial de carritos abandonados
- Analytics de conversión

### 4. Optimizaciones
- Cache de contador en localStorage
- Debounce en actualizaciones
- Optimistic UI updates
- WebSockets para stock en tiempo real

## Ejemplo de Uso

```typescript
'use client'

import { useCarrito } from '@/contexts/CarritoContext'

export default function MiComponente() {
  const { items, contador, agregarProducto } = useCarrito()

  const handleAgregar = async () => {
    const result = await agregarProducto(123, 2) // id_producto, cantidad
    if (result.success) {
      console.log('Agregado!')
    } else {
      console.error(result.error)
    }
  }

  return (
    <div>
      <p>Items en carrito: {contador}</p>
      <button onClick={handleAgregar}>Agregar Producto</button>
    </div>
  )
}
```

## Notas Importantes

⚠️ **Limpieza de reservas:** Se ejecuta en cada acción del carrito. Para alto tráfico, considerar un cron job separado.

⚠️ **Concurrencia:** El sistema maneja race conditions verificando stock antes de cada operación.

⚠️ **Escalabilidad:** Para miles de usuarios simultáneos, considerar Redis para el carrito en lugar de DB directa.
