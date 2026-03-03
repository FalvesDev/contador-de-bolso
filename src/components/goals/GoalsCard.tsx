/**
 * Card de Metas Financeiras
 * Exibe metas de economia com progresso visual
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { TargetIcon, PlusIcon, TrendingUpIcon, GiftIcon, HomeIcon, CarIcon, HeartIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Goal } from '../../hooks/useGoals';

interface GoalsCardProps {
  goals: Goal[];
  onAddGoal?: () => void;
  onViewGoal?: (goal: Goal) => void;
}

// Mapeamento de ícones
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  shield: TargetIcon,
  plane: GiftIcon,
  trending: TrendingUpIcon,
  home: HomeIcon,
  car: CarIcon,
  heart: HeartIcon,
  wallet: TrendingUpIcon,
  gift: GiftIcon,
};

export function GoalsCard({ goals, onAddGoal, onViewGoal }: GoalsCardProps) {
  const { theme } = useTheme();

  const formatMoney = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  };

  const getIcon = (iconId: string) => {
    return ICON_MAP[iconId] || TargetIcon;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <TargetIcon size={20} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Minhas Metas
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.colors.primary + '15' }]}
          onPress={onAddGoal}
        >
          <PlusIcon size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {goals.length > 0 ? (
        <View style={styles.goalsGrid}>
          {goals.map((goal) => {
            const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            const remaining = goal.targetAmount - goal.currentAmount;
            const IconComponent = getIcon(goal.icon);

            return (
              <TouchableOpacity
                key={goal.id}
                style={[styles.goalCard, { backgroundColor: theme.colors.card }]}
                onPress={() => onViewGoal?.(goal)}
                activeOpacity={0.7}
              >
                <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                  <IconComponent size={20} color={goal.color} />
                </View>

                <Text style={[styles.goalName, { color: theme.colors.text }]} numberOfLines={1}>
                  {goal.name}
                </Text>

                {/* Barra de progresso */}
                <View style={[styles.progressBg, { backgroundColor: theme.colors.backgroundTertiary }]}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${percentage}%`, backgroundColor: goal.color }
                    ]}
                  />
                </View>

                <View style={styles.goalValues}>
                  <Text style={[styles.currentValue, { color: goal.color }]}>
                    {formatMoney(goal.currentAmount)}
                  </Text>
                  <Text style={[styles.targetValue, { color: theme.colors.textSecondary }]}>
                    / {formatMoney(goal.targetAmount)}
                  </Text>
                </View>

                {goal.deadline && (
                  <Text style={[styles.deadline, { color: theme.colors.textTertiary }]}>
                    Meta: {formatDate(goal.deadline)}
                  </Text>
                )}

                <Text style={[styles.remaining, { color: theme.colors.textSecondary }]}>
                  {remaining > 0 ? `Faltam ${formatMoney(remaining)}` : 'Meta atingida!'}
                </Text>

                {/* Badge de porcentagem */}
                <View style={[styles.percentBadge, { backgroundColor: goal.color + '20' }]}>
                  <Text style={[styles.percentText, { color: goal.color }]}>
                    {Math.round(percentage)}%
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Card para adicionar nova meta */}
          <TouchableOpacity
            style={[
              styles.addGoalCard,
              { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }
            ]}
            onPress={onAddGoal}
          >
            <View style={[styles.addGoalIcon, { backgroundColor: theme.colors.primary + '15' }]}>
              <PlusIcon size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.addGoalText, { color: theme.colors.primary }]}>
              Nova Meta
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Card variant="outlined" padding="lg" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.colors.primary + '15' }]}>
              <TargetIcon size={32} color={theme.colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              Defina suas metas financeiras
            </Text>
            <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
              Crie metas para economizar e acompanhe seu progresso ao longo do tempo.
            </Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: theme.colors.primary }]}
              onPress={onAddGoal}
            >
              <Text style={styles.emptyBtnText}>Criar primeira meta</Text>
            </TouchableOpacity>
          </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  goalCard: {
    width: '47%',
    padding: 14,
    borderRadius: 16,
    position: 'relative',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  goalValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  targetValue: {
    fontSize: 11,
    marginLeft: 2,
  },
  deadline: {
    fontSize: 11,
    marginBottom: 2,
  },
  remaining: {
    fontSize: 11,
  },
  percentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '600',
  },
  addGoalCard: {
    width: '47%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  addGoalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addGoalText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
