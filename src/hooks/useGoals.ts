/**
 * Hook para gerenciar metas financeiras
 * Persiste dados localmente com AsyncStorage
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOALS_STORAGE_KEY = '@ContadorDeBolso:goals';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;  // ISO date
  icon: string;
  color: string;
  createdAt: string;
}

interface UseGoalsReturn {
  goals: Goal[];
  isLoading: boolean;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  addToGoal: (id: string, amount: number) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  getGoal: (id: string) => Goal | undefined;
  getTotalSaved: () => number;
}

// Metas de exemplo para novos usuários
const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal_1',
    name: 'Reserva de Emergência',
    targetAmount: 10000,
    currentAmount: 2500,
    icon: 'shield',
    color: '#10B981',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal_2',
    name: 'Viagem',
    targetAmount: 5000,
    currentAmount: 1200,
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 meses
    icon: 'plane',
    color: '#3B82F6',
    createdAt: new Date().toISOString(),
  },
];

export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar metas do AsyncStorage
  const loadGoals = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(GOALS_STORAGE_KEY);

      if (stored) {
        setGoals(JSON.parse(stored));
      } else {
        // Primeira vez - usar metas de exemplo
        setGoals(DEFAULT_GOALS);
        await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(DEFAULT_GOALS));
      }
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      setGoals(DEFAULT_GOALS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // Salvar metas no AsyncStorage
  const saveGoals = async (newGoals: Goal[]) => {
    try {
      await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(newGoals));
      setGoals(newGoals);
    } catch (error) {
      console.error('Erro ao salvar metas:', error);
      throw error;
    }
  };

  // Adicionar nova meta
  const addGoal = async (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    await saveGoals([...goals, newGoal]);
  };

  // Atualizar meta existente
  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    const newGoals = goals.map(g =>
      g.id === id ? { ...g, ...updates } : g
    );
    await saveGoals(newGoals);
  };

  // Adicionar valor a uma meta
  const addToGoal = async (id: string, amount: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
    await updateGoal(id, { currentAmount: newAmount });
  };

  // Remover meta
  const removeGoal = async (id: string) => {
    const newGoals = goals.filter(g => g.id !== id);
    await saveGoals(newGoals);
  };

  // Obter meta específica
  const getGoal = (id: string): Goal | undefined => {
    return goals.find(g => g.id === id);
  };

  // Total economizado em todas as metas
  const getTotalSaved = (): number => {
    return goals.reduce((sum, g) => sum + g.currentAmount, 0);
  };

  return {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    addToGoal,
    removeGoal,
    getGoal,
    getTotalSaved,
  };
}

export default useGoals;
