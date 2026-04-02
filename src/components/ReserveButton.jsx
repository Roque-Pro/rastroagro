import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { gerarLinkWhatsApp } from '../lib/whatsapp'
import { ShoppingCart, Send, Check } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ReserveButton({
  loteId,
  ofertaId,
  produtor_id,
  produtor_nome,
  produtor_telefone,
  cultura,
  saldo_disponivel,
  data_colheita,
  unidade_medida = 'un'
}) {
  const [showForm, setShowForm] = useState(false)
  const [quantidade, setQuantidade] = useState(1)
  const [loading, setLoading] = useState(false)
  const [reservado, setReservado] = useState(false)
  const [erro, setErro] = useState('')

  const handleReserva = async () => {
    if (quantidade <= 0 || quantidade > saldo_disponivel) {
      setErro(`Quantidade inválida. Disponível: ${saldo_disponivel.toFixed(0)}`)
      return
    }

    setLoading(true)
    setErro('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Buscar ID do comprador
      const { data: comprador } = await supabase
        .from('perfis')
        .select('id, nome_fazenda')
        .eq('user_id', user.id)
        .single()

      // Criar lead (reserva)
      const { error: insertError } = await supabase
        .from('leads_negociacao')
        .insert([{
          lote_id: loteId,
          oferta_id: ofertaId,
          comprador_id: comprador.id,
          produtor_id,
          quantidade_reservada: quantidade,
          status: 'novo',
          whatsapp_enviado: false
        }])

      if (insertError) throw insertError

      // Gerar link WhatsApp
      const linkWhats = gerarLinkWhatsApp({
        produtor_nome,
        produtor_telefone,
        comprador_nome: user.email?.split('@')[0] || comprador.nome_fazenda,
        comprador_empresa: comprador.nome_fazenda,
        cultura,
        quantidade: quantidade.toFixed(0),
        data_colheita,
        unidade_medida
      })

      // Atualizar flag de whatsapp enviado
      await supabase
        .from('leads_negociacao')
        .update({ whatsapp_enviado: true })
        .eq('lote_id', loteId)
        .eq('comprador_id', comprador.id)

      // Abrir WhatsApp
      window.open(linkWhats, '_blank')

      setReservado(true)
      setShowForm(false)

      // Feedback
      console.log(`✅ Reserva de ${quantidade} ${unidade_medida} criada!`)
    } catch (error) {
      console.error('Erro ao reservar:', error)
      setErro('Erro ao processar reserva. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (reservado) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-2 bg-green-100 text-green-700 font-bold py-3 px-4 rounded-lg"
      >
        <Check size={20} />
        ✅ Reserva Confirmada!
      </motion.div>
    )
  }

  return (
    <>
      {!showForm ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(true)
            setErro('')
          }}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-shadow"
        >
          <ShoppingCart size={20} />
          🛒 Reservar e Chamar no WhatsApp
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 space-y-3 border-2 border-green-300"
        >
          {/* Info de Disponibilidade */}
          <div className="bg-white rounded-lg p-3 text-sm">
            <p className="text-gray-600">Saldo Disponível</p>
            <p className="font-bold text-gray-900 text-lg">
              {saldo_disponivel.toFixed(0)} {unidade_medida}
            </p>
          </div>

          {/* Input Quantidade */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Quantas {unidade_medida} você precisa?
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(parseFloat(e.target.value))}
              max={saldo_disponivel}
              min="1"
              className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none text-gray-900 font-semibold text-lg"
              placeholder="Ex: 30"
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo: {saldo_disponivel.toFixed(0)} {unidade_medida}
            </p>
          </div>

          {/* Erro */}
          {erro && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 text-red-700 text-sm p-3 rounded-lg"
            >
              ⚠️ {erro}
            </motion.div>
          )}

          {/* Preview da Mensagem */}
          <div className="bg-white rounded-lg p-3 text-xs border-l-4 border-blue-500">
            <p className="font-semibold text-gray-700 mb-2">Mensagem que será enviada:</p>
            <p className="text-gray-600 italic">
              "Olá {produtor_nome}, sou [seu nome]. Vi seu lote de {quantidade.toFixed(0)} {unidade_medida} de {cultura} no RastroAgro e acabo de registrar uma reserva de {quantidade.toFixed(0)} {unidade_medida} para a colheita do dia {new Date(data_colheita).toLocaleDateString('pt-BR')}. Vamos alinhar o preço e a entrega?"
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReserva}
              disabled={loading || quantidade <= 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {loading ? 'Processando...' : '✅ Confirmar'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 rounded-lg transition-colors"
            >
              ❌ Cancelar
            </motion.button>
          </div>

          {/* Info de Segurança */}
          <p className="text-xs text-gray-500 text-center">
            💡 Você está apenas registrando uma reserva. O preço será acordado via WhatsApp.
          </p>
        </motion.div>
      )}
    </>
  )
}
