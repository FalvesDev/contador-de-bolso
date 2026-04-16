/**
 * Serviço de Notificações Push
 * Alertas de orçamento, lembretes e metas
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Budget } from '../hooks/useBudgets';
import { Transaction } from '../components/dashboard/RecentTransactions';
import { getCategoryById } from '../constants/categories';

const BUDGET_ALERT_THROTTLE_KEY = '@ContadorDeBolso:budgetAlertLastCheck';

// Configurar como as notificações aparecem quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Permissões ────────────────────────────────────────────────────────────────

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ─── Notificações imediatas ─────────────────────────────────────────────────

async function sendLocalNotification(title: string, body: string, data?: Record<string, unknown>) {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data ?? {},
      sound: true,
    },
    trigger: null, // imediata
  });
}

// ─── Verificações de orçamento ──────────────────────────────────────────────

export async function checkBudgetAlerts(
  budgets: Budget[],
  transactions: Transaction[]
) {
  // Throttle: só executa uma vez por hora no máximo
  const lastCheck = await AsyncStorage.getItem(BUDGET_ALERT_THROTTLE_KEY).catch(() => null);
  if (lastCheck) {
    const elapsed = Date.now() - Number(lastCheck);
    if (elapsed < 60 * 60 * 1000) return; // menos de 1 hora — pula
  }
  await AsyncStorage.setItem(BUDGET_ALERT_THROTTLE_KEY, String(Date.now())).catch(() => {});

  const now = new Date();
  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  for (const budget of budgets) {
    const spent = monthTransactions
      .filter(t => t.type === 'expense' && t.categoryId === budget.categoryId)
      .reduce((sum, t) => sum + t.amount, 0);

    const pct = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    const category = getCategoryById(budget.categoryId);
    const categoryName = category?.name ?? budget.categoryId;

    if (pct >= 100) {
      await sendLocalNotification(
        '🚨 Orçamento estourado!',
        `Você ultrapassou o limite de ${categoryName}. Gasto: R$ ${spent.toFixed(2)} / Limite: R$ ${budget.limit.toFixed(2)}`,
        { type: 'budget_exceeded', categoryId: budget.categoryId }
      );
    } else if (pct >= 80) {
      await sendLocalNotification(
        '⚠️ Orçamento próximo do limite',
        `${categoryName} está em ${pct.toFixed(0)}% do limite. Restam R$ ${(budget.limit - spent).toFixed(2)}.`,
        { type: 'budget_warning', categoryId: budget.categoryId }
      );
    }
  }
}

// ─── Notificação de transação salva ────────────────────────────────────────

export async function notifyTransactionSaved(
  amount: number,
  type: 'income' | 'expense',
  description: string,
  installments?: number
) {
  const emoji = type === 'income' ? '💰' : '💸';
  const typeLabel = type === 'income' ? 'Receita' : 'Despesa';
  const amountStr = `R$ ${amount.toFixed(2).replace('.', ',')}`;

  const body = installments && installments > 1
    ? `${installments}x de ${amountStr} — ${description}`
    : `${amountStr} — ${description}`;

  await sendLocalNotification(`${emoji} ${typeLabel} registrada`, body);
}

// ─── Lembrete diário ────────────────────────────────────────────────────────

export async function scheduleDailyReminder(hour: number = 20) {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  // Cancelar lembretes anteriores
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📊 Hora de registrar seus gastos!',
      body: 'Mantenha o controle das suas finanças. Adicione as transações de hoje.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0,
    },
  });
}

export async function cancelDailyReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ─── Notificação de meta atingida ───────────────────────────────────────────

export async function notifyGoalReached(goalName: string, targetAmount: number) {
  await sendLocalNotification(
    '🎯 Meta atingida!',
    `Parabéns! Você atingiu sua meta "${goalName}" de R$ ${targetAmount.toFixed(2)}!`
  );
}

export async function notifyGoalProgress(
  goalName: string,
  currentAmount: number,
  targetAmount: number
) {
  const pct = Math.round((currentAmount / targetAmount) * 100);
  if (pct >= 50 && pct < 100) {
    await sendLocalNotification(
      '🏦 Progresso na meta!',
      `"${goalName}" está em ${pct}%. Continue assim!`
    );
  }
}
