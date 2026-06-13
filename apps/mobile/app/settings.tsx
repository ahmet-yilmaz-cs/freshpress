import { useRouter } from 'expo-router';
import { Bell, CircleHelp, Database, Globe, Moon, ShieldCheck } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Switch, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { BackBar, Button, Card, Screen, Text } from '../src/components/ui';
import { ListRow, SectionHeader } from '../src/components/FreshPressPrimitives';
import { Reveal } from '../src/components/Reveal';
import { useAuth } from '../src/auth/AuthContext';
import { t } from '../src/i18n/strings';
import { usePreferences, type Preferences } from '../src/lib/preferences';
import { appRoute } from '../src/lib/route';

type Toggle = { key: keyof Preferences; icon: ReactNode; label: string; sub: string };

export default function Settings() {
  const router = useRouter();
  const { logout } = useAuth();
  const { prefs, setPref } = usePreferences();

  const toggles: Toggle[] = [
    {
      key: 'notifications',
      icon: <Bell size={20} color={colors.amber} />,
      label: t.settings.pushNotifications,
      sub: t.settings.pushNotificationsSub,
    },
    {
      key: 'quietHours',
      icon: <Moon size={20} color={colors.amber} />,
      label: t.settings.quietHours,
      sub: t.settings.quietHoursSub,
    },
    {
      key: 'metric',
      icon: <Globe size={20} color={colors.amber} />,
      label: t.settings.metricUnits,
      sub: t.settings.metricUnitsSub,
    },
    {
      key: 'analytics',
      icon: <Database size={20} color={colors.amber} />,
      label: t.settings.shareUsage,
      sub: t.settings.shareUsageSub,
    },
  ];

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <Reveal style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
        >
        <View className="gap-2 pt-2">
          <Text variant="display" className="text-[28px] leading-[34px]">
            {t.settings.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.settings.subtitle}
          </Text>
        </View>

        <SectionHeader title={t.settings.accountSection} />
        <Card className="gap-0 p-0">
          <ListRow
            title={t.settings.accountDetails}
            subtitle={t.settings.accountDetailsSub}
            icon={<ShieldCheck size={20} color={colors.amber} />}
            onPress={() => router.push(appRoute('/account'))}
          />
          <ListRow
            title={t.settings.help}
            subtitle={t.settings.helpSub}
            icon={<CircleHelp size={20} color={colors.amber} />}
            onPress={() => router.push(appRoute('/help'))}
            last
          />
        </Card>

        <SectionHeader title={t.settings.preferences} />
        <Card className="gap-0 p-0">
          {toggles.map((item, index) => (
            <View
              key={item.key}
              className={`flex-row items-center gap-3 px-5 py-4 ${
                index < toggles.length - 1 ? 'border-b border-hairline' : ''
              }`}
            >
              <View className="h-10 w-10 items-center justify-center rounded-md bg-subtle">
                {item.icon}
              </View>
              <View className="min-w-0 flex-1">
                <Text variant="body" className="text-ink">
                  {item.label}
                </Text>
                <Text variant="caption" className="mt-1 tracking-normal">
                  {item.sub}
                </Text>
              </View>
              {item.key === 'metric' ? (
                <View className="flex-row overflow-hidden rounded-lg border border-hairline">
                  <Pressable
                    onPress={() => setPref('metric', true)}
                    className={`px-4 py-2 ${prefs.metric ? 'bg-orange' : 'bg-card'}`}
                  >
                    <Text
                      variant="button"
                      className={`text-[13px] leading-[18px] ${prefs.metric ? 'text-white' : 'text-muted'}`}
                    >
                      ml
                    </Text>
                  </Pressable>
                  <View className="w-px bg-hairline" />
                  <Pressable
                    onPress={() => setPref('metric', false)}
                    className={`px-4 py-2 ${!prefs.metric ? 'bg-orange' : 'bg-card'}`}
                  >
                    <Text
                      variant="button"
                      className={`text-[13px] leading-[18px] ${!prefs.metric ? 'text-white' : 'text-muted'}`}
                    >
                      oz
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Switch
                  value={prefs[item.key]}
                  onValueChange={(value) => setPref(item.key, value)}
                  trackColor={{ true: colors.orange, false: colors.track }}
                  thumbColor={colors.white}
                />
              )}
            </View>
          ))}
        </Card>

        <Button title={t.settings.logout} variant="secondary" onPress={logout} className="mt-2" />
        </ScrollView>
      </Reveal>
    </Screen>
  );
}
