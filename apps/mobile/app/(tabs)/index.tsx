import type { Device, JuiceProgram } from '@freshpress/types';
import { formatMl } from '@freshpress/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BatteryMedium, Bell, CircleCheck, Gauge, Power } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { api } from '../../src/api/client';
import { useAuth } from '../../src/auth/AuthContext';
import { Badge, Card, Screen, Text } from '../../src/components/ui';

/** Device Control home — Figma frame "Cihaz Kontrolü" (6:398). */
export default function DeviceControl() {
  const { user } = useAuth();
  const router = useRouter();
  const [device, setDevice] = useState<Device | null>(null);
  const [programs, setPrograms] = useState<JuiceProgram[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    api.device(user.id).then((res) => setDevice(res.device)).catch(() => setDevice(null));
    api.programs().then((res) => setPrograms(res.programs)).catch(() => setPrograms([]));
    api
      .notifications(user.id)
      .then((res) => setUnread(res.notifications.filter((n) => !n.read).length))
      .catch(() => setUnread(0));
  }, [user?.id]);

  const connected = device?.connected ?? false;

  return (
    <Screen edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pb-3 pt-1">
        <Text variant="display" className="text-amber text-[34px] leading-[42px]">
          FreshPress
        </Text>
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.push('/notifications')} className="active:opacity-70">
            <View>
              <Bell size={24} color="#574235" />
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

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: device connection status — tap to manage pairing */}
        <Pressable onPress={() => router.push('/pairing')} className="active:opacity-90">
          <Card className="flex-row gap-4">
            <LinearGradient
              colors={['#ffdcc6', '#ff8200']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 132, height: 132, borderRadius: 12, padding: 10 }}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400',
                }}
                className="flex-1 rounded-lg"
                resizeMode="cover"
              />
            </LinearGradient>
            <View className="flex-1 justify-center gap-1">
              <Text variant="eyebrow" className="text-amber">
                {device?.series ?? 'PREMIUM SERIES'}
              </Text>
              <Text variant="h3" className="text-[24px] leading-[30px]">
                {device?.name ?? 'JuiceLab Pro X1'}
              </Text>
              <Badge
                label={
                  connected ? `● ${(device?.status ?? 'ready').toUpperCase()}` : '● DISCONNECTED'
                }
                tone={connected ? 'fresh' : 'amber'}
                className="mt-1"
              />
            </View>
          </Card>
        </Pressable>

        {/* Stats row */}
        <View className="flex-row gap-4">
          <Card className="flex-1 bg-subtle border-border-warm/30">
            <View className="flex-row items-center gap-1">
              <BatteryMedium size={16} color="#574235" />
              <Text variant="eyebrow">BATTERY</Text>
            </View>
            <Text variant="h3" className="mt-1">
              {device?.battery ?? 82}%
            </Text>
          </Card>
          <Card className="flex-1 bg-subtle border-border-warm/30">
            <View className="flex-row items-center gap-1">
              <CircleCheck size={16} color="#574235" />
              <Text variant="eyebrow">STATUS</Text>
            </View>
            <Text variant="h3" className="mt-1 capitalize">
              {device?.status ?? 'Ready'}
            </Text>
          </Card>
        </View>

        {/* Start juicing CTA */}
        <Pressable
          onPress={() =>
            connected ? router.push('/juicing?title=Custom%20Juice') : router.push('/pairing')
          }
          className="h-20 items-center justify-center rounded-full bg-green active:opacity-90"
        >
          <View className="flex-row items-center gap-2">
            <Power size={22} color="#00721e" />
            <Text className="font-sans text-[24px] tracking-[1.2px] text-green-ink">
              {connected ? 'START JUICING' : 'PAIR DEVICE'}
            </Text>
          </View>
        </Pressable>

        {/* Programs */}
        <View className="gap-3">
          <Text variant="eyebrow">QUICK PROGRAMS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {programs.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => router.push(`/juicing?title=${encodeURIComponent(p.name)}`)}
                className="active:opacity-80"
              >
                <Card className="w-36 gap-1">
                  <View className="h-2 w-8 rounded-full" style={{ backgroundColor: p.color }} />
                  <Text variant="h3" className="mt-1 text-[16px] leading-[22px]">
                    {p.name}
                  </Text>
                  <Text variant="eyebrow" className="text-amber">
                    {formatMl(p.volumeMl)}
                  </Text>
                </Card>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Yield indicator */}
        <Card className="overflow-hidden p-0">
          <View className="items-center gap-1 px-5 pb-5 pt-6">
            <Gauge size={28} color="#1a1c1c" />
            <Text variant="h3">Yield Volume</Text>
            <View className="flex-row items-end">
              <Text variant="display">{(device?.yieldMl ?? 450).toString()}</Text>
              <Text variant="h3" className="mb-2 ml-1 text-muted">
                ml
              </Text>
            </View>
            <Badge label={`${device?.capacityPct ?? 75}% CAPACITY`} tone="dark" />
          </View>
          <LinearGradient
            colors={['#fe8200', '#ece2b2']}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={{ height: 80, opacity: 0.25 }}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}
