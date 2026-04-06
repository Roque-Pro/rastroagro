import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, MapPin, Phone, Calendar, Leaf, Search, X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProducerProfile() {
  const { producerId } = useParams()
  const [perfil, setPerfil] = useState(null)
  const [lotes, setLotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroProduct, setFiltroProduct] = useState('todos')
  const [filtroData, setFiltroData] = useState('')
  const [lotesFiltrados, setLotesFiltrados] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar perfil do produtor
        const { data: perfilData, error: perfilError } = await supabase
          .from('perfis')
          .select('*')
          .eq('id', producerId)
          .single()

        if (perfilError) throw perfilError

        setPerfil(perfilData)

        // Buscar lotes do produtor (apenas visíveis no marketplace)
        const { data: lotesData, error: lotesError } = await supabase
          .from('lotes')
          .select('*, eventos_manejo(count)')
          .eq('produtor_id', producerId)
          .eq('marketplace_visivel', true)
          .order('data_inicio', { ascending: false })

        if (lotesError) throw lotesError

        setLotes(lotesData || [])
        setLotesFiltrados(lotesData || [])
      } catch (err) {
        console.error('Erro ao buscar dados:', err)
        setError('Produtor não encontrado')
      } finally {
        setLoading(false)
      }
    }

    if (producerId) {
      fetchData()
    }
  }, [producerId])

  // Aplicar filtros
  useEffect(() => {
    let filtrados = [...lotes]

    // Filtro por produto
    if (filtroProduct !== 'todos') {
      filtrados = filtrados.filter(l => l.cultura.toLowerCase() === filtroProduct.toLowerCase())
    }

    // Filtro por data
    if (filtroData) {
      filtrados = filtrados.filter(l => {
        const dataLote = new Date(l.data_inicio).toISOString().split('T')[0]
        return dataLote >= filtroData
      })
    }

    // Ordenar por mais recente primeiro
    filtrados.sort((a, b) => new Date(b.data_inicio) - new Date(a.data_inicio))

    setLotesFiltrados(filtrados)
  }, [lotes, filtroProduct, filtroData])

  // Obter lista de produtos únicos
  const produtos = [...new Set(lotes.map(l => l.cultura))].sort()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-agro-primary border-t-transparent" />
      </div>
    )
  }

  if (error || !perfil) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-red-50 to-white">
        <h1 className="text-2xl font-bold text-red-600 mb-2">❌ Erro</h1>
        <p className="text-gray-600">{error || 'Perfil não encontrado'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
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
              <h1 className="text-3xl font-bold">{perfil.nome_fazenda}</h1>
              <p className="text-green-100">Mini Página de Rastreabilidade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Card Principal - Info da Fazenda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-agro-primary"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Informações da Fazenda */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre a Fazenda</h2>
              
              {perfil.bio ? (
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {perfil.bio}
                </p>
              ) : (
                <p className="text-gray-500 italic mb-6">Sem descrição disponível</p>
              )}

              <div className="space-y-3">
                {perfil.whatsapp && (
                  <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                    <Phone size={20} className="text-green-600 flex-shrink-0" />
                    <a 
                      href={`https://wa.me/${perfil.whatsapp}`}
                      className="text-green-600 font-semibold hover:underline"
                    >
                      Contatar via WhatsApp
                    </a>
                  </div>
                )}

                {perfil.localizacao && (
                  <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                    <MapPin size={20} className="text-blue-600 flex-shrink-0" />
                    <p className="text-gray-700">Rastreável por localização</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-agro-primary">{lotes.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Lotes Ativos</p>
                </div>
                <div className="border-t pt-4 text-center">
                  <p className="text-2xl font-bold text-agro-secondary">{produtos.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Tipos de Cultivos</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtros */}
        {lotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Search size={20} className="text-gray-600" />
              <h3 className="text-lg font-bold text-gray-900">Filtrar Lotes</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtro por Produto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Produto
                </label>
                <select
                  value={filtroProduct}
                  onChange={(e) => setFiltroProduct(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-primary focus:border-transparent outline-none"
                >
                  <option value="todos">Todos os Produtos</option>
                  {produtos.map(produto => (
                    <option key={produto} value={produto}>
                      {produto}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  A partir de (data)
                </label>
                <input
                  type="date"
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Botão Limpar Filtros */}
            {(filtroProduct !== 'todos' || filtroData) && (
              <button
                onClick={() => {
                  setFiltroProduct('todos')
                  setFiltroData('')
                }}
                className="mt-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                <X size={16} />
                Limpar Filtros
              </button>
            )}
          </motion.div>
        )}

        {/* Lista de Lotes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Lotes Registrados</h3>

          {lotesFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Leaf size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                {filtroProduct !== 'todos' || filtroData 
                  ? 'Nenhum lote encontrado com esses filtros'
                  : 'Nenhum lote registrado ainda'}
              </p>
            </div>
          ) : (
            lotesFiltrados.map((lote, index) => (
              <motion.div
                key={lote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Info Principal */}
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="text-3xl">🌱</div>
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold text-gray-900">
                            {lote.cultura}
                          </h4>
                          <p className="text-gray-600">
                            Variedade: {lote.variedade}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                            Plantio
                          </p>
                          <p className="font-bold text-gray-900">
                            {new Date(lote.data_inicio).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                            Registros
                          </p>
                          <p className="font-bold text-agro-secondary">
                            {lote.eventos_manejo?.[0]?.count || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Colheita Estimada */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl">
                      <p className="text-xs text-orange-700 uppercase tracking-wide font-semibold mb-2">
                        Colheita Prevista
                      </p>
                      {lote.data_colheita_estimada ? (
                        <>
                          <p className="text-2xl font-bold text-orange-600 mb-3">
                            {new Date(lote.data_colheita_estimada).toLocaleDateString('pt-BR')}
                          </p>
                          {lote.confianca && (
                            <div className="text-sm">
                              <p className="text-gray-700 mb-2">Confiança:</p>
                              <div className="w-full bg-gray-300 rounded-full h-2">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    lote.confianca >= 70 ? 'bg-green-600' :
                                    lote.confianca >= 50 ? 'bg-yellow-600' :
                                    'bg-red-600'
                                  }`}
                                  style={{ width: `${lote.confianca}%` }}
                                />
                              </div>
                              <p className="text-gray-700 mt-1 font-semibold">
                                {lote.confianca}%
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 italic">Não calculada</p>
                      )}
                    </div>
                  </div>

                  {/* Link para rastreabilidade */}
                  {lote.qr_hash && (
                    <div className="mt-6 pt-6 border-t">
                      <a
                        href={`/check/${lote.qr_hash}`}
                        className="inline-flex items-center gap-2 bg-agro-primary hover:bg-agro-secondary text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        <span>📱 Ver Rastreabilidade</span>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center py-8 mt-12">
        <p className="font-bold text-lg mb-2">🌾 RastroAgro © {new Date().getFullYear()}</p>
        <p className="text-gray-400 text-sm">
          Mini página de rastreabilidade agrícola transparente e certificada
        </p>
      </div>
    </div>
  )
}
