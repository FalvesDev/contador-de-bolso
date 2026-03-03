/**
 * Lista das transações recentes - Design moderno banking
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, MoneyText } from '../ui/Text';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import { getCategoryById } from '../../constants/categories';
import { CategoryIcon, ClipboardIcon } from '../ui/Icons';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  date: Date;
  // Campos para parcelamento
  isInstallment?: boolean;
  installmentNumber?: number;
  totalInstallments?: number;
  installmentGroupId?: string;
  // Campos para recorrência
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  textColor: string;
  secondaryColor: string;
  pressedColor: string;
}

function TransactionItem({ transaction, onPress, textColor, secondaryColor, pressedColor }: TransactionItemProps) {
  const category = getCategoryById(transaction.categoryId);
  const iconName = category?.icon || 'receipt';
  const categoryName = category?.name || 'Outros';
  const iconColor = category?.color || '#64748B';

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.transactionItem,
        { backgroundColor: pressed ? pressedColor : 'transparent' },
      ]}
    >
      {/* Ícone */}
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
        <CategoryIcon name={iconName} size={20} color={iconColor} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.descriptionRow}>
          <Text preset="body" numberOfLines={1} style={{ color: textColor, flex: 1 }}>
            {transaction.description}
          </Text>
          {transaction.isInstallment && (
            <View style={[styles.installmentBadge, { backgroundColor: iconColor + '20' }]}>
              <Text style={[styles.installmentText, { color: iconColor }]}>
                {transaction.installmentNumber}/{transaction.totalInstallments}
              </Text>
            </View>
          )}
          {transaction.isRecurring && (
            <View style={[styles.recurringBadge, { backgroundColor: '#3B82F6' + '20' }]}>
              <Text style={[styles.installmentText, { color: '#3B82F6' }]}>
                Fixo
              </Text>
            </View>
          )}
        </View>
        <Text preset="caption" color={secondaryColor}>
          {categoryName} • {formatDate(transaction.date)}
        </Text>
      </View>

      {/* Valor */}
      <MoneyText
        value={transaction.amount}
        type={transaction.type}
        size="small"
      />
    </Pressable>
  );
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  onSeeAll?: () => void;
  onTransactionPress?: (transaction: Transaction) => void;
}

export function RecentTransactions({
  transactions,
  onSeeAll,
  onTransactionPress,
}: RecentTransactionsProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text preset="h4" style={{ color: theme.colors.text }}>Últimas transações</Text>
        {onSeeAll && (
          <Pressable onPress={onSeeAll}>
            <Text preset="label" color={theme.colors.primary}>
              Ver todas
            </Text>
          </Pressable>
        )}
      </View>

      {/* Lista */}
      <Card variant="elevated" padding="none" style={{ ...styles.card, backgroundColor: theme.colors.card }}>
        {transactions.length === 0 ? (
          <View style={styles.empty}>
            <View style={[styles.emptyIconContainer, { backgroundColor: theme.colors.backgroundTertiary }]}>
              <ClipboardIcon size={32} color={theme.colors.textSecondary} />
            </View>
            <Text preset="body" color={theme.colors.textSecondary} center>
              Nenhuma transação ainda
            </Text>
            <Text preset="caption" color={theme.colors.textTertiary} center>
              Adicione sua primeira transação!
            </Text>
          </View>
        ) : (
          transactions.map((transaction, index) => (
            <React.Fragment key={transaction.id}>
              <TransactionItem
                transaction={transaction}
                onPress={() => onTransactionPress?.(transaction)}
                textColor={theme.colors.text}
                secondaryColor={theme.colors.textSecondary}
                pressedColor={theme.colors.backgroundTertiary}
              />
              {index < transactions.length - 1 && (
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              )}
            </React.Fragment>
          ))
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    marginTop: spacing[6],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  card: {
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  info: {
    flex: 1,
    marginRight: spacing[2],
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  installmentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recurringBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  installmentText: {
    fontSize: 10,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginLeft: spacing[4] + 44 + spacing[3],
  },
  empty: {
    padding: spacing[8],
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
});
