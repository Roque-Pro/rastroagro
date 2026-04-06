# Checklist: Banco de Dados para Mini Página Pública

## 📋 Verificação Rápida

Baseado no schema que você colou em `ia.txt`, aqui está o que **FALTA**:

### ❌ Campo Faltante na Tabela `perfis`

**Campo**: `bio`  
**Tipo**: `text`  
**Obrigatório**: NÃO (nullable)  
**Tamanho**: Até 500 caracteres (validado no frontend)  
**Descrição**: Bio/descrição da fazenda para a mini página pública

### ✅ Tudo Mais Já Existe

As seguintes tabelas/campos **JÁ ESTÃO** no seu schema:

- ✅ `perfis.id` - ID do produtor
- ✅ `perfis.nome_fazenda` - Nome exibido na mini página
- ✅ `perfis.user_role` - Diferencia produtor de comprador
- ✅ `perfis.whatsapp` - Botão de contato
- ✅ `perfis.localizacao` - Geolocalização
- ✅ `lotes.produtor_id` - Conecta lote ao produtor
- ✅ `lotes.cultura` - Usado nos filtros
- ✅ `lotes.data_inicio` - Usado nos filtros de data
- ✅ `lotes.marketplace_visivel` - Controla visibilidade
- ✅ `lotes.qr_hash` - Link de rastreabilidade
- ✅ `eventos_manejo` - Registra fases

---

## 🚀 O que Fazer Agora

### Passo 1: Executar Migration no Supabase

Acesse seu Supabase → SQL Editor → Execute:

```sql
ALTER TABLE public.perfis 
ADD COLUMN bio text;
```

Pronto! O campo estará disponível.

### Passo 2: (Opcional) Criar Índices para Performance

```sql
CREATE INDEX IF NOT EXISTS idx_perfis_user_role 
ON public.perfis(user_role);
```

### Passo 3: Testar a Implementação

1. Faça login no app
2. Crie um novo produtor
3. Preencha a bio (500 caracteres)
4. Acesse a mini página (`/produtor/:id`)
5. Teste os filtros

---

## 📊 Resumo da Implementação

| Aspecto | Status | Detalhes |
|---------|--------|----------|
| **Campo Bio** | ⏳ Pending SQL | Executar `ALTER TABLE` acima |
| **Página Mini Page** | ✅ Done | `src/pages/ProducerProfile.jsx` |
| **Filtros** | ✅ Done | Produto + Data |
| **Editor Bio** | ✅ Done | `src/components/ProfileEditor.jsx` |
| **Link Dashboard** | ✅ Done | Botão "Ver Minha Mini Página" |
| **Link Marketplace** | ✅ Done | Botão "Ver Fazenda" |
| **Build** | ✅ Done | Compilou sem erros |

---

## ⚠️ Importante

O app **FUNCIONARÁ** mesmo sem executar o `ALTER TABLE`, mas:
- Campo `bio` virá como `NULL`
- Usuários conseguem editar mas dados não serão salvos
- Após executar a migration, funcionará perfeitamente

---

## 🔧 Se Encontrar Problemas

### Erro: "column 'bio' does not exist"
Solução: Execute o SQL acima no Supabase

### Bio não salva
Verifique: Console do navegador (F12) → Network → verificar se POST para perfis está funcionando

### Filtros não funcionam
Verifique: Deve ter pelo menos 1 lote cadastrado para o produtor

---

**Status Final**: ✅ **Tudo pronto, só falta executar o SQL!**
