import type { CalorieDay, JuiceHistoryEntry, WeeklyGoals } from '@freshpress/types';
import { useFocusEffect, useRouter } from 'expo-router';
import { Flame, TrendingUp } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../../src/api/client';
import { useAuth } from '../../src/auth/AuthContext';
import { AppHeader } from '../../src/components/AppHeader';
import { JuiceVisual, MetricCard, SectionHeader } from '../../src/components/FreshPressPrimitives';
import { Reveal } from '../../src/components/Reveal';
import { Card, Screen, Text } from '../../src/components/ui';
import { t } from '../../src/i18n/strings';
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

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      api.goals(user.id).then((r) => setGoals(r.goals)).catch(() => setGoals(null));
      api.calories(user.id).then(setCalories).catch(() => setCalories({ today: 0, days: [] }));
      api.history(user.id).then((r) => setHistory(r.history)).catch(() => setHistory([]));
    }, [user?.id]),
  );

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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
        <Card className="gap-3 border-green bg-green/30">
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Text variant="eyebrow" className="text-green-ink">
                {t.goals.streakSuffix}
              </Text>
              <View className="flex-row items-end">
                <Text variant="display" className="text-green-ink">
                  {goals?.streakDays ?? 0}
                </Text>
                <Text variant="h3" className="mb-2 ml-1 text-green-ink">
                  gün
                </Text>
              </View>
            </View>
            <Flame size={44} color={colors.greenInk} />
          </View>
          <Text variant="caption" className="text-green-ink/80 tracking-normal">
            {t.goals.thisWeek.toLowerCase()} {goals?.count ?? 0} sıkım yapıldı
          </Text>
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
          {/* Bars sized in absolute px — tap a bar to reveal its kcal value above it. */}
          <View>
            <View className="flex-row justify-between gap-2" style={{ marginBottom: 2 }}>
              {calories.days.map((day) => (
                <View key={day.label} className="flex-1 items-center" style={{ height: 16 }}>
                  {selectedDay === day.label && day.calories > 0 && (
                    <Text
                      variant="caption"
                      className="text-amber tracking-normal"
                      style={{ fontSize: 9, fontWeight: '700' }}
                    >
                      {day.calories} kcal
                    </Text>
                  )}
                </View>
              ))}
            </View>
            <View className="flex-row items-end justify-between gap-2">
              {calories.days.map((day) => {
                const isSelected = selectedDay === day.label;
                return (
                  <TouchableOpacity
                    key={day.label}
                    activeOpacity={0.75}
                    onPress={() => setSelectedDay((cur) => (cur === day.label ? null : day.label))}
                    className="flex-1 items-center gap-1"
                  >
                    <View style={{ height: CHART_TRACK_H, width: '100%', justifyContent: 'flex-end' }}>
                      <View
                        className={`w-full rounded-t-md ${isSelected ? 'bg-amber' : 'bg-amber/70'}`}
                        style={{ height: Math.max(6, Math.round((day.calories / maxCal) * CHART_TRACK_H)) }}
                      />
                    </View>
                    <Text
                      variant="caption"
                      className={`tracking-normal ${isSelected ? 'text-amber' : ''}`}
                      style={isSelected ? { fontWeight: '700' } : undefined}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Card>

        <SectionHeader
          title={t.goals.recentJuices}
          action={t.goals.viewAll}
          onAction={() => router.push(appRoute('/history'))}
        />
        <View className="gap-3">
          {history.slice(0, 2).map((entry) => (
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
              </Card>
            </Pressable>
          ))}
        </View>
        </ScrollView>
      </Reveal>
    </Screen>
  );
}
