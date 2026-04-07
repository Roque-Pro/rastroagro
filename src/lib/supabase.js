import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase environment variables not set!')
  console.error('VITE_SUPABASE_URL:', SUPABASE_URL)
  console.error('VITE_SUPABASE_ANON_KEY:', SUPABASE_KEY ? '***' : 'undefined')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function signOut() {
  await supabase.auth.signOut()
}
