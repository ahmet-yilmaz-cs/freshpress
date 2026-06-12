import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChartColumn, Check, Lightbulb } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { Reveal } from '../src/components/Reveal';
import { BackBar, Badge, Button, Card, Screen, Text } from '../src/components/ui';
import { t } from '../src/i18n/strings';
import { images } from '../src/lib/images';
import { appRoute } from '../src/lib/route';
import { alpha } from '../src/lib/visuals';
import { cn } from '../src/lib/cn';

export default function Ready() {
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title?: string }>();
  // Calories are auto-logged when the juice finishes (prototype behavior); Undo reverts.
  const [logged, setLogged] = useState(true);

  return (
    <Screen className="px-5">
      {/* Full-screen celebratory wash: peach fading into pale green (prototype). */}
      <LinearGradient
        colors={[alpha(colors.orange, 0.12), alpha(colors.green, 0.14)]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, { marginHorizontal: -20 }]}
      />
      <BackBar onPress={() => router.back()} />
      <Reveal style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 18, paddingBottom: 16, paddingTop: 8 }}
        >
        <View className="items-center gap-5">
          <Badge label={`✓ ${t.ready.badge}`} tone="fresh" />

          {/* Hero: the finished drink, real photo in a circle with a soft white ring. */}
          <View
            className="overflow-hidden rounded-full border-4 border-card"
            style={{
              width: 200,
              height: 200,
              shadowColor: colors.black,
              shadowOpacity: 0.12,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 6,
            }}
          >
            <Image
              source={images.readyDrink}
              resizeMode="cover"
              style={{ width: '100%', height: '100%' }}
            />
          </View>

          <View className="items-center gap-2 px-3">
            <Text variant="h2" className="text-center text-[26px] leading-[32px]">
              {title ?? t.ready.fallbackTitle} {t.ready.readySuffix}
            </Text>
            <Text variant="body" className="text-center text-[14px] leading-[20px]">
              {t.ready.bodyIntro}
            </Text>
          </View>

          {/* Pro-tip — a clean inline card below the hero (no overlap). */}
          <Card className="w-full flex-row items-start gap-3 border-border-warm bg-yellow/20">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-yellow/40">
              <Lightbulb size={16} color={colors.amber} />
            </View>
            <View className="min-w-0 flex-1 gap-0.5">
              <Text variant="eyebrow" className="text-amber">
                {t.ready.proTip}
              </Text>
              <Text variant="caption" className="tracking-normal text-ink">
                {t.ready.proTipBody}
              </Text>
            </View>
          </Card>

          {/* Auto-log confirmation with inline Undo (prototype behavior). */}
          <Pressable
            accessibilityRole="button"
            onPress={() => setLogged((value) => !value)}
            className={cn(
              'w-full flex-row items-center justify-center gap-2 rounded-md px-4 py-3 active:opacity-80',
              logged ? 'bg-green/30' : 'bg-subtle',
            )}
          >
            {logged ? <Check size={15} color={colors.greenDeep} /> : null}
            <Text
              variant="body"
              className={cn('text-[13px] font-semibold', logged ? 'text-green-deep' : 'text-muted')}
            >
              {logged ? `164 ${t.ready.loggedBox} · ` : t.ready.notLoggedBox}
            </Text>
            {logged ? (
              <Text variant="body" className="text-[13px] font-semibold text-amber underline">
                {t.ready.undo}
              </Text>
            ) : null}
          </Pressable>
        </View>
        </ScrollView>
      </Reveal>

      <View className="gap-3 pb-4 pt-2">
        <Button title={t.ready.newDrink} onPress={() => router.replace('/(tabs)')} />
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(appRoute('/calories'))}
          className="h-[54px] flex-row items-center justify-center gap-2 rounded-full bg-card active:opacity-80"
          style={{
            shadowColor: colors.black,
            shadowOpacity: 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <ChartColumn size={18} color={colors.ink} />
          <Text variant="button" className="text-[18px] text-ink">
            {t.ready.calorieDetails}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
