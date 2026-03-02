/**
 * Home Screen - Dashboard Premium
 * Design limpo e profissional
 */

import React from 'react';
import { ScrollView, View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Text } from '../components/ui/Text';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { QuickStats } from '../components/dashboard/QuickStats';
import { RecentTransactions, Transaction } from '../components/dashboard/RecentTransactions';
import { PieChart } from '../components/charts/PieChart';
import { HorizontalBarChart } from '../components/charts/BarChart';
import { BudgetProgressBar } from '../components/charts/ProgressBar';
import { getCategoryById } from '../constants/categories';
import { useTheme } from '../contexts/ThemeContext';

interface HomeScreenProps {
  transactions: Transaction[];
  onSeeAllTransactions: () => void;
  onTransactionPress: (transaction: Transaction) => void;
}

// Ícone de sino
function BellIcon({ size = 24, color = '#64748B' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Header() {
  const { theme } = useTheme();
  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Bom dia' : today.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
          {greeting}
        </Text>
        <Text style={[styles.appName, { color: theme.colors.text }]}>
          Contador de Bolso
        </Text>
      </View>
      <TouchableOpacity style={[styles.bellBtn, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <BellIcon color={theme.colors.textSecondary} size={20} />
      </TouchableOpacity>
    </View>
  );
}

export function HomeScreen({
  transactions,
  onSeeAllTransactions,
  onTransactionPress,
}: HomeScreenProps) {
  const { theme } = useTheme();

  // Cálculos
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;
  const biggestExpense = Math.max(...transactions.filter(t => t.type === 'expense').map(t => t.amount), 0);
  const dailyAvg = new Date().getDate() > 0 ? expenses / new Date().getDate() : 0;
  const monthlyBudget = 5000;
  const budgetUsed = monthlyBudget > 0 ? (expenses / monthlyBudget) * 100 : 0;

  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Dados para gráfico de pizza
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory)
    .map(([catId, value]) => {
      const cat = getCategoryById(catId);
      return {
        id: catId,
        label: cat?.name || 'Outros',
        value,
        color: cat?.color || '#94A3B8',
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Dados para evolução mensal
  const monthlyData = [
    { label: 'Out', value: 3200, color: theme.colors.primaryLight },
    { label: 'Nov', value: 2800, color: theme.colors.primaryLight },
    { label: 'Dez', value: 4100, color: theme.colors.primaryLight },
    { label: 'Jan', value: 3500, color: theme.colors.primaryLight },
    { label: 'Fev', value: 2900, color: theme.colors.primaryLight },
    { label: 'Mar', value: expenses, color: theme.colors.primary },
  ];

  const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header />

      <BalanceCard
        balance={balance}
        income={income}
        expenses={expenses}
        monthName={currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
      />

      <QuickStats
        biggestExpense={biggestExpense}
        dailyAverage={dailyAvg}
        budgetUsed={budgetUsed}
      />

      <BudgetProgressBar
        current={expenses}
        total={monthlyBudget}
        title="Orçamento do Mês"
      />

      {pieData.length > 0 && <PieChart data={pieData} title="Gastos por Categoria" />}

      <HorizontalBarChart data={monthlyData} title="Evolução dos Gastos" />

      {/* Insight Card */}
      <View style={[styles.insightCard, { backgroundColor: theme.colors.card }]}>
        <View style={styles.insightHeader}>
          <View style={[styles.insightIcon, { backgroundColor: theme.colors.primaryLight + '20' }]}>
            <Text style={{ fontSize: 16 }}>💡</Text>
          </View>
          <Text style={[styles.insightTitle, { color: theme.colors.text }]}>Dica</Text>
        </View>
        <Text style={[styles.insightText, { color: theme.colors.textSecondary }]}>
          {budgetUsed > 80
            ? 'Você já usou mais de 80% do orçamento. Reduza os gastos.'
            : budgetUsed > 50
            ? 'Metade do orçamento usado. Continue assim!'
            : 'Seus gastos estão controlados este mês.'}
        </Text>
      </View>

      <RecentTransactions
        transactions={sortedTransactions.slice(0, 5)}
        onSeeAll={onSeeAllTransactions}
        onTransactionPress={onTransactionPress}
      />

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '400',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  insightText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
