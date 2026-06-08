import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  Lightbulb,
  Package,
  Settings,
  Smartphone,
  Target,
} from 'lucide-react-native';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { useAuth } from '../../src/auth/AuthContext';
import { Button, Card, Screen, Text } from '../../src/components/ui';

type Row = { icon: React.ReactNode; label: string; onPress: () => void };

/** Profile / Profil — account header, settings rows, links (6:692). */
export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const rows: Row[] = [
    {
      icon: <Settings size={20} color="#574235" />,
      label: 'Settings',
      onPress: () => router.push('/settings'),
    },
    {
      icon: <Smartphone size={20} color="#574235" />,
      label: 'Device Pairing',
      onPress: () => router.push('/pairing'),
    },
    {
      icon: <Bell size={20} color="#574235" />,
      label: 'Notifications',
      onPress: () => router.push('/notifications'),
    },
    {
      icon: <Target size={20} color="#574235" />,
      label: 'Goals',
      onPress: () => router.push('/(tabs)/goals'),
    },
    {
      icon: <Lightbulb size={20} color="#574235" />,
      label: 'Recommendations',
      onPress: () => router.push('/recommendations'),
    },
    {
      icon: <Package size={20} color="#574235" />,
      label: 'Stock',
      onPress: () => router.push('/stock'),
    },
  ];

  return (
    <Screen edges={['top']} className="px-5">
      <Text variant="display" className="py-4">
        Profile
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        <Card className="flex-row items-center gap-4">
          <Avatar name={user?.name} avatarUrl={user?.avatarUrl} />
          <View className="flex-1">
            <Text variant="h3">{user?.name ?? 'Guest'}</Text>
            <Text variant="body" className="text-[14px]">
              {user?.email ?? '—'}
            </Text>
          </View>
        </Card>

        <Card className="gap-0 p-0">
          {rows.map((row, i) => (
            <Pressable
              key={row.label}
              onPress={row.onPress}
              className={`flex-row items-center gap-3 px-5 py-4 active:opacity-70 ${
                i < rows.length - 1 ? 'border-b border-hairline' : ''
              }`}
            >
              {row.icon}
              <Text variant="body" className="flex-1 text-ink">
                {row.label}
              </Text>
              <ChevronRight size={18} color="#574235" />
            </Pressable>
          ))}
        </Card>

        <Button title="Log Out" variant="secondary" onPress={logout} className="mt-2" />
      </ScrollView>
    </Screen>
  );
}

function Avatar({ name, avatarUrl }: { name?: string; avatarUrl?: string }) {
  if (avatarUrl) {
    return <Image source={{ uri: avatarUrl }} className="h-16 w-16 rounded-full" />;
  }
  return (
    <View className="h-16 w-16 items-center justify-center rounded-full border border-border-warm bg-track">
      <Text variant="h2" className="text-amber">
        {(name?.[0] ?? 'F').toUpperCase()}
      </Text>
    </View>
  );
}
