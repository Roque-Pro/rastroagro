// Utilidades para captura de câmera e GPS

export async function capturePhoto() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          resolve({
            data: event.target.result,
            name: file.name,
            timestamp: new Date().toISOString()
          })
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      } else {
        reject(new Error('No file selected'))
      }
    }
    
    input.click()
  })
}

export async function getCameraStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    })
    return stream
  } catch (error) {
    console.error('Camera error:', error)
    throw error
  }
}

/**
 * Obtém geolocalização do dispositivo com validações de confiabilidade
 * @returns {Promise} Objeto com coordenadas reais ou erro se não disponível
 */
export async function getGeoLocation() {
  return new Promise((resolve, reject) => {
    // 1. Verificar se o navegador suporta geolocalização
    if (!navigator.geolocation) {
      reject({
        code: 'GEOLOCATION_NOT_AVAILABLE',
        message: 'Geolocalização não disponível neste navegador'
      })
      return
    }

    // 2. Tentar obter a localização com alta precisão
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 3. Validar dados recebidos
        const { latitude, longitude, accuracy, altitudeAccuracy, timestamp } = position.coords
        
        // Validações de confiabilidade
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          reject({
            code: 'INVALID_COORDINATES',
            message: 'Coordenadas inválidas recebidas do GPS'
          })
          return
        }

        // Verificar se está dentro de range válido
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          reject({
            code: 'OUT_OF_RANGE',
            message: 'Coordenadas fora do intervalo válido'
          })
          return
        }

        // Retornar dados confiáveis
        resolve({
          type: 'Point',
          coordinates: [longitude, latitude], // GeoJSON format: [lon, lat]
          accuracy: Math.round(accuracy), // Precisão em metros
          altitudeAccuracy: altitudeAccuracy ? Math.round(altitudeAccuracy) : null,
          timestamp: new Date(timestamp).toISOString(),
          confianca: calculateTrust(accuracy)
        })
      },
      (error) => {
        // 4. Tratar erros específicos
        let errorMessage = 'Erro desconhecido'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de geolocalização negada. Ative nos ajustes do seu dispositivo.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Localização não disponível. Tente em uma área aberta ou ative o GPS.'
            break
          case error.TIMEOUT:
            errorMessage = 'Timeout ao obter localização. Tente novamente.'
            break
        }

        reject({
          code: error.code,
          message: errorMessage
        })
      },
      {
        enableHighAccuracy: true, // Usar GPS (não apenas WiFi)
        timeout: 15000, // Aguardar até 15 segundos
        maximumAge: 0 // Dados sempre novos (não cache)
      }
    )
  })
}

/**
 * Calcula nível de confiança da localização baseado na precisão
 * @param {number} accuracy - Precisão em metros
 * @returns {string} Nível de confiança (alta, média, baixa)
 */
function calculateTrust(accuracy) {
  if (accuracy <= 10) return 'alta' // ≤ 10m: Excelente (GPS ou WiFi muito próximo)
  if (accuracy <= 50) return 'média' // ≤ 50m: Bom (GPS ou WiFi)
  return 'baixa' // > 50m: Aceitável mas com ressalvas
}

export function capturePhotoFromVideo(video) {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.9)
}

export function stopStream(stream) {
  stream.getTracks().forEach(track => track.stop())
}
