-- Run AFTER 001 and after existing users are migrated to auth.users.
-- Enables Row Level Security on user-scoped tables.

-- ============================================================================
-- clientes: own row + admin override via JWT user_metadata
-- ============================================================================
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS clientes_select_own ON public.clientes;
CREATE POLICY clientes_select_own ON public.clientes
  FOR SELECT USING (auth_id = auth.uid());

DROP POLICY IF EXISTS clientes_update_own ON public.clientes;
CREATE POLICY clientes_update_own ON public.clientes
  FOR UPDATE USING (auth_id = auth.uid());

DROP POLICY IF EXISTS admin_read_clientes ON public.clientes;
CREATE POLICY admin_read_clientes ON public.clientes
  FOR SELECT USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- ============================================================================
-- empleados: authenticated users can read, admin can manage via user_metadata
-- ============================================================================
ALTER TABLE public.empleados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS empleados_read_auth ON public.empleados;
CREATE POLICY empleados_read_auth ON public.empleados
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS empleados_select_own ON public.empleados;
CREATE POLICY empleados_select_own ON public.empleados
  FOR SELECT USING (auth_id = auth.uid());

DROP POLICY IF EXISTS empleados_update_own ON public.empleados;
CREATE POLICY empleados_update_own ON public.empleados
  FOR UPDATE USING (auth_id = auth.uid());

DROP POLICY IF EXISTS empleados_admin_write ON public.empleados;
CREATE POLICY empleados_admin_write ON public.empleados
  FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- ============================================================================
-- reservas: users CRUD their own
-- ============================================================================
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS reservas_own ON public.reservas;
CREATE POLICY reservas_own ON public.reservas
  FOR ALL USING (
    id_cliente IN (
      SELECT id_cliente FROM public.clientes WHERE auth_id = auth.uid()
    )
  );

-- ============================================================================
-- direcciones: users CRUD their own
-- ============================================================================
ALTER TABLE public.direcciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS direcciones_own ON public.direcciones;
CREATE POLICY direcciones_own ON public.direcciones
  FOR ALL USING (
    id_cliente IN (
      SELECT id_cliente FROM public.clientes WHERE auth_id = auth.uid()
    )
  );
