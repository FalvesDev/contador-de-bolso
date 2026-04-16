-- ================================================================
-- MIGRATION 001 — Adiciona category_key para compatibilidade com o app
-- Rodar no: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- Adiciona campo de texto para guardar o ID de categoria do app
-- (o app usa strings como 'delivery', 'grocery', não UUIDs)
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS category_key TEXT DEFAULT 'outros';

ALTER TABLE budgets
  ADD COLUMN IF NOT EXISTS category_key TEXT DEFAULT 'outros';

-- Índice para queries por categoria
CREATE INDEX IF NOT EXISTS idx_transactions_category_key
  ON transactions(user_id, category_key);

CREATE INDEX IF NOT EXISTS idx_budgets_category_key
  ON budgets(user_id, category_key);

-- ================================================================
-- PRONTO! Agora transactions e budgets têm category_key (TEXT)
-- ================================================================
