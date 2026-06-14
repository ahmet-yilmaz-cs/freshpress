import { useRouter } from 'expo-router';
import {
  Bell,
  Settings,
  ShieldCheck,
  Smartphone,
} from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { useAuth } from '../../src/auth/AuthContext';
import { AppHeader } from '../../src/components/AppHeader';
import { ListRow, MetricCard, SectionHeader } from '../../src/components/FreshPressPrimitives';
import { Reveal } from '../../src/components/Reveal';
import { Card, Screen, Text } from '../../src/components/ui';
import { t } from '../../src/i18n/strings';
import { appRoute } from '../../src/lib/route';

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Screen edges={['top']}>
      <AppHeader title={t.profile.title} subtitle={t.profile.subtitle} compact />

      <Reveal style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}
        >
        <Card className="flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full border border-border-warm bg-track">
            <Text variant="h2" className="text-amber">
              {(user?.name?.[0] ?? 'F').toUpperCase()}
            </Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text variant="h3" numberOfLines={1}>
              {user?.name ?? t.profile.guest}
            </Text>
            <Text variant="body" className="text-[14px]" numberOfLines={1}>
              {user?.email ?? '—'}
            </Text>
          </View>
        </Card>

        <MetricCard
          label={t.profile.plan}
          value={t.profile.planValue}
          icon={<ShieldCheck size={16} color={colors.muted} />}
          tone="green"
        />

        <SectionHeader title={t.profile.manage} />
        <Card className="gap-0 p-0">
          <ListRow
            title={t.profile.account}
            subtitle={t.profile.accountSub}
            icon={<ShieldCheck size={20} color={colors.amber} />}
            onPress={() => router.push(appRoute('/account'))}
          />
          <ListRow
            title={t.profile.connection}
            subtitle={t.profile.connectionSub}
            icon={<Smartphone size={20} color={colors.amber} />}
            onPress={() => router.push('/pairing')}
          />
          <ListRow
            title={t.profile.notifications}
            subtitle={t.profile.notificationsSub}
            icon={<Bell size={20} color={colors.amber} />}
            onPress={() => router.push('/notifications')}
          />
          <ListRow
            title={t.profile.settings}
            subtitle={t.profile.settingsSub}
            icon={<Settings size={20} color={colors.amber} />}
            onPress={() => router.push('/settings')}
            last
          />
        </Card>

        </ScrollView>
      </Reveal>
    </Screen>
  );
}
