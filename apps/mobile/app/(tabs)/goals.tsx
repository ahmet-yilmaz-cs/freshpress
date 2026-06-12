import type { CalorieDay, JuiceHistoryEntry, WeeklyGoals } from '@freshpress/types';
import { clamp } from '@freshpress/utils';
import { useRouter } from 'expo-router';
import { Flame, Target, TrendingUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../../src/api/client';
import { useAuth } from '../../src/auth/AuthContext';
import { AppHeader } from '../../src/components/AppHeader';
import { JuiceVisual, MetricCard, SectionHeader } from '../../src/components/FreshPressPrimitives';
import { Reveal } from '../../src/components/Reveal';
import { Badge, Card, Screen, Text } from '../../src/components/ui';
import { labels, t, upperTr } from '../../src/i18n/strings';
import { appRoute } from '../../src/lib/route';

/** Fixed pixel height of the weekly-calorie bar track (see chart note below). */
const CHART_TRACK_H = 104;

export default function Goals() {
  const { user } = useAuth();
  const router = useRouter();
  const [goals, setGoals] = useState<WeeklyGoals | null>(null);
  const [calories, setCalories] = useState<{ today: number; days: CalorieDay[] }>({
    today: 0,
    days: [],
  });
  const [history, setHistory] = useState<JuiceHistoryEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    api
      .goals(user.id)
      .then((r) => setGoals(r.goals))
      .catch(() => setGoals(null));
    api
      .calories(user.id)
      .then(setCalories)
      .catch(() => setCalories({ today: 0, days: [] }));
    api
      .history(user.id)
      .then((r) => setHistory(r.history))
      .catch(() => setHistory([]));
  }, [user?.id]);

  const progress = goals ? clamp(goals.count / goals.goal, 0, 1) : 0;
  const maxCal = Math.max(1, ...calories.days.map((d) => d.calories));
  const average = Math.round(
    calories.days.reduce((sum, day) => sum + day.calories, 0) / Math.max(1, calories.days.length),
  );

  return (
    <Screen edges={['top']}>
      <AppHeader title={t.goals.title} subtitle={t.goals.subtitle} compact />

      <Reveal style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}
        >
        <Card className="gap-4 border-green bg-green/30">
          <View className="flex-row items-center justify-between">
            <View>
              <Text variant="eyebrow" className="text-green-ink">
                {t.goals.thisWeek}
              </Text>
              <View className="flex-row items-end">
                <Text variant="display" className="text-green-ink">
                  {goals?.count ?? 0}
                </Text>
                <Text variant="h3" className="mb-2 ml-1 text-green-ink">
                  / {goals?.goal ?? 20}
                </Text>
              </View>
            </View>
            <Target size={44} color={colors.greenInk} />
          </View>
          <View className="h-3 w-full overflow-hidden rounded-full bg-white/70">
            <View
              className="h-3 rounded-full bg-green-ink"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </View>
          <Badge label={`${goals?.streakDays ?? 0} ${t.goals.streakSuffix}`} tone="fresh" />
        </Card>

        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.push(appRoute('/calories'))}
            className="flex-1 active:opacity-80"
          >
            <MetricCard
              label={t.goals.today}
              value={`${calories.today} ${t.common.kcal}`}
              icon={<Flame size={16} color={colors.muted} />}
              tone="orange"
            />
          </Pressable>
          <Pressable
            onPress={() => router.push(appRoute('/calories'))}
            className="flex-1 active:opacity-80"
          >
            <MetricCard
              label={t.goals.average}
              value={`${average} ${t.common.kcal}`}
              icon={<TrendingUp size={16} color={colors.muted} />}
              tone="subtle"
            />
          </Pressable>
        </View>

        <Card className="gap-3">
          <SectionHeader
            title={t.goals.weeklyCalories}
            action={t.goals.details}
            onAction={() => router.push(appRoute('/calories'))}
          />
          {/* Bars are sized in absolute px against a fixed track height: percentage
              heights inside a flex parent don't resolve reliably on react-native-web,
              which left the chart blank. Pixel heights render identically web + native. */}
          <View className="flex-row items-end justify-between gap-2">
            {calories.days.map((day) => (
              <View key={day.label} className="flex-1 items-center gap-1">
                <View style={{ height: CHART_TRACK_H, width: '100%', justifyContent: 'flex-end' }}>
                  <View
                    className="w-full rounded-t-md bg-amber/70"
                    style={{ height: Math.max(6, Math.round((day.calories / maxCal) * CHART_TRACK_H)) }}
                  />
                </View>
                <Text variant="caption" className="tracking-normal">
                  {day.label}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <SectionHeader
          title={t.goals.recentJuices}
          action={t.goals.viewAll}
          onAction={() => router.push(appRoute('/history'))}
        />
        <View className="gap-3">
          {history.slice(0, 3).map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() =>
                entry.recipeId
                  ? router.push(`/recipe/${entry.recipeId}`)
                  : router.push(appRoute('/history'))
              }
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
                  <Text variant="caption" className="tracking-normal">
                    {entry.group} · {entry.volumeMl} {t.common.ml} · {entry.calories} {t.common.kcal}
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
        </ScrollView>
      </Reveal>
    </Screen>
  );
}
