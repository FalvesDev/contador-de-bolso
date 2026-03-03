/**
 * Hook para gerenciar notificações e alertas
 * Sistema de alertas in-app para orçamento e metas
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../components/dashboard/RecentTransactions';
import { Budget } from './useBudgets';
import { Goal } from './useGoals';
import { getCategoryById } from '../constants/categories';

const NOTIFICATIONS_STORAGE_KEY = '@ContadorDeBolso:notifications';
const NOTIFICATION_SETTINGS_KEY = '@ContadorDeBolso:notification_settings';

export interface Notification {
  id: string;
  type: 'budget_warning' | 'budget_exceeded' | 'goal_progress' | 'goal_achieved' | 'tip';
  title: string;
  message: string;
  categoryId?: string;
  goalId?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationSettings {
  budgetAlerts: boolean;
  goalAlerts: boolean;
  tips: boolean;
  budgetWarningPercent: number; // ex: 80 = alertar em 80%
}

const DEFAULT_SETTINGS: NotificationSettings = {
  budgetAlerts: true,
  goalAlerts: true,
  tips: true,
  budgetWarningPercent: 80,
};

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  checkBudgets: (budgets: Budget[], transactions: Transaction[]) => void;
  checkGoals: (goals: Goal[]) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  updateSettings: (updates: Partial<NotificationSettings>) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);

  // Carregar notificações e configurações
  const loadData = useCallback(async () => {
    try {
      const [storedNotifs, storedSettings] = await Promise.all([
        AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY),
        AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY),
      ]);

      if (storedNotifs) {
        setNotifications(JSON.parse(storedNotifs));
      }
      if (storedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Salvar notificações
  const saveNotifications = async (newNotifs: Notification[]) => {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newNotifs));
      setNotifications(newNotifs);
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  };

  // Adicionar notificação (evita duplicatas recentes)
  const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };

    // Verifica se já existe notificação similar nas últimas 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const isDuplicate = notifications.some(
      n =>
        n.type === notif.type &&
        n.categoryId === notif.categoryId &&
        n.goalId === notif.goalId &&
        n.createdAt > oneDayAgo
    );

    if (!isDuplicate) {
      const updated = [newNotif, ...notifications].slice(0, 50); // Mantém no máximo 50
      saveNotifications(updated);
    }
  };

  // Verificar orçamentos
  const checkBudgets = (budgets: Budget[], transactions: Transaction[]) => {
    if (!settings.budgetAlerts) return;

    const today = new Date();
    const thisMonthExpenses: Record<string, number> = {};

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      if (
        t.type === 'expense' &&
        tDate.getMonth() === today.getMonth() &&
        tDate.getFullYear() === today.getFullYear()
      ) {
        thisMonthExpenses[t.categoryId] = (thisMonthExpenses[t.categoryId] || 0) + t.amount;
      }
    });

    budgets.forEach(budget => {
      const spent = thisMonthExpenses[budget.categoryId] || 0;
      const percentage = (spent / budget.limit) * 100;
      const category = getCategoryById(budget.categoryId);
      const categoryName = category?.name || 'Categoria';

      if (percentage >= 100) {
        addNotification({
          type: 'budget_exceeded',
          title: 'Orçamento excedido!',
          message: `Você ultrapassou o limite de ${categoryName}. Gasto: R$ ${spent.toFixed(2)} / R$ ${budget.limit.toFixed(2)}`,
          categoryId: budget.categoryId,
        });
      } else if (percentage >= settings.budgetWarningPercent) {
        addNotification({
          type: 'budget_warning',
          title: 'Atenção ao orçamento',
          message: `Você já gastou ${Math.round(percentage)}% do orçamento de ${categoryName}.`,
          categoryId: budget.categoryId,
        });
      }
    });
  };

  // Verificar metas
  const checkGoals = (goals: Goal[]) => {
    if (!settings.goalAlerts) return;

    goals.forEach(goal => {
      const percentage = (goal.currentAmount / goal.targetAmount) * 100;

      if (percentage >= 100) {
        addNotification({
          type: 'goal_achieved',
          title: 'Meta atingida! 🎉',
          message: `Parabéns! Você alcançou sua meta "${goal.name}"!`,
          goalId: goal.id,
        });
      } else if (percentage >= 75 && percentage < 100) {
        addNotification({
          type: 'goal_progress',
          title: 'Quase lá!',
          message: `Você está a ${Math.round(100 - percentage)}% de completar "${goal.name}".`,
          goalId: goal.id,
        });
      }
    });
  };

  // Marcar como lida
  const markAsRead = async (id: string) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    await saveNotifications(updated);
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    await saveNotifications(updated);
  };

  // Limpar notificação
  const clearNotification = async (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    await saveNotifications(updated);
  };

  // Limpar todas
  const clearAll = async () => {
    await saveNotifications([]);
  };

  // Atualizar configurações
  const updateSettings = async (updates: Partial<NotificationSettings>) => {
    try {
      const newSettings = { ...settings, ...updates };
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    settings,
    checkBudgets,
    checkGoals,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
    updateSettings,
  };
}

export default useNotifications;
