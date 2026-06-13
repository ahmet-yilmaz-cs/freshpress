import type { Recipe } from '@freshpress/types';
import { formatDuration } from '@freshpress/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Clock, Flame, Leaf, Play } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../../src/api/client';
import { FoodImage } from '../../src/components/FoodImage';
import { MetricCard, SectionHeader } from '../../src/components/FreshPressPrimitives';
import { Reveal } from '../../src/components/Reveal';
import { recipeImage } from '../../src/lib/foodImages';
import { BackBar, Badge, Button, Card, Screen, Text } from '../../src/components/ui';
import { t, upperTr } from '../../src/i18n/strings';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .recipe(id)
      .then((res) => setRecipe(res.recipe))
      .catch(() => setRecipe(null));
  }, [id]);

  if (!recipe) {
    return (
      <Screen className="px-5">
        <BackBar onPress={() => router.back()} />
        <Text variant="body" className="pt-8">
          {t.recipe.loading}
        </Text>
      </Screen>
    );
  }

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <Reveal style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
        >
        <Card className="overflow-hidden p-0">
          <FoodImage source={recipeImage(recipe.id, recipe.tone)} radius={0} style={{ height: 200 }} />
          <View className="items-center gap-2 p-5">
            <Badge
              label={upperTr(recipe.category)}
              tone={recipe.tone === 'green' ? 'fresh' : 'amber'}
            />
            <Text variant="display" className="text-center text-[28px] leading-[34px]">
              {recipe.title}
            </Text>
            <Text variant="body" className="text-center text-[14px] leading-[20px]">
              {recipe.description}
            </Text>
          </View>
        </Card>

        <View className="flex-row gap-3">
          <MetricCard
            label={t.recipe.calories}
            value={`${recipe.calories}`}
            icon={<Flame size={16} color={colors.muted} />}
            tone="orange"
          />
          <MetricCard
            label={t.recipe.time}
            value={formatDuration(recipe.durationSec)}
            icon={<Clock size={16} color={colors.muted} />}
            tone="subtle"
          />
          <MetricCard
            label={t.recipe.items}
            value={`${recipe.ingredients.length}`}
            icon={<Leaf size={16} color={colors.muted} />}
            tone="green"
          />
        </View>

        <SectionHeader title={t.recipe.ingredients} />
        <Card className="gap-0 p-0">
          {recipe.ingredients.map((ingredient, index) => (
            <View
              key={ingredient}
              className={`flex-row items-center gap-3 px-5 py-4 ${
                index < recipe.ingredients.length - 1 ? 'border-b border-hairline' : ''
              }`}
            >
              <View className="h-2 w-2 rounded-full bg-green-ink" />
              <Text variant="body" className="text-ink">
                {ingredient}
              </Text>
            </View>
          ))}
        </Card>

        <SectionHeader title={t.recipe.steps} />
        <Card className="gap-0 p-0">
          {recipe.steps.map((step, index) => (
            <View
              key={step}
              className={`flex-row gap-3 px-5 py-4 ${index < recipe.steps.length - 1 ? 'border-b border-hairline' : ''}`}
            >
              <View className="h-7 w-7 items-center justify-center rounded-full bg-orange">
                <Text variant="caption" className="text-white tracking-normal">
                  {index + 1}
                </Text>
              </View>
              <Text variant="body" className="flex-1 text-ink">
                {step}
              </Text>
            </View>
          ))}
        </Card>

        <SectionHeader title={t.recipe.benefits} />
        <View className="flex-row flex-wrap gap-2">
          {recipe.benefits.map((benefit) => (
            <View key={benefit} className="rounded-full bg-green/30 px-3 py-2">
              <Text variant="caption" className="text-green-ink tracking-normal">
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        <Button
          title={t.recipe.startJuicing}
          variant="fresh"
          onPress={() => router.push(`/juicing?title=${encodeURIComponent(recipe.title)}&recipeId=${encodeURIComponent(recipe.id)}`)}
          className="mt-2"
        />
        <View className="flex-row items-center justify-center gap-2">
          <Play size={14} color={colors.muted} />
          <Text variant="caption" className="text-center tracking-normal">
            {t.recipe.startHint}
          </Text>
        </View>
        </ScrollView>
      </Reveal>
    </Screen>
  );
}
