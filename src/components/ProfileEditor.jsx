import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Edit2, X, Check } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProfileEditor({ perfil, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(perfil?.bio || '')
  const [slug, setSlug] = useState(perfil?.slug || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setLoading(true)
    setMessage('')

    try {
      const updateData = { bio }
      
      // Se não tiver slug, gerar um
      if (!perfil.slug) {
        updateData.slug = `fazenda-${Date.now()}`
      } else if (slug !== perfil.slug && slug.trim()) {
        // Se modificou o slug, validar
        updateData.slug = slug.trim().toLowerCase().replace(/\s+/g, '-')
      }

      const { error } = await supabase
        .from('perfis')
        .update(updateData)
        .eq('id', perfil.id)

      if (error) throw error

      setMessage('✅ Dados atualizados com sucesso!')
      onUpdate({ ...perfil, bio, slug: updateData.slug || perfil.slug })
      setTimeout(() => {
        setIsEditing(false)
        setMessage('')
      }, 1500)
    } catch (err) {
      setMessage('❌ Erro ao atualizar')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg"
    >
      {!isEditing ? (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm font-semibold text-blue-900">Sua Bio</p>
            {perfil?.bio ? (
              <p className="text-blue-800 text-sm leading-relaxed">
                {perfil.bio}
              </p>
            ) : (
              <p className="text-blue-600 italic text-sm">
                Adicione uma descrição da sua fazenda para atrair mais clientes
              </p>
            )}
            {perfil?.slug && (
              <p className="text-xs text-blue-600 mt-3">
                🔗 Link: <strong>{perfil.slug}</strong>
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setIsEditing(true)
              setBio(perfil?.bio || '')
              setSlug(perfil?.slug || '')
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm whitespace-nowrap"
          >
            <Edit2 size={16} />
            Editar
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-blue-900 block mb-1">Bio da Fazenda</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 500))}
              placeholder="Descreva sua fazenda, produtos, valores e tudo que você acha importante que seus clientes saibam..."
              className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows="4"
            />
            <p className="text-xs text-gray-600 mt-1">{bio.length}/500 caracteres</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-blue-900 block mb-1">URL da Sua Página</label>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold">
                {window?.location?.origin || 'seu-dominio'}/fazenda/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="seu-nome-unico"
                className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">Apenas letras, números e hífen</p>
          </div>
          <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={16} />
                Cancelar
              </button>
              <button
                 onClick={handleSave}
                 disabled={loading || (bio === (perfil?.bio || '') && slug === (perfil?.slug || ''))}
                 className="flex items-center gap-2 text-white font-semibold text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
               >
                 <Check size={16} />
                 {loading ? 'Salvando...' : 'Salvar'}
               </button>
               </div>
               {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm font-medium ${
                message.includes('✅')
                  ? 'text-green-700 bg-green-100 p-2 rounded'
                  : 'text-red-700 bg-red-100 p-2 rounded'
              }`}
            >
              {message}
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  )
}
