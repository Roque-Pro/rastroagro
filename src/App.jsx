import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import LoteDetail from './pages/LoteDetail'
import PublicTimeline from './components/PublicTimeline'
import ProducerProfile from './pages/ProducerProfile'
import FazendaProfile from './pages/FazendaProfile'
import BuyerMarketplace from './pages/BuyerMarketplace'
import BuyerForecast from './pages/BuyerForecast'
import BuyerMap from './pages/BuyerMap'
import Login from './pages/Login'
import NewLote from './pages/NewLote'

function App() {
  const [session, setSession] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      
      // Buscar role do usuário 
      if (session?.user?.id) {
        try {
          const { data: perfil, error } = await supabase
            .from('perfis')
            .select('user_role')
            .match({ user_id: session.user.id })
          
          if (!error && perfil?.[0]) {
            setUserRole(perfil[0].user_role || 'produtor')
          } else {
            // Fallback: assumir produtor se não encontrar
            setUserRole('produtor')
          }
        } catch (err) {
          console.error('Erro ao buscar user_role:', err)
          setUserRole('produtor')
        }
      }
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_, newSession) => {
          setSession(newSession)
          
          if (newSession?.user?.id) {
            try {
              const { data: perfil, error } = await supabase
                .from('perfis')
                .select('user_role')
                .match({ user_id: newSession.user.id })
              
              if (!error && perfil?.[0]) {
                setUserRole(perfil[0].user_role || 'produtor')
              } else {
                setUserRole('produtor')
              }
            } catch (err) {
              console.error('Erro ao buscar user_role:', err)
              setUserRole('produtor')
            }
          }
        }
      )

      setLoading(false)
      return () => subscription?.unsubscribe()
    }

    initSession()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-agro-primary to-agro-secondary">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent" />
      </div>
    )
  }

  return (
    <Router>
      <Routes>
         {/* Rotas Públicas */}
         <Route path="/check/:qrHash" element={<PublicTimeline />} />
         <Route path="/produtor/:producerId" element={<ProducerProfile />} />
         <Route path="/fazenda/:fazendaSlug" element={<FazendaProfile />} />
        
        {/* Rotas Autenticadas */}
        {session ? (
          <>
            {/* Produtor Routes */}
            {userRole === 'produtor' && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/lote/:loteId" element={<LoteDetail />} />
                <Route path="/novo-lote" element={<NewLote />} />
              </>
            )}

            {/* Comprador Routes */}
            {userRole === 'comprador' && (
              <>
                <Route path="/marketplace" element={<BuyerMarketplace />} />
                <Route path="/forecast" element={<BuyerForecast />} />
                <Route path="/mapa-safras" element={<BuyerMap />} />
                <Route path="/dashboard" element={<Navigate to="/mapa-safras" replace />} />
              </>
            )}

            {/* Default Redirect */}
            <Route 
              path="/" 
              element={
                <Navigate 
                  to={userRole === 'comprador' ? '/mapa-safras' : '/dashboard'} 
                  replace 
                />
              } 
            />
            
            {/* Catch all - se nenhuma rota matcher, ir pro home */}
            <Route path="*" element={<Navigate to={userRole === 'comprador' ? '/mapa-safras' : '/dashboard'} replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<LandingPage />} />
          </>
        )}
      </Routes>
    </Router>
  )
}

export default App
