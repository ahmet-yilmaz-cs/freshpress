import { View } from 'react-native';

import { cn } from '../../lib/cn';
import { Text } from './Text';

type Tone = 'fresh' | 'amber' | 'dark';

const tones: Record<Tone, { bg: string; text: string }> = {
  fresh: { bg: 'bg-green-soft', text: 'text-green-deep' },
  amber: { bg: 'bg-amber/10', text: 'text-amber' },
  dark: { bg: 'bg-amber-ink', text: 'text-white' },
};

export function Badge({
  label,
  tone = 'fresh',
  className,
}: {
  label: string;
  tone?: Tone;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <View className={cn('flex-row items-center self-start rounded-full px-3 py-1', t.bg, className)}>
      <Text variant="eyebrow" className={t.text}>
        {label}
      </Text>
    </View>
  );
}
