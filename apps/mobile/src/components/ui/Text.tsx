import { Text as RNText, type TextProps } from 'react-native';

import { cn } from '../../lib/cn';

type Variant = 'display' | 'h2' | 'h3' | 'body' | 'button' | 'eyebrow' | 'caption';

const variants: Record<Variant, string> = {
  display: 'font-extrabold text-[40px] leading-[48px] tracking-normal text-ink',
  h2: 'font-bold text-[32px] leading-[40px] text-ink',
  h3: 'font-semibold text-[20px] leading-[28px] text-ink',
  body: 'font-sans text-[16px] leading-[24px] text-muted',
  button: 'font-semibold text-[20px] leading-[28px] text-ink',
  eyebrow: 'font-bold text-[12px] leading-[16px] tracking-[0.6px] text-muted',
  caption: 'font-sans text-[10px] leading-[15px] tracking-[1px] text-muted',
};

export function Text({
  variant = 'body',
  className,
  ...props
}: TextProps & { variant?: Variant; className?: string }) {
  return <RNText className={cn(variants[variant], className)} {...props} />;
}
