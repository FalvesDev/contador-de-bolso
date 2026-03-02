/**
 * Tela de Relatórios
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Transaction } from '../components/dashboard/RecentTransactions';
import { getCategoryById } from '../constants/categories';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius } from '../constants/spacing';

interface ReportsScreenProps {
  transactions: Transaction[];
}

export function ReportsScreen({ transactions }: ReportsScreenProps) {
  const { theme } = useTheme();

  // Calcular totais por categoria
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const catId = t.categoryId;
      acc[catId] = (acc[catId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

  // Ordenar por valor
  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text preset="h3" style={{ color: theme.colors.text }}>Relatórios</Text>
        <Text preset="caption" color={theme.colors.textSecondary}>
          Março 2026
        </Text>
      </View>

      {/* Resumo do Mês */}
      <Card variant="elevated" style={{ ...styles.summaryCard, backgroundColor: theme.colors.card }}>
        <Text preset="label" color={theme.colors.textSecondary}>Resumo do Mês</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text preset="caption" color={theme.colors.success}>Receitas</Text>
            <Text preset="valueSmall" color={theme.colors.success}>
              R$ {totalIncome.toFixed(0)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text preset="caption" color={theme.colors.danger}>Despesas</Text>
            <Text preset="valueSmall" color={theme.colors.danger}>
              R$ {totalExpenses.toFixed(0)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text preset="caption" color={theme.colors.primary}>Saldo</Text>
            <Text preset="valueSmall" color={theme.colors.primary}>
              R$ {(totalIncome - totalExpenses).toFixed(0)}
            </Text>
          </View>
        </View>
      </Card>

      {/* Gastos por Categoria */}
      <View style={styles.section}>
        <Text preset="h4" style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Gastos por Categoria
        </Text>

        <Card variant="elevated" padding="md" style={{ backgroundColor: theme.colors.card }}>
          {sortedCategories.length > 0 ? (
            sortedCategories.map(([catId, amount]) => {
              const category = getCategoryById(catId);
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;

              return (
                <View key={catId} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: (category?.color || theme.colors.textTertiary) + '20' },
                      ]}
                    >
                      <Text style={{ fontSize: 16 }}>{category?.icon || '📦'}</Text>
                    </View>
                    <View>
                      <Text preset="body" style={{ color: theme.colors.text }}>
                        {category?.name || 'Outros'}
                      </Text>
                      <Text preset="caption" color={theme.colors.textSecondary}>
                        {percentage.toFixed(1)}% do total
                      </Text>
                    </View>
                  </View>
                  <Text preset="label" style={{ color: theme.colors.text }}>
                    R$ {amount.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text preset="body" color={theme.colors.textSecondary} center>
                Sem dados suficientes
              </Text>
            </View>
          )}
        </Card>
      </View>

      {/* Placeholder para Gráficos */}
      <View style={styles.section}>
        <Text preset="h4" style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Evolução Mensal
        </Text>

        <Card
          variant="outlined"
          style={{
            ...styles.chartPlaceholder,
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          }}
        >
          <Text style={styles.chartIcon}>📈</Text>
          <Text preset="body" color={theme.colors.textSecondary} center>
            Gráfico de evolução
          </Text>
          <Text preset="caption" color={theme.colors.textTertiary} center>
            Em breve...
          </Text>
        </Card>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  summaryCard: {
    marginHorizontal: spacing[4],
  },
  summaryRow: {
    flexDirection: 'row',
    marginTop: spacing[3],
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  section: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[4],
  },
  sectionTitle: {
    marginBottom: spacing[3],
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartIcon: {
    fontSize: 48,
    marginBottom: spacing[2],
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing[2],
  },
  spacer: {
    height: spacing[12],
  },
});
