import { LinearGradient } from 'expo-linear-gradient';
import { Image, type ImageSourcePropType, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '@freshpress/design-system';

import { alpha } from '../lib/visuals';
import { Text } from './ui';

/**
 * Real food photo in a rounded tile — the content counterpart to DeviceImage.
 * `style` sets the footprint (square via width+height, or a full-width banner via
 * just height). An optional label rides a bottom scrim for legibility.
 */
export function FoodImage({
  source,
  label,
  radius = 16,
  style,
}: {
  source: ImageSourcePropType;
  label?: string;
  radius?: number;
  style?: ViewStyle;
}) {
  return (
    <View className="overflow-hidden" style={[{ borderRadius: radius, position: 'relative' }, style]}>
      <Image source={source} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
      {label ? (
        <>
          <LinearGradient
            colors={['transparent', alpha(colors.ink, 0.55)]}
            style={StyleSheet.absoluteFill}
          />
          <View className="absolute inset-x-0 bottom-0 px-3 pb-2">
            <Text
              variant="eyebrow"
              className="text-white"
              numberOfLines={1}
              style={{ textShadowColor: alpha(colors.black, 0.4), textShadowRadius: 4 }}
            >
              {label}
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}
