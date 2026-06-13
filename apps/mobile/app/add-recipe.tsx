import type { StockItem } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../src/api/client';
import { FoodImage } from '../src/components/FoodImage';
import { SectionHeader } from '../src/components/FreshPressPrimitives';
import { Reveal } from '../src/components/Reveal';
import { BackBar, Button, Card, Input, Screen, Text } from '../src/components/ui';
import { labels, t } from '../src/i18n/strings';
import { ingredientImage } from '../src/lib/foodImages';

/** Juice extraction factor: roughly 65% of calories end up in the juice */
const JUICE_FACTOR = 0.65;

export default function AddRecipe() {
  const router = useRouter();
  const [stock, setStock] = useState<StockItem[]>([]);
  const [title, setTitle] = useState('');
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.stock().then((r) => setStock(r.stock)).catch(() => {});
  }, []);

  function step(id: string, delta: number) {
    setAmounts((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      return { ...prev, [id]: next };
    });
  }

  const selectedIds = Object.entries(amounts)
    .filter(([, v]) => v > 0)
    .map(([id]) => id);

  const totalCalories = useMemo(() => {
    return Math.round(
      selectedIds.reduce((sum, id) => {
        const item = stock.find((s) => s.id === id);
        return sum + (item ? item.caloriesPerUnit * (amounts[id] ?? 0) * JUICE_FACTOR : 0);
      }, 0),
    );
  }, [selectedIds, amounts, stock]);

  async function save() {
    if (!title.trim()) {
      Alert.alert('', t.addRecipe.errorName);
      return;
    }
    if (selectedIds.length === 0) {
      Alert.alert('', t.addRecipe.errorIngredients);
      return;
    }
    setSaving(true);
    try {
      const selectedItems = stock.filter((s) => selectedIds.includes(s.id));
      const description = selectedItems.map((s) => `${amounts[s.id]}× ${s.name}`).join(', ');
      await api.addRecipe({ title: title.trim(), description, ingredientIds: selectedIds, amounts });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  const fruits = stock.filter((s) => s.category === 'fruit');
  const vegetables = stock.filter((s) => s.category === 'vegetable');
  const boosters = stock.filter((s) => s.category === 'booster');

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <Reveal style={{ flex: 1 }}>
        <View className="gap-1 pb-4">
          <Text variant="display" className="text-[28px] leading-[34px]">
            {t.addRecipe.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.addRecipe.subtitle}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label={t.addRecipe.nameLabel}
            value={title}
            onChangeText={setTitle}
            placeholder={t.addRecipe.namePlaceholder}
          />

          <Card className="items-center gap-1 bg-orange/10 border-orange/20">
            <Text variant="display" className="text-[36px] leading-[42px] text-amber">
              {totalCalories}
            </Text>
            <Text variant="caption" className="tracking-normal">
              {t.addRecipe.estimatedKcal}
            </Text>
          </Card>

          <IngredientSection
            title={t.addRecipe.fruits}
            items={fruits}
            amounts={amounts}
            onStep={step}
          />
          <IngredientSection
            title={t.addRecipe.vegetables}
            items={vegetables}
            amounts={amounts}
            onStep={step}
          />
          {boosters.length > 0 && (
            <IngredientSection
              title={t.addRecipe.boosters}
              items={boosters}
              amounts={amounts}
              onStep={step}
            />
          )}
        </ScrollView>
      </Reveal>

      <View className="absolute bottom-0 left-0 right-0 border-t border-hairline bg-card px-5 pb-8 pt-4">
        <Button
          title={t.addRecipe.save}
          loading={saving}
          disabled={!title.trim() || selectedIds.length === 0}
          onPress={save}
        />
      </View>
    </Screen>
  );
}

function IngredientSection({
  title,
  items,
  amounts,
  onStep,
}: {
  title: string;
  items: StockItem[];
  amounts: Record<string, number>;
  onStep: (id: string, delta: number) => void;
}) {
  if (!items.length) return null;
  return (
    <View className="gap-3">
      <SectionHeader title={title} />
      {items.map((item) => {
        const qty = amounts[item.id] ?? 0;
        const isSelected = qty > 0;
        return (
          <Card
            key={item.id}
            className={`flex-row items-center gap-3 p-3 ${isSelected ? 'border-green bg-green/10' : ''}`}
          >
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
                {Math.round(item.caloriesPerUnit * JUICE_FACTOR)} {t.addRecipe.kcalPer}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={() => onStep(item.id, -1)}
                className={`h-9 w-9 items-center justify-center rounded-full active:opacity-70 ${
                  qty > 0 ? 'bg-subtle' : 'bg-subtle opacity-30'
                }`}
                disabled={qty === 0}
              >
                <Minus size={16} color={colors.muted} />
              </Pressable>
              <Text variant="h3" className={`w-8 text-center ${qty > 0 ? 'text-ink' : 'text-muted'}`}>
                {qty}
              </Text>
              <Pressable
                onPress={() => onStep(item.id, 1)}
                className="h-9 w-9 items-center justify-center rounded-full bg-green active:opacity-70"
              >
                <Plus size={16} color={colors.greenInk} />
              </Pressable>
            </View>
          </Card>
        );
      })}
    </View>
  );
}
