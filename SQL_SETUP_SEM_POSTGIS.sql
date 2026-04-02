-- =====================================================
-- RASTROAGRO: SQL Setup para Supabase (SEM PostGIS)
-- =====================================================
-- Use este arquivo se o Supabase não tiver extensão PostGIS habilitada

-- 0. TABELA: CONFIG_CULTURAS (Ciclos agrícolas)
CREATE TABLE IF NOT EXISTS config_culturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL UNIQUE,
  dias_ciclo INT NOT NULL,
  descricao TEXT,
  emoji VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir dados iniciais
INSERT INTO config_culturas (nome, dias_ciclo, emoji) VALUES
  ('Tomate', 90, '🍅'),
  ('Alface', 45, '🥬'),
  ('Pimentão', 100, '🫑'),
  ('Morango', 120, '🍓'),
  ('Cenoura', 100, '🥕'),
  ('Brócolis', 70, '🥦'),
  ('Milho', 120, '🌽'),
  ('Soja', 150, '🫘'),
  ('Arroz', 140, '🍚'),
  ('Feijão', 90, '🫘'),
  ('Cana-de-açúcar', 365, '🌾'),
  ('Abacaxi', 600, '🍍')
ON CONFLICT (nome) DO NOTHING;

-- 1. TABELA: PERFIS (Produtores)
CREATE TABLE IF NOT EXISTS perfis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  nome_fazenda VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  cpf_cnpj VARCHAR(20) UNIQUE,
  email VARCHAR(255),
  telefone VARCHAR(20),
  plano VARCHAR(50) DEFAULT 'free',
  user_role VARCHAR(50) DEFAULT 'produtor',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_plano CHECK (plano IN ('free', 'pro', 'enterprise')),
  CONSTRAINT valid_role CHECK (user_role IN ('produtor', 'comprador', 'admin'))
);

-- 2. TABELA: LOTES (Parcelas/Talhões)
CREATE TABLE IF NOT EXISTS lotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produtor_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  cultura VARCHAR(100) NOT NULL,
  variedade VARCHAR(100),
  data_inicio DATE NOT NULL,
  data_colheita_estimada DATE,
  qr_hash VARCHAR(255) UNIQUE NOT NULL,
  area_hectares DECIMAL(10, 2),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(50) DEFAULT 'ativo',
  marketplace_visivel BOOLEAN DEFAULT FALSE,
  certificacao VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. TABELA: EVENTOS_MANEJO (Atividades do Lote)
CREATE TABLE IF NOT EXISTS eventos_manejo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL,
  foto_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  observacoes TEXT,
  volume_estimado DECIMAL(10, 2),
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_tipo CHECK (tipo IN ('plantio', 'adubo', 'defensivo', 'colheita', 'outro'))
);

-- 3.5 TABELA: OFERTAS_MERCADO (Reservas de Safras)
CREATE TABLE IF NOT EXISTS ofertas_mercado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  quantidade_total DECIMAL(10, 2) NOT NULL,
  quantidade_reservada DECIMAL(10, 2) DEFAULT 0,
  saldo_disponivel DECIMAL(10, 2) GENERATED ALWAYS AS (quantidade_total - quantidade_reservada) STORED,
  preco_base DECIMAL(10, 2),
  unidade_medida VARCHAR(50) DEFAULT 'un',
  status VARCHAR(50) DEFAULT 'ativa',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (status IN ('ativa', 'pausada', 'finalizada'))
);

-- 4. TABELA: LEADS_NEGOCIACAO (Interessados em Compra)
CREATE TABLE IF NOT EXISTS leads_negociacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  comprador_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  produtor_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  oferta_id UUID REFERENCES ofertas_mercado(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'novo',
  quantidade_reservada DECIMAL(10, 2),
  mensagem TEXT,
  whatsapp_enviado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (status IN ('novo', 'contatado', 'negociando', 'fechado', 'perdido'))
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_lotes_produtor ON lotes(produtor_id);
CREATE INDEX idx_lotes_qr_hash ON lotes(qr_hash);
CREATE INDEX idx_lotes_colheita ON lotes(data_colheita_estimada);
CREATE INDEX idx_lotes_marketplace ON lotes(marketplace_visivel, status);
CREATE INDEX idx_eventos_lote ON eventos_manejo(lote_id);
CREATE INDEX idx_eventos_timestamp ON eventos_manejo(timestamp DESC);
CREATE INDEX idx_eventos_tipo ON eventos_manejo(tipo);
CREATE INDEX idx_ofertas_lote ON ofertas_mercado(lote_id);
CREATE INDEX idx_ofertas_status ON ofertas_mercado(status);
CREATE INDEX idx_ofertas_saldo ON ofertas_mercado(saldo_disponivel);
CREATE INDEX idx_leads_lote ON leads_negociacao(lote_id);
CREATE INDEX idx_leads_produtor ON leads_negociacao(produtor_id);
CREATE INDEX idx_leads_comprador ON leads_negociacao(comprador_id);
CREATE INDEX idx_leads_status ON leads_negociacao(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_manejo ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas_mercado ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads_negociacao ENABLE ROW LEVEL SECURITY;

-- POLITICAS PARA PERFIS
CREATE POLICY "Usuários podem ver seu próprio perfil" ON perfis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON perfis
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- POLITICAS PARA LOTES
CREATE POLICY "Produtores veem apenas seus lotes" ON lotes
  FOR SELECT USING (
    produtor_id IN (
      SELECT id FROM perfis WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Produtores podem inserir seus lotes" ON lotes
  FOR INSERT WITH CHECK (
    produtor_id IN (
      SELECT id FROM perfis WHERE user_id = auth.uid()
    )
  );

-- Apenas lotes visíveis no marketplace e de planos >= pro
CREATE POLICY "Visualizar lotes no marketplace" ON lotes
  FOR SELECT USING (
    marketplace_visivel = TRUE 
    AND produtor_id IN (
      SELECT id FROM perfis 
      WHERE plano IN ('pro', 'enterprise')
    )
  );

-- POLITICAS PARA EVENTOS
CREATE POLICY "Apenas proprietário do lote vê eventos" ON eventos_manejo
  FOR SELECT USING (
    lote_id IN (
      SELECT id FROM lotes 
      WHERE produtor_id IN (
        SELECT id FROM perfis WHERE user_id = auth.uid()
      )
    ) OR TRUE
  );

CREATE POLICY "Produtores inserem eventos em seus lotes" ON eventos_manejo
  FOR INSERT WITH CHECK (
    lote_id IN (
      SELECT id FROM lotes 
      WHERE produtor_id IN (
        SELECT id FROM perfis WHERE user_id = auth.uid()
      )
    )
  );

-- POLITICAS PARA OFERTAS
CREATE POLICY "Visualizar ofertas de lotes públicos" ON ofertas_mercado
  FOR SELECT USING (
    lote_id IN (
      SELECT id FROM lotes 
      WHERE marketplace_visivel = TRUE
    )
  );

-- POLITICAS PARA LEADS
CREATE POLICY "Produtores veem seus leads" ON leads_negociacao
  FOR SELECT USING (
    produtor_id IN (
      SELECT id FROM perfis WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Compradores veem suas reservas" ON leads_negociacao
  FOR SELECT USING (
    comprador_id IN (
      SELECT id FROM perfis WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- FUNCOES UTEIS
-- =====================================================

-- Gerar QR Hash único
CREATE OR REPLACE FUNCTION gerar_qr_hash()
RETURNS VARCHAR AS $$
BEGIN
  RETURN 'LOT_' || encode(gen_random_bytes(12), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Atualizar timestamp de modificação
CREATE OR REPLACE FUNCTION atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Validar limite de lotes por plano
CREATE OR REPLACE FUNCTION validar_limite_lotes()
RETURNS TRIGGER AS $$
DECLARE
  plano_usuario VARCHAR;
  limite_lotes INT;
  lotes_atuais INT;
BEGIN
  -- Buscar plano do usuário
  SELECT p.plano INTO plano_usuario
  FROM perfis p
  WHERE p.id = NEW.produtor_id;

  -- Definir limite baseado no plano
  CASE plano_usuario
    WHEN 'free' THEN limite_lotes := 2;
    WHEN 'pro' THEN limite_lotes := 999;
    WHEN 'enterprise' THEN limite_lotes := 9999;
    ELSE limite_lotes := 2;
  END CASE;

  -- Contar lotes ativos
  SELECT COUNT(*) INTO lotes_atuais
  FROM lotes
  WHERE produtor_id = NEW.produtor_id
    AND status = 'ativo';

  -- Validar limite
  IF lotes_atuais >= limite_lotes THEN
    RAISE EXCEPTION 'Limite de lotes para plano % alcançado. Máximo: %', plano_usuario, limite_lotes;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar limite
CREATE TRIGGER tr_validar_limite_lotes
BEFORE INSERT ON lotes
FOR EACH ROW
EXECUTE FUNCTION validar_limite_lotes();

-- Calcular data de colheita automática ao registrar plantio
CREATE OR REPLACE FUNCTION calcular_data_colheita()
RETURNS TRIGGER AS $$
DECLARE
  dias_ciclo INT;
BEGIN
  -- Se evento é plantio, atualizar data_colheita_estimada no lote
  IF NEW.tipo = 'plantio' THEN
    SELECT cc.dias_ciclo INTO dias_ciclo
    FROM config_culturas cc
    JOIN lotes l ON cc.nome = l.cultura
    WHERE l.id = NEW.lote_id;

    IF dias_ciclo IS NOT NULL THEN
      UPDATE lotes
      SET data_colheita_estimada = NEW.timestamp::DATE + dias_ciclo
      WHERE id = NEW.lote_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular colheita
CREATE TRIGGER tr_calcular_colheita
AFTER INSERT ON eventos_manejo
FOR EACH ROW
EXECUTE FUNCTION calcular_data_colheita();

-- Função para atualizar saldo ao reservar
CREATE OR REPLACE FUNCTION atualizar_saldo_reserva()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar quantidade_reservada em ofertas_mercado
  UPDATE ofertas_mercado
  SET quantidade_reservada = quantidade_reservada + NEW.quantidade_reservada
  WHERE id = NEW.oferta_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger ao criar lead (reserva)
CREATE TRIGGER tr_atualizar_reserva
AFTER INSERT ON leads_negociacao
FOR EACH ROW
WHEN (NEW.oferta_id IS NOT NULL)
EXECUTE FUNCTION atualizar_saldo_reserva();

-- Triggers para updated_at
CREATE TRIGGER atualizar_perfis_updated_at
BEFORE UPDATE ON perfis FOR EACH ROW
EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER atualizar_lotes_updated_at
BEFORE UPDATE ON lotes FOR EACH ROW
EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER atualizar_ofertas_updated_at
BEFORE UPDATE ON ofertas_mercado FOR EACH ROW
EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER atualizar_leads_updated_at
BEFORE UPDATE ON leads_negociacao FOR EACH ROW
EXECUTE FUNCTION atualizar_updated_at();

-- =====================================================
-- DADOS DE TESTE (OPCIONAL)
-- =====================================================

-- Descomentar para usar:
/*
INSERT INTO perfis (user_id, nome_fazenda, email, telefone, plano)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Fazenda São João',
  'contato@fazendasaojoao.com',
  '11999999999',
  'pro'
);

INSERT INTO lotes (produtor_id, cultura, variedade, data_inicio, qr_hash, latitude, longitude)
VALUES (
  (SELECT id FROM perfis LIMIT 1),
  'Tomate',
  'Cereja',
  NOW()::date,
  gerar_qr_hash(),
  -23.5505,
  -46.6333
);

INSERT INTO ofertas_mercado (lote_id, quantidade_total, unidade_medida)
VALUES (
  (SELECT id FROM lotes LIMIT 1),
  100,
  'sacas'
);
*/
