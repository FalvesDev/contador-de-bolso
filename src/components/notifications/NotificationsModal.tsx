/**
 * Modal de Notificações
 * Exibe alertas de orçamento, metas e dicas
 */

import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Text } from '../ui/Text';
import { XIcon, BellIcon, TargetIcon, AlertIcon, CheckCircleIcon, TrashIcon } from '../ui/Icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Notification } from '../../hooks/useNotifications';

interface NotificationsModalProps {
  visible: boolean;
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClear: (id: string) => void;
  onClearAll: () => void;
}

const NOTIFICATION_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  budget_warning: AlertIcon,
  budget_exceeded: AlertIcon,
  goal_progress: TargetIcon,
  goal_achieved: CheckCircleIcon,
  tip: BellIcon,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  budget_warning: '#F59E0B',
  budget_exceeded: '#EF4444',
  goal_progress: '#3B82F6',
  goal_achieved: '#10B981',
  tip: '#6366F1',
};

export function NotificationsModal({
  visible,
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
  onClearAll,
}: NotificationsModalProps) {
  const { theme } = useTheme();

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.headerLeft}>
              <BellIcon size={22} color={theme.colors.primary} />
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                Notificações
              </Text>
              {unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.colors.danger }]}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <XIcon size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Actions */}
          {notifications.length > 0 && (
            <View style={[styles.actions, { borderBottomColor: theme.colors.border }]}>
              <TouchableOpacity onPress={onMarkAllAsRead} disabled={unreadCount === 0}>
                <Text style={[styles.actionText, { color: unreadCount > 0 ? theme.colors.primary : theme.colors.textTertiary }]}>
                  Marcar todas como lidas
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClearAll}>
                <Text style={[styles.actionText, { color: theme.colors.danger }]}>
                  Limpar tudo
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de Notificações */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {notifications.length > 0 ? (
              notifications.map(notif => {
                const IconComponent = NOTIFICATION_ICONS[notif.type] || BellIcon;
                const iconColor = NOTIFICATION_COLORS[notif.type] || theme.colors.primary;

                return (
                  <TouchableOpacity
                    key={notif.id}
                    style={[
                      styles.notifItem,
                      { backgroundColor: notif.read ? 'transparent' : theme.colors.primaryLight + '30' },
                      { borderBottomColor: theme.colors.border }
                    ]}
                    onPress={() => onMarkAsRead(notif.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.notifIcon, { backgroundColor: iconColor + '20' }]}>
                      <IconComponent size={20} color={iconColor} />
                    </View>

                    <View style={styles.notifContent}>
                      <View style={styles.notifHeader}>
                        <Text style={[styles.notifTitle, { color: theme.colors.text }]} numberOfLines={1}>
                          {notif.title}
                        </Text>
                        <Text style={[styles.notifTime, { color: theme.colors.textTertiary }]}>
                          {formatTime(notif.createdAt)}
                        </Text>
                      </View>
                      <Text style={[styles.notifMessage, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                        {notif.message}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => onClear(notif.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <TrashIcon size={16} color={theme.colors.textTertiary} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <View style={[styles.emptyIcon, { backgroundColor: theme.colors.backgroundSecondary }]}>
                  <BellIcon size={32} color={theme.colors.textTertiary} />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                  Nenhuma notificação
                </Text>
                <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
                  Você receberá alertas sobre orçamento e metas aqui.
                </Text>
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
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
    maxHeight: '80%',
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 22,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  notifTime: {
    fontSize: 11,
  },
  notifMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  deleteBtn: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
