import { Apple } from 'lucide-react-native';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { cn } from '../../lib/cn';
import { Text } from './Text';

/** Mock "Continue with Apple" — black pill with the Apple glyph. */
export function AppleButton({
  onPress,
  loading = false,
  className,
}: {
  onPress: () => void;
  loading?: boolean;
  className?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={loading}
      onPress={onPress}
      className={cn(
        'h-[60px] flex-row items-center justify-center gap-2 rounded-full bg-black px-6 active:opacity-90',
        loading && 'opacity-60',
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Apple size={22} color="#fff" fill="#fff" />
      )}
      <Text variant="button" className="text-white">
        Continue with Apple
      </Text>
    </Pressable>
  );
}
