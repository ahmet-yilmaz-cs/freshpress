/**
 * Shared NativeWind/Tailwind preset built from FreshPress tokens.
 * Imported by apps/mobile/tailwind.config.js so the whole app stays consistent.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        orange: '#ff8200',
        amber: '#954a00',
        'amber-pressed': '#5f2c00',
        'amber-ink': '#5f2d01',
        green: '#91f68d',
        'green-soft': '#94f990',
        'green-ink': '#00721e',
        'green-deep': '#005313',
        ink: '#1a1c1c',
        muted: '#574235',
        bg: '#f9f9f9',
        card: '#ffffff',
        subtle: '#f3f3f4',
        track: '#e2e2e2',
        'border-warm': '#dec1af',
        hairline: '#eeeeee',
        danger: '#d23b30',
        'danger-soft': '#ffe9e5',
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
