/**
 * Componente Button com variantes
 */

import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius, shadows } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Texto do botão */
  title: string;
  /** Variante visual */
  variant?: ButtonVariant;
  /** Tamanho */
  size?: ButtonSize;
  /** Ocupar toda a largura */
  fullWidth?: boolean;
  /** Estado de carregamento */
  loading?: boolean;
  /** Ícone à esquerda (emoji por enquanto) */
  leftIcon?: string;
  /** Ícone à direita */
  rightIcon?: string;
  /** Desabilitado */
  disabled?: boolean;
  /** Estilo customizado */
  style?: ViewStyle;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[3],
      minHeight: 36,
    },
    md: {
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[4],
      minHeight: 44,
    },
    lg: {
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[6],
      minHeight: 52,
    },
  };

  const getVariantStyle = (pressed: boolean): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...sizeStyles[size],
    };

    const opacityStyle = pressed ? { opacity: 0.9 } : {};
    const disabledStyle = isDisabled ? { opacity: 0.5 } : {};

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.primary[500],
          ...shadows.primary,
          ...opacityStyle,
          ...disabledStyle,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary[500],
          ...opacityStyle,
          ...disabledStyle,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: colors.transparent,
          borderWidth: 2,
          borderColor: colors.primary[500],
          ...opacityStyle,
          ...disabledStyle,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: pressed ? colors.gray[100] : colors.transparent,
          ...disabledStyle,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: colors.danger[500],
          ...shadows.danger,
          ...opacityStyle,
          ...disabledStyle,
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: colors.success[500],
          ...shadows.success,
          ...opacityStyle,
          ...disabledStyle,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
      case 'success':
        return colors.white;
      case 'outline':
        return colors.primary[500];
      case 'ghost':
        return colors.gray[700];
      default:
        return colors.white;
    }
  };

  const textPreset = size === 'sm' ? 'buttonSmall' : 'button';
  const textColor = getTextColor();
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

  return (
    <Pressable
      style={({ pressed }) => [
        getVariantStyle(pressed),
        fullWidth && styles.fullWidth,
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {leftIcon && (
            <Text style={[styles.icon, { fontSize: iconSize }]}>{leftIcon}</Text>
          )}
          <Text
            preset={textPreset}
            color={textColor}
            style={[
              leftIcon && styles.textWithLeftIcon,
              rightIcon && styles.textWithRightIcon,
            ]}
          >
            {title}
          </Text>
          {rightIcon && (
            <Text style={[styles.icon, { fontSize: iconSize }]}>{rightIcon}</Text>
          )}
        </>
      )}
    </Pressable>
  );
}

// ═══════════════════════════════════════════════════════
// VARIANTES ESPECIALIZADAS
// ═══════════════════════════════════════════════════════

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  onPress,
  ...props
}: {
  icon: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
} & Omit<PressableProps, 'style'>) {
  const sizeMap = {
    sm: 36,
    md: 44,
    lg: 52,
  };

  const iconSizeMap = {
    sm: 18,
    md: 22,
    lg: 28,
  };

  const getBackgroundColor = (pressed: boolean): string => {
    switch (variant) {
      case 'primary':
        return colors.primary[pressed ? 600 : 500];
      case 'ghost':
        return pressed ? colors.gray[100] : colors.transparent;
      default:
        return colors.transparent;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: sizeMap[size],
        height: sizeMap[size],
        borderRadius: sizeMap[size] / 2,
        backgroundColor: getBackgroundColor(pressed),
        alignItems: 'center',
        justifyContent: 'center',
      })}
      {...props}
    >
      <Text style={{ fontSize: iconSizeMap[size] }}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  icon: {
    marginHorizontal: spacing[1],
  },
  textWithLeftIcon: {
    marginLeft: spacing[1],
  },
  textWithRightIcon: {
    marginRight: spacing[1],
  },
});
