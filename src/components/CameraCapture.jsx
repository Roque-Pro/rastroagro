import { useRef, useState, useEffect } from 'react'
import { getCameraStream, stopStream, capturePhotoFromVideo, getGeoLocation } from '../lib/camera'
import { Leaf, Droplets, Shield, Scissors, RotateCcw, AlertCircle, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

const MANAGEMENT_TYPES = [
  { id: 'plantio', label: 'Plantio', icon: Leaf, color: 'bg-green-600', emoji: '🌱' },
  { id: 'adubo', label: 'Adubação', icon: Droplets, color: 'bg-blue-600', emoji: '💧' },
  { id: 'defensivo', label: 'Defensivo', icon: Shield, color: 'bg-orange-600', emoji: '🛡️' },
  { id: 'colheita', label: 'Colheita', icon: Scissors, color: 'bg-yellow-600', emoji: '🧺' }
]

export default function CameraCapture({ onEventCapture, loteId }) {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [localizacao, setLocalizacao] = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState(null)

  useEffect(() => {
    const initCamera = async () => {
      try {
        const cameraStream = await getCameraStream()
        setStream(cameraStream)
        if (videoRef.current) {
          videoRef.current.srcObject = cameraStream
        }
        setLoading(false)
      } catch (error) {
        console.error('Erro ao acessar câmera:', error)
        setLoading(false)
      }
    }

    initCamera()

    return () => {
      if (stream) {
        stopStream(stream)
      }
    }
  }, [])

  const handleCapture = async () => {
    if (videoRef.current) {
      const photoData = capturePhotoFromVideo(videoRef.current)
      setPhoto(photoData)
      
      // Capturar geolocalização automaticamente
      setGeoLoading(true)
      setGeoError(null)
      try {
        const geo = await getGeoLocation()
        setLocalizacao(geo)
      } catch (error) {
        console.error('Erro geo:', error)
        setGeoError(error.message || 'Erro ao capturar localização. Tente novamente.')
      } finally {
        setGeoLoading(false)
      }
    }
  }

  const handleRetake = () => {
    setPhoto(null)
    setSelectedType(null)
    setLocalizacao(null)
    setGeoError(null)
  }

  const handleTypeSelect = async (type) => {
    if (!photo) return
    
    // Validar geolocalização
    if (!localizacao) {
      setGeoError('❌ Geolocalização obrigatória! Tirar outra foto para capturar a localização.')
      return
    }
    
    setSelectedType(type.id)
    setSubmitting(true)
    setGeoError(null)

    try {
      // Celebração visual
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      // Vibração
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50])
      }

      await onEventCapture({
        loteId,
        tipo: type.id,
        foto: photo,
        timestamp: new Date().toISOString(),
        localizacao: localizacao
      })

      // Reset
       setTimeout(() => {
         setPhoto(null)
         setSelectedType(null)
         setLocalizacao(null)
         setSubmitting(false)
       }, 1500)
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-black relative flex flex-col">
      {!photo ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleCapture}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-agro-secondary rounded-full border-4 border-white shadow-lg hover:bg-agro-primary transition-colors"
          />
        </>
      ) : (
        <div className="w-full h-full flex flex-col">
          <img src={photo} alt="Capturada" className="flex-1 object-cover" />
          
          {!submitting && (
             <motion.div
               initial={{ y: 300 }}
               animate={{ y: 0 }}
               className="bg-gray-900 p-6 space-y-4 max-h-64 overflow-y-auto"
             >
               {/* Indicador de Geolocalização com Confiança */}
               <div className={`p-4 rounded-lg text-sm font-bold space-y-2 ${
                 localizacao 
                   ? 'bg-green-900 text-green-100' 
                   : geoError 
                   ? 'bg-red-900 text-red-100' 
                   : 'bg-yellow-900 text-yellow-100'
               }`}>
                 <div className="flex items-center gap-2">
                   <MapPin size={18} />
                   {localizacao 
                     ? '✅ Localização capturada com precisão' 
                     : geoError 
                     ? '❌ Erro na geolocalização' 
                     : geoLoading 
                     ? '⏳ Aguardando GPS...'
                     : '📍 Ative GPS para continuar'}
                 </div>
                 
                 {/* Detalhes da Localização */}
                 {localizacao && (
                   <div className="text-xs opacity-90 border-t border-current pt-2 space-y-1">
                     <p>📍 Precisão: {localizacao.accuracy}m</p>
                     <p>🎯 Confiança: {localizacao.confianca === 'alta' ? '🟢 Alta' : localizacao.confianca === 'média' ? '🟡 Média' : '🔴 Baixa'}</p>
                     <p>🕐 {new Date(localizacao.timestamp).toLocaleTimeString('pt-BR')}</p>
                   </div>
                 )}
                 
                 {/* Erro Detalhado */}
                 {geoError && (
                   <div className="text-xs opacity-90 border-t border-current pt-2">
                     {geoError}
                   </div>
                 )}
               </div>

               <p className="text-white text-center text-xl font-bold">
                 Qual atividade você fez?
               </p>
              
              <div className="grid grid-cols-2 gap-4">
                {MANAGEMENT_TYPES.map((type) => (
                  <motion.button
                    key={type.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTypeSelect(type)}
                    disabled={!localizacao || geoLoading}
                    className={`${type.color} p-6 rounded-lg text-white font-bold text-xl flex flex-col items-center gap-3 transition-all hover:shadow-lg ${
                      !localizacao || geoLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="text-4xl">{type.emoji}</span>
                    {type.label}
                  </motion.button>
                ))}
              </div>

              <button
                onClick={handleRetake}
                className="w-full bg-gray-700 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-600"
              >
                <RotateCcw size={20} />
                Tirar outra foto
              </button>
            </motion.div>
          )}

          {submitting && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-6xl"
              >
                ✅
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
