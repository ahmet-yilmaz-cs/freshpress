import type { StockItem } from '@freshpress/types';
import { useFocusEffect, useRouter } from 'expo-router';
import { AlertTriangle, Package, Search } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { AppHeader } from '../../src/components/AppHeader';
import { FoodImage } from '../../src/components/FoodImage';
import { SectionHeader } from '../../src/components/FreshPressPrimitives';
import { Reveal } from '../../src/components/Reveal';
import { api } from '../../src/api/client';
import { ingredientImage } from '../../src/lib/foodImages';
import { Button, Card, Screen, Text } from '../../src/components/ui';
import { labels, t } from '../../src/i18n/strings';

function barClass(level: number): string {
  if (level >= 60) return 'bg-green-ink';
  if (level >= 30) return 'bg-orange';
  return 'bg-danger';
}

const unitLabel = (unit: string) => labels.unit[unit] ?? unit;

export default function Stock() {
  const router = useRouter();
  const [items, setItems] = useState<StockItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  async function load() {
    const response = await api.stock().catch(() => ({ stock: [] }));
    setItems(response.stock);
  }

  const visibleItems = items.filter((item) => item.amount > 0);
  const lowItems = visibleItems.filter((item) => item.level < 30);
  const grouped = useMemo(() => {
    return visibleItems.reduce<Record<StockItem['category'], StockItem[]>>(
      (acc, item) => {
        acc[item.category].push(item);
        return acc;
      },
      { fruit: [], vegetable: [], booster: [] },
    );
  }, [visibleItems]);

  return (
    <Screen edges={['top']}>
      <AppHeader title={t.stock.title} subtitle={t.stock.subtitle} compact />

      <Reveal style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}
        >
        <Card className="gap-4 bg-subtle border-border-warm/40">
          <View className="flex-row items-center gap-4">
            <View className="h-12 w-12 items-center justify-center rounded-md bg-card">
              <Package size={24} color={colors.amber} />
            </View>
            <View className="min-w-0 flex-1">
              <Text variant="h3">{t.stock.smartPantry}</Text>
              <Text variant="body" className="text-[14px] leading-[20px]">
                {t.stock.smartPantrySub}
              </Text>
            </View>
          </View>
          {lowItems.length ? (
            <View className="flex-row items-start gap-2 rounded-md bg-danger-soft p-3">
              <AlertTriangle size={18} color={colors.danger} />
              <Text variant="caption" className="flex-1 text-danger tracking-normal">
                {t.stock.lowStock} {lowItems.map((item) => item.name).join(', ')}
              </Text>
            </View>
          ) : null}
          <View className="flex-row gap-3">
            <Button title={t.stock.editStock} onPress={() => router.push('/stock-edit')} className="flex-1" />
            <Button
              title={t.stock.recipes}
              variant="secondary"
              onPress={() => router.push('/(tabs)/explore')}
              className="flex-1"
            />
          </View>
        </Card>

        {Object.entries(grouped).map(([category, group]) =>
          group.length ? (
            <View key={category} className="gap-3">
              <SectionHeader title={labels.stockCategory[category] ?? category} />
              {group.map((item) => (
                <StockCard key={item.id} item={item} />
              ))}
            </View>
          ) : null,
        )}
        </ScrollView>
      </Reveal>
    </Screen>
  );
}

function StockCard({ item }: { item: StockItem }) {
  return (
    <Card className="gap-3">
      <View className="flex-row items-center gap-3">
        <FoodImage source={ingredientImage(item.id, item.name, item.tone)} radius={12} style={{ width: 56, height: 56 }} />
        <View className="min-w-0 flex-1">
          <Text variant="h3" className="text-[17px] leading-[23px]" numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant="caption" className="tracking-normal">
            {item.amount} {unitLabel(item.unit)} · %{item.level} {t.stock.remaining}
          </Text>
        </View>
        {item.level < 30 ? (
          <View className="rounded-full bg-danger-soft px-3 py-1">
            <Text variant="caption" className="text-danger tracking-normal">
              {t.stock.low}
            </Text>
          </View>
        ) : null}
      </View>
      <View className="h-3 overflow-hidden rounded-full bg-track">
        <View
          className={`h-3 rounded-full ${barClass(item.level)}`}
          style={{ width: `${item.level}%` }}
        />
      </View>
      <View className="flex-row items-center gap-2">
        <Search size={14} color={colors.muted} />
        <Text variant="caption" className="flex-1 tracking-normal" numberOfLines={1}>
          {item.name} {t.stock.usedBySuffix}
        </Text>
      </View>
    </Card>
  );
}
