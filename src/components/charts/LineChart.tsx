/**
 * Gráfico de Linha - Evolução do Saldo
 * Design moderno com área preenchida
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Text } from '../ui/Text';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing } from '../../constants/spacing';

interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartData[];
  title?: string;
  height?: number;
  showArea?: boolean;
  color?: string;
}

export function LineChart({
  data,
  title = 'Evolução do Saldo',
  height = 160,
  showArea = true,
  color,
}: LineChartProps) {
  const { theme } = useTheme();
  const lineColor = color || theme.colors.primary;

  if (data.length < 2) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <View style={styles.empty}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
            Dados insuficientes
          </Text>
        </View>
      </View>
    );
  }

  const chartWidth = 300;
  const chartHeight = height - 50;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 10;
  const paddingBottom = 30;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  // Adicionar margem para visualização
  const adjustedMin = minValue - range * 0.1;
  const adjustedMax = maxValue + range * 0.1;
  const adjustedRange = adjustedMax - adjustedMin;

  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * graphWidth;
  const getY = (value: number) => paddingTop + graphHeight - ((value - adjustedMin) / adjustedRange) * graphHeight;

  // Gerar path da linha
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.value) }));
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

  // Gerar path da área preenchida
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + graphHeight} L ${points[0].x} ${paddingTop + graphHeight} Z`;

  // Calcular linhas de grade
  const gridLines = 4;
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) =>
    adjustedMin + (adjustedRange / gridLines) * i
  );

  // Determinar cor baseado em tendência
  const trend = data[data.length - 1].value - data[0].value;
  const trendColor = trend >= 0 ? theme.colors.success : theme.colors.danger;
  const actualColor = color || trendColor;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <View style={styles.trendBadge}>
          <Text style={[styles.trendText, { color: trendColor }]}>
            {trend >= 0 ? '+' : ''}R$ {Math.abs(trend).toFixed(0)}
          </Text>
        </View>
      </View>

      <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        <Defs>
          <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={actualColor} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={actualColor} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {gridValues.map((value, i) => {
          const y = getY(value);
          return (
            <React.Fragment key={i}>
              <Line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke={theme.colors.border}
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <SvgText
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                fill={theme.colors.textTertiary}
                fontSize={9}
              >
                {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toFixed(0)}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Area fill */}
        {showArea && (
          <Path d={areaPath} fill="url(#areaGradient)" />
        )}

        {/* Line */}
        <Path
          d={linePath}
          fill="none"
          stroke={actualColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <React.Fragment key={i}>
            <Circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill={theme.colors.card}
              stroke={actualColor}
              strokeWidth={2}
            />
          </React.Fragment>
        ))}

        {/* Labels */}
        {data.map((d, i) => (
          <SvgText
            key={i}
            x={getX(i)}
            y={chartHeight - 8}
            textAnchor="middle"
            fill={theme.colors.textSecondary}
            fontSize={10}
          >
            {d.label}
          </SvgText>
        ))}
      </Svg>

      {/* Summary */}
      <View style={[styles.summary, { borderTopColor: theme.colors.border }]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Início</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
            R$ {data[0].value.toFixed(0)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Atual</Text>
          <Text style={[styles.summaryValue, { color: actualColor }]}>
            R$ {data[data.length - 1].value.toFixed(0)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Variação</Text>
          <Text style={[styles.summaryValue, { color: trendColor }]}>
            {((trend / Math.abs(data[0].value || 1)) * 100).toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

// Versão compacta para cards menores
export function MiniLineChart({
  data,
  height = 40,
  color,
}: {
  data: number[];
  height?: number;
  color?: string;
}) {
  const { theme } = useTheme();

  if (data.length < 2) return null;

  const width = 100;
  const padding = 4;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;

  const getX = (i: number) => padding + (i / (data.length - 1)) * graphWidth;
  const getY = (val: number) => padding + graphHeight - ((val - minValue) / range) * graphHeight;

  const points = data.map((v, i) => ({ x: getX(i), y: getY(v) }));
  const path = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

  const trend = data[data.length - 1] - data[0];
  const lineColor = color || (trend >= 0 ? theme.colors.success : theme.colors.danger);

  return (
    <Svg width={width} height={height}>
      <Path
        d={path}
        fill="none"
        stroke={lineColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={3}
        fill={lineColor}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
