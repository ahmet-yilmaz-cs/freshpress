import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pause, Play, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { JuiceVisual } from '../src/components/FreshPressPrimitives';
import { Button, Card, Screen, Text } from '../src/components/ui';
import { t } from '../src/i18n/strings';

export default function Juicing() {
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title?: string }>();
  const [pct, setPct] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle breathing pulse — conveys "working" without rotating the square tile.
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    const tick = setInterval(() => {
      if (pausedRef.current) return;
      setPct((current) => {
        const next = Math.min(100, current + 2);
        if (next >= 100) {
          clearInterval(tick);
          router.replace(`/ready?title=${encodeURIComponent(title ?? t.juicing.fallbackTitleCap)}`);
        }
        return next;
      });
    }, 90);

    return () => {
      animation.stop();
      clearInterval(tick);
    };
  }, [router, pulse, title]);

  function togglePause() {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });

  return (
    <Screen className="px-5">
      <View className="flex-1 justify-center gap-6">
        <Card className="items-center gap-5">
          <Animated.View style={{ transform: [{ scale }] }}>
            <JuiceVisual tone="orange" size="large" />
          </Animated.View>
          <View className="items-center gap-2">
            <Text variant="display" className="text-[42px] leading-[48px] text-orange">
              {pct}%
            </Text>
            <Text variant="h3" className="text-center">
              {title ?? t.juicing.fallbackTitle} {t.juicing.preparingSuffix}
            </Text>
            <Text variant="body" className="text-center text-[14px] leading-[20px]">
              {t.juicing.body}
            </Text>
          </View>
          <View className="h-3 w-full overflow-hidden rounded-full bg-track">
            <View className="h-3 rounded-full bg-orange" style={{ width: `${pct}%` }} />
          </View>
        </Card>

        <View className="flex-row gap-3">
          <Pressable
            onPress={togglePause}
            className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-amber active:opacity-80"
          >
            {paused ? (
              <Play size={18} color={colors.white} />
            ) : (
              <Pause size={18} color={colors.white} />
            )}
            <Text variant="button" className="text-white">
              {paused ? t.juicing.resume : t.juicing.pause}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-full border border-border-warm bg-card active:opacity-80"
          >
            <X size={18} color={colors.amber} />
            <Text variant="button" className="text-amber">
              {t.juicing.cancel}
            </Text>
          </Pressable>
        </View>
      </View>
      <View className="pb-6">
        <Button
          title={t.juicing.finishNow}
          variant="secondary"
          onPress={() =>
            router.replace(`/ready?title=${encodeURIComponent(title ?? t.juicing.fallbackTitleCap)}`)
          }
        />
      </View>
    </Screen>
  );
}
