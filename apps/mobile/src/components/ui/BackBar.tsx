import { ChevronLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { Text } from './Text';

/** Standard "← Back" pressable used at the top of pushed screens. */
export function BackBar({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center py-2 -ml-1 active:opacity-70">
      <ChevronLeft size={24} color="#574235" />
      <Text variant="body" className="text-muted">
        Back
      </Text>
    </Pressable>
  );
}
