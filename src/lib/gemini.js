import { GoogleGenerativeAI } from '@google/generative-ai'
import { CULTURAS, getCicloEstimado } from '../constants/culturas'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  console.warn('VITE_GEMINI_API_KEY não configurada. IA de previsibilidade desabilitada.')
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

/**
 * Gera previsão de colheita baseada no histórico de eventos
 */
export async function generateHarvestForecast(loteData) {
  if (!genAI) {
    return {
      data_estimada: calcularDataPadrao(loteData),
      confianca: 0,
      motivo: 'IA desabilitada - usando cálculo padrão'
    }
  }

  try {
    // Gemini 2.5 Flash - Versão em produção
    // Input: $0.30/1M tokens | Output: $2.50/1M tokens (com free tier)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const cicloEstimado = getCicloEstimado(loteData.cultura)
    const culturasDisponiveis = CULTURAS.map(c => `${c.nome} (${c.categoria})`).join(', ')

    const prompt = `
Você é um agrônomo especialista em agronegócio brasileiro. Baseado nas informações abaixo, gere uma previsão de colheita:

**Informações do Lote:**
- Cultura: ${loteData.cultura}
- Variedade/Híbrido: ${loteData.variedade || 'Não especificada'}
- Data de Plantio: ${new Date(loteData.data_inicio).toLocaleDateString('pt-BR')}
- Ciclo Esperado: ${cicloEstimado || 'Desconhecido'}

**Registros de Atividades:**
${loteData.eventos?.map(e => `- ${e.tipo} em ${new Date(e.timestamp).toLocaleDateString('pt-BR')}`).join('\n') || '- Nenhum registro ainda'}

**Culturas Conhecidas (para referência):**
${culturasDisponiveis}

Baseado em seu conhecimento agrícola, estime a data de colheita e o nível de confiança dessa previsão.

Responda em JSON com este formato:
{
  "dias_ate_colheita": <número de dias a partir de hoje>,
  "confianca_percentual": <0-100>,
  "motivo": "<explicação breve em português sobre o ciclo esperado>"
}

Retorne APENAS o JSON, sem texto adicional.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parsear resposta JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Resposta inválida da IA')
    
    const forecast = JSON.parse(jsonMatch[0])
    
    // Calcular data a partir dos dias
    const dataColheita = new Date()
    dataColheita.setDate(dataColheita.getDate() + forecast.dias_ate_colheita)
    
    return {
      data_estimada: dataColheita.toISOString().split('T')[0],
      confianca: forecast.confianca_percentual,
      motivo: forecast.motivo
    }
  } catch (error) {
    console.error('Erro ao gerar previsão com IA:', error)
    
    // Fallback para cálculo padrão
    return {
      data_estimada: calcularDataPadrao(loteData),
      confianca: 50,
      motivo: 'Erro na IA, usando cálculo padrão'
    }
  }
}

/**
 * Calcula data padrão baseada na cultura (fallback)
 */
function calcularDataPadrao(loteData) {
  // Tenta buscar o ciclo na base de dados
  const cicloEstimado = getCicloEstimado(loteData.cultura)
  
  // Se encontrou, extrai o número de dias (pega o primeiro número)
  let ciclo = 100 // padrão
  
  if (cicloEstimado) {
    const match = cicloEstimado.match(/\d+/)
    if (match) {
      ciclo = parseInt(match[0])
    }
  }
  
  const dataInicio = new Date(loteData.data_inicio)
  const dataColheita = new Date(dataInicio)
  dataColheita.setDate(dataColheita.getDate() + ciclo)
  
  return dataColheita.toISOString().split('T')[0]
}
