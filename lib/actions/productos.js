"use server";

import { supabase } from "../supabaseServer";

export async function getProductos({ pagina = 1, porPagina = 12, categoria = "", busqueda = "", precio = "", disponibilidad = "" } = {}) {
  const desde = (pagina - 1) * porPagina;
  const hasta = desde + porPagina - 1;

  let query = supabase
    .from("productos")
    .select(`
      id_producto,
      nombre,
      nombre_cientifico,
      descripcion,
      precio_venta,
      stock_total,
      estado,
      destacado,
      nuevo,
      prioridad,
      id_categoria,
      categorias (
        nombre
      ),
      imagenes_productos (
        url
      )
    `, { count: "exact" });

  if (categoria && categoria !== "todas") {
    const nombres = categoria.split(',').map(c => c.trim()).filter(Boolean)
    if (nombres.length === 1) {
      const { data: cat } = await supabase
        .from("categorias")
        .select("id_categoria")
        .eq("nombre", nombres[0])
        .single();
      if (cat) {
        query = query.eq("id_categoria", cat.id_categoria);
      }
    } else if (nombres.length > 1) {
      const { data: cats } = await supabase
        .from("categorias")
        .select("id_categoria")
        .in("nombre", nombres);
      if (cats && cats.length > 0) {
        const ids = cats.map(c => c.id_categoria)
        query = query.in("id_categoria", ids);
      }
    }
  }

  if (busqueda) {
    query = query.or(`nombre.ilike.%${busqueda}%,nombre_cientifico.ilike.%${busqueda}%`);
  }

  if (disponibilidad === "stock") {
    query = query.gt("stock_total", 0);
  } else if (disponibilidad === "agotado") {
    query = query.eq("stock_total", 0);
  }

  if (precio === "0-5000") {
    query = query.lte("precio_venta", 5000);
  } else if (precio === "5000-15000") {
    query = query.gt("precio_venta", 5000).lte("precio_venta", 15000);
  } else if (precio === "15000-30000") {
    query = query.gt("precio_venta", 15000).lte("precio_venta", 30000);
  } else if (precio === "30000+") {
    query = query.gt("precio_venta", 30000);
  }

  query = query.order("prioridad", { ascending: false }).range(desde, hasta);

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    return { productos: [], total: 0 };
  }

  return { productos: data, total: count || 0 };
}

export async function getCategorias() {
  const { data, error } = await supabase
    .from("categorias")
    .select("nombre");

  if (error) {
    console.error(error);
    return [];
  }

  const nombres = data.map((c) => c.nombre?.trim()).filter(Boolean);
  const unicos = [...new Set(nombres)].sort();
  return unicos;
}

export async function getDestacados(limit = 4) {
  const { data, error } = await supabase
    .from("productos")
    .select(`
      id_producto,
      nombre,
      nombre_cientifico,
      precio_venta,
      stock_total,
      destacado,
      nuevo,
      prioridad,
      categorias (
        nombre
      ),
      imagenes_productos (
        url
      )
    `)
    .eq("destacado", true)
    .order("prioridad", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  // Si no hay suficientes destacados, rellenar con otros productos
  if (data.length < limit) {
    const ids = data.map((p) => p.id_producto);
    const { data: extras } = await supabase
      .from("productos")
      .select(`
        id_producto,
        nombre,
        nombre_cientifico,
        precio_venta,
        stock_total,
        destacado,
        nuevo,
        prioridad,
        categorias (
          nombre
        ),
        imagenes_productos (
          url
        )
      `)
      .not("id_producto", "in", `(${ids.join(",")})`)
      .order("prioridad", { ascending: false })
      .limit(limit - data.length);
    if (extras) {
      return [...data, ...extras];
    }
  }

  return data;
}

export async function getNuevos(limit = 6) {
  const { data, error } = await supabase
    .from("productos")
    .select(`
      id_producto,
      nombre,
      nombre_cientifico,
      descripcion,
      precio_venta,
      stock_total,
      destacado,
      nuevo,
      prioridad,
      categorias (
        nombre
      ),
      imagenes_productos (
        url
      )
    `)
    .eq("nuevo", true)
    .order("prioridad", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  // Si no hay suficientes nuevos, rellenar con otros productos
  if (data.length < limit) {
    const ids = data.map((p) => p.id_producto);
    const { data: extras } = await supabase
      .from("productos")
      .select(`
        id_producto,
        nombre,
        nombre_cientifico,
        descripcion,
        precio_venta,
        stock_total,
        destacado,
        nuevo,
        prioridad,
        categorias (
          nombre
        ),
        imagenes_productos (
          url
        )
      `)
      .not("id_producto", "in", `(${ids.join(",")})`)
      .order("prioridad", { ascending: false })
      .limit(limit - data.length);
    if (extras) {
      return [...data, ...extras];
    }
  }

  return data;
}

export async function getProductoById(id) {
  const { data, error } = await supabase
    .from("productos")
    .select(`
      id_producto,
      nombre,
      nombre_cientifico,
      descripcion,
      precio_venta,
      precio_costo,
      stock_total,
      estado,
      tipo_venta,
      id_categoria,
      categorias (
        nombre
      ),
      imagenes_productos (
        url,
        es_principal,
        orden
      )
    `)
    .eq("id_producto", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}