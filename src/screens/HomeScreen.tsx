/**
 * Home Screen - Dashboard Simples e Clean
 * Fácil de entender para qualquer usuário
 * COM ANIMAÇÕES COMPLETAS
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import {
  BellIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  WalletIcon,
  PiggyBankIcon,
} from '../components/ui/Icons';
import { RecentTransactions, Transaction } from '../components/dashboard/RecentTransactions';
import { SmartInsights } from '../components/insights';
import { getCategoryById } from '../constants/categories';
import { useTheme } from '../contexts/ThemeContext';
import { Budget } from '../hooks/useBudgets';
import { Goal } from '../hooks/useGoals';

interface HomeScreenProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  unreadNotifications: number;
  onSeeAllTransactions: () => void;
  onTransactionPress: (transaction: Transaction) => void;
  onNotificationsPress: () => void;
}

// Componente de botão animado
function AnimatedTouchable({
  onPress,
  style,
  children,
  scaleValue = 0.95,
}: {
  onPress: () => void;
  style?: any;
  children: React.ReactNode;
  scaleValue?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: scaleValue,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export function HomeScreen({
  transactions,
  budgets,
  goals,
  unreadNotifications,
  onSeeAllTransactions,
  onTransactionPress,
  onNotificationsPress,
}: HomeScreenProps) {
  const { theme } = useTheme();
  const [hideValues, setHideValues] = useState(false);

  // ═══════════════════════════════════════════════════════
  // ANIMAÇÕES
  // ═══════════════════════════════════════════════════════

  // Header animations
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-20)).current;

  // Balance animations
  const balanceOpacity = useRef(new Animated.Value(0)).current;
  const balanceScale = useRef(new Animated.Value(0.9)).current;

  // Cards animations (staggered)
  const card1Opacity = useRef(new Animated.Value(0)).current;
  const card1Translate = useRef(new Animated.Value(30)).current;
  const card2Opacity = useRef(new Animated.Value(0)).current;
  const card2Translate = useRef(new Animated.Value(30)).current;

  // Overview section
  const overviewOpacity = useRef(new Animated.Value(0)).current;
  const overviewTranslate = useRef(new Animated.Value(30)).current;

  // Categories section
  const categoriesOpacity = useRef(new Animated.Value(0)).current;
  const categoriesTranslate = useRef(new Animated.Value(30)).current;

  // Bell button pulse
  const bellPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequência de animações de entrada
    const animations = Animated.stagger(100, [
      // Header fade in
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(headerTranslate, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 60,
        }),
      ]),
      // Balance appear
      Animated.parallel([
        Animated.timing(balanceOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(balanceScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
          tension: 80,
        }),
      ]),
      // Card 1
      Animated.parallel([
        Animated.timing(card1Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(card1Translate, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 60,
        }),
      ]),
      // Card 2
      Animated.parallel([
        Animated.timing(card2Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(card2Translate, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 60,
        }),
      ]),
      // Overview
      Animated.parallel([
        Animated.timing(overviewOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(overviewTranslate, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 60,
        }),
      ]),
      // Categories
      Animated.parallel([
        Animated.timing(categoriesOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(categoriesTranslate, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 60,
        }),
      ]),
    ]);

    animations.start();

    // Bell pulse animation when there are notifications
    if (unreadNotifications > 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(bellPulse, {
            toValue: 1.15,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bellPulse, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [unreadNotifications]);

  // ═══════════════════════════════════════════════════════
  // DATA CALCULATIONS
  // ═══════════════════════════════════════════════════════

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Bom dia' : today.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const currentMonth = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const formatMoney = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const monthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentDate.getMonth() &&
      tDate.getFullYear() === currentDate.getFullYear();
  });

  const income = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  const totalReserves = goals.reduce((s, g) => s + g.currentAmount, 0);

  const thisMonthExpenses = monthTransactions.filter(t => t.type === 'expense');
  const expensesByCategory: Record<string, number> = {};
  thisMonthExpenses.forEach(t => {
    expensesByCategory[t.categoryId] = (expensesByCategory[t.categoryId] || 0) + t.amount;
  });

  const topCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([catId, value]) => {
      const cat = getCategoryById(catId);
      return { name: cat?.name || 'Outros', value, color: cat?.color || '#94A3B8' };
    });

  const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header com Gradiente */}
      <View style={styles.headerContainer}>
        <Svg width={SCREEN_WIDTH} height={300} style={styles.headerSvg}>
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.colors.gradientStart} />
              <Stop offset="50%" stopColor={theme.colors.gradientEnd} />
              <Stop offset="100%" stopColor={theme.colors.primary} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={SCREEN_WIDTH} height={300} fill="url(#grad)" />
          <Circle cx={SCREEN_WIDTH * 0.9} cy={30} r={100} fill="rgba(255,255,255,0.05)" />
          <Circle cx={SCREEN_WIDTH * 0.1} cy={180} r={60} fill="rgba(255,255,255,0.04)" />
          <Circle cx={SCREEN_WIDTH * 0.5} cy={-20} r={120} fill="rgba(255,255,255,0.03)" />
          <Path
            d={`M0 260 Q ${SCREEN_WIDTH * 0.25} 290 ${SCREEN_WIDTH * 0.5} 270 T ${SCREEN_WIDTH} 280 L ${SCREEN_WIDTH} 300 L 0 300 Z`}
            fill={theme.colors.background}
          />
        </Svg>

        <View style={styles.headerContent}>
          {/* Top bar animado */}
          <Animated.View
            style={[
              styles.topBar,
              {
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslate }],
              },
            ]}
          >
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.appName}>Contador de Bolso</Text>
            </View>
            <AnimatedTouchable onPress={onNotificationsPress} style={styles.bellBtn}>
              <Animated.View style={{ transform: [{ scale: bellPulse }] }}>
                <BellIcon size={22} color="rgba(255,255,255,0.9)" />
              </Animated.View>
              {unreadNotifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </Text>
                </View>
              )}
            </AnimatedTouchable>
          </Animated.View>

          {/* Seletor de Mês animado */}
          <Animated.View
            style={[
              styles.monthSelector,
              {
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslate }],
              },
            ]}
          >
            <AnimatedTouchable onPress={handlePrevMonth} style={styles.monthArrow}>
              <ChevronLeftIcon size={22} color="rgba(255,255,255,0.8)" />
            </AnimatedTouchable>
            <Text style={styles.monthLabel}>{currentMonth}</Text>
            <AnimatedTouchable onPress={handleNextMonth} style={styles.monthArrow}>
              <ChevronRightIcon size={22} color="rgba(255,255,255,0.8)" />
            </AnimatedTouchable>
          </Animated.View>

          {/* Saldo animado */}
          <Animated.View
            style={[
              styles.balanceSection,
              {
                opacity: balanceOpacity,
                transform: [{ scale: balanceScale }],
              },
            ]}
          >
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Saldo do mês</Text>
              <AnimatedTouchable onPress={() => setHideValues(!hideValues)} scaleValue={0.9}>
                {hideValues ? (
                  <EyeOffIcon size={18} color="rgba(255,255,255,0.6)" />
                ) : (
                  <EyeIcon size={18} color="rgba(255,255,255,0.6)" />
                )}
              </AnimatedTouchable>
            </View>
            <Text style={styles.balanceValue} numberOfLines={1} adjustsFontSizeToFit>
              {hideValues ? 'R$ ••••••' : formatMoney(balance)}
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* Cards de Receita e Despesa animados */}
      <View style={styles.summaryCards}>
        <Animated.View
          style={[
            styles.summaryCard,
            { backgroundColor: theme.colors.card },
            {
              opacity: card1Opacity,
              transform: [{ translateY: card1Translate }],
            },
          ]}
        >
          <View style={[styles.summaryIconBg, { backgroundColor: '#10B981' + '20' }]}>
            <ArrowUpIcon size={18} color="#10B981" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Receitas</Text>
            <Text
              style={[styles.summaryValue, { color: '#10B981' }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {hideValues ? '••••' : formatMoney(income)}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.summaryCard,
            { backgroundColor: theme.colors.card },
            {
              opacity: card2Opacity,
              transform: [{ translateY: card2Translate }],
            },
          ]}
        >
          <View style={[styles.summaryIconBg, { backgroundColor: '#EF4444' + '20' }]}>
            <ArrowDownIcon size={18} color="#EF4444" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Despesas</Text>
            <Text
              style={[styles.summaryValue, { color: '#EF4444' }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {hideValues ? '••••' : formatMoney(expenses)}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Visão Geral - Saldo Total e Reservas */}
      <Animated.View
        style={[
          styles.overviewSection,
          {
            opacity: overviewOpacity,
            transform: [{ translateY: overviewTranslate }],
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Visão Geral
        </Text>
        <View style={styles.overviewCards}>
          <AnimatedTouchable
            onPress={() => {}}
            style={[styles.overviewCard, { backgroundColor: theme.colors.card }]}
          >
            <View style={[styles.overviewIconBg, { backgroundColor: theme.colors.primary + '20' }]}>
              <WalletIcon size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.overviewLabel, { color: theme.colors.textSecondary }]}>
              Saldo Total
            </Text>
            <Text
              style={[
                styles.overviewValue,
                { color: totalBalance >= 0 ? '#10B981' : '#EF4444' },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
            >
              {hideValues ? '••••••' : formatMoney(totalBalance)}
            </Text>
          </AnimatedTouchable>

          <AnimatedTouchable
            onPress={() => {}}
            style={[styles.overviewCard, { backgroundColor: theme.colors.card }]}
          >
            <View style={[styles.overviewIconBg, { backgroundColor: '#EC4899' + '20' }]}>
              <PiggyBankIcon size={20} color="#EC4899" />
            </View>
            <Text style={[styles.overviewLabel, { color: theme.colors.textSecondary }]}>
              Reservas
            </Text>
            <Text
              style={[styles.overviewValue, { color: '#EC4899' }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
            >
              {hideValues ? '••••••' : formatMoney(totalReserves)}
            </Text>
          </AnimatedTouchable>
        </View>
      </Animated.View>

      {/* Onde você mais gastou */}
      {topCategories.length > 0 && (
        <Animated.View
          style={[
            styles.section,
            {
              opacity: categoriesOpacity,
              transform: [{ translateY: categoriesTranslate }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Onde você mais gastou
          </Text>
          <Card variant="elevated" padding="md" style={{ backgroundColor: theme.colors.card }}>
            {topCategories.map((cat, index) => (
              <View key={index} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                  <Text style={[styles.categoryName, { color: theme.colors.text }]}>{cat.name}</Text>
                </View>
                <Text style={[styles.categoryValue, { color: theme.colors.text }]}>
                  {hideValues ? '••••' : formatMoney(cat.value)}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      )}

      {/* Últimas transações */}
      <RecentTransactions
        transactions={sortedTransactions.slice(0, 5)}
        onSeeAll={onSeeAllTransactions}
        onTransactionPress={onTransactionPress}
      />

      {/* Insights Inteligentes */}
      <SmartInsights transactions={transactions} budgets={budgets} />

      {/* Dica simples */}
      {balance < 0 && (
        <View style={[styles.tipCard, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
          <Text style={[styles.tipText, { color: '#92400E' }]}>
            Atenção: suas despesas estão maiores que suas receitas este mês.
          </Text>
        </View>
      )}

      {balance > income * 0.2 && balance > 0 && (
        <View style={[styles.tipCard, { backgroundColor: '#D1FAE5', borderColor: '#10B981' }]}>
          <Text style={[styles.tipText, { color: '#065F46' }]}>
            Parabéns! Você está conseguindo guardar dinheiro este mês.
          </Text>
        </View>
      )}

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
  headerContainer: {
    height: 300,
    marginBottom: -20,
    overflow: 'visible',
    position: 'relative',
  },
  headerSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 20,
    includeFontPadding: false,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
    lineHeight: 28,
    includeFontPadding: false,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  monthArrow: {
    padding: 10,
  },
  monthLabel: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 17,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginHorizontal: 8,
    lineHeight: 24,
    includeFontPadding: false,
  },
  balanceSection: {
    marginTop: 4,
    marginBottom: 16,
    alignItems: 'center',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 20,
    includeFontPadding: false,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 48,
    includeFontPadding: false,
  },
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 10,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  summaryIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTextContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 15,
  },
  categoryValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  tipCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  overviewSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  overviewCards: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  overviewCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  overviewIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  overviewLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: '700',
  },
});
