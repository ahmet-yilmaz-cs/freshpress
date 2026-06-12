import type { Device } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { Bluetooth, Info, RadioTower } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../src/api/client';
import { useAuth } from '../src/auth/AuthContext';
import { DeviceImage } from '../src/components/DeviceImage';
import { JuiceVisual, ListRow, SectionHeader } from '../src/components/FreshPressPrimitives';
import { Reveal } from '../src/components/Reveal';
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
      <Reveal style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
        >
        <View className="gap-2 pt-2">
          <Text variant="display" className="text-[28px] leading-[34px]">
            {t.pairing.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.pairing.subtitle}
          </Text>
        </View>

        <Card className="items-center gap-4">
          <View className="items-center justify-center" style={{ width: 168, height: 168 }}>
            {/* Pulsing "searching for devices" rings while disconnected/pairing
                (mirrors the prototype's animated signal disc). */}
            {!connected ? (
              <>
                <ScanRing />
                <ScanRing delay={900} />
              </>
            ) : null}
            {/* Real device photo — greyed while offline, sharp once connected. */}
            <DeviceImage size={140} radius={70} dimmed={!connected} />
            {busy ? (
              <View
                style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}
              >
                <ActivityIndicator size="large" color={colors.white} />
              </View>
            ) : null}
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
      </Reveal>
    </Screen>
  );
}

/**
 * A single warm "radar" ring that scales outward and fades — looped to suggest the
 * device is actively scanning. Two staggered instances read as a sonar pulse.
 * Uses the RN Animated API (web-safe) rather than Reanimated worklets.
 */
function ScanRing({ delay = 0 }: { delay?: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1800,
        delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, delay]);

  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.45] });
  const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: 144,
        height: 144,
        borderRadius: 72,
        borderWidth: 2,
        borderColor: colors.amber,
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}
