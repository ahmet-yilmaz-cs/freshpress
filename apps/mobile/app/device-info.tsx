import type { Device, DeviceDetails } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { BatteryMedium, Bluetooth, Cpu, Gauge, RotateCw, Wrench } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../src/api/client';
import { useAuth } from '../src/auth/AuthContext';
import { JuiceVisual, MetricCard, SectionHeader } from '../src/components/FreshPressPrimitives';
import { BackBar, Badge, Card, Screen, Text } from '../src/components/ui';
import { t } from '../src/i18n/strings';

function runtimeLabel(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}sa ${mins}dk`;
}

export default function DeviceInfo() {
  const router = useRouter();
  const { user } = useAuth();
  const [device, setDevice] = useState<Device | null>(null);
  const [details, setDetails] = useState<DeviceDetails | null>(null);

  useEffect(() => {
    if (!user) return;
    api
      .device(user.id)
      .then((response) => setDevice(response.device))
      .catch(() => setDevice(null));
    api
      .deviceDetails(user.id)
      .then((response) => setDetails(response.details))
      .catch(() => setDetails(null));
  }, [user?.id]);

  const filterPct = details ? Math.round((details.filterUses / details.filterLimit) * 100) : 0;

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        <View className="gap-2 pt-2">
          <Text variant="display" className="text-[34px] leading-[42px]">
            {t.deviceInfo.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.deviceInfo.subtitle}
          </Text>
        </View>

        <Card className="flex-row gap-4">
          <JuiceVisual tone={device?.connected ? 'orange' : 'subtle'} />
          <View className="min-w-0 flex-1 justify-center gap-2">
            <Text variant="eyebrow" className="text-amber">
              {device?.series ?? t.home.premiumSeries}
            </Text>
            <Text variant="h3" className="text-[24px] leading-[30px]">
              {device?.name ?? 'JuiceLab Pro X1'}
            </Text>
            <Badge
              label={device?.connected ? t.deviceInfo.connected : t.deviceInfo.offline}
              tone={device?.connected ? 'fresh' : 'amber'}
            />
          </View>
        </Card>

        <SectionHeader title={t.deviceInfo.usageSummary} />
        <View className="flex-row gap-3">
          <MetricCard
            label={t.deviceInfo.runtime}
            value={runtimeLabel(details?.totalRuntimeMin ?? 0)}
            icon={<Gauge size={16} color={colors.muted} />}
            tone="subtle"
          />
          <MetricCard
            label={t.deviceInfo.juices}
            value={`${details?.totalJuices ?? 0}`}
            icon={<RotateCw size={16} color={colors.muted} />}
            tone="green"
          />
        </View>

        <SectionHeader title={t.deviceInfo.maintenance} />
        <Card className="gap-4">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-md bg-orange/10">
              <Wrench size={20} color={colors.amber} />
            </View>
            <View className="min-w-0 flex-1">
              <Text variant="body" className="text-ink">
                {t.deviceInfo.filterLife}
              </Text>
              <Text variant="caption" className="tracking-normal">
                {details?.filterUses ?? 0} / {details?.filterLimit ?? 50} {t.deviceInfo.usesSuffix}
              </Text>
            </View>
            <Text variant="h3">%{filterPct}</Text>
          </View>
          <View className="h-3 overflow-hidden rounded-full bg-track">
            <View className="h-3 rounded-full bg-orange" style={{ width: `${filterPct}%` }} />
          </View>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.deviceInfo.nextMaintenancePrefix} {details?.nextMaintenanceDays ?? 0}{' '}
            {t.deviceInfo.daysWord}.
          </Text>
        </Card>

        <SectionHeader title={t.deviceInfo.technical} />
        <Card className="gap-0 p-0">
          <InfoRow
            icon={<Cpu size={18} color={colors.amber} />}
            label={t.deviceInfo.model}
            value={details?.model ?? '—'}
          />
          <InfoRow label={t.deviceInfo.serial} value={details?.serialNumber ?? '—'} />
          <InfoRow label={t.deviceInfo.firmware} value={details?.firmwareVersion ?? '—'} />
          <InfoRow
            icon={<Bluetooth size={18} color={colors.amber} />}
            label={t.deviceInfo.bluetooth}
            value={details?.bluetoothVersion ?? '—'}
          />
          <InfoRow
            icon={<BatteryMedium size={18} color={colors.amber} />}
            label={t.deviceInfo.battery}
            value={`${device?.battery ?? 0}%`}
            last
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}

function InfoRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center gap-3 px-5 py-4 ${last ? '' : 'border-b border-hairline'}`}
    >
      {icon ?? <View className="h-[18px] w-[18px]" />}
      <Text variant="body" className="flex-1 text-ink">
        {label}
      </Text>
      <Text variant="body" className="text-muted">
        {value}
      </Text>
    </View>
  );
}
