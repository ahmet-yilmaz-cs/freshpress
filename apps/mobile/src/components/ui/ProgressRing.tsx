import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@freshpress/design-system';

/**
 * Segmented circular progress ring (Figma "Hazırlanıyor" screen).
 * The ring is drawn as discrete rounded arc segments; segments whose midpoint
 * falls under the current progress are tinted, the rest stay on the track color.
 */
export function ProgressRing({
  progress,
  size = 220,
  strokeWidth = 16,
  segments = 12,
  color = colors.orange,
  trackColor = colors.border,
  children,
}: {
  /** 0..1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  segments?: number;
  color?: string;
  trackColor?: string;
  children?: ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const gapDeg = 14;
  const sweepDeg = 360 / segments - gapDeg;

  function arcPath(startDeg: number, endDeg: number): string {
    const toXY = (deg: number) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return [center + radius * Math.cos(rad), center + radius * Math.sin(rad)] as const;
    };
    const [sx, sy] = toXY(startDeg);
    const [ex, ey] = toXY(endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} 1 ${ex} ${ey}`;
  }

  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {Array.from({ length: segments }, (_, i) => {
          const start = i * (360 / segments) + gapDeg / 2;
          const filled = (i + 0.5) / segments <= clamped;
          return (
            <Path
              key={i}
              d={arcPath(start, start + sweepDeg)}
              stroke={filled ? color : trackColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
      </Svg>
      <View className="absolute inset-0 items-center justify-center">{children}</View>
    </View>
  );
}
