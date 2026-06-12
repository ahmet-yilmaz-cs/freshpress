import { ActivityIndicator, Pressable } from 'react-native';

import { colors } from '@freshpress/design-system';

import { t } from '../../i18n/strings';
import { cn } from '../../lib/cn';
import { AppleLogo } from './AppleLogo';
import { Text } from './Text';

/** Mock "Continue with Apple" — black pill with the official Apple logo. */
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
      accessibilityLabel={t.welcome.apple}
      disabled={loading}
      onPress={onPress}
      className={cn(
        'h-[54px] flex-row items-center justify-center gap-2.5 rounded-full bg-black px-6 active:opacity-90',
        loading && 'opacity-60',
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <AppleLogo size={20} color={colors.white} />
      )}
      <Text variant="button" className="text-white">
        {t.welcome.apple}
      </Text>
    </Pressable>
  );
}
