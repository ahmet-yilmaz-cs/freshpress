import type { VisualTone } from '@freshpress/types';

import { colors } from '@freshpress/design-system';

export function alpha(hex: string, opacity: number) {
  const clean = hex.replace('#', '');
  const value = Number.parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r},${g},${b},${opacity})`;
}

export const tone = {
  orange: {
    icon: colors.orange,
    text: 'text-amber',
    bg: 'bg-orange/10',
    border: 'border-orange/20',
    solid: 'bg-orange',
    // Deeper end stop so white icons/labels meet contrast on the tile.
    gradient: [alpha(colors.orange, 0.85), alpha(colors.amber, 0.95)] as const,
  },
  amber: {
    icon: colors.amber,
    text: 'text-amber',
    bg: 'bg-amber/10',
    border: 'border-border-warm',
    solid: 'bg-amber',
    gradient: [alpha(colors.amber, 0.8), alpha(colors.amberPressed, 0.96)] as const,
  },
  green: {
    icon: colors.greenInk,
    text: 'text-green-ink',
    bg: 'bg-green/30',
    border: 'border-green/60',
    solid: 'bg-green',
    gradient: [alpha(colors.green, 0.85), alpha(colors.greenInk, 0.92)] as const,
  },
  subtle: {
    icon: colors.muted,
    text: 'text-muted',
    bg: 'bg-subtle',
    border: 'border-hairline',
    solid: 'bg-track',
    // Warm gray-brown (not near-white) so a white glyph stays visible when unpaired.
    gradient: [alpha(colors.muted, 0.55), alpha(colors.muted, 0.85)] as const,
  },
} satisfies Record<VisualTone, unknown>;

export function toneFor(value?: VisualTone) {
  return tone[value ?? 'subtle'];
}
