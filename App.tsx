/**
 * Contador de Bolso - App de Finanças Pessoais
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { Transaction } from './src/components/dashboard/RecentTransactions';
import { TabBar, TabName } from './src/components/navigation/TabBar';
import { AddTransactionModal } from './src/components/transaction/AddTransactionModal';
import { EditTransactionModal } from './src/components/transaction/EditTransactionModal';
import { VoiceInputModal } from './src/components/voice/VoiceInputModal';
import { BudgetEditModal } from './src/components/budget/BudgetEditModal';
import { NotificationsModal } from './src/components/notifications/NotificationsModal';

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

  // Hooks de dados
  const {
    transactions,
    isLoading: transactionsLoading,
    addTransaction,
    addInstallments,
    updateTransaction,
    deleteTransaction,
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
    addGoal,
    updateGoal,
    removeGoal,
  } = useGoals();

  const {
    notifications,
    unreadCount,
    settings: notificationSettings,
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

  // Verificar orçamentos e metas quando transações mudam
  useEffect(() => {
    if (!transactionsLoading && !budgetsLoading) {
      checkBudgets(budgets, transactions);
    }
  }, [transactions, budgets, transactionsLoading, budgetsLoading]);

  useEffect(() => {
    if (!goalsLoading) {
      checkGoals(goals);
    }
  }, [goals, goalsLoading]);

  // Loading inicial
  const isLoading = transactionsLoading || budgetsLoading || goalsLoading;

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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

        Alert.alert(
          'Transação salva!',
          `${newTransaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${newTransaction.amount.toFixed(2)} adicionada.`
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a transação.');
    }
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalVisible(true);
  };

  const handleUpdateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      await updateTransaction(id, updates);
      Alert.alert('Sucesso', 'Transação atualizada!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a transação.');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      Alert.alert('Sucesso', 'Transação excluída!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a transação.');
    }
  };

  const handleSeeAllTransactions = () => {
    setActiveTab('transactions');
  };

  // Handlers de orçamento
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

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            transactions={transactions}
            budgets={budgets}
            goals={goals}
            unreadNotifications={unreadCount}
            onSeeAllTransactions={handleSeeAllTransactions}
            onTransactionPress={handleTransactionPress}
            onNotificationsPress={() => setIsNotificationsVisible(true)}
            onEditBudget={handleEditBudget}
            onAddBudget={handleAddBudget}
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
            onLogout={() => Alert.alert('Logout', 'Funcionalidade em breve!')}
            transactions={transactions}
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

      {/* Conteúdo da tela atual */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Barra de navegação */}
      <TabBar
        activeTab={activeTab}
        onTabPress={setActiveTab}
        onAddPress={() => setIsModalVisible(true)}
        onAddLongPress={() => setIsVoiceModalVisible(true)}
      />

      {/* Modal de Adicionar Transação */}
      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveTransaction}
      />

      {/* Modal de Editar Transação */}
      <EditTransactionModal
        visible={isEditModalVisible}
        transaction={selectedTransaction}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedTransaction(null);
        }}
        onSave={handleUpdateTransaction}
        onDelete={handleDeleteTransaction}
      />

      {/* Modal de Entrada por Voz */}
      <VoiceInputModal
        visible={isVoiceModalVisible}
        onClose={() => setIsVoiceModalVisible(false)}
        onSave={handleSaveTransaction}
      />

      {/* Modal de Orçamento */}
      <BudgetEditModal
        visible={isBudgetModalVisible}
        categoryId={editingBudgetCategoryId}
        currentLimit={editingBudgetLimit}
        existingCategoryIds={budgets.map(b => b.categoryId)}
        onClose={() => setIsBudgetModalVisible(false)}
        onSave={handleSaveBudget}
        onDelete={editingBudgetCategoryId ? handleDeleteBudget : undefined}
      />

      {/* Modal de Notificações */}
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
      <AppContent />
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
