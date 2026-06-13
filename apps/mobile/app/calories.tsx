import type { CalorieDay, JuiceHistoryEntry } from '@freshpress/types';
import { useRouter } from 'expo-router';
import { Flame, PieChart } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../src/api/client';
import { useAuth } from '../src/auth/AuthContext';
import { JuiceVisual, MetricCard, SectionHeader } from '../src/components/FreshPressPrimitives';
import { Reveal } from '../src/components/Reveal';
import { BackBar, Card, Screen, Text } from '../src/components/ui';
import { t } from '../src/i18n/strings';

/** Fixed pixel height of the week-trend bar track (percentage heights inside a flex
 *  parent don't resolve on react-native-web, leaving the chart blank). */
const CHART_TRACK_H = 104;

export default function Calories() {
  const router = useRouter();
  const { user } = useAuth();
  const [calories, setCalories] = useState<{ today: number; days: CalorieDay[] }>({
    today: 0,
    days: [],
  });
  const [history, setHistory] = useState<JuiceHistoryEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    api
      .calories(user.id)
      .then(setCalories)
      .catch(() => setCalories({ today: 0, days: [] }));
    api
      .history(user.id)
      .then((r) => setHistory(r.history))
      .catch(() => setHistory([]));
  }, [user?.id]);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const todayEntries = history.filter((entry) => entry.group === t.groups.today);
  const maxCal = Math.max(1, ...calories.days.map((day) => day.calories));

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
            {t.calories.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]">
            {t.calories.subtitle}
          </Text>
        </View>

        <Card className="items-center gap-3 bg-orange/10 border-orange/20">
          <View className="h-32 w-32 items-center justify-center rounded-full bg-card">
            <Flame size={36} color={colors.orange} />
            <Text variant="display" className="text-[34px] leading-[40px] text-amber">
              {calories.today}
            </Text>
          </View>
          <Text variant="eyebrow" className="text-amber">
            {t.calories.totalToday}
          </Text>
        </Card>

        <View className="flex-row gap-3">
          <MetricCard
            label={t.calories.drinks}
            value={`${todayEntries.length}`}
            icon={<PieChart size={16} color={colors.muted} />}
            tone="subtle"
          />
          <MetricCard
            label={t.calories.average}
            value={`${Math.round(calories.today / Math.max(1, todayEntries.length))} ${t.common.kcal}`}
            icon={<Flame size={16} color={colors.muted} />}
            tone="orange"
          />
        </View>

        <Card className="gap-3">
          <SectionHeader title={t.calories.weekTrend} />
          <View>
            <View className="flex-row justify-between gap-2" style={{ marginBottom: 2 }}>
              {calories.days.map((day) => (
                <View key={day.label} className="flex-1 items-center" style={{ height: 16 }}>
                  {selectedDay === day.label && day.calories > 0 && (
                    <Text
                      variant="caption"
                      className="text-orange tracking-normal"
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
                        className={`w-full rounded-t-md ${isSelected ? 'bg-orange' : 'bg-orange/60'}`}
                        style={{ height: Math.max(6, Math.round((day.calories / maxCal) * CHART_TRACK_H)) }}
                      />
                    </View>
                    <Text
                      variant="caption"
                      className={`tracking-normal ${isSelected ? 'text-orange' : ''}`}
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

        <SectionHeader title={t.calories.todaysDrinks} />
        {todayEntries.map((entry) => (
          <Pressable
            key={entry.id}
            disabled={!entry.recipeId}
            onPress={() => entry.recipeId && router.push(`/recipe/${entry.recipeId}`)}
            className="active:opacity-80"
          >
            <Card className="flex-row items-center gap-3 p-3">
              <JuiceVisual tone={entry.quality === 'excellent' ? 'green' : 'orange'} size="small" />
              <View className="min-w-0 flex-1">
                <Text variant="body" className="text-ink" numberOfLines={1}>
                  {entry.title}
                </Text>
                <Text variant="caption" className="tracking-normal" numberOfLines={1}>
                  {entry.volumeMl} {t.common.ml} · {entry.ingredients.join(', ')}
                </Text>
              </View>
              <Text variant="eyebrow" className="text-amber">
                {entry.calories} {t.common.kcal.toUpperCase()}
              </Text>
            </Card>
          </Pressable>
        ))}
        </ScrollView>
      </Reveal>
    </Screen>
  );
}
