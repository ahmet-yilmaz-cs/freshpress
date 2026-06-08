import { useRouter } from 'expo-router';
import { Bell, Globe, Moon, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Switch, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { useAuth } from '../src/auth/AuthContext';
import { BackBar, Button, Card, Screen, Text } from '../src/components/ui';

type Toggle = { key: string; icon: React.ReactNode; label: string; sub: string };

/** Settings — Figma frame 11:715. Functional local toggles + log out. */
export default function Settings() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [values, setValues] = useState<Record<string, boolean>>({
    notifications: true,
    darkMode: false,
    metric: true,
    privacy: true,
  });

  const toggles: Toggle[] = [
    {
      key: 'notifications',
      icon: <Bell size={20} color="#574235" />,
      label: 'Push Notifications',
      sub: 'Streaks, low stock, reminders',
    },
    {
      key: 'darkMode',
      icon: <Moon size={20} color="#574235" />,
      label: 'Dark Mode',
      sub: 'Use a darker theme',
    },
    {
      key: 'metric',
      icon: <Globe size={20} color="#574235" />,
      label: 'Metric Units',
      sub: 'Show volumes in millilitres',
    },
    {
      key: 'privacy',
      icon: <ShieldCheck size={20} color="#574235" />,
      label: 'Share Usage Data',
      sub: 'Help improve FreshPress',
    },
  ];

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <Text variant="display" className="py-4">
        Settings
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        <Card className="gap-1">
          <Text variant="eyebrow">ACCOUNT</Text>
          <Text variant="h3">{user?.name ?? 'Guest'}</Text>
          <Text variant="body" className="text-[14px]">
            {user?.email ?? '—'}
          </Text>
        </Card>

        <Card className="gap-0 p-0">
          {toggles.map((t, i) => (
            <View
              key={t.key}
              className={`flex-row items-center gap-3 px-5 py-4 ${
                i < toggles.length - 1 ? 'border-b border-hairline' : ''
              }`}
            >
              {t.icon}
              <View className="flex-1">
                <Text variant="body" className="text-ink">
                  {t.label}
                </Text>
                <Text variant="caption" className="tracking-normal">
                  {t.sub}
                </Text>
              </View>
              <Switch
                value={values[t.key] ?? false}
                onValueChange={(v) => setValues((prev) => ({ ...prev, [t.key]: v }))}
                trackColor={{ true: colors.orange, false: colors.track }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </Card>

        <Button title="Log Out" variant="secondary" onPress={logout} className="mt-2" />
      </ScrollView>
    </Screen>
  );
}
