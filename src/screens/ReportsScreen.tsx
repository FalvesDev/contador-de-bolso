/**
 * Tela de Relatórios - Design moderno com Análise Financeira Inteligente
 */

import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Animated } from 'react-native';
import Svg, { Circle as SvgCircle, Path } from 'react-native-svg';
import { CalendarView, DayTransactionsModal } from '../components/reports';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Transaction } from '../components/dashboard/RecentTransactions';
import { getCategoryById } from '../constants/categories';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius } from '../constants/spacing';
import { PieChart } from '../components/charts/PieChart';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import {
  CategoryIcon,
  ShieldIcon,
  AlertIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  PiggyBankIcon,
  CalendarIcon,
  ChartBarIcon,
  LightbulbIcon,
} from '../components/ui/Icons';
import { FutureExpenses } from '../components/dashboard/FutureExpenses';
import { BudgetManager } from '../components/budget/BudgetManager';
import { GoalsCard } from '../components/goals/GoalsCard';
import { Budget } from '../hooks/useBudgets';
import { Goal } from '../hooks/useGoals';
import {
  calculateFinancialHealth,
  analyzeNegativeRisk,
  analyzeSpendingPatterns,
  getSavingsRecommendations,
  formatCurrency,
  getRiskColor,
  FinancialHealthScore,
  NegativeRisk,
  SpendingPattern,
  SavingsRecommendation,
} from '../services/financialAnalysis';

interface ReportsScreenProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  monthlyIncome?: number;
  monthlyBudget?: number;
  onEditBudget: (categoryId: string, currentLimit: number) => void;
  onAddBudget: () => void;
}

// Componente do Score Circular
function HealthScoreCircle({ score, color, size = 100 }: { score: number; color: string; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <SvgCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color }}>{score}</Text>
        <Text style={{ fontSize: 11, color: '#6B7280' }}>pontos</Text>
      </View>
    </View>
  );
}

// Card de Saúde Financeira
function HealthScoreCard({ health, theme }: { health: FinancialHealthScore; theme: any }) {
  return (
    <Card variant="elevated" style={{ ...styles.healthCard, backgroundColor: theme.colors.card }}>
      <View style={styles.healthHeader}>
        <View style={[styles.healthIconContainer, { backgroundColor: health.color + '15' }]}>
          <ShieldIcon size={24} color={health.color} />
        </View>
        <View style={styles.healthTitleContainer}>
          <Text preset="h4" style={{ color: theme.colors.text }}>Saúde Financeira</Text>
          <Text preset="caption" color={theme.colors.textSecondary}>Análise do mês atual</Text>
        </View>
      </View>

      <View style={styles.healthContent}>
        <HealthScoreCircle score={health.score} color={health.color} />
        <View style={styles.healthInfo}>
          <View style={[styles.healthBadge, { backgroundColor: health.color + '20' }]}>
            <Text style={{ color: health.color, fontSize: 12, fontWeight: '600' }}>
              {health.level === 'excellent' ? 'Excelente' :
               health.level === 'good' ? 'Bom' :
               health.level === 'warning' ? 'Atenção' : 'Crítico'}
            </Text>
          </View>
          <Text preset="caption" color={theme.colors.textSecondary} style={styles.healthMessage}>
            {health.message}
          </Text>
        </View>
      </View>
    </Card>
  );
}

// Card de Risco de Ficar Negativo
function NegativeRiskCard({ risk, theme }: { risk: NegativeRisk; theme: any }) {
  const riskColor = getRiskColor(risk.level);

  return (
    <Card variant="elevated" style={{ ...styles.riskCard, backgroundColor: theme.colors.card }}>
      <View style={styles.riskHeader}>
        <View style={[styles.riskIconContainer, { backgroundColor: riskColor + '15' }]}>
          <AlertIcon size={24} color={riskColor} />
        </View>
        <Text preset="h4" style={{ color: theme.colors.text, flex: 1 }}>Risco de Saldo Negativo</Text>
      </View>

      <View style={styles.riskContent}>
        <View style={styles.riskMeter}>
          <View style={[styles.riskMeterBg, { backgroundColor: theme.colors.backgroundTertiary }]}>
            <View
              style={[
                styles.riskMeterFill,
                { width: `${risk.probability}%`, backgroundColor: riskColor },
              ]}
            />
          </View>
          <Text style={{ color: riskColor, fontSize: 18, fontWeight: '700', marginLeft: 12 }}>
            {risk.probability.toFixed(0)}%
          </Text>
        </View>

        <Text preset="body" color={theme.colors.textSecondary} style={styles.riskMessage}>
          {risk.message}
        </Text>

        {risk.daysUntilRisk && (
          <View style={[styles.riskAlert, { backgroundColor: riskColor + '10' }]}>
            <CalendarIcon size={16} color={riskColor} />
            <Text style={{ color: riskColor, fontSize: 13, marginLeft: 8 }}>
              Possível em {risk.daysUntilRisk} dias
            </Text>
          </View>
        )}

        <View style={styles.riskProjection}>
          <Text preset="caption" color={theme.colors.textSecondary}>Saldo projetado fim do mês:</Text>
          <Text
            style={{
              color: risk.projectedBalance >= 0 ? theme.colors.success : theme.colors.danger,
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {formatCurrency(risk.projectedBalance)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

// Card de Melhores Dias para Gastar
function SpendingPatternsCard({ patterns, theme }: { patterns: SpendingPattern; theme: any }) {
  return (
    <Card variant="elevated" style={{ ...styles.patternsCard, backgroundColor: theme.colors.card }}>
      <View style={styles.patternsHeader}>
        <View style={[styles.patternsIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
          <CalendarIcon size={24} color={theme.colors.primary} />
        </View>
        <Text preset="h4" style={{ color: theme.colors.text, flex: 1 }}>Padrão de Gastos</Text>
      </View>

      <View style={styles.patternsContent}>
        {/* Melhores dias */}
        <View style={styles.patternSection}>
          <View style={styles.patternTitleRow}>
            <TrendingDownIcon size={16} color={theme.colors.success} />
            <Text preset="label" color={theme.colors.success} style={{ marginLeft: 6 }}>
              Dias mais tranquilos
            </Text>
          </View>
          <View style={styles.daysRow}>
            {patterns.bestDaysToSpend.slice(0, 4).map(day => (
              <View key={day} style={[styles.dayBadge, { backgroundColor: theme.colors.success + '15' }]}>
                <Text style={{ color: theme.colors.success, fontSize: 13, fontWeight: '600' }}>
                  Dia {day}
                </Text>
              </View>
            ))}
          </View>
          <Text preset="caption" color={theme.colors.textSecondary} style={{ marginTop: 4 }}>
            Nesses dias você costuma gastar menos
          </Text>
        </View>

        {/* Piores dias */}
        <View style={[styles.patternSection, { marginTop: 16 }]}>
          <View style={styles.patternTitleRow}>
            <TrendingUpIcon size={16} color={theme.colors.danger} />
            <Text preset="label" color={theme.colors.danger} style={{ marginLeft: 6 }}>
              Dias de maior gasto
            </Text>
          </View>
          <View style={styles.daysRow}>
            {patterns.worstDaysToSpend.slice(0, 4).map(day => (
              <View key={day} style={[styles.dayBadge, { backgroundColor: theme.colors.danger + '15' }]}>
                <Text style={{ color: theme.colors.danger, fontSize: 13, fontWeight: '600' }}>
                  Dia {day}
                </Text>
              </View>
            ))}
          </View>
          <Text preset="caption" color={theme.colors.textSecondary} style={{ marginTop: 4 }}>
            Evite grandes compras nesses dias
          </Text>
        </View>

        {/* Gasto por dia da semana */}
        <View style={[styles.patternSection, { marginTop: 16 }]}>
          <Text preset="label" color={theme.colors.textSecondary} style={{ marginBottom: 8 }}>
            Média por dia da semana
          </Text>
          <View style={styles.weekdayChart}>
            {Object.entries(patterns.averageByWeekday).map(([day, avg]) => {
              const maxAvg = Math.max(...Object.values(patterns.averageByWeekday));
              const height = maxAvg > 0 ? (avg / maxAvg) * 40 : 0;
              return (
                <View key={day} style={styles.weekdayBar}>
                  <View
                    style={[
                      styles.weekdayBarFill,
                      {
                        height,
                        backgroundColor: avg === maxAvg ? theme.colors.danger : theme.colors.primary,
                      },
                    ]}
                  />
                  <Text style={{ fontSize: 10, color: theme.colors.textSecondary, marginTop: 4 }}>
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </Card>
  );
}

// Card de Recomendações de Poupança
function SavingsCard({ savings, theme }: { savings: SavingsRecommendation; theme: any }) {
  return (
    <Card variant="elevated" style={{ ...styles.savingsCard, backgroundColor: theme.colors.card }}>
      <View style={styles.savingsHeader}>
        <View style={[styles.savingsIconContainer, { backgroundColor: theme.colors.success + '15' }]}>
          <PiggyBankIcon size={24} color={theme.colors.success} />
        </View>
        <Text preset="h4" style={{ color: theme.colors.text, flex: 1 }}>Oportunidades de Economia</Text>
      </View>

      <View style={styles.savingsContent}>
        <View style={styles.savingsStats}>
          <View style={styles.savingsStat}>
            <Text preset="caption" color={theme.colors.textSecondary}>Taxa atual</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: savings.currentSavingsRate >= 20 ? theme.colors.success : theme.colors.warning,
              }}
            >
              {savings.currentSavingsRate.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.savingsStat}>
            <Text preset="caption" color={theme.colors.textSecondary}>Meta recomendada</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.primary }}>
              {savings.recommendedSavingsRate.toFixed(0)}%
            </Text>
          </View>
          <View style={styles.savingsStat}>
            <Text preset="caption" color={theme.colors.textSecondary}>Meta mensal</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>
              {formatCurrency(savings.monthlySavingsGoal)}
            </Text>
          </View>
        </View>

        {savings.potentialSavings > 0 && (
          <View style={[styles.potentialSavings, { backgroundColor: theme.colors.success + '10' }]}>
            <Text style={{ color: theme.colors.success, fontSize: 13 }}>
              Economia potencial identificada: {formatCurrency(savings.potentialSavings)}/mês
            </Text>
          </View>
        )}

        <View style={styles.tipsSection}>
          <View style={styles.tipsTitleRow}>
            <LightbulbIcon size={18} color={theme.colors.warning} />
            <Text preset="label" color={theme.colors.text} style={{ marginLeft: 8 }}>
              Dicas personalizadas
            </Text>
          </View>
          {savings.tips.map((tip, index) => (
            <View key={index} style={styles.tipRow}>
              <View style={[styles.tipDot, { backgroundColor: theme.colors.primary }]} />
              <Text preset="caption" color={theme.colors.textSecondary} style={styles.tipText}>
                {tip}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

// Card de Gastos por Categoria
function CategoryExpensesCard({
  expenses,
  total,
  theme,
}: {
  expenses: [string, number][];
  total: number;
  theme: any;
}) {
  return (
    <Card variant="elevated" style={{ ...styles.categoryCard, backgroundColor: theme.colors.card }}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
          <ChartBarIcon size={24} color={theme.colors.primary} />
        </View>
        <Text preset="h4" style={{ color: theme.colors.text, flex: 1 }}>Gastos por Categoria</Text>
      </View>

      {expenses.length > 0 ? (
        expenses.map(([catId, amount]) => {
          const category = getCategoryById(catId);
          const percentage = total > 0 ? (amount / total) * 100 : 0;
          const iconColor = category?.color || theme.colors.textTertiary;

          return (
            <View key={catId} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryIconBg, { backgroundColor: iconColor + '15' }]}>
                  <CategoryIcon name={category?.icon || 'receipt'} size={18} color={iconColor} />
                </View>
                <View style={styles.categoryText}>
                  <Text preset="body" style={{ color: theme.colors.text }}>
                    {category?.name || 'Outros'}
                  </Text>
                  <Text preset="caption" color={theme.colors.textSecondary}>
                    {percentage.toFixed(1)}% do total
                  </Text>
                </View>
              </View>
              <Text preset="label" style={{ color: theme.colors.text }}>
                {formatCurrency(amount)}
              </Text>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyCategory}>
          <ChartBarIcon size={40} color={theme.colors.textTertiary} />
          <Text preset="body" color={theme.colors.textSecondary} center style={{ marginTop: 12 }}>
            Sem dados suficientes
          </Text>
        </View>
      )}
    </Card>
  );
}

export function ReportsScreen({
  transactions,
  budgets,
  goals,
  monthlyIncome = 5000,
  monthlyBudget = 4000,
  onEditBudget,
  onAddBudget,
}: ReportsScreenProps) {
  const { theme } = useTheme();

  // Estado do modal de transações do dia
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayTransactions, setSelectedDayTransactions] = useState<Transaction[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Handler para quando um dia é pressionado no calendário
  const handleDayPress = useCallback((date: Date, dayTransactions: Transaction[]) => {
    setSelectedDate(date);
    setSelectedDayTransactions(dayTransactions);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // Animações de entrada
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-20)).current;
  const summaryOpacity = useRef(new Animated.Value(0)).current;
  const summaryScale = useRef(new Animated.Value(0.95)).current;
  const chartsOpacity = useRef(new Animated.Value(0)).current;
  const chartsTranslate = useRef(new Animated.Value(30)).current;
  const cardsOpacity = useRef(new Animated.Value(0)).current;
  const cardsTranslate = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(150, [
      // Header
      Animated.parallel([
        Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(headerTranslate, { toValue: 0, useNativeDriver: true, friction: 8 }),
      ]),
      // Summary card
      Animated.parallel([
        Animated.timing(summaryOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(summaryScale, { toValue: 1, useNativeDriver: true, friction: 6 }),
      ]),
      // Charts
      Animated.parallel([
        Animated.timing(chartsOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(chartsTranslate, { toValue: 0, useNativeDriver: true, friction: 8 }),
      ]),
      // Analysis cards
      Animated.parallel([
        Animated.timing(cardsOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(cardsTranslate, { toValue: 0, useNativeDriver: true, friction: 8 }),
      ]),
    ]).start();
  }, []);

  // Calcular totais
  const totalExpenses = useMemo(() =>
    transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalIncome = useMemo(() =>
    transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) || monthlyIncome,
    [transactions, monthlyIncome]
  );

  const currentBalance = totalIncome - totalExpenses;

  // Análises inteligentes
  const financialHealth = useMemo(() =>
    calculateFinancialHealth(transactions, monthlyIncome, monthlyBudget),
    [transactions, monthlyIncome, monthlyBudget]
  );

  const negativeRisk = useMemo(() =>
    analyzeNegativeRisk(transactions, currentBalance, monthlyIncome),
    [transactions, currentBalance, monthlyIncome]
  );

  const spendingPatterns = useMemo(() =>
    analyzeSpendingPatterns(transactions),
    [transactions]
  );

  const savingsRecommendations = useMemo(() =>
    getSavingsRecommendations(transactions, totalIncome, totalExpenses),
    [transactions, totalIncome, totalExpenses]
  );

  // Gastos por categoria
  const expensesByCategory = useMemo(() => {
    const byCategory: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount;
      });
    return Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);
  }, [transactions]);

  // Dados para gráfico de pizza
  const pieChartData = useMemo(() => {
    return expensesByCategory.map(([catId, amount]) => {
      const category = getCategoryById(catId);
      return {
        id: catId,
        label: category?.name || 'Outros',
        value: amount,
        color: category?.color || '#6B7280',
      };
    });
  }, [expensesByCategory]);

  // Dados para gráfico de linha (evolução do saldo nos últimos 7 dias)
  const lineChartData = useMemo(() => {
    const today = new Date();
    const days = 7;
    const data: { label: string; value: number }[] = [];

    let runningBalance = totalIncome;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      // Subtrair despesas do dia
      const dayExpenses = transactions
        .filter(t => {
          const tDate = new Date(t.date);
          return t.type === 'expense' &&
            tDate.toDateString() === date.toDateString();
        })
        .reduce((sum, t) => sum + t.amount, 0);

      runningBalance -= dayExpenses;
      data.push({ label: dayStr.substring(0, 5), value: runningBalance });
    }

    return data;
  }, [transactions, totalIncome]);

  // Dados para gráfico de barras (últimos 4 meses)
  const barChartData = useMemo(() => {
    const months: { label: string; value: number; color: string }[] = [];
    const today = new Date();

    for (let i = 3; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'short' });

      const monthExpenses = transactions
        .filter(t => {
          const tDate = new Date(t.date);
          return t.type === 'expense' &&
            tDate.getMonth() === monthDate.getMonth() &&
            tDate.getFullYear() === monthDate.getFullYear();
        })
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        label: monthName.charAt(0).toUpperCase() + monthName.slice(1, 3),
        value: monthExpenses,
        color: i === 0 ? theme.colors.primary : theme.colors.primaryLight,
      });
    }

    return months;
  }, [transactions, theme.colors]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Animado */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerOpacity, transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <Text preset="h3" style={{ color: theme.colors.text }}>Relatórios</Text>
        <Text preset="caption" color={theme.colors.textSecondary}>
          {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </Text>
      </Animated.View>

      {/* Resumo do Mês Animado */}
      <Animated.View
        style={{ opacity: summaryOpacity, transform: [{ scale: summaryScale }] }}
      >
        <Card variant="elevated" style={{ ...styles.summaryCard, backgroundColor: theme.colors.card }}>
          <Text preset="label" color={theme.colors.textSecondary}>Resumo do Mês</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text preset="caption" color={theme.colors.success}>Receitas</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.success }}>
                {formatCurrency(totalIncome)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text preset="caption" color={theme.colors.danger}>Despesas</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.danger }}>
                {formatCurrency(totalExpenses)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text preset="caption" color={theme.colors.primary}>Saldo</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: currentBalance >= 0 ? theme.colors.success : theme.colors.danger }}>
                {formatCurrency(currentBalance)}
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* Gráficos Visuais Animados */}
      <Animated.View
        style={{ opacity: chartsOpacity, transform: [{ translateY: chartsTranslate }] }}
      >
        <PieChart data={pieChartData} title="Despesas por Categoria" />

        <LineChart data={lineChartData} title="Evolução do Saldo (7 dias)" />

        <BarChart data={barChartData} title="Comparativo Mensal" />
      </Animated.View>

      {/* Calendário Financeiro */}
      <View style={styles.sectionHeader}>
        <Text preset="h4" style={{ color: theme.colors.text }}>Calendário Financeiro</Text>
        <Text preset="caption" color={theme.colors.textSecondary}>
          Visualize seus gastos e receitas por dia
        </Text>
      </View>
      <CalendarView transactions={transactions} onDayPress={handleDayPress} />

      {/* Modal de Transações do Dia */}
      <DayTransactionsModal
        visible={modalVisible}
        date={selectedDate}
        transactions={selectedDayTransactions}
        onClose={handleCloseModal}
      />

      {/* Cards de Análise Animados */}
      <Animated.View
        style={{ opacity: cardsOpacity, transform: [{ translateY: cardsTranslate }] }}
      >
        {/* Score de Saúde Financeira */}
        <HealthScoreCard health={financialHealth} theme={theme} />

        {/* Risco de Ficar Negativo */}
        <NegativeRiskCard risk={negativeRisk} theme={theme} />

        {/* Padrões de Gasto */}
        <SpendingPatternsCard patterns={spendingPatterns} theme={theme} />

        {/* Recomendações de Poupança */}
        <SavingsCard savings={savingsRecommendations} theme={theme} />

        {/* Gastos por Categoria */}
        <CategoryExpensesCard expenses={expensesByCategory} total={totalExpenses} theme={theme} />
      </Animated.View>

      {/* Compromissos Futuros (Parcelas e Fixos) */}
      <FutureExpenses transactions={transactions} />

      {/* Orçamento por Categoria */}
      <BudgetManager
        transactions={transactions}
        budgets={budgets}
        onEditBudget={onEditBudget}
        onAddBudget={onAddBudget}
      />

      {/* Metas Financeiras */}
      <GoalsCard
        goals={goals}
        onAddGoal={() => Alert.alert('Nova Meta', 'Funcionalidade disponível em breve!')}
        onViewGoal={(goal) => Alert.alert(goal.name, `Progresso: R$ ${goal.currentAmount.toFixed(2)} de R$ ${goal.targetAmount.toFixed(2)}`)}
      />

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
  healthCard: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  healthIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  healthTitleContainer: {
    flex: 1,
  },
  healthContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthInfo: {
    flex: 1,
    marginLeft: spacing[4],
  },
  healthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  healthMessage: {
    lineHeight: 18,
  },
  riskCard: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  riskIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  riskContent: {},
  riskMeter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskMeterBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  riskMeterFill: {
    height: '100%',
    borderRadius: 4,
  },
  riskMessage: {
    marginTop: spacing[3],
    lineHeight: 20,
  },
  riskAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: spacing[3],
  },
  riskProjection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  patternsCard: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  patternsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  patternsIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  patternsContent: {},
  patternSection: {},
  patternTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  weekdayChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
  },
  weekdayBar: {
    alignItems: 'center',
    flex: 1,
  },
  weekdayBarFill: {
    width: 20,
    borderRadius: 4,
    minHeight: 4,
  },
  savingsCard: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  savingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  savingsIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  savingsContent: {},
  savingsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  savingsStat: {
    alignItems: 'center',
  },
  potentialSavings: {
    padding: 12,
    borderRadius: 8,
    marginBottom: spacing[4],
  },
  tipsSection: {},
  tipsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    lineHeight: 18,
  },
  categoryCard: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
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
    flex: 1,
  },
  categoryIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  categoryText: {
    flex: 1,
  },
  emptyCategory: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  spacer: {
    height: spacing[12],
  },
  sectionHeader: {
    paddingHorizontal: spacing[4],
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
});
