/**
 * Gráfico de Barras - Evolução Mensal
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  maxValue?: number;
}

export function BarChart({
  data,
  title = 'Evolução Mensal',
  maxValue,
}: BarChartProps) {
  const { theme } = useTheme();
  const max = maxValue || Math.max(...data.map(d => d.value), 1);

  return (
    <Card variant="elevated" style={{ ...styles.container, backgroundColor: theme.colors.card }}>
      <Text preset="label" color={theme.colors.textSecondary} style={styles.title}>
        {title}
      </Text>

      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const percentage = (item.value / max) * 100;
          const barColor = item.color || theme.colors.primary;

          return (
            <View key={index} style={styles.barWrapper}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max(percentage, 5)}%`,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>
              <Text preset="caption" color={theme.colors.textSecondary} style={styles.barLabel}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Escala lateral */}
      <View style={styles.scale}>
        <Text preset="caption" color={theme.colors.textTertiary}>
          R$ {max.toFixed(0)}
        </Text>
        <Text preset="caption" color={theme.colors.textTertiary}>
          R$ {(max / 2).toFixed(0)}
        </Text>
        <Text preset="caption" color={theme.colors.textTertiary}>
          R$ 0
        </Text>
      </View>
    </Card>
  );
}

// Versão horizontal (melhor para mobile)
export function HorizontalBarChart({
  data,
  title = 'Comparativo',
}: BarChartProps) {
  const { theme } = useTheme();
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <Card variant="elevated" style={{ ...styles.container, backgroundColor: theme.colors.card }}>
      <Text preset="label" color={theme.colors.textSecondary} style={styles.title}>
        {title}
      </Text>

      {data.map((item, index) => {
        const percentage = (item.value / max) * 100;
        const barColor = item.color || theme.colors.primary;

        return (
          <View key={index} style={styles.horizontalBarItem}>
            <View style={styles.horizontalBarHeader}>
              <Text preset="bodySmall" style={{ color: theme.colors.text }}>{item.label}</Text>
              <Text preset="caption" color={theme.colors.textSecondary}>
                R$ {item.value.toFixed(0)}
              </Text>
            </View>
            <View style={[styles.horizontalBarTrack, { backgroundColor: theme.colors.backgroundTertiary }]}>
              <View
                style={[
                  styles.horizontalBarFill,
                  {
                    width: `${Math.max(percentage, 3)}%`,
                    backgroundColor: barColor,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  title: {
    marginBottom: spacing[3],
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    paddingLeft: spacing[8],
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barContainer: {
    flex: 1,
    width: '70%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: borderRadius.sm,
    minHeight: 4,
  },
  barLabel: {
    marginTop: spacing[1],
    fontSize: 10,
  },
  scale: {
    position: 'absolute',
    left: spacing[4],
    top: spacing[10],
    bottom: spacing[6],
    justifyContent: 'space-between',
  },
  // Estilos para barras horizontais
  horizontalBarItem: {
    marginBottom: spacing[3],
  },
  horizontalBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[1],
  },
  horizontalBarTrack: {
    height: 12,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  horizontalBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
