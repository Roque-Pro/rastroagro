import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { saveOfflineEvent } from '../lib/db'
import { getGeoLocation } from '../lib/camera'
import CameraCapture from '../components/CameraCapture'
import Timeline from '../components/Timeline'
import { ArrowLeft, Plus, QrCode, Calendar, MapPin, Leaf, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode.react'
import { downloadQRCodePDF } from '../lib/pdf'

export default function LoteDetail() {
  const { loteId } = useParams()
  const navigate = useNavigate()
  const [lote, setLote] = useState(null)
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCamera, setShowCamera] = useState(false)
  const [selectedQr, setSelectedQr] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  useEffect(() => {
    const fetchLote = async () => {
      try {
        console.log('🔹 Buscando lote com ID:', loteId)
        
        const { data, error } = await supabase
          .from('lotes')
          .select('*, eventos_manejo(*)')
          .eq('id', loteId)
          .single()

        if (error) {
          console.error('❌ Erro ao buscar lote:', error)
          throw error
        }

        console.log('✅ Lote encontrado:', data)
        setLote(data)
        setEventos(data.eventos_manejo || [])
      } catch (error) {
        console.error('❌ Erro completo:', error)
      } finally {
        setLoading(false)
      }
    }

    if (loteId) {
      fetchLote()
    }
  }, [loteId])

  const handleEventCapture = async (eventData) => {
    try {
      const location = await getGeoLocation()

      const evento = {
        lote_id: loteId,
        tipo: eventData.tipo,
        foto: eventData.foto,
        timestamp: eventData.timestamp,
        localizacao: location
      }

      // Tenta salvar online
      try {
        const { data, error } = await supabase
          .from('eventos_manejo')
          .insert([evento])
          .select()

        if (!error) {
          setEventos([data[0], ...eventos])
          setShowCamera(false)
          return
        }
      } catch (onlineError) {
        console.log('Modo offline - salvando localmente')
      }

      // Se falhar, salva offline
      await saveOfflineEvent(evento)
      setEventos([{ ...evento, id: Date.now() }, ...eventos])
      setShowCamera(false)

      // Tenta sincronizar em background
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register('sync-events')
      }
    } catch (error) {
      console.error('Erro ao capturar evento:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-agro-primary border-t-transparent" />
      </div>
    )
  }

  if (!lote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Lote não encontrado</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-agro-primary text-white px-6 py-2 rounded-lg"
        >
          Voltar ao Dashboard
        </button>
      </div>
    )
  }

  if (showCamera) {
    return (
      <CameraCapture 
        onEventCapture={handleEventCapture} 
        loteId={loteId}
        onCancel={() => setShowCamera(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-agro-primary to-agro-secondary text-white p-6 sticky top-0 z-20 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/dashboard')}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold">🌾 RastroAgro</h1>
              <p className="text-green-100 text-sm">Rastreabilidade de Safra</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedQr(true)}
            className="bg-white text-agro-primary hover:bg-gray-100 p-3 rounded-lg font-bold transition-colors flex items-center gap-2"
          >
            <QrCode size={20} />
            QR Code
          </motion.button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Card Principal - Info do Lote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-8 mb-8 border-l-4 border-agro-primary"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Cultura Principal */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-agro-secondary rounded-full flex items-center justify-center text-3xl">
                  🌱
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{lote.cultura}</h2>
                  <p className="text-lg text-gray-600">Variedade: {lote.variedade}</p>
                </div>
              </div>
              {lote.area_hectares && (
                <p className="text-gray-600">
                  <strong>Área:</strong> {lote.area_hectares} hectares
                </p>
              )}
            </div>

            {/* Stats Box */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-agro-primary" size={20} />
                  <div>
                    <p className="text-xs text-gray-600">Plantio</p>
                    <p className="font-bold text-gray-900">
                      {new Date(lote.data_inicio).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Leaf className="text-agro-secondary" size={20} />
                  <div>
                    <p className="text-xs text-gray-600">Registros</p>
                    <p className="font-bold text-agro-secondary text-lg">{eventos.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Primário - Registrar Atividade */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCamera(true)}
            className="w-full bg-gradient-to-r from-agro-secondary to-green-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <Plus size={24} />
            Registrar Nova Fase
          </motion.button>
        </motion.div>

        {/* Timeline de Eventos com Layout Melhorado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="text-agro-primary" size={28} />
              Histórico de Fases
            </h3>
            <p className="text-gray-600 mt-2">
              Acompanhe o desenvolvimento da sua safra com data, hora e localização
            </p>
          </div>

          {eventos.length === 0 ? (
            <div className="text-center py-12">
              <Leaf size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma fase registrada ainda</p>
              <p className="text-gray-400 text-sm">Clique em "Registrar Nova Fase" para começar</p>
            </div>
          ) : (
            <Timeline eventos={eventos} />
          )}
        </motion.div>
      </div>

      {/* Modal QR Code */}
      {selectedQr && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedQr(false)}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              QR Code de Rastreamento
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Compartilhe este código para que outros acompanhem a procedência da sua safra
            </p>

            <div className="flex justify-center mb-8 bg-gray-50 p-6 rounded-xl">
              <QRCode
                value={`${window.location.origin}/check/${lote.qr_hash}`}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-700">
                <strong>ℹ️ Código Único:</strong> {lote.qr_hash}
              </p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  if (lote) {
                    setDownloadingPDF(true)
                    try {
                      await downloadQRCodePDF(
                        lote,
                        `${window.location.origin}/check/${lote.qr_hash}`
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
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                {downloadingPDF ? 'Gerando...' : 'PDF'}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedQr(false)}
                className="flex-1 bg-gradient-to-r from-agro-primary to-agro-secondary text-white font-bold py-3 rounded-xl hover:shadow-lg transition-shadow"
              >
                Fechar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
