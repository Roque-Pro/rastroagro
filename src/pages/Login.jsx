import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [userRole, setUserRole] = useState('produtor')
  const [nomeFazenda, setNomeFazenda] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        // Sign Up
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              nome_fazenda: nomeFazenda,
              user_role: userRole,
              whatsapp
            }
          }
        })

        if (authError) throw authError

        // Criar perfil
        await supabase.from('perfis').insert([{
          user_id: data.user.id,
          nome_fazenda: nomeFazenda,
          email,
          user_role: userRole,
          whatsapp: whatsapp || null
        }])

        setError('✅ Cadastro realizado! Verifique seu email e faça login.')
        setIsSignUp(false)
        setEmail('')
        setPassword('')
        setNomeFazenda('')
        setWhatsapp('')
        setUserRole('produtor')
        setError('')
      } else {
        // Sign In
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (authError) throw authError

        window.location.href = '/dashboard'
      }
    } catch (err) {
      setError(err.message || 'Erro na autenticação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* LADO ESQUERDO - IMAGEM */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/agro2.webp)' }}>
        <img
          src="/agro2.webp"
          alt="Agricultura"
          className="w-full h-full object-cover"
        />

        {/* Conteúdo sobreposto */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-8"
        >
          {/* Logo com sombra */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8"
          >
            <h1 className="text-8xl font-bold drop-shadow-lg">🌾</h1>
          </motion.div>

          {/* Título com fundo com elegância */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-10 py-6 mb-6 border border-white/20 shadow-2xl">
            <h2 className="text-6xl font-bold text-white drop-shadow-lg">RastroAgro</h2>
            <p className="text-lg text-white/90 mt-2 drop-shadow-md">
              Rastreabilidade agrícola transparente
            </p>
          </div>

          {/* Descrição */}
          <p className="text-xl text-white/95 max-w-sm drop-shadow-lg mb-10 font-medium">
            Conectando produtor e consumidor através da confiança
          </p>

          {/* Benefícios com cards elegantes */}
          <div className="space-y-3 max-w-sm">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 hover:bg-white/15 transition-all"
            >
              <p className="text-white/90 text-sm flex items-center gap-2">
                <span className="text-green-300 text-lg font-bold">✓</span>
                Rastreie cada etapa da produção
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 hover:bg-white/15 transition-all"
            >
              <p className="text-white/90 text-sm flex items-center gap-2">
                <span className="text-green-300 text-lg font-bold">✓</span>
                Transparência total para clientes
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 hover:bg-white/15 transition-all"
            >
              <p className="text-white/90 text-sm flex items-center gap-2">
                <span className="text-green-300 text-lg font-bold">✓</span>
                Segurança de dados garantida
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* LADO DIREITO - FORMULÁRIO */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Logo Mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-6xl font-bold text-green-700 mb-3">🌾</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">RastroAgro</h2>
            <p className="text-gray-600 text-sm">Rastreabilidade agrícola transparente</p>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-6 border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-gray-900">
                {isSignUp ? 'Criar Conta' : 'Bem-vindo'}
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                {isSignUp ? 'Faça seu cadastro para começar' : 'Entre com suas credenciais'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
            {isSignUp && (
              <>
                {/* Seletor de Tipo de Usuário */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Usuário
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full px-4 py-3 border-0 rounded-xl bg-gray-100 text-gray-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  >
                    <option value="produtor">🌾 Produtor</option>
                    <option value="comprador">🛒 Comprador</option>
                  </select>
                </div>

                {/* Nome da Fazenda */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {userRole === 'produtor' ? 'Nome da Fazenda' : 'Empresa/Pessoa'}
                  </label>
                  <input
                    type="text"
                    value={nomeFazenda}
                    onChange={(e) => setNomeFazenda(e.target.value)}
                    className="w-full px-4 py-3 border-0 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder={userRole === 'produtor' ? "Ex: Fazenda São João" : "Ex: Mercado da Vila"}
                    required
                  />
                </div>

                {/* WhatsApp (apenas produtor) */}
                {userRole === 'produtor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp (com DDD)
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      placeholder="Ex: 11999999999"
                      className="w-full px-4 py-3 border-0 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                  </div>
                )}

                {/* Aviso sobre Geolocalização */}
                {userRole === 'produtor' && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-700">
                      <strong>ℹ️ Geolocalização:</strong> Será capturada automaticamente ao registrar cada fase da safra, garantindo a procedência do produto.
                    </p>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-0 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-0 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 rounded-xl text-sm font-medium ${
                  error.includes('✅')
                    ? 'bg-green-100/80 text-green-900'
                    : 'bg-red-100/80 text-red-900'
                }`}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 shadow-md hover:from-green-700 hover:to-green-800"
            >
              {loading ? 'Carregando...' : isSignUp ? 'Cadastrar' : 'Entrar'}
            </motion.button>
          </form>

          {/* Toggle Sign Up */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              {isSignUp ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
                className="text-green-600 font-bold hover:text-green-700 transition-colors"
              >
                {isSignUp ? 'Entrar' : 'Cadastrar'}
              </button>
            </p>
          </div>
          </div>

          {/* Footer Mobile */}
          <p className="text-gray-500 text-center text-xs mt-8">
            © 2024 RastroAgro. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
