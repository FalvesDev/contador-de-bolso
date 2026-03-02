/**
 * Barra de Progresso - Orçamento
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';

interface ProgressBarProps {
  current: number;
  total: number;
  title?: string;
  showValues?: boolean;
  colorScheme?: 'auto' | 'primary' | 'success' | 'danger';
}

export function BudgetProgressBar({
  current,
  total,
  title = 'Orçamento do Mês',
  showValues = true,
  colorScheme = 'auto',
}: ProgressBarProps) {
  const { theme } = useTheme();
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  const remaining = Math.max(total - current, 0);

  const getColor = () => {
    if (colorScheme !== 'auto') {
      switch (colorScheme) {
        case 'primary': return theme.colors.primary;
        case 'success': return theme.colors.success;
        case 'danger': return theme.colors.danger;
      }
    }

    // Auto: verde → amarelo → vermelho
    if (percentage >= 100) return theme.colors.danger;
    if (percentage >= 80) return theme.colors.warning;
    if (percentage >= 60) return theme.colors.warningLight;
    return theme.colors.success;
  };

  const barColor = getColor();

  return (
    <Card variant="elevated" style={{ ...styles.container, backgroundColor: theme.colors.card }}>
      <View style={styles.header}>
        <Text preset="label" color={theme.colors.textSecondary}>
          {title}
        </Text>
        <Text preset="label" color={barColor}>
          {percentage.toFixed(0)}%
        </Text>
      </View>

      {/* Barra de progresso */}
      <View style={styles.trackContainer}>
        <View style={[styles.track, { backgroundColor: theme.colors.backgroundTertiary }]}>
          <View
            style={[
              styles.fill,
              { width: `${percentage}%`, backgroundColor: barColor },
            ]}
          />
        </View>
      </View>

      {/* Valores */}
      {showValues && (
        <View style={[styles.values, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <View style={styles.valueItem}>
            <Text preset="caption" color={theme.colors.textSecondary}>
              Gasto
            </Text>
            <Text preset="bodySmall" color={theme.colors.danger}>
              R$ {current.toFixed(2).replace('.', ',')}
            </Text>
          </View>
          <View style={[styles.valueDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.valueItem}>
            <Text preset="caption" color={theme.colors.textSecondary}>
              Resta
            </Text>
            <Text preset="bodySmall" color={theme.colors.success}>
              R$ {remaining.toFixed(2).replace('.', ',')}
            </Text>
          </View>
          <View style={[styles.valueDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.valueItem}>
            <Text preset="caption" color={theme.colors.textSecondary}>
              Total
            </Text>
            <Text preset="bodySmall" color={theme.colors.text}>
              R$ {total.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
}

// Versão compacta para cards menores
export function MiniProgress({
  current,
  total,
  label,
  color,
}: {
  current: number;
  total: number;
  label: string;
  color?: string;
}) {
  const { theme } = useTheme();
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  const barColor = color || theme.colors.primary;

  return (
    <View style={styles.miniContainer}>
      <View style={styles.miniHeader}>
        <Text preset="caption" color={theme.colors.textSecondary}>
          {label}
        </Text>
        <Text preset="caption" color={barColor}>
          {percentage.toFixed(0)}%
        </Text>
      </View>
      <View style={[styles.miniTrack, { backgroundColor: theme.colors.backgroundTertiary }]}>
        <View
          style={[
            styles.miniFill,
            { width: `${percentage}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  trackContainer: {
    marginBottom: spacing[3],
  },
  track: {
    height: 12,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  values: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: spacing[2],
  },
  valueItem: {
    flex: 1,
    alignItems: 'center',
  },
  valueDivider: {
    width: 1,
  },
  // Mini version
  miniContainer: {
    marginBottom: spacing[2],
  },
  miniHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[1],
  },
  miniTrack: {
    height: 6,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
