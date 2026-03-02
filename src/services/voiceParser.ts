/**
 * Parser de comandos de voz para transações
 * Converte texto em dados estruturados de transação
 */

import { getMainCategories, Category } from '../constants/categories';

interface ParsedTransaction {
  amount: number | null;
  type: 'expense' | 'income';
  categoryId: string | null;
  description: string;
  confidence: number;
}

// Palavras-chave para detectar receitas
const INCOME_KEYWORDS = [
  'recebi', 'recebeu', 'entrou', 'ganhei', 'ganhou',
  'salário', 'salario', 'freelance', 'pagamento',
  'depósito', 'deposito', 'transferência', 'pix',
  'rendimento', 'dividendo', 'comissão', 'comissao',
];

// Mapeamento de palavras para categorias
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  // Alimentação
  'grocery': ['mercado', 'supermercado', 'feira', 'hortifruti', 'açougue', 'padaria'],
  'restaurant': ['restaurante', 'almoço', 'almoco', 'jantar', 'lanche', 'café', 'cafe'],
  'delivery': ['ifood', 'rappi', 'uber eats', 'delivery', 'entrega', 'pedido'],
  'fastfood': ['mcdonalds', 'burger king', 'subway', 'kfc', 'pizza'],

  // Transporte
  'fuel': ['gasolina', 'combustível', 'combustivel', 'posto', 'etanol', 'diesel', 'abasteci'],
  'uber': ['uber', '99', 'corrida', 'taxi', 'táxi'],
  'parking': ['estacionamento', 'zona azul', 'valet'],
  'transport': ['ônibus', 'onibus', 'metrô', 'metro', 'trem', 'passagem'],

  // Moradia
  'rent': ['aluguel', 'condomínio', 'condominio'],
  'utilities': ['luz', 'energia', 'água', 'agua', 'gás', 'gas', 'conta'],
  'internet': ['internet', 'wifi', 'banda larga'],

  // Saúde
  'pharmacy': ['farmácia', 'farmacia', 'remédio', 'remedio', 'medicamento'],
  'doctor': ['médico', 'medico', 'consulta', 'exame', 'hospital'],
  'gym': ['academia', 'crossfit', 'pilates', 'yoga'],

  // Entretenimento
  'streaming': ['netflix', 'spotify', 'amazon prime', 'disney', 'hbo', 'youtube', 'streaming'],
  'games': ['jogo', 'game', 'playstation', 'xbox', 'steam'],
  'movies': ['cinema', 'filme', 'ingresso'],

  // Compras
  'clothes': ['roupa', 'calçado', 'calcado', 'tênis', 'tenis', 'camisa', 'calça', 'vestido'],
  'electronics': ['celular', 'computador', 'notebook', 'eletrônico', 'eletronico', 'fone'],

  // Educação
  'education': ['curso', 'escola', 'faculdade', 'mensalidade', 'matrícula'],
  'books': ['livro', 'ebook', 'apostila'],

  // Finanças
  'investment': ['investimento', 'ação', 'acao', 'fundo', 'cdb', 'tesouro'],
  'insurance': ['seguro', 'plano de saúde', 'plano de saude'],

  // Receitas
  'salary': ['salário', 'salario', 'pagamento', 'folha'],
  'freelance': ['freelance', 'freela', 'projeto', 'trabalho extra'],
  'bonus': ['bônus', 'bonus', '13º', 'décimo terceiro', 'PLR'],
};

/**
 * Extrai valor monetário do texto
 */
function extractAmount(text: string): number | null {
  // Padrões comuns de valores
  const patterns = [
    /R\$\s*([\d.,]+)/i,                    // R$ 50,00
    /([\d.,]+)\s*reais/i,                  // 50 reais
    /([\d.,]+)\s*real/i,                   // 1 real
    /(?:gastei|paguei|recebi|ganhei)\s*([\d.,]+)/i, // gastei 50
    /([\d]+)[,.]?([\d]{2})?\s*(?:no|na|em|de|para)/i, // 50 no mercado
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let value = match[1].replace(/\./g, '').replace(',', '.');
      if (match[2]) {
        value = match[1] + '.' + match[2];
      }
      const parsed = parseFloat(value);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  // Tenta extrair qualquer número no texto
  const numbers = text.match(/\d+[,.]?\d*/g);
  if (numbers) {
    for (const num of numbers) {
      const parsed = parseFloat(num.replace(',', '.'));
      if (!isNaN(parsed) && parsed > 0 && parsed < 100000) {
        return parsed;
      }
    }
  }

  return null;
}

/**
 * Detecta se é receita ou despesa
 */
function detectType(text: string): 'expense' | 'income' {
  const lowerText = text.toLowerCase();

  for (const keyword of INCOME_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return 'income';
    }
  }

  return 'expense';
}

/**
 * Detecta a categoria baseada no texto
 */
function detectCategory(text: string, type: 'expense' | 'income'): string | null {
  const lowerText = text.toLowerCase();

  // Verificar cada categoria
  for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        // Verificar se a categoria é compatível com o tipo
        const categories = getMainCategories(type);
        const found = categories.find(c => c.id === categoryId);
        if (found) {
          return categoryId;
        }
      }
    }
  }

  return null;
}

/**
 * Gera uma descrição limpa
 */
function generateDescription(text: string, category: Category | null): string {
  // Remove valores monetários e palavras comuns
  let description = text
    .replace(/R\$\s*[\d.,]+/gi, '')
    .replace(/[\d.,]+\s*reais?/gi, '')
    .replace(/(?:gastei|paguei|recebi|ganhei|no|na|em|de|para|com)\s+/gi, ' ')
    .trim();

  // Capitaliza primeira letra
  if (description.length > 0) {
    description = description.charAt(0).toUpperCase() + description.slice(1);
  }

  // Se muito curto, usa nome da categoria
  if (description.length < 3 && category) {
    return category.name;
  }

  return description || 'Transação';
}

/**
 * Parser principal - converte texto em transação
 */
export function parseVoiceCommand(text: string): ParsedTransaction {
  const type = detectType(text);
  const amount = extractAmount(text);
  const categoryId = detectCategory(text, type);

  const categories = getMainCategories(type);
  const category = categoryId
    ? categories.find(c => c.id === categoryId) || null
    : null;

  const description = generateDescription(text, category);

  // Calcular confiança
  let confidence = 0;
  if (amount !== null) confidence += 0.4;
  if (categoryId !== null) confidence += 0.3;
  if (description.length > 3) confidence += 0.3;

  return {
    amount,
    type,
    categoryId,
    description,
    confidence,
  };
}

/**
 * Exemplos de comandos de voz
 */
export const VOICE_EXAMPLES = [
  'Gastei 50 reais no mercado',
  'Almoço 35 reais',
  'Uber 25 reais',
  'Recebi salário 5000',
  'Netflix 55,90',
  'Gasolina 200 reais',
  'Academia 99,90',
  'Ifood 45 reais',
];
