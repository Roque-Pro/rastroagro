import { motion } from 'framer-motion'
import { X, MessageCircle, Crown } from 'lucide-react'
import { UPGRADE_MESSAGE } from '../constants/plans'

export default function UpgradeModal({ feature, onClose, currentPlan }) {
  const message = UPGRADE_MESSAGE[feature] || 'Upgrade para acessar esta funcionalidade.'

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá! Tenho interesse em fazer upgrade do plano ${currentPlan} no RastroAgro para usar ${feature}. Pode me ajudar?`
    )
    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-lg">
              <Crown className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Upgrade Necessário</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mensagem */}
        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
          {message}
        </p>

        {/* Plano atual */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">Seu plano atual</p>
          <p className="text-xl font-bold text-gray-900 capitalize">{currentPlan}</p>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleWhatsApp}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
          >
            <MessageCircle size={20} />
            Falar com Consultor
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Entendido
          </motion.button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Plano Pro: R$ 99/mês | Enterprise: Personalizado
        </p>
      </motion.div>
    </motion.div>
  )
}
