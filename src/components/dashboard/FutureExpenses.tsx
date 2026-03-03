/**
 * Componente de Gastos Futuros - Previsão dos próximos meses
 * Mostra parcelas pendentes e gastos recorrentes
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { CalendarIcon, CreditCardIcon, ZapIcon, ChevronRightIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Transaction } from './RecentTransactions';

interface FutureExpensesProps {
  transactions: Transaction[];
  onViewDetails?: () => void;
}

interface MonthProjection {
  month: string;
  monthNumber: number;
  year: number;
  installments: number;
  recurring: number;
  total: number;
}

export function FutureExpenses({ transactions, onViewDetails }: FutureExpensesProps) {
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);

  // Calcular projeções para os próximos 6 meses
  const getProjections = (): MonthProjection[] => {
    const projections: MonthProjection[] = [];
    const today = new Date();

    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthName = futureDate.toLocaleDateString('pt-BR', { month: 'short' });

      let installmentsTotal = 0;
      let recurringTotal = 0;

      transactions.forEach(t => {
        // Parcelas futuras
        if (t.isInstallment && t.installmentGroupId && t.installmentNumber && t.totalInstallments) {
          const installmentDate = new Date(t.date);
          if (installmentDate.getMonth() === futureDate.getMonth() &&
              installmentDate.getFullYear() === futureDate.getFullYear()) {
            installmentsTotal += t.amount;
          }
        }

        // Gastos recorrentes (mensal)
        if (t.isRecurring && t.recurringType === 'monthly' && t.type === 'expense') {
          recurringTotal += t.amount;
        }
      });

      projections.push({
        month: monthName,
        monthNumber: futureDate.getMonth(),
        year: futureDate.getFullYear(),
        installments: installmentsTotal,
        recurring: recurringTotal,
        total: installmentsTotal + recurringTotal,
      });
    }

    return projections;
  };

  const projections = getProjections();
  const displayedProjections = showAll ? projections : projections.slice(0, 3);
  const hasAnyFutureExpense = projections.some(p => p.total > 0);

  // Contar compromissos ativos
  const activeInstallments = transactions.filter(t =>
    t.isInstallment &&
    new Date(t.date) >= new Date()
  ).length;

  const activeRecurring = transactions.filter(t => t.isRecurring && t.type === 'expense').length;

  const formatMoney = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Compromissos Futuros
        </Text>
        {onViewDetails && (
          <TouchableOpacity onPress={onViewDetails} style={styles.viewAllBtn}>
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
              Detalhes
            </Text>
            <ChevronRightIcon size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Cards de resumo */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.iconBg, { backgroundColor: theme.colors.primary + '20' }]}>
            <CreditCardIcon size={18} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Parcelas
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {activeInstallments} ativas
            </Text>
          </View>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.iconBg, { backgroundColor: '#F59E0B20' }]}>
            <ZapIcon size={18} color="#F59E0B" />
          </View>
          <View>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Fixos
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {activeRecurring} ativos
            </Text>
          </View>
        </View>
      </View>

      {/* Projeção mensal */}
      {hasAnyFutureExpense ? (
        <Card variant="elevated" padding="md" style={{ backgroundColor: theme.colors.card }}>
          <View style={styles.projectionHeader}>
            <CalendarIcon size={18} color={theme.colors.textSecondary} />
            <Text style={[styles.projectionTitle, { color: theme.colors.textSecondary }]}>
              Previsão de gastos comprometidos
            </Text>
          </View>

          {displayedProjections.map((proj, index) => (
            <View
              key={`${proj.monthNumber}-${proj.year}`}
              style={[
                styles.projectionRow,
                index < displayedProjections.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border
                }
              ]}
            >
              <Text style={[styles.monthName, { color: theme.colors.text }]}>
                {proj.month.charAt(0).toUpperCase() + proj.month.slice(1)}
              </Text>
              <View style={styles.projectionValues}>
                {proj.installments > 0 && (
                  <View style={styles.valueTag}>
                    <CreditCardIcon size={12} color={theme.colors.primary} />
                    <Text style={[styles.valueText, { color: theme.colors.primary }]}>
                      {formatMoney(proj.installments)}
                    </Text>
                  </View>
                )}
                {proj.recurring > 0 && (
                  <View style={styles.valueTag}>
                    <ZapIcon size={12} color="#F59E0B" />
                    <Text style={[styles.valueText, { color: '#F59E0B' }]}>
                      {formatMoney(proj.recurring)}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.totalValue, { color: theme.colors.text }]}>
                {formatMoney(proj.total)}
              </Text>
            </View>
          ))}

          {projections.length > 3 && (
            <TouchableOpacity
              style={styles.showMoreBtn}
              onPress={() => setShowAll(!showAll)}
            >
              <Text style={[styles.showMoreText, { color: theme.colors.primary }]}>
                {showAll ? 'Ver menos' : `Ver mais ${projections.length - 3} meses`}
              </Text>
            </TouchableOpacity>
          )}
        </Card>
      ) : (
        <Card variant="outlined" padding="md" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Nenhum compromisso futuro cadastrado.
            {'\n'}Adicione gastos parcelados ou fixos para ver a previsão.
          </Text>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '500',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  projectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  projectionTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  projectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  monthName: {
    fontSize: 14,
    fontWeight: '500',
    width: 50,
  },
  projectionValues: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 8,
  },
  valueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueText: {
    fontSize: 12,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    minWidth: 80,
  },
  showMoreBtn: {
    paddingTop: 12,
    alignItems: 'center',
  },
  showMoreText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
