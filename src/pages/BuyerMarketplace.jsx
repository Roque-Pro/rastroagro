import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import MarketplaceFilter from '../components/MarketplaceFilter'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Leaf, TrendingUp, Badge, Star, Zap } from 'lucide-react'

export default function BuyerMarketplace() {
  const [lotes, setLotes] = useState([])
  const [filteredLotes, setFilteredLotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    fetchLotes()
    getUserLocation()
  }, [])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      })
    }
  }

  const fetchLotes = async () => {
    try {
      const { data, error } = await supabase
        .from('lotes')
        .select(`
          id,
          cultura,
          variedade,
          data_colheita_estimada,
          localizacao,
          certificacao,
          produtor_id,
          perfis(id, nome_fazenda, localizacao, whatsapp),
          eventos_manejo(count)
        `)
        .eq('status', 'ativo')
        .eq('marketplace_visivel', true)

      if (error) throw error
      setLotes(data || [])
      setFilteredLotes(data || [])
    } catch (error) {
      console.error('Erro ao buscar lotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const calculateQuality = (eventosCount) => {
    // Qualidade baseada em registros de manejo
    const quality = Math.min(5, Math.ceil((eventosCount || 0) / 2))
    return quality
  }

  const daysUntilHarvest = (dataColheita) => {
    if (!dataColheita) return null
    const today = new Date()
    const harvest = new Date(dataColheita)
    const days = Math.ceil((harvest - today) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : null
  }

  const handleFilter = (filters) => {
    let result = lotes.filter((lote) => {
      // Filtro de cultura
      if (filters.cultura && lote.cultura !== filters.cultura) return false

      // Filtro de dias até colheita
      if (lote.data_colheita_estimada) {
        const dias = daysUntilHarvest(lote.data_colheita_estimada)
        if (dias === null || dias > filters.dias_colheita) return false
      }

      // Filtro de distância (se tiver localização do usuário)
      if (userLocation && lote.localizacao) {
        const [lon, lat] = lote.localizacao.coordinates
        const dist = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          lat,
          lon
        )
        if (dist > filters.distancia_km) return false
      }

      // Filtro de qualidade
      const quality = calculateQuality(lote.eventos_manejo[0]?.count)
      if (quality < filters.qualidade_minima) return false

      return true
    })

    setFilteredLotes(result)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-agro-primary to-agro-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-agro-primary via-green-600 to-agro-secondary text-white p-8 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🛒</div>
              <div>
                <h1 className="text-3xl font-bold">Vitrine de Safras</h1>
                <p className="text-green-100">Conecte-se com produtores locais e garanta a procedência</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur px-4 py-2 rounded-full">
              <p className="font-semibold">{filteredLotes.length} produtos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <TrendingUp size={28} className="mb-2" />
            <p className="text-sm opacity-90">Total de Safras</p>
            <p className="text-3xl font-bold">{lotes.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <Leaf size={28} className="mb-2" />
            <p className="text-sm opacity-90">Disponíveis Agora</p>
            <p className="text-3xl font-bold">{filteredLotes.length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <Zap size={28} className="mb-2" />
            <p className="text-sm opacity-90">Rastreadas</p>
            <p className="text-3xl font-bold">100%</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <Badge size={28} className="mb-2" />
            <p className="text-sm opacity-90">Certificadas</p>
            <p className="text-3xl font-bold">✓</p>
          </div>
        </motion.div>

        {/* Filtros e Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtros - Sidebar */}
          <div>
            <MarketplaceFilter onFilter={handleFilter} />
          </div>

          {/* Grid de Lotes */}
          <div className="lg:col-span-3">
            {filteredLotes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-2xl text-gray-400">😴 Nenhum lote encontrado</p>
                <p className="text-gray-500 mt-2">Tente ajustar os filtros</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredLotes.map((lote, idx) => {
                  const diasColheita = daysUntilHarvest(lote.data_colheita_estimada)
                  const quality = calculateQuality(lote.eventos_manejo[0]?.count)

                  return (
                    <motion.div
                      key={lote.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border-t-4 border-agro-secondary group"
                    >
                      {/* Header Card Premium */}
                      <div className="bg-gradient-to-r from-agro-secondary to-green-500 p-5 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-2xl font-bold">{lote.cultura}</h3>
                              <p className="text-green-100">{lote.variedade}</p>
                            </div>
                            {quality >= 4 && (
                              <div className="flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-bold">
                                <Star size={16} fill="currentColor" />
                                Premium
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content Premium */}
                      <div className="p-6 space-y-4">
                        {/* Produtor */}
                        <div>
                          <p className="text-sm text-gray-600">Produtor</p>
                          <p className="font-semibold text-gray-900">
                            {lote.perfis?.nome_fazenda}
                          </p>
                        </div>

                        {/* Dias para colheita - Card Destaque */}
                        {diasColheita && (
                          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Calendar className="text-orange-600" size={20} />
                              <div>
                                <p className="text-xs text-gray-600 uppercase font-semibold">Colheita em</p>
                                <p className="font-bold text-xl text-orange-700">
                                  {diasColheita} dia{diasColheita !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Qualidade - Com Badges */}
                        <div className="space-y-2">
                          <p className="text-xs text-gray-600 uppercase font-semibold">Qualidade do Manejo</p>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`h-2 flex-1 rounded-full ${
                                  star <= quality ? 'bg-agro-secondary' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="font-bold text-gray-900">{quality}/5 Estrelas</p>
                        </div>

                        {/* Certificação */}
                        {lote.certificacao && (
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                            <p className="text-sm text-blue-700">
                              ✅ Certificado: {lote.certificacao}
                            </p>
                          </div>
                        )}

                        {/* Localização */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} />
                          <span>
                            {lote.localizacao 
                              ? `${lote.localizacao.coordinates[1].toFixed(2)}, ${lote.localizacao.coordinates[0].toFixed(2)}`
                              : 'Localização não disponível'
                            }
                          </span>
                        </div>

                        {/* Botões de Contato e Mini Página */}
                        <div className="space-y-2">
                          {lote.perfis?.whatsapp ? (
                            <motion.a
                              whileTap={{ scale: 0.95 }}
                              href={`https://wa.me/${lote.perfis.whatsapp}?text=Olá! Tenho interesse no ${lote.cultura} da ${lote.perfis?.nome_fazenda}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full block text-center bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-shadow"
                            >
                              💬 WhatsApp
                            </motion.a>
                          ) : (
                            <button disabled className="w-full bg-gray-300 text-gray-600 font-bold py-3 rounded-lg cursor-not-allowed">
                              Sem contato
                            </button>
                          )}
                          
                          {lote.produtor_id && (
                            <motion.a
                              whileTap={{ scale: 0.95 }}
                              href={`/produtor/${lote.produtor_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full block text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 rounded-lg hover:shadow-lg transition-shadow text-sm"
                            >
                              📄 Ver Fazenda
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Total de resultados */}
            <div className="text-center text-gray-600 mt-8 pb-12">
              <p>
                <strong>{filteredLotes.length}</strong> de <strong>{lotes.length}</strong> safras disponíveis
              </p>
              {filteredLotes.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">Ajuste os filtros para encontrar safras</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-agro-primary to-agro-secondary text-white mt-12">
        <div className="max-w-7xl mx-auto py-12 px-6 text-center">
          <h3 className="text-2xl font-bold mb-2">Todas as safras são rastreáveis</h3>
          <p className="text-green-100 mb-6">
            Escanear QR Code do produtor para verificar procedência, data, hora e localização de cada fase
          </p>
          <div className="inline-block bg-white text-agro-primary px-6 py-2 rounded-full font-bold">
            ✓ 100% Verificado
          </div>
        </div>
      </div>
    </div>
  )
}
