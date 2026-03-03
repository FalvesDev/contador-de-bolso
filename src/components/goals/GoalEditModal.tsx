/**
 * Modal para adicionar/editar meta financeira
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Text } from '../ui/Text';
import { XIcon, CheckIcon, TargetIcon, GiftIcon, TrendingUpIcon, HomeIcon, CarIcon, HeartIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Goal } from '../../hooks/useGoals';

interface GoalEditModalProps {
  visible: boolean;
  goal?: Goal;  // Se undefined, é adição; se definido, é edição
  onClose: () => void;
  onSave: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onDelete?: (id: string) => void;
  onAddAmount?: (id: string, amount: number) => void;
}

const GOAL_ICONS = [
  { id: 'shield', label: 'Emergência', Icon: TargetIcon, color: '#10B981' },
  { id: 'plane', label: 'Viagem', Icon: GiftIcon, color: '#3B82F6' },
  { id: 'trending', label: 'Investimento', Icon: TrendingUpIcon, color: '#8B5CF6' },
  { id: 'home', label: 'Casa', Icon: HomeIcon, color: '#F59E0B' },
  { id: 'car', label: 'Veículo', Icon: CarIcon, color: '#EF4444' },
  { id: 'heart', label: 'Sonho', Icon: HeartIcon, color: '#EC4899' },
];

export function GoalEditModal({
  visible,
  goal,
  onClose,
  onSave,
  onDelete,
  onAddAmount,
}: GoalEditModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(GOAL_ICONS[0]);
  const [addAmountValue, setAddAmountValue] = useState('');
  const [showAddAmount, setShowAddAmount] = useState(false);

  const isEditing = !!goal;

  useEffect(() => {
    if (visible) {
      if (goal) {
        setName(goal.name);
        setTargetValue(formatCurrency(goal.targetAmount.toString().replace('.', '')));
        setCurrentValue(formatCurrency(goal.currentAmount.toString().replace('.', '')));
        const icon = GOAL_ICONS.find(i => i.id === goal.icon) || GOAL_ICONS[0];
        setSelectedIcon(icon);
      } else {
        setName('');
        setTargetValue('');
        setCurrentValue('');
        setSelectedIcon(GOAL_ICONS[0]);
      }
      setAddAmountValue('');
      setShowAddAmount(false);
    }
  }, [visible, goal]);

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const amount = parseInt(numbers, 10) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const parseValue = (formatted: string): number => {
    return parseFloat(formatted.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Digite o nome da meta');
      return;
    }

    const target = parseValue(targetValue);
    if (target <= 0) {
      Alert.alert('Erro', 'Informe o valor da meta');
      return;
    }

    const current = parseValue(currentValue) || 0;

    onSave({
      name: name.trim(),
      targetAmount: target,
      currentAmount: Math.min(current, target),
      icon: selectedIcon.id,
      color: selectedIcon.color,
    });
    onClose();
  };

  const handleAddAmount = () => {
    if (!goal || !onAddAmount) return;

    const amount = parseValue(addAmountValue);
    if (amount <= 0) {
      Alert.alert('Erro', 'Informe um valor válido');
      return;
    }

    onAddAmount(goal.id, amount);
    setAddAmountValue('');
    setShowAddAmount(false);
    onClose();
  };

  const handleDelete = () => {
    if (!goal || !onDelete) return;

    Alert.alert(
      'Excluir meta',
      `Tem certeza que deseja excluir "${goal.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => {
          onDelete(goal.id);
          onClose();
        }},
      ]
    );
  };

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
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <XIcon size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {isEditing ? 'Editar Meta' : 'Nova Meta'}
            </Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <CheckIcon size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Nome da Meta */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                NOME DA META
              </Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border, color: theme.colors.text }]}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Reserva de emergência"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>

            {/* Ícone e Cor */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                ÍCONE
              </Text>
              <View style={styles.iconsRow}>
                {GOAL_ICONS.map(item => {
                  const isSelected = selectedIcon.id === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.iconOption,
                        { backgroundColor: isSelected ? item.color : theme.colors.backgroundSecondary }
                      ]}
                      onPress={() => setSelectedIcon(item)}
                    >
                      <item.Icon size={22} color={isSelected ? '#FFF' : item.color} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Valor da Meta */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                VALOR TOTAL DA META
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
                <Text style={[styles.currencyPrefix, { color: theme.colors.textSecondary }]}>R$</Text>
                <TextInput
                  style={[styles.valueInput, { color: theme.colors.text }]}
                  value={targetValue}
                  onChangeText={text => setTargetValue(formatCurrency(text))}
                  keyboardType="numeric"
                  placeholder="0,00"
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>
            </View>

            {/* Valor Atual (já guardado) */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                JÁ GUARDEI
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
                <Text style={[styles.currencyPrefix, { color: theme.colors.textSecondary }]}>R$</Text>
                <TextInput
                  style={[styles.valueInput, { color: theme.colors.text }]}
                  value={currentValue}
                  onChangeText={text => setCurrentValue(formatCurrency(text))}
                  keyboardType="numeric"
                  placeholder="0,00"
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>
            </View>

            {/* Adicionar valor (só no modo edição) */}
            {isEditing && onAddAmount && (
              <View style={styles.section}>
                <TouchableOpacity
                  style={[styles.addAmountBtn, { backgroundColor: theme.colors.success + '15', borderColor: theme.colors.success }]}
                  onPress={() => setShowAddAmount(!showAddAmount)}
                >
                  <Text style={[styles.addAmountBtnText, { color: theme.colors.success }]}>
                    + Adicionar valor guardado
                  </Text>
                </TouchableOpacity>

                {showAddAmount && (
                  <View style={styles.addAmountSection}>
                    <View style={[styles.inputContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
                      <Text style={[styles.currencyPrefix, { color: theme.colors.textSecondary }]}>R$</Text>
                      <TextInput
                        style={[styles.valueInput, { color: theme.colors.text }]}
                        value={addAmountValue}
                        onChangeText={text => setAddAmountValue(formatCurrency(text))}
                        keyboardType="numeric"
                        placeholder="0,00"
                        placeholderTextColor={theme.colors.textTertiary}
                        autoFocus
                      />
                    </View>
                    <TouchableOpacity
                      style={[styles.confirmAddBtn, { backgroundColor: theme.colors.success }]}
                      onPress={handleAddAmount}
                    >
                      <Text style={styles.confirmAddBtnText}>Adicionar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Botão de excluir (só no modo edição) */}
            {isEditing && onDelete && (
              <TouchableOpacity
                style={[styles.deleteBtn, { borderColor: theme.colors.danger }]}
                onPress={handleDelete}
              >
                <Text style={[styles.deleteBtnText, { color: theme.colors.danger }]}>
                  Excluir meta
                </Text>
              </TouchableOpacity>
            )}

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
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  closeBtn: {
    padding: 4,
  },
  saveBtn: {
    padding: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  textInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  iconsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '500',
    marginRight: 8,
  },
  valueInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '600',
    paddingVertical: 14,
  },
  addAmountBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  addAmountBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  addAmountSection: {
    marginTop: 12,
    gap: 10,
  },
  confirmAddBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmAddBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  deleteBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
