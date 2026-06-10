import type { Notification } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { AlertTriangle, Bell, CheckCircle2, Info } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../src/api/client';
import { useAuth } from '../src/auth/AuthContext';
import { BackBar, Card, Screen, Text } from '../src/components/ui';
import { SectionHeader } from '../src/components/FreshPressPrimitives';
import { t } from '../src/i18n/strings';

function NotificationIcon({ kind }: { kind: Notification['kind'] }) {
  if (kind === 'success') return <CheckCircle2 size={20} color={colors.greenInk} />;
  if (kind === 'warning') return <AlertTriangle size={20} color={colors.amber} />;
  return <Info size={20} color={colors.muted} />;
}

export default function Notifications() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    api
      .notifications(user.id)
      .then((r) => setItems(r.notifications))
      .catch(() => setItems([]));
  }, [user?.id]);

  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const unread = items.filter((item) => !item.read);
  const earlier = items.filter((item) => item.read);

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        <View className="gap-2 pt-2">
          <Text variant="display" className="text-[34px] leading-[42px]">
            {t.notifications.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.notifications.subtitle}
          </Text>
        </View>

        {items.length === 0 ? (
          <View className="items-center gap-3 pt-16">
            <Bell size={36} color={colors.muted} />
            <Text variant="body">{t.notifications.caughtUp}</Text>
          </View>
        ) : null}

        {unread.length ? (
          <View className="gap-3">
            <SectionHeader
              title={t.notifications.unread}
              action={t.notifications.markAll}
              onAction={markAllRead}
            />
            {unread.map((item) => (
              <NotificationCard key={item.id} item={item} onPress={() => markRead(item.id)} />
            ))}
          </View>
        ) : null}

        {earlier.length ? (
          <View className="gap-3">
            <SectionHeader title={t.notifications.earlier} />
            {earlier.map((item) => (
              <NotificationCard key={item.id} item={item} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function NotificationCard({ item, onPress }: { item: Notification; onPress?: () => void }) {
  const content = (
    <Card className={`flex-row gap-3 ${item.read ? '' : 'border-orange/40 bg-orange/5'}`}>
      <View className="h-10 w-10 items-center justify-center rounded-md bg-subtle">
        <NotificationIcon kind={item.kind} />
      </View>
      <View className="min-w-0 flex-1 gap-1">
        <View className="flex-row items-center gap-2">
          <Text variant="h3" className="min-w-0 flex-1 text-[16px] leading-[22px]" numberOfLines={1}>
            {item.title}
          </Text>
          {!item.read ? <View className="h-2 w-2 rounded-full bg-orange" /> : null}
        </View>
        <Text variant="body" className="text-[14px] leading-[20px]">
          {item.body}
        </Text>
      </View>
    </Card>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-80">
        {content}
      </Pressable>
    );
  }
  return content;
}
