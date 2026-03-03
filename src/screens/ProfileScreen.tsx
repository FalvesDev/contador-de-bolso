/**
 * Tela de Perfil - Design moderno banking
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius } from '../constants/spacing';
import { exportToCSV, shareTextSummary } from '../services/exportService';
import { getCategoryById } from '../constants/categories';
import { Transaction } from '../components/dashboard/RecentTransactions';
import {
  UserIcon,
  WalletIcon,
  ReceiptIcon,
  BellIcon,
  DownloadIcon,
  ShareIcon,
  CreditCardIcon,
  SettingsIcon,
  ChevronRightIcon,
  LogOutIcon,
  HeartIcon,
  ShieldIcon,
  PaletteIcon,
} from '../components/ui/Icons';

interface ProfileScreenProps {
  onLogout?: () => void;
  transactions?: Transaction[];
}

interface MenuItemProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  textColor: string;
  secondaryColor: string;
  pressedColor: string;
}

function MenuItem({
  Icon,
  iconColor,
  label,
  value,
  onPress,
  textColor,
  secondaryColor,
  pressedColor,
}: MenuItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        { backgroundColor: pressed ? pressedColor : 'transparent' },
      ]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconContainer, { backgroundColor: (iconColor || secondaryColor) + '15' }]}>
          <Icon size={20} color={iconColor || secondaryColor} />
        </View>
        <Text preset="body" style={{ color: textColor }}>{label}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {value && (
          <Text preset="caption" style={{ color: secondaryColor }}>
            {value}
          </Text>
        )}
        <ChevronRightIcon size={20} color={secondaryColor} />
      </View>
    </Pressable>
  );
}

export function ProfileScreen({ onLogout, transactions = [] }: ProfileScreenProps) {
  const { theme } = useTheme();
  const [isThemeSelectorVisible, setThemeSelectorVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Modo offline - valores fixos
  const userName = 'Usuário';
  const userEmail = 'Modo offline';
  const isAuthenticated = false;

  const handleLogout = () => {
    Alert.alert('Info', 'Login será implementado em breve!');
  };

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
            <UserIcon size={40} color={theme.colors.primary} />
          </View>
          <Text preset="h4" style={[styles.name, { color: theme.colors.text }]}>{userName}</Text>
          <Text preset="caption" style={{ color: theme.colors.textSecondary }}>
            {userEmail}
          </Text>
          <View style={[styles.planBadge, { backgroundColor: theme.colors.primary + '15' }]}>
            <Text preset="caption" style={{ color: theme.colors.primary }}>
              {isAuthenticated ? 'Plano Gratuito' : 'Modo Offline'}
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
              Icon={PaletteIcon}
              iconColor={theme.colors.primary}
              label="Tema"
              value={theme.name}
              onPress={() => setThemeSelectorVisible(true)}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
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
              Icon={WalletIcon}
              iconColor={theme.colors.success}
              label="Orçamento Mensal"
              value="R$ 5.000"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              Icon={ReceiptIcon}
              iconColor={theme.colors.warning}
              label="Categorias"
              value="45 categorias"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              Icon={BellIcon}
              iconColor={'#3B82F6'}
              label="Notificações"
              value="Ativadas"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
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
              Icon={DownloadIcon}
              iconColor={theme.colors.primary}
              label="Exportar CSV"
              value={isExporting ? 'Exportando...' : `${transactions.length} itens`}
              onPress={handleExportCSV}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              Icon={ShareIcon}
              iconColor={theme.colors.secondary || '#06B6D4'}
              label="Compartilhar resumo"
              onPress={handleShareSummary}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              Icon={CreditCardIcon}
              iconColor={theme.colors.success}
              label="Conectar banco"
              value="Em breve"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              Icon={SettingsIcon}
              iconColor={theme.colors.textSecondary}
              label="Backup na nuvem"
              value="Em breve"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
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
              Icon={SettingsIcon}
              iconColor={theme.colors.textSecondary}
              label="Versão do app"
              value="1.0.0"
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              Icon={ReceiptIcon}
              iconColor={theme.colors.textSecondary}
              label="Termos de uso"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <MenuItem
              Icon={ShieldIcon}
              iconColor={theme.colors.success}
              label="Privacidade"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              pressedColor={theme.colors.backgroundTertiary}
            />
          </Card>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              {
                backgroundColor: pressed ? theme.colors.danger + '15' : theme.colors.card,
                borderColor: theme.colors.danger + '30',
              },
            ]}
            onPress={handleLogout}
          >
            <LogOutIcon size={20} color={theme.colors.danger} />
            <Text style={{ color: theme.colors.danger, fontSize: 16, fontWeight: '500', marginLeft: 12 }}>
              {isAuthenticated ? 'Sair da conta' : 'Fazer login'}
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <HeartIcon size={14} color={theme.colors.primary} />
            <Text preset="caption" style={{ color: theme.colors.textTertiary, marginLeft: 6 }}>
              Feito para controlar suas finanças
            </Text>
          </View>
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
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  divider: {
    height: 1,
    marginLeft: spacing[4] + 36 + spacing[3],
  },
  logoutSection: {
    marginTop: spacing[8],
    paddingHorizontal: spacing[4],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  footer: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    height: spacing[12],
  },
});
