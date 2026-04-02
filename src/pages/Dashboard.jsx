import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, LogOut, QrCode } from 'lucide-react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode.react'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [lotes, setLotes] = useState([])
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedQr, setSelectedQr] = useState(null)

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: perfilData } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', user.id)
            .single()

          setPerfil(perfilData)

          const { data: lotesData } = await supabase
            .from('lotes')
            .select('*, eventos_manejo(id)')
            .eq('produtor_id', user.id)
            .order('data_inicio', { ascending: false })

          setLotes(lotesData || [])
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-agro-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-agro-primary to-agro-secondary">
      {/* Header */}
      <div className="bg-gradient-to-r from-agro-primary via-agro-secondary to-green-700 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🌾 RastroAgro</h1>
            {perfil && <p className="text-green-100">{perfil.nome_fazenda}</p>}
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <LogOut size={20} />
            Sair
          </motion.button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* CTA Novo Lote */}
        <motion.a
          href="/novo-lote"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="block bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 p-6 rounded-xl shadow-lg font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl transition-shadow"
        >
          <Plus size={28} />
          Registrar Novo Lote
        </motion.a>

        {/* Lista de Lotes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Meus Lotes</h2>
          
          {lotes.length === 0 ? (
            <div className="bg-white bg-opacity-90 rounded-xl p-8 text-center text-gray-600">
              <p className="text-lg">Nenhum lote registrado ainda</p>
              <p className="text-sm">Comece a rastrear clicando no botão acima</p>
            </div>
          ) : (
            lotes.map((lote, index) => (
              <motion.div
                key={lote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{lote.cultura}</h3>
                      <p className="text-sm text-gray-600">{lote.variedade}</p>
                    </div>
                    <button
                      onClick={() => setSelectedQr(lote.qr_hash)}
                      className="bg-agro-primary hover:bg-agro-secondary text-white p-3 rounded-lg transition-colors"
                    >
                      <QrCode size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Início</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(lote.data_inicio).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Eventos</p>
                      <p className="font-semibold text-gray-900">{lote.eventos_manejo?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-semibold text-green-600">Ativo</p>
                    </div>
                  </div>

                  <a
                    href={`/lote/${lote.id}`}
                    className="block w-full text-center bg-agro-primary hover:bg-agro-secondary text-white py-2 rounded-lg font-semibold transition-colors"
                  >
                    Ver Detalhes
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedQr && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedQr(null)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-8 text-center"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              QR Code do Lote
            </h3>
            <QRCode
              value={`${window.location.origin}/check/${selectedQr}`}
              size={256}
              level="H"
              includeMargin={true}
            />
            <p className="text-sm text-gray-600 mt-6 max-w-xs">
              Escaneie este código para visualizar a rastreabilidade
            </p>
            <button
              onClick={() => setSelectedQr(null)}
              className="mt-6 bg-agro-primary hover:bg-agro-secondary text-white px-6 py-2 rounded-lg font-semibold transition-colors w-full"
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
