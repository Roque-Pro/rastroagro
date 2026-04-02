import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Leaf, Droplets, Shield, Scissors } from 'lucide-react'

const TYPE_CONFIG = {
  plantio: { icon: Leaf, label: 'Plantio', color: 'text-green-600', bg: 'bg-green-100', emoji: '🌱' },
  adubo: { icon: Droplets, label: 'Adubação', color: 'text-blue-600', bg: 'bg-blue-100', emoji: '💧' },
  defensivo: { icon: Shield, label: 'Defensivo', color: 'text-orange-600', bg: 'bg-orange-100', emoji: '🛡️' },
  colheita: { icon: Scissors, label: 'Colheita', color: 'text-yellow-600', bg: 'bg-yellow-100', emoji: '🧺' }
}

export default function Timeline({ eventos = [] }) {
  const sorted = [...eventos].reverse()

  return (
    <div className="space-y-6 py-8">
      {sorted.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhum evento registrado ainda</p>
        </div>
      ) : (
        sorted.map((evento, index) => {
          const config = TYPE_CONFIG[evento.tipo] || TYPE_CONFIG.plantio
          const Icon = config.icon

          return (
            <motion.div
              key={evento.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Linha conectora */}
              {index < sorted.length - 1 && (
                <div className="absolute left-8 top-20 w-1 h-12 bg-gray-300" />
              )}

              <div className="flex gap-6">
                {/* Ícone circular */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-full ${config.bg} flex items-center justify-center relative z-10`}>
                  <Icon className={`${config.color} w-8 h-8`} />
                </div>

                {/* Conteúdo */}
                <div className="flex-1 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {config.emoji} {config.label}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {format(new Date(evento.timestamp), 'dd MMM yyyy', { locale: ptBR })}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {format(new Date(evento.timestamp), 'HH:mm:ss', { locale: ptBR })}
                  </p>

                  {evento.foto && (
                    <img
                      src={evento.foto}
                      alt={config.label}
                      className="w-full rounded-lg max-h-96 object-cover mb-3 cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  )}

                  {evento.localizacao && (
                    <p className="text-xs text-gray-500">
                      📍 {evento.localizacao.latitude?.toFixed(4)}, {evento.localizacao.longitude?.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })
      )}
    </div>
  )
}
