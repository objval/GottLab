-- GottLab Auth Rebuild — Migration 003 (Indexes + Foreign Keys)
-- Run after 001 and 002.
-- Adds performance indexes and referential integrity constraints.

-- ============================================================================
-- Performance Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_reservas_id_cliente ON reservas(id_cliente);
CREATE INDEX IF NOT EXISTS idx_reservas_id_producto ON reservas(id_producto);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha_expiracion ON reservas(fecha_expiracion);
CREATE INDEX IF NOT EXISTS idx_pedidos_id_cliente ON pedidos(id_cliente);
CREATE INDEX IF NOT EXISTS idx_direcciones_id_cliente ON direcciones(id_cliente);
CREATE INDEX IF NOT EXISTS idx_productos_estado ON productos(estado);
CREATE INDEX IF NOT EXISTS idx_productos_id_categoria ON productos(id_categoria);
CREATE INDEX IF NOT EXISTS idx_imagenes_productos_id_producto ON imagenes_productos(id_producto);

-- ============================================================================
-- Foreign Keys (referential integrity)
-- ============================================================================

-- Cart reservations -> clientes (cascade: cart dies with user)
ALTER TABLE reservas DROP CONSTRAINT IF EXISTS fk_reservas_cliente;
ALTER TABLE reservas ADD CONSTRAINT fk_reservas_cliente
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE;

-- Cart reservations -> productos (cascade: reservation dies with product)
ALTER TABLE reservas DROP CONSTRAINT IF EXISTS fk_reservas_producto;
ALTER TABLE reservas ADD CONSTRAINT fk_reservas_producto
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE;

-- Orders -> clientes (restrict: orders preserved even if user deleted)
ALTER TABLE pedidos DROP CONSTRAINT IF EXISTS fk_pedidos_cliente;
ALTER TABLE pedidos ADD CONSTRAINT fk_pedidos_cliente
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE RESTRICT;

-- Addresses -> clientes (cascade: addresses die with user)
ALTER TABLE direcciones DROP CONSTRAINT IF EXISTS fk_direcciones_cliente;
ALTER TABLE direcciones ADD CONSTRAINT fk_direcciones_cliente
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE;

-- Product images -> productos (cascade: images die with product)
ALTER TABLE imagenes_productos DROP CONSTRAINT IF EXISTS fk_imagenes_productos;
ALTER TABLE imagenes_productos ADD CONSTRAINT fk_imagenes_productos
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE;
