// Definição dos planos de preço
export const PLANS = {
  free: {
    name: 'Free',
    max_lotes: 2,
    reports: false,
    marketplace_visibility: false,
    custom_branding: false,
    buyer_dashboard: false,
    max_eventos_por_lote: 50
  },
  pro: {
    name: 'Pro',
    max_lotes: 999,
    reports: true,
    marketplace_visibility: true,
    custom_branding: true,
    buyer_dashboard: false,
    max_eventos_por_lote: 999
  },
  enterprise: {
    name: 'Enterprise',
    max_lotes: 9999,
    reports: true,
    marketplace_visibility: true,
    custom_branding: true,
    buyer_dashboard: true,
    max_eventos_por_lote: 9999
  }
}

export const PLAN_FEATURES = {
  reports: 'Gerar Relatórios em PDF',
  marketplace_visibility: 'Publicar na Vitrine de Safras',
  custom_branding: 'Personalizar marca',
  buyer_dashboard: 'Dashboard de Comprador'
}

export const UPGRADE_MESSAGE = {
  reports: 'Sua rastreabilidade está segura! Para gerar documentos oficiais para o mercado e exportação, assine o Plano Pro.',
  marketplace_visibility: 'Publica na Vitrine de Safras com Plano Pro ou superior.',
  buyer_dashboard: 'Dashboard de Comprador disponível apenas em Plano Enterprise.'
}
