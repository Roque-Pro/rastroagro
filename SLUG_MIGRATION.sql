-- Adicionar coluna slug na tabela perfis (com default para registros existentes)
ALTER TABLE public.perfis 
ADD COLUMN slug VARCHAR UNIQUE;

-- Criar índice para busca rápida por slug
CREATE INDEX IF NOT EXISTS idx_perfis_slug 
ON public.perfis(slug);

-- Atualizar registros existentes com slug padrão
UPDATE public.perfis 
SET slug = 'fazenda-' || EXTRACT(EPOCH FROM created_at)::bigint::text 
WHERE slug IS NULL;

-- Tornar coluna NOT NULL após popular
ALTER TABLE public.perfis 
ALTER COLUMN slug SET NOT NULL;
