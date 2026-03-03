/**
 * Hook para gerenciar transações com Supabase
 * Sincroniza dados locais com a nuvem
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { transactionService, TransactionDB } from '../services/supabase';
import { Transaction } from '../components/dashboard/RecentTransactions';

// Converter TransactionDB (Supabase) para Transaction (App)
function dbToTransaction(db: TransactionDB): Transaction {
  return {
    id: db.id,
    description: db.description || '',
    amount: Number(db.amount),
    type: db.type,
    categoryId: db.category_id || 'outros',
    date: new Date(db.date),
    isInstallment: db.is_installment,
    installmentNumber: db.installment_number || undefined,
    totalInstallments: db.total_installments || undefined,
    installmentGroupId: db.installment_group_id || undefined,
    isRecurring: db.is_recurring,
    recurringType: db.recurring_type || undefined,
  };
}

// Converter Transaction (App) para formato Supabase
function transactionToDb(t: Transaction, userId: string): Omit<TransactionDB, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    category_id: t.categoryId,
    amount: t.amount,
    type: t.type,
    description: t.description,
    date: t.date.toISOString().split('T')[0],
    notes: null,
    is_installment: t.isInstallment || false,
    installment_number: t.installmentNumber || null,
    total_installments: t.totalInstallments || null,
    installment_group_id: t.installmentGroupId || null,
    is_recurring: t.isRecurring || false,
    recurring_type: t.recurringType || null,
    recurring_end_date: null,
  };
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  addInstallments: (baseTransaction: Omit<Transaction, 'id'>, totalInstallments: number) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteInstallmentGroup: (groupId: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  getMonthlyBalance: (month: number, year: number) => Promise<{ income: number; expenses: number; total: number } | null>;
}

export function useTransactions(offlineTransactions?: Transaction[]): UseTransactionsReturn {
  const { user, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(offlineTransactions || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar transações do Supabase
  const loadTransactions = useCallback(async () => {
    if (!isAuthenticated || !user) {
      // Modo offline - usar transações locais
      if (offlineTransactions) {
        setTransactions(offlineTransactions);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { transactions: dbTransactions, error: fetchError } = await transactionService.getTransactions(user.id);

      if (fetchError) {
        throw fetchError;
      }

      const mappedTransactions = dbTransactions.map(dbToTransaction);
      setTransactions(mappedTransactions);
    } catch (err: any) {
      console.error('Error loading transactions:', err);
      setError(err.message || 'Erro ao carregar transações');
      // Fallback para transações offline
      if (offlineTransactions) {
        setTransactions(offlineTransactions);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated, offlineTransactions]);

  // Carregar ao montar e quando autenticação mudar
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Adicionar transação única
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!isAuthenticated || !user) {
      // Modo offline - adicionar localmente
      const newTransaction: Transaction = {
        ...transaction,
        id: `offline_${Date.now()}`,
      };
      setTransactions(prev => [newTransaction, ...prev]);
      return;
    }

    try {
      const dbTransaction = transactionToDb(transaction as Transaction, user.id);
      const { transaction: created, error: createError } = await transactionService.createTransaction(dbTransaction);

      if (createError) throw createError;

      if (created) {
        setTransactions(prev => [dbToTransaction(created), ...prev]);
      }
    } catch (err: any) {
      console.error('Error adding transaction:', err);
      Alert.alert('Erro', 'Não foi possível salvar a transação');
      throw err;
    }
  };

  // Adicionar parcelamento (múltiplas transações)
  const addInstallments = async (baseTransaction: Omit<Transaction, 'id'>, totalInstallments: number) => {
    if (!isAuthenticated || !user) {
      // Modo offline
      const groupId = `offline_installment_${Date.now()}`;
      const newTransactions: Transaction[] = [];

      for (let i = 0; i < totalInstallments; i++) {
        const installmentDate = new Date(baseTransaction.date);
        installmentDate.setMonth(installmentDate.getMonth() + i);

        newTransactions.push({
          ...baseTransaction,
          id: `${groupId}_${i + 1}`,
          date: installmentDate,
          isInstallment: true,
          installmentNumber: i + 1,
          totalInstallments,
          installmentGroupId: groupId,
        });
      }

      setTransactions(prev => [...newTransactions, ...prev]);
      return;
    }

    try {
      const groupId = `installment_${Date.now()}`;
      const dbTransactions: Omit<TransactionDB, 'id' | 'created_at' | 'updated_at'>[] = [];

      for (let i = 0; i < totalInstallments; i++) {
        const installmentDate = new Date(baseTransaction.date);
        installmentDate.setMonth(installmentDate.getMonth() + i);

        dbTransactions.push({
          user_id: user.id,
          category_id: baseTransaction.categoryId,
          amount: baseTransaction.amount,
          type: baseTransaction.type,
          description: baseTransaction.description,
          date: installmentDate.toISOString().split('T')[0],
          notes: null,
          is_installment: true,
          installment_number: i + 1,
          total_installments: totalInstallments,
          installment_group_id: groupId,
          is_recurring: false,
          recurring_type: null,
          recurring_end_date: null,
        });
      }

      const { transactions: created, error: createError } = await transactionService.createTransactions(dbTransactions);

      if (createError) throw createError;

      if (created) {
        const newTransactions = created.map(dbToTransaction);
        setTransactions(prev => [...newTransactions, ...prev]);
      }
    } catch (err: any) {
      console.error('Error adding installments:', err);
      Alert.alert('Erro', 'Não foi possível salvar o parcelamento');
      throw err;
    }
  };

  // Atualizar transação
  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!isAuthenticated || !user) {
      // Modo offline
      setTransactions(prev =>
        prev.map(t => (t.id === id ? { ...t, ...updates } : t))
      );
      return;
    }

    try {
      const dbUpdates: any = {};
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
      if (updates.date !== undefined) dbUpdates.date = updates.date.toISOString().split('T')[0];

      const { error: updateError } = await transactionService.updateTransaction(id, dbUpdates);

      if (updateError) throw updateError;

      setTransactions(prev =>
        prev.map(t => (t.id === id ? { ...t, ...updates } : t))
      );
    } catch (err: any) {
      console.error('Error updating transaction:', err);
      Alert.alert('Erro', 'Não foi possível atualizar a transação');
      throw err;
    }
  };

  // Deletar transação
  const deleteTransaction = async (id: string) => {
    if (!isAuthenticated || !user) {
      // Modo offline
      setTransactions(prev => prev.filter(t => t.id !== id));
      return;
    }

    try {
      const { error: deleteError } = await transactionService.deleteTransaction(id);

      if (deleteError) throw deleteError;

      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      console.error('Error deleting transaction:', err);
      Alert.alert('Erro', 'Não foi possível deletar a transação');
      throw err;
    }
  };

  // Deletar grupo de parcelas
  const deleteInstallmentGroup = async (groupId: string) => {
    if (!isAuthenticated || !user) {
      // Modo offline
      setTransactions(prev => prev.filter(t => t.installmentGroupId !== groupId));
      return;
    }

    try {
      const { error: deleteError } = await transactionService.deleteInstallmentGroup(groupId);

      if (deleteError) throw deleteError;

      setTransactions(prev => prev.filter(t => t.installmentGroupId !== groupId));
    } catch (err: any) {
      console.error('Error deleting installment group:', err);
      Alert.alert('Erro', 'Não foi possível deletar o parcelamento');
      throw err;
    }
  };

  // Obter saldo mensal
  const getMonthlyBalance = async (month: number, year: number) => {
    if (!isAuthenticated || !user) {
      // Calcular localmente
      const monthTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return { income, expenses, total: income - expenses };
    }

    try {
      const { balance, error: balanceError } = await transactionService.getMonthlyBalance(user.id, month, year);

      if (balanceError) throw balanceError;

      return balance;
    } catch (err: any) {
      console.error('Error getting monthly balance:', err);
      return null;
    }
  };

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    addInstallments,
    updateTransaction,
    deleteTransaction,
    deleteInstallmentGroup,
    refreshTransactions: loadTransactions,
    getMonthlyBalance,
  };
}

export default useTransactions;
