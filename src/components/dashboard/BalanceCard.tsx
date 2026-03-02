/**
 * Card principal do Dashboard mostrando o saldo do mês
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, MoneyText } from '../ui/Text';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing } from '../../constants/spacing';

interface BalanceCardProps {
  /** Saldo atual (receitas - despesas) */
  balance: number;
  /** Total de receitas do mês */
  income: number;
  /** Total de despesas do mês */
  expenses: number;
  /** Nome do mês atual */
  monthName?: string;
}

export function BalanceCard({
  balance,
  income,
  expenses,
  monthName = 'Este mês',
}: BalanceCardProps) {
  const { theme } = useTheme();

  return (
    <Card
      variant="filled"
      backgroundColor={theme.colors.primary}
      padding="lg"
      rounded="xl"
      style={styles.container}
    >
      {/* Header */}
      <Text preset="label" color={theme.colors.textInverse} style={[styles.label, { opacity: 0.8 }]}>
        {monthName}
      </Text>

      {/* Saldo Principal */}
      <Text preset="caption" color={theme.colors.textInverse} style={[styles.balanceLabel, { opacity: 0.7 }]}>
        Saldo
      </Text>
      <MoneyText
        value={balance}
        type="neutral"
        size="large"
        color={theme.colors.textInverse}
        style={styles.balanceValue}
      />

      {/* Receitas e Despesas */}
      <View style={styles.row}>
        {/* Receitas */}
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <Text style={[styles.statIcon, { color: theme.colors.textInverse }]}>↑</Text>
            <Text preset="caption" color={theme.colors.textInverse} style={{ opacity: 0.7 }}>
              Receitas
            </Text>
          </View>
          <MoneyText
            value={income}
            type="neutral"
            size="small"
            color={theme.colors.successLight}
          />
        </View>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Despesas */}
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <Text style={[styles.statIcon, { color: theme.colors.textInverse }]}>↓</Text>
            <Text preset="caption" color={theme.colors.textInverse} style={{ opacity: 0.7 }}>
              Despesas
            </Text>
          </View>
          <MoneyText
            value={expenses}
            type="neutral"
            size="small"
            color={theme.colors.dangerLight}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
  balanceLabel: {
    marginBottom: spacing[1],
  },
  balanceValue: {
    marginBottom: spacing[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: spacing[3],
  },
  statItem: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  statIcon: {
    fontSize: 14,
    marginRight: spacing[1],
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: spacing[3],
  },
});
