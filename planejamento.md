# Contador de Bolso - Planejamento Completo

> App de finanças pessoais com UX/UI moderna, entrada por voz e dashboard inteligente

---

## Sumário

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Decisões Técnicas](#decisões-técnicas)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Design System & UI/UX](#design-system--uiux)
5. [Schema do Banco de Dados](#schema-do-banco-de-dados)
6. [Funcionalidades Detalhadas](#funcionalidades-detalhadas)
7. [Estrutura de Arquivos](#estrutura-de-arquivos)
8. [Roadmap de Implementação](#roadmap-de-implementação)
9. [Configurações e Integrações](#configurações-e-integrações)

---

## Visão Geral do Projeto

### Objetivo
Criar um aplicativo de controle financeiro pessoal que seja:
- **Intuitivo**: Qualquer pessoa consegue usar sem tutorial
- **Bonito**: Visual moderno de fintech com animações fluidas
- **Inteligente**: Entrada por voz, sugestões automáticas
- **Completo**: Dashboard rico, relatórios, categorização detalhada

### Público-Alvo
- Pessoas que querem controlar gastos pessoais
- Usuários que preferem anotar gastos rapidamente (voz/manual)
- Quem busca visualizar padrões de consumo

### Diferenciais
1. **Entrada por voz**: Diga "gastei 50 reais no mercado" e o app registra
2. **Dashboard visual**: Gráficos animados e cards informativos
3. **25+ categorias**: Organização detalhada dos gastos
4. **Sugestões inteligentes**: Alertas e dicas de economia
5. **Design premium**: Visual de app de banco digital

---

## Decisões Técnicas

### Stack Escolhida

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| **Framework** | React Native + Expo SDK 52 | Desenvolvimento multiplataforma, OTA updates, builds simplificados |
| **Linguagem** | TypeScript | Tipagem forte, menos bugs, melhor DX |
| **Backend** | Supabase | PostgreSQL + Auth + Realtime + Storage em um só lugar |
| **State** | Zustand | Leve, simples, sem boilerplate |
| **Navegação** | Expo Router | File-based routing, deep linking nativo |
| **Animações** | React Native Reanimated 3 | 60fps no UI thread |
| **Gráficos** | React Native Skia + Victory Native | Gráficos customizáveis e performáticos |
| **Forms** | React Hook Form + Zod | Formulários performáticos com validação |
| **Ícones** | Phosphor Icons | 6000+ ícones, design consistente |
| **Data** | date-fns | Manipulação de datas imutável |

### Versões Mínimas
- React Native: 0.76+
- Expo SDK: 52
- iOS: 14+
- Android: API 24+ (Android 7.0)

### Plataformas Suportadas
```
┌─────────────────────────────────────────────────────┐
│              UM CÓDIGO → 3 PLATAFORMAS              │
├─────────────────────────────────────────────────────┤
│  📱 iOS         → App Store                         │
│  📱 Android     → Google Play                       │
│  🖥️  Web (PWA)   → Vercel (contadordebolso.app)     │
└─────────────────────────────────────────────────────┘
```

### Deploy
| Plataforma | Serviço | URL |
|------------|---------|-----|
| Web | **Vercel** | contadordebolso.vercel.app |
| iOS | App Store | (futuro) |
| Android | Google Play | (futuro) |

### PWA (Progressive Web App)
- Instalável no celular via navegador
- Funciona offline (cache local)
- Ícone na home screen
- Push notifications (web)

---

## Arquitetura do Sistema

### Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                    (React Native/Expo)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Screens │  │Components│  │ Stores  │  │Services │        │
│  │ (Expo   │  │ (UI +   │  │(Zustand)│  │ (APIs)  │        │
│  │ Router) │  │ Charts) │  │         │  │         │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
│       └────────────┴────────────┴────────────┘              │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │ HTTPS/WSS
┌──────────────────────────┼───────────────────────────────────┐
│                     SUPABASE                                  │
├──────────────────────────┼───────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │  Auth   │  │PostgreSQL│  │Realtime │  │ Storage │         │
│  │(JWT/OAuth)│ │(Database)│  │  (WS)   │  │ (Files) │         │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘         │
└─────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                   SERVIÇOS EXTERNOS                           │
├──────────────────────────┼───────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ Speech API  │  │  OpenAI/    │  │ Open Banking│           │
│  │ (Google/    │  │  Claude API │  │ (Futuro)    │           │
│  │  Apple)     │  │  (NLP)      │  │             │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

```
Usuário → Ação (tap/voz) → Component → Store (Zustand) → Service → Supabase
                                ↑                              ↓
                                └──────── Realtime Update ←────┘
```

### Estrutura de Pastas Detalhada

```
src/
├── app/                          # Telas (Expo Router - file-based)
│   ├── _layout.tsx              # Layout raiz (providers, fonts, splash)
│   ├── index.tsx                # Redirect inicial
│   │
│   ├── (auth)/                  # Grupo de autenticação (não logado)
│   │   ├── _layout.tsx          # Layout auth (sem tabs)
│   │   ├── welcome.tsx          # Tela de boas-vindas/onboarding
│   │   ├── login.tsx            # Login
│   │   ├── register.tsx         # Cadastro
│   │   └── forgot-password.tsx  # Recuperar senha
│   │
│   ├── (tabs)/                  # Tab navigator principal (logado)
│   │   ├── _layout.tsx          # Layout com tabs
│   │   ├── index.tsx            # Dashboard (tab home)
│   │   ├── transactions.tsx     # Lista de transações
│   │   ├── add.tsx              # Adicionar transação
│   │   ├── reports.tsx          # Relatórios e análises
│   │   └── profile.tsx          # Perfil e configurações
│   │
│   ├── transaction/             # Rotas de transação
│   │   ├── [id].tsx             # Detalhes/edição de transação
│   │   └── voice.tsx            # Tela de gravação por voz
│   │
│   ├── category/                # Rotas de categoria
│   │   ├── index.tsx            # Lista de categorias
│   │   └── [id].tsx             # Editar categoria
│   │
│   └── budget/                  # Rotas de orçamento
│       ├── index.tsx            # Lista de orçamentos
│       └── [id].tsx             # Editar orçamento
│
├── components/
│   ├── ui/                      # Componentes base reutilizáveis
│   │   ├── Button.tsx           # Botão com variantes
│   │   ├── Card.tsx             # Card container
│   │   ├── Input.tsx            # Input de texto
│   │   ├── MoneyInput.tsx       # Input de valor monetário
│   │   ├── DatePicker.tsx       # Seletor de data
│   │   ├── Select.tsx           # Dropdown/Select
│   │   ├── Modal.tsx            # Modal/Bottom sheet
│   │   ├── Avatar.tsx           # Avatar de usuário
│   │   ├── Badge.tsx            # Badge/Tag
│   │   ├── Skeleton.tsx         # Loading skeleton
│   │   ├── EmptyState.tsx       # Estado vazio
│   │   └── index.ts             # Barrel export
│   │
│   ├── charts/                  # Componentes de gráficos
│   │   ├── PieChart.tsx         # Gráfico de pizza (categorias)
│   │   ├── BarChart.tsx         # Gráfico de barras (mensal)
│   │   ├── LineChart.tsx        # Gráfico de linha (tendência)
│   │   ├── ProgressBar.tsx      # Barra de progresso
│   │   └── index.ts
│   │
│   ├── dashboard/               # Componentes do dashboard
│   │   ├── BalanceCard.tsx      # Card de saldo principal
│   │   ├── QuickStats.tsx       # Estatísticas rápidas
│   │   ├── SpendingChart.tsx    # Gráfico de gastos
│   │   ├── RecentTransactions.tsx # Últimas transações
│   │   ├── BudgetProgress.tsx   # Progresso do orçamento
│   │   └── index.ts
│   │
│   ├── transaction/             # Componentes de transação
│   │   ├── TransactionItem.tsx  # Item de lista
│   │   ├── TransactionList.tsx  # Lista agrupada por data
│   │   ├── TransactionForm.tsx  # Formulário completo
│   │   ├── CategoryPicker.tsx   # Seletor de categoria
│   │   ├── TypeToggle.tsx       # Toggle receita/despesa
│   │   └── index.ts
│   │
│   ├── voice/                   # Componentes de voz
│   │   ├── VoiceFAB.tsx         # Floating action button
│   │   ├── VoiceRecorder.tsx    # Gravador de áudio
│   │   ├── VoiceWaveform.tsx    # Visualização de onda
│   │   ├── VoiceConfirmation.tsx # Confirmação do parsing
│   │   └── index.ts
│   │
│   └── layout/                  # Componentes de layout
│       ├── Header.tsx           # Header customizado
│       ├── SafeArea.tsx         # Safe area wrapper
│       └── index.ts
│
├── hooks/                       # Custom hooks
│   ├── useAuth.ts               # Hook de autenticação
│   ├── useTransactions.ts       # Hook de transações
│   ├── useCategories.ts         # Hook de categorias
│   ├── useBudgets.ts            # Hook de orçamentos
│   ├── useVoice.ts              # Hook de gravação de voz
│   ├── useTheme.ts              # Hook de tema
│   └── useKeyboard.ts           # Hook de teclado
│
├── services/                    # Serviços e APIs
│   ├── supabase.ts              # Cliente Supabase
│   ├── auth.ts                  # Serviço de autenticação
│   ├── transactions.ts          # API de transações
│   ├── categories.ts            # API de categorias
│   ├── budgets.ts               # API de orçamentos
│   ├── speech.ts                # Speech-to-text
│   ├── ai.ts                    # Processamento NLP
│   └── notifications.ts         # Push notifications
│
├── stores/                      # Zustand stores
│   ├── authStore.ts             # Estado de autenticação
│   ├── transactionStore.ts      # Estado de transações
│   ├── categoryStore.ts         # Estado de categorias
│   ├── budgetStore.ts           # Estado de orçamentos
│   ├── uiStore.ts               # Estado de UI (modals, loading)
│   └── index.ts
│
├── types/                       # TypeScript types
│   ├── auth.ts                  # Types de autenticação
│   ├── transaction.ts           # Types de transação
│   ├── category.ts              # Types de categoria
│   ├── budget.ts                # Types de orçamento
│   ├── supabase.ts              # Types gerados do Supabase
│   └── index.ts
│
├── constants/                   # Constantes
│   ├── colors.ts                # Paleta de cores
│   ├── categories.ts            # Categorias padrão
│   ├── spacing.ts               # Espaçamentos
│   ├── typography.ts            # Tipografia
│   └── index.ts
│
├── utils/                       # Funções utilitárias
│   ├── format.ts                # Formatação (moeda, data)
│   ├── validation.ts            # Schemas Zod
│   ├── calculations.ts          # Cálculos financeiros
│   ├── grouping.ts              # Agrupamento de dados
│   └── index.ts
│
└── styles/                      # Estilos globais
    ├── theme.ts                 # Tema completo
    └── globals.ts               # Estilos globais
```

---

## Design System & UI/UX

### Paleta de Cores

```typescript
export const colors = {
  // ═══════════════════════════════════════════════════════
  // CORES PRIMÁRIAS - Gradiente Principal do App
  // ═══════════════════════════════════════════════════════
  primary: {
    50:  '#EEF2FF',  // Background suave
    100: '#E0E7FF',  // Hover states
    200: '#C7D2FE',  // Disabled
    300: '#A5B4FC',  // Borders
    400: '#818CF8',  // Icons secundários
    500: '#6366F1',  // COR PRINCIPAL - Indigo
    600: '#4F46E5',  // Hover da principal
    700: '#4338CA',  // Pressed state
    800: '#3730A3',  // Texto em fundo claro
    900: '#312E81',  // Headings
  },

  // ═══════════════════════════════════════════════════════
  // CORES SECUNDÁRIAS - Accent/Destaque
  // ═══════════════════════════════════════════════════════
  secondary: {
    50:  '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',  // COR SECUNDÁRIA - Cyan
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },

  // ═══════════════════════════════════════════════════════
  // SEMÂNTICAS
  // ═══════════════════════════════════════════════════════
  success: {
    50:  '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',  // RECEITAS - Emerald
    600: '#059669',
    700: '#047857',
  },

  warning: {
    50:  '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',  // ALERTAS - Amber
    600: '#D97706',
    700: '#B45309',
  },

  danger: {
    50:  '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',  // DESPESAS - Red
    600: '#DC2626',
    700: '#B91C1C',
  },

  // ═══════════════════════════════════════════════════════
  // NEUTRAS
  // ═══════════════════════════════════════════════════════
  gray: {
    50:  '#F9FAFB',  // Background principal
    100: '#F3F4F6',  // Background cards
    200: '#E5E7EB',  // Borders
    300: '#D1D5DB',  // Disabled text
    400: '#9CA3AF',  // Placeholder
    500: '#6B7280',  // Texto secundário
    600: '#4B5563',  // Texto normal
    700: '#374151',  // Texto emphasis
    800: '#1F2937',  // Texto principal
    900: '#111827',  // Headings
  },

  // ═══════════════════════════════════════════════════════
  // CORES DE CATEGORIA (vibrantes, para ícones e gráficos)
  // ═══════════════════════════════════════════════════════
  category: {
    food:          '#F97316', // Orange 500
    restaurant:    '#EA580C', // Orange 600
    grocery:       '#FB923C', // Orange 400
    delivery:      '#FDBA74', // Orange 300

    transport:     '#3B82F6', // Blue 500
    fuel:          '#2563EB', // Blue 600
    uber:          '#60A5FA', // Blue 400
    parking:       '#93C5FD', // Blue 300

    home:          '#8B5CF6', // Violet 500
    rent:          '#7C3AED', // Violet 600
    utilities:     '#A78BFA', // Violet 400
    internet:      '#C4B5FD', // Violet 300

    health:        '#EC4899', // Pink 500
    pharmacy:      '#DB2777', // Pink 600
    doctor:        '#F472B6', // Pink 400
    gym:           '#F9A8D4', // Pink 300

    entertainment: '#F59E0B', // Amber 500
    streaming:     '#D97706', // Amber 600
    games:         '#FBBF24', // Amber 400
    travel:        '#FCD34D', // Amber 300

    shopping:      '#14B8A6', // Teal 500
    clothes:       '#0D9488', // Teal 600
    electronics:   '#2DD4BF', // Teal 400
    gifts:         '#5EEAD4', // Teal 300

    education:     '#6366F1', // Indigo 500
    courses:       '#4F46E5', // Indigo 600
    books:         '#818CF8', // Indigo 400

    finance:       '#10B981', // Emerald 500
    investment:    '#059669', // Emerald 600
    insurance:     '#34D399', // Emerald 400

    income:        '#22C55E', // Green 500 (salário, freelance)
    salary:        '#16A34A', // Green 600
    freelance:     '#4ADE80', // Green 400
    bonus:         '#86EFAC', // Green 300

    other:         '#6B7280', // Gray 500
  },

  // ═══════════════════════════════════════════════════════
  // GRADIENTES (para backgrounds e botões)
  // ═══════════════════════════════════════════════════════
  gradients: {
    primary:    ['#6366F1', '#8B5CF6'],  // Indigo → Violet
    secondary:  ['#06B6D4', '#3B82F6'],  // Cyan → Blue
    success:    ['#10B981', '#059669'],  // Emerald shades
    danger:     ['#EF4444', '#DC2626'],  // Red shades
    premium:    ['#6366F1', '#EC4899'],  // Indigo → Pink
    dark:       ['#1F2937', '#111827'],  // Gray shades
  },
};
```

### Tipografia

```typescript
export const typography = {
  // Font family (usando fonte do sistema para performance)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  // Ou usando Inter (mais bonita, precisa carregar)
  // fontFamily: {
  //   regular: 'Inter_400Regular',
  //   medium: 'Inter_500Medium',
  //   semibold: 'Inter_600SemiBold',
  //   bold: 'Inter_700Bold',
  // },

  fontSize: {
    xs:   12,
    sm:   14,
    base: 16,
    lg:   18,
    xl:   20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  lineHeight: {
    tight:  1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Presets prontos para uso
  presets: {
    // Headings
    h1: { fontSize: 36, fontWeight: '700', lineHeight: 1.25 },
    h2: { fontSize: 30, fontWeight: '700', lineHeight: 1.25 },
    h3: { fontSize: 24, fontWeight: '600', lineHeight: 1.25 },
    h4: { fontSize: 20, fontWeight: '600', lineHeight: 1.25 },

    // Body
    body: { fontSize: 16, fontWeight: '400', lineHeight: 1.5 },
    bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 1.5 },

    // Labels
    label: { fontSize: 14, fontWeight: '500', lineHeight: 1.25 },
    labelSmall: { fontSize: 12, fontWeight: '500', lineHeight: 1.25 },

    // Values (para números/valores monetários)
    value: { fontSize: 32, fontWeight: '700', lineHeight: 1.25 },
    valueSmall: { fontSize: 24, fontWeight: '600', lineHeight: 1.25 },

    // Caption
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 1.5 },
  },
};
```

### Sistema de Temas

O app possui um sistema completo de temas com **15 opções** organizadas em 3 categorias:

#### Temas Claros
| ID | Nome | Ícone | Cor Principal |
|----|------|-------|---------------|
| `default` | Roxo Moderno | 💜 | `#6366F1` |
| `ocean` | Oceano | 🌊 | `#0EA5E9` |
| `forest` | Floresta | 🌲 | `#059669` |
| `sunset` | Pôr do Sol | 🌅 | `#F97316` |
| `rose` | Rosê | 🌸 | `#EC4899` |

#### Temas Escuros
| ID | Nome | Ícone | Cor Principal |
|----|------|-------|---------------|
| `dark` | Escuro | 🌙 | `#818CF8` |
| `midnight` | Meia-Noite | 🌌 | `#3B82F6` |
| `amoled` | AMOLED | ⬛ | `#10B981` |

#### Temas Futuristas/Tech
| ID | Nome | Ícone | Cor Principal | Estilo |
|----|------|-------|---------------|--------|
| `cyberpunk` | Cyberpunk | 🤖 | `#FF00FF` | Neon rosa/magenta |
| `matrix` | Matrix | 💻 | `#00FF41` | Verde código |
| `neon` | Neon City | 🌃 | `#00D9FF` | Cyan neon |
| `synthwave` | Synthwave | 🎸 | `#F72585` | Rosa retro-futurista |
| `tron` | Tron | ⚡ | `#00FFFF` | Azul elétrico |
| `hacker` | Hacker | 🔓 | `#39FF14` | Verde terminal |
| `hologram` | Holograma | ✨ | `#00BFFF` | Azul holográfico |

#### Arquitetura do Sistema de Temas
```typescript
// src/contexts/ThemeContext.tsx
interface ThemeColors {
  primary: string;      // Cor principal do app
  primaryLight: string; // Variação clara
  primaryDark: string;  // Variação escura

  success: string;      // Receitas (verde)
  danger: string;       // Despesas (vermelho)
  warning: string;      // Alertas (amarelo)

  background: string;   // Fundo principal
  card: string;         // Fundo de cards
  text: string;         // Texto principal
  textSecondary: string;// Texto secundário
  border: string;       // Bordas
}

// Hooks disponíveis:
useTheme()        // Acesso ao tema atual e função setThemeById
useThemeColors()  // Atalho para acessar só as cores
```

O tema é salvo automaticamente via `AsyncStorage` e restaurado ao abrir o app.

### Espaçamento

```typescript
export const spacing = {
  0:   0,
  0.5: 2,
  1:   4,
  1.5: 6,
  2:   8,
  2.5: 10,
  3:   12,
  3.5: 14,
  4:   16,
  5:   20,
  6:   24,
  7:   28,
  8:   32,
  9:   36,
  10:  40,
  11:  44,
  12:  48,
  14:  56,
  16:  64,
  20:  80,
  24:  96,
};

export const borderRadius = {
  none: 0,
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
};
```

### Wireframes das Telas Principais

#### 1. Dashboard (Home)
```
┌─────────────────────────────────────┐
│  ☰  Contador de Bolso    🔔  👤    │ ← Header
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │     Saldo do Mês              │  │
│  │   ┌─────────────────────┐     │  │
│  │   │   R$ 2.450,00       │     │  │ ← Card Principal
│  │   │   ↑ +R$ 5.000  ↓ -R$ 2.550│  │    (Gradiente)
│  │   └─────────────────────┘     │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  │Receitas │ │Despesas │ │Orçam. │ │ ← Quick Stats
│  │R$5.000  │ │R$2.550  │ │ 51%   │ │
│  └─────────┘ └─────────┘ └───────┘ │
│                                     │
│  Gastos por Categoria               │
│  ┌───────────────────────────────┐  │
│  │     🥧 GRÁFICO DE PIZZA       │  │ ← Animated Chart
│  │        (Categorias)           │  │
│  └───────────────────────────────┘  │
│                                     │
│  Últimas Transações                 │
│  ┌───────────────────────────────┐  │
│  │ 🍔 iFood          -R$ 45,00   │  │
│  │ ⛽ Posto Shell    -R$ 200,00  │  │ ← Transaction List
│  │ 💰 Salário       +R$ 5.000,00 │  │
│  └───────────────────────────────┘  │
│         [Ver todas →]               │
│                                     │
├─────────────────────────────────────┤
│  🏠    📋    ➕    📊    👤        │ ← Tab Bar
│  Home  Trans  Add  Report Profile   │
└─────────────────────────────────────┘
        │
        └─→ 🎤 (FAB de voz flutuante)
```

#### 2. Adicionar Transação
```
┌─────────────────────────────────────┐
│  ←  Nova Transação                  │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ DESPESA  │  │ RECEITA  │        │ ← Type Toggle
│  │  (ativo) │  │          │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  Valor                              │
│  ┌───────────────────────────────┐  │
│  │  R$  │  0,00                  │  │ ← Money Input
│  └───────────────────────────────┘  │
│                                     │
│  Categoria                          │
│  ┌───────────────────────────────┐  │
│  │ 🍔 Alimentação            ▼  │  │ ← Category Picker
│  └───────────────────────────────┘  │
│                                     │
│  ┌─────┐┌─────┐┌─────┐┌─────┐      │
│  │ 🍕 ││ 🛒 ││ 🚗 ││ 🏠 │      │
│  │Rest.││Merc.││Uber ││Casa │      │ ← Quick Categories
│  └─────┘└─────┘└─────┘└─────┘      │
│                                     │
│  Data                               │
│  ┌───────────────────────────────┐  │
│  │  📅  Hoje, 01 Mar 2026        │  │ ← Date Picker
│  └───────────────────────────────┘  │
│                                     │
│  Descrição (opcional)               │
│  ┌───────────────────────────────┐  │
│  │  Ex: Almoço no shopping       │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │      ✓  SALVAR TRANSAÇÃO      │  │ ← Primary Button
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

#### 3. Lista de Transações
```
┌─────────────────────────────────────┐
│  Transações                    🔍   │
├─────────────────────────────────────┤
│  ┌───────┐┌───────┐┌───────┐       │
│  │ Todas ││Despesas││Receitas│       │ ← Filter Chips
│  └───────┘└───────┘└───────┘       │
│                                     │
│  📅 Março 2026          R$ -2.550  │
│  ─────────────────────────────────  │
│  Hoje                               │
│  ┌───────────────────────────────┐  │
│  │ 🍔 iFood                      │  │
│  │ Alimentação    -R$ 45,00      │  │
│  ├───────────────────────────────┤  │
│  │ ⛽ Posto Shell                │  │
│  │ Transporte     -R$ 200,00     │  │
│  └───────────────────────────────┘  │
│                                     │
│  Ontem                              │
│  ┌───────────────────────────────┐  │
│  │ 🛒 Mercado Extra              │  │
│  │ Alimentação    -R$ 350,00     │  │
│  ├───────────────────────────────┤  │
│  │ 💰 Salário                    │  │
│  │ Receita       +R$ 5.000,00    │  │
│  └───────────────────────────────┘  │
│                                     │
│  28 Fev                             │
│  ┌───────────────────────────────┐  │
│  │ 🎬 Netflix                    │  │
│  │ Lazer          -R$ 55,90      │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

#### 4. Tela de Voz
```
┌─────────────────────────────────────┐
│  ×  Adicionar por Voz               │
├─────────────────────────────────────┤
│                                     │
│                                     │
│                                     │
│         ┌─────────────┐             │
│         │             │             │
│         │    🎤       │             │ ← Mic Button
│         │             │             │    (animado)
│         └─────────────┘             │
│                                     │
│    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~     │ ← Waveform
│                                     │
│       "Toque para gravar"           │
│                                     │
│       ou diga algo como:            │
│   "Gastei 50 reais no mercado"      │
│   "Recebi 200 do freelance"         │
│                                     │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘

(Após gravar e processar:)

┌─────────────────────────────────────┐
│  ×  Confirmar Transação             │
├─────────────────────────────────────┤
│                                     │
│  Entendi o seguinte:                │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  DESPESA                      │  │
│  │                               │  │
│  │  R$ 50,00                     │  │
│  │                               │  │
│  │  🛒 Mercado                   │  │
│  │  Alimentação                  │  │
│  │                               │  │
│  │  📅 Hoje                      │  │
│  └───────────────────────────────┘  │
│                                     │
│  Está correto?                      │
│                                     │
│  ┌──────────┐  ┌──────────────┐    │
│  │  Editar  │  │  ✓ Confirmar │    │
│  └──────────┘  └──────────────┘    │
│                                     │
│           [Tentar de novo]          │
│                                     │
└─────────────────────────────────────┘
```

---

## Schema do Banco de Dados

### Diagrama ER

```
┌─────────────────┐       ┌─────────────────┐
│     PROFILES    │       │   CATEGORIES    │
├─────────────────┤       ├─────────────────┤
│ id (PK, FK→auth)│───┐   │ id (PK)         │
│ name            │   │   │ user_id (FK)    │←──┐
│ avatar_url      │   │   │ name            │   │
│ monthly_budget  │   │   │ icon            │   │
│ currency        │   │   │ color           │   │
│ created_at      │   │   │ type            │   │
└─────────────────┘   │   │ parent_id (FK)  │───┘ (subcategorias)
                      │   │ is_system       │
                      │   │ order           │
                      │   │ created_at      │
                      │   └─────────────────┘
                      │            │
                      │            │
                      ▼            ▼
              ┌─────────────────────────────┐
              │        TRANSACTIONS         │
              ├─────────────────────────────┤
              │ id (PK)                     │
              │ user_id (FK→profiles)       │
              │ category_id (FK→categories) │
              │ amount                      │
              │ type (expense/income)       │
              │ description                 │
              │ date                        │
              │ notes                       │
              │ attachment_url              │
              │ is_recurring                │
              │ recurring_config            │
              │ created_at                  │
              │ updated_at                  │
              └─────────────────────────────┘

┌─────────────────┐       ┌─────────────────┐
│     BUDGETS     │       │      GOALS      │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ user_id (FK)    │
│ category_id(FK) │       │ name            │
│ amount          │       │ target_amount   │
│ period          │       │ current_amount  │
│ month           │       │ deadline        │
│ year            │       │ icon            │
│ created_at      │       │ color           │
└─────────────────┘       │ created_at      │
                          └─────────────────┘
```

### SQL Completo

```sql
-- ================================================================
-- EXTENSION para UUIDs
-- ================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- PROFILES (extensão do auth.users do Supabase)
-- ================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    avatar_url TEXT,
    monthly_budget DECIMAL(12, 2) DEFAULT 0,
    currency TEXT DEFAULT 'BRL',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para criar profile automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ================================================================
-- CATEGORIES
-- ================================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_system BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ================================================================
-- TRANSACTIONS
-- ================================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    attachment_url TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries comuns
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_user_month ON transactions(user_id, DATE_TRUNC('month', date));

-- ================================================================
-- BUDGETS
-- ================================================================
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    period TEXT NOT NULL CHECK (period IN ('monthly', 'weekly', 'yearly')),
    month INTEGER CHECK (month >= 1 AND month <= 12),
    year INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraint para evitar duplicatas
    UNIQUE(user_id, category_id, period, month, year)
);

CREATE INDEX idx_budgets_user ON budgets(user_id);
CREATE INDEX idx_budgets_category ON budgets(category_id);

-- ================================================================
-- GOALS (Metas financeiras)
-- ================================================================
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0,
    deadline DATE,
    icon TEXT DEFAULT 'Target',
    color TEXT DEFAULT '#6366F1',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_user ON goals(user_id);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Policies para categories
CREATE POLICY "Users can view own categories and system categories"
    ON categories FOR SELECT
    USING (auth.uid() = user_id OR is_system = TRUE);

CREATE POLICY "Users can insert own categories"
    ON categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
    ON categories FOR UPDATE
    USING (auth.uid() = user_id AND is_system = FALSE);

CREATE POLICY "Users can delete own categories"
    ON categories FOR DELETE
    USING (auth.uid() = user_id AND is_system = FALSE);

-- Policies para transactions
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
    ON transactions FOR DELETE
    USING (auth.uid() = user_id);

-- Policies para budgets
CREATE POLICY "Users can view own budgets"
    ON budgets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
    ON budgets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
    ON budgets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
    ON budgets FOR DELETE
    USING (auth.uid() = user_id);

-- Policies para goals
CREATE POLICY "Users can view own goals"
    ON goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
    ON goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
    ON goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
    ON goals FOR DELETE
    USING (auth.uid() = user_id);

-- ================================================================
-- VIEWS úteis
-- ================================================================

-- View para resumo mensal
CREATE OR REPLACE VIEW monthly_summary AS
SELECT
    user_id,
    DATE_TRUNC('month', date) AS month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance,
    COUNT(*) AS transaction_count
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', date);

-- View para gastos por categoria
CREATE OR REPLACE VIEW category_spending AS
SELECT
    t.user_id,
    t.category_id,
    c.name AS category_name,
    c.icon AS category_icon,
    c.color AS category_color,
    DATE_TRUNC('month', t.date) AS month,
    SUM(t.amount) AS total,
    COUNT(*) AS count
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY t.user_id, t.category_id, c.name, c.icon, c.color, DATE_TRUNC('month', t.date);

-- ================================================================
-- CATEGORIAS PADRÃO DO SISTEMA
-- ================================================================
INSERT INTO categories (user_id, name, icon, color, type, is_system, "order") VALUES
-- Despesas - Alimentação
(NULL, 'Alimentação', 'ForkKnife', '#F97316', 'expense', TRUE, 1),
(NULL, 'Restaurante', 'ForkKnife', '#EA580C', 'expense', TRUE, 2),
(NULL, 'Mercado', 'ShoppingCart', '#FB923C', 'expense', TRUE, 3),
(NULL, 'Delivery', 'Motorcycle', '#FDBA74', 'expense', TRUE, 4),
(NULL, 'Lanches', 'Hamburger', '#FED7AA', 'expense', TRUE, 5),

-- Despesas - Transporte
(NULL, 'Transporte', 'Car', '#3B82F6', 'expense', TRUE, 10),
(NULL, 'Combustível', 'GasPump', '#2563EB', 'expense', TRUE, 11),
(NULL, 'Uber/99', 'Taxi', '#60A5FA', 'expense', TRUE, 12),
(NULL, 'Transporte Público', 'Bus', '#93C5FD', 'expense', TRUE, 13),
(NULL, 'Estacionamento', 'ParkingSquare', '#BFDBFE', 'expense', TRUE, 14),

-- Despesas - Moradia
(NULL, 'Moradia', 'House', '#8B5CF6', 'expense', TRUE, 20),
(NULL, 'Aluguel', 'Key', '#7C3AED', 'expense', TRUE, 21),
(NULL, 'Condomínio', 'Buildings', '#A78BFA', 'expense', TRUE, 22),
(NULL, 'Luz', 'Lightning', '#C4B5FD', 'expense', TRUE, 23),
(NULL, 'Água', 'Drop', '#DDD6FE', 'expense', TRUE, 24),
(NULL, 'Gás', 'Flame', '#EDE9FE', 'expense', TRUE, 25),
(NULL, 'Internet', 'WifiHigh', '#F5F3FF', 'expense', TRUE, 26),

-- Despesas - Saúde
(NULL, 'Saúde', 'Heart', '#EC4899', 'expense', TRUE, 30),
(NULL, 'Farmácia', 'Pill', '#DB2777', 'expense', TRUE, 31),
(NULL, 'Consultas', 'Stethoscope', '#F472B6', 'expense', TRUE, 32),
(NULL, 'Plano de Saúde', 'FirstAid', '#F9A8D4', 'expense', TRUE, 33),
(NULL, 'Academia', 'Barbell', '#FBCFE8', 'expense', TRUE, 34),

-- Despesas - Lazer
(NULL, 'Lazer', 'GameController', '#F59E0B', 'expense', TRUE, 40),
(NULL, 'Cinema', 'FilmStrip', '#D97706', 'expense', TRUE, 41),
(NULL, 'Streaming', 'MonitorPlay', '#FBBF24', 'expense', TRUE, 42),
(NULL, 'Jogos', 'GameController', '#FCD34D', 'expense', TRUE, 43),
(NULL, 'Viagens', 'Airplane', '#FDE68A', 'expense', TRUE, 44),
(NULL, 'Hobbies', 'Palette', '#FEF3C7', 'expense', TRUE, 45),

-- Despesas - Compras
(NULL, 'Compras', 'ShoppingBag', '#14B8A6', 'expense', TRUE, 50),
(NULL, 'Roupas', 'TShirt', '#0D9488', 'expense', TRUE, 51),
(NULL, 'Eletrônicos', 'DeviceMobile', '#2DD4BF', 'expense', TRUE, 52),
(NULL, 'Casa', 'Couch', '#5EEAD4', 'expense', TRUE, 53),
(NULL, 'Presentes', 'Gift', '#99F6E4', 'expense', TRUE, 54),

-- Despesas - Educação
(NULL, 'Educação', 'GraduationCap', '#6366F1', 'expense', TRUE, 60),
(NULL, 'Cursos', 'BookOpen', '#4F46E5', 'expense', TRUE, 61),
(NULL, 'Livros', 'Books', '#818CF8', 'expense', TRUE, 62),
(NULL, 'Material', 'Pencil', '#A5B4FC', 'expense', TRUE, 63),

-- Despesas - Finanças
(NULL, 'Finanças', 'Bank', '#10B981', 'expense', TRUE, 70),
(NULL, 'Investimentos', 'ChartLineUp', '#059669', 'expense', TRUE, 71),
(NULL, 'Empréstimos', 'Money', '#34D399', 'expense', TRUE, 72),
(NULL, 'Seguros', 'Shield', '#6EE7B7', 'expense', TRUE, 73),

-- Despesas - Outros
(NULL, 'Pets', 'Dog', '#6B7280', 'expense', TRUE, 80),
(NULL, 'Doações', 'HandHeart', '#9CA3AF', 'expense', TRUE, 81),
(NULL, 'Impostos', 'Receipt', '#D1D5DB', 'expense', TRUE, 82),
(NULL, 'Outros', 'DotsThree', '#E5E7EB', 'expense', TRUE, 99),

-- Receitas
(NULL, 'Salário', 'Wallet', '#22C55E', 'income', TRUE, 100),
(NULL, 'Freelance', 'Laptop', '#16A34A', 'income', TRUE, 101),
(NULL, 'Investimentos', 'TrendUp', '#4ADE80', 'income', TRUE, 102),
(NULL, 'Vendas', 'Tag', '#86EFAC', 'income', TRUE, 103),
(NULL, 'Presentes', 'Gift', '#BBF7D0', 'income', TRUE, 104),
(NULL, 'Outros', 'DotsThree', '#DCFCE7', 'income', TRUE, 199);
```

---

## Funcionalidades Detalhadas

### Fase 1: MVP (Prioridade Alta)

#### 1.1 Autenticação

**Fluxo de Login/Cadastro:**
```
Welcome → Login/Cadastro → Verificação (se email) → Dashboard
```

**Funcionalidades:**
- [ ] Login com email/senha
- [ ] Cadastro com email/senha
- [ ] Login social (Google via OAuth)
- [ ] Login social (Apple Sign-In)
- [ ] Recuperação de senha por email
- [ ] Persistência de sessão (auto-login)
- [ ] Logout

**Validações:**
- Email: formato válido, não duplicado
- Senha: mínimo 8 caracteres, 1 número, 1 letra

#### 1.2 Dashboard

**Componentes do Dashboard:**

| Componente | Descrição | Dados |
|------------|-----------|-------|
| **BalanceCard** | Saldo do mês (receitas - despesas) | Valor atual, variação vs mês anterior |
| **QuickStats** | 3 cards pequenos | Total receitas, Total despesas, % orçamento |
| **SpendingChart** | Gráfico de pizza | Top 5 categorias do mês |
| **MonthlyChart** | Gráfico de barras | Últimos 6 meses |
| **RecentTransactions** | Lista | Últimas 5 transações |
| **BudgetProgress** | Barra de progresso | Progresso do orçamento mensal |

**Interações:**
- Tap no BalanceCard → Detalhes do mês
- Tap no gráfico → Filtrar por categoria
- Tap em transação → Editar transação
- Pull to refresh → Atualizar dados

#### 1.3 CRUD de Transações

**Criar Transação:**
- [ ] Toggle despesa/receita
- [ ] Input de valor com máscara (R$ 0,00)
- [ ] Seletor de categoria (modal com busca)
- [ ] Date picker
- [ ] Campo de descrição (opcional)
- [ ] Campo de notas (opcional)
- [ ] Upload de comprovante (opcional)
- [ ] Toggle recorrente + config

**Listar Transações:**
- [ ] Lista agrupada por data
- [ ] Filtro por tipo (todos/despesas/receitas)
- [ ] Filtro por categoria
- [ ] Filtro por período (mês/semana/custom)
- [ ] Busca por descrição
- [ ] Pull to refresh
- [ ] Infinite scroll

**Editar/Excluir:**
- [ ] Tap para editar
- [ ] Swipe para excluir (com confirmação)
- [ ] Bulk delete

#### 1.4 Categorias

**Categorias do Sistema (25+):**
Vide SQL acima - já inclui 45+ categorias organizadas por grupo.

**Categorias Customizadas:**
- [ ] Criar categoria própria
- [ ] Escolher ícone (Phosphor Icons)
- [ ] Escolher cor
- [ ] Definir se é subcategoria
- [ ] Editar/excluir categoria

### Fase 2: Recursos Avançados

#### 2.1 Entrada por Voz

**Fluxo:**
```
Tap FAB 🎤 → Gravar áudio → Transcrever → Processar com IA → Mostrar preview → Confirmar/Editar → Salvar
```

**Implementação Técnica:**

1. **Gravação de Áudio:**
   - Usar `expo-av` para gravar
   - Formato: AAC/M4A
   - Limite: 30 segundos

2. **Speech-to-Text:**
   - **Opção 1**: Google Cloud Speech-to-Text
   - **Opção 2**: Whisper API (OpenAI)
   - **Opção 3**: Whisper local (on-device, mais lento)

3. **Processamento NLP:**
   - Enviar texto transcrito para Claude/GPT
   - Extrair: valor, categoria, tipo, descrição
   - Retornar JSON estruturado

**Prompt para IA:**
```
Você é um assistente financeiro. Analise o texto do usuário e extraia:
- amount: valor numérico
- type: "expense" ou "income"
- category: uma das categorias [lista]
- description: descrição curta

Texto: "{user_input}"

Retorne APENAS JSON:
{"amount": 50.00, "type": "expense", "category": "Mercado", "description": "compras da semana"}
```

**Exemplos de Frases:**
- "gastei 50 reais no mercado"
- "recebi 200 do freelance"
- "paguei 1500 de aluguel"
- "uber pra casa 25 reais"

#### 2.2 Relatórios

**Tipos de Relatórios:**
- [ ] Resumo mensal (receitas, despesas, saldo)
- [ ] Gastos por categoria (pizza + lista)
- [ ] Evolução mensal (últimos 12 meses)
- [ ] Comparativo com mês anterior
- [ ] Top 10 maiores gastos
- [ ] Média diária de gastos
- [ ] Tendência de gastos (projeção)

**Exportação:**
- [ ] PDF com gráficos
- [ ] CSV para Excel
- [ ] Compartilhar via apps

#### 2.3 Orçamentos

**Funcionalidades:**
- [ ] Definir orçamento mensal global
- [ ] Definir orçamento por categoria
- [ ] Alertas quando atingir 80%
- [ ] Alertas quando ultrapassar
- [ ] Visualização de progresso

#### 2.4 Sugestões Inteligentes

**Alertas Automáticos:**
- Gasto acima da média na categoria
- Gasto fora do padrão (horário, valor)
- Orçamento próximo do limite
- Despesas recorrentes esquecidas

**Sugestões de Economia:**
- Categorias com potencial de redução
- Comparativo com médias
- Dicas personalizadas

### Fase 3: Integrações Bancárias

#### 3.1 APIs de Agregação Bancária (Recomendado)

Existem empresas que já fizeram a integração com os bancos e oferecem APIs simples para desenvolvedores:

##### Pluggy (Recomendado para MVP)
- **Site**: https://www.pluggy.ai/
- **Bancos**: 50+ instituições (Nubank, Itaú, Bradesco, BB, Santander, Inter, C6, etc.)
- **Preço**: Freemium - 100 conexões grátis, depois ~R$0,50/conexão/mês
- **Funcionalidades**:
  - Extrato e saldo em tempo real
  - Categorização automática de transações
  - Identificação de receitas/despesas
  - SDK JavaScript (funciona com React Native)
  - Iniciador de pagamentos via Pix (ITP)

```typescript
// Exemplo de uso do Pluggy
import { PluggyConnect } from 'react-native-pluggy-connect';

// 1. Usuário conecta o banco
<PluggyConnect
  connectToken={token}
  onSuccess={(connection) => {
    // 2. Obter transações
    const transactions = await pluggy.getTransactions(connection.item.id);
  }}
/>
```

##### Belvo
- **Site**: https://belvo.com/
- **Bancos**: 40+ instituições no Brasil
- **Preço**: Sob consulta (enterprise)
- **Funcionalidades**:
  - Similar ao Pluggy
  - Foco em América Latina
  - Iniciador de pagamentos

##### Comparativo

| Critério | Pluggy | Belvo | Open Finance Direto |
|----------|--------|-------|---------------------|
| Facilidade | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Custo inicial | Grátis | Pago | Grátis |
| Tempo setup | 1 dia | 1 dia | 3-6 meses |
| Certificação BC | Não precisa | Não precisa | Obrigatória |
| Bancos | 50+ | 40+ | Todos regulados |

#### 3.2 Open Finance Brasil (Direto)

**Se quiser integrar diretamente sem intermediário:**

- **Documentação**: https://openfinancebrasil.org.br/
- **GitHub**: https://github.com/OpenBanking-Brasil/openapi

**Requisitos:**
- Ser instituição regulada pelo Banco Central
- Certificação de segurança
- Processo de homologação (3-6 meses)
- Certificados digitais ICP-Brasil

**Não recomendado para MVP** - Use Pluggy ou Belvo primeiro.

#### 3.3 Fluxo de Integração Bancária

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO DO USUÁRIO                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Usuário toca "Conectar Banco"                           │
│                    ↓                                         │
│  2. Abre modal do Pluggy (iframe/webview)                   │
│                    ↓                                         │
│  3. Usuário seleciona banco e faz login                     │
│                    ↓                                         │
│  4. Autoriza compartilhamento de dados                      │
│                    ↓                                         │
│  5. App recebe access_token                                 │
│                    ↓                                         │
│  6. Buscar transações via API                               │
│                    ↓                                         │
│  7. Importar para o app (já categorizadas!)                 │
│                    ↓                                         │
│  8. Sincronização automática diária                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 3.4 Dados Disponíveis via API

```typescript
// Resposta típica de transação do Pluggy
interface BankTransaction {
  id: string;
  description: string;           // "PAG*JoseDaSilva"
  descriptionRaw: string;        // Descrição original do banco
  currencyCode: string;          // "BRL"
  amount: number;                // -45.90
  date: string;                  // "2026-03-01"
  balance: number;               // 2450.00
  category: string;              // "Alimentação" (automático!)
  categoryId: string;
  type: "DEBIT" | "CREDIT";
  paymentData?: {
    payer?: { name: string; documentNumber: string };
    receiver?: { name: string; documentNumber: string };
  };
}

// Resposta de conta
interface BankAccount {
  id: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD";
  name: string;                  // "Conta Corrente"
  number: string;                // "12345-6"
  balance: number;               // 2450.00
  creditLimit?: number;          // Para cartão de crédito
  institution: {
    name: string;                // "Nubank"
    imageUrl: string;            // Logo do banco
  };
}
```

#### 3.5 Implementação Sugerida

**Fase 1 (MVP):** Entrada manual apenas
**Fase 2:** Integrar Pluggy para importar transações
**Fase 3:** Sincronização automática + notificações

**Tabela adicional no banco:**

```sql
-- Conexões bancárias do usuário
bank_connections (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  provider TEXT NOT NULL,              -- 'pluggy', 'belvo'
  provider_item_id TEXT NOT NULL,      -- ID da conexão no provider
  institution_name TEXT,               -- 'Nubank'
  institution_logo TEXT,               -- URL do logo
  last_sync_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active',        -- 'active', 'error', 'expired'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mapear transações importadas para evitar duplicatas
imported_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  transaction_id UUID REFERENCES transactions(id),
  provider TEXT NOT NULL,
  provider_transaction_id TEXT NOT NULL,  -- ID único do banco
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider, provider_transaction_id)
);
```

#### 3.6 Alternativa: Importação Manual de Extrato

Se não quiser usar APIs pagas, pode permitir importação de arquivos:

- **OFX**: Formato padrão de extrato (todos os bancos exportam)
- **CSV**: Excel/planilhas

```typescript
// Parser de OFX simplificado
import { parseOFX } from 'ofx-parser';

const handleImportOFX = async (fileUri: string) => {
  const content = await FileSystem.readAsStringAsync(fileUri);
  const parsed = parseOFX(content);

  const transactions = parsed.transactions.map(t => ({
    amount: Math.abs(t.amount),
    type: t.amount < 0 ? 'expense' : 'income',
    description: t.memo,
    date: t.date,
  }));

  // Salvar no Supabase
  await supabase.from('transactions').insert(transactions);
};
```

---

## Roadmap de Implementação

### Sprint 1 (Semana 1-2): Setup e Fundação
```
[ ] 1. Criar projeto Expo com TypeScript
[ ] 2. Configurar ESLint, Prettier
[ ] 3. Criar projeto no Supabase
[ ] 4. Rodar migrations do banco
[ ] 5. Implementar design system (colors, typography, spacing)
[ ] 6. Criar componentes UI base (Button, Card, Input, etc)
[ ] 7. Configurar navegação (Expo Router)
[ ] 8. Setup de stores (Zustand)
```

### Sprint 2 (Semana 3-4): Autenticação
```
[ ] 1. Tela de welcome/onboarding
[ ] 2. Tela de login
[ ] 3. Tela de cadastro
[ ] 4. Tela de recuperação de senha
[ ] 5. Integração com Supabase Auth
[ ] 6. Login social (Google, Apple)
[ ] 7. Auth guard e redirecionamento
[ ] 8. Persistência de sessão
```

### Sprint 3 (Semana 5-6): Dashboard
```
[ ] 1. Layout principal com tabs
[ ] 2. Componente BalanceCard
[ ] 3. Componente QuickStats
[ ] 4. Componente SpendingChart (pizza)
[ ] 5. Componente RecentTransactions
[ ] 6. Integração com Supabase Realtime
[ ] 7. Pull to refresh
[ ] 8. Estados de loading/empty
```

### Sprint 4 (Semana 7-8): Transações
```
[ ] 1. Tela de adicionar transação
[ ] 2. Componente MoneyInput com máscara
[ ] 3. Componente CategoryPicker
[ ] 4. Componente DatePicker
[ ] 5. Tela de lista de transações
[ ] 6. Filtros e busca
[ ] 7. Edição de transação
[ ] 8. Exclusão com confirmação
```

### Sprint 5 (Semana 9-10): Refinamentos
```
[ ] 1. Animações e transições
[ ] 2. Haptic feedback
[ ] 3. Gráficos animados
[ ] 4. Tela de perfil
[ ] 5. Configurações
[ ] 6. Push notifications
[ ] 7. Tratamento de erros
[ ] 8. Testes E2E
```

### Sprint 6 (Semana 11-12): Entrada por Voz
```
[ ] 1. Configurar expo-av
[ ] 2. Componente VoiceRecorder
[ ] 3. Integração Speech-to-Text
[ ] 4. Integração IA (Claude/GPT)
[ ] 5. Tela de confirmação
[ ] 6. FAB flutuante
[ ] 7. Animações de gravação
[ ] 8. Testes de precisão
```

### Backlog (Pós-MVP)
```
[ ] Relatórios avançados
[ ] Exportação PDF/CSV
[ ] Orçamentos por categoria
[ ] Metas financeiras
[ ] Transações recorrentes automáticas
[ ] Dark mode
[ ] Widgets (iOS/Android)
[ ] Apple Watch
[ ] Open Banking
```

---

## Configurações e Integrações

### Variáveis de Ambiente

```bash
# .env

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Speech-to-Text (escolher um)
GOOGLE_CLOUD_API_KEY=AIza...
OPENAI_API_KEY=sk-...

# IA para NLP
ANTHROPIC_API_KEY=sk-ant-...
# ou
OPENAI_API_KEY=sk-...
```

### Dependências (package.json)

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-av": "~15.0.0",
    "expo-haptics": "~14.0.0",
    "expo-image": "~2.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-splash-screen": "~0.29.0",
    "expo-status-bar": "~2.0.0",
    "expo-font": "~13.0.0",

    "react": "18.3.1",
    "react-native": "0.76.3",
    "react-native-reanimated": "~3.16.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.1.0",

    "@supabase/supabase-js": "^2.45.0",
    "@react-native-async-storage/async-storage": "1.23.1",

    "zustand": "^5.0.0",
    "react-hook-form": "^7.54.0",
    "zod": "^3.24.0",
    "@hookform/resolvers": "^3.9.0",

    "@shopify/react-native-skia": "^1.5.0",
    "victory-native": "^41.0.0",

    "date-fns": "^4.1.0",
    "phosphor-react-native": "^1.1.2"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "~5.3.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0"
  }
}
```

### Comandos Úteis

```bash
# Criar projeto
npx create-expo-app@latest contadorDeBolso -t tabs

# Desenvolvimento
npx expo start

# Build de desenvolvimento
npx expo run:android
npx expo run:ios

# Build de produção
eas build --platform android
eas build --platform ios

# Atualização OTA
eas update --branch production

# Gerar tipos do Supabase
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

---

## Dashboard Profissional

### Visão Geral
Dashboard completo e profissional com visualizações ricas e exportação de dados.

### Componentes de Gráficos

#### 1. Gráfico de Pizza (Gastos por Categoria)
```
┌─────────────────────────────────────┐
│     Gastos por Categoria            │
│   ┌───────────────────────┐         │
│   │      🥧 PIZZA         │         │
│   │   Alimentação: 35%    │         │
│   │   Transporte: 25%     │         │
│   │   Moradia: 20%        │         │
│   │   Outros: 20%         │         │
│   └───────────────────────┘         │
│   [Legenda com cores]               │
└─────────────────────────────────────┘
```

#### 2. Gráfico de Barras (Evolução Mensal)
```
┌─────────────────────────────────────┐
│     Últimos 6 Meses                 │
│   ┌───────────────────────┐         │
│   │ Set ████████          │ R$2.500 │
│   │ Out ██████████        │ R$3.000 │
│   │ Nov ████████████      │ R$3.500 │
│   │ Dez ██████████████    │ R$4.000 │
│   │ Jan ████████████      │ R$3.500 │
│   │ Fev ██████████        │ R$2.800 │
│   └───────────────────────┘         │
└─────────────────────────────────────┘
```

#### 3. Gráfico de Linha (Tendência)
```
┌─────────────────────────────────────┐
│     Receitas vs Despesas            │
│   ┌───────────────────────┐         │
│   │    ╱╲   ╱╲            │ Receita │
│   │   ╱  ╲ ╱  ╲   ╱       │ (verde) │
│   │  ╱    ╳    ╲ ╱        │         │
│   │ ────────────────      │ Despesa │
│   │                       │ (verm.) │
│   └───────────────────────┘         │
└─────────────────────────────────────┘
```

#### 4. Progresso de Orçamento
```
┌─────────────────────────────────────┐
│  Orçamento do Mês: R$ 5.000         │
│  ████████████░░░░░░░░░ 65%          │
│  Gasto: R$ 3.250 | Resta: R$ 1.750  │
└─────────────────────────────────────┘
```

### Cards de Métricas

| Card | Descrição |
|------|-----------|
| **Saldo Atual** | Receitas - Despesas do mês |
| **Maior Gasto** | Transação de maior valor |
| **Média Diária** | Total de gastos ÷ dias do mês |
| **Economia** | Quanto economizou vs mês anterior |
| **Meta Atingida** | % do objetivo de economia |
| **Categoria Top** | Categoria com mais gastos |

### Exportação de Dados

#### Formatos Disponíveis
1. **CSV** - Para Excel/Google Sheets
2. **PDF** - Relatório formatado
3. **JSON** - Para desenvolvedores

#### Funcionalidades de Exportação
```typescript
// Exportar para CSV (abre no Excel)
exportToCSV({
  transactions: Transaction[],
  period: { start: Date, end: Date },
  columns: ['data', 'descricao', 'categoria', 'valor', 'tipo']
});

// Exportar para PDF
exportToPDF({
  title: 'Relatório Financeiro - Março 2026',
  charts: ['pizza', 'barras', 'linha'],
  summary: true,
  transactions: true
});
```

#### Visualização no PC (Web Dashboard)
```
┌─────────────────────────────────────────────────────────────┐
│  🖥️ DASHBOARD WEB (Versão Desktop)                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │   SALDO      │ │   RECEITAS   │ │   DESPESAS   │         │
│  │  R$ 2.450    │ │  R$ 5.000    │ │  R$ 2.550    │         │
│  └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                              │
│  ┌────────────────────────┐ ┌────────────────────────┐      │
│  │   GRÁFICO DE PIZZA     │ │   EVOLUÇÃO MENSAL     │      │
│  │   (Categorias)         │ │   (Barras)            │      │
│  │         🥧             │ │        📊            │      │
│  └────────────────────────┘ └────────────────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │   TABELA DE TRANSAÇÕES (estilo Excel)            │       │
│  ├──────┬────────────┬───────────┬─────────┬───────┤       │
│  │ Data │ Descrição  │ Categoria │  Valor  │ Tipo  │       │
│  ├──────┼────────────┼───────────┼─────────┼───────┤       │
│  │01/03 │ iFood      │ Delivery  │ -45,90  │ Desp. │       │
│  │01/03 │ Posto      │ Transp.   │ -200,00 │ Desp. │       │
│  │28/02 │ Salário    │ Renda     │+5000,00 │ Rec.  │       │
│  └──────┴────────────┴───────────┴─────────┴───────┘       │
│                                                              │
│  [📥 Exportar CSV] [📄 Exportar PDF] [🔄 Sincronizar]       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Implementação Técnica

#### Biblioteca de Gráficos
- **react-native-svg** + **react-native-svg-charts**
- OU **victory-native** (mais features)
- OU **react-native-chart-kit** (mais simples)

#### Exportação CSV
```typescript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const exportToCSV = async (transactions: Transaction[]) => {
  const header = 'Data,Descrição,Categoria,Valor,Tipo\n';
  const rows = transactions.map(t =>
    `${formatDate(t.date)},${t.description},${t.categoryId},${t.amount},${t.type}`
  ).join('\n');

  const csv = header + rows;
  const path = FileSystem.documentDirectory + 'transacoes.csv';

  await FileSystem.writeAsStringAsync(path, csv);
  await Sharing.shareAsync(path);
};
```

#### Tabela Responsiva (Web)
```typescript
// Componente que renderiza diferente no web vs mobile
import { Platform } from 'react-native';

export function TransactionsTable({ data }) {
  if (Platform.OS === 'web') {
    return <WebTable data={data} />; // Tabela estilo Excel
  }
  return <MobileList data={data} />; // Lista mobile
}
```

### Features do Dashboard Profissional

- [ ] Gráfico de pizza animado (categorias)
- [ ] Gráfico de barras (comparativo mensal)
- [ ] Gráfico de linha (tendência)
- [ ] Cards de métricas com animação
- [ ] Barra de progresso do orçamento
- [ ] Filtro por período (semana/mês/ano/custom)
- [ ] Comparativo com período anterior
- [ ] Exportar para CSV (Excel)
- [ ] Exportar para PDF
- [ ] Visualização em tabela (web)
- [ ] Pull to refresh
- [ ] Skeleton loading

---

## Checklist Final

### Antes do MVP
- [ ] Projeto Expo criado e configurado
- [ ] Supabase configurado com todas as tabelas
- [ ] Autenticação funcionando (email + social)
- [ ] Dashboard com dados reais
- [ ] CRUD completo de transações
- [ ] Gráficos animados
- [ ] Entrada por voz funcional
- [ ] Tratamento de erros
- [ ] Loading states
- [ ] Empty states
- [ ] Offline handling básico

### Antes da Publicação
- [ ] Testes em múltiplos dispositivos
- [ ] Performance otimizada
- [ ] Splash screen configurada
- [ ] Ícone do app
- [ ] Screenshots para stores
- [ ] Textos de marketing
- [ ] Política de privacidade
- [ ] Termos de uso
- [ ] App Store Connect configurado
- [ ] Google Play Console configurado

---

*Documento criado em: Março 2026*
*Última atualização: 01/03/2026*
