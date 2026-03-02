/**
 * Componente Card com variantes
 */

import React from 'react';
import { View, ViewStyle, StyleSheet, Pressable, PressableProps } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius, shadows } from '../../constants/spacing';

interface CardProps {
  children: React.ReactNode;
  /** Variante visual */
  variant?: 'elevated' | 'outlined' | 'filled';
  /** Padding interno */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Border radius */
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  /** Cor de fundo customizada */
  backgroundColor?: string;
  /** Se é pressionável */
  onPress?: () => void;
  /** Estilo customizado */
  style?: ViewStyle;
}

export function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  rounded = 'xl',
  backgroundColor,
  onPress,
  style,
}: CardProps) {
  const paddingValue = {
    none: 0,
    sm: spacing[3],
    md: spacing[4],
    lg: spacing[6],
  }[padding];

  const radiusValue = borderRadius[rounded];

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: backgroundColor || colors.white,
          ...shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: backgroundColor || colors.white,
          borderWidth: 1,
          borderColor: colors.gray[200],
        };
      case 'filled':
        return {
          backgroundColor: backgroundColor || colors.gray[100],
        };
      default:
        return {};
    }
  };

  const cardStyle: ViewStyle = {
    padding: paddingValue,
    borderRadius: radiusValue,
    ...getVariantStyle(),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          style,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
}

// ═══════════════════════════════════════════════════════
// VARIANTES ESPECIALIZADAS
// ═══════════════════════════════════════════════════════

interface GradientCardProps extends Omit<CardProps, 'variant' | 'backgroundColor'> {
  /** Gradiente de cores */
  gradient?: readonly [string, string];
}

// Nota: Para gradiente real, usar expo-linear-gradient
// Por enquanto, usando cor sólida como fallback
export function GradientCard({
  children,
  gradient = colors.gradients.primary,
  padding = 'md',
  rounded = 'xl',
  style,
  ...props
}: GradientCardProps) {
  return (
    <Card
      variant="filled"
      backgroundColor={gradient[0]}
      padding={padding}
      rounded={rounded}
      style={style}
      {...props}
    >
      {children}
    </Card>
  );
}

export function StatCard({
  children,
  ...props
}: Omit<CardProps, 'variant' | 'padding'>) {
  return (
    <Card variant="elevated" padding="md" {...props}>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
