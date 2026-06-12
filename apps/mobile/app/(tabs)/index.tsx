import type { Device, ExtractionSpeed, JuiceProgram } from '@freshpress/types';
import { formatDuration, formatMl } from '@freshpress/utils';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BatteryMedium,
  CircleCheck,
  Droplet,
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
import { DeviceImage } from '../../src/components/DeviceImage';
import { FoodImage } from '../../src/components/FoodImage';
import { MetricCard, SectionHeader } from '../../src/components/FreshPressPrimitives';
import { Reveal } from '../../src/components/Reveal';
import { Badge, Card, Screen, Text } from '../../src/components/ui';
import { labels, statusLabel, t } from '../../src/i18n/strings';
import { programImage } from '../../src/lib/foodImages';
import { appRoute } from '../../src/lib/route';
import { alpha } from '../../src/lib/visuals';

/** Knob position (% of track) per speed step — mirrors the prototype slider. */
const SPEED_POSITION = { low: 12, medium: 50, high: 88 } as const;

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

      <Reveal style={{ flex: 1 }} duration={520}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
        <Card className="gap-4">
          <View className="flex-row gap-4">
            <DeviceImage size={120} label={connected ? 'ONLINE' : 'EŞLE'} dimmed={!connected} />
            <View className="min-w-0 flex-1 justify-center gap-2">
              <Text variant="eyebrow" className="text-amber">
                {device?.series ?? t.home.premiumSeries}
              </Text>
              <Text variant="h3" className="text-[20px] leading-[26px]">
                {device?.name ?? 'JuiceLab Pro X1'}
              </Text>
              {/* When connected, the live status is already shown in the "Durum" metric
                  card below, so we surface the device tagline here (mirrors the prototype's
                  connect card). When offline, we keep the "BAĞLI DEĞİL" badge as a warning. */}
              {connected ? (
                <Text
                  variant="body"
                  className="text-[13px] leading-[18px] text-muted"
                  numberOfLines={2}
                >
                  {t.home.tagline}
                </Text>
              ) : (
                <Badge label={t.home.notConnected} tone="amber" />
              )}
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
          className="h-14 items-center justify-center rounded-full bg-green active:opacity-90"
        >
          <View className="flex-row items-center gap-2">
            <Power size={20} color={colors.greenInk} />
            <Text className="font-bold text-[17px] text-green-ink">
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
          <View className="items-center gap-1 px-5 pb-2 pt-5">
            <Droplet size={22} color={colors.orange} fill={alpha(colors.orange, 0.2)} />
            <Text variant="body" className="text-[13px] text-muted">
              {t.home.yieldVolume}
            </Text>
          </View>
          <View className="justify-end" style={{ height: 124 }}>
            <LinearGradient
              colors={[alpha(colors.yellow, 0), colors.yellow, colors.orange]}
              locations={[0, 0.55, 1]}
              style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />
            <View className="items-center pb-3">
              <View className="flex-row items-end">
                <Text
                  variant="display"
                  className="text-[36px] leading-[42px] text-white"
                  style={{ textShadowColor: 'rgba(90,40,0,0.3)', textShadowRadius: 4 }}
                >
                  {selectedYield}
                </Text>
                <Text
                  variant="h3"
                  className="mb-0.5 ml-1 text-[16px] text-white"
                  style={{ textShadowColor: 'rgba(90,40,0,0.3)', textShadowRadius: 4 }}
                >
                  {t.common.ml}
                </Text>
              </View>
            </View>
            <View className="absolute bottom-3 right-3">
              <Badge label={`%${capacityPct} ${t.home.capacity}`} tone="dark" />
            </View>
          </View>
        </Card>

        <Card className="gap-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <SlidersHorizontal size={18} color={colors.amber} />
              <Text variant="h3" className="text-[17px] leading-[24px]">
                {t.home.extractionSpeed}
              </Text>
            </View>
            <Text variant="eyebrow" className="text-orange">
              {labels.speed[speed]}
            </Text>
          </View>
          <View className="justify-center" style={{ height: 24 }}>
            <View className="h-1.5 w-full rounded-full bg-track" />
            <View
              className="absolute h-5 w-5 rounded-full bg-orange"
              style={{
                left: `${SPEED_POSITION[speed]}%`,
                marginLeft: -10,
                shadowColor: colors.black,
                shadowOpacity: 0.25,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
                elevation: 3,
              }}
            />
          </View>
          <View className="flex-row justify-between">
            {(['low', 'medium', 'high'] as const).map((option) => {
              const active = option === speed;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => selectSpeed(option)}
                  className="min-h-[36px] justify-center px-1 active:opacity-70"
                >
                  <Text variant="eyebrow" className={active ? 'text-orange' : 'text-muted'}>
                    {labels.speed[option]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
        </ScrollView>
      </Reveal>

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
              <FoodImage source={programImage(program.id, program.tone)} radius={12} style={{ width: 52, height: 52 }} />
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
  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      {/* Photo on top, label below — clean separation, no text over the image. */}
      <Card className="overflow-hidden p-0" style={{ width: 164 }}>
        <FoodImage source={programImage(program.id, program.tone)} radius={0} style={{ height: 96 }} />
        <View className="gap-1 px-3 py-3">
          {/* Reserve two lines so short and long names keep the same card height. */}
          <Text
            variant="h3"
            className="text-[14px] leading-[18px]"
            numberOfLines={2}
            style={{ minHeight: 36 }}
          >
            {program.name}
          </Text>
          <Text variant="eyebrow" className="text-amber">
            {formatMl(program.volumeMl)}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
