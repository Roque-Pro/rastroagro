import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Ler .env.local
const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')

const env = {}
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=')
    env[key] = value
  }
})

const SUPABASE_URL = env.VITE_SUPABASE_URL
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY

console.log('📋 Testando Conexão com Supabase...\n')
console.log(`URL: ${SUPABASE_URL}`)
console.log(`Chave: ${SUPABASE_KEY ? '✓ Configurada' : '✗ Faltando'}\n`)

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function testConnection() {
  try {
    console.log('1️⃣ Testando acesso ao banco de dados...')
    const { data, error } = await supabase
      .from('perfis')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error(`❌ Erro: ${error.message}`)
      console.error(`Código: ${error.code}`)
      return false
    }
    
    console.log('✅ Banco de dados acessível!\n')

    console.log('2️⃣ Testando tabelas...')
    const tables = ['perfis', 'lotes', 'eventos_manejo']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1)
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`)
        } else {
          console.log(`✅ ${table}: OK`)
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`)
      }
    }

    console.log('\n✅ Conexão com Supabase está FUNCIONANDO!')
    return true
  } catch (error) {
    console.error(`❌ Erro ao conectar: ${error.message}`)
    return false
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1)
})
