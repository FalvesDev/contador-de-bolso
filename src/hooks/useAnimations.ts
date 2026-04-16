/**
 * Hook de Animações Reutilizáveis
 * Sistema completo de animações para o app
 */

import { useRef, useEffect, useCallback } from 'react';
import { Animated, Easing } from 'react-native';

// Configurações de timing
export const ANIMATION_CONFIG = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    entrance: 600,
  },
  easing: {
    smooth: Easing.bezier(0.25, 0.1, 0.25, 1),
    bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
    elastic: Easing.elastic(1),
    spring: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  },
};

/**
 * Hook para animação de fade in
 */
export function useFadeIn(delay: number = 0, duration: number = ANIMATION_CONFIG.duration.entrance) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        easing: ANIMATION_CONFIG.easing.smooth,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  return opacity;
}

/**
 * Hook para animação de slide + fade
 */
export function useSlideIn(
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  delay: number = 0,
  duration: number = ANIMATION_CONFIG.duration.entrance
) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(getInitialTranslate(direction))).current;

  function getInitialTranslate(dir: string): number {
    switch (dir) {
      case 'up': return 30;
      case 'down': return -30;
      case 'left': return 30;
      case 'right': return -30;
      default: return 30;
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          easing: ANIMATION_CONFIG.easing.smooth,
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: 0,
          duration,
          easing: ANIMATION_CONFIG.easing.spring,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  const transform = direction === 'up' || direction === 'down'
    ? [{ translateY: translate }]
    : [{ translateX: translate }];

  return { opacity, transform };
}

/**
 * Hook para animação de escala (press effect)
 */
export function useScalePress(scaleTo: number = 0.95) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: scaleTo,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleTo]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, []);

  return { scale, onPressIn, onPressOut };
}

/**
 * Hook para animação de pulse (loop)
 */
export function usePulse(minScale: number = 0.97, maxScale: number = 1.03) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: maxScale,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: minScale,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  return scale;
}

/**
 * Hook para animação de shake (erro/atenção)
 */
export function useShake() {
  const translateX = useRef(new Animated.Value(0)).current;

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(translateX, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, []);

  return { translateX, shake };
}

/**
 * Hook para animação de bounce
 */
export function useBounce() {
  const scale = useRef(new Animated.Value(1)).current;

  const bounce = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 150,
        easing: ANIMATION_CONFIG.easing.bounce,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
        tension: 100,
      }),
    ]).start();
  }, []);

  return { scale, bounce };
}

/**
 * Hook para animação de contador numérico
 */
export function useCountUp(
  targetValue: number,
  duration: number = 1000,
  startValue: number = 0
) {
  const animatedValue = useRef(new Animated.Value(startValue)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: targetValue,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // Necessário para interpolação de texto
    }).start();
  }, [targetValue]);

  return animatedValue;
}

/**
 * Hook para animação de progresso
 */
export function useProgress(
  targetProgress: number,
  duration: number = 800
) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: targetProgress,
      duration,
      easing: ANIMATION_CONFIG.easing.smooth,
      useNativeDriver: false,
    }).start();
  }, [targetProgress]);

  return progress;
}

/**
 * Hook para stagger de lista (animação em sequência)
 */
export function useStaggeredList(itemCount: number, staggerDelay: number = 100) {
  const animations = useRef(
    Array.from({ length: itemCount }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  useEffect(() => {
    const staggeredAnimations = animations.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: ANIMATION_CONFIG.duration.normal,
          delay: index * staggerDelay,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: ANIMATION_CONFIG.duration.normal,
          delay: index * staggerDelay,
          easing: ANIMATION_CONFIG.easing.spring,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(staggerDelay, staggeredAnimations).start();
  }, [itemCount]);

  return animations;
}

/**
 * Hook para animação de rotação (loading spinner)
 */
export function useRotation(duration: number = 1000) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();

    return () => spin.stop();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return rotate;
}

/**
 * Hook para animação de entrada com spring
 */
export function useSpringIn(delay: number = 0) {
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
          tension: 80,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  return { scale, opacity };
}
