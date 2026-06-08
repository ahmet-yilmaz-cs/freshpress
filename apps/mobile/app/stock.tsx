import type { StockItem } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { api } from '../src/api/client';
import { BackBar, Card, Screen, Text } from '../src/components/ui';

function barColor(level: number): string {
  if (level >= 60) return 'bg-green-ink';
  if (level >= 30) return 'bg-orange';
  return 'bg-[#d23b30]';
}

/** Stock info — Figma frame 11:970. Ingredient levels (shared). */
export default function Stock() {
  const router = useRouter();
  const [items, setItems] = useState<StockItem[]>([]);

  useEffect(() => {
    api.stock().then((r) => setItems(r.stock)).catch(() => setItems([]));
  }, []);

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <Text variant="display" className="py-4">
        Stock
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
      >
        {items.map((s) => (
          <Card key={s.id} className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text variant="h3" className="text-[16px] leading-[22px]">
                {s.name}
              </Text>
              <Text variant="eyebrow" className="text-amber">
                {s.amount} {s.unit}
              </Text>
            </View>
            <View className="h-3 w-full overflow-hidden rounded-full bg-track">
              <View
                className={`h-3 rounded-full ${barColor(s.level)}`}
                style={{ width: `${s.level}%` }}
              />
            </View>
            <Text variant="caption" className="tracking-normal">
              {s.level}% remaining
            </Text>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
