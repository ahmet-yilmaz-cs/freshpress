import type { Recommendation } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { api } from '../src/api/client';
import { JuiceVisual } from '../src/components/FreshPressPrimitives';
import { BackBar, Card, Screen, Text } from '../src/components/ui';
import { t } from '../src/i18n/strings';
import { cn } from '../src/lib/cn';
import { toneFor } from '../src/lib/visuals';

export default function Recommendations() {
  const router = useRouter();
  const [items, setItems] = useState<Recommendation[]>([]);

  useEffect(() => {
    api
      .recommendations()
      .then((r) => setItems(r.recommendations))
      .catch(() => setItems([]));
  }, []);

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        <View className="gap-2 pt-2">
          <Text variant="display" className="text-[28px] leading-[34px]">
            {t.recommendations.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.recommendations.subtitle}
          </Text>
        </View>

        {items.map((item) => {
          const tn = toneFor(item.tone);
          return (
            <Pressable
              key={item.id}
              disabled={!item.recipeId}
              onPress={() => item.recipeId && router.push(`/recipe/${item.recipeId}`)}
              className="active:opacity-80"
            >
              <Card className={cn('gap-4', tn.bg, tn.border)}>
                <JuiceVisual tone={item.tone} label={t.recommendations.recommended} />
                <View className="gap-1">
                  <Text variant="h3">{item.title}</Text>
                  <Text variant="body" className="text-[14px] leading-[20px]">
                    {item.subtitle}
                  </Text>
                </View>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
