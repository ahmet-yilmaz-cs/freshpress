import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Droplets, Leaf } from 'lucide-react-native';
import { StyleSheet, Pressable, View } from 'react-native';

import { colors } from '@freshpress/design-system';
import type { VisualTone } from '@freshpress/types';

import { cn } from '../lib/cn';
import { toneFor } from '../lib/visuals';
import { Card, Text } from './ui';

export function MetricCard({
  label,
  value,
  icon,
  tone = 'subtle',
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  tone?: VisualTone;
}) {
  const t = toneFor(tone);
  return (
    <Card className={cn('flex-1 gap-2', t.bg, t.border)}>
      <View className="flex-row items-center gap-2">
        {icon}
        <Text variant="eyebrow">{label}</Text>
      </View>
      <Text variant="h3" className="text-[22px] leading-[28px]">
        {value}
      </Text>
    </Card>
  );
}

export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between pt-2">
      <Text variant="eyebrow" className="text-ink">
        {title.toUpperCase()}
      </Text>
      {action && onAction ? (
        <Pressable onPress={onAction} className="active:opacity-70">
          <Text variant="eyebrow" className="text-amber">
            {action.toUpperCase()}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function ListRow({
  title,
  subtitle,
  icon,
  right,
  onPress,
  last = false,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  last?: boolean;
}) {
  const content = (
    <>
      {icon ? (
        <View className="h-10 w-10 items-center justify-center rounded-md bg-subtle">{icon}</View>
      ) : null}
      <View className="min-w-0 flex-1">
        <Text variant="body" className="text-ink" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" className="mt-1 tracking-normal" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ?? (onPress ? <ChevronRight size={18} color={colors.muted} /> : null)}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn(
          'flex-row items-center gap-3 px-5 py-4 active:opacity-70',
          !last && 'border-b border-hairline',
        )}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      className={cn('flex-row items-center gap-3 px-5 py-4', !last && 'border-b border-hairline')}
    >
      {content}
    </View>
  );
}

export function JuiceVisual({
  tone = 'orange',
  label,
  size = 'large',
}: {
  tone?: VisualTone;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}) {
  const t = toneFor(tone);
  const dimension = size === 'small' ? 'h-14 w-14' : size === 'medium' ? 'h-24 w-24' : 'h-36 w-36';
  const iconSize = size === 'small' ? 24 : size === 'medium' ? 34 : 54;

  return (
    <View
      className={cn('items-center justify-center overflow-hidden', dimension)}
      style={{ borderRadius: size === 'small' ? 12 : 16 }}
    >
      <LinearGradient
        colors={[...t.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/30" />
      <View className="absolute -bottom-5 -left-5 h-20 w-20 rounded-full bg-white/20" />
      {tone === 'green' ? (
        <Leaf size={iconSize} color={colors.white} />
      ) : (
        <Droplets size={iconSize} color={colors.white} />
      )}
      {label ? (
        <Text
          variant="eyebrow"
          className="mt-2 px-2 text-center text-white"
          numberOfLines={1}
          style={{ textShadowColor: 'rgba(0,0,0,0.18)', textShadowRadius: 3 }}
        >
          {label.toUpperCase()}
        </Text>
      ) : null}
    </View>
  );
}
