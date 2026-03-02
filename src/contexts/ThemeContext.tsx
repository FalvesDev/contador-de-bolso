/**
 * Contexto de Tema - Permite trocar entre vários temas
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ═══════════════════════════════════════════════════════
// DEFINIÇÃO DOS TEMAS
// ═══════════════════════════════════════════════════════

export interface ThemeColors {
  // Primárias
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Secundárias
  secondary: string;
  secondaryLight: string;

  // Semânticas
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;

  // Backgrounds
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  card: string;

  // Texto
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // Bordas
  border: string;
  borderLight: string;

  // Gradientes
  gradientStart: string;
  gradientEnd: string;
}

export interface Theme {
  id: string;
  name: string;
  icon: string;
  isDark: boolean;
  colors: ThemeColors;
}

// ═══════════════════════════════════════════════════════
// TEMAS DISPONÍVEIS
// ═══════════════════════════════════════════════════════

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Roxo Moderno',
    icon: '💜',
    isDark: false,
    colors: {
      primary: '#6366F1',
      primaryLight: '#818CF8',
      primaryDark: '#4F46E5',
      secondary: '#06B6D4',
      secondaryLight: '#22D3EE',
      success: '#10B981',
      successLight: '#D1FAE5',
      warning: '#F59E0B',
      warningLight: '#FEF3C7',
      danger: '#EF4444',
      dangerLight: '#FEE2E2',
      background: '#F9FAFB',
      backgroundSecondary: '#FFFFFF',
      backgroundTertiary: '#F3F4F6',
      card: '#FFFFFF',
      text: '#111827',
      textSecondary: '#6B7280',
      textTertiary: '#9CA3AF',
      textInverse: '#FFFFFF',
      border: '#E5E7EB',
      borderLight: '#F3F4F6',
      gradientStart: '#6366F1',
      gradientEnd: '#8B5CF6',
    },
  },
  {
    id: 'ocean',
    name: 'Oceano',
    icon: '🌊',
    isDark: false,
    colors: {
      primary: '#0EA5E9',
      primaryLight: '#38BDF8',
      primaryDark: '#0284C7',
      secondary: '#14B8A6',
      secondaryLight: '#2DD4BF',
      success: '#22C55E',
      successLight: '#DCFCE7',
      warning: '#F59E0B',
      warningLight: '#FEF3C7',
      danger: '#EF4444',
      dangerLight: '#FEE2E2',
      background: '#F0F9FF',
      backgroundSecondary: '#FFFFFF',
      backgroundTertiary: '#E0F2FE',
      card: '#FFFFFF',
      text: '#0C4A6E',
      textSecondary: '#0369A1',
      textTertiary: '#7DD3FC',
      textInverse: '#FFFFFF',
      border: '#BAE6FD',
      borderLight: '#E0F2FE',
      gradientStart: '#0EA5E9',
      gradientEnd: '#06B6D4',
    },
  },
  {
    id: 'forest',
    name: 'Floresta',
    icon: '🌲',
    isDark: false,
    colors: {
      primary: '#059669',
      primaryLight: '#34D399',
      primaryDark: '#047857',
      secondary: '#84CC16',
      secondaryLight: '#BEF264',
      success: '#22C55E',
      successLight: '#DCFCE7',
      warning: '#EAB308',
      warningLight: '#FEF9C3',
      danger: '#DC2626',
      dangerLight: '#FEE2E2',
      background: '#F0FDF4',
      backgroundSecondary: '#FFFFFF',
      backgroundTertiary: '#DCFCE7',
      card: '#FFFFFF',
      text: '#14532D',
      textSecondary: '#166534',
      textTertiary: '#86EFAC',
      textInverse: '#FFFFFF',
      border: '#BBF7D0',
      borderLight: '#DCFCE7',
      gradientStart: '#059669',
      gradientEnd: '#10B981',
    },
  },
  {
    id: 'sunset',
    name: 'Pôr do Sol',
    icon: '🌅',
    isDark: false,
    colors: {
      primary: '#F97316',
      primaryLight: '#FB923C',
      primaryDark: '#EA580C',
      secondary: '#EC4899',
      secondaryLight: '#F472B6',
      success: '#22C55E',
      successLight: '#DCFCE7',
      warning: '#FBBF24',
      warningLight: '#FEF3C7',
      danger: '#EF4444',
      dangerLight: '#FEE2E2',
      background: '#FFFBEB',
      backgroundSecondary: '#FFFFFF',
      backgroundTertiary: '#FEF3C7',
      card: '#FFFFFF',
      text: '#78350F',
      textSecondary: '#92400E',
      textTertiary: '#FCD34D',
      textInverse: '#FFFFFF',
      border: '#FDE68A',
      borderLight: '#FEF3C7',
      gradientStart: '#F97316',
      gradientEnd: '#EC4899',
    },
  },
  {
    id: 'rose',
    name: 'Rosê',
    icon: '🌸',
    isDark: false,
    colors: {
      primary: '#EC4899',
      primaryLight: '#F472B6',
      primaryDark: '#DB2777',
      secondary: '#A855F7',
      secondaryLight: '#C084FC',
      success: '#22C55E',
      successLight: '#DCFCE7',
      warning: '#F59E0B',
      warningLight: '#FEF3C7',
      danger: '#EF4444',
      dangerLight: '#FEE2E2',
      background: '#FDF2F8',
      backgroundSecondary: '#FFFFFF',
      backgroundTertiary: '#FCE7F3',
      card: '#FFFFFF',
      text: '#831843',
      textSecondary: '#9D174D',
      textTertiary: '#F9A8D4',
      textInverse: '#FFFFFF',
      border: '#FBCFE8',
      borderLight: '#FCE7F3',
      gradientStart: '#EC4899',
      gradientEnd: '#A855F7',
    },
  },
  {
    id: 'dark',
    name: 'Escuro',
    icon: '🌙',
    isDark: true,
    colors: {
      primary: '#818CF8',
      primaryLight: '#A5B4FC',
      primaryDark: '#6366F1',
      secondary: '#22D3EE',
      secondaryLight: '#67E8F9',
      success: '#34D399',
      successLight: '#064E3B',
      warning: '#FBBF24',
      warningLight: '#78350F',
      danger: '#F87171',
      dangerLight: '#7F1D1D',
      background: '#111827',
      backgroundSecondary: '#1F2937',
      backgroundTertiary: '#374151',
      card: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      textTertiary: '#6B7280',
      textInverse: '#111827',
      border: '#374151',
      borderLight: '#4B5563',
      gradientStart: '#6366F1',
      gradientEnd: '#8B5CF6',
    },
  },
  {
    id: 'midnight',
    name: 'Meia-Noite',
    icon: '🌌',
    isDark: true,
    colors: {
      primary: '#3B82F6',
      primaryLight: '#60A5FA',
      primaryDark: '#2563EB',
      secondary: '#8B5CF6',
      secondaryLight: '#A78BFA',
      success: '#4ADE80',
      successLight: '#14532D',
      warning: '#FCD34D',
      warningLight: '#713F12',
      danger: '#FB7185',
      dangerLight: '#881337',
      background: '#0F172A',
      backgroundSecondary: '#1E293B',
      backgroundTertiary: '#334155',
      card: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#CBD5E1',
      textTertiary: '#64748B',
      textInverse: '#0F172A',
      border: '#334155',
      borderLight: '#475569',
      gradientStart: '#3B82F6',
      gradientEnd: '#8B5CF6',
    },
  },
  {
    id: 'amoled',
    name: 'AMOLED',
    icon: '⬛',
    isDark: true,
    colors: {
      primary: '#10B981',
      primaryLight: '#34D399',
      primaryDark: '#059669',
      secondary: '#06B6D4',
      secondaryLight: '#22D3EE',
      success: '#22C55E',
      successLight: '#052E16',
      warning: '#FBBF24',
      warningLight: '#422006',
      danger: '#EF4444',
      dangerLight: '#450A0A',
      background: '#000000',
      backgroundSecondary: '#0A0A0A',
      backgroundTertiary: '#171717',
      card: '#0A0A0A',
      text: '#FFFFFF',
      textSecondary: '#A3A3A3',
      textTertiary: '#525252',
      textInverse: '#000000',
      border: '#262626',
      borderLight: '#404040',
      gradientStart: '#10B981',
      gradientEnd: '#06B6D4',
    },
  },
  // ═══════════════════════════════════════════════════════
  // TEMAS TECNOLÓGICOS / FUTURISTAS
  // ═══════════════════════════════════════════════════════
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    icon: '🤖',
    isDark: true,
    colors: {
      primary: '#FF00FF',
      primaryLight: '#FF66FF',
      primaryDark: '#CC00CC',
      secondary: '#00FFFF',
      secondaryLight: '#66FFFF',
      success: '#00FF88',
      successLight: '#003322',
      warning: '#FFFF00',
      warningLight: '#333300',
      danger: '#FF0066',
      dangerLight: '#330019',
      background: '#0D0D1A',
      backgroundSecondary: '#1A1A2E',
      backgroundTertiary: '#2D2D44',
      card: '#1A1A2E',
      text: '#FFFFFF',
      textSecondary: '#E066FF',
      textTertiary: '#8844AA',
      textInverse: '#0D0D1A',
      border: '#FF00FF33',
      borderLight: '#FF00FF22',
      gradientStart: '#FF00FF',
      gradientEnd: '#00FFFF',
    },
  },
  {
    id: 'matrix',
    name: 'Matrix',
    icon: '💻',
    isDark: true,
    colors: {
      primary: '#00FF41',
      primaryLight: '#66FF85',
      primaryDark: '#00CC33',
      secondary: '#00FF41',
      secondaryLight: '#33FF66',
      success: '#00FF41',
      successLight: '#003311',
      warning: '#FFFF00',
      warningLight: '#333300',
      danger: '#FF3333',
      dangerLight: '#331111',
      background: '#000000',
      backgroundSecondary: '#0A0F0A',
      backgroundTertiary: '#0D1A0D',
      card: '#0A0F0A',
      text: '#00FF41',
      textSecondary: '#00BB33',
      textTertiary: '#007722',
      textInverse: '#000000',
      border: '#00FF4133',
      borderLight: '#00FF4122',
      gradientStart: '#00FF41',
      gradientEnd: '#00BB33',
    },
  },
  {
    id: 'neon',
    name: 'Neon City',
    icon: '🌃',
    isDark: true,
    colors: {
      primary: '#00D9FF',
      primaryLight: '#66E8FF',
      primaryDark: '#00AACC',
      secondary: '#FF6B9D',
      secondaryLight: '#FF99B8',
      success: '#00FF9F',
      successLight: '#003322',
      warning: '#FFE500',
      warningLight: '#333300',
      danger: '#FF4757',
      dangerLight: '#331116',
      background: '#0A0E17',
      backgroundSecondary: '#131B2E',
      backgroundTertiary: '#1E2A45',
      card: '#131B2E',
      text: '#FFFFFF',
      textSecondary: '#00D9FF',
      textTertiary: '#5F7A9D',
      textInverse: '#0A0E17',
      border: '#00D9FF33',
      borderLight: '#00D9FF22',
      gradientStart: '#00D9FF',
      gradientEnd: '#FF6B9D',
    },
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    icon: '🎸',
    isDark: true,
    colors: {
      primary: '#F72585',
      primaryLight: '#FF66A8',
      primaryDark: '#CC1E6D',
      secondary: '#7209B7',
      secondaryLight: '#9944CC',
      success: '#4CC9F0',
      successLight: '#1A3344',
      warning: '#FFC857',
      warningLight: '#332800',
      danger: '#FF4444',
      dangerLight: '#331111',
      background: '#10002B',
      backgroundSecondary: '#240046',
      backgroundTertiary: '#3C096C',
      card: '#240046',
      text: '#FFFFFF',
      textSecondary: '#F72585',
      textTertiary: '#7B2D8E',
      textInverse: '#10002B',
      border: '#F7258533',
      borderLight: '#F7258522',
      gradientStart: '#F72585',
      gradientEnd: '#7209B7',
    },
  },
  {
    id: 'tron',
    name: 'Tron',
    icon: '⚡',
    isDark: true,
    colors: {
      primary: '#00FFFF',
      primaryLight: '#66FFFF',
      primaryDark: '#00CCCC',
      secondary: '#FF6600',
      secondaryLight: '#FF9944',
      success: '#00FF00',
      successLight: '#003300',
      warning: '#FFFF00',
      warningLight: '#333300',
      danger: '#FF0000',
      dangerLight: '#330000',
      background: '#000A0F',
      backgroundSecondary: '#001520',
      backgroundTertiary: '#002233',
      card: '#001520',
      text: '#FFFFFF',
      textSecondary: '#00FFFF',
      textTertiary: '#006688',
      textInverse: '#000A0F',
      border: '#00FFFF44',
      borderLight: '#00FFFF22',
      gradientStart: '#00FFFF',
      gradientEnd: '#0088FF',
    },
  },
  {
    id: 'hacker',
    name: 'Hacker',
    icon: '🔓',
    isDark: true,
    colors: {
      primary: '#39FF14',
      primaryLight: '#6FFF4F',
      primaryDark: '#2ECC10',
      secondary: '#FF3131',
      secondaryLight: '#FF6666',
      success: '#39FF14',
      successLight: '#0F3300',
      warning: '#FFD700',
      warningLight: '#332B00',
      danger: '#FF3131',
      dangerLight: '#330A0A',
      background: '#0C0C0C',
      backgroundSecondary: '#121212',
      backgroundTertiary: '#1A1A1A',
      card: '#121212',
      text: '#39FF14',
      textSecondary: '#2ECC10',
      textTertiary: '#1A6608',
      textInverse: '#0C0C0C',
      border: '#39FF1433',
      borderLight: '#39FF1422',
      gradientStart: '#39FF14',
      gradientEnd: '#00FF88',
    },
  },
  {
    id: 'hologram',
    name: 'Holograma',
    icon: '✨',
    isDark: true,
    colors: {
      primary: '#00BFFF',
      primaryLight: '#66D9FF',
      primaryDark: '#0099CC',
      secondary: '#DA70D6',
      secondaryLight: '#E8A2E5',
      success: '#00FF7F',
      successLight: '#003319',
      warning: '#FFD700',
      warningLight: '#332B00',
      danger: '#FF6B6B',
      dangerLight: '#331515',
      background: '#0A0A1E',
      backgroundSecondary: '#12122E',
      backgroundTertiary: '#1E1E3E',
      card: '#12122E',
      text: '#E0E0FF',
      textSecondary: '#00BFFF',
      textTertiary: '#6B6BA0',
      textInverse: '#0A0A1E',
      border: '#00BFFF33',
      borderLight: '#00BFFF22',
      gradientStart: '#00BFFF',
      gradientEnd: '#DA70D6',
    },
  },
];

// ═══════════════════════════════════════════════════════
// CONTEXTO
// ═══════════════════════════════════════════════════════

interface ThemeContextType {
  theme: Theme;
  setThemeById: (id: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@contador_de_bolso_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  // Carregar tema salvo
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedThemeId = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedThemeId) {
        const theme = themes.find(t => t.id === savedThemeId);
        if (theme) {
          setCurrentTheme(theme);
        }
      } else if (systemColorScheme === 'dark') {
        // Usar tema escuro se o sistema estiver em modo escuro
        const darkTheme = themes.find(t => t.id === 'dark');
        if (darkTheme) {
          setCurrentTheme(darkTheme);
        }
      }
    } catch (error) {
      console.log('Erro ao carregar tema:', error);
    }
  };

  const setThemeById = async (id: string) => {
    const theme = themes.find(t => t.id === id);
    if (theme) {
      setCurrentTheme(theme);
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, id);
      } catch (error) {
        console.log('Erro ao salvar tema:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setThemeById, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}

// Hook para obter as cores do tema atual
export function useThemeColors() {
  const { theme } = useTheme();
  return theme.colors;
}
