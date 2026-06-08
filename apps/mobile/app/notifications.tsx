import type { Notification } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { AlertTriangle, Bell, CheckCircle2, Info } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { api } from '../src/api/client';
import { useAuth } from '../src/auth/AuthContext';
import { BackBar, Card, Screen, Text } from '../src/components/ui';

function Icon({ kind }: { kind: Notification['kind'] }) {
  if (kind === 'success') return <CheckCircle2 size={20} color="#00721e" />;
  if (kind === 'warning') return <AlertTriangle size={20} color="#954a00" />;
  return <Info size={20} color="#574235" />;
}

/** Notifications list (linked from home bell + profile). */
export default function Notifications() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    api.notifications(user.id).then((r) => setItems(r.notifications)).catch(() => setItems([]));
  }, [user?.id]);

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />

      <Text variant="display" className="py-4">
        Notifications
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
      >
        {items.map((n) => (
          <Card
            key={n.id}
            className={`flex-row gap-3 ${n.read ? '' : 'border-orange/40 bg-orange/5'}`}
          >
            <View className="pt-1">
              <Icon kind={n.kind} />
            </View>
            <View className="flex-1 gap-1">
              <Text variant="h3" className="text-[16px] leading-[22px]">
                {n.title}
              </Text>
              <Text variant="body" className="text-[14px]">
                {n.body}
              </Text>
            </View>
            {!n.read && <View className="mt-2 h-2 w-2 rounded-full bg-orange" />}
          </Card>
        ))}
        {items.length === 0 && (
          <View className="items-center gap-2 pt-16">
            <Bell size={32} color="#574235" />
            <Text variant="body">You're all caught up.</Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
