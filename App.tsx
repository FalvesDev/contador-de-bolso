/**
 * Contador de Bolso - App de Finanças Pessoais
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';

import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { Transaction } from './src/components/dashboard/RecentTransactions';
import { TabBar, TabName } from './src/components/navigation/TabBar';
import { AddTransactionModal } from './src/components/transaction/AddTransactionModal';
import { VoiceInputModal } from './src/components/voice/VoiceInputModal';

// Screens
import { HomeScreen } from './src/screens/HomeScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';
import { ReportsScreen } from './src/screens/ReportsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

// ═══════════════════════════════════════════════════════
// DADOS INICIAIS DE EXEMPLO
// ═══════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════
// MAIN APP CONTENT
// ═══════════════════════════════════════════════════════

function AppContent() {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);

  const handleSaveTransaction = (newTransaction: {
    amount: number;
    type: 'expense' | 'income';
    categoryId: string;
    description: string;
    date: Date;
  }) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      ...newTransaction,
    };

    setTransactions(prev => [transaction, ...prev]);

    Alert.alert(
      '✅ Transação salva!',
      `${newTransaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${newTransaction.amount.toFixed(2)} adicionada.`
    );
  };

  const handleTransactionPress = (transaction: Transaction) => {
    Alert.alert(
      transaction.description,
      `Valor: R$ ${transaction.amount.toFixed(2)}\nTipo: ${transaction.type === 'income' ? 'Receita' : 'Despesa'}`
    );
  };

  const handleSeeAllTransactions = () => {
    setActiveTab('transactions');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            transactions={transactions}
            onSeeAllTransactions={handleSeeAllTransactions}
            onTransactionPress={handleTransactionPress}
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
        return <ReportsScreen transactions={transactions} />;
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

      {/* Modal de Entrada por Voz */}
      <VoiceInputModal
        visible={isVoiceModalVisible}
        onClose={() => setIsVoiceModalVisible(false)}
        onSave={handleSaveTransaction}
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
});
