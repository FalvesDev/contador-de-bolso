/**
 * DayTransactionsModal - Modal para mostrar transações de um dia específico
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { XIcon, CategoryIcon, ArrowUpIcon, ArrowDownIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Transaction } from '../dashboard/RecentTransactions';
import { getCategoryById } from '../../constants/categories';

interface DayTransactionsModalProps {
  visible: boolean;
  date: Date | null;
  transactions: Transaction[];
  onClose: () => void;
  onTransactionPress?: (transaction: Transaction) => void;
}

export function DayTransactionsModal({
  visible,
  date,
  transactions,
  onClose,
  onTransactionPress,
}: DayTransactionsModalProps) {
  const { theme } = useTheme();

  if (!date) return null;

  const formatMoney = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const dateFormatted = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <Text style={[styles.dateText, { color: theme.colors.text }]}>
                    {dateFormatted}
                  </Text>
                  <Text style={[styles.countText, { color: theme.colors.textSecondary }]}>
                    {transactions.length} transação{transactions.length !== 1 ? 'ões' : ''}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <XIcon size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Resumo */}
              {transactions.length > 0 && (
                <View style={styles.summary}>
                  {incomeTotal > 0 && (
                    <View style={[styles.summaryItem, { backgroundColor: '#10B981' + '15' }]}>
                      <ArrowUpIcon size={16} color="#10B981" />
                      <Text style={[styles.summaryText, { color: '#10B981' }]}>
                        {formatMoney(incomeTotal)}
                      </Text>
                    </View>
                  )}
                  {expenseTotal > 0 && (
                    <View style={[styles.summaryItem, { backgroundColor: '#EF4444' + '15' }]}>
                      <ArrowDownIcon size={16} color="#EF4444" />
                      <Text style={[styles.summaryText, { color: '#EF4444' }]}>
                        {formatMoney(expenseTotal)}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Lista de Transações */}
              <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                {transactions.length === 0 ? (
                  <View style={styles.empty}>
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                      Nenhuma transação neste dia
                    </Text>
                  </View>
                ) : (
                  transactions.map((transaction, index) => {
                    const category = getCategoryById(transaction.categoryId);
                    const isIncome = transaction.type === 'income';

                    return (
                      <TouchableOpacity
                        key={transaction.id}
                        style={[
                          styles.transactionItem,
                          { backgroundColor: theme.colors.card },
                          index < transactions.length - 1 && styles.transactionItemMargin,
                        ]}
                        onPress={() => onTransactionPress?.(transaction)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.categoryIcon,
                            { backgroundColor: (category?.color || theme.colors.primary) + '15' },
                          ]}
                        >
                          <CategoryIcon
                            name={category?.icon || 'receipt'}
                            size={20}
                            color={category?.color || theme.colors.primary}
                          />
                        </View>
                        <View style={styles.transactionInfo}>
                          <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>
                            {transaction.description}
                          </Text>
                          <Text style={[styles.transactionCategory, { color: theme.colors.textSecondary }]}>
                            {category?.name || 'Outros'}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.transactionAmount,
                            { color: isIncome ? '#10B981' : '#EF4444' },
                          ]}
                        >
                          {isIncome ? '+' : '-'}{formatMoney(transaction.amount)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '70%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerContent: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  countText: {
    fontSize: 13,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  summary: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  transactionItemMargin: {
    marginBottom: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  transactionCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});
