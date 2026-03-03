/**
 * Componentes de Background com Gradiente
 * Identidade visual única do Contador de Bolso
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Path, G } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GradientHeaderProps {
  height?: number;
  children?: React.ReactNode;
}

// Header com gradiente e formas geométricas
export function GradientHeader({ height = 280, children }: GradientHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.headerContainer, { height }]}>
      <Svg
        width={SCREEN_WIDTH}
        height={height}
        style={styles.headerSvg}
      >
        <Defs>
          <LinearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.gradientStart} />
            <Stop offset="100%" stopColor={theme.colors.gradientEnd} />
          </LinearGradient>
        </Defs>

        {/* Background principal */}
        <Rect x="0" y="0" width={SCREEN_WIDTH} height={height} fill="url(#headerGrad)" />

        {/* Círculos decorativos sutis */}
        <Circle
          cx={SCREEN_WIDTH * 0.85}
          cy={height * 0.2}
          r={120}
          fill="rgba(255,255,255,0.08)"
        />
        <Circle
          cx={SCREEN_WIDTH * 0.1}
          cy={height * 0.7}
          r={80}
          fill="rgba(255,255,255,0.05)"
        />
        <Circle
          cx={SCREEN_WIDTH * 0.5}
          cy={height * 0.9}
          r={200}
          fill="rgba(255,255,255,0.03)"
        />

        {/* Linhas geométricas sutis */}
        <Path
          d={`M0 ${height * 0.6} Q ${SCREEN_WIDTH * 0.3} ${height * 0.5} ${SCREEN_WIDTH * 0.5} ${height * 0.65} T ${SCREEN_WIDTH} ${height * 0.55}`}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
          fill="none"
        />
        <Path
          d={`M0 ${height * 0.8} Q ${SCREEN_WIDTH * 0.4} ${height * 0.7} ${SCREEN_WIDTH * 0.6} ${height * 0.85} T ${SCREEN_WIDTH} ${height * 0.75}`}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
          fill="none"
        />

        {/* Curva inferior para transição suave */}
        <Path
          d={`M0 ${height - 40} Q ${SCREEN_WIDTH * 0.5} ${height + 20} ${SCREEN_WIDTH} ${height - 40} L ${SCREEN_WIDTH} ${height} L 0 ${height} Z`}
          fill={theme.colors.background}
        />
      </Svg>

      {/* Conteúdo sobre o gradiente */}
      <View style={styles.headerContent}>
        {children}
      </View>
    </View>
  );
}

// Card com efeito glassmorphism
interface GlassCardProps {
  children: React.ReactNode;
  style?: any;
  intensity?: 'light' | 'medium' | 'strong';
}

export function GlassCard({ children, style, intensity = 'medium' }: GlassCardProps) {
  const { theme } = useTheme();

  const opacityMap = {
    light: 0.1,
    medium: 0.15,
    strong: 0.25,
  };

  const borderOpacity = {
    light: 0.1,
    medium: 0.2,
    strong: 0.3,
  };

  return (
    <View
      style={[
        styles.glassCard,
        {
          backgroundColor: theme.isDark
            ? `rgba(255,255,255,${opacityMap[intensity]})`
            : `rgba(255,255,255,${opacityMap[intensity] + 0.6})`,
          borderColor: `rgba(255,255,255,${borderOpacity[intensity]})`,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// Decoração de ondas para seções
interface WaveDecoratorProps {
  position: 'top' | 'bottom';
  color?: string;
  height?: number;
}

export function WaveDecorator({ position, color, height = 60 }: WaveDecoratorProps) {
  const { theme } = useTheme();
  const fillColor = color || theme.colors.background;

  const pathD = position === 'top'
    ? `M0 ${height} Q ${SCREEN_WIDTH * 0.25} 0 ${SCREEN_WIDTH * 0.5} ${height * 0.5} T ${SCREEN_WIDTH} ${height} L ${SCREEN_WIDTH} ${height} L 0 ${height} Z`
    : `M0 0 Q ${SCREEN_WIDTH * 0.25} ${height} ${SCREEN_WIDTH * 0.5} ${height * 0.5} T ${SCREEN_WIDTH} 0 L ${SCREEN_WIDTH} 0 L 0 0 Z`;

  return (
    <Svg width={SCREEN_WIDTH} height={height} style={position === 'top' ? styles.waveTop : styles.waveBottom}>
      <Path d={pathD} fill={fillColor} />
    </Svg>
  );
}

// Padrão de pontos decorativo
interface DotPatternProps {
  width?: number;
  height?: number;
  color?: string;
  spacing?: number;
}

export function DotPattern({ width = 100, height = 100, color, spacing = 20 }: DotPatternProps) {
  const { theme } = useTheme();
  const dotColor = color || theme.colors.primary + '15';

  const dots = [];
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      dots.push(
        <Circle key={`${x}-${y}`} cx={x + 3} cy={y + 3} r={2} fill={dotColor} />
      );
    }
  }

  return (
    <Svg width={width} height={height} style={styles.dotPattern}>
      {dots}
    </Svg>
  );
}

// Ícone de moeda animado (estático por enquanto)
export function CoinIcon({ size = 60, color }: { size?: number; color?: string }) {
  const { theme } = useTheme();
  const coinColor = color || theme.colors.warning;

  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Defs>
        <LinearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={coinColor} />
          <Stop offset="100%" stopColor={theme.colors.primary} />
        </LinearGradient>
      </Defs>
      <Circle cx="30" cy="30" r="28" fill="url(#coinGrad)" />
      <Circle cx="30" cy="30" r="22" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
      <Path
        d="M30 15 L30 45 M24 20 L36 20 M24 40 L36 40 M27 25 C27 25 36 25 36 30 C36 35 27 35 27 35 M27 35 C27 35 36 35 36 40"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
  },
  headerSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerContent: {
    flex: 1,
    zIndex: 1,
  },
  glassCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    // Shadow para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Elevation para Android
    elevation: 4,
  },
  waveTop: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  waveBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  dotPattern: {
    position: 'absolute',
    opacity: 0.5,
  },
});
