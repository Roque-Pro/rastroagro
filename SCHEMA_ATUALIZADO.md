# Schema Atualizado com Mini Página Pública

## Tabela `perfis` - COM NOVO CAMPO BIO

```sql
CREATE TABLE public.perfis (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  nome_fazenda character varying NOT NULL,
  cpf_cnpj character varying UNIQUE,
  email character varying,
  telefone character varying,
  plano character varying DEFAULT 'free'::character varying 
    CHECK (plano::text = ANY (ARRAY['free'::character varying, 'pro'::character varying, 'enterprise'::character varying]::text[])),
  user_role character varying DEFAULT 'produtor'::character varying 
    CHECK (user_role::text = ANY (ARRAY['produtor'::character varying, 'comprador'::character varying, 'admin'::character varying]::text[])),
  whatsapp character varying,
  localizacao jsonb,
  
  -- NOVO CAMPO PARA MINI PÁGINA
  bio text,  -- Descrição da fazenda (até 500 caracteres validado no frontend)
  
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  
  CONSTRAINT perfis_pkey PRIMARY KEY (id),
  CONSTRAINT perfis_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
```

## Alteração SQL para Adicionar Campo

Se a tabela já existe, execute:

```sql
ALTER TABLE public.perfis 
ADD COLUMN bio text;
```

## Índices Recomendados

```sql
-- Para melhor performance na busca de produtores na mini página
CREATE INDEX IF NOT EXISTS idx_perfis_user_role 
ON public.perfis(user_role);

-- Para buscas por nome da fazenda
CREATE INDEX IF NOT EXISTS idx_perfis_nome_fazenda 
ON public.perfis(nome_fazenda);
```

## Tabelas Relacionadas (sem alterações)

As tabelas abaixo continuam as mesmas e trabalham perfeitamente com a mini página:

### `lotes`
- Conecta produtor ao seu histórico de safras
- Campo `marketplace_visivel` controla se aparece em buscas públicas
- Campo `qr_hash` gera link de rastreabilidade

### `eventos_manejo`
- Registra fases de cada lote
- Conectado ao lote_id
- Suporta foto, observações e localização

### `ofertas_mercado`
- Sistema de ofertas de preço por lote
- Controla quantidade disponível
- Integra com leads de negociação

### `leads_negociacao`
- Rastreia interesse de compradores
- Status: novo → contatado → negociando → fechado
- Integra produtor com comprador

## Query de Teste

Para testar se o campo foi adicionado corretamente:

```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM 
  information_schema.columns 
WHERE 
  table_name = 'perfis' 
ORDER BY 
  ordinal_position;
```

## Dados Esperados no Campo Bio

- **Tipo**: TEXT
- **Tamanho máximo**: 500 caracteres (validado no frontend)
- **Obrigatório**: NÃO (NULL é permitido)
- **Exemplo**: "Produção sustentável de feijão carioca desde 1995. Métodos tradicionais combinados com tecnologia moderna. Certificação orgânica em andamento."

## Migrations Resumidas

| Operação | SQL | Status |
|----------|-----|--------|
| Criar campo bio | `ALTER TABLE perfis ADD COLUMN bio text;` | ✅ Necessário |
| Criar índice user_role | `CREATE INDEX idx_perfis_user_role ON perfis(user_role);` | ✅ Recomendado |
| Criar índice nome | `CREATE INDEX idx_perfis_nome_fazenda ON perfis(nome_fazenda);` | ✅ Opcional |

---

**Status**: Schema completo e pronto para produção!
