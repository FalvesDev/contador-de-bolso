/**
 * Modal para adicionar nova transação - Design moderno banking
 * Com suporte a parcelamentos e gastos recorrentes
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
import { Card } from '../ui/Card';
import { MoneyInput } from '../ui/MoneyInput';
import { TypeToggle } from './TypeToggle';
import { CategoryPicker } from './CategoryPicker';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import { XIcon, CalendarIcon, CheckIcon, CreditCardIcon, ZapIcon } from '../ui/Icons';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (transaction: {
    amount: number;
    type: 'expense' | 'income';
    categoryId: string;
    description: string;
    date: Date;
    isInstallment?: boolean;
    totalInstallments?: number;
    isRecurring?: boolean;
    recurringType?: 'monthly' | 'weekly';
  }) => void;
}

const INSTALLMENT_OPTIONS = [1, 2, 3, 4, 5, 6, 10, 12, 18, 24];

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

  // Parcelamento
  const [isInstallment, setIsInstallment] = useState(false);
  const [totalInstallments, setTotalInstallments] = useState(2);

  // Recorrência
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState<'monthly' | 'weekly'>('monthly');

  const handleSave = () => {
    if (amount <= 0 || !categoryId) return;

    onSave({
      amount: isInstallment ? amount / totalInstallments : amount,
      type,
      categoryId,
      description: description || getCategoryName(),
      date,
      isInstallment,
      totalInstallments: isInstallment ? totalInstallments : undefined,
      isRecurring,
      recurringType: isRecurring ? recurringType : undefined,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setAmount(0);
    setType('expense');
    setCategoryId(null);
    setDescription('');
    setDate(new Date());
    setIsInstallment(false);
    setTotalInstallments(2);
    setIsRecurring(false);
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

    if (d.toDateString() === today.toDateString()) return 'Hoje';
    if (d.toDateString() === yesterday.toDateString()) return 'Ontem';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const installmentValue = isInstallment && amount > 0 ? amount / totalInstallments : 0;
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
            <XIcon size={24} color={theme.colors.textSecondary} />
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
              {isInstallment ? 'Valor Total' : 'Valor'}
            </Text>
            <Card variant="outlined" padding="none" style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.border }}>
              <MoneyInput value={amount} onChange={setAmount} autoFocus />
            </Card>
            {isInstallment && amount > 0 && (
              <Text preset="caption" color={theme.colors.primary} style={styles.installmentInfo}>
                {totalInstallments}x de R$ {installmentValue.toFixed(2).replace('.', ',')}
              </Text>
            )}
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

          {/* Opções de Parcelamento e Recorrência (apenas para despesas) */}
          {type === 'expense' && (
            <View style={styles.section}>
              <Text preset="label" color={theme.colors.textSecondary} style={styles.label}>
                Tipo de Gasto
              </Text>
              <View style={styles.paymentOptions}>
                {/* Único */}
                <Pressable
                  style={[
                    styles.paymentOption,
                    {
                      backgroundColor: !isInstallment && !isRecurring ? theme.colors.primary : theme.colors.backgroundSecondary,
                      borderColor: !isInstallment && !isRecurring ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() => { setIsInstallment(false); setIsRecurring(false); }}
                >
                  <CheckIcon size={16} color={!isInstallment && !isRecurring ? '#FFF' : theme.colors.textSecondary} />
                  <Text style={{ color: !isInstallment && !isRecurring ? '#FFF' : theme.colors.text, fontSize: 13, marginLeft: 6 }}>
                    Único
                  </Text>
                </Pressable>

                {/* Parcelado */}
                <Pressable
                  style={[
                    styles.paymentOption,
                    {
                      backgroundColor: isInstallment ? theme.colors.primary : theme.colors.backgroundSecondary,
                      borderColor: isInstallment ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() => { setIsInstallment(true); setIsRecurring(false); }}
                >
                  <CreditCardIcon size={16} color={isInstallment ? '#FFF' : theme.colors.textSecondary} />
                  <Text style={{ color: isInstallment ? '#FFF' : theme.colors.text, fontSize: 13, marginLeft: 6 }}>
                    Parcelado
                  </Text>
                </Pressable>

                {/* Fixo/Recorrente */}
                <Pressable
                  style={[
                    styles.paymentOption,
                    {
                      backgroundColor: isRecurring ? theme.colors.primary : theme.colors.backgroundSecondary,
                      borderColor: isRecurring ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() => { setIsRecurring(true); setIsInstallment(false); }}
                >
                  <ZapIcon size={16} color={isRecurring ? '#FFF' : theme.colors.textSecondary} />
                  <Text style={{ color: isRecurring ? '#FFF' : theme.colors.text, fontSize: 13, marginLeft: 6 }}>
                    Fixo
                  </Text>
                </Pressable>
              </View>

              {/* Seletor de parcelas */}
              {isInstallment && (
                <View style={styles.installmentSelector}>
                  <Text preset="caption" color={theme.colors.textSecondary} style={{ marginBottom: 8 }}>
                    Número de parcelas
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.installmentOptions}>
                      {INSTALLMENT_OPTIONS.map((num) => (
                        <Pressable
                          key={num}
                          style={[
                            styles.installmentChip,
                            {
                              backgroundColor: totalInstallments === num ? theme.colors.primary : theme.colors.backgroundTertiary,
                            },
                          ]}
                          onPress={() => setTotalInstallments(num)}
                        >
                          <Text
                            style={{
                              color: totalInstallments === num ? '#FFF' : theme.colors.text,
                              fontSize: 14,
                              fontWeight: '600',
                            }}
                          >
                            {num}x
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}

              {/* Tipo de recorrência */}
              {isRecurring && (
                <View style={styles.recurringSelector}>
                  <Text preset="caption" color={theme.colors.textSecondary} style={{ marginBottom: 8 }}>
                    Repetir
                  </Text>
                  <View style={styles.recurringOptions}>
                    <Pressable
                      style={[
                        styles.recurringChip,
                        {
                          backgroundColor: recurringType === 'monthly' ? theme.colors.primary : theme.colors.backgroundTertiary,
                        },
                      ]}
                      onPress={() => setRecurringType('monthly')}
                    >
                      <Text style={{ color: recurringType === 'monthly' ? '#FFF' : theme.colors.text, fontSize: 13 }}>
                        Mensal
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.recurringChip,
                        {
                          backgroundColor: recurringType === 'weekly' ? theme.colors.primary : theme.colors.backgroundTertiary,
                        },
                      ]}
                      onPress={() => setRecurringType('weekly')}
                    >
                      <Text style={{ color: recurringType === 'weekly' ? '#FFF' : theme.colors.text, fontSize: 13 }}>
                        Semanal
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Data */}
          <View style={styles.section}>
            <Text preset="label" color={theme.colors.textSecondary} style={styles.label}>
              Data
            </Text>
            <Pressable
              style={[
                styles.dateSelector,
                { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border },
              ]}
            >
              <View style={[styles.dateIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                <CalendarIcon size={20} color={theme.colors.primary} />
              </View>
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
                { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border, color: theme.colors.text },
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
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: isValid
                  ? (pressed ? (type === 'income' ? theme.colors.success : theme.colors.primaryDark) : (type === 'income' ? theme.colors.success : theme.colors.primary))
                  : theme.colors.backgroundTertiary,
                opacity: !isValid ? 0.6 : 1,
              },
            ]}
            onPress={handleSave}
            disabled={!isValid}
          >
            {isValid && <CheckIcon size={20} color="#FFFFFF" />}
            <Text style={[styles.saveButtonText, { marginLeft: isValid ? 8 : 0 }]}>
              {isInstallment
                ? `Salvar ${totalInstallments} parcelas`
                : isRecurring
                ? 'Salvar Gasto Fixo'
                : 'Salvar Transação'}
            </Text>
          </Pressable>
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
  installmentInfo: {
    marginTop: 4,
    marginLeft: spacing[1],
    fontWeight: '600',
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  installmentSelector: {
    marginTop: spacing[3],
  },
  installmentOptions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  installmentChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
  },
  recurringSelector: {
    marginTop: spacing[3],
  },
  recurringOptions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  recurringChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
    gap: spacing[3],
  },
  dateIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
    borderRadius: borderRadius.lg,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
