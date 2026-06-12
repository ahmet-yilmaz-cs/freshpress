import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { useAuth } from '../auth/AuthContext';
import { Text } from './ui';

export function AppHeader({
  title = 'FreshPress',
  subtitle,
  unread = 0,
  compact = false,
}: {
  title?: string;
  subtitle?: string;
  unread?: number;
  compact?: boolean;
}) {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <View className="flex-row items-center justify-between px-5 pb-3 pt-1">
      <View className="min-w-0 flex-1">
        <Text
          variant={compact ? 'h2' : 'display'}
          className={compact ? 'text-amber' : 'text-amber text-[28px] leading-[34px]'}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" className="mt-1 tracking-normal" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View className="ml-3 flex-row items-center gap-3">
        <Pressable onPress={() => router.push('/notifications')} className="active:opacity-70">
          <View>
            <Bell size={24} color={colors.muted} />
            {unread > 0 && (
              <View className="absolute -right-1 -top-1 h-4 w-4 items-center justify-center rounded-full bg-orange">
                <Text className="font-bold text-[9px] text-white">{unread}</Text>
              </View>
            )}
          </View>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(tabs)/profile')}
          className="h-10 w-10 items-center justify-center rounded-full border border-border-warm bg-track active:opacity-70"
        >
          <Text variant="eyebrow" className="text-muted">
            {(user?.name?.[0] ?? 'F').toUpperCase()}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
