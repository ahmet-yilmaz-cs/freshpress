import type { Recipe, Recommendation } from '@freshpress/types';
import { formatDuration } from '@freshpress/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { HeartPulse, Plus, Search, ShieldCheck, Sun, Zap } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { api } from '../../src/api/client';
import { AppHeader } from '../../src/components/AppHeader';
import { FoodImage } from '../../src/components/FoodImage';
import { SectionHeader } from '../../src/components/FreshPressPrimitives';
import { Reveal } from '../../src/components/Reveal';
import { Button, Card, Screen, Text } from '../../src/components/ui';
import { t } from '../../src/i18n/strings';
import { cn } from '../../src/lib/cn';
import { recipeImage } from '../../src/lib/foodImages';
import { images } from '../../src/lib/images';
import { alpha, toneFor } from '../../src/lib/visuals';

/**
 * Each Quick Category gets a distinct icon + token-based tint, mirroring the
 * prototype's category chips (every category had its own glyph and colour).
 * Colours stay on design tokens — no hardcoded hex in the screen.
 */
const CARD_WIDTH = Dimensions.get('window').width * 0.72;
const CARD_HEIGHT = 189;

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
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  async function load() {
    const [recipeRes, recRes] = await Promise.all([
      api.recipes().catch(() => ({ recipes: [] })),
      api.recommendations().catch(() => ({ recommendations: [] })),
    ]);
    setRecipes(recipeRes.recipes);
    setRecommendations(recRes.recommendations);
  }

  const q = query.trim().toLowerCase();
  const matches = (recipe: Recipe) =>
    (!q ||
      recipe.title.toLowerCase().includes(q) ||
      recipe.description.toLowerCase().includes(q)) &&
    (!activeCategory || recipe.category === activeCategory);
  const customRecipes = recipes.filter((recipe) => recipe.isCustom && matches(recipe));
  const catalogRecipes = recipes.filter((recipe) => !recipe.isCustom && matches(recipe));

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
          {recommendations.map((item) => {
            const recipe = recipes.find((r) => r.id === item.recipeId);
            return (
              <RecommendationCard
                key={item.id}
                recommendation={item}
                recipeName={recipe?.title}
                onPress={() => item.recipeId && router.push(`/recipe/${item.recipeId}`)}
              />
            );
          })}
        </ScrollView>

        <SectionHeader
          title={t.explore.recipes}
          action={t.explore.viewAll}
          onAction={() => router.push('/all-recipes?type=catalog')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 4 }}
        >
          {catalogRecipes.length ? (
            catalogRecipes.map((recipe) => (
              <RecipeCardCompact
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
        </ScrollView>

        <SectionHeader
          title={t.explore.myRecipes}
          action={t.common.add}
          onAction={() => router.push('/add-recipe')}
        />
        {customRecipes.length ? (
          <View className="gap-3">
            {customRecipes.map((recipe) => (
              <MyRecipeCard
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
            <Button title={t.explore.addRecipe} onPress={() => router.push('/add-recipe')} className="w-full" />
          </Card>
        )}
        </ScrollView>
      </Reveal>
    </Screen>
  );
}

function RecipeCardCompact({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      <Card style={{ width: CARD_WIDTH, height: CARD_HEIGHT }} className="overflow-hidden p-0">
        <Image
          source={recipeImage(recipe.id, recipe.tone)}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['transparent', alpha(colors.ink, 0.82)]}
          style={[StyleSheet.absoluteFill, { top: 90 }]}
        />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} className="px-4 pb-4">
          <Text variant="h3" className="text-[17px] leading-[24px] text-white" numberOfLines={2}>
            {recipe.title}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

function MyRecipeCard({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  const tn = toneFor(recipe.tone);
  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      <Card className="flex-row items-center gap-4 p-3">
        <FoodImage source={recipeImage(recipe.id, recipe.tone)} radius={12} style={{ width: 72, height: 72 }} />
        <View className="min-w-0 flex-1 gap-1">
          <Text variant="h3" className="text-[17px] leading-[24px]" numberOfLines={1}>
            {recipe.title}
          </Text>
          <Text variant="body" className="text-[13px] leading-[18px]" numberOfLines={1}>
            {recipe.description}
          </Text>
          <Text variant="eyebrow" className={tn.text}>
            {recipe.calories} {t.common.kcal.toUpperCase()} · {formatDuration(recipe.durationSec)} {t.common.min.toUpperCase()}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

function RecommendationCard({
  recommendation,
  recipeName,
  onPress,
}: {
  recommendation: Recommendation;
  recipeName?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      <Card style={{ width: CARD_WIDTH, height: CARD_HEIGHT }} className="overflow-hidden p-0">
        <Image
          source={recipeImage(recommendation.recipeId, recommendation.tone)}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['transparent', alpha(colors.ink, 0.82)]}
          style={[StyleSheet.absoluteFill, { top: 90 }]}
        />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} className="px-4 pb-4">
          <Text variant="h3" className="text-[17px] leading-[24px] text-white" numberOfLines={2}>
            {recipeName ?? recommendation.title}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
