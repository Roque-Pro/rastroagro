import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Timeline from './Timeline'
import { ArrowLeft, MapPin, Calendar, Leaf, Shield, Award } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PublicTimeline() {
  const { qrHash } = useParams()
  const [lote, setLote] = useState(null)
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar lote pelo QR
        const { data: loteData, error: loteError } = await supabase
          .from('lotes')
          .select('*, eventos_manejo(*), perfis(*)')
          .eq('qr_hash', qrHash)
          .single()

        if (loteError) throw loteError

        setLote(loteData)
        setEventos(loteData.eventos_manejo || [])
      } catch (err) {
        console.error('Erro ao buscar dados:', err)
        setError('Lote não encontrado ou acesso negado')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [qrHash])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-agro-primary border-t-agro-secondary" />
      </div>
    )
  }

  if (error || !lote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-white p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-2">❌ Erro</h1>
        <p className="text-gray-600">{error || 'Lote não encontrado'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-agro-primary via-green-600 to-agro-secondary text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors mb-4 inline-block"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-4xl">🌾</div>
            <div>
              <h1 className="text-3xl font-bold">RastroAgro</h1>
              <p className="text-green-100">Rastreabilidade Certificada de Alimentos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Card Principal - Produtor e Safra */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-agro-primary"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informações da Fazenda */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="text-agro-primary" size={28} />
                Informações Verificadas
              </h2>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Produtor</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {lote.perfis?.nome_fazenda}
                  </p>
                  {lote.perfis?.telefone && (
                    <p className="text-sm text-gray-600 mt-2">
                      📞 {lote.perfis.telefone}
                    </p>
                  )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Código de Rastreamento</p>
                  <p className="font-mono text-sm bg-gray-100 p-3 rounded mt-2 break-all text-gray-900">
                    {lote.qr_hash}
                  </p>
                </div>
              </div>
            </div>

            {/* Informações da Safra */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Leaf className="text-agro-secondary" size={28} />
                {lote.cultura}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <Leaf size={20} className="text-agro-secondary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600">Variedade</p>
                    <p className="font-bold text-gray-900">{lote.variedade}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <Calendar size={20} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-600">Plantio</p>
                    <p className="font-bold text-gray-900">
                      {new Date(lote.data_inicio).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {lote.data_colheita_estimada && (
                  <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                    <Calendar size={20} className="text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-600">Colheita Prevista</p>
                      <p className="font-bold text-gray-900">
                        {new Date(lote.data_colheita_estimada).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Badges de Procedência */}
          <div className="mt-8 pt-8 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🔍</div>
              <p className="font-bold text-gray-900">Rastreado</p>
              <p className="text-xs text-gray-600">{eventos.length} registros</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📍</div>
              <p className="font-bold text-gray-900">Geolocalizado</p>
              <p className="text-xs text-gray-600">100% dos registros</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🕐</div>
              <p className="font-bold text-gray-900">Certificado</p>
              <p className="text-xs text-gray-600">Data e hora</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="font-bold text-gray-900">Procedência</p>
              <p className="text-xs text-gray-600">Verificada</p>
            </div>
          </div>
        </motion.div>

        {/* Timeline de Eventos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Award className="text-agro-primary" size={28} />
            Histórico de Procedência
          </h3>
          <p className="text-gray-600 mb-8">
            Cada fase registrada com data, hora e localização exata do produtor
          </p>

          {eventos.length === 0 ? (
            <div className="text-center py-12">
              <Leaf size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Nenhum registro de procedência ainda</p>
            </div>
          ) : (
            <Timeline eventos={eventos} />
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center py-8 mt-12">
        <p className="font-bold text-lg mb-2">🌾 RastroAgro © {new Date().getFullYear()}</p>
        <p className="text-gray-400 text-sm">Rastreabilidade Agrícola Transparente e Certificada</p>
        <p className="text-gray-500 text-xs mt-4">
          Este código rastreável garante a procedência e qualidade do produto
        </p>
      </div>
    </div>
  )
}
