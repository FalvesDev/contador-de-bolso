/**
 * SmartInsights - Sugestões Inteligentes de Economia
 * Analisa padrões de gasto e oferece dicas personalizadas
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import {
  LightbulbIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Transaction } from '../dashboard/RecentTransactions';
import { getCategoryById } from '../../constants/categories';
import { Budget } from '../../hooks/useBudgets';

interface SmartInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
  onInsightPress?: (insight: Insight) => void;
}

export interface Insight {
  id: string;
  type: 'warning' | 'tip' | 'success' | 'alert';
  title: string;
  description: string;
  action?: string;
  data?: {
    categoryId?: string;
    amount?: number;
    percentage?: number;
  };
}

export function SmartInsights({ transactions, budgets, onInsightPress }: SmartInsightsProps) {
  const { theme } = useTheme();

  const insights = useMemo(() => {
    const result: Insight[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Filtrar transações do mês atual
    const thisMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    // Filtrar transações do mês anterior
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === lastMonth && tDate.getFullYear() === lastMonthYear;
    });

    // Calcular totais
    const thisMonthExpenses = thisMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const thisMonthIncome = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // 1. Comparativo com mês anterior
    if (lastMonthExpenses > 0) {
      const changePercent = ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

      if (changePercent > 20) {
        result.push({
          id: 'expense_increase',
          type: 'warning',
          title: 'Gastos aumentaram',
          description: `Seus gastos estão ${changePercent.toFixed(0)}% maiores que o mês passado.`,
          action: 'Ver detalhes',
          data: { percentage: changePercent },
        });
      } else if (changePercent < -10) {
        result.push({
          id: 'expense_decrease',
          type: 'success',
          title: 'Parabéns pela economia!',
          description: `Você reduziu seus gastos em ${Math.abs(changePercent).toFixed(0)}% comparado ao mês anterior.`,
          data: { percentage: changePercent },
        });
      }
    }

    // 2. Taxa de poupança
    if (thisMonthIncome > 0) {
      const savingsRate = ((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100;

      if (savingsRate < 0) {
        result.push({
          id: 'negative_balance',
          type: 'alert',
          title: 'Atenção: Saldo negativo',
          description: 'Suas despesas superaram suas receitas este mês. Revise seus gastos.',
          action: 'Revisar gastos',
        });
      } else if (savingsRate < 10 && savingsRate >= 0) {
        result.push({
          id: 'low_savings',
          type: 'warning',
          title: 'Margem de economia baixa',
          description: `Você está guardando apenas ${savingsRate.toFixed(0)}% da sua renda. Tente aumentar para 20%.`,
          action: 'Ver dicas',
          data: { percentage: savingsRate },
        });
      } else if (savingsRate >= 20) {
        result.push({
          id: 'good_savings',
          type: 'success',
          title: 'Ótima taxa de poupança!',
          description: `Você está guardando ${savingsRate.toFixed(0)}% da sua renda. Continue assim!`,
          data: { percentage: savingsRate },
        });
      }
    }

    // 3. Análise por categoria - identificar maiores gastos
    const expensesByCategory: Record<string, number> = {};
    thisMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.categoryId] = (expensesByCategory[t.categoryId] || 0) + t.amount;
      });

    const sortedCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a);

    // Categoria com maior gasto
    if (sortedCategories.length > 0) {
      const [topCategoryId, topAmount] = sortedCategories[0];
      const topCategory = getCategoryById(topCategoryId);
      const percentOfTotal = (topAmount / thisMonthExpenses) * 100;

      if (percentOfTotal > 40) {
        result.push({
          id: 'high_category_spend',
          type: 'tip',
          title: `${topCategory?.name || 'Categoria'} representa ${percentOfTotal.toFixed(0)}% dos gastos`,
          description: `Considere estabelecer um limite para essa categoria.`,
          action: 'Criar orçamento',
          data: { categoryId: topCategoryId, amount: topAmount, percentage: percentOfTotal },
        });
      }
    }

    // 4. Verificar orçamentos estourados
    budgets.forEach(budget => {
      const categorySpent = expensesByCategory[budget.categoryId] || 0;
      const percentUsed = (categorySpent / budget.limit) * 100;
      const category = getCategoryById(budget.categoryId);

      if (percentUsed >= 100) {
        result.push({
          id: `budget_exceeded_${budget.categoryId}`,
          type: 'alert',
          title: `Orçamento de ${category?.name} estourado`,
          description: `Você gastou R$ ${categorySpent.toFixed(2)} de R$ ${budget.limit.toFixed(2)} (${percentUsed.toFixed(0)}%).`,
          action: 'Ajustar orçamento',
          data: { categoryId: budget.categoryId, amount: categorySpent, percentage: percentUsed },
        });
      } else if (percentUsed >= 80 && percentUsed < 100) {
        result.push({
          id: `budget_warning_${budget.categoryId}`,
          type: 'warning',
          title: `${category?.name} quase no limite`,
          description: `${percentUsed.toFixed(0)}% do orçamento utilizado. Restam R$ ${(budget.limit - categorySpent).toFixed(2)}.`,
          data: { categoryId: budget.categoryId, amount: categorySpent, percentage: percentUsed },
        });
      }
    });

    // 5. Gastos recorrentes
    const recurringExpenses = thisMonthTransactions.filter(t => t.isRecurring && t.type === 'expense');
    const recurringTotal = recurringExpenses.reduce((sum, t) => sum + t.amount, 0);

    if (recurringTotal > 0 && thisMonthIncome > 0) {
      const recurringPercent = (recurringTotal / thisMonthIncome) * 100;

      if (recurringPercent > 50) {
        result.push({
          id: 'high_recurring',
          type: 'warning',
          title: 'Gastos fixos elevados',
          description: `${recurringPercent.toFixed(0)}% da sua renda vai para gastos fixos. Revise assinaturas e serviços.`,
          action: 'Ver gastos fixos',
          data: { amount: recurringTotal, percentage: recurringPercent },
        });
      }
    }

    // 6. Dica de dia do mês
    const dayOfMonth = today.getDate();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dayPercent = (dayOfMonth / daysInMonth) * 100;
    const budgetPercent = thisMonthIncome > 0 ? (thisMonthExpenses / thisMonthIncome) * 100 : 0;

    if (dayPercent < 50 && budgetPercent > 60) {
      result.push({
        id: 'spending_pace',
        type: 'warning',
        title: 'Ritmo de gastos acelerado',
        description: `Você já gastou ${budgetPercent.toFixed(0)}% da renda na primeira metade do mês.`,
        action: 'Planejar',
      });
    }

    // Limitar a 5 insights mais relevantes
    return result.slice(0, 5);
  }, [transactions, budgets]);

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return <AlertIcon size={20} color="#F59E0B" />;
      case 'alert':
        return <TrendingDownIcon size={20} color="#EF4444" />;
      case 'success':
        return <CheckCircleIcon size={20} color="#10B981" />;
      case 'tip':
        return <LightbulbIcon size={20} color={theme.colors.primary} />;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' };
      case 'alert':
        return { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' };
      case 'success':
        return { bg: '#D1FAE5', border: '#10B981', text: '#065F46' };
      case 'tip':
        return { bg: theme.colors.primary + '15', border: theme.colors.primary, text: theme.colors.primary };
    }
  };

  if (insights.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LightbulbIcon size={20} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Insights Inteligentes
          </Text>
        </View>
      </View>

      {insights.map((insight, index) => {
        const colors = getInsightColor(insight.type);

        return (
          <TouchableOpacity
            key={insight.id}
            style={[
              styles.insightCard,
              {
                backgroundColor: colors.bg,
                borderLeftColor: colors.border,
              },
              index < insights.length - 1 && { marginBottom: 10 },
            ]}
            onPress={() => onInsightPress?.(insight)}
            activeOpacity={0.7}
          >
            <View style={styles.insightContent}>
              <View style={styles.insightIcon}>
                {getInsightIcon(insight.type)}
              </View>
              <View style={styles.insightText}>
                <Text style={[styles.insightTitle, { color: colors.text }]}>
                  {insight.title}
                </Text>
                <Text style={[styles.insightDescription, { color: colors.text + 'CC' }]}>
                  {insight.description}
                </Text>
              </View>
              {insight.action && (
                <ChevronRightIcon size={18} color={colors.text} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  insightCard: {
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    marginRight: 12,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  insightDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
