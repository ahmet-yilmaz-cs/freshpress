import { ChevronLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { colors } from '@freshpress/design-system';

import { t } from '../../i18n/strings';
import { Text } from './Text';

/** Standard "← Geri" pressable used at the top of pushed screens. */
export function BackBar({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.common.back}
      onPress={onPress}
      className="-ml-1 min-h-[44px] flex-row items-center py-2 active:opacity-70"
    >
      <ChevronLeft size={24} color={colors.muted} />
      <Text variant="body" className="text-muted">
        {t.common.back}
      </Text>
    </Pressable>
  );
}
