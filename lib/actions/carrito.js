"use server";

import { supabase } from "../supabaseServer";

// Tiempo de expiración de reservas en minutos
const EXPIRACION_MINUTOS = 15;

/**
 * Limpia reservas expiradas
 */
async function limpiarReservasExpiradas() {
  const ahora = new Date();
  const tiempoExpiracion = new Date(ahora.getTime() - EXPIRACION_MINUTOS * 60000);

  const { error } = await supabase
    .from("reservas")
    .delete()
    .lt("fecha_expiracion", tiempoExpiracion.toISOString());

  if (error) {
    console.error("Error limpiando reservas:", error);
  }
}

/**
 * Obtiene el carrito de un cliente (reservas activas)
 * @param {number} idCliente - ID del cliente
 */
export async function getCarrito(idCliente) {
  // Primero limpiar reservas expiradas
  await limpiarReservasExpiradas();

  const { data, error } = await supabase
    .from("reservas")
    .select(`
      id_reserva,
      id_producto,
      cantidad,
      fecha_expiracion,
      productos (
        nombre,
        nombre_cientifico,
        precio_venta,
        stock_total,
        imagenes_productos (
          url
        )
      )
    `)
    .eq("id_cliente", idCliente)
    .gt("fecha_expiracion", new Date().toISOString());

  if (error) {
    console.error("Error obteniendo carrito:", error);
    return [];
  }

  return data || [];
}

/**
 * Agrega un producto al carrito (crea reserva temporal)
 * @param {number} idCliente - ID del cliente
 * @param {number} idProducto - ID del producto
 * @param {number} cantidad - Cantidad a reservar
 */
export async function agregarAlCarrito(idCliente, idProducto, cantidad = 1) {
  // Limpiar reservas expiradas primero
  await limpiarReservasExpiradas();

  // Verificar stock disponible (descontando reservas activas)
  const { data: producto } = await supabase
    .from("productos")
    .select("stock_total")
    .eq("id_producto", idProducto)
    .single();

  if (!producto) {
    return { success: false, error: "Producto no encontrado" };
  }

  // Calcular stock reservado actualmente
  const { data: reservasActivas } = await supabase
    .from("reservas")
    .select("cantidad")
    .eq("id_producto", idProducto)
    .gt("fecha_expiracion", new Date().toISOString());

  const stockReservado = reservasActivas?.reduce((sum, r) => sum + r.cantidad, 0) || 0;
  const stockDisponible = producto.stock_total - stockReservado;

  if (cantidad > stockDisponible) {
    return { 
      success: false, 
      error: `Solo hay ${stockDisponible} unidades disponibles` 
    };
  }

  // Verificar si ya existe una reserva de este cliente para este producto
  const { data: reservaExistente } = await supabase
    .from("reservas")
    .select("id_reserva, cantidad")
    .eq("id_cliente", idCliente)
    .eq("id_producto", idProducto)
    .gt("fecha_expiracion", new Date().toISOString())
    .single();

  const fechaExpiracion = new Date(Date.now() + EXPIRACION_MINUTOS * 60000);

  if (reservaExistente) {
    // Actualizar cantidad y extender expiración
    const nuevaCantidad = reservaExistente.cantidad + cantidad;
    
    if (nuevaCantidad > stockDisponible) {
      return { 
        success: false, 
        error: `Solo puedes agregar ${stockDisponible - reservaExistente.cantidad} unidades más` 
      };
    }

    const { error } = await supabase
      .from("reservas")
      .update({
        cantidad: nuevaCantidad,
        fecha_expiracion: fechaExpiracion.toISOString()
      })
      .eq("id_reserva", reservaExistente.id_reserva);

    if (error) {
      console.error("Error actualizando reserva:", error);
      return { success: false, error: "Error al actualizar el carrito" };
    }

    return { success: true, message: "Cantidad actualizada" };
  }

  // Crear nueva reserva
  const { error } = await supabase
    .from("reservas")
    .insert({
      id_cliente: idCliente,
      id_producto: idProducto,
      cantidad,
      fecha_expiracion: fechaExpiracion.toISOString()
    });

  if (error) {
    console.error("Error creando reserva:", error);
    return { success: false, error: "Error al agregar al carrito" };
  }

  return { success: true, message: "Producto agregado al carrito" };
}

/**
 * Actualiza la cantidad de un item del carrito
 * @param {number} idReserva - ID de la reserva
 * @param {number} nuevaCantidad - Nueva cantidad
 */
export async function actualizarCantidad(idReserva, nuevaCantidad) {
  if (nuevaCantidad < 1) {
    return eliminarDelCarrito(idReserva);
  }

  // Verificar stock disponible
  const { data: reserva } = await supabase
    .from("reservas")
    .select("id_producto, cantidad")
    .eq("id_reserva", idReserva)
    .single();

  if (!reserva) {
    return { success: false, error: "Reserva no encontrada" };
  }

  const { data: producto } = await supabase
    .from("productos")
    .select("stock_total")
    .eq("id_producto", reserva.id_producto)
    .single();

  const { data: otrasReservas } = await supabase
    .from("reservas")
    .select("cantidad")
    .eq("id_producto", reserva.id_producto)
    .neq("id_reserva", idReserva)
    .gt("fecha_expiracion", new Date().toISOString());

  const stockReservadoPorOtros = otrasReservas?.reduce((sum, r) => sum + r.cantidad, 0) || 0;
  const stockDisponible = producto.stock_total - stockReservadoPorOtros;

  if (nuevaCantidad > stockDisponible) {
    return { 
      success: false, 
      error: `Solo hay ${stockDisponible} unidades disponibles` 
    };
  }

  // Extender expiración al actualizar
  const fechaExpiracion = new Date(Date.now() + EXPIRACION_MINUTOS * 60000);

  const { error } = await supabase
    .from("reservas")
    .update({
      cantidad: nuevaCantidad,
      fecha_expiracion: fechaExpiracion.toISOString()
    })
    .eq("id_reserva", idReserva);

  if (error) {
    console.error("Error actualizando cantidad:", error);
    return { success: false, error: "Error al actualizar cantidad" };
  }

  return { success: true, message: "Cantidad actualizada" };
}

/**
 * Elimina un item del carrito
 * @param {number} idReserva - ID de la reserva
 */
export async function eliminarDelCarrito(idReserva) {
  const { error } = await supabase
    .from("reservas")
    .delete()
    .eq("id_reserva", idReserva);

  if (error) {
    console.error("Error eliminando del carrito:", error);
    return { success: false, error: "Error al eliminar del carrito" };
  }

  return { success: true, message: "Producto eliminado del carrito" };
}

/**
 * Vacía todo el carrito de un cliente
 * @param {number} idCliente - ID del cliente
 */
export async function vaciarCarrito(idCliente) {
  const { error } = await supabase
    .from("reservas")
    .delete()
    .eq("id_cliente", idCliente);

  if (error) {
    console.error("Error vaciando carrito:", error);
    return { success: false, error: "Error al vaciar el carrito" };
  }

  return { success: true, message: "Carrito vaciado" };
}

/**
 * Obtiene el conteo de items en el carrito
 * @param {number} idCliente - ID del cliente
 */
export async function getContadorCarrito(idCliente) {
  await limpiarReservasExpiradas();

  const { data, error } = await supabase
    .from("reservas")
    .select("cantidad")
    .eq("id_cliente", idCliente)
    .gt("fecha_expiracion", new Date().toISOString());

  if (error) {
    console.error("Error obteniendo contador:", error);
    return 0;
  }

  return data?.reduce((sum, r) => sum + r.cantidad, 0) || 0;
}

/**
 * Valida el carrito antes del checkout
 * Verifica stock, precios, y reservas válidas
 * @param {number} idCliente - ID del cliente
 */
export async function validarCarritoParaCheckout(idCliente) {
  // Limpiar reservas expiradas primero
  await limpiarReservasExpiradas();

  // Obtener carrito actual
  const { data: reservas, error } = await supabase
    .from("reservas")
    .select(`
      id_reserva,
      id_producto,
      cantidad,
      fecha_expiracion,
      productos (
        nombre,
        precio_venta,
        stock_total,
        estado
      )
    `)
    .eq("id_cliente", idCliente)
    .gt("fecha_expiracion", new Date().toISOString());

  if (error) {
    return { 
      valido: false, 
      errores: ["Error al validar el carrito"],
      items: []
    };
  }

  if (!reservas || reservas.length === 0) {
    return { 
      valido: false, 
      errores: ["El carrito está vacío"],
      items: []
    };
  }

  const errores = [];
  const itemsValidados = [];

  for (const reserva of reservas) {
    const producto = reserva.productos;
    
    if (!producto) {
      errores.push(`Producto ${reserva.id_producto} no encontrado`);
      continue;
    }

    // Verificar que el producto esté activo
    if (producto.estado !== 'activo') {
      errores.push(`${producto.nombre} ya no está disponible`);
      continue;
    }

    // Calcular stock disponible real
    const { data: otrasReservas } = await supabase
      .from("reservas")
      .select("cantidad")
      .eq("id_producto", reserva.id_producto)
      .neq("id_reserva", reserva.id_reserva)
      .gt("fecha_expiracion", new Date().toISOString());

    const stockReservadoPorOtros = otrasReservas?.reduce((sum, r) => sum + r.cantidad, 0) || 0;
    const stockDisponible = producto.stock_total - stockReservadoPorOtros;

    // Verificar stock suficiente
    if (reserva.cantidad > stockDisponible) {
      if (stockDisponible > 0) {
        errores.push(`${producto.nombre}: solo quedan ${stockDisponible} unidades disponibles`);
      } else {
        errores.push(`${producto.nombre} está agotado`);
      }
      continue;
    }

    // Item válido
    itemsValidados.push({
      id_reserva: reserva.id_reserva,
      id_producto: reserva.id_producto,
      nombre: producto.nombre,
      cantidad: reserva.cantidad,
      precio_unitario: producto.precio_venta,
      subtotal: reserva.cantidad * producto.precio_venta
    });
  }

  const total = itemsValidados.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    valido: errores.length === 0,
    errores,
    items: itemsValidados,
    total,
    cantidadItems: itemsValidados.reduce((sum, item) => sum + item.cantidad, 0)
  };
}
