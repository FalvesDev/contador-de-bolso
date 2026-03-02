/**
 * Componente de texto com presets tipográficos
 */

import React from 'react';
import { Text as RNText, TextStyle, StyleSheet, TextProps as RNTextProps } from 'react-native';
import { colors } from '../../constants/colors';
import { typography, TextPreset } from '../../constants/typography';

interface TextProps extends RNTextProps {
  /** Preset tipográfico */
  preset?: TextPreset;
  /** Cor do texto */
  color?: string;
  /** Centralizar texto */
  center?: boolean;
  /** Texto em negrito */
  bold?: boolean;
  /** Texto em itálico */
  italic?: boolean;
  children: React.ReactNode;
}

export function Text({
  preset = 'body',
  color = colors.gray[800],
  center = false,
  bold = false,
  italic = false,
  style,
  children,
  ...props
}: TextProps) {
  const presetStyle = typography.presets[preset];

  const textStyle: TextStyle = {
    ...presetStyle,
    color,
    textAlign: center ? 'center' : 'left',
    fontWeight: bold ? '700' : presetStyle.fontWeight,
    fontStyle: italic ? 'italic' : 'normal',
  };

  return (
    <RNText style={[textStyle, style]} {...props}>
      {children}
    </RNText>
  );
}

// ═══════════════════════════════════════════════════════
// VARIANTES PRÉ-DEFINIDAS
// ═══════════════════════════════════════════════════════

export function Title({ children, ...props }: Omit<TextProps, 'preset'>) {
  return <Text preset="h2" {...props}>{children}</Text>;
}

export function Subtitle({ children, ...props }: Omit<TextProps, 'preset'>) {
  return <Text preset="h4" color={colors.gray[600]} {...props}>{children}</Text>;
}

export function Label({ children, ...props }: Omit<TextProps, 'preset'>) {
  return <Text preset="label" color={colors.gray[600]} {...props}>{children}</Text>;
}

export function Caption({ children, ...props }: Omit<TextProps, 'preset'>) {
  return <Text preset="caption" color={colors.gray[500]} {...props}>{children}</Text>;
}

export function MoneyText({
  value,
  type = 'neutral',
  size = 'medium',
  ...props
}: {
  value: number;
  type?: 'income' | 'expense' | 'neutral';
  size?: 'small' | 'medium' | 'large';
} & Omit<TextProps, 'children' | 'preset'>) {
  const getColor = () => {
    switch (type) {
      case 'income': return colors.success[500];
      case 'expense': return colors.danger[500];
      default: return colors.gray[800];
    }
  };

  const getPreset = (): TextPreset => {
    switch (size) {
      case 'small': return 'bodySmall';
      case 'large': return 'value';
      default: return 'valueSmall';
    }
  };

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.abs(value));

  const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : '';

  return (
    <Text preset={getPreset()} color={getColor()} {...props}>
      {prefix}{formattedValue}
    </Text>
  );
}
