import jsPDF from 'jspdf'
import QRCode from 'qrcode'

export const downloadQRCodePDF = async (lote, qrValue) => {
  try {
    // Gerar QR code como imagem
    const qrDataUrl = await QRCode.toDataURL(qrValue, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // Criar PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Cores
    const corPrimaria = [45, 80, 22] // #2d5016
    const corSecundaria = [107, 168, 46] // #6ba82e

    // Cabeçalho
    pdf.setFillColor(...corPrimaria)
    pdf.rect(0, 0, 210, 40, 'F')

    // Logo/Título
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(28)
    pdf.text('🌾 RastroAgro', 105, 15, { align: 'center' })
    pdf.setFontSize(12)
    pdf.text('Rastreabilidade Agrícola Transparente', 105, 25, { align: 'center' })

    // Seção QR Code
    pdf.setDrawColor(...corSecundaria)
    pdf.setLineWidth(2)
    pdf.rect(15, 50, 180, 100)

    pdf.setTextColor(45, 80, 22)
    pdf.setFontSize(16)
    pdf.setFont(undefined, 'bold')
    pdf.text('CÓDIGO QR DA SAFRA', 105, 60, { align: 'center' })

    // QR Code no centro
    pdf.addImage(qrDataUrl, 'PNG', 55, 70, 100, 100)

    // Seção de Informações
    pdf.setDrawColor(...corSecundaria)
    pdf.setLineWidth(1)
    pdf.rect(15, 155, 180, 90)

    pdf.setTextColor(45, 80, 22)
    pdf.setFontSize(12)
    pdf.setFont(undefined, 'bold')
    pdf.text('INFORMAÇÕES DA SAFRA', 20, 165)

    // Dados do lote
    pdf.setTextColor(0, 0, 0)
    pdf.setFont(undefined, 'normal')
    pdf.setFontSize(11)

    let yPos = 175
    const lineHeight = 7

    pdf.text(`Cultura: ${lote.cultura}`, 20, yPos)
    yPos += lineHeight

    pdf.text(`Variedade: ${lote.variedade || 'Não especificada'}`, 20, yPos)
    yPos += lineHeight

    pdf.text(`Plantio: ${new Date(lote.data_inicio).toLocaleDateString('pt-BR')}`, 20, yPos)
    yPos += lineHeight

    if (lote.data_colheita_estimada) {
      pdf.text(`Colheita Prevista: ${new Date(lote.data_colheita_estimada).toLocaleDateString('pt-BR')}`, 20, yPos)
      yPos += lineHeight
    }

    if (lote.confianca) {
      pdf.text(`Confiança da Previsão: ${lote.confianca}%`, 20, yPos)
      yPos += lineHeight
    }

    pdf.text(`Código: ${lote.qr_hash}`, 20, yPos)

    // Rodapé
    pdf.setFontSize(9)
    pdf.setTextColor(100, 100, 100)
    pdf.text('Este código permite rastrear a procedência e o histórico completo da safra.', 105, 280, { align: 'center' })
    pdf.text('Escaneie com qualquer smartphone para acompanhar a rastreabilidade.', 105, 286, { align: 'center' })

    // Salvar PDF
    const filename = `RastroAgro_${lote.cultura}_${new Date(lote.data_inicio).toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`
    pdf.save(filename)

    return true
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    throw error
  }
}
