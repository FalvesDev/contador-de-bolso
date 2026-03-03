/**
 * Hook para gerenciar transações com persistência local
 * Usa AsyncStorage para salvar dados no dispositivo
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../components/dashboard/RecentTransactions';

const TRANSACTIONS_STORAGE_KEY = '@ContadorDeBolso:transactions';

// Dados iniciais de exemplo para novos usuários
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    description: 'iFood - Almoço',
    amount: 45.90,
    type: 'expense',
    categoryId: 'delivery',
    date: new Date(),
  },
  {
    id: '2',
    description: 'Posto Shell',
    amount: 200.00,
    type: 'expense',
    categoryId: 'fuel',
    date: new Date(),
  },
  {
    id: '3',
    description: 'Salário',
    amount: 5000.00,
    type: 'income',
    categoryId: 'salary',
    date: new Date(Date.now() - 86400000),
  },
  {
    id: '4',
    description: 'Netflix',
    amount: 55.90,
    type: 'expense',
    categoryId: 'streaming',
    date: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: '5',
    description: 'Mercado Extra',
    amount: 350.00,
    type: 'expense',
    categoryId: 'grocery',
    date: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: '6',
    description: 'Freelance',
    amount: 1500.00,
    type: 'income',
    categoryId: 'freelance',
    date: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: '7',
    description: 'Uber',
    amount: 32.50,
    type: 'expense',
    categoryId: 'uber',
    date: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: '8',
    description: 'Academia',
    amount: 99.90,
    type: 'expense',
    categoryId: 'gym',
    date: new Date(Date.now() - 86400000 * 5),
  },
];

interface UseLocalTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<Transaction>;
  addInstallments: (baseTransaction: Omit<Transaction, 'id'>, totalInstallments: number) => Promise<Transaction[]>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteInstallmentGroup: (groupId: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export function useLocalTransactions(): UseLocalTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar transações do AsyncStorage
  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);

      if (stored) {
        // Converter strings de data de volta para objetos Date
        const parsed = JSON.parse(stored).map((t: any) => ({
          ...t,
          date: new Date(t.date),
        }));
        setTransactions(parsed);
      } else {
        // Primeira vez - usar dados iniciais
        setTransactions(INITIAL_TRANSACTIONS);
        await saveToStorage(INITIAL_TRANSACTIONS);
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      setTransactions(INITIAL_TRANSACTIONS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Salvar no AsyncStorage
  const saveToStorage = async (data: Transaction[]) => {
    try {
      await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar transações:', error);
      throw error;
    }
  };

  // Adicionar transação única
  const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `t_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    await saveToStorage(updated);

    return newTransaction;
  };

  // Adicionar parcelamento (múltiplas transações)
  const addInstallments = async (
    baseTransaction: Omit<Transaction, 'id'>,
    totalInstallments: number
  ): Promise<Transaction[]> => {
    const groupId = `installment_${Date.now()}`;
    const newTransactions: Transaction[] = [];

    for (let i = 0; i < totalInstallments; i++) {
      const installmentDate = new Date(baseTransaction.date);
      installmentDate.setMonth(installmentDate.getMonth() + i);

      newTransactions.push({
        ...baseTransaction,
        id: `t_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
        date: installmentDate,
        isInstallment: true,
        installmentNumber: i + 1,
        totalInstallments,
        installmentGroupId: groupId,
      });
    }

    const updated = [...newTransactions, ...transactions];
    setTransactions(updated);
    await saveToStorage(updated);

    return newTransactions;
  };

  // Atualizar transação
  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const updated = transactions.map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    setTransactions(updated);
    await saveToStorage(updated);
  };

  // Deletar transação
  const deleteTransaction = async (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    await saveToStorage(updated);
  };

  // Deletar grupo de parcelas
  const deleteInstallmentGroup = async (groupId: string) => {
    const updated = transactions.filter(t => t.installmentGroupId !== groupId);
    setTransactions(updated);
    await saveToStorage(updated);
  };

  // Limpar todas as transações
  const clearAll = async () => {
    setTransactions([]);
    await AsyncStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    addInstallments,
    updateTransaction,
    deleteTransaction,
    deleteInstallmentGroup,
    clearAll,
  };
}

export default useLocalTransactions;
