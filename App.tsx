/**
 * Contador de Bolso - App de Finanças Pessoais
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView, // eslint-disable-line deprecation/deprecation
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_MODE_KEY = '@ContadorDeBolso:offlineMode';

import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { Transaction } from './src/components/dashboard/RecentTransactions';
import { TabBar, TabName } from './src/components/navigation/TabBar';
import { AddTransactionModal } from './src/components/transaction/AddTransactionModal';
import { EditTransactionModal } from './src/components/transaction/EditTransactionModal';
import { VoiceInputModal } from './src/components/voice/VoiceInputModal';
import { BudgetEditModal } from './src/components/budget/BudgetEditModal';
import { NotificationsModal } from './src/components/notifications/NotificationsModal';
import { AuthScreen } from './src/screens/AuthScreen';

import * as Haptics from 'expo-haptics';
import {
  requestNotificationPermissions,
  checkBudgetAlerts,
  scheduleDailyReminder,
} from './src/services/notificationsService';

// Hooks
import { useLocalTransactions } from './src/hooks/useLocalTransactions';
import { useBudgets } from './src/hooks/useBudgets';
import { useGoals } from './src/hooks/useGoals';
import { useNotifications } from './src/hooks/useNotifications';

// Screens
import { HomeScreen } from './src/screens/HomeScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';
import { ReportsScreen } from './src/screens/ReportsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

// ═══════════════════════════════════════════════════════
// MAIN APP CONTENT
// ═══════════════════════════════════════════════════════

function AppContent() {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading: authLoading, signOut, user, profile } = useAuth();
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlineModeLoaded, setOfflineModeLoaded] = useState(false);

  // Persistir modo offline no AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem(OFFLINE_MODE_KEY)
      .then(val => { if (val === 'true') setIsOfflineMode(true); })
      .catch(() => {})
      .finally(() => setOfflineModeLoaded(true));
  }, []);

  const handleSetOfflineMode = async () => {
    await AsyncStorage.setItem(OFFLINE_MODE_KEY, 'true').catch(() => {});
    setIsOfflineMode(true);
  };

  // Hooks de dados (locais — sempre usados como fonte de verdade offline-first)
  const {
    transactions,
    isLoading: transactionsLoading,
    addTransaction,
    addInstallments,
    updateTransaction,
    deleteTransaction,
    deleteInstallmentGroup,
    updateInstallmentGroup,
  } = useLocalTransactions();

  const {
    budgets,
    isLoading: budgetsLoading,
    setBudget,
    removeBudget,
  } = useBudgets();

  const {
    goals,
    isLoading: goalsLoading,
  } = useGoals();

  const {
    notifications,
    unreadCount,
    checkBudgets,
    checkGoals,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll: clearAllNotifications,
  } = useNotifications();

  // Estados de UI
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editingBudgetCategoryId, setEditingBudgetCategoryId] = useState<string | undefined>();
  const [editingBudgetLimit, setEditingBudgetLimit] = useState<number | undefined>();

  // Pedir permissões de notificação ao iniciar + agendar lembrete diário
  useEffect(() => {
    requestNotificationPermissions().then(granted => {
      if (granted) scheduleDailyReminder(20);
    });
  }, []);

  // Verificar alertas de orçamento via notificação push quando transações mudam
  useEffect(() => {
    if (!transactionsLoading && !budgetsLoading && budgets.length > 0) {
      checkBudgetAlerts(budgets, transactions);
    }
  }, [transactions, budgets, transactionsLoading, budgetsLoading]);

  // Verificar orçamentos e metas nas notificações internas
  useEffect(() => {
    if (!transactionsLoading && !budgetsLoading) {
      checkBudgets(budgets, transactions);
    }
  }, [transactions, budgets, transactionsLoading, budgetsLoading, checkBudgets]);

  useEffect(() => {
    if (!goalsLoading) {
      checkGoals(goals);
    }
  }, [goals, goalsLoading, checkGoals]);

  // ── Aguardar verificação de sessão e modo offline ─────
  if (authLoading || !offlineModeLoaded) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // ── Mostrar tela de login se não autenticado e não escolheu modo offline ──
  if (!isAuthenticated && !isOfflineMode) {
    return (
      <AuthScreen
        onOfflineMode={handleSetOfflineMode}
      />
    );
  }

  // Loading de dados
  const isLoading = transactionsLoading || budgetsLoading || goalsLoading;

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // ── Handlers de transação ─────────────────────────────

  const handleSaveTransaction = async (newTransaction: {
    amount: number;
    type: 'expense' | 'income';
    categoryId: string;
    description: string;
    date: Date;
    isInstallment?: boolean;
    totalInstallments?: number;
    isRecurring?: boolean;
    recurringType?: 'monthly' | 'weekly';
  }) => {
    try {
      if (newTransaction.isInstallment && newTransaction.totalInstallments) {
        await addInstallments(
          {
            amount: newTransaction.amount,
            type: newTransaction.type,
            categoryId: newTransaction.categoryId,
            description: newTransaction.description,
            date: newTransaction.date,
          },
          newTransaction.totalInstallments
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Parcelamento salvo!',
          `${newTransaction.totalInstallments}x de R$ ${newTransaction.amount.toFixed(2)} adicionadas.`
        );
      } else if (newTransaction.isRecurring) {
        await addTransaction({
          amount: newTransaction.amount,
          type: newTransaction.type,
          categoryId: newTransaction.categoryId,
          description: newTransaction.description,
          date: newTransaction.date,
          isRecurring: true,
          recurringType: newTransaction.recurringType,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Gasto fixo salvo!',
          `R$ ${newTransaction.amount.toFixed(2)} ${newTransaction.recurringType === 'monthly' ? 'mensal' : 'semanal'} adicionado.`
        );
      } else {
        await addTransaction({
          amount: newTransaction.amount,
          type: newTransaction.type,
          categoryId: newTransaction.categoryId,
          description: newTransaction.description,
          date: newTransaction.date,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Transação salva!',
          `${newTransaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${newTransaction.amount.toFixed(2)} adicionada.`
        );
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erro', 'Não foi possível salvar a transação.');
    }
  };

  const handleTransactionPress = (transaction: Transaction) => {
    Haptics.selectionAsync();
    setSelectedTransaction(transaction);
    setIsEditModalVisible(true);
  };

  const handleUpdateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      await updateTransaction(id, updates);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a transação.');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a transação.');
    }
  };

  // ── Handlers de orçamento ─────────────────────────────

  const handleEditBudget = (categoryId: string, currentLimit: number) => {
    setEditingBudgetCategoryId(categoryId);
    setEditingBudgetLimit(currentLimit);
    setIsBudgetModalVisible(true);
  };

  const handleAddBudget = () => {
    setEditingBudgetCategoryId(undefined);
    setEditingBudgetLimit(undefined);
    setIsBudgetModalVisible(true);
  };

  const handleSaveBudget = async (categoryId: string, limit: number) => {
    try {
      await setBudget(categoryId, limit);
      setIsBudgetModalVisible(false);
      Alert.alert('Sucesso', 'Orçamento salvo!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o orçamento.');
    }
  };

  const handleDeleteBudget = async (categoryId: string) => {
    try {
      await removeBudget(categoryId);
      setIsBudgetModalVisible(false);
      Alert.alert('Sucesso', 'Orçamento removido!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o orçamento.');
    }
  };

  // ── Logout ────────────────────────────────────────────

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      isAuthenticated
        ? 'Deseja sair? Seus dados locais serão mantidos.'
        : 'Deseja voltar para a tela de login?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            if (isAuthenticated) {
              await signOut();
            }
            await AsyncStorage.removeItem(OFFLINE_MODE_KEY).catch(() => {});
            setIsOfflineMode(false);
          },
        },
      ]
    );
  };

  // ── Render ────────────────────────────────────────────

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            transactions={transactions}
            budgets={budgets}
            goals={goals}
            unreadNotifications={unreadCount}
            onSeeAllTransactions={() => setActiveTab('transactions')}
            onTransactionPress={handleTransactionPress}
            onNotificationsPress={() => setIsNotificationsVisible(true)}
          />
        );
      case 'transactions':
        return (
          <TransactionsScreen
            transactions={transactions}
            onTransactionPress={handleTransactionPress}
          />
        );
      case 'reports':
        return (
          <ReportsScreen
            transactions={transactions}
            budgets={budgets}
            goals={goals}
            onEditBudget={handleEditBudget}
            onAddBudget={handleAddBudget}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onLogout={handleLogout}
            transactions={transactions}
            userName={profile?.name ?? user?.email ?? undefined}
            userEmail={user?.email ?? undefined}
            isAuthenticated={isAuthenticated}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <View style={styles.content}>
        {renderScreen()}
      </View>

      <TabBar
        activeTab={activeTab}
        onTabPress={setActiveTab}
        onAddPress={() => setIsModalVisible(true)}
        onAddLongPress={() => setIsVoiceModalVisible(true)}
      />

      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveTransaction}
      />

      <EditTransactionModal
        visible={isEditModalVisible}
        transaction={selectedTransaction}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedTransaction(null);
        }}
        onSave={handleUpdateTransaction}
        onDelete={handleDeleteTransaction}
        onDeleteGroup={deleteInstallmentGroup}
        onUpdateGroup={updateInstallmentGroup}
      />

      <VoiceInputModal
        visible={isVoiceModalVisible}
        onClose={() => setIsVoiceModalVisible(false)}
        onSave={handleSaveTransaction}
      />

      <BudgetEditModal
        visible={isBudgetModalVisible}
        categoryId={editingBudgetCategoryId}
        currentLimit={editingBudgetLimit}
        existingCategoryIds={budgets.map(b => b.categoryId)}
        onClose={() => setIsBudgetModalVisible(false)}
        onSave={handleSaveBudget}
        onDelete={editingBudgetCategoryId ? handleDeleteBudget : undefined}
      />

      <NotificationsModal
        visible={isNotificationsVisible}
        notifications={notifications}
        onClose={() => setIsNotificationsVisible(false)}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onClear={clearNotification}
        onClearAll={clearAllNotifications}
      />
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP COM PROVIDERS
// ═══════════════════════════════════════════════════════

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

// ═══════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
