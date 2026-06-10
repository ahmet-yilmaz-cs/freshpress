import type { Device } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { Bluetooth, CheckCircle2, Info, RadioTower, WifiOff } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../src/api/client';
import { useAuth } from '../src/auth/AuthContext';
import { JuiceVisual, ListRow, SectionHeader } from '../src/components/FreshPressPrimitives';
import { BackBar, Badge, Button, Card, Screen, Text } from '../src/components/ui';
import { t } from '../src/i18n/strings';
import { appRoute } from '../src/lib/route';

export default function Pairing() {
  const router = useRouter();
  const { user } = useAuth();
  const [device, setDevice] = useState<Device | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    api
      .device(user.id)
      .then((r) => setDevice(r.device))
      .catch(() => setDevice(null));
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
      <BackBar onPress={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        <View className="gap-2 pt-2">
          <Text variant="display" className="text-[34px] leading-[42px]">
            {t.pairing.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.pairing.subtitle}
          </Text>
        </View>

        <Card className="items-center gap-4">
          <View
            className={`h-36 w-36 items-center justify-center rounded-full ${connected ? 'bg-green' : 'bg-track'}`}
          >
            {busy ? (
              <ActivityIndicator size="large" color={colors.amber} />
            ) : connected ? (
              <CheckCircle2 size={66} color={colors.greenInk} />
            ) : (
              <WifiOff size={66} color={colors.muted} />
            )}
          </View>
          <View className="items-center gap-2">
            <Text variant="h3">{device?.name ?? 'JuiceLab Pro X1'}</Text>
            <Badge
              label={connected ? t.pairing.connected : t.pairing.notConnected}
              tone={connected ? 'fresh' : 'amber'}
            />
          </View>
        </Card>

        <SectionHeader title={t.pairing.nearby} />
        <Card className="gap-0 p-0">
          <ListRow
            title="JuiceLab Pro X1"
            subtitle={t.pairing.signal}
            icon={<Bluetooth size={20} color={colors.amber} />}
            right={
              <Pressable
                accessibilityRole="button"
                onPress={toggle}
                disabled={busy}
                className="min-h-[36px] justify-center rounded-full bg-green px-4 active:opacity-70"
              >
                <Text variant="caption" className="text-green-ink tracking-normal">
                  {connected ? t.pairing.paired : t.pairing.pair}
                </Text>
              </Pressable>
            }
          />
          <ListRow
            title={t.pairing.deviceDetails}
            subtitle={t.pairing.deviceDetailsSub}
            icon={<Info size={20} color={colors.amber} />}
            onPress={() => router.push(appRoute('/device-info'))}
            last
          />
        </Card>

        <Card className="flex-row items-center gap-3 bg-subtle border-border-warm/40">
          <JuiceVisual tone="green" size="small" />
          <View className="min-w-0 flex-1">
            <Text variant="body" className="text-ink">
              {t.pairing.tip}
            </Text>
            <Text variant="caption" className="tracking-normal">
              {t.pairing.tipBody}
            </Text>
          </View>
          <RadioTower size={20} color={colors.muted} />
        </Card>

        <Button
          title={connected ? t.pairing.disconnect : t.pairing.pairDevice}
          variant={connected ? 'secondary' : 'primary'}
          loading={busy}
          onPress={toggle}
        />
      </ScrollView>
    </Screen>
  );
}
