import type { Recipe } from '@freshpress/types';
import { formatDuration } from '@freshpress/utils';
import { useRouter } from 'expo-router';
import { ChevronRight, Lightbulb, Package } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { api } from '../../src/api/client';
import { Card, Screen, Text } from '../../src/components/ui';

/** Explore / Keşfet — recipe discovery + entry points to recommendations & stock. */
export default function Explore() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    api
      .recipes()
      .then((res) => setRecipes(res.recipes))
      .catch(() => setRecipes([]));
  }, []);

  return (
    <Screen edges={['top']} className="px-5">
      <Text variant="display" className="py-4">
        Explore
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        {/* Shortcuts */}
        <View className="flex-row gap-4">
          <Pressable
            onPress={() => router.push('/recommendations')}
            className="flex-1 active:opacity-80"
          >
            <Card className="gap-2 bg-subtle border-border-warm/30">
              <Lightbulb size={22} color="#954a00" />
              <Text variant="h3" className="text-[16px] leading-[20px]">
                For You
              </Text>
              <Text variant="caption" className="tracking-normal">
                Recommendations
              </Text>
            </Card>
          </Pressable>
          <Pressable onPress={() => router.push('/stock')} className="flex-1 active:opacity-80">
            <Card className="gap-2 bg-subtle border-border-warm/30">
              <Package size={22} color="#954a00" />
              <Text variant="h3" className="text-[16px] leading-[20px]">
                Stock
              </Text>
              <Text variant="caption" className="tracking-normal">
                Ingredient levels
              </Text>
            </Card>
          </Pressable>
        </View>

        <Text variant="eyebrow" className="pt-2">
          RECIPES
        </Text>
        {recipes.map((r) => (
          <Pressable
            key={r.id}
            onPress={() => router.push(`/recipe/${r.id}`)}
            className="active:opacity-80"
          >
            <Card className="flex-row items-center gap-4 p-3">
              <Image
                source={{ uri: r.imageUrl }}
                className="h-20 w-20 rounded-md"
                resizeMode="cover"
              />
              <View className="flex-1 justify-center gap-1">
                <Text variant="h3" className="text-[18px] leading-[24px]">
                  {r.title}
                </Text>
                <Text variant="body" className="text-[14px]">
                  {r.ingredients.join(' · ')}
                </Text>
                <Text variant="eyebrow" className="text-amber">
                  {r.calories} KCAL · {formatDuration(r.durationSec)} MIN
                </Text>
              </View>
              <ChevronRight size={20} color="#574235" />
            </Card>
          </Pressable>
        ))}
        {recipes.length === 0 && (
          <Text variant="caption" className="tracking-normal">
            Loading recipes…
          </Text>
        )}
      </ScrollView>
    </Screen>
  );
}
