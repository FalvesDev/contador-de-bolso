/**
 * Toggle para selecionar tipo de transação (Despesa/Receita)
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';

type TransactionType = 'expense' | 'income';

interface TypeToggleProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

export function TypeToggle({ value, onChange }: TypeToggleProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroundTertiary }]}>
      <Pressable
        style={[
          styles.option,
          value === 'expense' && { backgroundColor: theme.colors.danger },
        ]}
        onPress={() => onChange('expense')}
      >
        <Text style={[styles.icon, { color: value === 'expense' ? '#FFFFFF' : theme.colors.textSecondary }]}>↓</Text>
        <Text
          preset="label"
          color={value === 'expense' ? '#FFFFFF' : theme.colors.textSecondary}
        >
          Despesa
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.option,
          value === 'income' && { backgroundColor: theme.colors.success },
        ]}
        onPress={() => onChange('income')}
      >
        <Text style={[styles.icon, { color: value === 'income' ? '#FFFFFF' : theme.colors.textSecondary }]}>↑</Text>
        <Text
          preset="label"
          color={value === 'income' ? '#FFFFFF' : theme.colors.textSecondary}
        >
          Receita
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: spacing[1],
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    gap: spacing[2],
  },
  icon: {
    fontSize: 16,
  },
});
