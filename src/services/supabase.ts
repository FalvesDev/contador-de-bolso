/**
 * Configuração e cliente Supabase
 * Contador de Bolso - App de Finanças Pessoais
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração Supabase - Contador de Bolso
const SUPABASE_URL = 'https://begenzevxnqgwqwqeclp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlZ2VuemV2eG5xZ3dxd3FlY2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDcyNzEsImV4cCI6MjA4ODA4MzI3MX0.xxOlAcMgyEs8FToShmH2uaKvVjlHVGaaDIJx5WA1Kq0';

// Criar cliente Supabase com persistência de sessão
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// =============================================
// TIPOS DO BANCO DE DADOS
// =============================================

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  monthly_income: number;
  monthly_budget: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
  is_system: boolean;
  created_at: string;
}

export interface TransactionDB {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  type: 'expense' | 'income';
  description: string | null;
  date: string;
  notes: string | null;
  is_installment: boolean;
  installment_number: number | null;
  total_installments: number | null;
  installment_group_id: string | null;
  is_recurring: boolean;
  recurring_type: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  recurring_end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  period: 'monthly' | 'weekly';
  month: number | null;
  year: number | null;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  icon: string;
  color: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================
// FUNÇÕES DE AUTENTICAÇÃO
// =============================================

export const authService = {
  // Registrar novo usuário
  async signUp(email: string, password: string, name?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    return { data, error };
  },

  // Login com email/senha
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Obter sessão atual
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },

  // Obter usuário atual
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  },

  // Recuperar senha
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },

  // Listener de mudanças de autenticação
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// =============================================
// FUNÇÕES DE PERFIL
// =============================================

export const profileService = {
  // Obter perfil do usuário
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { profile: data as Profile | null, error };
  },

  // Atualizar perfil
  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('id', userId)
      .select()
      .single();
    return { profile: data as Profile | null, error };
  },
};

// =============================================
// FUNÇÕES DE CATEGORIAS
// =============================================

export const categoryService = {
  // Listar todas as categorias (sistema + usuário)
  async getCategories(userId?: string) {
    let query = supabase.from('categories').select('*');

    if (userId) {
      query = query.or(`is_system.eq.true,user_id.eq.${userId}`);
    } else {
      query = query.eq('is_system', true);
    }

    const { data, error } = await query.order('name');
    return { categories: (data as Category[]) || [], error };
  },

  // Criar categoria personalizada
  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'is_system'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, is_system: false } as any)
      .select()
      .single();
    return { category: data as Category | null, error };
  },

  // Atualizar categoria
  async updateCategory(id: string, updates: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    return { category: data as Category | null, error };
  },

  // Deletar categoria
  async deleteCategory(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    return { error };
  },
};

// =============================================
// FUNÇÕES DE TRANSAÇÕES
// =============================================

export const transactionService = {
  // Listar transações do usuário
  async getTransactions(userId: string, options?: {
    startDate?: string;
    endDate?: string;
    type?: 'expense' | 'income';
    categoryId?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (options?.startDate) {
      query = query.gte('date', options.startDate);
    }
    if (options?.endDate) {
      query = query.lte('date', options.endDate);
    }
    if (options?.type) {
      query = query.eq('type', options.type);
    }
    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    return { transactions: (data as TransactionDB[]) || [], error };
  },

  // Criar transação
  async createTransaction(transaction: Omit<TransactionDB, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction as any)
      .select()
      .single();
    return { transaction: data as TransactionDB | null, error };
  },

  // Criar múltiplas transações (parcelamento)
  async createTransactions(transactions: Omit<TransactionDB, 'id' | 'created_at' | 'updated_at'>[]) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactions as any)
      .select();
    return { transactions: (data as TransactionDB[]) || [], error };
  },

  // Atualizar transação
  async updateTransaction(id: string, updates: Partial<TransactionDB>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    return { transaction: data as TransactionDB | null, error };
  },

  // Deletar transação
  async deleteTransaction(id: string) {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    return { error };
  },

  // Deletar grupo de parcelas
  async deleteInstallmentGroup(groupId: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('installment_group_id', groupId);
    return { error };
  },

  // Obter resumo mensal
  async getMonthlyBalance(userId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('transactions')
      .select('type, amount')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) return { balance: null, error };

    const transactions = data as { type: string; amount: number }[];

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      balance: {
        income,
        expenses,
        total: income - expenses,
      },
      error: null,
    };
  },

  // Obter gastos por categoria
  async getExpensesByCategory(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('category_id, amount, categories(name, color, icon)')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) return { expenses: [], error };

    // Agrupar por categoria
    const grouped: Record<string, { name: string; color: string; icon: string; total: number }> = {};

    (data as any[]).forEach((t) => {
      const catId = t.category_id || 'outros';
      if (!grouped[catId]) {
        grouped[catId] = {
          name: t.categories?.name || 'Outros',
          color: t.categories?.color || '#64748B',
          icon: t.categories?.icon || 'receipt',
          total: 0,
        };
      }
      grouped[catId].total += Number(t.amount);
    });

    const expenses = Object.entries(grouped)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.total - a.total);

    return { expenses, error: null };
  },
};

// =============================================
// FUNÇÕES DE ORÇAMENTO
// =============================================

export const budgetService = {
  // Listar orçamentos do usuário
  async getBudgets(userId: string, month?: number, year?: number) {
    let query = supabase
      .from('budgets')
      .select('*, categories(*)')
      .eq('user_id', userId);

    if (month && year) {
      query = query.eq('month', month).eq('year', year);
    }

    const { data, error } = await query;
    return { budgets: (data as Budget[]) || [], error };
  },

  // Criar/atualizar orçamento
  async upsertBudget(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('budgets')
      .upsert(budget as any, {
        onConflict: 'user_id,category_id,month,year',
      })
      .select()
      .single();
    return { budget: data as Budget | null, error };
  },

  // Deletar orçamento
  async deleteBudget(id: string) {
    const { error } = await supabase.from('budgets').delete().eq('id', id);
    return { error };
  },
};

// =============================================
// FUNÇÕES DE METAS
// =============================================

export const goalService = {
  // Listar metas do usuário
  async getGoals(userId: string) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('deadline', { ascending: true });
    return { goals: (data as Goal[]) || [], error };
  },

  // Criar meta
  async createGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at' | 'is_completed'>) {
    const { data, error } = await supabase
      .from('goals')
      .insert({ ...goal, is_completed: false } as any)
      .select()
      .single();
    return { goal: data as Goal | null, error };
  },

  // Atualizar meta
  async updateGoal(id: string, updates: Partial<Goal>) {
    const { data, error } = await supabase
      .from('goals')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    return { goal: data as Goal | null, error };
  },

  // Adicionar valor à meta
  async addToGoal(id: string, amount: number) {
    const { data: goal, error: fetchError } = await supabase
      .from('goals')
      .select('current_amount, target_amount')
      .eq('id', id)
      .single();

    if (fetchError) return { goal: null, error: fetchError };

    const goalData = goal as { current_amount: number; target_amount: number };
    const newAmount = Number(goalData.current_amount) + amount;
    const isCompleted = newAmount >= Number(goalData.target_amount);

    const { data, error } = await supabase
      .from('goals')
      .update({
        current_amount: newAmount,
        is_completed: isCompleted,
      } as any)
      .eq('id', id)
      .select()
      .single();

    return { goal: data as Goal | null, error };
  },

  // Deletar meta
  async deleteGoal(id: string) {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    return { error };
  },
};

export default supabase;
