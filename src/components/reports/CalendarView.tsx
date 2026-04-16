/**
 * CalendarView - Calendário Financeiro
 * Mostra dias com transações (despesas e receitas)
 */

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '../ui/Text';
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Transaction } from '../dashboard/RecentTransactions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_SIZE = (SCREEN_WIDTH - 40 - 12) / 7; // 40 padding + 12 gaps

interface CalendarViewProps {
  transactions: Transaction[];
  onDayPress?: (date: Date, dayTransactions: Transaction[]) => void;
}

interface DayData {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  hasExpense: boolean;
  hasIncome: boolean;
  expenseTotal: number;
  incomeTotal: number;
  transactions: Transaction[];
}

export function CalendarView({ transactions, onDayPress }: CalendarViewProps) {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const currentMonth = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Gerar dias do calendário
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay();

    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Dias do mês anterior para preencher
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: DayData[] = [];

    // Dias do mês anterior
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const date = new Date(year, month - 1, dayNum);
      days.push({
        date,
        dayNumber: dayNum,
        isCurrentMonth: false,
        hasExpense: false,
        hasIncome: false,
        expenseTotal: 0,
        incomeTotal: 0,
        transactions: [],
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);

      // Filtrar transações deste dia
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getDate() === day &&
          tDate.getMonth() === month &&
          tDate.getFullYear() === year;
      });

      const expenses = dayTransactions.filter(t => t.type === 'expense');
      const incomes = dayTransactions.filter(t => t.type === 'income');

      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: true,
        hasExpense: expenses.length > 0,
        hasIncome: incomes.length > 0,
        expenseTotal: expenses.reduce((sum, t) => sum + t.amount, 0),
        incomeTotal: incomes.reduce((sum, t) => sum + t.amount, 0),
        transactions: dayTransactions,
      });
    }

    // Dias do próximo mês para completar a última semana
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: false,
        hasExpense: false,
        hasIncome: false,
        expenseTotal: 0,
        incomeTotal: 0,
        transactions: [],
      });
    }

    return days;
  }, [currentDate, transactions]);

  // Verifica se é hoje
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const handleDayPress = (day: DayData) => {
    if (day.isCurrentMonth && onDayPress) {
      onDayPress(day.date, day.transactions);
    }
  };

  // Divide em semanas
  const weeks: DayData[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      {/* Header do calendário */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <ChevronLeftIcon size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.monthLabel, { color: theme.colors.text }]}>
          {currentMonth}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <ChevronRightIcon size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Dias da semana */}
      <View style={styles.weekDaysRow}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={[styles.weekDayText, { color: theme.colors.textSecondary }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Grid de dias */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((day, dayIndex) => {
            const todayStyle = isToday(day.date);

            return (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.dayCell,
                  !day.isCurrentMonth && styles.dayCellInactive,
                  todayStyle && [styles.dayCellToday, { borderColor: theme.colors.primary }],
                ]}
                onPress={() => handleDayPress(day)}
                disabled={!day.isCurrentMonth}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    { color: day.isCurrentMonth ? theme.colors.text : theme.colors.textSecondary + '50' },
                    todayStyle && { color: theme.colors.primary, fontWeight: '700' },
                  ]}
                >
                  {day.dayNumber}
                </Text>

                {/* Indicadores de transações */}
                {day.isCurrentMonth && (day.hasExpense || day.hasIncome) && (
                  <View style={styles.indicators}>
                    {day.hasIncome && (
                      <View style={[styles.indicator, styles.incomeIndicator]} />
                    )}
                    {day.hasExpense && (
                      <View style={[styles.indicator, styles.expenseIndicator]} />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Legenda */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.incomeIndicator]} />
          <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
            Receitas
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.expenseIndicator]} />
          <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
            Despesas
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    maxHeight: 44,
  },
  dayCellInactive: {
    opacity: 0.3,
  },
  dayCellToday: {
    borderWidth: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
  },
  indicators: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 4,
    gap: 3,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  incomeIndicator: {
    backgroundColor: '#10B981',
  },
  expenseIndicator: {
    backgroundColor: '#EF4444',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
  },
});
