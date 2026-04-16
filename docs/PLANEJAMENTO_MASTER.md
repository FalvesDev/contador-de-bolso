# Contador de Bolso — Planejamento Mestre

> App de finanças pessoais com UX/UI moderna, entrada por voz e dashboard inteligente.
> Última atualização: 2026-04-01

---

## Sumário

1. [Status Atual do Projeto](#1-status-atual-do-projeto)
2. [Visão Geral e Objetivos](#2-visão-geral-e-objetivos)
3. [Stack Técnica](#3-stack-técnica)
4. [Arquitetura do Sistema](#4-arquitetura-do-sistema)
5. [Schema do Banco de Dados (Supabase)](#5-schema-do-banco-de-dados-supabase)
6. [Roadmap por Fases](#6-roadmap-por-fases)
7. [Backlog Detalhado](#7-backlog-detalhado)
8. [Design System](#8-design-system)
9. [Changelog](#9-changelog)

---

## 1. Status Atual do Projeto

**Versão:** v2.0 — App completo com persistência local
**Plataforma:** React Native + Expo SDK 54
**Dados:** AsyncStorage (local) — Supabase planejado para Fase 2

### Funcionalidades entregues (100% funcionando)

| Área | Feature | Status |
|------|---------|--------|
| Transações | Adicionar, editar, excluir | ✅ |
| Transações | Parcelamento com escopo (só esta / todas) | ✅ |
| Transações | Edição de parcelas com escopo (só esta / todas) | ✅ |
| Transações | Filtros por período, categoria, tipo | ✅ |
| Transações | Busca por descrição | ✅ |
| Persistência | AsyncStorage local | ✅ |
| Dashboard | Saldo do mês, receitas, despesas | ✅ |
| Dashboard | Saldo total e reservas (todas as contas) | ✅ |
| Dashboard | Navegação por mês | ✅ |
| Dashboard | SmartInsights (análise automática) | ✅ |
| Dashboard | Gastos futuros projetados (FutureExpenses) | ✅ |
| Orçamento | Orçamento por categoria (BudgetManager) | ✅ |
| Metas | Metas financeiras (GoalsCard) | ✅ |
| Relatórios | Gráfico de pizza, barras, linha | ✅ |
| Relatórios | Calendário financeiro com modal por dia | ✅ |
| Relatórios | Score de saúde financeira circular | ✅ |
| Relatórios | Análise de risco de negativar | ✅ |
| Animações | Todas as 4 telas animadas (stagger + spring) | ✅ |
| UX | Haptic feedback ao salvar e excluir | ✅ |
| Notificações | Push: alerta de orçamento (80% e 100%) | ✅ |
| Notificações | Lembrete diário às 20h | ✅ |
| Notificações | Central de notificações internas | ✅ |
| Exportação | CSV de transações | ✅ |
| Exportação | Compartilhar resumo por texto | ✅ |
| Temas | Claro, Escuro, e 10+ temas premium | ✅ |
| Entrada | Entrada por voz (Speech-to-Text) | ✅ |

---

## 2. Visão Geral e Objetivos

### Objetivo
Criar um aplicativo de controle financeiro pessoal que seja:
- **Intuitivo** — qualquer pessoa usa sem tutorial
- **Bonito** — visual moderno de fintech com animações fluidas
- **Inteligente** — entrada por voz, captura automática de gastos, sugestões
- **Conectado** — sync em nuvem, leitura automática de notificações dos bancos

### Público-Alvo
- Pessoas que querem controlar gastos pessoais sem complicação
- Usuários que preferem anotar gastos rapidamente (voz/manual)
- Quem quer visualizar padrões de consumo e planejar o orçamento

### Diferenciais
1. **Entrada por voz** — diga "gastei 50 reais no mercado" e registra
2. **Captura automática de bancos** — lê notificações do Nubank, Inter, C6 etc.
3. **Dashboard visual** — gráficos animados e cards informativos
4. **Sugestões inteligentes** — alertas, dicas e score financeiro
5. **Design premium** — visual de app de banco digital

---

## 3. Stack Técnica

### Atual (v2.0)

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Framework | React Native + Expo | SDK 54 |
| Linguagem | TypeScript | 5.x |
| Persistência | AsyncStorage | Local |
| Animações | React Native Animated API | Nativa |
| Gráficos | react-native-svg | 15.x |
| Haptics | expo-haptics | — |
| Notificações | expo-notifications | — |
| Voz | expo-speech / expo-av | — |
| Temas | Context API + AsyncStorage | — |

### Planejada (v3.0+)

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Backend | **Supabase** | PostgreSQL + Auth + Realtime grátis |
| Auth | Google / Apple Sign-In | Login sem senha |
| State Global | Zustand | Leve, sem boilerplate |
| Animações | React Native Reanimated 3 | 60fps no UI thread |
| Banco de Notificações | Android NotificationListenerService | Captura automática de gastos |
| Open Finance | Pluggy / Belvo | Extrato bancário automático (pago) |

### Plataformas Suportadas

```
📱 iOS      → App Store (futuro)
📱 Android  → Google Play (futuro)
🖥  Web PWA  → Vercel (futuro)
```

---

## 4. Arquitetura do Sistema

### Atual (v2.0 — Local)

```
┌─────────────────────────────────────────────────┐
│                  REACT NATIVE APP                │
├─────────────────────────────────────────────────┤
│  Screens (Home/Transactions/Reports/Profile)     │
│       ↕ props + callbacks                       │
│  Custom Hooks (useLocalTransactions, useBudgets) │
│       ↕ leitura/escrita                         │
│  AsyncStorage (dispositivo)                      │
└─────────────────────────────────────────────────┘
```

### Planejada (v3.0 — Nuvem)

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                    (React Native/Expo)                       │
├─────────────────────────────────────────────────────────────┤
│  Screens → Hooks → Services → Supabase Client               │
│                     ↕                                        │
│  AsyncStorage (cache offline)                                │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS / WebSocket (Realtime)
┌──────────────────────┴──────────────────────────────────────┐
│                        SUPABASE                              │
├─────────────────────────────────────────────────────────────┤
│  Auth (JWT/OAuth)  │  PostgreSQL  │  Realtime  │  Storage    │
└─────────────────────────────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                   SERVIÇOS EXTERNOS                          │
├─────────────────────────────────────────────────────────────┤
│  Speech API (Google/Apple)  │  Pluggy (Open Finance)        │
│  Android NotificationListener (leitura de bancos)           │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Captura Automática (Android)

```
App do banco envia notificação
         ↓
NotificationListenerService intercepta
         ↓
Parser (regex) extrai: valor + descrição + banco
         ↓
         ├─→ Modo automático: salva diretamente
         └─→ Modo confirmação: mostra Alert "Registrar este gasto?"
                                    [Sim] → salva
                                    [Não] → descarta
```

---

## 5. Schema do Banco de Dados (Supabase)

> SQL pronto para rodar no painel do Supabase

```sql
-- ================================================================
-- EXTENSÃO PARA UUIDs
-- ================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- PROFILES (extensão do auth.users)
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

-- Criar profile automaticamente ao criar usuário
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
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================================
-- TRANSACTIONS
-- ================================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_installment BOOLEAN DEFAULT FALSE,
    installment_number INTEGER,
    total_installments INTEGER,
    installment_group_id TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    source TEXT DEFAULT 'manual',  -- 'manual', 'voice', 'notification', 'bank'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_group ON transactions(installment_group_id);

-- ================================================================
-- BUDGETS
-- ================================================================
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    limit_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category_id)
);

CREATE INDEX idx_budgets_user ON budgets(user_id);

-- ================================================================
-- GOALS
-- ================================================================
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0,
    deadline DATE,
    icon TEXT DEFAULT 'target',
    color TEXT DEFAULT '#6366F1',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_user ON goals(user_id);

-- ================================================================
-- ROW LEVEL SECURITY (cada usuário vê só seus dados)
-- ================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own goals" ON goals FOR ALL USING (auth.uid() = user_id);
```

---

## 6. Roadmap por Fases

### Fase 1 — MVP Local ✅ CONCLUÍDA
> Tudo funciona offline com AsyncStorage

- [x] CRUD completo de transações
- [x] Parcelamento e recorrentes
- [x] Orçamento por categoria
- [x] Metas financeiras
- [x] Relatórios com gráficos
- [x] Calendário financeiro
- [x] Score de saúde financeira
- [x] Animações em todas as telas
- [x] Haptic feedback
- [x] Notificações push (alertas + lembrete diário)
- [x] Exportação CSV
- [x] Temas premium
- [x] Entrada por voz

---

### Fase 2 — Nuvem + Sync 🔵 PRÓXIMA
> Conectar ao Supabase para backup, login e sincronização entre dispositivos

**Estimativa:** ~1-2 semanas de desenvolvimento

#### 2.1 — Supabase Base (fazer primeiro)
- [ ] Criar projeto no Supabase (gratuito)
- [ ] Instalar `@supabase/supabase-js`
- [ ] Criar `src/services/supabase.ts` (cliente)
- [ ] Rodar o SQL do schema acima

#### 2.2 — Autenticação
- [ ] Tela de Onboarding (3-4 slides de boas-vindas)
- [ ] Login com Google (expo-auth-session)
- [ ] Login com Apple (iOS)
- [ ] Login com e-mail + senha (fallback)
- [ ] Perfil do usuário (nome, avatar)
- [ ] Logout com confirmação

#### 2.3 — Sincronização
- [ ] `useSyncTransactions` — sincroniza AsyncStorage ↔ Supabase
- [ ] Estratégia offline-first: salva local, envia quando online
- [ ] Resolução de conflitos (timestamp ganha)
- [ ] Indicador visual de sincronização no header
- [ ] `useSyncBudgets` — orçamentos na nuvem
- [ ] `useSyncGoals` — metas na nuvem

#### 2.4 — Backup/Restauração
- [ ] Exportar todos os dados em JSON
- [ ] Importar JSON para restaurar (troca de celular)
- [ ] Botão na tela de Perfil

---

### Fase 3 — Captura Automática de Gastos 🟡 PLANEJADA
> Ler notificações dos bancos para registrar gastos automaticamente (Android)

**Estimativa:** ~1-2 semanas | **Plataforma:** Android apenas

#### 3.1 — NotificationListener (Android)
- [ ] Módulo nativo Expo (`expo-modules-core`) ou plugin bare
- [ ] Solicitar permissão `BIND_NOTIFICATION_LISTENER_SERVICE`
- [ ] Capturar notificações em background
- [ ] Parser por banco:
  - [ ] **Nubank** — "Compra aprovada: R$ X em Y"
  - [ ] **Inter** — "Compra de R$ X em Y aprovada"
  - [ ] **C6 Bank** — "Você gastou R$ X em Y"
  - [ ] **Itaú** — "Compra no débito: R$ X - Y"
  - [ ] **Bradesco**, **Santander**, **BB** (padrões comuns)
- [ ] Extração automática: valor + descrição + banco + tipo
- [ ] Sugestão de categoria por descrição (regex + dicionário)

#### 3.2 — Fluxo de Confirmação
- [ ] Notificação push interna: "Gasto detectado: R$ X em Y — Registrar?"
- [ ] Ao tocar: abre modal de confirmação com dados preenchidos
- [ ] Opção de ajustar categoria antes de confirmar
- [ ] Modo silencioso: registra direto sem perguntar (configurável)
- [ ] Histórico de capturas recusadas

#### 3.3 — Configurações de Captura
- [ ] Toggle geral: ativar/desativar captura
- [ ] Lista de apps monitorados (quais bancos)
- [ ] Modo automático vs. modo confirmação
- [ ] Palavras-chave customizáveis por banco

---

### Fase 4 — Open Finance (Pluggy) 🟠 FUTURO
> Conexão direta com conta bancária via Open Finance do Banco Central

**Estimativa:** ~2-3 semanas | **Custo:** ~R$0,50/conexão/mês (Pluggy)

- [ ] Integrar SDK Pluggy
- [ ] Tela de conexão de conta bancária
- [ ] Importar extrato automático (histórico)
- [ ] Sync periódico em background (diário)
- [ ] Deduplicação de transações (evitar duplicar com capturas manuais)
- [ ] Suporte a múltiplas contas

---

### Fase 5 — Recursos Avançados 🟣 FUTURO

#### Melhorias de Planejamento
- [ ] **Modo de planejamento mensal** — definir meta de gasto por categoria
- [ ] **Tela de detalhes por categoria** — histórico + gráfico de evolução
- [ ] **Tela de metas melhorada** — aporte manual, histórico, projeção de data
- [ ] **Planejamento anual** — visão de 12 meses com projeções

#### OCR e IA
- [ ] **Foto de cupom fiscal** — câmera captura nota e extrai dados (OCR)
- [ ] **Categorização automática por IA** — Claude API classifica descrição
- [ ] **Relatório em PDF** — PDF mensal com gráficos e resumo

#### Social e Família
- [ ] **Modo familiar** — múltiplos usuários, gastos compartilhados
- [ ] **Dividir conta** — calculadora de divisão entre amigos

#### Plataforma
- [ ] **Widget na home do celular** — saldo + botão de adição rápida
- [ ] **Apple Watch / WearOS** — ver saldo e adicionar transação rápida
- [ ] **PWA / Web** — acesso via browser (Vercel)

---

## 7. Backlog Detalhado

### Bugs Conhecidos / Melhorias Técnicas

- [ ] Animações de draw no PieChart e BarChart (linha crescendo)
- [ ] Swipe para deletar transação (gesture-based)
- [ ] Skeleton loading enquanto carrega dados
- [ ] Testes automatizados (Jest + Testing Library)
- [ ] Revisão de acessibilidade (screen readers, fontes grandes)
- [ ] Performance em dispositivos low-end (memo, useMemo, FlatList)
- [ ] Pull to refresh na lista de transações

### UX / Design
- [ ] Onboarding (telas de boas-vindas para novos usuários)
- [ ] Empty states com ilustrações (tela sem transações)
- [ ] Tela de erro com retry
- [ ] Feedback visual de loading em todas as ações

---

## 8. Design System

### Paleta de Cores (Atual)

```typescript
// Cores semânticas do ThemeContext
primary: string       // Cor do tema escolhido
success: string       // Receitas → verde #10B981
danger: string        // Despesas → vermelho #EF4444
warning: string       // Alertas → âmbar #F59E0B
background: string    // Fundo principal
card: string          // Fundo de cards
text: string          // Texto principal
textSecondary: string // Texto secundário
border: string        // Bordas
```

### Temas Disponíveis

| Categoria | Temas |
|-----------|-------|
| Claros | Default, Ocean, Forest, Sunset, Rose |
| Escuros | Dark, Midnight, AMOLED |
| Premium | Cyberpunk, Matrix, Neon, Synthwave, Tron, Hacker |

### Componentes Base (src/components/ui/)

- `Text`, `Card`, `Button` — base
- `AnimatedPressable`, `AnimatedButton`, `AnimatedCard` — com animação
- `AnimatedFAB`, `AnimatedBadge`, `AnimatedIconButton` — especiais
- `Icons` — 60+ ícones SVG customizados
- `GradientBackground` — gradiente SVG para header

### Padrão de Animação

```typescript
// Entrada de tela: Animated.stagger(100, [...grupos])
// Press feedback: scale 0.95 com spring (friction: 8, tension: 60)
// useNativeDriver: true em todos
```

---

## 9. Changelog

### v2.0.0 (Abril 2026) — Atual
- Haptic feedback em salvar e excluir
- Edição de parcelas com escopo (só esta / todas as parcelas)
- Calendário financeiro com modal por dia
- Animações completas em todas as 4 telas
- Notificações push: alertas de orçamento + lembrete diário
- PieChart corrigido (texto não vaza mais no mobile)
- SmartInsights integrado na HomeScreen
- Saldo total e reservas na HomeScreen

### v1.1.0 (Março 2026)
- Orçamento por categoria (BudgetManager)
- Metas financeiras (GoalsCard)
- Score de saúde financeira circular
- FutureExpenses (gastos futuros projetados)
- Exclusão de parcelas com escopo
- Exportação CSV
- Compartilhamento por texto
- 10+ temas premium

### v1.0.0 (Março 2026) — MVP
- Dashboard com saldo e resumo mensal
- Adicionar/editar/excluir transações
- Parcelamento e recorrentes
- Relatórios com gráficos (pizza, barras, linha)
- Filtros e busca
- Temas claro/escuro
- 45+ categorias
- Entrada por voz
