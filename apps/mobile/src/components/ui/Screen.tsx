import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '../../lib/cn';

/** Page wrapper with the FreshPress background + safe-area insets. */
export function Screen({
  children,
  className,
  edges = ['top', 'bottom'],
}: {
  children: ReactNode;
  className?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}) {
  return (
    <SafeAreaView edges={edges} className="flex-1 bg-bg">
      <View className={cn('flex-1', className)}>{children}</View>
    </SafeAreaView>
  );
}
