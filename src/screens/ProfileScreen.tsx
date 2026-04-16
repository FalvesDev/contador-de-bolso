/**
 * Tela de Perfil - Design moderno banking
 * COM ANIMAÇÕES
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Animated,
} from 'react-native';
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
  userName?: string;
  userEmail?: string;
  isAuthenticated?: boolean;
}

interface MenuItemProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  textColor: string;
  secondaryColor: string;
  index: number;
}

// MenuItem com animação
function AnimatedMenuItem({
  Icon,
  iconColor,
  label,
  value,
  onPress,
  textColor,
  secondaryColor,
  index,
}: MenuItemProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 8 }),
      ]).start();
    }, 300 + index * 50);
    return () => clearTimeout(timeout);
  }, [index]);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.menuItem,
          { opacity, transform: [{ translateX }, { scale }] },
        ]}
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
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export function ProfileScreen({
  onLogout,
  transactions = [],
  userName: userNameProp,
  userEmail: userEmailProp,
  isAuthenticated: isAuthenticatedProp,
}: ProfileScreenProps) {
  const { theme } = useTheme();
  const [isThemeSelectorVisible, setThemeSelectorVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Animações
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslate = useRef(new Animated.Value(-20)).current;
  const avatarScale = useRef(new Animated.Value(0.3)).current;
  const avatarOpacity = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      // Header
      Animated.parallel([
        Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(headerTranslate, { toValue: 0, useNativeDriver: true, friction: 8 }),
      ]),
      // Avatar
      Animated.parallel([
        Animated.timing(avatarOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(avatarScale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }),
      ]),
      // Badge
      Animated.spring(badgeScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 100 }),
    ]).start();
  }, []);

  const userName = userNameProp ?? 'Usuário';
  const userEmail = userEmailProp ?? 'Modo offline';
  const isAuthenticated = isAuthenticatedProp ?? false;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
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

  // Contador de itens para stagger
  let itemIndex = 0;

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Animado */}
        <Animated.View
          style={[
            styles.header,
            { opacity: headerOpacity, transform: [{ translateY: headerTranslate }] },
          ]}
        >
          <Text preset="h3" style={{ color: theme.colors.text }}>Perfil</Text>
        </Animated.View>

        {/* Avatar e Info Animados */}
        <View style={styles.profileSection}>
          <Animated.View
            style={[
              styles.avatar,
              { backgroundColor: theme.colors.primaryLight },
              { opacity: avatarOpacity, transform: [{ scale: avatarScale }] },
            ]}
          >
            <UserIcon size={40} color={theme.colors.primary} />
          </Animated.View>
          <Animated.View style={{ opacity: avatarOpacity }}>
            <Text preset="h4" style={[styles.name, { color: theme.colors.text }]}>{userName}</Text>
          </Animated.View>
          <Animated.View style={{ opacity: avatarOpacity }}>
            <Text preset="caption" style={{ color: theme.colors.textSecondary }}>
              {userEmail}
            </Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.planBadge,
              { backgroundColor: theme.colors.primary + '15' },
              { transform: [{ scale: badgeScale }] },
            ]}
          >
            <Text preset="caption" style={{ color: theme.colors.primary }}>
              {isAuthenticated ? 'Plano Gratuito' : 'Modo Offline'}
            </Text>
          </Animated.View>
        </View>

        {/* Aparência */}
        <View style={styles.section}>
          <Text preset="label" style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            APARÊNCIA
          </Text>
          <Card variant="elevated" padding="none" style={{ backgroundColor: theme.colors.card }}>
            <AnimatedMenuItem
              Icon={PaletteIcon}
              iconColor={theme.colors.primary}
              label="Tema"
              value={theme.name}
              onPress={() => setThemeSelectorVisible(true)}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              index={itemIndex++}
            />
          </Card>
        </View>

        {/* Configurações */}
        <View style={styles.section}>
          <Text preset="label" style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            CONFIGURAÇÕES
          </Text>
          <Card variant="elevated" padding="none" style={{ backgroundColor: theme.colors.card }}>
            <AnimatedMenuItem
              Icon={WalletIcon}
              iconColor={theme.colors.success}
              label="Orçamento Mensal"
              value="R$ 5.000"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              index={itemIndex++}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <AnimatedMenuItem
              Icon={ReceiptIcon}
              iconColor={theme.colors.warning}
              label="Categorias"
              value="45 categorias"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              index={itemIndex++}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <AnimatedMenuItem
              Icon={BellIcon}
              iconColor={'#3B82F6'}
              label="Notificações"
              value="Ativadas"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              index={itemIndex++}
            />
          </Card>
        </View>

        {/* Dados */}
        <View style={styles.section}>
          <Text preset="label" style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            DADOS
          </Text>
          <Card variant="elevated" padding="none" style={{ backgroundColor: theme.colors.card }}>
            <AnimatedMenuItem
              Icon={DownloadIcon}
              iconColor={theme.colors.primary}
              label="Exportar CSV"
              value={isExporting ? 'Exportando...' : `${transactions.length} itens`}
              onPress={handleExportCSV}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              index={itemIndex++}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <AnimatedMenuItem
              Icon={ShareIcon}
              iconColor={theme.colors.secondary || '#06B6D4'}
              label="Compartilhar resumo"
              onPress={handleShareSummary}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              index={itemIndex++}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <AnimatedMenuItem
              Icon={CreditCardIcon}
              iconColor={theme.colors.success}
              label="Conectar banco"
              value="Em breve"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              index={itemIndex++}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <AnimatedMenuItem
              Icon={SettingsIcon}
              iconColor={theme.colors.textSecondary}
              label="Backup na nuvem"
              value="Em breve"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              index={itemIndex++}
            />
          </Card>
        </View>

        {/* Sobre */}
        <View style={styles.section}>
          <Text preset="label" style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            SOBRE
          </Text>
          <Card variant="elevated" padding="none" style={{ backgroundColor: theme.colors.card }}>
            <AnimatedMenuItem
              Icon={SettingsIcon}
              iconColor={theme.colors.textSecondary}
              label="Versão do app"
              value="1.0.0"
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              index={itemIndex++}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <AnimatedMenuItem
              Icon={ReceiptIcon}
              iconColor={theme.colors.textSecondary}
              label="Termos de uso"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              index={itemIndex++}
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <AnimatedMenuItem
              Icon={ShieldIcon}
              iconColor={theme.colors.success}
              label="Privacidade"
              onPress={() => {}}
              textColor={theme.colors.text}
              secondaryColor={theme.colors.textSecondary}
              index={itemIndex++}
            />
          </Card>
        </View>

        {/* Logout Animado */}
        <View style={styles.logoutSection}>
          <AnimatedLogoutButton
            onPress={handleLogout}
            theme={theme}
            isAuthenticated={isAuthenticated}
          />
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

// Botão de logout animado
function AnimatedLogoutButton({
  onPress,
  theme,
  isAuthenticated,
}: {
  onPress: () => void;
  theme: any;
  isAuthenticated: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }),
      ]).start();
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 6 }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.logoutButton,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.danger + '30',
          },
          { opacity, transform: [{ translateY }, { scale }] },
        ]}
      >
        <LogOutIcon size={20} color={theme.colors.danger} />
        <Text style={{ color: theme.colors.danger, fontSize: 16, fontWeight: '500', marginLeft: 12 }}>
          {isAuthenticated ? 'Sair da conta' : 'Fazer login'}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
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
