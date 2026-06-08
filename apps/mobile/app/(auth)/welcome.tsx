import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, View } from 'react-native';

import { useAuth } from '../../src/auth/AuthContext';
import { AppleButton, Badge, Button, Screen, Text } from '../../src/components/ui';

/** Welcome / onboarding — Figma frame "Hoş Geldiniz" (39:410). */
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
        colors={['rgba(255,130,0,0.05)', '#f9f9f9']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.7 }}
        style={{ flex: 1, borderRadius: 12, paddingTop: 8 }}
      >
        <View className="flex-1 px-2">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=900',
            }}
            className="w-full aspect-square rounded-[52px]"
            resizeMode="cover"
          />

          <View className="flex-1 justify-center items-center gap-6 pt-8">
            <Badge label="● SMART JUICING" tone="fresh" />
            <Text variant="display" className="text-center px-4">
              Freshness in{'\n'}every drop.
            </Text>
          </View>

          <View className="gap-4 pb-2">
            <Button title="Get Started" variant="primary" onPress={() => router.push('/(auth)/register')} />
            <Button title="Log In" variant="secondary" onPress={() => router.push('/(auth)/login')} />
            <AppleButton onPress={onApple} loading={appleLoading} />
          </View>
        </View>
      </LinearGradient>
    </Screen>
  );
}
