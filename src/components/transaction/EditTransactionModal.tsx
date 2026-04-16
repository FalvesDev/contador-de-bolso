/**
 * Modal para editar transação existente
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '../ui/Text';
import { XIcon, CheckIcon, TrashIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Transaction } from '../dashboard/RecentTransactions';
import { expenseCategories, incomeCategories } from '../../constants/categories';

interface EditTransactionModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Transaction>) => void;
  onDelete: (id: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  onUpdateGroup?: (groupId: string, updates: Partial<Omit<Transaction, 'id' | 'date'>>) => void;
}

export function EditTransactionModal({
  visible,
  transaction,
  onClose,
  onSave,
  onDelete,
  onDeleteGroup,
  onUpdateGroup,
}: EditTransactionModalProps) {
  const { theme } = useTheme();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [categoryId, setCategoryId] = useState('');

  // Carregar dados da transação quando o modal abre
  useEffect(() => {
    if (transaction && visible) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toFixed(2).replace('.', ','));
      setType(transaction.type);
      setCategoryId(transaction.categoryId);
    }
  }, [transaction, visible]);

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const amount = parseInt(numbers, 10) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleAmountChange = (text: string) => {
    setAmount(formatCurrency(text));
  };

  const parseAmount = (): number => {
    return parseFloat(amount.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  };

  const handleSave = () => {
    if (!description.trim()) {
      Alert.alert('Erro', 'Digite uma descrição');
      return;
    }

    const parsedAmount = parseAmount();
    if (parsedAmount <= 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    if (!categoryId) {
      Alert.alert('Erro', 'Selecione uma categoria');
      return;
    }

    if (!transaction) return;

    const updates = {
      description: description.trim(),
      amount: parsedAmount,
      type,
      categoryId,
    };

    // Se for parcela, pergunta o escopo da edição
    if (transaction.isInstallment && transaction.installmentGroupId && onUpdateGroup) {
      Alert.alert(
        'Editar parcela',
        `Esta é a parcela ${transaction.installmentNumber ?? '?'} de ${transaction.totalInstallments ?? '?'}.\n\nO que deseja editar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Só esta parcela',
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onSave(transaction.id, updates);
              onClose();
            },
          },
          {
            text: 'Todas as parcelas',
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onUpdateGroup(transaction.installmentGroupId!, updates);
              onClose();
            },
          },
        ]
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave(transaction.id, updates);
    onClose();
  };

  const handleDelete = () => {
    if (!transaction) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Se for parcela, pergunta o escopo da exclusão
    if (transaction.isInstallment && transaction.installmentGroupId) {
      const remaining = transaction.totalInstallments
        ? `${transaction.totalInstallments - (transaction.installmentNumber ?? 1)} parcelas restantes`
        : 'demais parcelas';

      Alert.alert(
        'Excluir parcela',
        `Esta é a parcela ${transaction.installmentNumber ?? '?'} de ${transaction.totalInstallments ?? '?'}.\n\nO que deseja excluir?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Só esta parcela',
            onPress: () => { onDelete(transaction.id); onClose(); },
          },
          {
            text: `Todas as parcelas (${remaining})`,
            style: 'destructive',
            onPress: () => {
              if (onDeleteGroup) {
                onDeleteGroup(transaction.installmentGroupId!);
              } else {
                onDelete(transaction.id);
              }
              onClose();
            },
          },
        ]
      );
      return;
    }

    // Transação simples
    Alert.alert(
      'Excluir transação',
      'Tem certeza que deseja excluir esta transação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => { onDelete(transaction.id); onClose(); },
        },
      ]
    );
  };

  if (!transaction) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
              <XIcon size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              Editar Transação
            </Text>
            <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
              <CheckIcon size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Tipo */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>TIPO</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    {
                      backgroundColor: type === 'expense' ? theme.colors.danger : theme.colors.backgroundSecondary,
                      borderColor: type === 'expense' ? theme.colors.danger : theme.colors.border,
                    },
                  ]}
                  onPress={() => {
                    setType('expense');
                    setCategoryId('');
                  }}
                >
                  <Text style={{ color: type === 'expense' ? '#FFF' : theme.colors.text, fontWeight: '600' }}>
                    Despesa
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    {
                      backgroundColor: type === 'income' ? theme.colors.success : theme.colors.backgroundSecondary,
                      borderColor: type === 'income' ? theme.colors.success : theme.colors.border,
                    },
                  ]}
                  onPress={() => {
                    setType('income');
                    setCategoryId('');
                  }}
                >
                  <Text style={{ color: type === 'income' ? '#FFF' : theme.colors.text, fontWeight: '600' }}>
                    Receita
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Valor */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>VALOR</Text>
              <View style={[styles.amountContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
                <Text style={[styles.currencySymbol, { color: theme.colors.textSecondary }]}>R$</Text>
                <TextInput
                  style={[styles.amountInput, { color: theme.colors.text }]}
                  value={amount}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                  placeholder="0,00"
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>
            </View>

            {/* Descrição */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>DESCRIÇÃO</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border, color: theme.colors.text }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Ex: Almoço no restaurante"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>

            {/* Categoria */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>CATEGORIA</Text>
              <View style={styles.categoriesGrid}>
                {categories.map(cat => {
                  const isSelected = categoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: isSelected ? cat.color : theme.colors.backgroundSecondary,
                          borderColor: isSelected ? cat.color : theme.colors.border,
                        },
                      ]}
                      onPress={() => setCategoryId(cat.id)}
                    >
                      <View style={[styles.categoryDot, { backgroundColor: isSelected ? '#FFF' : cat.color }]} />
                      <Text
                        style={[styles.categoryText, { color: isSelected ? '#FFF' : theme.colors.text }]}
                        numberOfLines={1}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Botão de Excluir */}
            <TouchableOpacity
              style={[styles.deleteBtn, { borderColor: theme.colors.danger }]}
              onPress={handleDelete}
            >
              <TrashIcon size={20} color={theme.colors.danger} />
              <Text style={[styles.deleteBtnText, { color: theme.colors.danger }]}>
                Excluir transação
              </Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '600',
    paddingVertical: 16,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginTop: 12,
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
