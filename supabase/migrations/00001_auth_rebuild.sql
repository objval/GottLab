-- GottLab Auth Rebuild — Migration 001
-- Run FIRST in Supabase SQL Editor before deploying.
-- Safe: only adds columns + trigger. No RLS changes.

ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.clientes ALTER COLUMN id_usuario DROP NOT NULL;

ALTER TABLE public.empleados
  ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.empleados ALTER COLUMN id_usuario DROP NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_client()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.clientes (auth_id, nombre, apellido, email, rut, telefono, id_usuario)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'rut',
    NEW.raw_user_meta_data->>'telefono',
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_user_meta_data->>'role' IS NULL OR NEW.raw_user_meta_data->>'role' = 'cliente')
  EXECUTE FUNCTION public.handle_new_client();
