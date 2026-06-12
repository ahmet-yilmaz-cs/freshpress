import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { alpha } from '../lib/visuals';
import { images } from '../lib/images';
import { Text } from './ui';

/**
 * Real product photo of the juicer in a rounded tile — used wherever the physical
 * device is represented (home, pairing, device info). Replaces the abstract gradient
 * placeholder so the device reads as a real product. An optional status label sits on
 * a bottom scrim; `dimmed` greys the photo when the device is offline.
 */
export function DeviceImage({
  size = 128,
  radius = 18,
  label,
  dimmed = false,
}: {
  size?: number;
  radius?: number;
  label?: string;
  dimmed?: boolean;
}) {
  return (
    <View
      className="overflow-hidden"
      style={{ width: size, height: size, borderRadius: radius, position: 'relative' }}
    >
      <Image source={images.device} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
      <LinearGradient
        colors={['transparent', alpha(colors.ink, label ? 0.55 : 0.2)]}
        style={StyleSheet.absoluteFill}
      />
      {dimmed ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: alpha(colors.bg, 0.45) }]} />
      ) : null}
      {label ? (
        <View className="absolute inset-x-0 bottom-0 items-center px-1.5 pb-2">
          <Text
            variant="eyebrow"
            className="text-center text-white"
            numberOfLines={1}
            style={{ textShadowColor: alpha(colors.black, 0.35), textShadowRadius: 4 }}
          >
            {label}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
