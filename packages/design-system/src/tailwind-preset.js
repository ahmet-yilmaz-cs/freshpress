/**
 * Shared NativeWind/Tailwind preset built from FreshPress tokens.
 * Imported by apps/mobile/tailwind.config.js so the whole app stays consistent.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        orange: '#cf6a34',
        yellow: '#e7b24c',
        amber: '#974823',
        'amber-pressed': '#5b2a12',
        'amber-ink': '#5b2a12',
        green: '#b6d98c',
        'green-soft': '#c8e3aa',
        'green-ink': '#33571a',
        'green-deep': '#28461a',
        ink: '#231e1a',
        muted: '#5c4636',
        bg: '#f5efe4',
        card: '#fffdf8',
        subtle: '#efe7d9',
        track: '#e7dccc',
        'border-warm': '#d9bda6',
        hairline: '#ebe2d4',
        danger: '#c0452e',
        'danger-soft': '#f6e0d4',
      },
      borderRadius: {
        md: '12px',
        lg: '16px',
      },
      fontFamily: {
        sans: ['PlusJakartaSans_400Regular'],
        medium: ['PlusJakartaSans_500Medium'],
        semibold: ['PlusJakartaSans_600SemiBold'],
        bold: ['PlusJakartaSans_700Bold'],
        extrabold: ['PlusJakartaSans_800ExtraBold'],
      },
    },
  },
};
