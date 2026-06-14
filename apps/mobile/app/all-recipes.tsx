import type { Recipe } from '@freshpress/types';
import { formatDuration } from '@freshpress/utils';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../src/api/client';
import { FoodImage } from '../src/components/FoodImage';
import { Reveal } from '../src/components/Reveal';
import { BackBar, Card, Screen, Text } from '../src/components/ui';
import { t } from '../src/i18n/strings';
import { recipeImage } from '../src/lib/foodImages';
import { toneFor } from '../src/lib/visuals';

export default function AllRecipes() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useFocusEffect(
    useCallback(() => {
      api
        .recipes()
        .then((res) => setRecipes(res.recipes))
        .catch(() => {});
    }, []),
  );

  const filtered =
    type === 'custom' ? recipes.filter((r) => r.isCustom) : recipes.filter((r) => !r.isCustom);

  const title = type === 'custom' ? t.explore.myRecipes : t.explore.recipes;

  return (
    <Screen edges={['top']}>
      <View className="px-5">
        <BackBar onPress={() => router.back()} />
        <Text variant="h2" className="pb-3 text-amber">
          {title}
        </Text>
      </View>
      <Reveal style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 12, paddingTop: 8 }}
        >
          {filtered.length ? (
            filtered.map((recipe) => (
              <RecipeRow
                key={recipe.id}
                recipe={recipe}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
              />
            ))
          ) : (
            <Text variant="body" className="py-4 text-center text-[14px]">
              {t.explore.noResults}
            </Text>
          )}
        </ScrollView>
      </Reveal>
    </Screen>
  );
}

function RecipeRow({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  const tn = toneFor(recipe.tone);
  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      <Card className="flex-row items-center gap-4 p-3">
        <FoodImage source={recipeImage(recipe.id, recipe.tone)} radius={14} style={{ width: 84, height: 84 }} />
        <View className="min-w-0 flex-1 gap-1">
          <Text variant="h3" className="text-[18px] leading-[24px]" numberOfLines={1}>
            {recipe.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]" numberOfLines={2}>
            {recipe.description}
          </Text>
          <Text variant="eyebrow" className={tn.text}>
            {recipe.calories} {t.common.kcal.toUpperCase()} · {formatDuration(recipe.durationSec)}{' '}
            {t.common.min.toUpperCase()}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
