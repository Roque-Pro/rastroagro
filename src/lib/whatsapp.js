// Gerar link de WhatsApp com mensagem pré-preenchida

export function gerarLinkWhatsApp({
  produtor_nome,
  produtor_telefone,
  comprador_nome,
  comprador_empresa,
  cultura,
  quantidade,
  data_colheita,
  unidade_medida = 'un'
}) {
  // Formatar telefone (remover caracteres especiais)
  const telefoneLimpo = produtor_telefone?.replace(/\D/g, '') || ''
  
  // Mensagem automática
  const mensagem = `Olá ${produtor_nome}, sou ${comprador_nome}${comprador_empresa ? ` do ${comprador_empresa}` : ''}. Vi seu lote de ${cultura} no RastroAgro e acabo de registrar uma reserva de ${quantidade} ${unidade_medida} para a colheita do dia ${formatarData(data_colheita)}. Vamos alinhar o preço e a entrega?`

  // Codificar mensagem
  const mensagemCodificada = encodeURIComponent(mensagem)

  // Gerar link
  if (telefoneLimpo) {
    return `https://wa.me/${telefoneLimpo}?text=${mensagemCodificada}`
  }

  // Fallback: abrir WhatsApp sem número
  return `https://wa.me/?text=${mensagemCodificada}`
}

function formatarData(data) {
  if (!data) return '[data não disponível]'
  const d = new Date(data)
  return d.toLocaleDateString('pt-BR')
}

// Copiar texto para clipboard
export function copiarParaClipboard(texto) {
  navigator.clipboard.writeText(texto).then(() => {
    console.log('Mensagem copiada!')
  })
}

// Gerar resumo de reserva para pastinha
export function gerarResumoReserva({
  comprador_nome,
  cultura,
  quantidade,
  data_colheita,
  unidade_medida
}) {
  return `
RESUMO DA RESERVA
=================
Comprador: ${comprador_nome}
Produto: ${cultura}
Quantidade: ${quantidade} ${unidade_medida}
Data de Colheita: ${formatarData(data_colheita)}
Data da Reserva: ${new Date().toLocaleDateString('pt-BR')}
  `.trim()
}
