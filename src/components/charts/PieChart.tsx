/**
 * Gráfico de Pizza - Design Premium
 * Visual limpo e profissional
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { Text } from '../ui/Text';
import { useTheme } from '../../contexts/ThemeContext';

interface PieChartData {
  id: string;
  label: string;
  value: number;
  color: string;
  icon?: string;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
  size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export function PieChart({ data, title = 'Gastos por Categoria', size = 140 }: PieChartProps) {
  const { theme } = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0 || total === 0) {
    return (
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <View style={styles.empty}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
            Sem dados
          </Text>
        </View>
      </View>
    );
  }

  let currentAngle = 0;
  const slices = data.map((item) => {
    const pct = (item.value / total) * 100;
    const angle = (pct / 100) * 360;
    const slice = { ...item, pct, start: currentAngle, end: currentAngle + angle };
    currentAngle += angle;
    return slice;
  });

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * 0.55;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>

      <View style={styles.row}>
        <View style={styles.chartWrap}>
          <Svg width={size} height={size}>
            <G>
              {slices.map((s) => {
                if (s.pct < 0.5) return null;
                const path = describeArc(cx, cy, outerR, s.start + 0.5, s.end - 0.5);
                return (
                  <Path
                    key={s.id}
                    d={path}
                    fill={s.color}
                    stroke={theme.colors.card}
                    strokeWidth={2}
                  />
                );
              })}
            </G>
            <Circle cx={cx} cy={cy} r={innerR} fill={theme.colors.card} />
            <SvgText
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              fill={theme.colors.textSecondary}
              fontSize={10}
            >
              Total
            </SvgText>
            <SvgText
              x={cx}
              y={cy + 12}
              textAnchor="middle"
              fill={theme.colors.text}
              fontSize={13}
              fontWeight="600"
            >
              R$ {(total / 1000).toFixed(1)}k
            </SvgText>
          </Svg>
        </View>

        <View style={styles.legend}>
          {slices.slice(0, 4).map((s) => (
            <View key={s.id} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: s.color }]} />
              <Text style={[styles.legendLabel, { color: theme.colors.text }]} numberOfLines={1}>
                {s.label}
              </Text>
              <Text style={[styles.legendPct, { color: theme.colors.textSecondary }]}>
                {s.pct.toFixed(0)}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// Versão simplificada com barras
export function PieChartSimple({ data, title = 'Gastos por Categoria' }: PieChartProps) {
  const { theme } = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 5);

  if (sorted.length === 0 || total === 0) {
    return (
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <View style={styles.empty}>
          <Text style={{ color: theme.colors.textSecondary }}>Sem dados</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>

      {sorted.map((item) => {
        const pct = (item.value / total) * 100;
        return (
          <View key={item.id} style={styles.barRow}>
            <View style={styles.barHeader}>
              <View style={styles.barLeft}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={[styles.barLabel, { color: theme.colors.text }]} numberOfLines={1}>
                  {item.label}
                </Text>
              </View>
              <Text style={[styles.barValue, { color: theme.colors.textSecondary }]}>
                R$ {item.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </Text>
            </View>
            <View style={[styles.barTrack, { backgroundColor: theme.colors.backgroundTertiary }]}>
              <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: item.color }]} />
            </View>
          </View>
        );
      })}

      <View style={[styles.totalRow, { borderTopColor: theme.colors.border }]}>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>Total</Text>
        <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '600' }}>
          R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartWrap: {
    alignItems: 'center',
  },
  legend: {
    flex: 1,
    marginLeft: 20,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
  },
  legendPct: {
    fontSize: 12,
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  barRow: {
    marginBottom: 14,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  barLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  barValue: {
    fontSize: 13,
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
