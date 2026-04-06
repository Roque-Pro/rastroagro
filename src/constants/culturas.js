// Lista de principais culturas do agronegócio brasileiro com seus ciclos
export const CULTURAS = [
  // GRÃOS / CEREAIS
  { categoria: 'Grãos / Cereais', nome: 'Arroz (irrigado)', ciclo: '100–150 dias' },
  { categoria: 'Grãos / Cereais', nome: 'Arroz (sequeiro)', ciclo: '90–120 dias' },
  { categoria: 'Grãos / Cereais', nome: 'Milho (safra)', ciclo: '120–160 dias' },
  { categoria: 'Grãos / Cereais', nome: 'Milho (safrinha)', ciclo: '90–120 dias' },
  { categoria: 'Grãos / Cereais', nome: 'Trigo', ciclo: '110–150 dias' },
  { categoria: 'Grãos / Cereais', nome: 'Cevada', ciclo: '90–120 dias' },
  { categoria: 'Grãos / Cereais', nome: 'Aveia', ciclo: '100–130 dias' },
  { categoria: 'Grãos / Cereais', nome: 'Centeio', ciclo: '120–150 dias' },
  { categoria: 'Grãos / Cereais', nome: 'Sorgo granífero', ciclo: '100–130 dias' },
  { categoria: 'Grãos / Cereais', nome: 'Sorgo forrageiro', ciclo: '80–120 dias' },
  { categoria: 'Grãos / Cereais', nome: 'Triticale', ciclo: '110–140 dias' },
  
  // LEGUMINOSAS
  { categoria: 'Leguminosas', nome: 'Feijão comum (carioca/preto)', ciclo: '70–100 dias' },
  { categoria: 'Leguminosas', nome: 'Feijão caupi', ciclo: '60–90 dias' },
  { categoria: 'Leguminosas', nome: 'Feijão fava', ciclo: '120–180 dias' },
  { categoria: 'Leguminosas', nome: 'Soja', ciclo: '100–160 dias' },
  { categoria: 'Leguminosas', nome: 'Lentilha', ciclo: '100–140 dias' },
  { categoria: 'Leguminosas', nome: 'Grão-de-bico', ciclo: '90–120 dias' },
  { categoria: 'Leguminosas', nome: 'Ervilha', ciclo: '60–90 dias' },
  
  // RAÍZES E TUBÉRCULOS
  { categoria: 'Raízes e Tubérculos', nome: 'Batata inglesa', ciclo: '90–120 dias' },
  { categoria: 'Raízes e Tubérculos', nome: 'Batata doce', ciclo: '120–180 dias' },
  { categoria: 'Raízes e Tubérculos', nome: 'Batata baroa (mandioquinha)', ciclo: '240–300 dias' },
  { categoria: 'Raízes e Tubérculos', nome: 'Mandioca (aipim/macaxeira)', ciclo: '8–18 meses' },
  { categoria: 'Raízes e Tubérculos', nome: 'Inhame', ciclo: '180–240 dias' },
  { categoria: 'Raízes e Tubérculos', nome: 'Cará', ciclo: '180–300 dias' },
  { categoria: 'Raízes e Tubérculos', nome: 'Beterraba', ciclo: '60–90 dias' },
  { categoria: 'Raízes e Tubérculos', nome: 'Cenoura', ciclo: '80–120 dias' },
  { categoria: 'Raízes e Tubérculos', nome: 'Rabanete', ciclo: '25–40 dias' },
  
  // HORTALIÇAS FOLHOSAS
  { categoria: 'Hortaliças Folhosas', nome: 'Alface (americana/crespa/roxa)', ciclo: '30–60 dias' },
  { categoria: 'Hortaliças Folhosas', nome: 'Rúcula', ciclo: '30–50 dias' },
  { categoria: 'Hortaliças Folhosas', nome: 'Espinafre', ciclo: '40–60 dias' },
  { categoria: 'Hortaliças Folhosas', nome: 'Couve (folha)', ciclo: '60–90 dias' },
  { categoria: 'Hortaliças Folhosas', nome: 'Acelga', ciclo: '50–80 dias' },
  { categoria: 'Hortaliças Folhosas', nome: 'Chicória', ciclo: '50–70 dias' },
  { categoria: 'Hortaliças Folhosas', nome: 'Agrião', ciclo: '30–60 dias' },
  
  // HORTALIÇAS FRUTO / LEGUMES
  { categoria: 'Hortaliças Fruto', nome: 'Tomate (mesa)', ciclo: '90–120 dias' },
  { categoria: 'Hortaliças Fruto', nome: 'Tomate (industrial)', ciclo: '100–130 dias' },
  { categoria: 'Hortaliças Fruto', nome: 'Pimentão', ciclo: '100–140 dias' },
  { categoria: 'Hortaliças Fruto', nome: 'Pimenta (diversas)', ciclo: '90–150 dias' },
  { categoria: 'Hortaliças Fruto', nome: 'Berinjela', ciclo: '100–140 dias' },
  { categoria: 'Hortaliças Fruto', nome: 'Pepino', ciclo: '50–80 dias' },
  { categoria: 'Hortaliças Fruto', nome: 'Abobrinha', ciclo: '40–70 dias' },
  { categoria: 'Hortaliças Fruto', nome: 'Abóbora', ciclo: '90–150 dias' },
  { categoria: 'Hortaliças Fruto', nome: 'Chuchu', ciclo: '120–180 dias' },
  
  // BULBOS E TEMPEROS
  { categoria: 'Bulbos e Temperos', nome: 'Cebola', ciclo: '120–180 dias' },
  { categoria: 'Bulbos e Temperos', nome: 'Alho', ciclo: '120–180 dias' },
  { categoria: 'Bulbos e Temperos', nome: 'Alho-poró', ciclo: '120–150 dias' },
  { categoria: 'Bulbos e Temperos', nome: 'Cebolinha', ciclo: '60–80 dias' },
  { categoria: 'Bulbos e Temperos', nome: 'Coentro', ciclo: '30–50 dias' },
  { categoria: 'Bulbos e Temperos', nome: 'Salsinha', ciclo: '60–90 dias' },
  { categoria: 'Bulbos e Temperos', nome: 'Manjericão', ciclo: '60–90 dias' },
  
  // FRUTAS
  { categoria: 'Frutas', nome: 'Banana', ciclo: '9–12 meses' },
  { categoria: 'Frutas', nome: 'Laranja', ciclo: '2–4 anos' },
  { categoria: 'Frutas', nome: 'Limão', ciclo: '2–3 anos' },
  { categoria: 'Frutas', nome: 'Tangerina', ciclo: '2–4 anos' },
  { categoria: 'Frutas', nome: 'Manga', ciclo: '3–5 anos' },
  { categoria: 'Frutas', nome: 'Mamão', ciclo: '6–12 meses' },
  { categoria: 'Frutas', nome: 'Abacaxi', ciclo: '12–18 meses' },
  { categoria: 'Frutas', nome: 'Melancia', ciclo: '80–110 dias' },
  { categoria: 'Frutas', nome: 'Melão', ciclo: '60–90 dias' },
  { categoria: 'Frutas', nome: 'Maracujá', ciclo: '6–9 meses' },
  { categoria: 'Frutas', nome: 'Uva', ciclo: '1–3 anos' },
  { categoria: 'Frutas', nome: 'Maçã', ciclo: '3–5 anos' },
  { categoria: 'Frutas', nome: 'Pera', ciclo: '3–5 anos' },
  { categoria: 'Frutas', nome: 'Goiaba', ciclo: '2–3 anos' },
  { categoria: 'Frutas', nome: 'Acerola', ciclo: '2–3 anos' },
  { categoria: 'Frutas', nome: 'Caju', ciclo: '3–5 anos' },
  { categoria: 'Frutas', nome: 'Coco', ciclo: '4–7 anos' },
  
  // CULTURAS INDUSTRIAIS / COMERCIAIS
  { categoria: 'Culturas Industriais', nome: 'Cana-de-açúcar', ciclo: '12–18 meses' },
  { categoria: 'Culturas Industriais', nome: 'Algodão', ciclo: '130–220 dias' },
  { categoria: 'Culturas Industriais', nome: 'Café (arábica)', ciclo: '2–4 anos' },
  { categoria: 'Culturas Industriais', nome: 'Café (robusta/conilon)', ciclo: '2–3 anos' },
  { categoria: 'Culturas Industriais', nome: 'Cacau', ciclo: '3–5 anos' },
  { categoria: 'Culturas Industriais', nome: 'Fumo (tabaco)', ciclo: '120–180 dias' },
  { categoria: 'Culturas Industriais', nome: 'Girassol', ciclo: '90–130 dias' },
  { categoria: 'Culturas Industriais', nome: 'Mamona', ciclo: '120–180 dias' },
  { categoria: 'Culturas Industriais', nome: 'Amendoim', ciclo: '90–120 dias' },
  { categoria: 'Culturas Industriais', nome: 'Gergelim', ciclo: '90–120 dias' },
  { categoria: 'Culturas Industriais', nome: 'Linho', ciclo: '100–150 dias' },
  
  // FORRAGENS / PASTAGENS
  { categoria: 'Forragens', nome: 'Capim braquiária', ciclo: '60–120 dias' },
  { categoria: 'Forragens', nome: 'Capim mombaça', ciclo: '60–120 dias' },
  { categoria: 'Forragens', nome: 'Capim elefante', ciclo: '90–150 dias' },
  { categoria: 'Forragens', nome: 'Alfafa', ciclo: '60–90 dias' },
  
  // FLORESTAIS / MADEIRA
  { categoria: 'Florestais', nome: 'Eucalipto', ciclo: '5–7 anos' },
  { categoria: 'Florestais', nome: 'Pinus', ciclo: '10–20 anos' },
  { categoria: 'Florestais', nome: 'Mogno', ciclo: '15–25 anos' },
  { categoria: 'Florestais', nome: 'Teca', ciclo: '15–25 anos' },
]

export const getCicloEstimado = (cultura) => {
  const found = CULTURAS.find(c => c.nome.toLowerCase() === cultura.toLowerCase())
  return found?.ciclo || null
}

export const filtrarCulturas = (termo) => {
  if (!termo) return CULTURAS
  return CULTURAS.filter(c => 
    c.nome.toLowerCase().includes(termo.toLowerCase())
  )
}
