-- =====================================================
-- DISABLE RLS TEMPORARIAMENTE PARA TESTES
-- =====================================================
-- Execute este script se o 406 continuar aparecendo

ALTER TABLE public.perfis DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_manejo DISABLE ROW LEVEL SECURITY;

-- Agora o app deve funcionar
-- Depois, quando tudo funcionar, execute FIX_RLS.sql para re-habilitar com políticas corretas
