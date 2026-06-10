import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { colors } from '@freshpress/design-system';

import { useAuth } from '../../src/auth/AuthContext';
import { JuiceVisual } from '../../src/components/FreshPressPrimitives';
import { t } from '../../src/i18n/strings';
import { AppleButton, Badge, Button, Screen, Text } from '../../src/components/ui';
import { alpha } from '../../src/lib/visuals';

export default function Welcome() {
  const router = useRouter();
  const { appleSignIn } = useAuth();
  const [appleLoading, setAppleLoading] = useState(false);

  async function onApple() {
    setAppleLoading(true);
    try {
      await appleSignIn();
    } finally {
      setAppleLoading(false);
    }
  }

  return (
    <Screen className="px-5">
      <LinearGradient
        colors={[alpha(colors.orange, 0.08), colors.bg]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.72 }}
        style={{ flex: 1, borderRadius: 12, paddingTop: 8 }}
      >
        <View className="flex-1 px-2">
          <View className="flex-[1.2] items-center justify-end">
            <View className="h-72 w-full items-center justify-center rounded-lg bg-card">
              <JuiceVisual tone="orange" size="large" label="JuiceLab X1" />
            </View>
          </View>

          <View className="flex-1 items-center justify-center gap-6 pt-8">
            <Badge label={t.welcome.badge} tone="fresh" />
            <Text variant="display" className="text-center px-4">
              {t.welcome.title}
            </Text>
            <Text variant="body" className="text-center text-[14px] leading-[20px]">
              {t.welcome.subtitle}
            </Text>
          </View>

          <View className="gap-3 pb-2">
            <Button
              title={t.welcome.getStarted}
              variant="primary"
              onPress={() => router.push('/(auth)/register')}
            />
            <Button
              title={t.welcome.login}
              variant="secondary"
              onPress={() => router.push('/(auth)/login')}
            />
            <AppleButton onPress={onApple} loading={appleLoading} />
          </View>
        </View>
      </LinearGradient>
    </Screen>
  );
}
