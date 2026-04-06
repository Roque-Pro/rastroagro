import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight, QrCode, TrendingUp, Zap, Shield, Users, 
  Smartphone, CheckCircle, Star, ChevronDown, ArrowUpRight,
  Calendar, Sprout, Camera, MapPin, Target, CheckCircle2,
  Leaf, Sun, Eye, Beaker, Scissors, Flame,
  DollarSign, UserPlus, Crosshair, Repeat, QrCode as QrCodeIcon, Wand2
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const heroY = useTransform(scrollY, [0, 300], [0, 100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-visible pt-20">
         {/* Background Image com Filtro */}
         <div className="absolute inset-0 z-0">
           <img 
             src="/src/img/um-homem-sorri-em-um-campo-de-feijao-com-o-sol-atras-dele_.avif"
             alt="Background"
             className="w-full h-full object-cover"
           />
           {/* Overlay para contraste */}
           <div className="absolute inset-0 bg-black/60"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950/80"></div>
         </div>

         {/* Background Effect */}
         <div className="absolute inset-0 z-0">
           <div className="absolute top-40 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
           <div className="absolute bottom-40 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
         </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-20 max-w-5xl mx-auto px-6 text-center overflow-visible"
        >
          {/* Nome Principal */}
          <motion.h1
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mb-12 text-7xl md:text-8xl font-black whitespace-nowrap overflow-visible"
            style={{ lineHeight: '1.5' }}
          >
            <span className="text-white">Rastro</span>
            <motion.span
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block ml-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent"
              style={{ backgroundSize: '200% 200%' }}
            >
              Agro
            </motion.span>
          </motion.h1>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 bg-clip-text text-transparent leading-tight"
          >
            Transforme a Confiança em Valor
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Mostre ao mundo inteiro todo o cuidado que você tem com sua safra.
            <span className="block mt-2 text-emerald-300 font-semibold">Aumente o preço. Venda mais. Seja diferente.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl overflow-hidden text-lg transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-2">
                Começar Agora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="block text-sm text-emerald-100 mt-1 group-hover:text-white">100% Grátis • Leva 2 minutos</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection('how-it-works')}
              className="px-8 py-4 border-2 border-emerald-500/50 text-emerald-300 hover:text-emerald-200 font-bold rounded-xl hover:bg-emerald-500/10 transition-all text-lg"
            >
              <div className="flex items-center justify-center gap-2">
                Ver Como Funciona
                <ChevronDown size={20} />
              </div>
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-emerald-400 cursor-pointer"
            onClick={() => scrollToSection('benefits')}
          >
            <ChevronDown size={32} className="mx-auto opacity-60 hover:opacity-100 transition-opacity" />
          </motion.div>
        </motion.div>
      </section>

      {/* PROBLEMA SECTION */}
      <section className="relative py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
              Por que você trabalha <span className="text-red-400">tão duro</span> e vende <span className="text-red-400">tão barato</span>?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {[
              { Icon: Leaf, text: 'Escolhe as melhores sementes', color: 'from-green-500 to-emerald-600' },
              { Icon: Sun, text: '12 horas trabalhando sob o sol', color: 'from-yellow-500 to-orange-600' },
              { Icon: Eye, text: 'Acompanha cada fase do crescimento', color: 'from-blue-500 to-cyan-600' },
              { Icon: Beaker, text: 'Aplica defensivos na hora certa', color: 'from-purple-500 to-indigo-600' },
              { Icon: Scissors, text: 'Colhe no momento perfeito', color: 'from-rose-500 to-pink-600' },
              { Icon: Flame, text: 'Coração e suor em cada safra', color: 'from-red-500 to-orange-600' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-emerald-500/60 transition-all hover:from-emerald-900/50 hover:to-teal-900/50"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className={`mb-4 inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}
                >
                  <item.Icon size={28} className="text-white" strokeWidth={2} />
                </motion.div>
                <p className="text-lg text-slate-300 font-semibold">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 p-8 bg-red-900/20 border-l-4 border-red-500 rounded-xl"
          >
            <p className="text-xl text-red-200">
              <span className="font-black">Mas aí chega a hora de vender...</span>
              <br className="mt-3" />
              Para o comprador, você é só mais um produtor. Vende pelo preço de mercado. Sem diferencial.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SOLUÇÃO SECTION */}
      <section className="relative py-20 md:py-32 px-6 bg-gradient-to-b from-transparent via-emerald-950/30 to-transparent overflow-hidden">
        {/* Background Image - Mais Leve */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <img 
            src="/src/img/um-homem-em-um-campo-de-girassois-esta-em-frente-a-um-por-do-sol_.avif"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/20 via-transparent to-slate-950/20"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-emerald-300">
              Deixe seu Trabalho Falar Sozinho
            </h2>
            <p className="text-xl text-slate-300 mb-4">Com a RastroAgro, você cria sua própria página de rastreabilidade</p>
            <p className="text-lg text-emerald-200 font-semibold">Registre cada etapa da sua produção e gere uma página única para compartilhar com seus compradores</p>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-6"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {[
              { 
                Icon: Calendar, 
                title: 'Data Exata', 
                desc: 'Quando você plantou',
                color: 'from-blue-500 to-blue-600'
              },
              { 
                Icon: Sprout, 
                title: 'Variedade', 
                desc: 'A melhor escolhida',
                color: 'from-green-500 to-emerald-600'
              },
              { 
                Icon: Camera, 
                title: 'Cada Fase', 
                desc: 'Fotos reais do trabalho',
                color: 'from-purple-500 to-purple-600'
              },
              { 
                Icon: MapPin, 
                title: 'Localização', 
                desc: 'Rastreável por GPS',
                color: 'from-red-500 to-rose-600'
              },
              { 
                Icon: Target, 
                title: 'Previsão', 
                desc: 'Quando vai colher',
                color: 'from-orange-500 to-amber-600'
              },
              { 
                Icon: CheckCircle2, 
                title: 'Documentado', 
                desc: 'Transparência total',
                color: 'from-teal-500 to-cyan-600'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/30 rounded-2xl p-8 hover:border-emerald-500/80 hover:from-emerald-900/40 hover:to-emerald-900/30 transition-all cursor-pointer backdrop-blur-sm relative overflow-hidden"
              >
                {/* Ícone com gradiente e background */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className={`mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}
                >
                  <item.Icon size={32} className="text-white" strokeWidth={1.5} />
                </motion.div>
                
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
            </motion.div>

            {/* DESTAQUE DA PÁGINA DO PRODUTOR */}
            <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-20 p-8 md:p-12 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-2 border-emerald-500/50 rounded-3xl text-center"
            >
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <Smartphone size={40} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-emerald-200 mb-4">
              Você Ganha Uma Página Própria
            </h3>
            <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
              Todos esses registros alimentam sua <span className="text-emerald-300 font-bold">página única de rastreabilidade</span>, que você compartilha com seus compradores via <span className="text-emerald-300 font-bold">QR Code</span>. 
              <br className="mt-2" />
              Comprador escaneia, vê tudo transparente e compra com confiança.
            </p>
            <div className="flex justify-center gap-4">
              <div className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                <p className="text-sm text-emerald-300 font-semibold">✓ Página em tempo real</p>
             </div>
              <div className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                <p className="text-sm text-emerald-300 font-semibold">✓ QR Code automático</p>
              </div>
              <div className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                <p className="text-sm text-emerald-300 font-semibold">✓ Sem custos</p>
              </div>
            </div>
            </motion.div>
            </div>
            </section>

            {/* VANTAGENS SECTION */}
      <section id="benefits" className="relative py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
              Ganhe Mais com Rastreabilidade
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Números reais de produtores que já aumentaram suas vendas
            </p>
          </motion.div>

          {/* VANTAGEM 1: PREÇO */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 mb-20 items-center"
          >
            <div>
              <h3 className="text-3xl md:text-4xl font-black mb-6 text-emerald-300 flex items-center gap-3">
                <TrendingUp size={40} className="text-green-400" />
                Aumente o Preço em até 30%
              </h3>
              <p className="text-lg text-slate-300 mb-8">
                Produtores que rastreiam conseguem vender com <span className="font-bold text-emerald-300">preço premium</span>
              </p>
              <ul className="space-y-4">
                {[
                  { label: '+15% a +30%', desc: 'Preço final maior' },
                  { label: 'Venda Direta', desc: 'Salta intermediário' },
                  { label: 'Melhor Negociação', desc: 'Comprador aceita pagar mais' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <CheckCircle className="text-emerald-400 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <p className="font-bold text-emerald-300">{item.label}</p>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </ul>

              {/* Exemplo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-10 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/40 rounded-xl p-6"
              >
                <p className="text-sm text-slate-400 mb-4">Exemplo Real:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Milho Comum</p>
                    <p className="text-2xl font-black text-red-400">R$ 0,80/kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Com Rastreabilidade</p>
                    <p className="text-2xl font-black text-emerald-400">R$ 1,05/kg</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-emerald-300 font-bold">+31% no seu bolso!</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-3xl p-12 flex items-center justify-center h-96"
            >
              <div className="text-center">
                <TrendingUp size={80} className="text-emerald-400 mx-auto mb-6" />
                <p className="text-5xl font-black text-emerald-300 mb-2">+30%</p>
                <p className="text-xl text-slate-300">Aumento de Preço</p>
              </div>
            </motion.div>
          </motion.div>

          {/* VANTAGEM 2: FACILIDADE */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 mb-20 items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-3xl p-12 flex items-center justify-center h-96 order-2 md:order-1"
            >
              <div className="text-center">
                <Zap size={80} className="text-blue-400 mx-auto mb-6" />
                <p className="text-4xl font-black text-blue-300 mb-2">1 Minuto</p>
                <p className="text-xl text-slate-300">Pra começar</p>
              </div>
            </motion.div>

            <div className="order-1 md:order-2">
              <h3 className="text-3xl md:text-4xl font-black mb-6 text-blue-300 flex items-center gap-3">
                <Zap size={40} className="text-blue-400" />
                Tão Fácil que Leva 1 Minuto
              </h3>

              <div className="space-y-6">
                {[
                  { num: '1', title: 'Criar', desc: 'Clica em "Novo Lote" - Tudo preenchido em menos de 1 minuto' },
                  { num: '2', title: 'Registrar', desc: 'Tira foto a cada fase - Salva observação opcional' },
                  { num: '3', title: 'Compartilhar', desc: 'Clica QR Code - Comprador escaneia e vê tudo' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 items-start group hover:bg-blue-900/20 p-4 rounded-lg transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="font-black text-white text-lg">{item.num}</span>
                    </div>
                    <div>
                      <p className="font-bold text-blue-300 text-lg">{item.title}</p>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-10 text-lg text-slate-300 italic border-l-4 border-blue-500 pl-4"
              >
                Nada de papel. Nada de sistema complicado.
                <br />
                Só você documentando o que JÁ faz todos os dias.
              </motion.p>
            </div>
          </motion.div>

          {/* VANTAGEM 3: CONFIANÇA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 mb-20 items-center"
          >
            <div>
              <h3 className="text-3xl md:text-4xl font-black mb-6 text-purple-300 flex items-center gap-3">
                <Shield size={40} className="text-purple-400" />
                Ganhe Confiança de Quem Compra
              </h3>

              <p className="text-lg text-slate-300 mb-8">
                O consumidor moderno quer saber <span className="font-bold">de onde vem</span> o alimento
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'De onde vem minha comida?',
                  'Como foi plantada?',
                  'Quem cuidou dela?',
                  'É realmente de qualidade?'
                ].map((q, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="text-slate-400 text-lg"
                  >
                    ❓ {q}
                  </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/40 rounded-xl p-6"
              >
                <p className="font-bold text-purple-300 mb-4">Com a RastroAgro você responde:</p>
                <ul className="space-y-2">
                  {[
                    'Vem da minha fazenda',
                    'Com todos os cuidados documentados',
                    'Eu mesmo acompanhei cada detalhe',
                    'Aqui está a prova (foto, data, localização)'
                  ].map((resp, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle className="text-purple-400 flex-shrink-0" size={20} />
                      {resp}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-3xl p-12 flex items-center justify-center h-96"
            >
              <div className="text-center">
                <Shield size={80} className="text-purple-400 mx-auto mb-6" />
                <p className="text-3xl font-black text-purple-300 mb-2">Confiança</p>
                <p className="text-xl text-slate-300">= Compra Garantida</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* COMPARAÇÃO - ANTES/DEPOIS */}
      <section id="how-it-works" className="relative py-20 md:py-32 px-6 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
              Seja Diferente no Mercado
            </h2>
            <p className="text-xl text-slate-400">Veja a diferença que a rastreabilidade faz</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* ANTES */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-900/20 to-slate-900/40 border-2 border-red-500/30 rounded-2xl p-8"
            >
              <h4 className="text-2xl font-black text-red-300 mb-6">❌ Sem Rastreabilidade</h4>

              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-500 mb-2">Comprador:</p>
                  <p className="text-slate-300 font-semibold">"Seu produto é bom?"</p>
                </div>

                <div className="text-center text-slate-400">⬇️</div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-500 mb-2">Produtor:</p>
                  <p className="text-slate-300 font-semibold">"Sim, é bom"</p>
                </div>

                <div className="text-center text-slate-400">⬇️</div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-red-500/30">
                  <p className="text-sm text-slate-500 mb-2">Resultado:</p>
                  <p className="text-red-300 font-black">"Vou comprar do outro mais barato"</p>
                </div>
              </div>

              <p className="mt-8 text-center text-red-400 font-bold">VENDA PERDIDA</p>
            </motion.div>

            {/* DEPOIS */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-900/20 to-slate-900/40 border-2 border-emerald-500/30 rounded-2xl p-8"
            >
              <h4 className="text-2xl font-black text-emerald-300 mb-6">✅ Com RastroAgro</h4>

              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-500 mb-2">Comprador:</p>
                  <p className="text-slate-300 font-semibold">"Seu produto é bom?"</p>
                </div>

                <div className="text-center text-slate-400">⬇️</div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-500 mb-2">Produtor:</p>
                  <p className="text-slate-300 font-semibold">"Sim! Escaneia o QR code, vê tudo: plantei tal dia, adubo tal hora, defensivo em tal momento..."</p>
                </div>

                <div className="text-center text-slate-400">⬇️</div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-emerald-500/30">
                  <p className="text-sm text-slate-500 mb-2">Comprador (após escanear):</p>
                  <p className="text-emerald-300 font-semibold">"Caramba, realmente tem carinho aqui!"</p>
                </div>

                <div className="text-center text-slate-400">⬇️</div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-emerald-500/30">
                  <p className="text-sm text-slate-500 mb-2">Resultado:</p>
                  <p className="text-emerald-300 font-black">"Vou comprar dele mesmo sendo mais caro!"</p>
                </div>
              </div>

              <p className="mt-6 text-center text-emerald-400 font-bold">VENDA FECHADA + PREÇO PREMIUM</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTEMUNHOS */}
      <section className="relative py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
              O que Produtores Dizem
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                quote: 'Desde que uso a RastroAgro, minhas vendas aumentaram 40%. Compradores pedem especificamente meu produto.',
                author: 'João Silva',
                role: 'Produtor de Milho (SP)',
                stars: 5
              },
              {
                quote: 'Consegui aumentar o preço em 25% só mostrando a transparência do meu trabalho. Agora vendo direto pra restaurantes.',
                author: 'Maria Santos',
                role: 'Produtora de Tomate (MG)',
                stars: 5
              },
              {
                quote: 'QR code é genial. Cliente escaneia no momento da negociação e já confia. Fecha mais vendas.',
                author: 'Pedro Costa',
                role: 'Produtor de Feijão (GO)',
                stars: 5
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-emerald-500/20 rounded-2xl p-8 hover:border-emerald-500/60 transition-all group"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-slate-300 text-lg mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>

                <div className="border-t border-emerald-500/20 pt-4">
                  <p className="font-bold text-emerald-300">{testimonial.author}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BENEFÍCIOS FINAIS */}
      <section className="relative py-20 md:py-32 px-6 bg-gradient-to-b from-transparent via-emerald-950/30 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
              Tudo que Você Ganha
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { Icon: DollarSign, title: 'Aumento de Preço', desc: 'Até +30% no valor final', color: 'from-green-500 to-emerald-600' },
              { Icon: UserPlus, title: 'Mais Clientes', desc: 'Diferencial indiscutível', color: 'from-blue-500 to-cyan-600' },
              { Icon: Crosshair, title: 'Venda Direta', desc: 'Salta intermediário', color: 'from-orange-500 to-amber-600' },
              { Icon: Repeat, title: 'Fidelização', desc: 'Compradores voltam sempre', color: 'from-purple-500 to-indigo-600' },
              { Icon: QrCodeIcon, title: 'Rastreabilidade', desc: 'Prove a qualidade', color: 'from-rose-500 to-pink-600' },
              { Icon: Wand2, title: 'Sem Burocracia', desc: '1 minuto pra começar', color: 'from-teal-500 to-cyan-600' }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-emerald-500/30 rounded-xl p-8 text-center hover:border-emerald-500/60 hover:from-emerald-900/20 transition-all"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className={`mb-4 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.color} shadow-lg`}
                >
                  <benefit.Icon size={32} className="text-white" strokeWidth={1.5} />
                </motion.div>
                <h4 className="text-xl font-black text-emerald-300 mb-2">{benefit.title}</h4>
                <p className="text-slate-400">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-20 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
              Pronto para Aumentar o Valor do seu Trabalho?
            </h2>

            <p className="text-xl text-slate-300 mb-12">
              Deixe de vender apenas produto.
              <br />
              <span className="text-emerald-300 font-bold">Venda a história, o cuidado, a qualidade.</span>
              <br />
              Venda VOCÊ.
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 30px 60px rgba(16, 185, 129, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="group relative px-12 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl overflow-hidden text-xl inline-block transition-all mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-3">
                Começar Agora Grátis
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.button>

            <p className="text-slate-400 text-lg">
              Leva 2 minutos • 100% Grátis • Nenhum cartão de crédito
            </p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-emerald-500/20 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-black text-lg text-emerald-300 mb-4">RastroAgro</h4>
              <p className="text-slate-400 text-sm">
                Rastreabilidade agrícola transparente que aumenta o valor do seu trabalho.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Produtor</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-emerald-300 transition">Como Funciona</a></li>
                <li><a href="#" className="hover:text-emerald-300 transition">Ver Exemplo</a></li>
                <li><a href="#" className="hover:text-emerald-300 transition">Preços</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-emerald-300 transition">Sobre</a></li>
                <li><a href="#" className="hover:text-emerald-300 transition">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-300 transition">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-emerald-300 transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-emerald-300 transition">Termos</a></li>
                <li><a href="#" className="hover:text-emerald-300 transition">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-emerald-500/20 pt-8 text-center text-slate-400 text-sm">
            <p>© 2024 RastroAgro. Todos os direitos reservados.</p>
            <p className="mt-2">Transforme a confiança em valor.</p>
          </div>
        </div>
      </footer>
      </div>
      )
      }
