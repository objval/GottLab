import { getProductos, getCategorias } from "@/lib/actions/productos";
import ProductosClient from "@/components/Productos";
import PageTransition from "@/components/PageTransition";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const pagina = Number(params?.pagina) || 1;
  const categoria = params?.categoria || "todas";
  const busqueda = params?.busqueda || "";
  const precio = params?.precio || "todos";
  const disponibilidad = params?.disponibilidad || "todos";

  const { productos, total } = await getProductos({
    pagina,
    porPagina: 12,
    categoria,
    busqueda,
    precio,
    disponibilidad,
  });

  const categorias = await getCategorias();

  return (
    <PageTransition>
      <ProductosClient
        productos={productos}
        total={total}
        pagina={pagina}
        categorias={categorias}
        filtros={{ categoria, busqueda, precio, disponibilidad }}
      />
    </PageTransition>
  );
}