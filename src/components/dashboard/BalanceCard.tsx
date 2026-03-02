/**
 * Card de Saldo Principal - Design Premium Fintech
 * Visual limpo e sofisticado inspirado em Nubank/Inter
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Text } from '../ui/Text';
import { useTheme } from '../../contexts/ThemeContext';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
  monthName?: string;
}

// Ícone de olho minimalista
function EyeIcon({ size = 22, color = '#FFFFFF', isHidden = false }) {
  if (isHidden) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeOpacity={0.5}
        />
        <Path d="M2 2l20 20" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

export function BalanceCard({
  balance,
  income,
  expenses,
  monthName = 'Este mês',
}: BalanceCardProps) {
  const { theme } = useTheme();
  const [hideValues, setHideValues] = useState(false);

  const formatMoney = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.monthLabel}>{monthName}</Text>
          <TouchableOpacity
            onPress={() => setHideValues(!hideValues)}
            style={styles.eyeBtn}
            activeOpacity={0.7}
          >
            <EyeIcon isHidden={hideValues} />
          </TouchableOpacity>
        </View>

        {/* Saldo */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceTitle}>Saldo</Text>
          <Text style={styles.balanceValue}>
            {hideValues ? '••••••' : formatMoney(balance)}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <View style={[styles.indicator, styles.incomeIndicator]} />
              <Text style={styles.statLabel}>Receitas</Text>
            </View>
            <Text style={styles.statValue}>
              {hideValues ? '••••' : formatMoney(income)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <View style={[styles.indicator, styles.expenseIndicator]} />
              <Text style={styles.statLabel}>Despesas</Text>
            </View>
            <Text style={styles.statValue}>
              {hideValues ? '••••' : formatMoney(expenses)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  monthLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  eyeBtn: {
    padding: 4,
  },
  balanceSection: {
    marginBottom: 28,
  },
  balanceTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: 16,
  },
  statItem: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  incomeIndicator: {
    backgroundColor: '#4ADE80',
  },
  expenseIndicator: {
    backgroundColor: '#F87171',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
});
