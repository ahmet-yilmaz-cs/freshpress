import { ActivityIndicator, Pressable, type PressableProps, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { cn } from '../../lib/cn';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'fresh' | 'ghost';

const surface: Record<Variant, string> = {
  primary: 'bg-amber',
  secondary: 'bg-card border border-amber/10',
  fresh: 'bg-green',
  ghost: 'bg-transparent',
};

const label: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-amber',
  fresh: 'text-green-ink',
  ghost: 'text-amber',
};

type Props = PressableProps & {
  title: string;
  variant?: Variant;
  loading?: boolean;
  className?: string;
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  className,
  ...props
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={cn(
        'h-[60px] rounded-full items-center justify-center px-6 active:opacity-90',
        surface[variant],
        isDisabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      <View className="flex-row items-center gap-2">
        {loading && (
          <ActivityIndicator color={variant === 'primary' ? colors.white : colors.amber} />
        )}
        <Text variant="button" className={label[variant]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
