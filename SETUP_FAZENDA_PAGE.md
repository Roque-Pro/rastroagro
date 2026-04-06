# Setup Página da Fazenda

## O que foi implementado

✅ Página compartilhável `/fazenda/{slug}`  
✅ QR Code para compartilhar página da fazenda  
✅ Redirecionamento automático após criar lote  
✅ Cards de lotes com filtros  
✅ Bio da fazenda com editor  
✅ Link de compartilhamento copiável  

## Procedimento de Implementação

### 1. Executar Migration SQL

No Supabase, vá para **SQL Editor** e execute este script:

```sql
-- Adicionar coluna slug
ALTER TABLE public.perfis 
ADD COLUMN IF NOT EXISTS slug character varying UNIQUE;

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_perfis_slug 
ON public.perfis(slug);

-- Atualizar registros existentes
UPDATE public.perfis 
SET slug = 'fazenda-' || EXTRACT(EPOCH FROM created_at)::bigint::text 
WHERE slug IS NULL;

-- Tornar NOT NULL
ALTER TABLE public.perfis 
ALTER COLUMN slug SET NOT NULL;
```

### 2. Fluxo de Uso

1. Produtor vai para `/novo-lote`
2. Cria novo lote
3. **Automatically**:
   - Se não tiver perfil, cria com `slug` = `fazenda-{timestamp}`
   - Lote é criado com `marketplace_visivel = true`
4. **Redireciona** para `/fazenda/{slug}`
5. Produtor vê sua página com:
   - Bio (editável)
   - Todos seus lotes em cards
   - Botões: Copiar Link + QR Code
6. Pode compartilhar via:
   - Link: `dominio/fazenda/{slug}`
   - QR Code
   - Link direto do Dashboard

### 3. Funcionalidades

**Página da Fazenda (`/fazenda/{slug}`)**:
- Bio editável (salva no Dashboard)
- WhatsApp e localização (se configurado)
- Stats: quantidade de lotes e tipos de cultivos
- Filtro por produto e data
- Cards clicáveis → rastreabilidade (`/check/{qrHash}`)

**Dashboard**:
- Botão "Ver Página da Minha Fazenda" atualizado
- ProfileEditor agora gera slug se não existir

**NewLote**:
- Cria slug automaticamente: `fazenda-{timestamp}`
- Redireciona para `/fazenda/{slug}` após sucesso

## Banco de Dados

Campo adicionado à tabela `perfis`:

```sql
slug VARCHAR UNIQUE NOT NULL
```

Com índice para otimizar buscas:

```sql
CREATE INDEX idx_perfis_slug ON public.perfis(slug);
```

## Compatibilidade

✅ Não quebra funcionalidades existentes:
- Dashboard ainda funciona
- LoteDetail ainda funciona
- Painel de safra intacto
- /check/{qrHash} intacto
- /produtor/{producerId} intacto

## Testes Necessários

1. Novo produtor registra lote → vê página da fazenda
2. Clica QR Code → gera imagem
3. Clica Copiar Link → funciona
4. Filtros funcionam
5. Card de lote → abre rastreabilidade
6. Bio editável no Dashboard

---

**Status**: Pronto para deploy
