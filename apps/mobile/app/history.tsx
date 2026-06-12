import type { JuiceHistoryEntry } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { CalendarDays } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../src/api/client';
import { useAuth } from '../src/auth/AuthContext';
import { JuiceVisual, SectionHeader } from '../src/components/FreshPressPrimitives';
import { Reveal } from '../src/components/Reveal';
import { BackBar, Badge, Card, Screen, Text } from '../src/components/ui';
import { labels, t, upperTr } from '../src/i18n/strings';

export default function History() {
  const router = useRouter();
  const { user } = useAuth();
  const [history, setHistory] = useState<JuiceHistoryEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    api
      .history(user.id)
      .then((r) => setHistory(r.history))
      .catch(() => setHistory([]));
  }, [user?.id]);

  const groups = useMemo(() => {
    return history.reduce<Record<string, JuiceHistoryEntry[]>>((acc, entry) => {
      acc[entry.group] = [...(acc[entry.group] ?? []), entry];
      return acc;
    }, {});
  }, [history]);

  return (
    <Screen edges={['top']} className="px-5">
      <BackBar onPress={() => router.back()} />
      <Reveal style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
        >
        <View className="gap-2 pt-2">
          <Text variant="display" className="text-[28px] leading-[34px]">
            {t.history.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.history.subtitle}
          </Text>
        </View>

        <Card className="flex-row items-center gap-3 bg-subtle border-border-warm/40">
          <CalendarDays size={24} color={colors.amber} />
          <View className="min-w-0 flex-1">
            <Text variant="h3" className="text-[18px] leading-[24px]">
              {history.length} {t.history.servingsSuffix}
            </Text>
            <Text variant="caption" className="tracking-normal">
              {t.history.tapToReopen}
            </Text>
          </View>
        </Card>

        {Object.entries(groups).map(([group, entries]) => (
          <View key={group} className="gap-3">
            <SectionHeader title={group} />
            {entries.map((entry) => (
              <Pressable
                key={entry.id}
                disabled={!entry.recipeId}
                onPress={() => entry.recipeId && router.push(`/recipe/${entry.recipeId}`)}
                className="active:opacity-80"
              >
                <Card className="flex-row items-center gap-3 p-3">
                  <JuiceVisual
                    tone={entry.quality === 'excellent' ? 'green' : 'orange'}
                    size="small"
                  />
                  <View className="min-w-0 flex-1">
                    <Text variant="body" className="text-ink" numberOfLines={1}>
                      {entry.title}
                    </Text>
                    <Text variant="caption" className="tracking-normal" numberOfLines={1}>
                      {entry.volumeMl} {t.common.ml} · {entry.calories} {t.common.kcal} ·{' '}
                      {entry.ingredients.join(', ')}
                    </Text>
                  </View>
                  <Badge
                    label={upperTr(labels.quality[entry.quality] ?? entry.quality)}
                    tone={entry.quality === 'excellent' ? 'fresh' : 'amber'}
                  />
                </Card>
              </Pressable>
            ))}
          </View>
        ))}
        </ScrollView>
      </Reveal>
    </Screen>
  );
}
