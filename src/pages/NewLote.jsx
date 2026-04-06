import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { generateHarvestForecast } from '../lib/gemini'
import { ArrowLeft, Plus, Zap, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid'
import { CULTURAS, filtrarCulturas } from '../constants/culturas'

export default function NewLote() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forecast, setForecast] = useState(null)
  const [filtroAberto, setFiltroAberto] = useState(false)
  const [filtroTermo, setFiltroTermo] = useState('')
  const [culturasFiltradas, setCulturasFiltradas] = useState([])
  const [formData, setFormData] = useState({
    cultura: '',
    variedade: '',
    data_inicio: new Date().toISOString().split('T')[0],
    area_hectares: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFiltroChange = (valor) => {
    setFiltroTermo(valor)
    setCulturasFiltradas(filtrarCulturas(valor))
    setFiltroAberto(true)
  }

  const handleSelecionarCultura = (cultura) => {
    setFormData(prev => ({
      ...prev,
      cultura: cultura.nome
    }))
    setFiltroAberto(false)
    setFiltroTermo('')
    setCulturasFiltradas([])
  }

  const handleGenerateForecast = async () => {
    if (!formData.cultura || !formData.data_inicio) {
      alert('Preencha cultura e data de plantio primeiro')
      return
    }

    setLoading(true)
    try {
      const forecastData = await generateHarvestForecast({
        cultura: formData.cultura,
        variedade: formData.variedade,
        data_inicio: formData.data_inicio,
        eventos: []
      })
      setForecast(forecastData)
    } catch (err) {
      console.error('Erro ao gerar previsão:', err)
      alert('Erro ao gerar previsão')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🔹 Iniciando criação de lote...')
      
      // Buscar ID do perfil do usuário
      console.log('🔹 Buscando usuário...')
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        throw new Error('Usuário não autenticado')
      }
      console.log('✅ Usuário encontrado:', user.id)

      console.log('🔹 Buscando perfil...')
      let { data: perfis, error: perfilError } = await supabase
        .from('perfis')
        .select('id')
        .eq('user_id', user.id)

      if (perfilError) {
        console.error('Erro ao buscar perfil:', perfilError)
        throw new Error(`Erro ao buscar perfil: ${perfilError.message}`)
      }

      // Se não tiver perfil, criar automaticamente
      if (!perfis || perfis.length === 0) {
        console.log('🔹 Perfil não existe. Criando automaticamente...')
        const slug = `fazenda-${Date.now()}`
        const { data: novoPerfil, error: createError } = await supabase
          .from('perfis')
          .insert([{
            user_id: user.id,
            nome_fazenda: 'Minha Propriedade',
            email: user.email,
            user_role: 'produtor',
            slug: slug
          }])
          .select('id')
          .single()

        if (createError) {
          console.error('Erro ao criar perfil:', createError)
          throw new Error(`Erro ao criar perfil: ${createError.message}`)
        }
        
        perfis = [novoPerfil]
        console.log('✅ Perfil criado automaticamente:', novoPerfil.id)
      }

      const perfil = perfis[0]
      console.log('✅ Perfil encontrado:', perfil.id)

      // Gerar QR hash
      const qrHash = `LOT_${uuidv4().replace(/-/g, '').substring(0, 12)}`

      // Se não tiver previsão gerada, gerar agora
      console.log('🔹 Verificando previsão de colheita...')
      let previsao = forecast
      if (!previsao?.data_estimada) {
        console.log('🔹 Gerando previsão com IA...')
        previsao = await generateHarvestForecast({
          cultura: formData.cultura,
          variedade: formData.variedade,
          data_inicio: formData.data_inicio,
          eventos: []
        })
        console.log('✅ Previsão gerada:', previsao)
      } else {
        console.log('✅ Usando previsão anterior:', previsao)
      }

      console.log('🔹 Criando lote no banco...')
      // Criar lote
      const { data: novoLote, error: insertError } = await supabase
        .from('lotes')
        .insert([{
          produtor_id: perfil.id,
          cultura: formData.cultura,
          variedade: formData.variedade,
          data_inicio: formData.data_inicio,
          data_colheita_estimada: previsao?.data_estimada || null,
          confianca: previsao?.confianca || 0,
          motivo_previsao: previsao?.motivo || null,
          area_hectares: formData.area_hectares ? parseFloat(formData.area_hectares) : null,
          qr_hash: qrHash,
          status: 'ativo',
          marketplace_visivel: true
        }])
        .select()
        .single()

      if (insertError) {
        console.error('Erro ao inserir lote:', insertError)
        throw insertError
      }

      console.log('✅ Lote criado:', novoLote.id)
      console.log('🔹 Redirecionando para página da fazenda...')
      
      // Redirecionar para página da fazenda
      const fazendaSlug = perfis[0].slug || perfis[0].id
      navigate(`/fazenda/${fazendaSlug}`)
    } catch (err) {
      console.error('❌ Erro completo:', err)
      setError(err.message || 'Erro ao criar lote')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-agro-primary to-agro-secondary text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/dashboard')}
            className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <h1 className="text-2xl font-bold">Registrar Novo Lote</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-8 space-y-6"
        >
          <p className="text-gray-600 text-center">
            Preencha as informações do seu lote. Você poderá registrar atividades em seguida.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cultura com Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cultura
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Digite para filtrar..."
                  value={formData.cultura || filtroTermo}
                  onChange={(e) => {
                    handleFiltroChange(e.target.value)
                    if (!e.target.value) {
                      setFormData(prev => ({ ...prev, cultura: '' }))
                    }
                  }}
                  onFocus={() => setFiltroAberto(true)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-colors text-gray-900"
                  required={!formData.cultura}
                />
                {formData.cultura && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, cultura: '' }))
                      setFiltroTermo('')
                      setFiltroAberto(false)
                    }}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Dropdown de Culturas */}
              {filtroAberto && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                >
                  {culturasFiltradas.length > 0 ? (
                    culturasFiltradas.map((cultura, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelecionarCultura(cultura)}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{cultura.nome}</div>
                        <div className="text-xs text-gray-500">{cultura.categoria} • {cultura.ciclo}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      Nenhuma cultura encontrada
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Variedade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variedade/Híbrido
              </label>
              <input
                type="text"
                name="variedade"
                value={formData.variedade}
                onChange={handleChange}
                placeholder="Ex: Safrinha Verão, BRS 2014"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-agro-primary focus:outline-none transition-colors text-gray-900"
                required
              />
            </div>

            {/* Data de Início */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Plantio/Início
              </label>
              <input
                type="date"
                name="data_inicio"
                value={formData.data_inicio}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-agro-primary focus:outline-none transition-colors text-gray-900"
                required
              />
            </div>

            {/* Botão Gerar Previsão */}
            {formData.cultura && formData.data_inicio && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerateForecast}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                {loading ? 'Gerando...' : '✨ Gerar Previsão de Colheita'}
              </motion.button>
            )}

            {/* Previsão Gerada */}
            {forecast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border-2 border-green-500 rounded-lg p-4"
              >
                <h4 className="font-bold text-green-900 mb-2">✨ Previsão de Colheita</h4>
                <p className="text-sm text-green-800 mb-1">
                  <strong>Data Estimada:</strong> {new Date(forecast.data_estimada).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-green-800 mb-1">
                  <strong>Confiança:</strong> {forecast.confianca}%
                </p>
                <p className="text-xs text-green-700 italic">
                  {forecast.motivo}
                </p>
              </motion.div>
            )}

            {/* Área em Hectares */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área em Hectares (opcional)
              </label>
              <input
                type="number"
                name="area_hectares"
                value={formData.area_hectares}
                onChange={handleChange}
                placeholder="Ex: 10.5"
                step="0.1"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-agro-primary focus:outline-none transition-colors text-gray-900"
              />
            </div>

            {/* Erro */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {/* Botões */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-gray-300 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="bg-gradient-to-r from-agro-primary to-agro-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                {loading ? 'Criando...' : 'Criar Lote'}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Dicas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg"
        >
          <h4 className="font-bold text-blue-900 mb-3">💡 Dica</h4>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>✓ Você pode registrar fotos e atividades após criar o lote</li>
            <li>✓ Um código QR será gerado automaticamente para compartilhar</li>
            <li>✓ Compradores poderão rastrear todo o histórico do seu produto</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
