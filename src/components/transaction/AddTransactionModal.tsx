/**
 * Modal para adicionar nova transação
 */

import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MoneyInput } from '../ui/MoneyInput';
import { TypeToggle } from './TypeToggle';
import { CategoryPicker } from './CategoryPicker';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (transaction: {
    amount: number;
    type: 'expense' | 'income';
    categoryId: string;
    description: string;
    date: Date;
  }) => void;
}

export function AddTransactionModal({
  visible,
  onClose,
  onSave,
}: AddTransactionModalProps) {
  const { theme } = useTheme();
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());

  const handleSave = () => {
    if (amount <= 0) {
      return;
    }
    if (!categoryId) {
      return;
    }

    onSave({
      amount,
      type,
      categoryId,
      description: description || getCategoryName(),
      date,
    });

    // Reset form
    setAmount(0);
    setType('expense');
    setCategoryId(null);
    setDescription('');
    setDate(new Date());
    onClose();
  };

  const getCategoryName = () => {
    const categories = require('../../constants/categories');
    const cat = categories.getCategoryById(categoryId);
    return cat?.name || 'Transação';
  };

  const formatDate = (d: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Hoje';
    }
    if (d.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isValid = amount > 0 && categoryId !== null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeIcon, { color: theme.colors.textSecondary }]}>✕</Text>
          </Pressable>
          <Text preset="h4" style={{ color: theme.colors.text }}>Nova Transação</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Toggle Despesa/Receita */}
          <TypeToggle value={type} onChange={setType} />

          {/* Valor */}
          <View style={styles.section}>
            <Text preset="label" color={theme.colors.textSecondary} style={styles.label}>
              Valor
            </Text>
            <Card variant="outlined" padding="none" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
              <MoneyInput value={amount} onChange={setAmount} autoFocus />
            </Card>
          </View>

          {/* Categoria */}
          <View style={styles.section}>
            <Text preset="label" color={theme.colors.textSecondary} style={styles.label}>
              Categoria
            </Text>
            <CategoryPicker
              value={categoryId}
              type={type}
              onChange={setCategoryId}
            />
          </View>

          {/* Data */}
          <View style={styles.section}>
            <Text preset="label" color={theme.colors.textSecondary} style={styles.label}>
              Data
            </Text>
            <Pressable
              style={[
                styles.dateSelector,
                {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={styles.dateIcon}>📅</Text>
              <Text preset="body" style={{ color: theme.colors.text }}>{formatDate(date)}</Text>
            </Pressable>
          </View>

          {/* Descrição */}
          <View style={styles.section}>
            <Text preset="label" color={theme.colors.textSecondary} style={styles.label}>
              Descrição (opcional)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Ex: Almoço no shopping"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>
        </ScrollView>

        {/* Botão Salvar */}
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <Button
            title="Salvar Transação"
            variant={type === 'income' ? 'success' : 'primary'}
            fullWidth
            onPress={handleSave}
            disabled={!isValid}
            leftIcon="✓"
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: spacing[2],
  },
  closeIcon: {
    fontSize: 20,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing[4],
    gap: spacing[4],
  },
  section: {
    gap: spacing[2],
  },
  label: {
    marginLeft: spacing[1],
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    gap: spacing[3],
  },
  dateIcon: {
    fontSize: 20,
  },
  input: {
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    fontSize: 16,
  },
  footer: {
    padding: spacing[4],
    paddingBottom: spacing[8],
    borderTopWidth: 1,
  },
});
