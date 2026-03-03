/**
 * Seletor de Temas - Design moderno banking
 */

import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Text } from '../ui/Text';
import { useTheme, themes, Theme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../constants/spacing';
import { XIcon, CheckIcon, ZapIcon, MoonIcon, SunIcon, LightbulbIcon } from '../ui/Icons';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

function ThemeCard({ theme, isSelected, onSelect }: {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.themeCard,
        {
          backgroundColor: theme.colors.card,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          borderWidth: isSelected ? 3 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
      onPress={onSelect}
    >
      {/* Preview do tema */}
      <View style={[styles.preview, { backgroundColor: theme.colors.background }]}>
        {/* Header simulado */}
        <View style={[styles.previewHeader, { backgroundColor: theme.colors.primary }]}>
          <View style={[styles.previewDot, { backgroundColor: theme.colors.textInverse }]} />
        </View>

        {/* Cards simulados */}
        <View style={styles.previewContent}>
          <View style={[styles.previewCard, { backgroundColor: theme.colors.card }]}>
            <View style={[styles.previewLine, { backgroundColor: theme.colors.primary, width: '60%' }]} />
            <View style={[styles.previewLine, { backgroundColor: theme.colors.textTertiary, width: '40%' }]} />
          </View>
          <View style={styles.previewRow}>
            <View style={[styles.previewSmallCard, { backgroundColor: theme.colors.success }]} />
            <View style={[styles.previewSmallCard, { backgroundColor: theme.colors.danger }]} />
          </View>
        </View>
      </View>

      {/* Info do tema */}
      <View style={styles.themeInfo}>
        <View style={[styles.themeColorDot, { backgroundColor: theme.colors.primary }]} />
        <Text
          preset="bodySmall"
          style={{ color: theme.colors.text, flex: 1 }}
        >
          {theme.name}
        </Text>
        {isSelected && (
          <View style={[styles.checkmark, { backgroundColor: theme.colors.primary }]}>
            <CheckIcon size={12} color="#FFFFFF" />
          </View>
        )}
      </View>
    </Pressable>
  );
}

export function ThemeSelector({ visible, onClose }: ThemeSelectorProps) {
  const { theme: currentTheme, setThemeById } = useTheme();

  // Separar temas por categoria
  const lightThemes = themes.filter(t => !t.isDark && !['cyberpunk', 'matrix', 'neon', 'synthwave', 'tron', 'hacker', 'hologram'].includes(t.id));
  const darkThemes = themes.filter(t => t.isDark && !['cyberpunk', 'matrix', 'neon', 'synthwave', 'tron', 'hacker', 'hologram'].includes(t.id));
  const techThemes = themes.filter(t => ['cyberpunk', 'matrix', 'neon', 'synthwave', 'tron', 'hacker', 'hologram'].includes(t.id));

  const handleSelectTheme = (themeId: string) => {
    setThemeById(themeId);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: currentTheme.colors.border }]}>
          <Text preset="h4" style={{ color: currentTheme.colors.text }}>
            Escolha o Tema
          </Text>
          <Pressable
            style={[styles.closeButton, { backgroundColor: currentTheme.colors.backgroundTertiary }]}
            onPress={onClose}
          >
            <XIcon size={18} color={currentTheme.colors.text} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Temas Tecnológicos/Futuristas */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ZapIcon size={18} color={currentTheme.colors.warning} />
              <Text
                preset="label"
                style={{ color: currentTheme.colors.textSecondary, marginLeft: 8 }}
              >
                FUTURISTA / TECH
              </Text>
            </View>
            <View style={styles.themesGrid}>
              {techThemes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={currentTheme.id === theme.id}
                  onSelect={() => handleSelectTheme(theme.id)}
                />
              ))}
            </View>
          </View>

          {/* Temas Escuros */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MoonIcon size={18} color={currentTheme.colors.primary} />
              <Text
                preset="label"
                style={{ color: currentTheme.colors.textSecondary, marginLeft: 8 }}
              >
                TEMAS ESCUROS
              </Text>
            </View>
            <View style={styles.themesGrid}>
              {darkThemes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={currentTheme.id === theme.id}
                  onSelect={() => handleSelectTheme(theme.id)}
                />
              ))}
            </View>
          </View>

          {/* Temas Claros */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SunIcon size={18} color={currentTheme.colors.warning} />
              <Text
                preset="label"
                style={{ color: currentTheme.colors.textSecondary, marginLeft: 8 }}
              >
                TEMAS CLAROS
              </Text>
            </View>
            <View style={styles.themesGrid}>
              {lightThemes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={currentTheme.id === theme.id}
                  onSelect={() => handleSelectTheme(theme.id)}
                />
              ))}
            </View>
          </View>

          {/* Info */}
          <View style={[styles.infoCard, { backgroundColor: currentTheme.colors.backgroundSecondary }]}>
            <LightbulbIcon size={20} color={currentTheme.colors.warning} />
            <Text
              preset="caption"
              style={{ color: currentTheme.colors.textSecondary, flex: 1, marginLeft: 12 }}
            >
              O tema escolhido será salvo automaticamente e aplicado ao abrir o app novamente.
            </Text>
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing[4] * 2 - spacing[3]) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[4],
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
    marginLeft: spacing[1],
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  themeCard: {
    width: cardWidth,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  preview: {
    height: 100,
    padding: spacing[2],
  },
  previewHeader: {
    height: 20,
    borderRadius: borderRadius.sm,
    marginBottom: spacing[2],
    paddingHorizontal: spacing[2],
    justifyContent: 'center',
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  previewContent: {
    flex: 1,
    gap: spacing[1],
  },
  previewCard: {
    flex: 1,
    borderRadius: borderRadius.sm,
    padding: spacing[1],
    justifyContent: 'center',
    gap: 3,
  },
  previewLine: {
    height: 4,
    borderRadius: 2,
  },
  previewRow: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  previewSmallCard: {
    flex: 1,
    height: 20,
    borderRadius: borderRadius.sm,
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    gap: spacing[2],
  },
  themeColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: borderRadius.lg,
  },
  spacer: {
    height: spacing[8],
  },
});
