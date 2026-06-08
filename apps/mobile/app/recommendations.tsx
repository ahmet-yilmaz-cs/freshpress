import type { Recommendation } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { api } from '../src/api/client';
import { BackBar, Card, Screen, Text } from '../src/components/ui';

/** Recommendations — Figma frame 11:838. Linked from Explore/Profile. */
export default function Recommendations() {
  const router = useRouter();
  const [items, setItems] = useState<Recommendation[]>([]);

  useEffect(() => {
    api.recommendations().then((r) => setItems(r.recommendations)).catch(() => setItems([]));
  }, []);

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <Text variant="display" className="py-4">
        For You
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        {items.map((rec) => (
          <Pressable
            key={rec.id}
            disabled={!rec.recipeId}
            onPress={() => rec.recipeId && router.push(`/recipe/${rec.recipeId}`)}
            className="active:opacity-80"
          >
            <Card className="overflow-hidden p-0">
              <Image source={{ uri: rec.imageUrl }} className="h-40 w-full" resizeMode="cover" />
              <View className="gap-1 p-5">
                <Text variant="h3" className="text-[18px] leading-[24px]">
                  {rec.title}
                </Text>
                <Text variant="body" className="text-[14px]">
                  {rec.subtitle}
                </Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}
