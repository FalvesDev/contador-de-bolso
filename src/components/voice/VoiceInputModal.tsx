/**
 * Modal de Entrada por Voz - Design moderno banking
 * Permite criar transações usando linguagem natural
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import { parseVoiceCommand, VOICE_EXAMPLES } from '../../services/voiceParser';
import { getCategoryById } from '../../constants/categories';
import {
  MicrophoneIcon,
  XIcon,
  CheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LightbulbIcon,
  CategoryIcon,
  AlertIcon,
} from '../ui/Icons';

interface VoiceInputModalProps {
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

export function VoiceInputModal({ visible, onClose, onSave }: VoiceInputModalProps) {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');
  const [parsedResult, setParsedResult] = useState<ReturnType<typeof parseVoiceCommand> | null>(null);

  // Parsear quando o texto muda
  useEffect(() => {
    if (inputText.trim().length > 2) {
      const result = parseVoiceCommand(inputText);
      setParsedResult(result);
    } else {
      setParsedResult(null);
    }
  }, [inputText]);

  const handleSave = () => {
    if (!parsedResult || parsedResult.amount === null || !parsedResult.categoryId) {
      return;
    }

    onSave({
      amount: parsedResult.amount,
      type: parsedResult.type,
      categoryId: parsedResult.categoryId,
      description: parsedResult.description,
      date: new Date(),
    });

    setInputText('');
    setParsedResult(null);
    onClose();
  };

  const handleExamplePress = (example: string) => {
    setInputText(example);
  };

  const handleClose = () => {
    setInputText('');
    setParsedResult(null);
    onClose();
  };

  const category = parsedResult?.categoryId
    ? getCategoryById(parsedResult.categoryId)
    : null;

  const isValid = parsedResult && parsedResult.amount !== null && parsedResult.categoryId !== null;
  const confidence = parsedResult?.confidence || 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <XIcon size={24} color={theme.colors.textSecondary} />
          </Pressable>
          <Text preset="h4" style={{ color: theme.colors.text }}>Entrada Rápida</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Ícone de voz */}
          <View style={styles.voiceSection}>
            <View style={[styles.voiceIcon, { backgroundColor: theme.colors.primary + '15' }]}>
              <MicrophoneIcon size={40} color={theme.colors.primary} />
            </View>
            <Text preset="bodySmall" color={theme.colors.textSecondary} center>
              Digite como você diria em voz alta
            </Text>
          </View>

          {/* Input de texto */}
          <View style={styles.inputSection}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: inputText ? theme.colors.primary : theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ex: Gastei 50 reais no mercado"
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              autoFocus
            />
          </View>

          {/* Preview do resultado */}
          {parsedResult && (
            <Card
              variant="elevated"
              style={{ backgroundColor: theme.colors.card }}
            >
              <View style={styles.previewHeader}>
                <Text preset="label" color={theme.colors.textSecondary}>
                  Interpretação
                </Text>
                <View style={[
                  styles.confidenceBadge,
                  {
                    backgroundColor: confidence > 0.7
                      ? theme.colors.success + '20'
                      : confidence > 0.4
                      ? theme.colors.warning + '20'
                      : theme.colors.danger + '20',
                  }
                ]}>
                  <Text
                    preset="caption"
                    color={confidence > 0.7
                      ? theme.colors.success
                      : confidence > 0.4
                      ? theme.colors.warning
                      : theme.colors.danger
                    }
                  >
                    {Math.round(confidence * 100)}%
                  </Text>
                </View>
              </View>

              <View style={styles.previewContent}>
                {/* Tipo */}
                <View style={styles.previewRow}>
                  <Text preset="caption" color={theme.colors.textSecondary}>Tipo:</Text>
                  <View style={[
                    styles.typeBadge,
                    { backgroundColor: parsedResult.type === 'income' ? theme.colors.success : theme.colors.danger }
                  ]}>
                    {parsedResult.type === 'income' ? (
                      <ArrowUpIcon size={12} color="#FFFFFF" />
                    ) : (
                      <ArrowDownIcon size={12} color="#FFFFFF" />
                    )}
                    <Text preset="caption" color="#FFFFFF" style={{ marginLeft: 4 }}>
                      {parsedResult.type === 'income' ? 'Receita' : 'Despesa'}
                    </Text>
                  </View>
                </View>

                {/* Valor */}
                <View style={styles.previewRow}>
                  <Text preset="caption" color={theme.colors.textSecondary}>Valor:</Text>
                  {parsedResult.amount !== null ? (
                    <Text preset="label" color={theme.colors.text}>
                      R$ {parsedResult.amount.toFixed(2).replace('.', ',')}
                    </Text>
                  ) : (
                    <View style={styles.errorRow}>
                      <AlertIcon size={14} color={theme.colors.danger} />
                      <Text preset="caption" color={theme.colors.danger} style={{ marginLeft: 4 }}>
                        Não detectado
                      </Text>
                    </View>
                  )}
                </View>

                {/* Categoria */}
                <View style={styles.previewRow}>
                  <Text preset="caption" color={theme.colors.textSecondary}>Categoria:</Text>
                  {category ? (
                    <View style={styles.categoryBadge}>
                      <CategoryIcon name={category.icon} size={16} color={category.color} />
                      <Text preset="bodySmall" color={theme.colors.text} style={{ marginLeft: 6 }}>
                        {category.name}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.errorRow}>
                      <AlertIcon size={14} color={theme.colors.danger} />
                      <Text preset="caption" color={theme.colors.danger} style={{ marginLeft: 4 }}>
                        Não detectada
                      </Text>
                    </View>
                  )}
                </View>

                {/* Descrição */}
                <View style={styles.previewRow}>
                  <Text preset="caption" color={theme.colors.textSecondary}>Descrição:</Text>
                  <Text preset="bodySmall" color={theme.colors.text} numberOfLines={1}>
                    {parsedResult.description}
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Exemplos */}
          {!inputText && (
            <View style={styles.examplesSection}>
              <View style={styles.examplesTitleRow}>
                <LightbulbIcon size={18} color={theme.colors.warning} />
                <Text preset="label" color={theme.colors.textSecondary} style={{ marginLeft: 8 }}>
                  Exemplos
                </Text>
              </View>
              <View style={styles.examplesGrid}>
                {VOICE_EXAMPLES.map((example, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.exampleChip,
                      { backgroundColor: theme.colors.backgroundTertiary }
                    ]}
                    onPress={() => handleExamplePress(example)}
                  >
                    <Text preset="caption" color={theme.colors.textSecondary}>
                      "{example}"
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Botão Salvar */}
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: isValid
                  ? (pressed ? theme.colors.primaryDark || theme.colors.primary : theme.colors.primary)
                  : theme.colors.backgroundTertiary,
                opacity: !isValid ? 0.6 : 1,
              },
            ]}
            onPress={handleSave}
            disabled={!isValid}
          >
            {isValid && <CheckIcon size={20} color="#FFFFFF" />}
            <Text style={[styles.saveButtonText, { marginLeft: isValid ? 8 : 0 }]}>
              {isValid ? "Salvar Transação" : "Complete os dados"}
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
  voiceSection: {
    alignItems: 'center',
    gap: spacing[2],
  },
  voiceIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputSection: {
    gap: spacing[2],
  },
  textInput: {
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    borderWidth: 2,
    fontSize: 18,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  confidenceBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.full,
  },
  previewContent: {
    gap: spacing[2],
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.full,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  examplesSection: {
    gap: spacing[3],
  },
  examplesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  examplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  exampleChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
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
