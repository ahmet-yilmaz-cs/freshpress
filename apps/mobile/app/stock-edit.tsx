import type { StockItem } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../src/api/client';
import { FoodImage } from '../src/components/FoodImage';
import { SectionHeader } from '../src/components/FreshPressPrimitives';
import { Reveal } from '../src/components/Reveal';
import { BackBar, Button, Card, Screen, Text } from '../src/components/ui';
import { labels, t } from '../src/i18n/strings';
import { ingredientImage } from '../src/lib/foodImages';

export default function StockEdit() {
  const router = useRouter();
  const [items, setItems] = useState<StockItem[]>([]);
  const [draft, setDraft] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const response = await api.stock().catch(() => ({ stock: [] }));
    setItems(response.stock);
    setDraft(Object.fromEntries(response.stock.map((item) => [item.id, item.amount])));
  }

  function increment(id: string) {
    setDraft((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  async function save() {
    setSaving(true);
    try {
      for (const item of items) {
        const newAmount = draft[item.id] ?? item.amount;
        if (newAmount !== item.amount) {
          await api.updateStockItem(item.id, newAmount);
        }
      }
      router.back();
    } finally {
      setSaving(false);
    }
  }

  const grouped = items.reduce<Record<StockItem['category'], StockItem[]>>(
    (acc, item) => { acc[item.category].push(item); return acc; },
    { fruit: [], vegetable: [], booster: [] },
  );

  const categoryOrder: StockItem['category'][] = ['fruit', 'vegetable', 'booster'];

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <Reveal style={{ flex: 1 }}>
        <View className="gap-1 pb-4">
          <Text variant="display" className="text-[28px] leading-[34px]">
            {t.stock.editStockTitle}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.stock.editStockSubtitle}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingBottom: 100 }}
        >
          {categoryOrder.map((category) => {
            const group = grouped[category];
            if (!group.length) return null;
            return (
              <View key={category} className="gap-3">
                <SectionHeader title={labels.stockCategory[category] ?? category} />
                {group.map((item) => {
                  const current = draft[item.id] ?? item.amount;
                  return (
                    <Card key={item.id} className="flex-row items-center gap-3 p-3">
                      <FoodImage
                        source={ingredientImage(item.id, item.name, item.tone)}
                        radius={12}
                        style={{ width: 52, height: 52 }}
                      />
                      <View className="min-w-0 flex-1">
                        <Text variant="body" className="text-ink" numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text variant="caption" className="tracking-normal">
                          {labels.stockCategory[item.category]} · {item.caloriesPerUnit} {t.common.kcal}/{labels.unit[item.unit] ?? item.unit}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-3">
                        <View className="w-10 items-center">
                          <Text variant="h3" className="text-center text-ink">
                            {current}
                          </Text>
                          <Text variant="caption" className="tracking-normal text-muted" style={{ fontSize: 9 }}>
                            {labels.unit[item.unit] ?? item.unit}
                          </Text>
                        </View>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => increment(item.id)}
                          className="h-11 w-11 items-center justify-center rounded-full bg-green active:opacity-70"
                        >
                          <Plus size={20} color={colors.greenInk} />
                        </Pressable>
                      </View>
                    </Card>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </Reveal>

      <View className="absolute bottom-0 left-0 right-0 border-t border-hairline bg-card px-5 pb-8 pt-4">
        <Button title={t.stock.saveStock} loading={saving} onPress={save} />
      </View>
    </Screen>
  );
}
