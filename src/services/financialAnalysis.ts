/**
 * Serviço de Análise Financeira Inteligente
 * Algoritmos para previsão de riscos e sugestões de economia
 */

import { Transaction } from '../components/dashboard/RecentTransactions';

// Tipos de análise
export interface FinancialHealthScore {
  score: number; // 0-100
  level: 'critical' | 'warning' | 'good' | 'excellent';
  message: string;
  color: string;
}

export interface NegativeRisk {
  probability: number; // 0-100
  daysUntilRisk: number | null;
  projectedBalance: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

export interface SpendingPattern {
  bestDaysToSpend: number[]; // 1-31
  worstDaysToSpend: number[]; // 1-31
  averageByWeekday: Record<string, number>;
  peakSpendingPeriod: string;
}

export interface SavingsRecommendation {
  monthlySavingsGoal: number;
  currentSavingsRate: number;
  recommendedSavingsRate: number;
  potentialSavings: number;
  tips: string[];
}

export interface CategoryInsight {
  categoryId: string;
  categoryName: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  isOverBudget: boolean;
  suggestion: string;
}

// Análise de Saúde Financeira
export function calculateFinancialHealth(
  transactions: Transaction[],
  monthlyIncome: number,
  monthlyBudget: number
): FinancialHealthScore {
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const actualIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || monthlyIncome;

  const savingsRate = actualIncome > 0 ? ((actualIncome - monthlyExpenses) / actualIncome) * 100 : 0;
  const budgetUsage = monthlyBudget > 0 ? (monthlyExpenses / monthlyBudget) * 100 : 0;

  // Calcular score baseado em múltiplos fatores
  let score = 100;

  // Penalidade por gastar mais que ganha
  if (monthlyExpenses > actualIncome) {
    score -= 40;
  }

  // Penalidade por baixa taxa de poupança
  if (savingsRate < 10) score -= 20;
  else if (savingsRate < 20) score -= 10;

  // Penalidade por ultrapassar orçamento
  if (budgetUsage > 100) score -= 20;
  else if (budgetUsage > 90) score -= 10;

  // Bônus por boa taxa de poupança
  if (savingsRate >= 30) score += 10;

  score = Math.max(0, Math.min(100, score));

  let level: FinancialHealthScore['level'];
  let message: string;
  let color: string;

  if (score >= 80) {
    level = 'excellent';
    message = 'Suas finanças estão excelentes! Continue assim.';
    color = '#10B981';
  } else if (score >= 60) {
    level = 'good';
    message = 'Finanças saudáveis, mas há espaço para melhorar.';
    color = '#3B82F6';
  } else if (score >= 40) {
    level = 'warning';
    message = 'Atenção! Seus gastos precisam de controle.';
    color = '#F59E0B';
  } else {
    level = 'critical';
    message = 'Situação crítica! Revise seus gastos urgentemente.';
    color = '#EF4444';
  }

  return { score, level, message, color };
}

// Análise de Risco de Ficar Negativo
export function analyzeNegativeRisk(
  transactions: Transaction[],
  currentBalance: number,
  monthlyIncome: number,
  fixedExpenses: number = 0
): NegativeRisk {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = daysInMonth - currentDay;

  // Calcular gasto médio diário
  const thisMonthExpenses = transactions.filter(t => {
    const tDate = new Date(t.date);
    return t.type === 'expense' &&
           tDate.getMonth() === now.getMonth() &&
           tDate.getFullYear() === now.getFullYear();
  });

  const totalSpent = thisMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  const avgDailySpend = currentDay > 0 ? totalSpent / currentDay : 0;

  // Projetar gastos até o fim do mês
  const projectedExpenses = avgDailySpend * daysRemaining + fixedExpenses;
  const projectedBalance = currentBalance - projectedExpenses;

  // Calcular quando vai ficar negativo (se aplicável)
  let daysUntilRisk: number | null = null;
  if (avgDailySpend > 0 && currentBalance > 0) {
    daysUntilRisk = Math.floor(currentBalance / avgDailySpend);
    if (daysUntilRisk > daysRemaining) {
      daysUntilRisk = null; // Não vai ficar negativo este mês
    }
  }

  // Calcular probabilidade de ficar negativo
  let probability = 0;
  if (projectedBalance < 0) {
    probability = Math.min(100, Math.abs(projectedBalance / currentBalance) * 100);
  } else if (projectedBalance < currentBalance * 0.1) {
    probability = 50;
  } else if (projectedBalance < currentBalance * 0.3) {
    probability = 25;
  }

  let level: NegativeRisk['level'];
  let message: string;

  if (probability >= 75) {
    level = 'critical';
    message = daysUntilRisk
      ? `Alto risco! Você pode ficar negativo em ${daysUntilRisk} dias.`
      : 'Alto risco de ficar negativo antes do fim do mês!';
  } else if (probability >= 50) {
    level = 'high';
    message = 'Cuidado! Continue monitorando seus gastos de perto.';
  } else if (probability >= 25) {
    level = 'medium';
    message = 'Situação controlada, mas fique atento aos gastos.';
  } else {
    level = 'low';
    message = 'Baixo risco. Seu saldo está seguro para o mês.';
  }

  return {
    probability,
    daysUntilRisk,
    projectedBalance,
    level,
    message,
  };
}

// Análise de Padrão de Gastos por Dia
export function analyzeSpendingPatterns(transactions: Transaction[]): SpendingPattern {
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const spendingByDayOfMonth: Record<number, number[]> = {};
  const spendingByWeekday: Record<string, number[]> = {};

  // Inicializar
  for (let i = 1; i <= 31; i++) {
    spendingByDayOfMonth[i] = [];
  }
  dayNames.forEach(day => {
    spendingByWeekday[day] = [];
  });

  // Agrupar gastos por dia do mês e dia da semana
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const date = new Date(t.date);
      const dayOfMonth = date.getDate();
      const weekday = dayNames[date.getDay()];

      spendingByDayOfMonth[dayOfMonth].push(t.amount);
      spendingByWeekday[weekday].push(t.amount);
    });

  // Calcular média por dia do mês
  const avgByDayOfMonth: Record<number, number> = {};
  for (let i = 1; i <= 31; i++) {
    const values = spendingByDayOfMonth[i];
    avgByDayOfMonth[i] = values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
  }

  // Calcular média por dia da semana
  const averageByWeekday: Record<string, number> = {};
  dayNames.forEach(day => {
    const values = spendingByWeekday[day];
    averageByWeekday[day] = values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
  });

  // Encontrar melhores e piores dias (baseado em gastos médios)
  const sortedDays = Object.entries(avgByDayOfMonth)
    .filter(([, avg]) => avg > 0)
    .sort(([, a], [, b]) => a - b);

  const bestDaysToSpend = sortedDays.slice(0, 5).map(([day]) => parseInt(day));
  const worstDaysToSpend = sortedDays.slice(-5).map(([day]) => parseInt(day)).reverse();

  // Identificar período de pico
  const sortedWeekdays = Object.entries(averageByWeekday)
    .sort(([, a], [, b]) => b - a);
  const peakDay = sortedWeekdays[0]?.[0] || 'Não identificado';
  const peakSpendingPeriod = `Maior gasto: ${peakDay}`;

  return {
    bestDaysToSpend,
    worstDaysToSpend,
    averageByWeekday,
    peakSpendingPeriod,
  };
}

// Recomendações de Economia
export function getSavingsRecommendations(
  transactions: Transaction[],
  monthlyIncome: number,
  monthlyExpenses: number
): SavingsRecommendation {
  const currentSavings = monthlyIncome - monthlyExpenses;
  const currentSavingsRate = monthlyIncome > 0 ? (currentSavings / monthlyIncome) * 100 : 0;

  // Meta ideal de poupança: 20-30%
  const idealSavingsRate = 20;
  const recommendedSavingsRate = Math.max(idealSavingsRate, currentSavingsRate);
  const monthlySavingsGoal = (monthlyIncome * recommendedSavingsRate) / 100;

  // Calcular economia potencial por categoria
  const expensesByCategory: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expensesByCategory[t.categoryId] = (expensesByCategory[t.categoryId] || 0) + t.amount;
    });

  // Identificar categorias com maior potencial de economia
  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a);

  const potentialSavings = sortedCategories
    .slice(0, 3)
    .reduce((sum, [, amount]) => sum + amount * 0.1, 0); // 10% de economia potencial

  // Gerar dicas personalizadas
  const tips: string[] = [];

  if (currentSavingsRate < 10) {
    tips.push('Tente guardar pelo menos 10% da sua renda mensal.');
  }

  if (sortedCategories.find(([cat]) => cat === 'delivery' || cat === 'restaurant')) {
    tips.push('Considere reduzir gastos com alimentação fora de casa.');
  }

  if (sortedCategories.find(([cat]) => cat === 'streaming' || cat === 'entertainment')) {
    tips.push('Revise suas assinaturas de streaming e lazer.');
  }

  if (sortedCategories.find(([cat]) => cat === 'uber' || cat === 'transport')) {
    tips.push('Avalie alternativas de transporte mais econômicas.');
  }

  if (currentSavingsRate < 20) {
    tips.push('Crie uma reserva de emergência de 3-6 meses de despesas.');
  }

  if (tips.length === 0) {
    tips.push('Suas finanças estão bem controladas!');
    tips.push('Continue mantendo o controle dos gastos.');
  }

  return {
    monthlySavingsGoal,
    currentSavingsRate,
    recommendedSavingsRate,
    potentialSavings,
    tips,
  };
}

// Insights por Categoria
export function getCategoryInsights(
  currentTransactions: Transaction[],
  previousTransactions: Transaction[]
): CategoryInsight[] {
  const currentByCategory: Record<string, number> = {};
  const previousByCategory: Record<string, number> = {};

  currentTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      currentByCategory[t.categoryId] = (currentByCategory[t.categoryId] || 0) + t.amount;
    });

  previousTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      previousByCategory[t.categoryId] = (previousByCategory[t.categoryId] || 0) + t.amount;
    });

  const insights: CategoryInsight[] = [];

  Object.entries(currentByCategory).forEach(([categoryId, currentAmount]) => {
    const previousAmount = previousByCategory[categoryId] || 0;
    const change = previousAmount > 0
      ? ((currentAmount - previousAmount) / previousAmount) * 100
      : 100;

    let trend: 'up' | 'down' | 'stable';
    let suggestion: string;

    if (change > 10) {
      trend = 'up';
      suggestion = 'Gastos aumentando. Considere revisar esta categoria.';
    } else if (change < -10) {
      trend = 'down';
      suggestion = 'Ótimo progresso! Continue economizando nesta categoria.';
    } else {
      trend = 'stable';
      suggestion = 'Gastos estáveis nesta categoria.';
    }

    insights.push({
      categoryId,
      categoryName: categoryId, // Será substituído pelo nome real
      trend,
      changePercent: change,
      isOverBudget: false, // Implementar com orçamentos
      suggestion,
    });
  });

  return insights.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
}

// Função auxiliar para formatar moeda
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Função auxiliar para obter cor do nível de risco
export function getRiskColor(level: 'low' | 'medium' | 'high' | 'critical'): string {
  const colors = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#F97316',
    critical: '#EF4444',
  };
  return colors[level];
}
