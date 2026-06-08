import type { Recipe } from '@freshpress/types';
import { formatDuration } from '@freshpress/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Clock, Flame, Leaf } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { api } from '../../src/api/client';
import { Badge, Button, Card, Screen, Text } from '../../src/components/ui';

/** Recipe Detail — Figma frame 6:225. Pushed from Explore. */
export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    api
      .recipes()
      .then((res) => setRecipe(res.recipes.find((r) => r.id === id) ?? null))
      .catch(() => setRecipe(null));
  }, [id]);

  if (!recipe) {
    return (
      <Screen className="px-5">
        <Pressable onPress={() => router.back()} className="flex-row items-center py-2 -ml-1">
          <ChevronLeft size={24} color="#574235" />
          <Text variant="body" className="text-muted">
            Back
          </Text>
        </Pressable>
        <Text variant="body" className="pt-8">
          Loading recipe…
        </Text>
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View className="relative">
          <Image
            source={{ uri: recipe.imageUrl }}
            className="h-72 w-full"
            resizeMode="cover"
          />
          <Pressable
            onPress={() => router.back()}
            className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-card active:opacity-80"
          >
            <ChevronLeft size={22} color="#1a1c1c" />
          </Pressable>
        </View>

        <View className="gap-5 px-5 pt-5">
          <View className="gap-2">
            <Badge label="● FRESH JUICE" tone="fresh" />
            <Text variant="h2">{recipe.title}</Text>
          </View>

          <View className="flex-row gap-4">
            <Card className="flex-1 items-center gap-1 bg-subtle border-border-warm/30">
              <Flame size={20} color="#954a00" />
              <Text variant="h3">{recipe.calories}</Text>
              <Text variant="caption" className="tracking-normal">
                KCAL
              </Text>
            </Card>
            <Card className="flex-1 items-center gap-1 bg-subtle border-border-warm/30">
              <Clock size={20} color="#954a00" />
              <Text variant="h3">{formatDuration(recipe.durationSec)}</Text>
              <Text variant="caption" className="tracking-normal">
                MINUTES
              </Text>
            </Card>
            <Card className="flex-1 items-center gap-1 bg-subtle border-border-warm/30">
              <Leaf size={20} color="#954a00" />
              <Text variant="h3">{recipe.ingredients.length}</Text>
              <Text variant="caption" className="tracking-normal">
                INGREDIENTS
              </Text>
            </Card>
          </View>

          <View className="gap-3">
            <Text variant="eyebrow">INGREDIENTS</Text>
            {recipe.ingredients.map((ing) => (
              <View key={ing} className="flex-row items-center gap-3">
                <View className="h-2 w-2 rounded-full bg-green-ink" />
                <Text variant="body" className="text-ink">
                  {ing}
                </Text>
              </View>
            ))}
          </View>

          <Button
            title="Start Juicing"
            variant="fresh"
            onPress={() =>
              router.push(`/juicing?title=${encodeURIComponent(recipe.title)}`)
            }
            className="mt-2"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
