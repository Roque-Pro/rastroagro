# RastroAgro 🌾

> Conectando produtor e consumidor através da rastreabilidade agrícola transparente

## O que é?

RastroAgro é uma **PWA (Progressive Web App)** de rastreabilidade agrícola que resolve um problema real: a falta de transparência entre quem planta e quem compra.

Produtores registram cada fase da safra com geolocalização automática, criam sua mini página pública com bio e histórico de lotes. Compradores veem em tempo real quando a colheita estará pronta, consultam o histórico completo, acessam a mini página do produtor e entram em contato direto via WhatsApp.

Simples? Sim. Eficiente? Muito.

---

## Por que foi criado?

O mercado agrícola funciona assim:
- Produtor planta, colhe e vende
- Comprador recebe e confia (ou não) na procedência
- Consumidor final não sabe nada sobre a origem do alimento

RastroAgro muda isso:
- ✅ Transparência total (fotos geolalizadas de cada fase)
- ✅ Previsão automática de colheita (com IA)
- ✅ Mini página pública por produtor com bio, filtros e histórico
- ✅ Comunicação direta produtor ↔ comprador
- ✅ Rastreabilidade pública via QR Code
- ✅ Zero digitação extra (geoloc e data/hora automáticas)

---

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 18 + Vite |
| **Estilo** | Tailwind CSS |
| **Animações** | Framer Motion |
| **Banco** | Supabase (PostgreSQL + RLS) |
| **Mapa** | Leaflet + React-Leaflet |
| **IA** | Google Gemini API |
| **Autenticação** | Supabase Auth |
| **Ícones** | Lucide React |
| **Geoloc** | Browser Geolocation API |

---

## Começar Rápido

### Pré-requisitos
- Node.js 16+
- Conta Supabase
- Chave Google Gemini API

### 1. Clonar e Instalar

```bash
git clone https://github.com/Roque-Pro/rastroagro.git
cd rastroagro
npm install --legacy-peer-deps
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Preencha seu `.env.local`:
```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_KEY=sua_chave_aqui
VITE_GEMINI_API_KEY=sua_chave_gemini_aqui
```

**Como obter as chaves:**
- [Supabase](https://supabase.com) - Create Project → Copy URL e Key
- [Google Gemini](https://ai.google.dev) - Get API Key → Copiar

### 3. Configurar Banco de Dados

```bash
# Se estiver usando PostGIS (opcional para mapas avançados)
# Execute SQL_SETUP.sql no seu Supabase

# Ou, se preferir sem PostGIS:
# Execute SQL_SETUP_SEM_POSTGIS.sql
```

### 4. Rodando Localmente

```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173)

### 5. Build para Produção

```bash
npm run build
npm run preview
```

---

## Estrutura do Projeto

```
src/
├── pages/
│   ├── Login.jsx              # Autenticação (Produtor/Comprador)
│   ├── Dashboard.jsx          # Home do produtor
│   ├── NewLote.jsx            # Criar nova safra
│   ├── LoteDetail.jsx         # Timeline de fases
│   ├── BuyerMarketplace.jsx   # Comprador: Lista de ofertas
│   ├── BuyerMap.jsx           # Comprador: Mapa interativo
│   └── BuyerForecast.jsx      # Comprador: Previsões
├── components/
│   ├── Timeline.jsx           # Histórico visual das fases
│   ├── PublicTimeline.jsx     # Timeline pública (via QR)
│   ├── BuyerNav.jsx           # Nav inferior do comprador
│   └── ...outros componentes
├── lib/
│   ├── supabase.js            # Client Supabase
│   ├── gemini.js              # Integração IA
│   ├── db.js                  # Funções DB
│   ├── camera.js              # Captura de câmera
│   └── whatsapp.js            # Links WhatsApp
├── hooks/
│   └── usePlanCheck.js        # Validar tipo de plano
└── constants/
    └── plans.js               # Dados dos planos
```

---

## Fluxo de Uso

### Produtor 👨‍🌾

1. **Cadastro**
   - Seleciona "Produtor"
   - Preenche nome da fazenda + WhatsApp
   - App captura geolocalização automaticamente

2. **Criar Safra**
   - Escolhe cultura (milho, soja, algodão, etc)
   - Adiciona variedade e data de plantio
   - Sistema gera **previsão de colheita com IA** (opcional)
   - QR Code criado automaticamente

3. **Gerenciar Bio**
    - Cria descrição da fazenda (opcional na bio)
    - Acessa mini página pública com link `/produtor/:id`
    - Compartilha link com compradores

4. **Registrar Fases**
    - Tira foto de cada fase (plantio → colheita)
    - App registra: geoloc + data/hora + foto automaticamente
    - Timeline visual mostra o histórico

5. **Compartilhar**
    - QR Code leva a página pública com rastreabilidade completa
    - Qualquer pessoa pode ver (transparência total)
    - Link da mini página com filtros por produto e data

### Comprador 🏪

1. **Cadastro**
   - Seleciona "Comprador"
   - Preenche dados da empresa/pessoa

2. **Acessar Mapa**
   - Vê marcadores de produtores próximos
   - Cores indicam status:
     - 🔴 **Vermelho**: Muito cedo (> 15 dias)
     - 🟠 **Laranja**: Próximo (7-15 dias)
     - 🟢 **Verde**: Pronto para oferta (< 7 dias)
   - Clica no marcador → abre WhatsApp do produtor

3. **Ver Mini Página do Produtor**
    - Botão "Ver Fazenda" em cada card do marketplace
    - Acessa `/produtor/:id` com filtros por produto e data
    - Vê bio, todos os lotes e histórico rastreável

4. **Alternativas**
    - **Marketplace**: Lista de cartas com filtros
    - **Previsões**: Agrupar por região e volume esperado

---

## Funcionalidades Principais

### 🌾 Mini Página Pública do Produtor
- Página dedicada por produtor (`/produtor/:id`)
- Bio customizável de até 500 caracteres
- Exibe todos os lotes com status
- Filtros por produto (cultura)
- Filtros por data de plantio
- Ordenação automática (mais recente primeiro)
- Contadores de lotes ativos e tipos de cultivos
- Links para rastreabilidade completa de cada lote

### 🗺️ Mapa Interativo
- Leaflet com marcadores coloridos
- Filtro dinâmico por produto
- Popups com info do produtor
- Botão WhatsApp direto no mapa

### 🤖 IA Integrada (Gemini)
- Gera previsão de colheita automática
- Mostra confiança percentual
- Fallback com ciclos padrão de cada cultura
- Funciona offline com dados padrão

### 📸 Captura Automática
- Geolocalização sem ação do usuário
- Data/hora sincronizadas
- Integração com câmera do dispositivo
- Funciona em PWA (instalável)

### 🔐 Segurança
- Row Level Security (RLS) no Supabase
- Autenticação via JWT
- Produtores só veem seus lotes
- Compradores veem apenas o necessário

### 📱 Progressive Web App
- Instala como app nativo
- Funciona offline (com dados em cache)
- Notificações push prontas
- Responsivo para mobile/tablet/desktop

---

## Modelo de Dados

### Tabela `perfis`
```sql
- user_id (FK)
- nome_fazenda TEXT
- email TEXT
- user_role TEXT ('produtor' | 'comprador')
- whatsapp VARCHAR(15)
- bio TEXT (até 500 caracteres) -- novo campo
- localizacao GEOMETRY(Point, 4326) -- geoloc
```

### Tabela `lotes`
```sql
- id UUID
- user_id (FK)
- cultura TEXT
- variedade TEXT
- data_plantio DATE
- data_colheita_estimada DATE
- status TEXT ('ativo' | 'colhido')
- marketplace_visivel BOOLEAN
- qr_code_hash TEXT
```

### Tabela `fases`
```sql
- id UUID
- lote_id (FK)
- foto_url TEXT
- localizacao GEOMETRY
- data_hora TIMESTAMP
- anotacoes TEXT
```

---

## Variáveis de Ambiente

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua_chave_publica_aqui

# Google Gemini
VITE_GEMINI_API_KEY=sua_chave_aqui

# Opcional
VITE_APP_NAME=RastroAgro
VITE_ENVIRONMENT=development
```

---

## Possíveis Problemas e Soluções

| Problema | Solução |
|----------|---------|
| **Erro "chave inválida"** | Confirmar `.env.local` e reiniciar dev server |
| **Mapa não carrega** | Verificar se Leaflet CSS está no index.html |
| **Geoloc não funciona** | Verificar permissões do navegador (HTTPS necessário em prod) |
| **IA não gera previsão** | Fallback automático com ciclos padrão (check console) |
| **RLS bloqueando queries** | Verificar policies no Supabase (FIX_RLS.sql ajuda) |

---

## Roadmap (Próximas Melhorias)

- [ ] Sistema de oferta/lance entre produtor e comprador
- [ ] Notificações por email quando safra está pronta
- [ ] Dashboard de análises (produtor vê seus números)
- [ ] Certificações digitais (orgânico, fair trade, etc)
- [ ] Integração de pagamentos (Stripe/PagSeguro)
- [ ] App mobile nativo (React Native)
- [ ] Sistema de reputação (5 estrelas)
- [ ] Integração com órgãos de fiscalização

---

## Scripts Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview da build
npm run preview

# Limpar banco (cuidado!)
# Execute DISABLE_RLS.sql para testes, depois FIX_RLS.sql
```

---

## Contribuindo

Encontrou um bug ou tem uma ideia? Ótimo!

1. Fork o projeto
2. Cria uma branch (`git checkout -b feature/sua-feature`)
3. Commit suas mudanças (`git commit -m 'Add: sua-feature'`)
4. Push para a branch (`git push origin feature/sua-feature`)
5. Abre um Pull Request

**Coisas legais para contribuir:**
- Melhorar UI/UX
- Adicionar mais culturas ao banco
- Otimizar queries de banco
- Tradução para outros idiomas
- Testes automatizados

---

## Autores

👨‍💻 **Roque Pro** - Criador principal

---

## Licença

Este projeto está sob a licença **MIT**. Faça o que quiser, só coloca um crédito 😉

---

## Suporte

Dúvidas? Problemas?

1. Verifique a seção "Possíveis Problemas e Soluções"
2. Abra uma [Issue](https://github.com/Roque-Pro/rastroagro/issues)
3. Procure por issues já fechadas com problema similar

---

**Status**: ✅ Pronto para produção  
**Última atualização**: Abril 2026  
**Versão**: 1.0.0

---

*Feito com ❤️ para conectar o campo ao mercado*
