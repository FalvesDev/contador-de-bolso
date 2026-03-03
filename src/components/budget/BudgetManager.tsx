/**
 * Gerenciador de Orçamento por Categoria
 * Integrado com useBudgets hook para persistência real
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { TargetIcon, PlusIcon, EditIcon, AlertIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { getCategoryById } from '../../constants/categories';
import { Transaction } from '../dashboard/RecentTransactions';
import { Budget } from '../../hooks/useBudgets';

interface BudgetWithSpent extends Budget {
  spent: number;
  percentage: number;
}

interface BudgetManagerProps {
  transactions: Transaction[];
  budgets: Budget[];
  selectedMonth?: Date; // Permite selecionar mês específico
  onEditBudget?: (categoryId: string, currentLimit: number) => void;
  onAddBudget?: () => void;
}

export function BudgetManager({
  transactions,
  budgets,
  selectedMonth,
  onEditBudget,
  onAddBudget
}: BudgetManagerProps) {
  const { theme } = useTheme();

  // Calcular mês de referência (atual ou selecionado)
  const referenceMonth = selectedMonth || new Date();
  const monthStart = new Date(referenceMonth.getFullYear(), referenceMonth.getMonth(), 1);
  const monthEnd = new Date(referenceMonth.getFullYear(), referenceMonth.getMonth() + 1, 0, 23, 59, 59, 999);

  // Calcular gastos por categoria do mês selecionado
  const expensesByCategory = useMemo(() => {
    const expenses: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.type !== 'expense') return;

      const tDate = new Date(t.date);
      // Verificar se a transação está no mês de referência
      if (tDate >= monthStart && tDate <= monthEnd) {
        expenses[t.categoryId] = (expenses[t.categoryId] || 0) + t.amount;
      }
    });

    return expenses;
  }, [transactions, monthStart.getTime(), monthEnd.getTime()]);

  // Combinar orçamentos com gastos reais
  const budgetsWithSpent: BudgetWithSpent[] = useMemo(() => {
    return budgets.map(b => {
      const spent = expensesByCategory[b.categoryId] || 0;
      const percentage = b.limit > 0 ? (spent / b.limit) * 100 : 0;
      return { ...b, spent, percentage };
    }).sort((a, b) => b.percentage - a.percentage); // Ordenar por % gasto (maior primeiro)
  }, [budgets, expensesByCategory]);

  // Calcular totais
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgetsWithSpent.reduce((sum, b) => sum + b.spent, 0);
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Contar categorias em alerta
  const categoriesOverBudget = budgetsWithSpent.filter(b => b.percentage >= 100).length;
  const categoriesNearLimit = budgetsWithSpent.filter(b => b.percentage >= 80 && b.percentage < 100).length;

  const formatMoney = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return theme.colors.danger;
    if (percentage >= 80) return theme.colors.warning;
    if (percentage >= 60) return '#F59E0B'; // Amber
    return theme.colors.success;
  };

  const getMonthName = () => {
    return referenceMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  if (budgets.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <TargetIcon size={20} color={theme.colors.primary} />
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Orçamento Mensal
            </Text>
          </View>
        </View>

        <Card variant="outlined" padding="lg" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.colors.primary + '15' }]}>
              <TargetIcon size={32} color={theme.colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              Configure seu orçamento
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
              Defina limites de gastos por categoria para controlar suas despesas mensais.
            </Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: theme.colors.primary }]}
              onPress={onAddBudget}
            >
              <Text style={styles.emptyBtnText}>Criar primeiro orçamento</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <TargetIcon size={20} color={theme.colors.primary} />
          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Orçamento Mensal
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {getMonthName()}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.colors.primary + '15' }]}
          onPress={onAddBudget}
        >
          <PlusIcon size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Resumo geral */}
      <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
        <View style={styles.summaryMain}>
          <View style={styles.summaryLeft}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Gasto do orçamento total
            </Text>
            <View style={styles.summaryValues}>
              <Text style={[styles.summarySpent, { color: totalPercentage >= 100 ? theme.colors.danger : theme.colors.text }]}>
                {formatMoney(totalSpent)}
              </Text>
              <Text style={[styles.summaryLimit, { color: theme.colors.textSecondary }]}>
                / {formatMoney(totalBudget)}
              </Text>
            </View>
          </View>
          <View style={[styles.summaryPercentage, { backgroundColor: getProgressColor(totalPercentage) + '20' }]}>
            <Text style={[styles.summaryPercentageText, { color: getProgressColor(totalPercentage) }]}>
              {Math.round(totalPercentage)}%
            </Text>
          </View>
        </View>

        {/* Barra de progresso total */}
        <View style={[styles.totalProgressBg, { backgroundColor: theme.colors.backgroundTertiary }]}>
          <View
            style={[
              styles.totalProgressBar,
              {
                width: `${Math.min(totalPercentage, 100)}%`,
                backgroundColor: getProgressColor(totalPercentage)
              }
            ]}
          />
        </View>

        {/* Alertas */}
        {(categoriesOverBudget > 0 || categoriesNearLimit > 0) && (
          <View style={styles.alertsRow}>
            {categoriesOverBudget > 0 && (
              <View style={[styles.alertBadge, { backgroundColor: theme.colors.danger + '15' }]}>
                <AlertIcon size={12} color={theme.colors.danger} />
                <Text style={[styles.alertText, { color: theme.colors.danger }]}>
                  {categoriesOverBudget} {categoriesOverBudget === 1 ? 'categoria excedida' : 'categorias excedidas'}
                </Text>
              </View>
            )}
            {categoriesNearLimit > 0 && (
              <View style={[styles.alertBadge, { backgroundColor: theme.colors.warning + '15' }]}>
                <AlertIcon size={12} color={theme.colors.warning} />
                <Text style={[styles.alertText, { color: theme.colors.warning }]}>
                  {categoriesNearLimit} próxima{categoriesNearLimit > 1 ? 's' : ''} do limite
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Lista de orçamentos por categoria */}
      <Card variant="elevated" padding="none" style={{ backgroundColor: theme.colors.card }}>
        {budgetsWithSpent.map((budget, index) => {
          const category = getCategoryById(budget.categoryId);
          const progressColor = getProgressColor(budget.percentage);
          const isOver = budget.percentage >= 100;
          const isNearLimit = budget.percentage >= 80 && budget.percentage < 100;

          return (
            <TouchableOpacity
              key={budget.categoryId}
              style={[
                styles.budgetRow,
                index < budgetsWithSpent.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border
                }
              ]}
              onPress={() => onEditBudget?.(budget.categoryId, budget.limit)}
              activeOpacity={0.7}
            >
              <View style={styles.budgetInfo}>
                <View style={styles.categoryRow}>
                  <View style={[styles.categoryDot, { backgroundColor: category?.color || '#94A3B8' }]} />
                  <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                    {category?.name || 'Categoria'}
                  </Text>
                  {isOver && (
                    <View style={[styles.statusBadge, { backgroundColor: theme.colors.danger + '15' }]}>
                      <Text style={[styles.statusText, { color: theme.colors.danger }]}>Excedido</Text>
                    </View>
                  )}
                  {isNearLimit && (
                    <View style={[styles.statusBadge, { backgroundColor: theme.colors.warning + '15' }]}>
                      <Text style={[styles.statusText, { color: theme.colors.warning }]}>Atenção</Text>
                    </View>
                  )}
                </View>

                <View style={styles.valuesRow}>
                  <Text style={[styles.spentValue, { color: isOver ? theme.colors.danger : theme.colors.text }]}>
                    {formatMoney(budget.spent)}
                  </Text>
                  <Text style={[styles.limitValue, { color: theme.colors.textSecondary }]}>
                    / {formatMoney(budget.limit)}
                  </Text>
                  <Text style={[styles.percentageValue, { color: progressColor }]}>
                    {Math.round(budget.percentage)}%
                  </Text>
                </View>

                {/* Barra de progresso */}
                <View style={[styles.progressBg, { backgroundColor: theme.colors.backgroundTertiary }]}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${Math.min(budget.percentage, 100)}%`,
                        backgroundColor: progressColor
                      }
                    ]}
                  />
                </View>
              </View>

              <EditIcon size={16} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          );
        })}

        {/* Botão adicionar mais */}
        <TouchableOpacity
          style={[styles.addCategoryBtn, { borderTopWidth: 1, borderTopColor: theme.colors.border }]}
          onPress={onAddBudget}
        >
          <PlusIcon size={16} color={theme.colors.primary} />
          <Text style={[styles.addCategoryText, { color: theme.colors.primary }]}>
            Adicionar categoria
          </Text>
        </TouchableOpacity>
      </Card>
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  summaryMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLeft: {},
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  summarySpent: {
    fontSize: 22,
    fontWeight: '700',
  },
  summaryLimit: {
    fontSize: 14,
    marginLeft: 4,
  },
  summaryPercentage: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  summaryPercentageText: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalProgressBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  totalProgressBar: {
    height: '100%',
    borderRadius: 4,
  },
  alertsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  alertText: {
    fontSize: 11,
    fontWeight: '500',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  budgetInfo: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  valuesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  spentValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  limitValue: {
    fontSize: 12,
    marginLeft: 4,
  },
  percentageValue: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 'auto',
  },
  progressBg: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  addCategoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
