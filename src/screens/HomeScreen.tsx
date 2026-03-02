/**
 * Tela inicial - Dashboard Profissional
 */

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from '../components/ui/Text';
import { IconButton } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { QuickStats } from '../components/dashboard/QuickStats';
import { RecentTransactions, Transaction } from '../components/dashboard/RecentTransactions';
import { PieChartSimple } from '../components/charts/PieChart';
import { HorizontalBarChart } from '../components/charts/BarChart';
import { BudgetProgressBar } from '../components/charts/ProgressBar';
import { getCategoryById } from '../constants/categories';
import { useTheme } from '../contexts/ThemeContext';
import { spacing } from '../constants/spacing';

interface HomeScreenProps {
  transactions: Transaction[];
  onSeeAllTransactions: () => void;
  onTransactionPress: (transaction: Transaction) => void;
}

function Header() {
  const { theme } = useTheme();
  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Bom dia' : today.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <View style={styles.header}>
      <View>
        <Text preset="caption" color={theme.colors.textSecondary}>
          {greeting}! 👋
        </Text>
        <Text preset="h4" style={{ color: theme.colors.text }}>Contador de Bolso</Text>
      </View>
      <View style={styles.headerRight}>
        <IconButton icon="🔔" onPress={() => {}} />
      </View>
    </View>
  );
}

export function HomeScreen({
  transactions,
  onSeeAllTransactions,
  onTransactionPress,
}: HomeScreenProps) {
  const { theme } = useTheme();

  // Calcular totais
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  const biggestExpense = Math.max(
    ...transactions.filter(t => t.type === 'expense').map(t => t.amount),
    0
  );

  const daysInMonth = new Date().getDate();
  const dailyAverage = daysInMonth > 0 ? expenses / daysInMonth : 0;

  const monthlyBudget = 5000;
  const budgetUsed = monthlyBudget > 0 ? (expenses / monthlyBudget) * 100 : 0;

  const currentMonth = new Date().toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  // Agrupar gastos por categoria
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const catId = t.categoryId;
      acc[catId] = (acc[catId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Preparar dados para o gráfico de pizza
  const pieData = Object.entries(expensesByCategory)
    .map(([catId, value]) => {
      const category = getCategoryById(catId);
      return {
        id: catId,
        label: category?.name || 'Outros',
        value,
        color: category?.color || theme.colors.textTertiary,
        icon: category?.icon || '📦',
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Dados simulados para evolução mensal (últimos 6 meses)
  const monthlyData = [
    { label: 'Out', value: 3200, color: theme.colors.primaryLight },
    { label: 'Nov', value: 2800, color: theme.colors.primaryLight },
    { label: 'Dez', value: 4100, color: theme.colors.primaryLight },
    { label: 'Jan', value: 3500, color: theme.colors.primaryLight },
    { label: 'Fev', value: 2900, color: theme.colors.primaryLight },
    { label: 'Mar', value: expenses, color: theme.colors.primary },
  ];

  const sortedTransactions = [...transactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header />

      {/* Card de Saldo Principal */}
      <BalanceCard
        balance={balance}
        income={income}
        expenses={expenses}
        monthName={currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
      />

      {/* Estatísticas Rápidas */}
      <QuickStats
        biggestExpense={biggestExpense}
        dailyAverage={dailyAverage}
        budgetUsed={budgetUsed}
      />

      {/* Progresso do Orçamento */}
      <BudgetProgressBar
        current={expenses}
        total={monthlyBudget}
        title="Orçamento do Mês"
      />

      {/* Gráfico de Gastos por Categoria */}
      {pieData.length > 0 && (
        <PieChartSimple
          data={pieData}
          title="Gastos por Categoria"
        />
      )}

      {/* Evolução Mensal */}
      <HorizontalBarChart
        data={monthlyData}
        title="Evolução dos Gastos"
      />

      {/* Insights */}
      <Card variant="outlined" style={{ ...styles.insightsCard, backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
        <View style={styles.insightHeader}>
          <Text style={styles.insightIcon}>💡</Text>
          <Text preset="label" style={{ color: theme.colors.text }}>Dica do mês</Text>
        </View>
        <Text preset="bodySmall" color={theme.colors.textSecondary}>
          {budgetUsed > 80
            ? 'Atenção! Você já usou mais de 80% do orçamento. Tente reduzir os gastos nos próximos dias.'
            : budgetUsed > 50
            ? 'Você está na metade do orçamento. Continue assim para fechar o mês bem!'
            : 'Ótimo trabalho! Seus gastos estão controlados este mês. Continue assim!'
          }
        </Text>
      </Card>

      {/* Transações Recentes */}
      <RecentTransactions
        transactions={sortedTransactions.slice(0, 5)}
        onSeeAll={onSeeAllTransactions}
        onTransactionPress={onTransactionPress}
      />

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  insightsCard: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  insightIcon: {
    fontSize: 20,
  },
  spacer: {
    height: spacing[4],
  },
});
