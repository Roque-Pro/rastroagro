import { useState } from 'react'
import { MapPin, Leaf, Calendar, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MarketplaceFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    cultura: '',
    dias_colheita: 15,
    distancia_km: 50,
    qualidade_minima: 3
  })

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6 sticky top-20">
      <h3 className="text-xl font-bold text-gray-900">🔍 Filtros</h3>

      {/* Cultura */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Leaf size={18} />
          Cultura
        </label>
        <select
          value={filters.cultura}
          onChange={(e) => handleChange('cultura', e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-agro-primary focus:outline-none text-gray-900"
        >
          <option value="">Todas as culturas</option>
          <option value="Milho">🌽 Milho</option>
          <option value="Soja">🫘 Soja</option>
          <option value="Tomate">🍅 Tomate</option>
          <option value="Alface">🥬 Alface</option>
          <option value="Cana-de-açúcar">🌾 Cana-de-açúcar</option>
          <option value="Arroz">🍚 Arroz</option>
          <option value="Feijão">🫘 Feijão</option>
        </select>
      </div>

      {/* Colheita */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Calendar size={18} />
          Colheita em até {filters.dias_colheita} dias
        </label>
        <input
          type="range"
          min="1"
          max="30"
          value={filters.dias_colheita}
          onChange={(e) => handleChange('dias_colheita', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-agro-secondary"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Hoje</span>
          <span>30 dias</span>
        </div>
      </div>

      {/* Distância */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <MapPin size={18} />
          Raio de até {filters.distancia_km} km
        </label>
        <input
          type="range"
          min="5"
          max="500"
          step="5"
          value={filters.distancia_km}
          onChange={(e) => handleChange('distancia_km', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-agro-secondary"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Proximidade</span>
          <span>500 km</span>
        </div>
      </div>

      {/* Qualidade */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Star size={18} />
          Qualidade Mínima: {filters.qualidade_minima}⭐
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChange('qualidade_minima', star)}
              className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                filters.qualidade_minima >= star
                  ? 'bg-yellow-400 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              ⭐
            </motion.button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setFilters({
            cultura: '',
            dias_colheita: 15,
            distancia_km: 50,
            qualidade_minima: 3
          })
          onFilter({
            cultura: '',
            dias_colheita: 15,
            distancia_km: 50,
            qualidade_minima: 3
          })
        }}
        className="w-full bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        🔄 Limpar Filtros
      </motion.button>
    </div>
  )
}
