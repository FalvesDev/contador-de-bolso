/**
 * Cards de estatísticas rápidas - Design moderno banking
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, MoneyText } from '../ui/Text';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing } from '../../constants/spacing';
import { ChartBarIcon, TrendingUpIcon, TargetIcon } from '../ui/Icons';

interface StatItemProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor: string;
  label: string;
  value: number | string;
  valueColor?: string;
  isPercentage?: boolean;
  cardBg: string;
  labelColor: string;
  textColor: string;
}

function StatItem({ Icon, iconColor, label, value, valueColor, isPercentage, cardBg, labelColor, textColor }: StatItemProps) {
  return (
    <Card variant="elevated" padding="md" style={{ ...styles.statCard, backgroundColor: cardBg }}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
        <Icon size={20} color={iconColor} />
      </View>
      <Text preset="caption" color={labelColor} style={styles.label}>
        {label}
      </Text>
      {typeof value === 'number' && !isPercentage ? (
        <MoneyText value={value} type="neutral" size="small" />
      ) : (
        <Text preset="valueSmall" color={valueColor || textColor}>
          {isPercentage ? `${value}%` : value}
        </Text>
      )}
    </Card>
  );
}

interface QuickStatsProps {
  /** Maior gasto do mês */
  biggestExpense: number;
  /** Média diária de gastos */
  dailyAverage: number;
  /** Porcentagem do orçamento usado */
  budgetUsed: number;
}

export function QuickStats({ biggestExpense, dailyAverage, budgetUsed }: QuickStatsProps) {
  const { theme } = useTheme();

  const getBudgetColor = () => {
    if (budgetUsed >= 100) return theme.colors.danger;
    if (budgetUsed >= 80) return theme.colors.warning;
    return theme.colors.success;
  };

  return (
    <View style={styles.container}>
      <StatItem
        Icon={ChartBarIcon}
        iconColor={theme.colors.primary}
        label="Maior gasto"
        value={biggestExpense}
        cardBg={theme.colors.card}
        labelColor={theme.colors.textSecondary}
        textColor={theme.colors.text}
      />
      <StatItem
        Icon={TrendingUpIcon}
        iconColor={'#3B82F6'}
        label="Média/dia"
        value={dailyAverage}
        cardBg={theme.colors.card}
        labelColor={theme.colors.textSecondary}
        textColor={theme.colors.text}
      />
      <StatItem
        Icon={TargetIcon}
        iconColor={getBudgetColor()}
        label="Orçamento"
        value={Math.round(budgetUsed)}
        valueColor={getBudgetColor()}
        isPercentage
        cardBg={theme.colors.card}
        labelColor={theme.colors.textSecondary}
        textColor={theme.colors.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    marginTop: spacing[4],
    gap: spacing[3],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  label: {
    marginBottom: spacing[1],
    textAlign: 'center',
  },
});
