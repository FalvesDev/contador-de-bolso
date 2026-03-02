/**
 * Paleta de cores do Contador de Bolso
 * Design moderno e colorido estilo fintech
 */

export const colors = {
  // ═══════════════════════════════════════════════════════
  // CORES PRIMÁRIAS - Gradiente Principal do App
  // ═══════════════════════════════════════════════════════
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // COR PRINCIPAL - Indigo
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // ═══════════════════════════════════════════════════════
  // CORES SECUNDÁRIAS - Accent/Destaque
  // ═══════════════════════════════════════════════════════
  secondary: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4', // COR SECUNDÁRIA - Cyan
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },

  // ═══════════════════════════════════════════════════════
  // SEMÂNTICAS
  // ═══════════════════════════════════════════════════════
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // RECEITAS - Emerald
    600: '#059669',
    700: '#047857',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // ALERTAS - Amber
    600: '#D97706',
    700: '#B45309',
  },

  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // DESPESAS - Red
    600: '#DC2626',
    700: '#B91C1C',
  },

  // ═══════════════════════════════════════════════════════
  // NEUTRAS
  // ═══════════════════════════════════════════════════════
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // ═══════════════════════════════════════════════════════
  // BACKGROUNDS
  // ═══════════════════════════════════════════════════════
  background: {
    primary: '#F9FAFB',
    secondary: '#FFFFFF',
    tertiary: '#F3F4F6',
  },

  // ═══════════════════════════════════════════════════════
  // CORES DE CATEGORIA (vibrantes, para ícones e gráficos)
  // ═══════════════════════════════════════════════════════
  category: {
    food: '#F97316',        // Orange - Alimentação
    restaurant: '#EA580C',
    grocery: '#FB923C',
    delivery: '#FDBA74',

    transport: '#3B82F6',   // Blue - Transporte
    fuel: '#2563EB',
    uber: '#60A5FA',
    parking: '#93C5FD',

    home: '#8B5CF6',        // Violet - Moradia
    rent: '#7C3AED',
    utilities: '#A78BFA',
    internet: '#C4B5FD',

    health: '#EC4899',      // Pink - Saúde
    pharmacy: '#DB2777',
    doctor: '#F472B6',
    gym: '#F9A8D4',

    entertainment: '#F59E0B', // Amber - Lazer
    streaming: '#D97706',
    games: '#FBBF24',
    travel: '#FCD34D',

    shopping: '#14B8A6',    // Teal - Compras
    clothes: '#0D9488',
    electronics: '#2DD4BF',
    gifts: '#5EEAD4',

    education: '#6366F1',   // Indigo - Educação
    courses: '#4F46E5',
    books: '#818CF8',

    finance: '#10B981',     // Emerald - Finanças
    investment: '#059669',
    insurance: '#34D399',

    income: '#22C55E',      // Green - Receitas
    salary: '#16A34A',
    freelance: '#4ADE80',
    bonus: '#86EFAC',

    other: '#6B7280',       // Gray - Outros
  },

  // ═══════════════════════════════════════════════════════
  // GRADIENTES (para backgrounds e botões)
  // ═══════════════════════════════════════════════════════
  gradients: {
    primary: ['#6366F1', '#8B5CF6'] as const,     // Indigo → Violet
    secondary: ['#06B6D4', '#3B82F6'] as const,   // Cyan → Blue
    success: ['#10B981', '#059669'] as const,     // Emerald shades
    danger: ['#EF4444', '#DC2626'] as const,      // Red shades
    premium: ['#6366F1', '#EC4899'] as const,     // Indigo → Pink
    dark: ['#1F2937', '#111827'] as const,        // Gray shades
    sunset: ['#F97316', '#EC4899'] as const,      // Orange → Pink
  },

  // ═══════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type CategoryColor = keyof typeof colors.category;
