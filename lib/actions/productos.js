"use server";

import { supabase } from "../supabaseServer";

const PRODUCTO_SELECT = `
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
`;

const uniqueById = (items = []) => {
  const map = new Map();
  items.forEach((item) => {
    if (!map.has(item.id_producto)) map.set(item.id_producto, item);
  });
  return Array.from(map.values());
};

export async function getProductos({ pagina = 1, porPagina = 12, categoria = "", busqueda = "", precio = "", disponibilidad = "" } = {}) {
  const desde = (pagina - 1) * porPagina;
  const hasta = desde + porPagina - 1;

  let query = supabase
    .from("productos")
    .select(PRODUCTO_SELECT, { count: "exact" })
    .eq("estado", "activo");

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

  query = query
    .order("destacado", { ascending: false })
    .order("prioridad", { ascending: false })
    .range(desde, hasta);

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
    .select(PRODUCTO_SELECT)
    .eq("estado", "activo")
    .eq("destacado", true)
    .order("prioridad", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  let resultado = uniqueById(data);

  if (resultado.length < limit) {
    const ids = resultado.map((p) => p.id_producto);
    let extrasQuery = supabase
      .from("productos")
      .select(PRODUCTO_SELECT)
      .eq("estado", "activo")
      .order("destacado", { ascending: false })
      .order("prioridad", { ascending: false })
      .limit(limit - resultado.length);

    if (ids.length > 0) {
      extrasQuery = extrasQuery.not("id_producto", "in", `(${ids.join(",")})`);
    }

    const { data: extras, error: extrasError } = await extrasQuery;
    if (extrasError) {
      console.error(extrasError);
    }
    if (extras) {
      resultado = uniqueById([...resultado, ...extras]);
    }
  }

  return resultado.slice(0, limit);
}

export async function getNuevos(limit = 6) {
  const { data, error } = await supabase
    .from("productos")
    .select(PRODUCTO_SELECT)
    .eq("estado", "activo")
    .eq("nuevo", true)
    .order("prioridad", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  let resultado = uniqueById(data);

  if (resultado.length < limit) {
    const ids = resultado.map((p) => p.id_producto);
    let extrasQuery = supabase
      .from("productos")
      .select(PRODUCTO_SELECT)
      .eq("estado", "activo")
      .order("nuevo", { ascending: false })
      .order("destacado", { ascending: false })
      .order("prioridad", { ascending: false })
      .limit(limit - resultado.length);

    if (ids.length > 0) {
      extrasQuery = extrasQuery.not("id_producto", "in", `(${ids.join(",")})`);
    }

    const { data: extras, error: extrasError } = await extrasQuery;
    if (extrasError) {
      console.error(extrasError);
    }
    if (extras) {
      resultado = uniqueById([...resultado, ...extras]);
    }
  }

  return resultado.slice(0, limit);
}

export async function getHeroProductos(limit = 4) {
  const { data, error } = await supabase
    .from("productos")
    .select(PRODUCTO_SELECT)
    .eq("estado", "activo")
    .or("destacado.eq.true,nuevo.eq.true,prioridad.gte.10")
    .order("destacado", { ascending: false })
    .order("nuevo", { ascending: false })
    .order("prioridad", { ascending: false })
    .limit(limit * 2);

  if (error) {
    console.error(error);
    return [];
  }

  let resultado = uniqueById(data).slice(0, limit);

  if (resultado.length < limit) {
    const ids = resultado.map((p) => p.id_producto);
    let extrasQuery = supabase
      .from("productos")
      .select(PRODUCTO_SELECT)
      .eq("estado", "activo")
      .order("prioridad", { ascending: false })
      .limit(limit - resultado.length);

    if (ids.length > 0) {
      extrasQuery = extrasQuery.not("id_producto", "in", `(${ids.join(",")})`);
    }

    const { data: extras, error: extrasError } = await extrasQuery;
    if (extrasError) {
      console.error(extrasError);
    }
    if (extras) {
      resultado = uniqueById([...resultado, ...extras]).slice(0, limit);
    }
  }

  return resultado.slice(0, limit);
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