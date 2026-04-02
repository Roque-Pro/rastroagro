// IndexedDB para offline-first
export const DB_NAME = 'RastroAgroDB'
export const DB_VERSION = 1

export const STORES = {
  EVENTS: 'offline_events',
  FOTOS: 'offline_fotos',
  SYNC_QUEUE: 'sync_queue'
}

export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      // Store para eventos offline
      if (!db.objectStoreNames.contains(STORES.EVENTS)) {
        db.createObjectStore(STORES.EVENTS, { keyPath: 'id', autoIncrement: true })
      }
      
      // Store para fotos offline
      if (!db.objectStoreNames.contains(STORES.FOTOS)) {
        db.createObjectStore(STORES.FOTOS, { keyPath: 'id', autoIncrement: true })
      }
      
      // Store para fila de sincronização
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

export async function saveOfflineEvent(event) {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.EVENTS], 'readwrite')
    const store = tx.objectStore(STORES.EVENTS)
    const request = store.add(event)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getOfflineEvents() {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.EVENTS], 'readonly')
    const store = tx.objectStore(STORES.EVENTS)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteOfflineEvent(eventId) {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.EVENTS], 'readwrite')
    const store = tx.objectStore(STORES.EVENTS)
    const request = store.delete(eventId)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function saveFoto(photo) {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.FOTOS], 'readwrite')
    const store = tx.objectStore(STORES.FOTOS)
    const request = store.add(photo)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
