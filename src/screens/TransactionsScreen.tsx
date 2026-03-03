/**
 * Tela de lista de transações - Design moderno banking
 * Com filtros avançados por período e categoria
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Transaction } from '../components/dashboard/RecentTransactions';
import { getCategoryById } from '../constants/categories';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius } from '../constants/spacing';
import { CategoryIcon, ClipboardIcon, CalendarIcon, XIcon, ChevronDownIcon, SearchIcon } from '../components/ui/Icons';

type FilterType = 'all' | 'expense' | 'income';
type PeriodType = 'all' | 'today' | 'week' | 'month' | 'year';

const PERIOD_OPTIONS: { value: PeriodType; label: string }[] = [
  { value: 'all', label: 'Todo período' },
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mês' },
  { value: 'year', label: 'Este ano' },
];

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
  const iconName = category?.icon || 'receipt';
  const iconColor = category?.color || '#64748B';

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
          { backgroundColor: iconColor + '15' },
        ]}
      >
        <CategoryIcon name={iconName} size={20} color={iconColor} />
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
  const [period, setPeriod] = useState<PeriodType>('month');
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar por busca
  const filterBySearch = (t: Transaction) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const category = getCategoryById(t.categoryId);
    return (
      t.description.toLowerCase().includes(query) ||
      (category?.name.toLowerCase().includes(query) ?? false)
    );
  };

  // Filtrar por período
  const filterByPeriod = (t: Transaction) => {
    if (period === 'all') return true;

    const transactionDate = new Date(t.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    switch (period) {
      case 'today':
        const startOfToday = new Date(today);
        startOfToday.setHours(0, 0, 0, 0);
        return transactionDate >= startOfToday && transactionDate <= today;
      case 'week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return transactionDate >= startOfWeek && transactionDate <= today;
      case 'month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return transactionDate >= startOfMonth && transactionDate <= today;
      case 'year':
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        return transactionDate >= startOfYear && transactionDate <= today;
      default:
        return true;
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => filter === 'all' || t.type === filter)
      .filter(filterByPeriod)
      .filter(filterBySearch)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions, filter, period, searchQuery]);

  const totalIncome = useMemo(() =>
    filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const totalExpense = useMemo(() =>
    filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const currentPeriodLabel = PERIOD_OPTIONS.find(p => p.value === period)?.label || 'Período';

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
          {filteredTransactions.length} de {transactions.length}
        </Text>
      </View>

      {/* Campo de Busca */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInput, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
          <SearchIcon size={18} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchTextInput, { color: theme.colors.text }]}
            placeholder="Buscar por descrição ou categoria..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <XIcon size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
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

      {/* Filtro de Período */}
      <View style={styles.periodFilter}>
        <TouchableOpacity
          style={[styles.periodBtn, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}
          onPress={() => setShowPeriodPicker(true)}
        >
          <CalendarIcon size={16} color={theme.colors.primary} />
          <Text style={[styles.periodBtnText, { color: theme.colors.text }]}>{currentPeriodLabel}</Text>
          <ChevronDownIcon size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Filtros de Tipo */}
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

      {/* Modal de Seleção de Período */}
      <Modal
        visible={showPeriodPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPeriodPicker(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPeriodPicker(false)}>
          <View style={[styles.periodModal, { backgroundColor: theme.colors.card }]}>
            <View style={[styles.periodModalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.periodModalTitle, { color: theme.colors.text }]}>Selecionar Período</Text>
              <TouchableOpacity onPress={() => setShowPeriodPicker(false)}>
                <XIcon size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            {PERIOD_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.periodOption,
                  period === option.value && { backgroundColor: theme.colors.primary + '15' }
                ]}
                onPress={() => {
                  setPeriod(option.value);
                  setShowPeriodPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.periodOptionText,
                    { color: period === option.value ? theme.colors.primary : theme.colors.text }
                  ]}
                >
                  {option.label}
                </Text>
                {period === option.value && (
                  <View style={[styles.periodCheck, { backgroundColor: theme.colors.primary }]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

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
            <View style={[styles.emptyIconContainer, { backgroundColor: theme.colors.backgroundTertiary }]}>
              <ClipboardIcon size={40} color={theme.colors.textSecondary} />
            </View>
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
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  spacer: {
    height: spacing[8],
  },
  // Estilos do campo de busca
  searchContainer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing[2],
  },
  searchTextInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: spacing[1],
  },
  // Estilos do filtro de período
  periodFilter: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
  },
  periodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: spacing[2],
  },
  periodBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Estilos do modal de período
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  periodModal: {
    width: '100%',
    maxWidth: 320,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  periodModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  periodModalTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  periodOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  periodOptionText: {
    fontSize: 16,
  },
  periodCheck: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
