/**
 * Seletor de categoria com ícones
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native';
import { Text } from '../ui/Text';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import {
  getMainCategories,
  getCategoryById,
} from '../../constants/categories';

interface CategoryPickerProps {
  value: string | null;
  type: 'expense' | 'income';
  onChange: (categoryId: string) => void;
}

export function CategoryPicker({ value, type, onChange }: CategoryPickerProps) {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const categories = getMainCategories(type);
  const selectedCategory = value ? getCategoryById(value) : null;

  const handleSelect = (categoryId: string) => {
    onChange(categoryId);
    setModalVisible(false);
  };

  return (
    <>
      {/* Botão para abrir o picker */}
      <Pressable
        style={[
          styles.selector,
          {
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        {selectedCategory ? (
          <View style={styles.selectedCategory}>
            <View style={[styles.iconContainer, { backgroundColor: selectedCategory.color + '20' }]}>
              <Text style={styles.icon}>{selectedCategory.icon}</Text>
            </View>
            <Text preset="body" style={{ color: theme.colors.text }}>{selectedCategory.name}</Text>
          </View>
        ) : (
          <Text preset="body" color={theme.colors.textTertiary}>
            Selecione uma categoria
          </Text>
        )}
        <Text style={[styles.chevron, { color: theme.colors.textTertiary }]}>▼</Text>
      </Pressable>

      {/* Modal com lista de categorias */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            {/* Header do Modal */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text preset="h4" style={{ color: theme.colors.text }}>Selecione a categoria</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={[styles.closeButton, { color: theme.colors.textSecondary }]}>✕</Text>
              </Pressable>
            </View>

            {/* Lista de categorias */}
            <ScrollView style={styles.categoryList}>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      value === category.id && { backgroundColor: theme.colors.primaryLight + '30' },
                    ]}
                    onPress={() => handleSelect(category.id)}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: category.color + '20' },
                        value === category.id && { backgroundColor: category.color },
                      ]}
                    >
                      <Text style={styles.categoryEmoji}>{category.icon}</Text>
                    </View>
                    <Text
                      preset="caption"
                      color={value === category.id ? theme.colors.primary : theme.colors.text}
                      center
                      numberOfLines={1}
                    >
                      {category.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 1,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  chevron: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
  },
  closeButton: {
    fontSize: 20,
    padding: spacing[2],
  },
  categoryList: {
    padding: spacing[4],
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  categoryItem: {
    width: '22%',
    alignItems: 'center',
    padding: spacing[2],
    borderRadius: borderRadius.lg,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[1],
  },
  categoryEmoji: {
    fontSize: 24,
  },
});
