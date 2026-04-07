import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { MapPin, LogOut, Search, RotateCcw, Filter, TrendingUp, Leaf, Users } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function BuyerMap() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markersRef = useRef({})
  
  const [lotes, setLotes] = useState([])
  const [culturas, setCulturas] = useState([])
  const [selectedCultura, setSelectedCultura] = useState('')
  const [searchRegion, setSearchRegion] = useState('')
  const [loading, setLoading] = useState(true)
  const [filteredLotes, setFilteredLotes] = useState([])
  const [stats, setStats] = useState({ total: 0, pronto: 0, medio: 0, cedo: 0 })

  useEffect(() => {
    fetchLotes()
  }, [])

  useEffect(() => {
    if (map.current) {
      renderMarkers()
      updateStats()
    }
  }, [filteredLotes])

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
          perfis(nome_fazenda, whatsapp),
          eventos_manejo(count)
        `)
        .eq('status', 'ativo')
        .eq('marketplace_visivel', true)

      if (error) throw error

      setLotes(data || [])
      const culturasUnicas = [...new Set(data.map(l => l.cultura))]
      setCulturas(culturasUnicas)
      setFilteredLotes(data || [])
    } catch (error) {
      console.error('Erro ao buscar lotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStats = () => {
    const now = new Date()
    const stats = {
      total: filteredLotes.length,
      pronto: 0,
      medio: 0,
      cedo: 0
    }

    filteredLotes.forEach(lote => {
      if (lote.data_colheita_estimada) {
        const days = Math.ceil((new Date(lote.data_colheita_estimada) - now) / (1000 * 60 * 60 * 24))
        if (days <= 7) stats.pronto++
        else if (days <= 15) stats.medio++
        else stats.cedo++
      }
    })

    setStats(stats)
  }

  const getMarkerColor = (dataColheita) => {
    if (!dataColheita) return 'gray'
    const today = new Date()
    const harvest = new Date(dataColheita)
    const days = Math.ceil((harvest - today) / (1000 * 60 * 60 * 24))
    
    if (days > 15) return 'red'
    if (days > 0) return 'orange'
    return 'green'
  }

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Aguarda um pouco pra garantir que o DOM renderizou
    const timer = setTimeout(() => {
      try {
        map.current = L.map(mapContainer.current, {
          zoom: 4,
          center: [-15.7942, -48.0192]
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map.current)

        // Invalidate size pra Leaflet recalcular
        setTimeout(() => {
          if (map.current) map.current.invalidateSize()
        }, 100)
      } catch (error) {
        console.error('Erro ao inicializar mapa:', error)
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  const renderMarkers = () => {
    Object.values(markersRef.current).forEach(marker => {
      map.current.removeLayer(marker)
    })
    markersRef.current = {}

    filteredLotes.forEach((lote) => {
      if (!lote.localizacao) return

      const [lon, lat] = lote.localizacao.coordinates
      const color = getMarkerColor(lote.data_colheita_estimada)
      const days = lote.data_colheita_estimada 
        ? Math.ceil((new Date(lote.data_colheita_estimada) - new Date()) / (1000 * 60 * 60 * 24))
        : null

      const iconColor = {
        red: 'hsl(0, 100%, 50%)',
        orange: 'hsl(39, 100%, 50%)',
        green: 'hsl(122, 71%, 47%)',
        gray: 'hsl(0, 0%, 50%)'
      }[color]

      const icon = L.divIcon({
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: ${iconColor};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-size: 12px;
          ">
            ${days ? days + 'd' : '?'}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })

      const popup = `
        <div style="min-width: 250px;">
          <h3 style="margin: 0 0 10px 0; font-weight: bold; color: #333;">
            ${lote.cultura}
          </h3>
          <p style="margin: 5px 0; color: #666; font-size: 12px;">
            <strong>Variedade:</strong> ${lote.variedade}
          </p>
          <p style="margin: 5px 0; color: #666; font-size: 12px;">
            <strong>Produtor:</strong> ${lote.perfis?.nome_fazenda}
          </p>
          ${days ? `<p style="margin: 5px 0; color: #666; font-size: 12px;">
            <strong>Colheita em:</strong> ${days} dia${days !== 1 ? 's' : ''}
          </p>` : ''}
          ${lote.perfis?.whatsapp ? `
            <a href="https://wa.me/${lote.perfis.whatsapp}?text=Olá! Tenho interesse no ${lote.cultura}" 
               target="_blank" 
               rel="noopener noreferrer"
               style="
                 display: inline-block;
                 margin-top: 10px;
                 background: #25D366;
                 color: white;
                 padding: 8px 12px;
                 border-radius: 6px;
                 text-decoration: none;
                 font-weight: bold;
                 font-size: 12px;
               ">
              💬 WhatsApp
            </a>
          ` : ''}
        </div>
      `

      const marker = L.marker([lat, lon], { icon })
        .bindPopup(popup)
        .addTo(map.current)

      markersRef.current[lote.id] = marker
    })
  }

  const applyFilters = () => {
    let result = lotes

    if (selectedCultura) {
      result = result.filter(l => l.cultura === selectedCultura)
    }

    if (searchRegion) {
      result = result.filter(l => 
        l.perfis?.nome_fazenda?.toLowerCase().includes(searchRegion.toLowerCase())
      )
    }

    setFilteredLotes(result)
  }

  useEffect(() => {
    applyFilters()
  }, [selectedCultura, searchRegion])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-agro-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-agro-primary via-green-600 to-agro-secondary text-white shadow-lg z-20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🗺️</div>
              <div>
                <h1 className="text-2xl font-bold">Mapa de Safras</h1>
                <p className="text-green-100 text-sm">Encontre produtos frescos próximos a você</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <LogOut size={18} />
              Sair
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-3">
              <p className="text-xs text-green-100">Total</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 rounded-lg p-3">
              <p className="text-xs text-green-100">Pronto</p>
              <p className="text-2xl font-bold text-white">{stats.pronto}</p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 rounded-lg p-3">
              <p className="text-xs text-orange-100">Médio</p>
              <p className="text-2xl font-bold text-white">{stats.medio}</p>
            </div>
            <div className="bg-red-400 bg-opacity-30 rounded-lg p-3">
              <p className="text-xs text-red-100">Cedo</p>
              <p className="text-2xl font-bold text-white">{stats.cedo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4 flex-wrap z-10">
        {/* Pesquisar por Região */}
        <div className="flex items-center gap-2 flex-1 min-w-64">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por produtor ou região..."
            value={searchRegion}
            onChange={(e) => setSearchRegion(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-agro-primary focus:outline-none"
          />
        </div>

        {/* Filtro por Cultura */}
        <select
          value={selectedCultura}
          onChange={(e) => setSelectedCultura(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-agro-primary focus:outline-none bg-white text-gray-900 flex items-center gap-2"
        >
          <option value="">Todas as culturas</option>
          {culturas.map((cultura) => (
            <option key={cultura} value={cultura}>
              {cultura}
            </option>
          ))}
        </select>

        {/* Botão Limpar Filtros */}
        {(selectedCultura || searchRegion) && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCultura('')
              setSearchRegion('')
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw size={18} />
            Limpar
          </motion.button>
        )}

        {/* Legenda Estilizada */}
        <div className="ml-auto flex items-center gap-2">
          <div className="bg-green-50 border border-green-300 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <div>
              <p className="text-xs font-bold text-green-900">Pronto</p>
              <p className="text-xs text-green-700">≤ 7 dias</p>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-300 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <div>
              <p className="text-xs font-bold text-orange-900">Próximo</p>
              <p className="text-xs text-orange-700">7-15 dias</p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <div>
              <p className="text-xs font-bold text-red-900">Cedo</p>
              <p className="text-xs text-red-700">&gt; 15 dias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa + Sidebar */}
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Mapa */}
        <div 
          ref={mapContainer} 
          className="flex-1 rounded-xl shadow-lg overflow-hidden"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Sidebar com Lista de Lotes */}
        {filteredLotes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-agro-primary to-agro-secondary text-white p-4">
              <h3 className="font-bold text-lg">
                {filteredLotes.length} safra{filteredLotes.length !== 1 ? 's' : ''} encontrada{filteredLotes.length !== 1 ? 's' : ''}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-3">
                {filteredLotes.map((lote) => {
                  const days = lote.data_colheita_estimada 
                    ? Math.ceil((new Date(lote.data_colheita_estimada) - new Date()) / (1000 * 60 * 60 * 24))
                    : null
                  
                  const dayColor = days <= 7 ? 'bg-green-100 text-green-800' : days <= 15 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                  
                  return (
                    <motion.div
                      key={lote.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{lote.cultura}</p>
                          <p className="text-xs text-gray-600">{lote.variedade}</p>
                        </div>
                        {days && (
                          <span className={`text-xs font-bold px-2 py-1 rounded ${dayColor}`}>
                            {days}d
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mb-2">
                        📍 {lote.perfis?.nome_fazenda}
                      </p>

                      {lote.perfis?.whatsapp && (
                        <a
                          href={`https://wa.me/${lote.perfis.whatsapp}?text=Olá! Tenho interesse no ${lote.cultura}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full block text-center bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded transition-colors"
                        >
                          💬 Contatar
                        </a>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
