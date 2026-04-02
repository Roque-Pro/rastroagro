import { GoogleGenerativeAI } from '@google/generative-ai'

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

    const prompt = `
Você é um agrônomo especialista. Baseado nas informações abaixo, gere uma previsão de colheita:

Cultura: ${loteData.cultura}
Variedade: ${loteData.variedade}
Data de Plantio: ${new Date(loteData.data_inicio).toLocaleDateString('pt-BR')}
Registros de Atividades:
${loteData.eventos?.map(e => `- ${e.tipo} em ${new Date(e.timestamp).toLocaleDateString('pt-BR')}`).join('\n')}

Responda em JSON com este formato:
{
  "dias_ate_colheita": <número de dias a partir de hoje>,
  "confianca_percentual": <0-100>,
  "motivo": "<explicação breve em português>"
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
  // Ciclos médios de culturas (em dias)
  const ciclos = {
    'Milho': 120,
    'Soja': 110,
    'Tomate': 60,
    'Cana-de-açúcar': 540,
    'Arroz': 120,
    'Feijão': 90,
    'Batata': 70,
    'Alface': 40,
  }
  
  const ciclo = ciclos[loteData.cultura] || 100
  const dataInicio = new Date(loteData.data_inicio)
  const dataColheita = new Date(dataInicio)
  dataColheita.setDate(dataColheita.getDate() + ciclo)
  
  return dataColheita.toISOString().split('T')[0]
}
