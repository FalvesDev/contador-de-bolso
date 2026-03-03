-- =============================================
-- CONTADOR DE BOLSO - SCHEMA DO BANCO DE DADOS
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: profiles (extensão do auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  monthly_income DECIMAL(12,2) DEFAULT 0,
  monthly_budget DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'BRL',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para criar profile automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- TABELA: categories (categorias de gastos/receitas)
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'receipt',
  color TEXT NOT NULL DEFAULT '#6366F1',
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir categorias padrão do sistema
INSERT INTO categories (id, name, icon, color, type, is_system) VALUES
  -- Despesas
  ('11111111-1111-1111-1111-111111111101', 'Delivery', 'utensils', '#F97316', 'expense', true),
  ('11111111-1111-1111-1111-111111111102', 'Mercado', 'shopping-cart', '#10B981', 'expense', true),
  ('11111111-1111-1111-1111-111111111103', 'Uber/99', 'car', '#3B82F6', 'expense', true),
  ('11111111-1111-1111-1111-111111111104', 'Combustível', 'fuel', '#6366F1', 'expense', true),
  ('11111111-1111-1111-1111-111111111105', 'Streaming', 'gamepad', '#EC4899', 'expense', true),
  ('11111111-1111-1111-1111-111111111106', 'Academia', 'heart', '#EF4444', 'expense', true),
  ('11111111-1111-1111-1111-111111111107', 'Restaurante', 'utensils', '#F59E0B', 'expense', true),
  ('11111111-1111-1111-1111-111111111108', 'Compras', 'shopping-bag', '#8B5CF6', 'expense', true),
  ('11111111-1111-1111-1111-111111111109', 'Educação', 'graduation-cap', '#06B6D4', 'expense', true),
  ('11111111-1111-1111-1111-111111111110', 'Saúde', 'heart', '#EC4899', 'expense', true),
  ('11111111-1111-1111-1111-111111111111', 'Moradia', 'house', '#14B8A6', 'expense', true),
  ('11111111-1111-1111-1111-111111111112', 'Transporte', 'car', '#3B82F6', 'expense', true),
  ('11111111-1111-1111-1111-111111111113', 'Lazer', 'gamepad', '#F59E0B', 'expense', true),
  ('11111111-1111-1111-1111-111111111114', 'Assinaturas', 'credit-card', '#6366F1', 'expense', true),
  ('11111111-1111-1111-1111-111111111115', 'Outros', 'receipt', '#64748B', 'expense', true),
  -- Receitas
  ('11111111-1111-1111-1111-111111111201', 'Salário', 'wallet', '#10B981', 'income', true),
  ('11111111-1111-1111-1111-111111111202', 'Freelance', 'briefcase', '#6366F1', 'income', true),
  ('11111111-1111-1111-1111-111111111203', 'Investimentos', 'trending-up', '#F59E0B', 'income', true),
  ('11111111-1111-1111-1111-111111111204', 'Presente', 'gift', '#EC4899', 'income', true),
  ('11111111-1111-1111-1111-111111111205', 'Outros', 'dollar', '#10B981', 'income', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- TABELA: transactions (transações financeiras)
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,

  -- Parcelamento
  is_installment BOOLEAN DEFAULT false,
  installment_number INTEGER,
  total_installments INTEGER,
  installment_group_id TEXT,

  -- Recorrência
  is_recurring BOOLEAN DEFAULT false,
  recurring_type TEXT CHECK (recurring_type IN ('daily', 'weekly', 'monthly', 'yearly')),
  recurring_end_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- =============================================
-- TABELA: budgets (orçamentos por categoria)
-- =============================================
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  period TEXT DEFAULT 'monthly' CHECK (period IN ('monthly', 'weekly')),
  month INTEGER CHECK (month >= 1 AND month <= 12),
  year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, category_id, month, year)
);

-- =============================================
-- TABELA: goals (metas financeiras)
-- =============================================
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  deadline DATE,
  icon TEXT DEFAULT 'target',
  color TEXT DEFAULT '#6366F1',
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) - Segurança
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies para categories (permitir ver categorias do sistema ou próprias)
CREATE POLICY "Users can view categories" ON categories
  FOR SELECT USING (is_system = true OR user_id = auth.uid());

CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (user_id = auth.uid() AND is_system = false);

CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (user_id = auth.uid() AND is_system = false);

-- Policies para transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (user_id = auth.uid());

-- Policies para budgets
CREATE POLICY "Users can view own budgets" ON budgets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own budgets" ON budgets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own budgets" ON budgets
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own budgets" ON budgets
  FOR DELETE USING (user_id = auth.uid());

-- Policies para goals
CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (user_id = auth.uid());

-- =============================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VIEWS úteis
-- =============================================

-- View: Resumo mensal por categoria
CREATE OR REPLACE VIEW monthly_category_summary AS
SELECT
  t.user_id,
  DATE_TRUNC('month', t.date) as month,
  t.category_id,
  c.name as category_name,
  c.color as category_color,
  t.type,
  SUM(t.amount) as total_amount,
  COUNT(*) as transaction_count
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY t.user_id, DATE_TRUNC('month', t.date), t.category_id, c.name, c.color, t.type;

-- View: Saldo mensal
CREATE OR REPLACE VIEW monthly_balance AS
SELECT
  user_id,
  DATE_TRUNC('month', date) as month,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
  SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
  SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', date);

-- =============================================
-- PRONTO! Execute este SQL no Supabase SQL Editor
-- =============================================
