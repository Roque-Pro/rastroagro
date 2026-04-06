import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, LogOut, QrCode, Download, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode.react'
import { downloadQRCodePDF } from '../lib/pdf'
import ProfileEditor from '../components/ProfileEditor'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [lotes, setLotes] = useState([])
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedQr, setSelectedQr] = useState(null)
  const [selectedLote, setSelectedLote] = useState(null)
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('🔹 Carregando dados do dashboard...')
        
        const { data: { user } } = await supabase.auth.getUser()
        console.log('✅ Usuário autenticado:', user?.id)
        setUser(user)

        if (user) {
          // Buscar perfil pelo user_id (não pelo id do perfil)
          console.log('🔹 Buscando perfil para user_id:', user.id)
          const { data: perfilData, error: perfilError } = await supabase
            .from('perfis')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (perfilError) {
            console.error('❌ Erro ao buscar perfil:', perfilError)
          } else {
            console.log('✅ Perfil encontrado:', perfilData)
            setPerfil(perfilData)
          }

          // Buscar lotes do produtor (usando perfil.id como produtor_id)
          if (perfilData) {
            console.log('🔹 Buscando lotes para produtor_id:', perfilData.id)
            const { data: lotesData, error: lotesError } = await supabase
              .from('lotes')
              .select('id, cultura, variedade, data_inicio, data_colheita_estimada, confianca, motivo_previsao, status, marketplace_visivel')
              .eq('produtor_id', perfilData.id)
              .order('data_inicio', { ascending: false })

            if (lotesError) {
              console.error('❌ Erro ao buscar lotes:', lotesError)
              console.error('Detalhes:', lotesError.message)
            } else {
              console.log('✅ Lotes encontrados:', lotesData?.length || 0)
              console.log('Dados dos lotes:', lotesData)
              setLotes(lotesData || [])
            }
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error)
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
         {/* Card de Bio do Produtor */}
         {perfil && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-4"
           >
             <ProfileEditor 
               perfil={perfil} 
               onUpdate={(updatedPerfil) => setPerfil(updatedPerfil)}
             />
             
             {/* Link para Página da Fazenda */}
             <motion.a
               href={`/fazenda/${perfil.slug || perfil.id}`}
               target="_blank"
               rel="noopener noreferrer"
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="block bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg font-bold flex items-center justify-center gap-3 hover:shadow-xl transition-shadow"
             >
               <Share2 size={20} />
               Ver Página da Minha Fazenda
             </motion.a>
           </motion.div>
         )}

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
                       onClick={() => {
                         setSelectedQr(lote.qr_hash)
                         setSelectedLote(lote)
                       }}
                       className="bg-agro-primary hover:bg-agro-secondary text-white p-3 rounded-lg transition-colors"
                     >
                       <QrCode size={20} />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Plantio</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(lote.data_inicio).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Previsão</p>
                      <p className="font-semibold text-green-600">
                        {lote.data_colheita_estimada 
                          ? new Date(lote.data_colheita_estimada).toLocaleDateString('pt-BR')
                          : 'Não calculada'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Atividades</p>
                      <p className="font-semibold text-gray-900">—</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Confiança</p>
                      <p className={`font-semibold ${lote.confianca >= 70 ? 'text-green-600' : lote.confianca >= 50 ? 'text-yellow-600' : 'text-gray-600'}`}>
                        {lote.confianca ? `${lote.confianca}%` : '—'}
                      </p>
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
          onClick={() => {
            setSelectedQr(null)
            setSelectedLote(null)
          }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-8 text-center max-w-sm"
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
            <p className="text-sm text-gray-600 mt-6">
              Escaneie este código para visualizar a rastreabilidade
            </p>

            {/* Informações do lote */}
            {selectedLote && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-2">
                <p><strong>Cultura:</strong> {selectedLote.cultura}</p>
                <p><strong>Código:</strong> {selectedLote.qr_hash}</p>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={async () => {
                  if (selectedLote) {
                    setDownloadingPDF(true)
                    try {
                      await downloadQRCodePDF(
                        selectedLote,
                        `${window.location.origin}/check/${selectedQr}`
                      )
                    } catch (error) {
                      console.error('Erro ao fazer download:', error)
                      alert('Erro ao gerar PDF')
                    } finally {
                      setDownloadingPDF(false)
                    }
                  }
                }}
                disabled={downloadingPDF}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                {downloadingPDF ? 'Gerando...' : 'Download PDF'}
              </button>
              <button
                onClick={() => {
                  setSelectedQr(null)
                  setSelectedLote(null)
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
