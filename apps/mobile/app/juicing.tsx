import type { ExtractionSpeed, JuicingIngredient, JuicingSession } from '@freshpress/types';
import { clamp } from '@freshpress/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Gauge, Pause, Play, Timer, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../src/api/client';
import { useAuth } from '../src/auth/AuthContext';
import { FoodImage } from '../src/components/FoodImage';
import { Reveal } from '../src/components/Reveal';
import { Badge, Button, Card, ProgressRing, Screen, Text } from '../src/components/ui';
import { labels, t, upperTr } from '../src/i18n/strings';
import { ingredientImage } from '../src/lib/foodImages';
import { cn } from '../src/lib/cn';

const TICK_MS = 120;

function formatRemaining(pct: number): string {
  const seconds = Math.ceil(((100 - pct) * TICK_MS) / 1000);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function Juicing() {
  const router = useRouter();
  const { user } = useAuth();
  const { title, recipeId } = useLocalSearchParams<{ title?: string; recipeId?: string }>();
  const [pct, setPct] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [session, setSession] = useState<JuicingSession | null>(null);
  const [speed, setSpeed] = useState<ExtractionSpeed>('medium');
  const [recipeIngredients, setRecipeIngredients] = useState<JuicingIngredient[] | null>(null);
  const [recipeBenefits, setRecipeBenefits] = useState<string[] | null>(null);

  useEffect(() => {
    api
      .juicingSession()
      .then((res) => setSession(res.session))
      .catch(() => setSession(null));
    if (user) {
      api
        .device(user.id)
        .then((res) => setSpeed(res.device.speed))
        .catch(() => {});
    }
    if (recipeId) {
      Promise.all([
        api.recipe(recipeId).catch(() => ({ recipe: null })),
        api.stock().catch(() => ({ stock: [] })),
      ]).then(([recipeRes, stockRes]) => {
        const recipe = recipeRes.recipe;
        if (!recipe) return;
        const stockMap = new Map(stockRes.stock.map((s) => [s.name.toLowerCase(), s]));
        const mapped: JuicingIngredient[] = recipe.ingredients.map((name, index) => {
          const baseName = name.replace(/\s*\(\d+\)$/, '').trim();
          const stockItem = stockMap.get(baseName.toLowerCase());
          return stockItem
            ? { id: stockItem.id, name: stockItem.name, tone: stockItem.tone }
            : { id: `ri-${index}`, name: baseName, tone: recipe.tone };
        });
        setRecipeIngredients(mapped);
        setRecipeBenefits(recipe.benefits);
      });
    }
  }, [user?.id, recipeId]);

  useEffect(() => {
    const tick = setInterval(() => {
      if (pausedRef.current) return;
      setPct((current) => {
        const next = Math.min(100, current + 1);
        if (next >= 100) {
          clearInterval(tick);
          router.replace(`/ready?title=${encodeURIComponent(title ?? t.juicing.fallbackTitleCap)}`);
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(tick);
  }, [router, title]);

  function togglePause() {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }

  const ingredients = recipeIngredients ?? session?.ingredients ?? [];
  const benefits = recipeBenefits ?? session?.benefits ?? [];
  const window = ingredients.length ? 100 / ingredients.length : 100;
  const rpm = session?.rpmBySpeed[speed] ?? 80;

  return (
    <Screen edges={['top']} className="px-5">
      <View className="flex-row items-center justify-between pb-3 pt-1">
        <Text variant="h2" className="text-amber">
          FreshPress
        </Text>
        <Text variant="h3" className="text-[16px] leading-[22px] text-muted">
          {title ?? t.juicing.fallbackTitleCap}
        </Text>
      </View>

      <Reveal style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
        >
        <Card className="items-center gap-6 py-7">
          <ProgressRing progress={pct / 100} size={216} strokeWidth={15}>
            <Text variant="display" className="text-[44px] leading-[52px]">
              {pct}%
            </Text>
            <View className="flex-row items-center gap-1">
              <Timer size={14} color={colors.muted} />
              <Text variant="eyebrow" className="text-muted">
                {formatRemaining(pct)} {t.juicing.remaining}
              </Text>
            </View>
          </ProgressRing>

          <View className="flex-row gap-3">
            <Pressable
              accessibilityRole="button"
              onPress={togglePause}
              className="h-12 flex-row items-center justify-center gap-2 rounded-full bg-amber px-6 active:opacity-80"
            >
              {paused ? (
                <Play size={16} color={colors.white} />
              ) : (
                <Pause size={16} color={colors.white} />
              )}
              <Text variant="button" className="text-[16px] text-white">
                {paused ? t.juicing.resume : t.juicing.pause}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/(tabs)')}
              className="h-12 flex-row items-center justify-center gap-2 rounded-full bg-subtle px-6 active:opacity-80"
            >
              <X size={16} color={colors.muted} />
              <Text variant="button" className="text-[16px] text-muted">
                {t.juicing.cancel}
              </Text>
            </Pressable>
          </View>
        </Card>

        <Card className="flex-row items-center gap-3 py-4">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-orange/10">
            <Gauge size={20} color={colors.amber} />
          </View>
          <View>
            <Text variant="eyebrow" className="text-muted">
              {t.juicing.speedSetting}
            </Text>
            <Text variant="h3" className="text-[17px] leading-[24px]">
              {labels.speed[speed]} · {rpm} {t.juicing.rpm}
            </Text>
          </View>
        </Card>

        <View className="gap-3">
          <Text variant="eyebrow" className="text-ink">
            {upperTr(t.juicing.currentIngredients)}
          </Text>
          {ingredients.map((ingredient, index) => {
            const start = index * window;
            const progress = clamp((pct - start) / window, 0, 1);
            const done = progress >= 1;
            const active = !done && progress > 0;
            return (
              <Card
                key={ingredient.id}
                className={cn('flex-row items-center gap-3 p-3', active && 'border-orange/40')}
              >
                <FoodImage source={ingredientImage(ingredient.id, ingredient.name, ingredient.tone)} radius={12} style={{ width: 56, height: 56 }} />
                <View className="min-w-0 flex-1 gap-2">
                  <Text variant="body" className="text-ink" numberOfLines={1}>
                    {ingredient.name}
                  </Text>
                  <View className="h-1.5 w-full overflow-hidden rounded-full bg-track">
                    <View
                      className={cn('h-1.5 rounded-full', done ? 'bg-green-ink' : 'bg-orange')}
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </View>
                </View>
                {done ? (
                  <View className="h-7 w-7 items-center justify-center rounded-full bg-green">
                    <Check size={15} color={colors.greenInk} />
                  </View>
                ) : active ? (
                  <Badge label={t.juicing.active} tone="amber" />
                ) : null}
              </Card>
            );
          })}
        </View>

        {benefits.length ? (
          <Card className="gap-3 bg-green/20 border-green/50">
            <Text variant="eyebrow" className="text-green-ink">
              {upperTr(t.juicing.extractedBenefits)}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {benefits.map((benefit, index) => (
                <Badge
                  key={benefit}
                  label={benefit.toUpperCase()}
                  tone={index % 2 ? 'amber' : 'fresh'}
                />
              ))}
            </View>
          </Card>
        ) : null}

        <Button
          title={t.juicing.finishNow}
          variant="secondary"
          onPress={() =>
            router.replace(`/ready?title=${encodeURIComponent(title ?? t.juicing.fallbackTitleCap)}`)
          }
        />
        </ScrollView>
      </Reveal>
    </Screen>
  );
}
