-- Run AFTER 001 and after existing users are migrated to auth.users.
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clientes_select_own" ON public.clientes;
CREATE POLICY "clientes_select_own" ON public.clientes FOR SELECT USING (auth_id = auth.uid());
DROP POLICY IF EXISTS "clientes_update_own" ON public.clientes;
CREATE POLICY "clientes_update_own" ON public.clientes FOR UPDATE USING (auth_id = auth.uid());
DROP POLICY IF EXISTS "staff_read_clientes" ON public.clientes;
CREATE POLICY "staff_read_clientes" ON public.clientes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.empleados WHERE auth_id = auth.uid() AND estado = 'activo')
);

ALTER TABLE public.empleados ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "empleados_select_own" ON public.empleados;
CREATE POLICY "empleados_select_own" ON public.empleados FOR SELECT USING (auth_id = auth.uid());
DROP POLICY IF EXISTS "empleados_update_own" ON public.empleados;
CREATE POLICY "empleados_update_own" ON public.empleados FOR UPDATE USING (auth_id = auth.uid());
DROP POLICY IF EXISTS "admin_manage_empleados" ON public.empleados;
CREATE POLICY "admin_manage_empleados" ON public.empleados FOR ALL USING (
  EXISTS (SELECT 1 FROM public.empleados e WHERE e.auth_id = auth.uid() AND e.cargo = 'admin' AND e.estado = 'activo')
);

ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reservas_own" ON public.reservas;
CREATE POLICY "reservas_own" ON public.reservas FOR ALL USING (
  id_cliente IN (SELECT id_cliente FROM public.clientes WHERE auth_id = auth.uid())
);

ALTER TABLE public.direcciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "direcciones_own" ON public.direcciones;
CREATE POLICY "direcciones_own" ON public.direcciones FOR ALL USING (
  id_cliente IN (SELECT id_cliente FROM public.clientes WHERE auth_id = auth.uid())
);
