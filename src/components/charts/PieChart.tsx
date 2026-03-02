/**
 * Gráfico de Pizza - Gastos por Categoria
 * Implementação com SVG puro (sem dependências extras)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';

interface PieChartData {
  id: string;
  label: string;
  value: number;
  color: string;
  icon: string;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
  size?: number;
}

export function PieChart({ data, title = 'Gastos por Categoria', size = 160 }: PieChartProps) {
  const { theme } = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calcular ângulos para cada fatia
  let currentAngle = 0;
  const slices = data.map(item => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const slice = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return slice;
  });

  // Função para converter ângulo em coordenadas
  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  // Gerar path para cada fatia
  const generateArcPath = (
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');
  };

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 10;

  return (
    <Card variant="elevated" style={{ ...styles.container, backgroundColor: theme.colors.card }}>
      <Text preset="label" color={theme.colors.textSecondary} style={styles.title}>
        {title}
      </Text>

      <View style={styles.chartContainer}>
        {/* SVG do gráfico */}
        <View style={[styles.chart, { width: size, height: size }]}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {slices.map((slice) => (
              <path
                key={slice.id}
                d={generateArcPath(cx, cy, radius, slice.startAngle, slice.endAngle)}
                fill={slice.color}
                stroke={theme.colors.card}
                strokeWidth={2}
              />
            ))}
            {/* Círculo central */}
            <circle cx={cx} cy={cy} r={radius * 0.5} fill={theme.colors.card} />
          </svg>

          {/* Valor total no centro */}
          <View style={styles.centerLabel}>
            <Text preset="caption" color={theme.colors.textSecondary}>
              Total
            </Text>
            <Text preset="label" color={theme.colors.text}>
              R$ {total.toFixed(0)}
            </Text>
          </View>
        </View>

        {/* Legenda */}
        <View style={styles.legend}>
          {slices.slice(0, 5).map(slice => (
            <View key={slice.id} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: slice.color }]} />
              <View style={styles.legendText}>
                <Text preset="caption" numberOfLines={1} style={{ color: theme.colors.text }}>
                  {slice.icon} {slice.label}
                </Text>
                <Text preset="caption" color={theme.colors.textSecondary}>
                  {slice.percentage.toFixed(0)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

// Versão simplificada para mobile (sem SVG)
export function PieChartSimple({ data, title = 'Gastos por Categoria' }: PieChartProps) {
  const { theme } = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <Card variant="elevated" style={{ ...styles.container, backgroundColor: theme.colors.card }}>
      <Text preset="label" color={theme.colors.textSecondary} style={styles.title}>
        {title}
      </Text>

      {sortedData.map((item) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;

        return (
          <View key={item.id} style={styles.barItem}>
            <View style={styles.barHeader}>
              <View style={styles.barLabel}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                <Text preset="bodySmall" numberOfLines={1} style={{ color: theme.colors.text }}>
                  {item.label}
                </Text>
              </View>
              <Text preset="caption" color={theme.colors.textSecondary}>
                R$ {item.value.toFixed(0)} ({percentage.toFixed(0)}%)
              </Text>
            </View>
            <View style={[styles.barTrack, { backgroundColor: theme.colors.backgroundTertiary }]}>
              <View
                style={[
                  styles.barFill,
                  { width: `${percentage}%`, backgroundColor: item.color },
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
    alignItems: 'center',
  },
  chart: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  legend: {
    flex: 1,
    marginLeft: spacing[4],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing[2],
  },
  legendText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Estilos para versão simplificada
  barItem: {
    marginBottom: spacing[3],
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  barLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
  },
  barTrack: {
    height: 8,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
