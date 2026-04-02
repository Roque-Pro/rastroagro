import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ReserveButton from '../components/ReserveButton'
import { motion } from 'framer-motion'
import { Calendar, MapPin, TrendingUp, Leaf, AlertCircle } from 'lucide-react'

export default function BuyerForecast() {
  const [lotes, setLotes] = useState([])
  const [groupedByRegion, setGroupedByRegion] = useState({})
  const [timePeriod, setTimePeriod] = useState(15) // dias
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    fetchForecasts()
    getUserLocation()
  }, [timePeriod])

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

  const fetchForecasts = async () => {
    try {
      setLoading(true)
      const today = new Date()
      const futureDate = new Date(today.getTime() + timePeriod * 24 * 60 * 60 * 1000)

      const { data, error } = await supabase
        .from('lotes')
        .select(`
          id,
          cultura,
          variedade,
          data_colheita_estimada,
          area_hectares,
          localizacao,
          marketplace_visivel,
          certificacao,
          perfis(id, nome_fazenda, localizacao, telefone),
          eventos_manejo(volume_estimado, timestamp),
          ofertas_mercado(id, quantidade_total, quantidade_reservada, saldo_disponivel, unidade_medida)
        `)
        .eq('status', 'ativo')
        .eq('marketplace_visivel', true)
        .gte('data_colheita_estimada', today.toISOString().split('T')[0])
        .lte('data_colheita_estimada', futureDate.toISOString().split('T')[0])

      if (error) throw error

      setLotes(data || [])
      groupByRegion(data || [])
    } catch (error) {
      console.error('Erro ao buscar previsões:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupByRegion = (lotesData) => {
    const grouped = {}

    lotesData.forEach((lote) => {
      if (lote.localizacao) {
        const [lon, lat] = lote.localizacao.coordinates
        const region = `${lat.toFixed(1)}, ${lon.toFixed(1)}`

        if (!grouped[region]) {
          grouped[region] = {
            cultura: {},
            total_volume: 0,
            latitude: lat,
            longitude: lon,
            lotes: []
          }
        }

        const cultura = lote.cultura
        const volume = lote.eventos_manejo?.[0]?.volume_estimado || 0

        grouped[region].cultura[cultura] = (grouped[region].cultura[cultura] || 0) + volume
        grouped[region].total_volume += volume
        grouped[region].lotes.push(lote)
      }
    })

    setGroupedByRegion(grouped)
  }

  const daysUntilHarvest = (dataColheita) => {
    const today = new Date()
    const harvest = new Date(dataColheita)
    return Math.ceil((harvest - today) / (1000 * 60 * 60 * 24))
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
      {/* Header */}
      <div className="bg-gradient-to-r from-agro-primary to-agro-secondary text-white p-6 sticky top-0 z-10 shadow-lg">
        <h1 className="text-3xl font-bold">📅 Mapa do Futuro</h1>
        <p className="text-green-100">Veja o que será colhido próximo a você</p>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Seletor de Período */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            ⏱️ Filtro Temporal
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[7, 15, 30].map((days) => (
              <motion.button
                key={days}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimePeriod(days)}
                className={`py-3 px-4 rounded-lg font-bold transition-colors ${
                  timePeriod === days
                    ? 'bg-gradient-to-r from-agro-primary to-agro-secondary text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Próximos {days} dias
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Resumo por Região */}
        {Object.keys(groupedByRegion).length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-agro-secondary" size={28} />
              Volume Previsto por Região
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedByRegion).map(([region, data]) => (
                <motion.div
                  key={region}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-agro-secondary"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="text-agro-secondary flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Região</p>
                      <p className="text-gray-900 font-bold">
                        {data.latitude.toFixed(2)}°, {data.longitude.toFixed(2)}°
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <p className="text-sm text-gray-600">
                      <strong>Volume Total:</strong> {data.total_volume.toFixed(0)} un
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(data.cultura).map(([cult, vol]) => (
                        <span
                          key={cult}
                          className="bg-white px-2 py-1 rounded text-xs font-semibold text-agro-primary"
                        >
                          {cult}: {vol.toFixed(0)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    {data.lotes.length} lote{data.lotes.length > 1 ? 's' : ''}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Grade de Lotes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🌾 Lotes Disponíveis
          </h2>

          {lotes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-2xl text-gray-400">😴 Nada previsto para este período</p>
              <p className="text-gray-500 mt-2">Tente um período maior</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lotes.map((lote, idx) => {
                const diasColheita = daysUntilHarvest(lote.data_colheita_estimada)
                const oferta = lote.ofertas_mercado?.[0]
                const saldoDisponivel = oferta?.saldo_disponivel || 0
                const unidadeMedida = oferta?.unidade_medida || 'un'

                return (
                  <motion.div
                    key={lote.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden ${
                      saldoDisponivel === 0 ? 'opacity-60 pointer-events-none' : ''
                    }`}
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                      <h3 className="text-2xl font-bold">{lote.cultura}</h3>
                      <p className="text-green-100">{lote.variedade}</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Data de Colheita */}
                      <div className="flex items-center gap-3">
                        <Calendar className="text-orange-500 flex-shrink-0" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Colheita em</p>
                          <p className="font-bold text-gray-900 text-lg">
                            {diasColheita} dia{diasColheita !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(lote.data_colheita_estimada).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      {/* Saldo Disponível (Quantidade Reservável) */}
                      <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                        <TrendingUp className="text-green-600 flex-shrink-0" size={24} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Disponível para Reserva</p>
                          <p className={`font-bold text-lg ${
                            saldoDisponivel > 0 ? 'text-green-700' : 'text-red-600'
                          }`}>
                            {saldoDisponivel.toFixed(0)} {unidadeMedida}
                          </p>
                        </div>
                        {saldoDisponivel === 0 && (
                          <span className="text-2xl">⚠️ Esgotado</span>
                        )}
                      </div>

                      {/* Produtor */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Produtor</p>
                        <p className="font-semibold text-gray-900">
                          {lote.perfis?.nome_fazenda}
                        </p>
                      </div>

                      {/* Certificação */}
                      {lote.certificacao && (
                        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                          <Leaf className="text-blue-600" size={18} />
                          <p className="text-sm text-blue-700 font-semibold">
                            ✅ {lote.certificacao}
                          </p>
                        </div>
                      )}

                      {/* Selo de Rastreabilidade */}
                      <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                        <span className="text-2xl">🔍</span>
                        <p className="text-sm text-green-700 font-semibold">
                          Rastreabilidade Ativa
                        </p>
                      </div>

                      {/* Aviso se Esgotado */}
                      {saldoDisponivel === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-lg border-l-4 border-red-500"
                        >
                          <AlertCircle size={18} />
                          <p className="text-sm font-semibold">
                            Todas as sacas foram reservadas. Aguarde novas disponibilidades.
                          </p>
                        </motion.div>
                      )}

                      {/* Botão de Reserva (ou desabilitado) */}
                      {saldoDisponivel > 0 ? (
                        <ReserveButton
                          loteId={lote.id}
                          ofertaId={oferta?.id}
                          produtor_id={lote.perfis?.id}
                          produtor_nome={lote.perfis?.nome_fazenda}
                          produtor_telefone={lote.perfis?.telefone}
                          cultura={lote.cultura}
                          saldo_disponivel={saldoDisponivel}
                          data_colheita={lote.data_colheita_estimada}
                          unidade_medida={unidadeMedida}
                        />
                      ) : (
                        <button disabled className="w-full bg-gray-300 text-gray-600 font-bold py-3 rounded-lg cursor-not-allowed">
                          😴 Reservas Esgotadas
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          <p className="text-center text-gray-600 mt-8">
            Mostrando {lotes.length} lote{lotes.length !== 1 ? 's' : ''} para os próximos {timePeriod} dias
          </p>
        </div>
      </div>
    </div>
  )
}
