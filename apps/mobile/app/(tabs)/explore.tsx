import type { Recipe, Recommendation, StockItem } from '@freshpress/types';
import { formatDuration } from '@freshpress/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Check, HeartPulse, Plus, Search, ShieldCheck, Sun, Zap } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../../src/api/client';
import { AppHeader } from '../../src/components/AppHeader';
import { BottomSheet } from '../../src/components/BottomSheet';
import { FoodImage } from '../../src/components/FoodImage';
import { SectionHeader } from '../../src/components/FreshPressPrimitives';
import { Reveal } from '../../src/components/Reveal';
import { Button, Card, Input, Screen, Text } from '../../src/components/ui';
import { labels, t } from '../../src/i18n/strings';
import { cn } from '../../src/lib/cn';
import { ingredientImage, recipeImage } from '../../src/lib/foodImages';
import { images } from '../../src/lib/images';
import { alpha, toneFor } from '../../src/lib/visuals';

/**
 * Each Quick Category gets a distinct icon + token-based tint, mirroring the
 * prototype's category chips (every category had its own glyph and colour).
 * Colours stay on design tokens — no hardcoded hex in the screen.
 */
const CATEGORY_META = [
  { label: t.explore.categories.energy, Icon: Zap, color: colors.orange, bg: 'bg-orange/10' },
  { label: t.explore.categories.immunity, Icon: ShieldCheck, color: colors.greenInk, bg: 'bg-green/30' },
  { label: t.explore.categories.glow, Icon: Sun, color: colors.amber, bg: 'bg-yellow/25' },
  { label: t.explore.categories.recovery, Icon: HeartPulse, color: colors.greenDeep, bg: 'bg-green/20' },
] as const;

export default function Explore() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [recipeRes, recRes, stockRes] = await Promise.all([
      api.recipes().catch(() => ({ recipes: [] })),
      api.recommendations().catch(() => ({ recommendations: [] })),
      api.stock().catch(() => ({ stock: [] })),
    ]);
    setRecipes(recipeRes.recipes);
    setRecommendations(recRes.recommendations);
    setStock(stockRes.stock);
  }

  const q = query.trim().toLowerCase();
  const matches = (recipe: Recipe) =>
    (!q ||
      recipe.title.toLowerCase().includes(q) ||
      recipe.description.toLowerCase().includes(q)) &&
    (!activeCategory || recipe.category === activeCategory);
  const customRecipes = recipes.filter((recipe) => recipe.isCustom && matches(recipe));
  const catalogRecipes = recipes.filter((recipe) => !recipe.isCustom && matches(recipe));
  const selectedCalories = useMemo(
    () =>
      selected
        .map((id) => stock.find((item) => item.id === id)?.caloriesPerUnit ?? 0)
        .reduce((total, value) => total + value, 0),
    [selected, stock],
  );

  function toggleIngredient(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  async function saveRecipe() {
    if (!title.trim() || selected.length === 0) return;
    setSaving(true);
    try {
      await api.addRecipe({ title, description, ingredientIds: selected });
      setTitle('');
      setDescription('');
      setSelected([]);
      setSheetOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen edges={['top']}>
      <AppHeader title={t.explore.title} subtitle={t.explore.subtitle} compact />

      <Reveal style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}
        >
          {/* Appetising fresh-produce hero — real photography sets the tone for discovery. */}
          <View className="overflow-hidden rounded-2xl" style={{ height: 150, position: 'relative' }}>
            <Image
              source={images.heroFruits}
              resizeMode="cover"
              style={{ width: '100%', height: '100%' }}
            />
            <LinearGradient
              colors={['transparent', alpha(colors.ink, 0.6)]}
              style={StyleSheet.absoluteFill}
            />
            <View className="absolute inset-x-0 bottom-0 gap-1 p-4">
              <Text variant="eyebrow" className="text-white">
                {t.explore.heroEyebrow}
              </Text>
              <Text variant="h3" className="text-[20px] leading-[26px] text-white">
                {t.explore.heroTitle}
              </Text>
            </View>
          </View>

          <View className="min-h-[52px] flex-row items-center gap-3 rounded-md border border-hairline bg-card px-4">
          <Search size={20} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t.explore.searchPlaceholder}
            placeholderTextColor={colors.muted}
            selectionColor={colors.orange}
            returnKeyType="search"
            className="flex-1 py-3 font-sans text-[15px] text-ink"
          />
        </View>

        <View className="flex-row justify-between">
          {CATEGORY_META.map(({ label, Icon, color, bg }) => {
            const active = activeCategory === label;
            return (
              <Pressable
                key={label}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setActiveCategory((cur) => (cur === label ? null : label))}
                className="w-[22%] items-center gap-2 active:opacity-70"
              >
                <View
                  className={cn(
                    'h-12 w-12 items-center justify-center rounded-full',
                    bg,
                    active && 'border-2 border-amber',
                  )}
                >
                  <Icon size={18} color={color} />
                </View>
                <Text
                  variant="caption"
                  className={cn('text-center tracking-normal', active && 'text-amber')}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SectionHeader title={t.explore.forYou} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 4 }}
        >
          {recommendations.map((item) => (
            <RecommendationCard
              key={item.id}
              recommendation={item}
              onPress={() => item.recipeId && router.push(`/recipe/${item.recipeId}`)}
            />
          ))}
        </ScrollView>

        <SectionHeader title={t.explore.recipes} />
        <View className="gap-3">
          {catalogRecipes.length ? (
            catalogRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
              />
            ))
          ) : (
            <Text variant="body" className="py-2 text-[14px]">
              {t.explore.noResults}
            </Text>
          )}
        </View>

        <SectionHeader title={t.explore.myRecipes} action={t.common.add} onAction={() => setSheetOpen(true)} />
        {customRecipes.length ? (
          <View className="gap-3">
            {customRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
              />
            ))}
          </View>
        ) : (
          <Card className="items-center gap-3 bg-subtle border-border-warm/40">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-card">
              <Plus size={22} color={colors.amber} />
            </View>
            <Text variant="h3" className="text-center text-[17px] leading-[24px]">
              {t.explore.emptyTitle}
            </Text>
            <Text variant="body" className="text-center text-[14px] leading-[20px]">
              {t.explore.emptySubtitle}
            </Text>
            <Button title={t.explore.addRecipe} onPress={() => setSheetOpen(true)} className="w-full" />
          </Card>
        )}
        </ScrollView>
      </Reveal>

      <BottomSheet
        visible={sheetOpen}
        title={t.explore.sheetTitle}
        subtitle={t.explore.sheetSubtitle}
        onClose={() => setSheetOpen(false)}
      >
        <Input
          label={t.explore.fieldTitle}
          value={title}
          onChangeText={setTitle}
          placeholder={t.explore.titlePlaceholder}
          bottomSheet
        />
        <Input
          label={t.explore.fieldDescription}
          value={description}
          onChangeText={setDescription}
          placeholder={t.explore.descPlaceholder}
          multiline
          bottomSheet
          style={{ minHeight: 96, paddingTop: 14, textAlignVertical: 'top' }}
        />
        <Card className="items-center gap-1 bg-orange/10 border-orange/20">
          <Text variant="display" className="text-[30px] leading-[36px] text-amber">
            {selectedCalories || 0}
          </Text>
          <Text variant="caption" className="tracking-normal">
            {t.explore.estimatedKcal}
          </Text>
        </Card>
        <SectionHeader title={t.explore.ingredients} />
        {stock.map((item) => {
          const active = selected.includes(item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => toggleIngredient(item.id)}
              className={cn(
                'flex-row items-center gap-3 rounded-md border bg-card p-3 active:opacity-80',
                active ? 'border-green bg-green/20' : 'border-hairline',
              )}
            >
              <FoodImage source={ingredientImage(item.id, item.name, item.tone)} radius={12} style={{ width: 56, height: 56 }} />
              <View className="min-w-0 flex-1">
                <Text variant="body" className="text-ink" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text variant="caption" className="tracking-normal">
                  {item.caloriesPerUnit} {t.common.kcal} · {item.amount} {labels.unit[item.unit] ?? item.unit}
                </Text>
              </View>
              {active ? (
                <View className="h-7 w-7 items-center justify-center rounded-full bg-green">
                  <Check size={16} color={colors.greenInk} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
        <Button
          title={t.explore.saveRecipe}
          loading={saving}
          disabled={!title.trim() || selected.length === 0}
          onPress={saveRecipe}
          className="mt-2"
        />
      </BottomSheet>
    </Screen>
  );
}

function RecipeCard({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  const tn = toneFor(recipe.tone);
  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      <Card className="flex-row items-center gap-4 p-3">
        <FoodImage source={recipeImage(recipe.id, recipe.tone)} radius={14} style={{ width: 84, height: 84 }} />
        <View className="min-w-0 flex-1 gap-1">
          <Text variant="h3" className="text-[18px] leading-[24px]" numberOfLines={1}>
            {recipe.title}
          </Text>
          <Text variant="body" className="text-[14px] leading-[20px]" numberOfLines={2}>
            {recipe.description}
          </Text>
          <Text variant="eyebrow" className={tn.text}>
            {recipe.calories} {t.common.kcal.toUpperCase()} · {formatDuration(recipe.durationSec)}{' '}
            {t.common.min.toUpperCase()}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

/** Fixed-size carousel card — identical footprint regardless of title/subtitle length. */
function RecommendationCard({
  recommendation,
  onPress,
}: {
  recommendation: Recommendation;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      {/* Image-led card: a full-width photo banner over the copy reads as editorial, not template. */}
      <Card style={{ width: 252, height: 250 }} className="overflow-hidden p-0">
        <FoodImage
          source={recipeImage(recommendation.recipeId, recommendation.tone)}
          radius={0}
          style={{ height: 134 }}
        />
        <View className="flex-1 gap-1 p-4">
          {/* Reserve two lines for the title so subtitles always start at the same baseline. */}
          <View style={{ height: 48 }}>
            <Text variant="h3" className="text-[18px] leading-[24px]" numberOfLines={2}>
              {recommendation.title}
            </Text>
          </View>
          <Text variant="body" className="text-[14px] leading-[20px]" numberOfLines={2}>
            {recommendation.subtitle}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
