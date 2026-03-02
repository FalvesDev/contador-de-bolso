/**
 * Barra de navegação inferior com tabs
 */

import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { Text } from '../ui/Text';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing } from '../../constants/spacing';

// Padding extra para evitar sobreposição com botões de navegação do Android
const ANDROID_BOTTOM_PADDING = Platform.OS === 'android' ? 8 : 0;

export type TabName = 'home' | 'transactions' | 'add' | 'reports' | 'profile';

interface TabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
  onAddPress: () => void;
  onAddLongPress?: () => void;
}

interface TabItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
  activeColor: string;
  inactiveColor: string;
}

function TabItem({ icon, label, isActive, onPress, activeColor, inactiveColor }: TabItemProps) {
  return (
    <Pressable style={styles.tabItem} onPress={onPress}>
      <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
        {icon}
      </Text>
      <Text
        preset="caption"
        color={isActive ? activeColor : inactiveColor}
        style={styles.tabLabel}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function AddButton({ onPress, onLongPress, backgroundColor, shadowColor }: {
  onPress: () => void;
  onLongPress?: () => void;
  backgroundColor: string;
  shadowColor: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.addButton,
        {
          backgroundColor,
          shadowColor,
        },
        pressed && styles.addButtonPressed,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
    >
      <Text style={styles.addIcon}>+</Text>
    </Pressable>
  );
}

export function TabBar({ activeTab, onTabPress, onAddPress, onAddLongPress }: TabBarProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.tabBar, {
        backgroundColor: theme.colors.card,
        borderTopColor: theme.colors.border,
      }]}>
        <TabItem
          icon="🏠"
          label="Início"
          isActive={activeTab === 'home'}
          onPress={() => onTabPress('home')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textTertiary}
        />
        <TabItem
          icon="📋"
          label="Transações"
          isActive={activeTab === 'transactions'}
          onPress={() => onTabPress('transactions')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textTertiary}
        />

        {/* Espaço para o botão central */}
        <View style={styles.addButtonSpace} />

        <TabItem
          icon="📊"
          label="Relatórios"
          isActive={activeTab === 'reports'}
          onPress={() => onTabPress('reports')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textTertiary}
        />
        <TabItem
          icon="👤"
          label="Perfil"
          isActive={activeTab === 'profile'}
          onPress={() => onTabPress('profile')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textTertiary}
        />
      </View>

      {/* Botão de adicionar centralizado */}
      <AddButton
        onPress={onAddPress}
        onLongPress={onAddLongPress}
        backgroundColor={theme.colors.primary}
        shadowColor={theme.colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: spacing[2] + ANDROID_BOTTOM_PADDING,
    paddingTop: spacing[2],
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[1],
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: spacing[0.5],
  },
  tabIconActive: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 10,
  },
  addButtonSpace: {
    width: 70,
  },
  addButton: {
    position: 'absolute',
    top: -20,
    left: '50%',
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  addIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
});
