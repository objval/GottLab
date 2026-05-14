// Minimal Supabase Database types.
// The actual types are validated by Supabase at runtime.
// For full type generation: npx supabase gen types typescript --linked > types/supabase.ts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>

export interface Database {
  public: {
    Tables: {
      productos: { Row: Row; Insert: Row; Update: Row }
      categorias: { Row: Row; Insert: Row; Update: Row }
      clientes: { Row: Row; Insert: Row; Update: Row }
      empleados: { Row: Row; Insert: Row; Update: Row }
      reservas: { Row: Row; Insert: Row; Update: Row }
      pedidos: { Row: Row; Insert: Row; Update: Row }
      imagenes_productos: { Row: Row; Insert: Row; Update: Row }
      direcciones: { Row: Row; Insert: Row; Update: Row }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
