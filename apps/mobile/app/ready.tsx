import { useLocalSearchParams, useRouter } from 'expo-router';
import { CircleCheck, RotateCcw, Undo2 } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { JuiceVisual, MetricCard } from '../src/components/FreshPressPrimitives';
import { BackBar, Badge, Button, Card, Screen, Text } from '../src/components/ui';
import { t } from '../src/i18n/strings';

export default function Ready() {
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title?: string }>();
  const [logged, setLogged] = useState(true);

  return (
    <Screen className="px-5">
      <BackBar onPress={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 16, paddingTop: 4 }}
      >
        <Card className="items-center gap-5 bg-green/30 border-green/60">
          <Badge label={t.ready.badge} tone="fresh" />
          <JuiceVisual tone="green" size="large" />
          <View className="items-center gap-2">
            <CircleCheck size={34} color={colors.greenInk} />
            <Text variant="display" className="text-center text-[34px] leading-[42px]">
              {t.ready.title}
            </Text>
            <Text variant="body" className="text-center text-[14px] leading-[20px]">
              {title ?? t.ready.fallbackTitle} {t.ready.bodySuffix}
            </Text>
          </View>
        </Card>

        <View className="flex-row gap-3">
          <MetricCard label={t.ready.volume} value="450 ml" tone="subtle" />
          <MetricCard
            label={t.ready.logged}
            value={logged ? `164 ${t.common.kcal}` : t.ready.undo}
            tone={logged ? 'orange' : 'amber'}
          />
        </View>

        <Card className="gap-3">
          <Text variant="body" className="text-ink">
            {t.ready.proTip}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.ready.proTipBody}
          </Text>
          <Button
            title={logged ? t.ready.undoLog : t.ready.logAgain}
            variant="secondary"
            onPress={() => setLogged((value) => !value)}
          />
        </Card>
      </ScrollView>

      <View className="gap-3 pb-4 pt-2">
        <Button title={t.ready.newDrink} variant="fresh" onPress={() => router.replace('/(tabs)')} />
        <View className="flex-row items-center justify-center gap-2">
          {logged ? (
            <RotateCcw size={14} color={colors.muted} />
          ) : (
            <Undo2 size={14} color={colors.muted} />
          )}
          <Text variant="caption" className="tracking-normal">
            {t.ready.note}
          </Text>
        </View>
      </View>
    </Screen>
  );
}
