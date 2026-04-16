/**
 * Tela de lista de transações - Design moderno banking
 * Com filtros avançados por período e categoria
 * COM ANIMAÇÕES
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  Easing,
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

// Chip com animação
function AnimatedFilterChip({
  label,
  isActive,
  onPress,
  activeColor,
  inactiveColor,
  inactiveBg,
  delay = 0,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  activeColor: string;
  inactiveColor: string;
  inactiveBg: string;
  delay?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }),
      ]).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 6 }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.chip,
          { backgroundColor: isActive ? activeColor : inactiveBg },
          { opacity, transform: [{ translateY }, { scale }] },
        ]}
      >
        <Text preset="label" color={isActive ? '#FFFFFF' : inactiveColor}>
          {label}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// Item de transação com animação
function AnimatedTransactionItem({
  transaction,
  onPress,
  textColor,
  secondaryColor,
  pressedColor,
  successColor,
  dangerColor,
  index,
}: {
  transaction: Transaction;
  onPress: () => void;
  textColor: string;
  secondaryColor: string;
  pressedColor: string;
  successColor: string;
  dangerColor: string;
  index: number;
}) {
  const category = getCategoryById(transaction.categoryId);
  const iconName = category?.icon || 'receipt';
  const iconColor = category?.color || '#64748B';

  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 8 }),
      ]).start();
    }, index * 50); // Stagger de 50ms por item
    return () => clearTimeout(timeout);
  }, [index]);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const formatMoney = (value: number, type: 'income' | 'expense') => {
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix} R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.transactionItem,
          { opacity, transform: [{ translateX }, { scale }] },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
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
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

// Grupo de transações animado
function AnimatedTransactionGroup({
  dateKey,
  items,
  formatGroupDate,
  onTransactionPress,
  theme,
  groupIndex,
}: {
  dateKey: string;
  items: Transaction[];
  formatGroupDate: (date: string) => string;
  onTransactionPress: (t: Transaction) => void;
  theme: any;
  groupIndex: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8, tension: 60 }),
      ]).start();
    }, groupIndex * 100); // Stagger entre grupos
    return () => clearTimeout(timeout);
  }, [groupIndex]);

  return (
    <Animated.View style={[styles.group, { opacity, transform: [{ translateY }] }]}>
      <Text preset="label" color={theme.colors.textSecondary} style={styles.groupHeader}>
        {formatGroupDate(dateKey)}
      </Text>
      <Card variant="elevated" padding="none" style={{ backgroundColor: theme.colors.card }}>
        {items.map((transaction, index) => (
          <React.Fragment key={transaction.id}>
            <AnimatedTransactionItem
              transaction={transaction}
              onPress={() => onTransactionPress(transaction)}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
              successColor={theme.colors.success}
              dangerColor={theme.colors.danger}
              index={index}
            />
            {index < items.length - 1 && (
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            )}
          </React.Fragment>
        ))}
      </Card>
    </Animated.View>
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

  // Animações de entrada
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-20)).current;
  const summaryOpacity = useRef(new Animated.Value(0)).current;
  const summaryScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(headerTranslate, { toValue: 0, useNativeDriver: true, friction: 8 }),
      ]),
      Animated.parallel([
        Animated.timing(summaryOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(summaryScale, { toValue: 1, useNativeDriver: true, friction: 6 }),
      ]),
    ]).start();
  }, []);

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
    filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const totalExpense = useMemo(() =>
    filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const currentPeriodLabel = PERIOD_OPTIONS.find(p => p.value === period)?.label || 'Período';

  // Agrupar por data
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const dateKey = transaction.date.toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
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
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Animado */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerOpacity, transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <Text preset="h3" style={{ color: theme.colors.text }}>Transações</Text>
        <Text preset="caption" color={theme.colors.textSecondary}>
          {filteredTransactions.length} de {transactions.length}
        </Text>
      </Animated.View>

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

      {/* Resumo Animado */}
      <Animated.View
        style={[
          styles.summary,
          { backgroundColor: theme.colors.backgroundSecondary },
          { opacity: summaryOpacity, transform: [{ scale: summaryScale }] },
        ]}
      >
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
      </Animated.View>

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

      {/* Filtros de Tipo Animados */}
      <View style={styles.filters}>
        <AnimatedFilterChip
          label="Todas"
          isActive={filter === 'all'}
          onPress={() => setFilter('all')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textSecondary}
          inactiveBg={theme.colors.backgroundTertiary}
          delay={200}
        />
        <AnimatedFilterChip
          label="Despesas"
          isActive={filter === 'expense'}
          onPress={() => setFilter('expense')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textSecondary}
          inactiveBg={theme.colors.backgroundTertiary}
          delay={300}
        />
        <AnimatedFilterChip
          label="Receitas"
          isActive={filter === 'income'}
          onPress={() => setFilter('income')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textSecondary}
          inactiveBg={theme.colors.backgroundTertiary}
          delay={400}
        />
      </View>

      {/* Modal de Seleção de Período */}
      <Modal
        visible={showPeriodPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPeriodPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPeriodPicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
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
                      period === option.value && { backgroundColor: theme.colors.primary + '15' },
                    ]}
                    onPress={() => {
                      setPeriod(option.value);
                      setShowPeriodPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.periodOptionText,
                        { color: period === option.value ? theme.colors.primary : theme.colors.text },
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Lista Animada */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedTransactions).map(([dateKey, items], groupIndex) => (
          <AnimatedTransactionGroup
            key={dateKey}
            dateKey={dateKey}
            items={items}
            formatGroupDate={formatGroupDate}
            onTransactionPress={onTransactionPress}
            theme={theme}
            groupIndex={groupIndex}
          />
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
