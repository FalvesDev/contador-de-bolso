-- ================================================================
-- CONTADOR DE BOLSO — Schema Supabase
-- Rodar no: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- PROFILES
-- Criado automaticamente quando o usuário se registra
-- ================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    monthly_income DECIMAL(12, 2) DEFAULT 0,
    monthly_budget DECIMAL(12, 2) DEFAULT 0,
    currency TEXT DEFAULT 'BRL',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: cria profile automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, name, email, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
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
-- Suporta: simples, parceladas, recorrentes
-- ================================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Dados principais
    amount DECIMAL(12, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    description TEXT,
    category_id TEXT NOT NULL DEFAULT 'outros',
    date DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Parcelamento
    is_installment BOOLEAN DEFAULT FALSE,
    installment_number INTEGER,
    total_installments INTEGER,
    installment_group_id TEXT,

    -- Recorrência
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_type TEXT CHECK (recurring_type IN ('daily', 'weekly', 'monthly', 'yearly')),
    recurring_end_date DATE,

    -- Metadados
    source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'voice', 'notification', 'bank', 'import')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_group ON transactions(installment_group_id) WHERE installment_group_id IS NOT NULL;
CREATE INDEX idx_transactions_recurring ON transactions(user_id, is_recurring) WHERE is_recurring = TRUE;

-- ================================================================
-- BUDGETS
-- Orçamento por categoria por usuário
-- ================================================================
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    limit_amount DECIMAL(12, 2) NOT NULL CHECK (limit_amount > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, category_id)
);

CREATE INDEX idx_budgets_user ON budgets(user_id);

-- ================================================================
-- GOALS
-- Metas de poupança com progresso
-- ================================================================
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(12, 2) DEFAULT 0 CHECK (current_amount >= 0),
    deadline DATE,
    icon TEXT DEFAULT 'target',
    color TEXT DEFAULT '#6366F1',
    is_completed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_user ON goals(user_id);

-- ================================================================
-- GOAL_CONTRIBUTIONS
-- Histórico de aportes em metas (para a tela de metas melhorada)
-- ================================================================
CREATE TABLE goal_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contributions_goal ON goal_contributions(goal_id);
CREATE INDEX idx_contributions_user ON goal_contributions(user_id);

-- ================================================================
-- NOTIFICATIONS_LOG
-- Histórico de notificações enviadas (evita duplicar alertas)
-- ================================================================
CREATE TABLE notifications_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,  -- 'budget_warning', 'budget_exceeded', 'goal_reached', etc.
    reference_id TEXT,   -- category_id ou goal_id relacionado
    month INTEGER,
    year INTEGER,
    sent_at TIMESTAMPTZ DEFAULT NOW(),

    -- Evita enviar o mesmo alerta mais de uma vez por mês
    UNIQUE(user_id, type, reference_id, month, year)
);

CREATE INDEX idx_notifications_user ON notifications_log(user_id, sent_at DESC);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- Cada usuário vê APENAS seus próprios dados
-- ================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles: own data"
    ON profiles FOR ALL
    USING (auth.uid() = id);

-- Transactions
CREATE POLICY "transactions: own data"
    ON transactions FOR ALL
    USING (auth.uid() = user_id);

-- Budgets
CREATE POLICY "budgets: own data"
    ON budgets FOR ALL
    USING (auth.uid() = user_id);

-- Goals
CREATE POLICY "goals: own data"
    ON goals FOR ALL
    USING (auth.uid() = user_id);

-- Goal contributions
CREATE POLICY "contributions: own data"
    ON goal_contributions FOR ALL
    USING (auth.uid() = user_id);

-- Notifications log
CREATE POLICY "notifications: own data"
    ON notifications_log FOR ALL
    USING (auth.uid() = user_id);

-- ================================================================
-- FUNÇÕES AUXILIARES
-- ================================================================

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- VIEWS ÚTEIS (opcionais, facilitam queries no app)
-- ================================================================

-- Resumo mensal por usuário
CREATE VIEW monthly_summary AS
SELECT
    user_id,
    DATE_TRUNC('month', date) AS month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance,
    COUNT(*) AS transaction_count
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', date);

-- Gastos por categoria no mês atual
CREATE VIEW current_month_by_category AS
SELECT
    user_id,
    category_id,
    SUM(amount) AS total,
    COUNT(*) AS count
FROM transactions
WHERE
    type = 'expense'
    AND DATE_TRUNC('month', date) = DATE_TRUNC('month', NOW())
GROUP BY user_id, category_id;
