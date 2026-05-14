"use server";

import { supabase } from "../supabaseServer";

const EXPIRACION_MINUTOS = 15;

async function limpiarReservasExpiradas() {
  const ahora = new Date();
  const tiempoExpiracion = new Date(ahora.getTime() - EXPIRACION_MINUTOS * 60000);
  await supabase.from("reservas").delete().lt("fecha_expiracion", tiempoExpiracion.toISOString());
}

export async function getCarrito(idCliente: number) {
  await limpiarReservasExpiradas();
  const { data, error } = await supabase
    .from("reservas")
    .select(`id_reserva, id_producto, cantidad, fecha_expiracion, productos (nombre, nombre_cientifico, precio_venta, stock_total, imagenes_productos (url))`)
    .eq("id_cliente", idCliente)
    .gt("fecha_expiracion", new Date().toISOString());
  if (error) { console.error("Error obteniendo carrito:", error); return []; }
  return data || [];
}

export async function agregarAlCarrito(idCliente: number, idProducto: number, cantidad = 1) {
  await limpiarReservasExpiradas();
  const { data: producto } = await supabase.from("productos").select("stock_total").eq("id_producto", idProducto).single();
  if (!producto) return { success: false, error: "Producto no encontrado" };

  const { data: reservasActivas } = await supabase.from("reservas").select("cantidad").eq("id_producto", idProducto).gt("fecha_expiracion", new Date().toISOString());
  const stockReservado = reservasActivas?.reduce((sum: number, r: any) => sum + r.cantidad, 0) || 0;
  const stockDisponible = producto.stock_total - stockReservado;

  if (cantidad > stockDisponible) return { success: false, error: `Solo hay ${stockDisponible} unidades disponibles` };

  const { data: reservaExistente } = await supabase.from("reservas").select("id_reserva, cantidad").eq("id_cliente", idCliente).eq("id_producto", idProducto).gt("fecha_expiracion", new Date().toISOString()).single();
  const fechaExpiracion = new Date(Date.now() + EXPIRACION_MINUTOS * 60000);

  if (reservaExistente) {
    const nuevaCantidad = reservaExistente.cantidad + cantidad;
    if (nuevaCantidad > stockDisponible) return { success: false, error: `Solo puedes agregar ${stockDisponible - reservaExistente.cantidad} unidades mas` };
    const { error } = await supabase.from("reservas").update({ cantidad: nuevaCantidad, fecha_expiracion: fechaExpiracion.toISOString() }).eq("id_reserva", reservaExistente.id_reserva);
    if (error) return { success: false, error: "Error al actualizar el carrito" };
    return { success: true, message: "Cantidad actualizada" };
  }

  const { error } = await supabase.from("reservas").insert({ id_cliente: idCliente, id_producto: idProducto, cantidad, fecha_expiracion: fechaExpiracion.toISOString() });
  if (error) return { success: false, error: "Error al agregar al carrito" };
  return { success: true, message: "Producto agregado al carrito" };
}

export async function actualizarCantidad(idReserva: number, nuevaCantidad: number) {
  if (nuevaCantidad < 1) return eliminarDelCarrito(idReserva);
  const { data: reserva } = await supabase.from("reservas").select("id_producto, cantidad").eq("id_reserva", idReserva).single();
  if (!reserva) return { success: false, error: "Reserva no encontrada" };
  const { data: producto } = await supabase.from("productos").select("stock_total").eq("id_producto", reserva.id_producto).single();
  const { data: otrasReservas } = await supabase.from("reservas").select("cantidad").eq("id_producto", reserva.id_producto).neq("id_reserva", idReserva).gt("fecha_expiracion", new Date().toISOString());
  const stockReservadoPorOtros = otrasReservas?.reduce((sum: number, r: any) => sum + r.cantidad, 0) || 0;
  const stockDisponible = (producto as any).stock_total - stockReservadoPorOtros;
  if (nuevaCantidad > stockDisponible) return { success: false, error: `Solo hay ${stockDisponible} unidades disponibles` };
  const fechaExpiracion = new Date(Date.now() + EXPIRACION_MINUTOS * 60000);
  const { error } = await supabase.from("reservas").update({ cantidad: nuevaCantidad, fecha_expiracion: fechaExpiracion.toISOString() }).eq("id_reserva", idReserva);
  if (error) return { success: false, error: "Error al actualizar cantidad" };
  return { success: true, message: "Cantidad actualizada" };
}

export async function eliminarDelCarrito(idReserva: number) {
  const { error } = await supabase.from("reservas").delete().eq("id_reserva", idReserva);
  if (error) return { success: false, error: "Error al eliminar del carrito" };
  return { success: true, message: "Producto eliminado del carrito" };
}

export async function vaciarCarrito(idCliente: number) {
  const { error } = await supabase.from("reservas").delete().eq("id_cliente", idCliente);
  if (error) return { success: false, error: "Error al vaciar el carrito" };
  return { success: true, message: "Carrito vaciado" };
}

export async function getContadorCarrito(idCliente: number) {
  await limpiarReservasExpiradas();
  const { data, error } = await supabase.from("reservas").select("cantidad").eq("id_cliente", idCliente).gt("fecha_expiracion", new Date().toISOString());
  if (error) return 0;
  return data?.reduce((sum: number, r: any) => sum + r.cantidad, 0) || 0;
}

export async function validarCarritoParaCheckout(idCliente: number) {
  await limpiarReservasExpiradas();
  const { data: reservas, error } = await supabase
    .from("reservas")
    .select(`id_reserva, id_producto, cantidad, fecha_expiracion, productos (nombre, precio_venta, stock_total, estado)`)
    .eq("id_cliente", idCliente)
    .gt("fecha_expiracion", new Date().toISOString());
  if (error) return { valido: false, errores: ["Error al validar el carrito"], items: [] };
  if (!reservas || reservas.length === 0) return { valido: false, errores: ["El carrito esta vacio"], items: [] };

  const errores: string[] = [];
  const itemsValidados: any[] = [];
  for (const reserva of reservas as any[]) {
    const producto = reserva.productos as any;
    if (!producto) { errores.push(`Producto ${reserva.id_producto} no encontrado`); continue; }
    if (producto.estado !== 'activo') { errores.push(`${producto.nombre} ya no esta disponible`); continue; }
    const { data: otrasReservas } = await supabase.from("reservas").select("cantidad").eq("id_producto", reserva.id_producto).neq("id_reserva", reserva.id_reserva).gt("fecha_expiracion", new Date().toISOString());
    const stockReservadoPorOtros = otrasReservas?.reduce((sum: number, r: any) => sum + r.cantidad, 0) || 0;
    const stockDisponible = (producto as any).stock_total - stockReservadoPorOtros;
    if (reserva.cantidad > stockDisponible) {
      if (stockDisponible > 0) errores.push(`${producto.nombre}: solo quedan ${stockDisponible} unidades disponibles`);
      else errores.push(`${producto.nombre} esta agotado`);
      continue;
    }
    itemsValidados.push({ id_reserva: reserva.id_reserva, id_producto: reserva.id_producto, nombre: producto.nombre, cantidad: reserva.cantidad, precio_unitario: producto.precio_venta, subtotal: reserva.cantidad * producto.precio_venta });
  }
  const total = itemsValidados.reduce((sum: number, item: any) => sum + item.subtotal, 0);
  return { valido: errores.length === 0, errores, items: itemsValidados, total, cantidadItems: itemsValidados.reduce((sum: number, item: any) => sum + item.cantidad, 0) };
}
