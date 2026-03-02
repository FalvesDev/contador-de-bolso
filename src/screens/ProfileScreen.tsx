/**
 * Tela de Perfil - Configurações do app
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius } from '../constants/spacing';
import { exportToCSV, shareTextSummary } from '../services/exportService';
import { getCategoryById } from '../constants/categories';
import { Transaction } from '../components/dashboard/RecentTransactions';

interface ProfileScreenProps {
  onLogout?: () => void;
  transactions?: Transaction[];
}

function MenuItem({
  icon,
  label,
  value,
  onPress,
  textColor,
  chevronColor,
  pressedColor,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  textColor: string;
  chevronColor: string;
  pressedColor: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        { backgroundColor: pressed ? pressedColor : 'transparent' },
      ]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text preset="body" style={{ color: textColor }}>{label}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {value && (
          <Text preset="caption" style={{ color: chevronColor }}>
            {value}
          </Text>
        )}
        <Text style={[styles.chevron, { color: chevronColor }]}>›</Text>
      </View>
    </Pressable>
  );
}

export function ProfileScreen({ onLogout, transactions = [] }: ProfileScreenProps) {
  const { theme } = useTheme();
  const [isThemeSelectorVisible, setThemeSelectorVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const getCategoryName = (id: string) => {
    const cat = getCategoryById(id);
    return cat?.name || 'Outros';
  };

  const handleExportCSV = async () => {
    if (transactions.length === 0) {
      Alert.alert('Aviso', 'Não há transações para exportar.');
      return;
    }

    setIsExporting(true);
    try {
      await exportToCSV(transactions, getCategoryName);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareSummary = async () => {
    if (transactions.length === 0) {
      Alert.alert('Aviso', 'Não há transações para compartilhar.');
      return;
    }

    await shareTextSummary(transactions, getCategoryName);
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text preset="h3" style={{ color: theme.colors.text }}>Perfil</Text>
        </View>

        {/* Avatar e Info */}
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primaryLight }]}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text preset="h4" style={[styles.name, { color: theme.colors.text }]}>Usuário</Text>
          <Text preset="caption" style={{ color: theme.colors.textSecondary }}>
            usuario@email.com
          </Text>
          <View style={[styles.planBadge, { backgroundColor: theme.colors.backgroundTertiary }]}>
            <Text preset="caption" style={{ color: theme.colors.primary }}>
              Plano Gratuito
            </Text>
          </View>
        </View>

        {/* Aparência */}
        <View style={styles.section}>
          <Text preset="label" style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            APARÊNCIA
          </Text>
          <Card variant="elevated" padding="none" style={{ backgroundColor: theme.colors.card }}>
            <MenuItem
              icon={theme.icon}
              label="Tema"
              value={theme.name}
              onPress={() => setThemeSelectorVisible(true)}
              textColor={theme.colors.text}
              chevronColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
          </Card>
        </View>

        {/* Configurações */}
        <View style={styles.section}>
          <Text preset="label" style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            CONFIGURAÇÕES
          </Text>
          <Card variant="elevated" padding="none" style={{ backgroundColor: theme.colors.card }}>
            <MenuItem
              icon="💰"
              label="Orçamento Mensal"
              value="R$ 5.000"
              onPress={() => {}}
              textColor={theme.colors.text}
              chevronColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              icon="🏷️"
              label="Categorias"
              value="45 categorias"
              onPress={() => {}}
              textColor={theme.colors.text}
              chevronColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              icon="🔔"
              label="Notificações"
              value="Ativadas"
              onPress={() => {}}
              textColor={theme.colors.text}
              chevronColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
          </Card>
        </View>

        {/* Dados */}
        <View style={styles.section}>
          <Text preset="label" style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            DADOS
          </Text>
          <Card variant="elevated" padding="none" style={{ backgroundColor: theme.colors.card }}>
            <MenuItem
              icon="📤"
              label="Exportar CSV"
              value={isExporting ? 'Exportando...' : `${transactions.length} itens`}
              onPress={handleExportCSV}
              textColor={theme.colors.text}
              chevronColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              icon="📊"
              label="Compartilhar resumo"
              onPress={handleShareSummary}
              textColor={theme.colors.text}
              chevronColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              icon="🏦"
              label="Conectar banco"
              value="Em breve"
              onPress={() => {}}
              textColor={theme.colors.text}
              chevronColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              icon="☁️"
              label="Backup na nuvem"
              value="Em breve"
              onPress={() => {}}
              textColor={theme.colors.text}
              chevronColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
          </Card>
        </View>

        {/* Sobre */}
        <View style={styles.section}>
          <Text preset="label" style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            SOBRE
          </Text>
          <Card variant="elevated" padding="none" style={{ backgroundColor: theme.colors.card }}>
            <MenuItem
              icon="ℹ️"
              label="Versão do app"
              value="1.0.0"
              textColor={theme.colors.text}
              chevronColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              icon="📜"
              label="Termos de uso"
              onPress={() => {}}
              textColor={theme.colors.text}
              chevronColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              icon="🔒"
              label="Privacidade"
              onPress={() => {}}
              textColor={theme.colors.text}
              chevronColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
          </Card>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button
            title="Sair da conta"
            variant="outline"
            fullWidth
            leftIcon="🚪"
            onPress={onLogout}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text preset="caption" style={{ color: theme.colors.textTertiary }} center>
            Feito com 💜 para controlar suas finanças
          </Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Modal de Seleção de Temas */}
      <ThemeSelector
        visible={isThemeSelectorVisible}
        onClose={() => setThemeSelectorVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    marginBottom: spacing[1],
  },
  planBadge: {
    marginTop: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  section: {
    marginTop: spacing[4],
    paddingHorizontal: spacing[4],
  },
  sectionTitle: {
    marginBottom: spacing[2],
    marginLeft: spacing[1],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  menuIcon: {
    fontSize: 20,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  chevron: {
    fontSize: 20,
  },
  divider: {
    height: 1,
    marginLeft: spacing[4] + 20 + spacing[3],
  },
  logoutSection: {
    marginTop: spacing[8],
    paddingHorizontal: spacing[4],
  },
  footer: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[4],
  },
  spacer: {
    height: spacing[12],
  },
});
