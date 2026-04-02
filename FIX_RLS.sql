-- =====================================================
-- FIX: Habilitar RLS (Row Level Security) para leitura
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. Habilitar RLS na tabela perfis
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- 2. Permitir que usuários leiam seu próprio perfil
CREATE POLICY "Usuários podem ler seu próprio perfil"
ON public.perfis
FOR SELECT
USING (auth.uid() = user_id);

-- 3. Permitir que usuários insiram seu próprio perfil
CREATE POLICY "Usuários podem inserir seu próprio perfil"
ON public.perfis
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
ON public.perfis
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Habilitar RLS na tabela lotes
ALTER TABLE public.lotes ENABLE ROW LEVEL SECURITY;

-- 6. Permitir que produtores leiam seus lotes
CREATE POLICY "Produtores podem ler seus lotes"
ON public.lotes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.perfis
    WHERE perfis.id = lotes.produtor_id
    AND perfis.user_id = auth.uid()
  )
);

-- 7. Permitir que compradores leiam lotes visíveis no marketplace
CREATE POLICY "Compradores podem ler lotes visíveis"
ON public.lotes
FOR SELECT
USING (marketplace_visivel = true);

-- 8. Habilitar RLS na tabela eventos_manejo
ALTER TABLE public.eventos_manejo ENABLE ROW LEVEL SECURITY;

-- 9. Permitir que produtores leiam eventos de seus lotes
CREATE POLICY "Produtores podem ler eventos de seus lotes"
ON public.eventos_manejo
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.lotes
    WHERE lotes.id = eventos_manejo.lote_id
    AND EXISTS (
      SELECT 1 FROM public.perfis
      WHERE perfis.id = lotes.produtor_id
      AND perfis.user_id = auth.uid()
    )
  )
);

-- 10. Permitir que qualquer um leia eventos de lotes públicos (via QR)
CREATE POLICY "Qualquer um pode ler eventos de lotes públicos"
ON public.eventos_manejo
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.lotes
    WHERE lotes.id = eventos_manejo.lote_id
    AND lotes.marketplace_visivel = true
  )
);

-- 11. Inserir eventos
CREATE POLICY "Produtores podem inserir eventos em seus lotes"
ON public.eventos_manejo
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.lotes
    WHERE lotes.id = eventos_manejo.lote_id
    AND EXISTS (
      SELECT 1 FROM public.perfis
      WHERE perfis.id = lotes.produtor_id
      AND perfis.user_id = auth.uid()
    )
  )
);

-- ✅ Pronto! RLS está habilitado e configurado
