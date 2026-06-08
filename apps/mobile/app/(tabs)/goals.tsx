import type { CalorieDay, JuiceHistoryEntry, WeeklyGoals } from '@freshpress/types';
import { clamp } from '@freshpress/utils';
import { Flame } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { api } from '../../src/api/client';
import { useAuth } from '../../src/auth/AuthContext';
import { Badge, Card, Screen, Text } from '../../src/components/ui';

/** Goals / Hedefler — weekly stats (39:473) + calorie counter (39:659). */
export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<WeeklyGoals | null>(null);
  const [calories, setCalories] = useState<{ today: number; days: CalorieDay[] }>({
    today: 0,
    days: [],
  });
  const [history, setHistory] = useState<JuiceHistoryEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    api.goals(user.id).then((r) => setGoals(r.goals)).catch(() => setGoals(null));
    api.calories(user.id).then(setCalories).catch(() => setCalories({ today: 0, days: [] }));
    api.history(user.id).then((r) => setHistory(r.history)).catch(() => setHistory([]));
  }, [user?.id]);

  const progress = goals ? clamp(goals.count / goals.goal, 0, 1) : 0;
  const maxCal = Math.max(1, ...calories.days.map((d) => d.calories));

  return (
    <Screen edges={['top']} className="px-5">
      <Text variant="display" className="py-4">
        Goals
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        {/* Weekly progress */}
        <Card className="border-green bg-green/30">
          <Text variant="eyebrow" className="text-green-ink">
            THIS WEEK
          </Text>
          <View className="flex-row items-end">
            <Text variant="display" className="text-green-ink">
              {goals?.count ?? 0}
            </Text>
            <Text variant="h3" className="mb-2 ml-1 text-green-ink">
              / {goals?.goal ?? 20} juices
            </Text>
          </View>
          {/* progress bar */}
          <View className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/60">
            <View
              className="h-3 rounded-full bg-green-ink"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </View>
          <View className="mt-3 flex-row items-center gap-2">
            <Badge label={`🔥 ${goals?.streakDays ?? 0} DAY STREAK`} tone="fresh" />
            <Text variant="caption" className="tracking-normal">
              {Math.round(progress * 100)}% of weekly goal
            </Text>
          </View>
        </Card>

        {/* Calories today */}
        <Card>
          <View className="flex-row items-center gap-1">
            <Flame size={16} color="#574235" />
            <Text variant="eyebrow">CALORIES TODAY</Text>
          </View>
          <Text variant="display" className="mt-1">
            {calories.today}
          </Text>

          {/* weekly calorie chart */}
          <View className="mt-4 h-32 flex-row items-end justify-between gap-2">
            {calories.days.map((d) => (
              <View key={d.label} className="flex-1 items-center gap-1">
                <View className="w-full flex-1 justify-end">
                  <View
                    className="w-full rounded-t-md bg-orange"
                    style={{ height: `${Math.round((d.calories / maxCal) * 100)}%` }}
                  />
                </View>
                <Text variant="caption" className="tracking-normal">
                  {d.label}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Recent history */}
        <Text variant="eyebrow" className="pt-2">
          RECENT JUICES
        </Text>
        {history.map((h) => (
          <Card key={h.id} className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text variant="h3" className="text-[16px] leading-[22px]">
                {h.title}
              </Text>
              <Text variant="caption" className="tracking-normal">
                {h.group} · {h.volumeMl} ml · {h.calories} kcal
              </Text>
            </View>
            <Badge
              label={h.quality.toUpperCase()}
              tone={h.quality === 'excellent' ? 'fresh' : h.quality === 'good' ? 'amber' : 'dark'}
            />
          </Card>
        ))}
        {history.length === 0 && (
          <Text variant="caption" className="tracking-normal">
            No juices yet — make your first one!
          </Text>
        )}
      </ScrollView>
    </Screen>
  );
}
