import { useRouter } from 'expo-router';
import {
  Bell,
  CircleHelp,
  LogOut,
  Settings,
  ShieldCheck,
  Smartphone,
  Target,
} from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { useAuth } from '../../src/auth/AuthContext';
import { AppHeader } from '../../src/components/AppHeader';
import { ListRow, MetricCard, SectionHeader } from '../../src/components/FreshPressPrimitives';
import { Button, Card, Screen, Text } from '../../src/components/ui';
import { t } from '../../src/i18n/strings';
import { appRoute } from '../../src/lib/route';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <Screen edges={['top']}>
      <AppHeader title={t.profile.title} subtitle={t.profile.subtitle} compact />

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

        <View className="flex-row gap-3">
          <MetricCard
            label={t.profile.plan}
            value={t.profile.planValue}
            icon={<ShieldCheck size={16} color={colors.muted} />}
            tone="green"
          />
          <MetricCard
            label={t.profile.goal}
            value={t.profile.goalValue}
            icon={<Target size={16} color={colors.muted} />}
            tone="subtle"
          />
        </View>

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
          />
          <ListRow
            title={t.profile.help}
            subtitle={t.profile.helpSub}
            icon={<CircleHelp size={20} color={colors.amber} />}
            onPress={() => router.push(appRoute('/help'))}
            last
          />
        </Card>

        <Button title={t.profile.logout} variant="secondary" onPress={logout} className="mt-2" />
        <View className="flex-row items-center justify-center gap-2">
          <LogOut size={14} color={colors.muted} />
          <Text variant="caption" className="text-center tracking-normal">
            {t.profile.footer}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
