import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PLANS } from '../constants/plans'

export function usePlanCheck() {
  const [userPlan, setUserPlan] = useState('free')
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('produtor')

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: perfil } = await supabase
            .from('perfis')
            .select('plano, user_role')
            .eq('user_id', user.id)
            .single()

          if (perfil) {
            setUserPlan(perfil.plano || 'free')
            setUserRole(perfil.user_role || 'produtor')
          }
        }
      } catch (error) {
        console.error('Erro ao buscar plano:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserPlan()
  }, [])

  const canAccess = (feature) => {
    const plan = PLANS[userPlan]
    return plan[feature] || false
  }

  const getLotesCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: perfil } = await supabase
        .from('perfis')
        .select('id')
        .eq('user_id', user.id)
        .single()

      const { count } = await supabase
        .from('lotes')
        .select('id', { count: 'exact' })
        .eq('produtor_id', perfil.id)
        .eq('status', 'ativo')

      return count
    } catch (error) {
      console.error('Erro ao contar lotes:', error)
      return 0
    }
  }

  const canCreateNewLote = async () => {
    const count = await getLotesCount()
    const maxLotes = PLANS[userPlan].max_lotes
    return count < maxLotes
  }

  return {
    userPlan,
    userRole,
    loading,
    canAccess,
    getLotesCount,
    canCreateNewLote,
    planDetails: PLANS[userPlan]
  }
}
