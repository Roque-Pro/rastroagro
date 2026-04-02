import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Heart, Check } from 'lucide-react'
import { motion } from 'framer-motion'

export default function InterestButton({ loteId, produtor_id }) {
  const [interested, setInterested] = useState(false)
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(100)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleInterest = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Buscar ID do comprador
      const { data: comprador } = await supabase
        .from('perfis')
        .select('id')
        .eq('user_id', user.id)
        .single()

      // Criar lead
      const { error } = await supabase
        .from('leads_negociacao')
        .insert([{
          lote_id: loteId,
          comprador_id: comprador.id,
          produtor_id,
          quantidade_interesse: quantity,
          mensagem: message,
          status: 'novo'
        }])

      if (error) throw error

      setInterested(true)
      setShowForm(false)
      
      // Notificar produtor (alert no seu dashboard)
      console.log('Lead criado com sucesso!')
    } catch (error) {
      console.error('Erro ao registrar interesse:', error)
    } finally {
      setLoading(false)
    }
  }

  if (interested) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-2 bg-green-100 text-green-700 font-bold py-3 px-4 rounded-lg"
      >
        <Check size={20} />
        Interesse Registrado! 🎯
      </motion.div>
    )
  }

  return (
    <>
      {!showForm ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-shadow"
        >
          <Heart size={20} />
          ❤️ Tenho Interesse
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-4 space-y-3 border-2 border-red-200"
        >
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Quantidade de Interesse (unidades/kg/sacas)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-gray-900"
              min="1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Mensagem (opcional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Preciso de entrega em SP..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-gray-900 resize-none h-16"
            />
          </div>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleInterest}
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg disabled:opacity-50 transition-colors"
            >
              {loading ? 'Enviando...' : '✅ Confirmar'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 rounded-lg transition-colors"
            >
              ❌ Cancelar
            </motion.button>
          </div>
        </motion.div>
      )}
    </>
  )
}
