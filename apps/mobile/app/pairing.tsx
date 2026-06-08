import type { Device } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { Bluetooth, CheckCircle2, ChevronLeft, WifiOff } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { api } from '../src/api/client';
import { useAuth } from '../src/auth/AuthContext';
import { Badge, Button, Card, Screen, Text } from '../src/components/ui';

/** Device Pairing — Figma frame 11:437. Functional connect/disconnect. */
export default function Pairing() {
  const router = useRouter();
  const { user } = useAuth();
  const [device, setDevice] = useState<Device | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.device(user.id).then((r) => setDevice(r.device)).catch(() => setDevice(null));
  }, [user?.id]);

  const connected = device?.connected ?? false;

  async function toggle() {
    if (!user) return;
    setBusy(true);
    try {
      const res = await api.pairDevice(user.id, !connected);
      setDevice(res.device);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen edges={['top']} className="px-5">
      <Pressable onPress={() => router.back()} className="flex-row items-center py-2 -ml-1">
        <ChevronLeft size={24} color="#574235" />
        <Text variant="body" className="text-muted">
          Back
        </Text>
      </Pressable>

      <Text variant="display" className="py-4">
        Device{'\n'}Pairing
      </Text>

      <View className="flex-1 items-center justify-center gap-6">
        <View
          className={`h-40 w-40 items-center justify-center rounded-full ${
            connected ? 'bg-green' : 'bg-track'
          }`}
        >
          {busy ? (
            <ActivityIndicator size="large" color="#954a00" />
          ) : connected ? (
            <CheckCircle2 size={72} color="#00721e" />
          ) : (
            <WifiOff size={72} color="#574235" />
          )}
        </View>

        <Card className="w-full items-center gap-2">
          <Bluetooth size={22} color="#954a00" />
          <Text variant="h3">{device?.name ?? 'JuiceLab Pro X1'}</Text>
          <Text variant="caption" className="tracking-normal">
            {device?.series ?? 'PREMIUM SERIES'}
          </Text>
          <Badge
            label={connected ? '● CONNECTED' : '● NOT CONNECTED'}
            tone={connected ? 'fresh' : 'amber'}
            className="mt-1"
          />
        </Card>
      </View>

      <View className="pb-6">
        <Button
          title={connected ? 'Disconnect' : 'Pair Device'}
          variant={connected ? 'secondary' : 'primary'}
          loading={busy}
          onPress={toggle}
        />
      </View>
    </Screen>
  );
}
