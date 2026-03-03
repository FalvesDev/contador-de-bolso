/**
 * Modal para adicionar/editar orçamento de categoria
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
import { XIcon, CheckIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { getCategoryById, expenseCategories, Category } from '../../constants/categories';

interface BudgetEditModalProps {
  visible: boolean;
  categoryId?: string;  // Se undefined, é adição; se definido, é edição
  currentLimit?: number;
  onClose: () => void;
  onSave: (categoryId: string, limit: number) => void;
  onDelete?: (categoryId: string) => void;
  existingCategoryIds: string[];  // Categorias que já têm orçamento
}

export function BudgetEditModal({
  visible,
  categoryId,
  currentLimit,
  onClose,
  onSave,
  onDelete,
  existingCategoryIds,
}: BudgetEditModalProps) {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId || null);
  const [limitValue, setLimitValue] = useState(currentLimit?.toString() || '');

  const isEditing = !!categoryId;

  useEffect(() => {
    if (visible) {
      setSelectedCategory(categoryId || null);
      setLimitValue(currentLimit?.toString() || '');
    }
  }, [visible, categoryId, currentLimit]);

  const handleSave = () => {
    if (!selectedCategory) {
      Alert.alert('Erro', 'Selecione uma categoria');
      return;
    }

    const limit = parseFloat(limitValue.replace(/[^\d,]/g, '').replace(',', '.'));
    if (isNaN(limit) || limit <= 0) {
      Alert.alert('Erro', 'Informe um valor válido');
      return;
    }

    onSave(selectedCategory, limit);
    onClose();
  };

  const handleDelete = () => {
    if (!categoryId || !onDelete) return;

    Alert.alert(
      'Remover orçamento',
      'Tem certeza que deseja remover este orçamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => {
          onDelete(categoryId);
          onClose();
        }},
      ]
    );
  };

  // Categorias disponíveis para adicionar (sem as que já têm orçamento)
  const availableCategories = isEditing
    ? [getCategoryById(categoryId)].filter(Boolean)
    : expenseCategories.filter((cat: Category) => !existingCategoryIds.includes(cat.id));

  const formatCurrency = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';

    // Converte para número e formata
    const amount = parseInt(numbers, 10) / 100;
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleValueChange = (text: string) => {
    const formatted = formatCurrency(text);
    setLimitValue(formatted);
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
              {isEditing ? 'Editar Orçamento' : 'Novo Orçamento'}
            </Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <CheckIcon size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Seleção de Categoria */}
            {!isEditing && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                  SELECIONE A CATEGORIA
                </Text>
                <View style={styles.categoriesGrid}>
                  {availableCategories.map(cat => {
                    if (!cat) return null;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryChip,
                          {
                            backgroundColor: isSelected ? cat.color : theme.colors.backgroundSecondary,
                            borderColor: isSelected ? cat.color : theme.colors.border,
                          }
                        ]}
                        onPress={() => setSelectedCategory(cat.id)}
                      >
                        <View style={[styles.categoryDot, { backgroundColor: isSelected ? '#FFF' : cat.color }]} />
                        <Text style={[
                          styles.categoryChipText,
                          { color: isSelected ? '#FFF' : theme.colors.text }
                        ]}>
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {availableCategories.length === 0 && (
                  <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                    Todas as categorias já possuem orçamento definido.
                  </Text>
                )}
              </View>
            )}

            {/* Categoria selecionada (modo edição) */}
            {isEditing && selectedCategory && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                  CATEGORIA
                </Text>
                <View style={styles.selectedCategoryBox}>
                  <View style={[styles.categoryDot, { backgroundColor: getCategoryById(selectedCategory)?.color }]} />
                  <Text style={[styles.selectedCategoryText, { color: theme.colors.text }]}>
                    {getCategoryById(selectedCategory)?.name}
                  </Text>
                </View>
              </View>
            )}

            {/* Valor do Limite */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                LIMITE MENSAL
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
                <Text style={[styles.currencyPrefix, { color: theme.colors.textSecondary }]}>R$</Text>
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  value={limitValue}
                  onChangeText={handleValueChange}
                  keyboardType="numeric"
                  placeholder="0,00"
                  placeholderTextColor={theme.colors.textTertiary}
                  autoFocus={isEditing}
                />
              </View>
              <Text style={[styles.helpText, { color: theme.colors.textTertiary }]}>
                Você será alertado quando gastar 80% e 100% deste valor.
              </Text>
            </View>

            {/* Botão de remover (só no modo edição) */}
            {isEditing && onDelete && (
              <TouchableOpacity
                style={[styles.deleteBtn, { borderColor: theme.colors.danger }]}
                onPress={handleDelete}
              >
                <Text style={[styles.deleteBtnText, { color: theme.colors.danger }]}>
                  Remover orçamento
                </Text>
              </TouchableOpacity>
            )}
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
    maxHeight: '85%',
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
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
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  selectedCategoryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectedCategoryText: {
    fontSize: 16,
    fontWeight: '500',
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
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: 16,
  },
  helpText: {
    fontSize: 12,
    marginTop: 8,
  },
  deleteBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
