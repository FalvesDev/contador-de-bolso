/**
 * Hook para gerenciar orçamentos por categoria
 * Persiste dados localmente com AsyncStorage
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BUDGETS_STORAGE_KEY = '@ContadorDeBolso:budgets';

export interface Budget {
  categoryId: string;
  limit: number;
  createdAt: string;
}

interface UseBudgetsReturn {
  budgets: Budget[];
  isLoading: boolean;
  setBudget: (categoryId: string, limit: number) => Promise<void>;
  removeBudget: (categoryId: string) => Promise<void>;
  getBudget: (categoryId: string) => Budget | undefined;
  getTotalBudget: () => number;
}

// Orçamentos padrão para novos usuários
const DEFAULT_BUDGETS: Budget[] = [
  { categoryId: 'delivery', limit: 300, createdAt: new Date().toISOString() },
  { categoryId: 'grocery', limit: 800, createdAt: new Date().toISOString() },
  { categoryId: 'fuel', limit: 500, createdAt: new Date().toISOString() },
  { categoryId: 'streaming', limit: 150, createdAt: new Date().toISOString() },
];

export function useBudgets(): UseBudgetsReturn {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar orçamentos do AsyncStorage
  const loadBudgets = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(BUDGETS_STORAGE_KEY);

      if (stored) {
        setBudgets(JSON.parse(stored));
      } else {
        // Primeira vez - usar orçamentos padrão
        setBudgets(DEFAULT_BUDGETS);
        await AsyncStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(DEFAULT_BUDGETS));
      }
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      setBudgets(DEFAULT_BUDGETS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  // Salvar orçamentos no AsyncStorage
  const saveBudgets = async (newBudgets: Budget[]) => {
    try {
      await AsyncStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(newBudgets));
      setBudgets(newBudgets);
    } catch (error) {
      console.error('Erro ao salvar orçamentos:', error);
      throw error;
    }
  };

  // Definir ou atualizar orçamento de uma categoria
  const setBudget = async (categoryId: string, limit: number) => {
    const existingIndex = budgets.findIndex(b => b.categoryId === categoryId);
    let newBudgets: Budget[];

    if (existingIndex >= 0) {
      // Atualizar existente
      newBudgets = [...budgets];
      newBudgets[existingIndex] = { ...newBudgets[existingIndex], limit };
    } else {
      // Criar novo
      newBudgets = [
        ...budgets,
        { categoryId, limit, createdAt: new Date().toISOString() }
      ];
    }

    await saveBudgets(newBudgets);
  };

  // Remover orçamento de uma categoria
  const removeBudget = async (categoryId: string) => {
    const newBudgets = budgets.filter(b => b.categoryId !== categoryId);
    await saveBudgets(newBudgets);
  };

  // Obter orçamento de uma categoria específica
  const getBudget = (categoryId: string): Budget | undefined => {
    return budgets.find(b => b.categoryId === categoryId);
  };

  // Obter total de todos os orçamentos
  const getTotalBudget = (): number => {
    return budgets.reduce((sum, b) => sum + b.limit, 0);
  };

  return {
    budgets,
    isLoading,
    setBudget,
    removeBudget,
    getBudget,
    getTotalBudget,
  };
}

export default useBudgets;
