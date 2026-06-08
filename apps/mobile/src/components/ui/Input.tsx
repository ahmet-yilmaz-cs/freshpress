import { useState } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { cn } from '../../lib/cn';
import { Text } from './Text';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View className="gap-2">
      <Text variant="eyebrow" className="text-muted">
        {label.toUpperCase()}
      </Text>
      <TextInput
        placeholderTextColor="#9b8c80"
        className={cn(
          'h-[56px] rounded-md border bg-card px-4 text-[16px] text-ink font-sans',
          focused ? 'border-amber' : 'border-hairline',
          error && 'border-[#ff453a]',
          className,
        )}
        selectionColor={colors.orange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error ? (
        <Text variant="caption" className="text-[#d23b30] tracking-normal">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
