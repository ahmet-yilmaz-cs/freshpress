import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';

import { Screen, Text } from '../src/components/ui';

/** Preparing flow — Figma frame "Hazırlanıyor..." (11:488). Animated progress → Ready. */
export default function Juicing() {
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title?: string }>();
  const [pct, setPct] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    const start = Date.now();
    const total = 3200; // ms
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const next = Math.min(100, Math.round((elapsed / total) * 100));
      setPct(next);
      if (next >= 100) {
        clearInterval(tick);
        router.replace(`/ready?title=${encodeURIComponent(title ?? 'Your Juice')}`);
      }
    }, 60);

    return () => clearInterval(tick);
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Screen className="items-center justify-center px-8">
      <Animated.View
        style={{ transform: [{ rotate }] }}
        className="h-44 w-44 items-center justify-center rounded-full border-4 border-orange border-t-track"
      >
        <View className="h-32 w-32 items-center justify-center rounded-full bg-orange/10">
          <Text variant="h2" className="text-orange">
            {pct}%
          </Text>
        </View>
      </Animated.View>

      <Text variant="h2" className="mt-10 text-center">
        Preparing…
      </Text>
      <Text variant="body" className="mt-2 text-center">
        Pressing your {title ?? 'juice'}. Hang tight.
      </Text>

      <View className="mt-8 h-3 w-full overflow-hidden rounded-full bg-track">
        <View className="h-3 rounded-full bg-orange" style={{ width: `${pct}%` }} />
      </View>
    </Screen>
  );
}
