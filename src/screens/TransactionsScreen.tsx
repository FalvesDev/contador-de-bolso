/**
 * Tela de lista de transações
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Transaction } from '../components/dashboard/RecentTransactions';
import { getCategoryById } from '../constants/categories';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius } from '../constants/spacing';

type FilterType = 'all' | 'expense' | 'income';

interface TransactionsScreenProps {
  transactions: Transaction[];
  onTransactionPress: (transaction: Transaction) => void;
}

function FilterChip({
  label,
  isActive,
  onPress,
  activeColor,
  inactiveColor,
  inactiveBg,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  activeColor: string;
  inactiveColor: string;
  inactiveBg: string;
}) {
  return (
    <Pressable
      style={[
        styles.chip,
        { backgroundColor: isActive ? activeColor : inactiveBg },
      ]}
      onPress={onPress}
    >
      <Text
        preset="label"
        color={isActive ? '#FFFFFF' : inactiveColor}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function TransactionItem({
  transaction,
  onPress,
  textColor,
  secondaryColor,
  pressedColor,
  successColor,
  dangerColor,
}: {
  transaction: Transaction;
  onPress: () => void;
  textColor: string;
  secondaryColor: string;
  pressedColor: string;
  successColor: string;
  dangerColor: string;
}) {
  const category = getCategoryById(transaction.categoryId);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const formatMoney = (value: number, type: 'income' | 'expense') => {
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix} R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.transactionItem,
        { backgroundColor: pressed ? pressedColor : 'transparent' },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: (category?.color || '#999') + '20' },
        ]}
      >
        <Text style={styles.icon}>{category?.icon || '📦'}</Text>
      </View>

      <View style={styles.transactionInfo}>
        <Text preset="body" numberOfLines={1} style={{ color: textColor }}>
          {transaction.description}
        </Text>
        <Text preset="caption" color={secondaryColor}>
          {category?.name || 'Outros'} • {formatDate(transaction.date)}
        </Text>
      </View>

      <Text
        preset="label"
        color={transaction.type === 'income' ? successColor : dangerColor}
      >
        {formatMoney(transaction.amount, transaction.type)}
      </Text>
    </Pressable>
  );
}

export function TransactionsScreen({
  transactions,
  onTransactionPress,
}: TransactionsScreenProps) {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTransactions = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Agrupar por data
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const dateKey = transaction.date.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const formatGroupDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Hoje';
    if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text preset="h3" style={{ color: theme.colors.text }}>Transações</Text>
        <Text preset="caption" color={theme.colors.textSecondary}>
          {transactions.length} registros
        </Text>
      </View>

      {/* Resumo */}
      <View style={[styles.summary, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <View style={styles.summaryItem}>
          <Text preset="caption" color={theme.colors.textSecondary}>Receitas</Text>
          <Text preset="label" color={theme.colors.success}>
            +R$ {totalIncome.toFixed(2).replace('.', ',')}
          </Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.summaryItem}>
          <Text preset="caption" color={theme.colors.textSecondary}>Despesas</Text>
          <Text preset="label" color={theme.colors.danger}>
            -R$ {totalExpense.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        <FilterChip
          label="Todas"
          isActive={filter === 'all'}
          onPress={() => setFilter('all')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textSecondary}
          inactiveBg={theme.colors.backgroundTertiary}
        />
        <FilterChip
          label="Despesas"
          isActive={filter === 'expense'}
          onPress={() => setFilter('expense')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textSecondary}
          inactiveBg={theme.colors.backgroundTertiary}
        />
        <FilterChip
          label="Receitas"
          isActive={filter === 'income'}
          onPress={() => setFilter('income')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textSecondary}
          inactiveBg={theme.colors.backgroundTertiary}
        />
      </View>

      {/* Lista */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedTransactions).map(([dateKey, items]) => (
          <View key={dateKey} style={styles.group}>
            <Text preset="label" color={theme.colors.textSecondary} style={styles.groupHeader}>
              {formatGroupDate(dateKey)}
            </Text>
            <Card variant="elevated" padding="none" style={{ backgroundColor: theme.colors.card }}>
              {items.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <TransactionItem
                    transaction={transaction}
                    onPress={() => onTransactionPress(transaction)}
                    textColor={theme.colors.text}
                    secondaryColor={theme.colors.textSecondary}
                    pressedColor={theme.colors.backgroundTertiary}
                    successColor={theme.colors.success}
                    dangerColor={theme.colors.danger}
                  />
                  {index < items.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                  )}
                </React.Fragment>
              ))}
            </Card>
          </View>
        ))}

        {filteredTransactions.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text preset="body" color={theme.colors.textSecondary} center>
              Nenhuma transação encontrada
            </Text>
          </View>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  summary: {
    flexDirection: 'row',
    marginHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    padding: spacing[3],
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    marginHorizontal: spacing[3],
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  chip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
  },
  list: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  group: {
    marginBottom: spacing[4],
  },
  groupHeader: {
    marginBottom: spacing[2],
    marginLeft: spacing[1],
    textTransform: 'capitalize',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  icon: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
    marginRight: spacing[2],
  },
  divider: {
    height: 1,
    marginLeft: spacing[3] + 44 + spacing[3],
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing[12],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing[3],
  },
  spacer: {
    height: spacing[8],
  },
});
