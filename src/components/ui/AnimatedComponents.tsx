/**
 * Componentes Animados Reutilizáveis
 * Botões, Cards e elementos com animações interativas
 */

import React, { useRef, useCallback } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  Platform,
} from 'react-native';
import { Text } from './Text';
import { useTheme } from '../../contexts/ThemeContext';

// ═══════════════════════════════════════════════════════
// ANIMATED PRESSABLE - Base para todos os elementos clicáveis
// ═══════════════════════════════════════════════════════

interface AnimatedPressableProps {
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
  scaleOnPress?: number;
  disabled?: boolean;
  children: React.ReactNode;
}

export function AnimatedPressable({
  onPress,
  onLongPress,
  style,
  scaleOnPress = 0.96,
  disabled = false,
  children,
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: scaleOnPress,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleOnPress]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          style,
          { transform: [{ scale }], opacity: disabled ? 0.5 : 1 },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// ═══════════════════════════════════════════════════════
// ANIMATED BUTTON - Botão com animação de pressão
// ═══════════════════════════════════════════════════════

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}: AnimatedButtonProps) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  // Animação de loading
  React.useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [loading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 5,
    }).start();
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.textTertiary;
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'danger': return '#EF4444';
      case 'success': return '#10B981';
      case 'outline': return 'transparent';
      default: return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return theme.colors.primary;
    return '#FFFFFF';
  };

  const getSizeStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          button: { paddingVertical: 8, paddingHorizontal: 16 },
          text: { fontSize: 13 },
        };
      case 'lg':
        return {
          button: { paddingVertical: 16, paddingHorizontal: 28 },
          text: { fontSize: 17 },
        };
      default:
        return {
          button: { paddingVertical: 12, paddingHorizontal: 20 },
          text: { fontSize: 15 },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      <Animated.View
        style={[
          styles.button,
          sizeStyles.button,
          {
            backgroundColor: getBackgroundColor(),
            borderWidth: variant === 'outline' ? 2 : 0,
            borderColor: theme.colors.primary,
            opacity: disabled ? 0.6 : 1,
            transform: [{ scale }],
          },
          fullWidth && { width: '100%' },
          style,
        ]}
      >
        {loading ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <View style={styles.loadingDot} />
          </Animated.View>
        ) : (
          <View style={styles.buttonContent}>
            {icon && <View style={styles.buttonIcon}>{icon}</View>}
            <Text
              style={[
                styles.buttonText,
                sizeStyles.text,
                { color: getTextColor() },
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// ═══════════════════════════════════════════════════════
// ANIMATED CARD - Card com animação de entrada e pressão
// ═══════════════════════════════════════════════════════

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  delay?: number;
  style?: ViewStyle;
  elevated?: boolean;
}

export function AnimatedCard({
  children,
  onPress,
  delay = 0,
  style,
  elevated = true,
}: AnimatedCardProps) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 80,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scale, {
        toValue: 0.98,
        useNativeDriver: true,
        speed: 50,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }).start();
    }
  };

  const content = (
    <Animated.View
      style={[
        styles.card,
        elevated && styles.cardElevated,
        { backgroundColor: theme.colors.card },
        {
          opacity,
          transform: [{ translateY }, { scale }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableWithoutFeedback
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {content}
      </TouchableWithoutFeedback>
    );
  }

  return content;
}

// ═══════════════════════════════════════════════════════
// ANIMATED FAB - Floating Action Button com animação
// ═══════════════════════════════════════════════════════

interface AnimatedFABProps {
  onPress: () => void;
  icon: React.ReactNode;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export function AnimatedFAB({
  onPress,
  icon,
  color,
  size = 56,
  style,
}: AnimatedFABProps) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 80,
      delay: 300,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.fab,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color || theme.colors.primary,
            transform: [
              { scale: Animated.multiply(scale, pressScale) },
            ],
          },
          style,
        ]}
      >
        {icon}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// ═══════════════════════════════════════════════════════
// ANIMATED BADGE - Badge com animação de bounce
// ═══════════════════════════════════════════════════════

interface AnimatedBadgeProps {
  count: number;
  color?: string;
  style?: ViewStyle;
}

export function AnimatedBadge({ count, color = '#EF4444', style }: AnimatedBadgeProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const prevCount = useRef(count);

  React.useEffect(() => {
    if (count > 0 && prevCount.current !== count) {
      // Animação de bounce quando o número muda
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.3,
          useNativeDriver: true,
          speed: 50,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 3,
        }),
      ]).start();
    } else if (count > 0 && prevCount.current === 0) {
      // Animação de entrada
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 100,
      }).start();
    } else if (count === 0) {
      // Animação de saída
      Animated.timing(scale, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
    prevCount.current = count;
  }, [count]);

  if (count === 0) return null;

  return (
    <Animated.View
      style={[
        styles.badge,
        { backgroundColor: color, transform: [{ scale }] },
        style,
      ]}
    >
      <Text style={styles.badgeText}>
        {count > 99 ? '99+' : count}
      </Text>
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════════════
// ANIMATED ICON BUTTON - Ícone clicável com animação
// ═══════════════════════════════════════════════════════

interface AnimatedIconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function AnimatedIconButton({
  onPress,
  icon,
  size = 44,
  backgroundColor,
  style,
}: AnimatedIconButtonProps) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.85,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.iconButton,
          {
            width: size,
            height: size,
            borderRadius: size * 0.35,
            backgroundColor: backgroundColor || theme.colors.backgroundSecondary,
            transform: [{ scale }],
          },
          style,
        ]}
      >
        {icon}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// ═══════════════════════════════════════════════════════
// ANIMATED SECTION - Seção com animação de entrada
// ═══════════════════════════════════════════════════════

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}

export function AnimatedSection({ children, delay = 0, style }: AnimatedSectionProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 60,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <Animated.View
      style={[
        { opacity, transform: [{ translateY }] },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: '600',
  },
  loadingDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  cardElevated: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
