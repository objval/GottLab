// Supabase Database types — minimal schema for build.
// Generate full types: npx supabase gen types typescript --linked > types/supabase.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      productos: {
        Row: {
          id_producto: number; nombre: string; nombre_cientifico: string | null
          descripcion: string | null; id_categoria: number | null
          tipo_venta: string | null; stock_total: number; stock_reservado: number
          precio_venta: number; precio_costo: number | null; estado: string | null
          destacado: boolean | null; nuevo: boolean | null; prioridad: number | null
        }
        Insert: Partial<Database['public']['Tables']['productos']['Row']>
        Update: Partial<Database['public']['Tables']['productos']['Row']>
      }
      categorias: {
        Row: { id_categoria: number; nombre: string }
        Insert: { nombre: string }; Update: { nombre?: string }
      }
      clientes: {
        Row: {
          id_cliente: number; id_usuario: number | null; auth_id: string | null
          nombre: string | null; apellido: string | null; email: string | null
          telefono: string | null; rut: string | null
        }
        Insert: Partial<Database['public']['Tables']['clientes']['Row']>
        Update: Partial<Database['public']['Tables']['clientes']['Row']>
      }
      empleados: {
        Row: {
          id_empleado: number; id_usuario: number | null; auth_id: string | null
          nombre: string | null; apellido: string | null; email: string | null
          telefono: string | null; rut: string | null; cargo: string | null; estado: string | null
        }
        Insert: Partial<Database['public']['Tables']['empleados']['Row']>
        Update: Partial<Database['public']['Tables']['empleados']['Row']>
      }
      reservas: {
        Row: { id_reserva: number; id_producto: number; id_cliente: number; cantidad: number; fecha_expiracion: string; estado: string | null }
        Insert: Partial<Database['public']['Tables']['reservas']['Row']>
        Update: Partial<Database['public']['Tables']['reservas']['Row']>
      }
      pedidos: {
        Row: { id_pedido: number; id_cliente: number; fecha: string; estado: string; total: number }
        Insert: Partial<Database['public']['Tables']['pedidos']['Row']>
        Update: Partial<Database['public']['Tables']['pedidos']['Row']>
      }
      imagenes_productos: {
        Row: { id_imagen: number; id_producto: number; url: string; es_principal: boolean; orden: number }
        Insert: Partial<Database['public']['Tables']['imagenes_productos']['Row']>
        Update: Partial<Database['public']['Tables']['imagenes_productos']['Row']>
      }
      direcciones: {
        Row: { id_direccion: number; id_cliente: number; pais: string | null; region: string | null; ciudad: string | null; comuna: string | null; direccion: string | null; codigo_postal: string | null; alias: string | null; tipo: string | null }
        Insert: Partial<Database['public']['Tables']['direcciones']['Row']>
        Update: Partial<Database['public']['Tables']['direcciones']['Row']>
      }
    }
    Views: {}; Functions: {}; Enums: {}; CompositeTypes: {}
  }
}
