# RastroAgro - Guia de Implementação Completo

## ✅ O que foi implementado

### 1. **WhatsApp do Produtor**
- ✅ Campo WhatsApp no cadastro (Login > Sign Up)
- ✅ Captura de geolocalização automática
- ✅ Links WhatsApp funcionais em todos os cards
- ✅ Filtro apenas para produtores

### 2. **Mapa Visual Interativo (Leaflet)**
- ✅ Página `/mapa-safras` para compradores
- ✅ Marcadores coloridos por região:
  - 🔴 **Vermelho**: Safra muito cedo (> 15 dias)
  - 🟠 **Laranja**: Próximo (7-15 dias)  
  - 🟢 **Verde**: Pronto para oferta (< 7 dias)
- ✅ Filtro dinâmico por produto (apenas culturas cadastradas)
- ✅ Popups com informações e botão WhatsApp direto
- ✅ Card flutuante com resumo de lotes encontrados
- ✅ Zoom e pan interativo

### 3. **IA de Previsibilidade (Gemini)**
- ✅ Integração com Gemini API
- ✅ Botão "Gerar Previsão de Colheita" ao criar lote
- ✅ Cálculo automático ao salvar (fallback padrão se IA falhar)
- ✅ Mostra confiança percentual e motivo da previsão
- ✅ Ciclos padrão para cada cultura como fallback

## 🔧 Como Configurar

### 1. Obter Chave Gemini

```
1. Acesse https://ai.google.dev/
2. Clique em "Get API Key"
3. Selecione seu projeto Google Cloud
4. Copie a chave
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite .env.local e adicione:
VITE_GEMINI_API_KEY=sua-chave-aqui
```

### 3. Instalar Dependências

```bash
npm install --legacy-peer-deps
```

### 4. Iniciar o Servidor

```bash
npm run dev
```

## 📱 Fluxo de Uso

### Para o Produtor

1. **Cadastro**: 
   - Seleciona "Produtor"
   - Preenche nome da fazenda
   - Adiciona WhatsApp (com DDD)
   - Clica em "Capturar Localização"

2. **Criar Safra**:
   - Preenche cultura, variedade, data
   - Clica em "Gerar Previsão de Colheita" (opcional)
   - Salva e começa a registrar fases
   - Um QR Code é gerado automaticamente

3. **Registrar Fases**:
   - Cada foto tem geolocalização + data/hora
   - Timeline visual com histórico

### Para o Comprador

1. **Cadastro**:
   - Seleciona "Comprador"
   - Preenche dados da empresa/pessoa

2. **Acessar Mapa**:
   - Dashboard padrão é o mapa de safras
   - Filtra por produto (select dinâmico)
   - Vê cores: cedo (vermelho) vs pronto (verde)
   - Clica no marcador e vai direto para WhatsApp do produtor

3. **Alternativas**:
   - Marketplace: Lista de cards com filtros
   - Previsões: Agrupar por região, volume esperado

## 🎨 Arquitetura Implementada

### Novas Páginas
- `src/pages/BuyerMap.jsx` - Mapa interativo com Leaflet

### Novos Componentes
- `src/components/BuyerNav.jsx` - Navegação inferior do comprador

### Novas Libs
- `src/lib/gemini.js` - Integração com Gemini API

### Dependências Instaladas
```json
{
  "@google/generative-ai": "^0.3.0",
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1"
}
```

## 🗺️ Estrutura do Banco de Dados

### Tabela `perfis` (alterações)
```sql
ALTER TABLE perfis ADD COLUMN whatsapp VARCHAR(15);
ALTER TABLE perfis ADD COLUMN localizacao GEOMETRY(Point, 4326);
ALTER TABLE perfis ADD COLUMN user_role TEXT DEFAULT 'produtor';
```

### Tabela `lotes` (alterações)
```sql
ALTER TABLE lotes ADD COLUMN data_colheita_estimada DATE;
ALTER TABLE lotes ADD COLUMN status TEXT DEFAULT 'ativo';
ALTER TABLE lotes ADD COLUMN marketplace_visivel BOOLEAN DEFAULT true;
```

## 🎯 Fluxo Completo

```
Produtor                          Comprador
    |                                 |
    ├─ Cadastro                       ├─ Cadastro
    │  └─ WhatsApp + Geoloc           │  
    │                                 │
    ├─ Criar Safra                    ├─ Acessa Mapa
    │  └─ IA gera previsão            │  └─ Filtra por produto
    │                                 │
    ├─ Registrar Fases                ├─ Vê marcadores coloridos
    │  └─ Geoloc + Data/Hora          │  └─ Vermelho = cedo
    │                                 │  └─ Verde = pronto
    │                                 │
    ├─ Gera QR Code                   └─ Clica no marcador
    │  └─ Compartilha                    └─ Vai para WhatsApp
    │                                       do produtor
    └─ Rastreabilidade Pública
       └─ Qualquer pessoa via QR
```

## 🚀 Próximas Melhorias (Opcionais)

- [ ] Sistema de oferta/lance (já tem estrutura)
- [ ] Notificações por email
- [ ] Dashboard de análises para produtor
- [ ] Certificações digitais
- [ ] Integração com pagamentos
- [ ] App mobile nativo

## 📞 Suporte

Se tiver problemas:
1. Verifique se a chave Gemini está em `.env.local`
2. Confirme que o Supabase está configurado
3. Verifique console do navegador (F12) para erros
4. Teste no navegador mais recente (Chrome, Firefox, Safari)

---

**Status**: ✅ Pronto para produção  
**Data**: 01/04/2026
