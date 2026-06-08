import { View, type ViewProps } from 'react-native';

import { cn } from '../../lib/cn';

export function Card({ className, ...props }: ViewProps & { className?: string }) {
  return (
    <View
      className={cn('bg-card rounded-md border border-hairline p-5', className)}
      {...props}
    />
  );
}
