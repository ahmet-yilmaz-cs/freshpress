import { useEffect, useRef } from 'react';
import { Animated, Easing, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

/**
 * Smooth mount entrance: content fades in while easing up from `distance` px.
 * Stagger sibling reveals with increasing `delay` for a polished, sequential feel.
 *
 * Built on the RN `Animated` API (not Reanimated) so it renders identically on
 * native and react-native-web, and uses the native driver for 60fps transforms.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 18,
  duration = 460,
  style,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  style?: ViewStyle;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, delay, duration]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [distance, 0],
  });

  return (
    <Animated.View style={[{ opacity: progress, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
