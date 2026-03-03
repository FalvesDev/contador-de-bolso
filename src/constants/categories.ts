/**
 * Categorias do Contador de Bolso
 * Com nomes de ícones para uso com SVG
 */

import { colors } from './colors';

export type CategoryType = 'expense' | 'income';

// Tipos de ícones disponíveis
export type IconName =
  | 'utensils' | 'shopping-cart' | 'car' | 'house' | 'heart'
  | 'gamepad' | 'shopping-bag' | 'graduation-cap' | 'briefcase'
  | 'fuel' | 'credit-card' | 'dollar' | 'trending-up' | 'gift'
  | 'receipt' | 'target' | 'zap' | 'wallet';

export interface Category {
  id: string;
  name: string;
  icon: IconName;
  color: string;
  type: CategoryType;
  parentId?: string;
  order: number;
}

// ═══════════════════════════════════════════════════════
// CATEGORIAS DE DESPESAS
// ═══════════════════════════════════════════════════════

export const expenseCategories: Category[] = [
  // Alimentação
  { id: 'food', name: 'Alimentação', icon: 'utensils', color: colors.category.food, type: 'expense', order: 1 },
  { id: 'restaurant', name: 'Restaurante', icon: 'utensils', color: colors.category.restaurant, type: 'expense', parentId: 'food', order: 2 },
  { id: 'grocery', name: 'Mercado', icon: 'shopping-cart', color: colors.category.grocery, type: 'expense', parentId: 'food', order: 3 },
  { id: 'delivery', name: 'Delivery', icon: 'shopping-bag', color: colors.category.delivery, type: 'expense', parentId: 'food', order: 4 },
  { id: 'snacks', name: 'Lanches', icon: 'utensils', color: colors.category.food, type: 'expense', parentId: 'food', order: 5 },

  // Transporte
  { id: 'transport', name: 'Transporte', icon: 'car', color: colors.category.transport, type: 'expense', order: 10 },
  { id: 'fuel', name: 'Combustível', icon: 'fuel', color: colors.category.fuel, type: 'expense', parentId: 'transport', order: 11 },
  { id: 'uber', name: 'Uber/99', icon: 'car', color: colors.category.uber, type: 'expense', parentId: 'transport', order: 12 },
  { id: 'public-transport', name: 'Transporte Público', icon: 'car', color: colors.category.transport, type: 'expense', parentId: 'transport', order: 13 },
  { id: 'parking', name: 'Estacionamento', icon: 'car', color: colors.category.parking, type: 'expense', parentId: 'transport', order: 14 },

  // Moradia
  { id: 'home', name: 'Moradia', icon: 'house', color: colors.category.home, type: 'expense', order: 20 },
  { id: 'rent', name: 'Aluguel', icon: 'house', color: colors.category.rent, type: 'expense', parentId: 'home', order: 21 },
  { id: 'condominium', name: 'Condomínio', icon: 'house', color: colors.category.home, type: 'expense', parentId: 'home', order: 22 },
  { id: 'electricity', name: 'Luz', icon: 'zap', color: colors.category.utilities, type: 'expense', parentId: 'home', order: 23 },
  { id: 'water', name: 'Água', icon: 'house', color: colors.category.utilities, type: 'expense', parentId: 'home', order: 24 },
  { id: 'gas', name: 'Gás', icon: 'house', color: colors.category.utilities, type: 'expense', parentId: 'home', order: 25 },
  { id: 'internet', name: 'Internet', icon: 'house', color: colors.category.internet, type: 'expense', parentId: 'home', order: 26 },

  // Saúde
  { id: 'health', name: 'Saúde', icon: 'heart', color: colors.category.health, type: 'expense', order: 30 },
  { id: 'pharmacy', name: 'Farmácia', icon: 'heart', color: colors.category.pharmacy, type: 'expense', parentId: 'health', order: 31 },
  { id: 'doctor', name: 'Consultas', icon: 'heart', color: colors.category.doctor, type: 'expense', parentId: 'health', order: 32 },
  { id: 'health-insurance', name: 'Plano de Saúde', icon: 'heart', color: colors.category.health, type: 'expense', parentId: 'health', order: 33 },
  { id: 'gym', name: 'Academia', icon: 'heart', color: colors.category.gym, type: 'expense', parentId: 'health', order: 34 },

  // Lazer
  { id: 'entertainment', name: 'Lazer', icon: 'gamepad', color: colors.category.entertainment, type: 'expense', order: 40 },
  { id: 'cinema', name: 'Cinema', icon: 'gamepad', color: colors.category.entertainment, type: 'expense', parentId: 'entertainment', order: 41 },
  { id: 'streaming', name: 'Streaming', icon: 'gamepad', color: colors.category.streaming, type: 'expense', parentId: 'entertainment', order: 42 },
  { id: 'games', name: 'Jogos', icon: 'gamepad', color: colors.category.games, type: 'expense', parentId: 'entertainment', order: 43 },
  { id: 'travel', name: 'Viagens', icon: 'gamepad', color: colors.category.travel, type: 'expense', parentId: 'entertainment', order: 44 },
  { id: 'hobbies', name: 'Hobbies', icon: 'gamepad', color: colors.category.entertainment, type: 'expense', parentId: 'entertainment', order: 45 },

  // Compras
  { id: 'shopping', name: 'Compras', icon: 'shopping-bag', color: colors.category.shopping, type: 'expense', order: 50 },
  { id: 'clothes', name: 'Roupas', icon: 'shopping-bag', color: colors.category.clothes, type: 'expense', parentId: 'shopping', order: 51 },
  { id: 'electronics', name: 'Eletrônicos', icon: 'shopping-bag', color: colors.category.electronics, type: 'expense', parentId: 'shopping', order: 52 },
  { id: 'home-stuff', name: 'Casa', icon: 'shopping-bag', color: colors.category.shopping, type: 'expense', parentId: 'shopping', order: 53 },
  { id: 'gifts', name: 'Presentes', icon: 'gift', color: colors.category.gifts, type: 'expense', parentId: 'shopping', order: 54 },

  // Educação
  { id: 'education', name: 'Educação', icon: 'graduation-cap', color: colors.category.education, type: 'expense', order: 60 },
  { id: 'courses', name: 'Cursos', icon: 'graduation-cap', color: colors.category.courses, type: 'expense', parentId: 'education', order: 61 },
  { id: 'books', name: 'Livros', icon: 'graduation-cap', color: colors.category.books, type: 'expense', parentId: 'education', order: 62 },
  { id: 'school-supplies', name: 'Material', icon: 'graduation-cap', color: colors.category.education, type: 'expense', parentId: 'education', order: 63 },

  // Finanças
  { id: 'finance-expense', name: 'Finanças', icon: 'credit-card', color: colors.category.finance, type: 'expense', order: 70 },
  { id: 'investment-expense', name: 'Investimentos', icon: 'trending-up', color: colors.category.investment, type: 'expense', parentId: 'finance-expense', order: 71 },
  { id: 'loans', name: 'Empréstimos', icon: 'credit-card', color: colors.category.finance, type: 'expense', parentId: 'finance-expense', order: 72 },
  { id: 'insurance', name: 'Seguros', icon: 'target', color: colors.category.insurance, type: 'expense', parentId: 'finance-expense', order: 73 },

  // Outros
  { id: 'pets', name: 'Pets', icon: 'heart', color: colors.category.other, type: 'expense', order: 80 },
  { id: 'donations', name: 'Doações', icon: 'heart', color: colors.category.other, type: 'expense', order: 81 },
  { id: 'taxes', name: 'Impostos', icon: 'receipt', color: colors.category.other, type: 'expense', order: 82 },
  { id: 'other-expense', name: 'Outros', icon: 'receipt', color: colors.category.other, type: 'expense', order: 99 },
];

// ═══════════════════════════════════════════════════════
// CATEGORIAS DE RECEITAS
// ═══════════════════════════════════════════════════════

export const incomeCategories: Category[] = [
  { id: 'salary', name: 'Salário', icon: 'wallet', color: colors.category.salary, type: 'income', order: 100 },
  { id: 'freelance', name: 'Freelance', icon: 'briefcase', color: colors.category.freelance, type: 'income', order: 101 },
  { id: 'investment-income', name: 'Investimentos', icon: 'trending-up', color: colors.category.investment, type: 'income', order: 102 },
  { id: 'sales', name: 'Vendas', icon: 'shopping-bag', color: colors.category.income, type: 'income', order: 103 },
  { id: 'gifts-income', name: 'Presentes', icon: 'gift', color: colors.category.bonus, type: 'income', order: 104 },
  { id: 'refund', name: 'Reembolso', icon: 'dollar', color: colors.category.income, type: 'income', order: 105 },
  { id: 'bonus', name: 'Bônus', icon: 'zap', color: colors.category.bonus, type: 'income', order: 106 },
  { id: 'other-income', name: 'Outros', icon: 'dollar', color: colors.category.income, type: 'income', order: 199 },
];

// ═══════════════════════════════════════════════════════
// TODAS AS CATEGORIAS
// ═══════════════════════════════════════════════════════

export const allCategories: Category[] = [...expenseCategories, ...incomeCategories];

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

export const getMainCategories = (type?: CategoryType): Category[] => {
  const categories = type
    ? allCategories.filter(c => c.type === type)
    : allCategories;
  return categories.filter(c => !c.parentId);
};

export const getSubcategories = (parentId: string): Category[] => {
  return allCategories.filter(c => c.parentId === parentId);
};

export const getCategoryById = (id: string): Category | undefined => {
  return allCategories.find(c => c.id === id);
};

export const getCategoryColor = (id: string): string => {
  const category = getCategoryById(id);
  return category?.color || colors.category.other;
};

export const getCategoryIcon = (id: string): IconName => {
  const category = getCategoryById(id);
  return category?.icon || 'receipt';
};
