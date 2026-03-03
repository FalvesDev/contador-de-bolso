/**
 * Barra de navegação inferior - Design Moderno
 */

import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { Text } from '../ui/Text';
import { HomeIcon, ListIcon, ChartBarIcon, UserIcon, PlusIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';

// Padding maior para evitar sobreposição com botões de navegação Android
const ANDROID_BOTTOM_PADDING = Platform.OS === 'android' ? 32 : 0;

export type TabName = 'home' | 'transactions' | 'add' | 'reports' | 'profile';

interface TabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
  onAddPress: () => void;
  onAddLongPress?: () => void;
}

interface TabItemProps {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  isActive: boolean;
  onPress: () => void;
  activeColor: string;
  inactiveColor: string;
}

function TabItem({ Icon, label, isActive, onPress, activeColor, inactiveColor }: TabItemProps) {
  return (
    <Pressable style={styles.tabItem} onPress={onPress}>
      <Icon size={22} color={isActive ? activeColor : inactiveColor} />
      <Text
        style={[
          styles.tabLabel,
          { color: isActive ? activeColor : inactiveColor }
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function AddButton({ onPress, onLongPress, backgroundColor }: {
  onPress: () => void;
  onLongPress?: () => void;
  backgroundColor: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.addButton,
        { backgroundColor },
        pressed && styles.addButtonPressed,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
    >
      <PlusIcon size={26} color="#FFFFFF" />
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
          Icon={HomeIcon}
          label="Início"
          isActive={activeTab === 'home'}
          onPress={() => onTabPress('home')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textTertiary}
        />
        <TabItem
          Icon={ListIcon}
          label="Transações"
          isActive={activeTab === 'transactions'}
          onPress={() => onTabPress('transactions')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textTertiary}
        />

        <View style={styles.addButtonSpace} />

        <TabItem
          Icon={ChartBarIcon}
          label="Relatórios"
          isActive={activeTab === 'reports'}
          onPress={() => onTabPress('reports')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textTertiary}
        />
        <TabItem
          Icon={UserIcon}
          label="Perfil"
          isActive={activeTab === 'profile'}
          onPress={() => onTabPress('profile')}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.textTertiary}
        />
      </View>

      <AddButton
        onPress={onAddPress}
        onLongPress={onAddLongPress}
        backgroundColor={theme.colors.primary}
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
    paddingBottom: 12 + ANDROID_BOTTOM_PADDING,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  addButtonSpace: {
    width: 70,
  },
  addButton: {
    position: 'absolute',
    top: -24,
    left: '50%',
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  addButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});
