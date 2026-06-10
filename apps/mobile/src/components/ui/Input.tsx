import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useState } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { Text } from './Text';

type Props = TextInputProps & {
  label: string;
  error?: string;
  /** Render Gorhom's BottomSheetTextInput so the sheet stays clear of the keyboard. */
  bottomSheet?: boolean;
};

export function Input({ label, error, style, bottomSheet, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  const Field = bottomSheet ? BottomSheetTextInput : TextInput;
  return (
    <View className="gap-2">
      <Text variant="eyebrow" className="text-muted">
        {label.toUpperCase()}
      </Text>
      <Field
        placeholderTextColor={colors.muted}
        selectionColor={colors.orange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          {
            minHeight: 56,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: error ? colors.danger : focused ? colors.amber : colors.border,
            backgroundColor: colors.card,
            paddingHorizontal: 16,
            fontSize: 16,
            color: colors.ink,
            fontFamily: 'PlusJakartaSans_400Regular',
          },
          style,
        ]}
        {...props}
      />
      {error ? (
        <Text variant="caption" className="text-danger tracking-normal">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
