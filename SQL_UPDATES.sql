-- UPDATE SUPABASE: Adicionar campos faltantes para Mini Página Pública

-- 1. Adicionar campo BIO na tabela perfis
ALTER TABLE public.perfis ADD COLUMN bio text;

-- 2. Adicionar índice para melhor performance nas buscas de mini página
CREATE INDEX IF NOT EXISTS idx_perfis_user_role ON public.perfis(user_role);

-- 3. Verificar constraints existentes (executado como query, não statement)
-- SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='perfis';

-- 4. Garantir que bio tem limite de caracteres (não há LIMIT em texto no SQL puro, validação no app)
-- Validação ocorre no frontend (Login.jsx: 500 caracteres)

-- VERIFICAÇÃO: Confirmar que os campos existem
-- SELECT 
--   column_name, 
--   data_type, 
--   is_nullable 
-- FROM 
--   information_schema.columns 
-- WHERE 
--   table_name = 'perfis' 
-- ORDER BY 
--   ordinal_position;

-- ROLLBACK (se necessário):
-- ALTER TABLE public.perfis DROP COLUMN bio;
