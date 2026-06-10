import type { Device, ExtractionSpeed, JuiceProgram } from '@freshpress/types';
import { formatDuration, formatMl } from '@freshpress/utils';
import { useRouter } from 'expo-router';
import {
  BatteryMedium,
  CircleCheck,
  Gauge,
  Info,
  Power,
  SlidersHorizontal,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../../src/api/client';
import { useAuth } from '../../src/auth/AuthContext';
import { AppHeader } from '../../src/components/AppHeader';
import { BottomSheet } from '../../src/components/BottomSheet';
import { JuiceVisual, MetricCard, SectionHeader } from '../../src/components/FreshPressPrimitives';
import { Badge, Card, Screen, Text } from '../../src/components/ui';
import { labels, statusLabel, t } from '../../src/i18n/strings';
import { cn } from '../../src/lib/cn';
import { appRoute } from '../../src/lib/route';
import { toneFor } from '../../src/lib/visuals';

export default function DeviceControl() {
  const { user } = useAuth();
  const router = useRouter();
  const [device, setDevice] = useState<Device | null>(null);
  const [speed, setSpeed] = useState<ExtractionSpeed>('medium');
  const [programs, setPrograms] = useState<JuiceProgram[]>([]);
  const [unread, setUnread] = useState(0);
  const [programSheet, setProgramSheet] = useState(false);

  useEffect(() => {
    if (!user) return;
    api
      .device(user.id)
      .then((res) => {
        setDevice(res.device);
        setSpeed(res.device.speed);
      })
      .catch(() => setDevice(null));
    api
      .programs()
      .then((res) => setPrograms(res.programs))
      .catch(() => setPrograms([]));
    api
      .notifications(user.id)
      .then((res) => setUnread(res.notifications.filter((n) => !n.read).length))
      .catch(() => setUnread(0));
  }, [user?.id]);

  const connected = device?.connected ?? false;
  const deviceStatus = device?.status ?? 'ready';
  const selectedYield = device?.yieldMl ?? 450;
  const capacityPct = device?.capacityPct ?? 75;

  function start(title: string = t.home.defaultJuiceTitle) {
    if (!connected) {
      router.push('/pairing');
      return;
    }
    router.push(`/juicing?title=${encodeURIComponent(title)}`);
  }

  function selectSpeed(option: ExtractionSpeed) {
    setSpeed(option);
    if (user) api.setSpeed(user.id, option).catch(() => {});
  }

  return (
    <Screen edges={['top']}>
      <AppHeader title={t.home.title} subtitle={t.home.subtitle} unread={unread} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Card className="gap-4">
          <View className="flex-row gap-4">
            <JuiceVisual
              tone={connected ? 'orange' : 'subtle'}
              label={connected ? 'online' : 'eşle'}
            />
            <View className="min-w-0 flex-1 justify-center gap-2">
              <Text variant="eyebrow" className="text-amber">
                {device?.series ?? t.home.premiumSeries}
              </Text>
              <Text variant="h3" className="text-[24px] leading-[30px]">
                {device?.name ?? 'JuiceLab Pro X1'}
              </Text>
              <Badge
                label={connected ? statusLabel(deviceStatus).toUpperCase() : t.home.notConnected}
                tone={connected ? 'fresh' : 'amber'}
              />
            </View>
          </View>
          <Pressable
            onPress={() => router.push(appRoute('/device-info'))}
            className="min-h-[44px] flex-row items-center justify-between rounded-md bg-subtle px-4 py-3 active:opacity-70"
          >
            <View className="flex-row items-center gap-2">
              <Info size={18} color={colors.amber} />
              <Text variant="body" className="text-ink">
                {t.home.deviceInfo}
              </Text>
            </View>
            <Text variant="eyebrow" className="text-amber">
              {t.common.view}
            </Text>
          </Pressable>
        </Card>

        <View className="flex-row gap-3">
          <MetricCard
            label={t.home.battery}
            value={`${device?.battery ?? 82}%`}
            icon={<BatteryMedium size={16} color={colors.muted} />}
            tone={(device?.battery ?? 0) > 30 ? 'green' : 'orange'}
          />
          <MetricCard
            label={t.home.status}
            value={connected ? statusLabel(deviceStatus) : t.home.offline}
            icon={<CircleCheck size={16} color={colors.muted} />}
            tone={connected ? 'subtle' : 'amber'}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => start()}
          className="h-20 items-center justify-center rounded-full bg-green active:opacity-90"
        >
          <View className="flex-row items-center gap-2">
            <Power size={22} color={colors.greenInk} />
            <Text className="font-bold text-[22px] text-green-ink">
              {connected ? t.home.startJuicing : t.home.pairDevice}
            </Text>
          </View>
        </Pressable>

        <SectionHeader
          title={t.home.quickPrograms}
          action={t.common.choose}
          onAction={() => setProgramSheet(true)}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 4 }}
        >
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} onPress={() => start(program.name)} />
          ))}
        </ScrollView>

        <Card className="overflow-hidden p-0">
          <View className="items-center gap-1 px-5 pb-5 pt-6">
            <Gauge size={28} color={colors.ink} />
            <Text variant="h3">{t.home.yieldVolume}</Text>
            <View className="flex-row items-end">
              <Text variant="display">{selectedYield}</Text>
              <Text variant="h3" className="mb-2 ml-1 text-muted">
                {t.common.ml}
              </Text>
            </View>
            <Badge label={`%${capacityPct} ${t.home.capacity}`} tone="dark" />
          </View>
          <View className="h-20 justify-end bg-orange/10">
            <View
              className="rounded-t-lg bg-orange/60"
              style={{ height: `${Math.max(12, capacityPct)}%` }}
            />
          </View>
        </Card>

        <Card className="gap-3 bg-subtle border-border-warm/40">
          <View className="flex-row items-center gap-2">
            <SlidersHorizontal size={18} color={colors.amber} />
            <Text variant="h3" className="text-[17px] leading-[24px]">
              {t.home.extractionSpeed}
            </Text>
          </View>
          <View className="flex-row gap-2">
            {(['low', 'medium', 'high'] as const).map((option) => {
              const active = option === speed;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => selectSpeed(option)}
                  className={cn(
                    'min-h-[44px] flex-1 items-center justify-center rounded-full px-3 active:opacity-80',
                    active ? 'bg-amber' : 'bg-card',
                  )}
                >
                  <Text
                    variant="eyebrow"
                    className={cn('text-center', active ? 'text-white' : 'text-muted')}
                  >
                    {labels.speed[option]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      </ScrollView>

      <BottomSheet
        visible={programSheet}
        title={t.home.chooseProgram}
        subtitle={t.home.chooseProgramSubtitle}
        onClose={() => setProgramSheet(false)}
      >
        {programs.map((program) => (
          <Pressable
            key={program.id}
            onPress={() => {
              setProgramSheet(false);
              start(program.name);
            }}
            className="active:opacity-80"
          >
            <Card className="flex-row items-center gap-3 p-3">
              <JuiceVisual tone={program.tone} size="small" />
              <View className="min-w-0 flex-1">
                <Text variant="body" className="text-ink">
                  {program.name}
                </Text>
                <Text variant="caption" className="tracking-normal">
                  {formatMl(program.volumeMl)} · {formatDuration(program.durationSec)} {t.common.min}
                </Text>
              </View>
              <Text variant="eyebrow" className="text-amber">
                {t.common.start}
              </Text>
            </Card>
          </Pressable>
        ))}
      </BottomSheet>
    </Screen>
  );
}

/** Fixed-size card so every quick-program tile is identical regardless of name length. */
function ProgramCard({ program, onPress }: { program: JuiceProgram; onPress: () => void }) {
  const tn = toneFor(program.tone);
  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      <Card
        style={{ width: 168, height: 176 }}
        className={cn('justify-between', tn.bg, tn.border)}
      >
        <JuiceVisual tone={program.tone} size="small" />
        <View className="gap-1">
          <Text variant="h3" className="text-[16px] leading-[20px]" numberOfLines={2}>
            {program.name}
          </Text>
          <Text variant="eyebrow" className={tn.text}>
            {formatMl(program.volumeMl)}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
