import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Map, List, TrendingUp, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function BuyerNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { path: '/mapa-safras', label: 'Mapa', icon: Map },
    { path: '/marketplace', label: 'Vitrine', icon: List },
    { path: '/forecast', label: 'Previsões', icon: TrendingUp }
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <nav className="bg-white border-t border-gray-200 sticky bottom-0 z-20 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <motion.button
                  key={item.path}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-agro-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.button>
              )
            })}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-xs font-medium">Sair</span>
          </motion.button>
        </div>
      </div>
    </nav>
  )
}
